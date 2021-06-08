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
exports.SqlPythonPackageManageProvider = void 0;
const azdata = require("azdata");
const packageManageProviderBase_1 = require("./packageManageProviderBase");
const utils = require("../common/utils");
const constants = require("../common/constants");
/**
 * Manage Package Provider for python packages inside SQL server databases
 */
class SqlPythonPackageManageProvider extends packageManageProviderBase_1.SqlPackageManageProviderBase {
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
        return SqlPythonPackageManageProvider.ProviderId;
    }
    /**
     * Returns package target
     */
    get packageTarget() {
        return { location: 'SQL', packageType: 'Python' };
    }
    /**
     * Returns list of packages
     */
    fetchPackages(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._service.getPythonPackages(yield this.getCurrentConnection(), databaseName);
        });
    }
    /**
     * Execute a script to install or uninstall a python package inside current SQL Server connection
     * @param packageDetails Packages to install or uninstall
     * @param scriptMode can be 'install' or 'uninstall'
     */
    executeScripts(scriptMode, packageDetails, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let credentials = yield this._apiWrapper.getCredentials(connection.connectionId);
            let connectionParts = [];
            if (connection) {
                connectionParts.push(utils.getKeyValueString('driver', `"${constants.supportedODBCDriver}"`));
                let port = utils.getServerPort(connection);
                let server = utils.getServerName(connection);
                if (databaseName) {
                    connectionParts.push(utils.getKeyValueString('database', `"${databaseName}"`));
                }
                if (connection.userName) {
                    connectionParts.push(utils.getKeyValueString('uid', `"${connection.userName}"`));
                    connectionParts.push(utils.getKeyValueString('pwd', `"${credentials[azdata.ConnectionOptionSpecialType.password]}"`));
                }
                connectionParts.push(utils.getKeyValueString('server', `"${server}"`));
                connectionParts.push(utils.getKeyValueString('port', port));
                let pythonCommandScript = scriptMode === packageManageProviderBase_1.ScriptMode.Install ?
                    `pkgmanager.install(package="${packageDetails.name}", version="${packageDetails.version}")` :
                    `pkgmanager.uninstall(package_name="${packageDetails.name}")`;
                let scripts = [
                    'import sqlmlutils',
                    `connection = sqlmlutils.ConnectionInfo(${connectionParts.join(',')})`,
                    'pkgmanager = sqlmlutils.SQLPackageManager(connection)',
                    pythonCommandScript
                ];
                let pythonExecutable = yield this._config.getPythonExecutable(true);
                yield this._processService.execScripts(pythonExecutable, scripts, [], this._outputChannel);
            }
        });
    }
    /**
     * Returns true if the provider can be used
     */
    canUseProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._config.pythonEnabled) {
                return false;
            }
            let connection = yield this.getCurrentConnection();
            if (connection && (yield this._service.isPythonInstalled(connection))) {
                return true;
            }
            return false;
        });
    }
    getPackageLink(packageName) {
        return `https://pypi.org/pypi/${packageName}/json`;
    }
    fetchPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = yield this._httpClient.fetch(this.getPackageLink(packageName));
            let packagesJson = JSON.parse(body);
            let versionNums = [];
            let packageSummary = '';
            if (packagesJson) {
                if (packagesJson.releases) {
                    let versionKeys = Object.keys(packagesJson.releases);
                    versionKeys = versionKeys.filter(versionKey => {
                        let releaseInfo = packagesJson.releases[versionKey];
                        return Array.isArray(releaseInfo) && releaseInfo.length > 0;
                    });
                    versionNums = utils.sortPackageVersions(versionKeys, false);
                }
                if (packagesJson.info && packagesJson.info.summary) {
                    packageSummary = packagesJson.info.summary;
                }
            }
            return {
                name: packageName,
                versions: versionNums,
                summary: packageSummary
            };
        });
    }
}
exports.SqlPythonPackageManageProvider = SqlPythonPackageManageProvider;
SqlPythonPackageManageProvider.ProviderId = 'sql_Python';
//# sourceMappingURL=sqlPythonPackageManageProvider.js.map