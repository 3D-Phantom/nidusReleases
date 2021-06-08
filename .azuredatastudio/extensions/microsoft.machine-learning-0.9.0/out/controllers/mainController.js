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
const packageManager_1 = require("../packageManagement/packageManager");
const constants = require("../common/constants");
const config_1 = require("../configurations/config");
const packageManagementService_1 = require("../packageManagement/packageManagementService");
const httpClient_1 = require("../common/httpClient");
const modelManagementController_1 = require("../views/models/modelManagementController");
const deployedModelService_1 = require("../modelManagement/deployedModelService");
const azureModelRegistryService_1 = require("../modelManagement/azureModelRegistryService");
const modelPythonClient_1 = require("../modelManagement/modelPythonClient");
const predictService_1 = require("../prediction/predictService");
const dashboardWidget_1 = require("../views/widgets/dashboardWidget");
const modelConfigRecent_1 = require("../modelManagement/modelConfigRecent");
/**
 * The main controller class that initializes the extension
 */
class MainController {
    constructor(_context, _apiWrapper, _queryRunner, _processService, _packageManager, _packageManagementService, _httpClient) {
        this._context = _context;
        this._apiWrapper = _apiWrapper;
        this._queryRunner = _queryRunner;
        this._processService = _processService;
        this._packageManager = _packageManager;
        this._packageManagementService = _packageManagementService;
        this._httpClient = _httpClient;
        this._rootPath = this._context.extensionPath;
        this._outputChannel = this._apiWrapper.createOutputChannel(constants.extensionOutputChannel);
        this._rootPath = this._context.extensionPath;
        this._config = new config_1.Config(this._rootPath, this._apiWrapper);
    }
    /**
     * Deactivates the extension
     */
    deactivate() {
    }
    /**
     * Activates the extension
     */
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
            return Promise.resolve(true);
        });
    }
    /**
     * Returns an instance of Server Installation from notebook extension
     */
    getNotebookExtensionApis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let nbExtension = this._apiWrapper.getExtension(constants.notebookExtensionName);
                if (nbExtension) {
                    yield nbExtension.activate();
                    return nbExtension.exports;
                }
                else {
                    throw new Error(constants.notebookExtensionNotLoaded);
                }
            }
            catch (err) {
                this._outputChannel.appendLine(constants.notebookExtensionFailedError);
                this._apiWrapper.showErrorMessage(constants.notebookExtensionFailedError);
                throw err;
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._outputChannel.show(true);
            let nbApis = yield this.getNotebookExtensionApis();
            yield this._config.load();
            let packageManager = this.getPackageManager(nbApis);
            this._apiWrapper.registerCommand(constants.mlManagePackagesCommand, (() => __awaiter(this, void 0, void 0, function* () {
                yield packageManager.managePackages();
            })));
            // External Languages
            //
            let modelImporter = new modelPythonClient_1.ModelPythonClient(this._outputChannel, this._apiWrapper, this._processService, this._config, packageManager);
            let modelRecentService = new modelConfigRecent_1.ModelConfigRecent(this._context.globalState);
            // Model Management
            //
            let registeredModelService = new deployedModelService_1.DeployedModelService(this._apiWrapper, this._config, this._queryRunner, modelImporter, modelRecentService);
            let azureModelsService = new azureModelRegistryService_1.AzureModelRegistryService(this._apiWrapper, this._config, this.httpClient, this._outputChannel);
            let predictService = new predictService_1.PredictService(this._apiWrapper, this._queryRunner);
            let modelManagementController = new modelManagementController_1.ModelManagementController(this._apiWrapper, this._rootPath, azureModelsService, registeredModelService, predictService);
            let dashboardWidget = new dashboardWidget_1.DashboardWidget(this._apiWrapper, this._rootPath, predictService);
            dashboardWidget.register();
            this._apiWrapper.registerCommand(constants.mlManageModelsCommand, (() => __awaiter(this, void 0, void 0, function* () {
                yield modelManagementController.manageRegisteredModels();
            })));
            this._apiWrapper.registerCommand(constants.mlImportModelCommand, (() => __awaiter(this, void 0, void 0, function* () {
                yield modelManagementController.importModel(undefined);
            })));
            this._apiWrapper.registerCommand(constants.mlsPredictModelCommand, (() => __awaiter(this, void 0, void 0, function* () {
                yield modelManagementController.predictModel();
            })));
            this._apiWrapper.registerCommand(constants.mlsDependenciesCommand, (() => __awaiter(this, void 0, void 0, function* () {
                yield packageManager.installDependencies();
            })));
            this._apiWrapper.registerCommand(constants.mlsEnableExternalScriptCommand, (() => __awaiter(this, void 0, void 0, function* () {
                yield packageManager.enableExternalScript();
            })));
            this._apiWrapper.registerTaskHandler(constants.mlManagePackagesCommand, () => __awaiter(this, void 0, void 0, function* () {
                yield packageManager.managePackages();
            }));
        });
    }
    /**
     * Returns the package manager instance
     */
    getPackageManager(nbApis) {
        if (!this._packageManager) {
            this._packageManager = new packageManager_1.PackageManager(this._outputChannel, this._rootPath, this._apiWrapper, this.packageManagementService, this._processService, this._config, this.httpClient);
            this._packageManager.init();
            this._packageManager.packageManageProviders.forEach(provider => {
                nbApis.registerPackageManager(provider.providerId, provider);
            });
        }
        return this._packageManager;
    }
    /**
     * Returns the server config manager instance
     */
    get packageManagementService() {
        if (!this._packageManagementService) {
            this._packageManagementService = new packageManagementService_1.PackageManagementService(this._apiWrapper, this._queryRunner);
        }
        return this._packageManagementService;
    }
    /**
     * Returns the server config manager instance
     */
    get httpClient() {
        if (!this._httpClient) {
            this._httpClient = new httpClient_1.HttpClient();
        }
        return this._httpClient;
    }
    /**
     * Config instance
     */
    get config() {
        return this._config;
    }
    /**
     * Disposes the extension
     */
    dispose() {
        this.deactivate();
    }
}
exports.default = MainController;
//# sourceMappingURL=mainController.js.map