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
exports.PackageManager = void 0;
const vscode = require("vscode");
const azdata = require("azdata");
const sqlPythonPackageManageProvider_1 = require("./sqlPythonPackageManageProvider");
const utils = require("../common/utils");
const constants = require("../common/constants");
const util_1 = require("util");
const sqlRPackageManageProvider_1 = require("./sqlRPackageManageProvider");
class PackageManager {
    /**
     * Creates a new instance of PackageManager
     */
    constructor(_outputChannel, _rootFolder, _apiWrapper, _service, _processService, _config, _httpClient) {
        this._outputChannel = _outputChannel;
        this._rootFolder = _rootFolder;
        this._apiWrapper = _apiWrapper;
        this._service = _service;
        this._processService = _processService;
        this._config = _config;
        this._httpClient = _httpClient;
        this.dependenciesInstalled = false;
        this._sqlPythonPackagePackageManager = new sqlPythonPackageManageProvider_1.SqlPythonPackageManageProvider(this._outputChannel, this._apiWrapper, this._service, this._processService, this._config, this._httpClient);
        this._sqlRPackageManager = new sqlRPackageManageProvider_1.SqlRPackageManageProvider(this._outputChannel, this._apiWrapper, this._service, this._processService, this._config, this._httpClient);
    }
    /**
     * Initializes the instance and resister SQL package manager with manage package dialog
     */
    init() {
    }
    getPythonExecutable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._config.getPythonExecutable(true);
        });
    }
    getRExecutable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._config.getRExecutable(true);
        });
    }
    /**
     * Returns packageManageProviders
     */
    get packageManageProviders() {
        return [
            this._sqlPythonPackagePackageManager,
            this._sqlRPackageManager
        ];
    }
    /**
     * Executes manage package command for SQL server packages.
     */
    managePackages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Only execute the command if there's a valid connection with ml configuration enabled
                //
                let connection = yield this.getCurrentConnection();
                let defaultProvider;
                if (connection && (yield this._sqlPythonPackagePackageManager.canUseProvider())) {
                    defaultProvider = this._sqlPythonPackagePackageManager;
                }
                else if (connection && (yield this._sqlRPackageManager.canUseProvider())) {
                    defaultProvider = this._sqlRPackageManager;
                }
                if (connection && defaultProvider) {
                    yield this.enableExternalScript();
                    // Install dependencies
                    //
                    if (!this.dependenciesInstalled) {
                        yield this.installDependencies();
                        this.dependenciesInstalled = true;
                    }
                    // Execute the command
                    //
                    this._apiWrapper.executeCommand(constants.managePackagesCommand, {
                        defaultLocation: defaultProvider.packageTarget.location,
                        defaultProviderId: defaultProvider.providerId
                    });
                }
                else {
                    const result = yield this._apiWrapper.showInfoMessage(constants.managePackageCommandError, constants.learnMoreTitle);
                    if (result === constants.learnMoreTitle) {
                        yield this._apiWrapper.openExternal(vscode.Uri.parse(constants.managePackagesDocs));
                    }
                }
            }
            catch (err) {
                this._apiWrapper.showErrorMessage(err);
            }
        });
    }
    enableExternalScript() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (!(yield this._service.enableExternalScriptConfig(connection))) {
                throw Error(constants.externalScriptsIsRequiredError);
            }
        });
    }
    /**
     * Installs dependencies for the extension
     */
    installDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            yield utils.executeTasks(this._apiWrapper, constants.installPackageMngDependenciesMsgTaskName, [
                this.installRequiredPythonPackages(this._config.requiredSqlPythonPackages),
                this.installRequiredRPackages()
            ], false);
            yield this.verifyOdbcInstalled();
        });
    }
    installRequiredRPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._config.rEnabled) {
                return;
            }
            let rExecutable = yield this.getRExecutable();
            if (!rExecutable) {
                throw new Error(constants.rConfigError);
            }
            yield utils.createFolder(utils.getRPackagesFolderPath(this._rootFolder));
            const packages = this._config.requiredSqlRPackages.filter(p => !p.platform || p.platform === process.platform);
            let packagesToInstall = [];
            for (let index = 0; index < packages.length; index++) {
                const packageDetail = packages[index];
                const isInstalled = yield this.verifyRPackageInstalled(packageDetail.name);
                if (!isInstalled) {
                    packagesToInstall.push(packageDetail);
                }
            }
            if (packagesToInstall.length > 0) {
                this._apiWrapper.showInfoMessage(constants.confirmInstallRPackagesDetails(packagesToInstall.map(x => x.name).join(', ')));
                let confirmed = yield utils.promptConfirm(constants.confirmInstallPythonPackages, this._apiWrapper);
                if (confirmed) {
                    this._outputChannel.appendLine(constants.installDependenciesPackages);
                    // Installs packages in order of listed in the config. The order specifies the dependency of the packages and
                    // packages cannot install as parallel because of the dependency for each other
                    for (let index = 0; index < packagesToInstall.length; index++) {
                        const packageName = packagesToInstall[index];
                        yield this.installRPackage(packageName);
                    }
                }
                else {
                    throw Error(constants.requiredPackagesNotInstalled);
                }
            }
        });
    }
    /**
     * Installs required python packages
     */
    installRequiredPythonPackages(requiredPackages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._config.pythonEnabled) {
                return;
            }
            let pythonExecutable = yield this.getPythonExecutable();
            if (!pythonExecutable) {
                throw new Error(constants.pythonConfigError);
            }
            if (!requiredPackages || requiredPackages.length === 0) {
                return;
            }
            let installedPackages = yield this.getInstalledPipPackages();
            let fileContent = '';
            requiredPackages.forEach(packageDetails => {
                let hasVersion = ('version' in packageDetails) && !util_1.isNullOrUndefined(packageDetails['version']) && packageDetails['version'].length > 0;
                if (!installedPackages.find(x => x.name === packageDetails['name']
                    && (!hasVersion || utils.comparePackageVersions(packageDetails['version'] || '', x.version) <= 0))) {
                    let packageNameDetail = hasVersion ? `${packageDetails.name}==${packageDetails.version}` : `${packageDetails.name}`;
                    fileContent = `${fileContent}${packageNameDetail}\n`;
                }
            });
            if (fileContent) {
                this._apiWrapper.showInfoMessage(constants.confirmInstallPythonPackagesDetails(fileContent));
                let confirmed = yield utils.promptConfirm(constants.confirmInstallPythonPackages, this._apiWrapper);
                if (confirmed) {
                    this._outputChannel.appendLine(constants.installDependenciesPackages);
                    let result = yield utils.execCommandOnTempFile(fileContent, (tempFilePath) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.installPipPackage(tempFilePath);
                    }));
                    this._outputChannel.appendLine(result);
                }
                else {
                    throw Error(constants.requiredPackagesNotInstalled);
                }
            }
            else {
                this._outputChannel.appendLine(constants.installDependenciesPackagesAlreadyInstalled);
            }
        });
    }
    verifyOdbcInstalled() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                let credentials = yield this._apiWrapper.getCredentials(connection.connectionId);
                const separator = '=';
                let connectionParts = [];
                if (connection) {
                    connectionParts.push(utils.getKeyValueString('DRIVER', `{${constants.supportedODBCDriver}}`, separator));
                    if (connection.userName) {
                        connectionParts.push(utils.getKeyValueString('UID', connection.userName, separator));
                        connectionParts.push(utils.getKeyValueString('PWD', credentials[azdata.ConnectionOptionSpecialType.password], separator));
                    }
                    else {
                        connectionParts.push(utils.getKeyValueString('Trusted_Connection', 'yes', separator));
                    }
                    connectionParts.push(utils.getKeyValueString('SERVER', connection.serverName, separator));
                }
                let scripts = [
                    'import pyodbc',
                    `connection = pyodbc.connect('${connectionParts.join(';')}')`,
                    'cursor = connection.cursor()',
                    'cursor.execute("SELECT @@version;")'
                ];
                let pythonExecutable = yield this._config.getPythonExecutable(true);
                try {
                    yield this._processService.execScripts(pythonExecutable, scripts, [], this._outputChannel);
                }
                catch (err) {
                    const result = yield this._apiWrapper.showErrorMessage(constants.verifyOdbcDriverError, constants.learnMoreTitle);
                    if (result === constants.learnMoreTitle) {
                        yield this._apiWrapper.openExternal(vscode.Uri.parse(constants.odbcDriverDocuments));
                    }
                    throw err;
                }
            }
        });
    }
    getInstalledPipPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pythonExecutable = yield this.getPythonExecutable();
                let cmd = `"${pythonExecutable}" -m pip list --format=json`;
                let packagesInfo = yield this._processService.executeBufferedCommand(cmd, undefined);
                let packagesResult = [];
                if (packagesInfo && packagesInfo.indexOf(']') > 0) {
                    packagesResult = JSON.parse(packagesInfo.substr(0, packagesInfo.indexOf(']') + 1));
                }
                return packagesResult;
            }
            catch (err) {
                this._outputChannel.appendLine(constants.installDependenciesGetPackagesError(err ? err.message : ''));
                return [];
            }
        });
    }
    getCurrentConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getCurrentConnection();
        });
    }
    installPipPackage(requirementFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let pythonExecutable = yield this.getPythonExecutable();
            let cmd = `"${pythonExecutable}" -m pip install -r "${requirementFilePath}"`;
            return yield this._processService.executeBufferedCommand(cmd, this._outputChannel);
        });
    }
    verifyRPackageInstalled(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            let rExecutable = yield this.getRExecutable();
            let scripts = [
                'formals(quit)$save <- formals(q)$save <- "no"',
                `library(${packageName})`,
                'q()'
            ];
            try {
                yield this._processService.execScripts(rExecutable, scripts, ['--vanilla'], undefined);
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    installRPackage(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = '';
            let cmd = '';
            let rExecutable = yield this.getRExecutable();
            if (model.downloadUrl) {
                const packageFile = utils.getPackageFilePath(this._rootFolder, model.fileName || model.name);
                const packageExist = yield utils.exists(packageFile);
                if (!packageExist) {
                    yield this._httpClient.download(model.downloadUrl, packageFile, this._outputChannel);
                }
                cmd = `"${rExecutable}" CMD INSTALL ${packageFile}`;
                output = yield this._processService.executeBufferedCommand(cmd, this._outputChannel);
            }
            else if (model.repository) {
                cmd = `"${rExecutable}" -e "install.packages('${model.name}', repos='${model.repository}')"`;
                output = yield this._processService.executeBufferedCommand(cmd, this._outputChannel);
            }
            return output;
        });
    }
}
exports.PackageManager = PackageManager;
//# sourceMappingURL=packageManager.js.map