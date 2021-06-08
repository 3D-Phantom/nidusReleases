"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlRPackageManageProvider = void 0;
const azdata = require("azdata");
const packageManageProviderBase_1 = require("./packageManageProviderBase");
const constants = require("../common/constants");
const utils = require("../common/utils");
/**
 * Manage Package Provider for r packages inside SQL server databases
 */
class SqlRPackageManageProvider extends packageManageProviderBase_1.SqlPackageManageProviderBase {
    /**
     * Creates new a instance
     */
    constructor(_outputChannel, apiWrapper, _service, _processService, _config, _httpClient) {
        super(apiWrapper);
        this._outputChannel = _outputChannel;
        this._service = _service;
        this._processService = _processService;
        this._config = _config;
        this._httpClient = _httpClient;
    }
    /**
     * Returns provider Id
     */
    get providerId() {
        return SqlRPackageManageProvider.ProviderId;
    }
    /**
     * Returns package target
     */
    get packageTarget() {
        return { location: 'SQL', packageType: 'R' };
    }
    /**
     * Returns list of packages
     */
    fetchPackages(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._service.getRPackages(yield this.getCurrentConnection(), databaseName);
        });
    }
    /**
     * Execute a script to install or uninstall a r package inside current SQL Server connection
     * @param packageDetails Packages to install or uninstall
     * @param scriptMode can be 'install' or 'uninstall'
     */
    executeScripts(scriptMode, packageDetails, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let credentials = yield this._apiWrapper.getCredentials(connection.connectionId);
            let connectionParts = [];
            if (connection) {
                connectionParts.push(utils.getKeyValueString('driver', constants.supportedODBCDriver));
                let server = connection.serverName.replace('\\', '\\\\');
                if (databaseName) {
                    connectionParts.push(utils.getKeyValueString('database', `"${databaseName}"`));
                }
                if (connection.userName) {
                    connectionParts.push(utils.getKeyValueString('uid', `"${connection.userName}"`));
                    connectionParts.push(utils.getKeyValueString('pwd', `"${credentials[azdata.ConnectionOptionSpecialType.password]}"`));
                }
                connectionParts.push(utils.getKeyValueString('server', `"${server}"`));
                let rCommandScript = scriptMode === packageManageProviderBase_1.ScriptMode.Install ? 'sql_install.packages' : 'sql_remove.packages';
                let scripts = [
                    'formals(quit)$save <- formals(q)$save <- "no"',
                    'library(sqlmlutils)',
                    `connection <- connectionInfo(${connectionParts.join(', ')})`,
                    `r = getOption("repos")`,
                    `r["CRAN"] = "${this._config.rPackagesRepository}"`,
                    `options(repos = r)`,
                    `pkgs <- c("${packageDetails.name}")`,
                    `${rCommandScript}(connectionString = connection, pkgs, scope = "PUBLIC")`,
                    'q()'
                ];
                let rExecutable = yield this._config.getRExecutable(true);
                yield this._processService.execScripts(`${rExecutable}`, scripts, ['--vanilla'], this._outputChannel);
            }
        });
    }
    /**
     * Returns true if the provider can be used
     */
    canUseProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._config.rEnabled) {
                return false;
            }
            let connection = yield this.getCurrentConnection();
            if (connection && (yield this._service.isRInstalled(connection))) {
                return true;
            }
            return false;
        });
    }
    getPackageLink(packageName) {
        return `${this._config.rPackagesRepository}/web/packages/${packageName}`;
    }
    /**
     * Returns package overview for given name
     * @param packageName Package Name
     */
    fetchPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            let packagePreview = {
                name: packageName,
                versions: [constants.latestVersion],
                summary: ''
            };
            yield this._httpClient.fetch(this.getPackageLink(packageName));
            return packagePreview;
        });
    }
}
exports.SqlRPackageManageProvider = SqlRPackageManageProvider;
SqlRPackageManageProvider.ProviderId = 'sql_R';
//# sourceMappingURL=sqlRPackageManageProvider.js.map