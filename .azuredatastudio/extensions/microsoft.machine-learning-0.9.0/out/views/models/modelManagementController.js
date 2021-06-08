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
exports.ModelManagementController = void 0;
const manageModelsDialog_1 = require("./manageModels/manageModelsDialog");
const modelViewBase_1 = require("./modelViewBase");
const controllerBase_1 = require("../controllerBase");
const importModelWizard_1 = require("./manageModels/importModelWizard");
const fs = require("fs");
const constants = require("../../common/constants");
const predictWizard_1 = require("./prediction/predictWizard");
const editModelDialog_1 = require("./manageModels/editModelDialog");
/**
 * Model management UI controller
 */
class ModelManagementController extends controllerBase_1.ControllerBase {
    /**
     * Creates new instance
     */
    constructor(apiWrapper, _root, _amlService, _deployedModelService, _predictService) {
        super(apiWrapper);
        this._root = _root;
        this._amlService = _amlService;
        this._deployedModelService = _deployedModelService;
        this._predictService = _predictService;
    }
    /**
     * Opens the dialog for model import
     * @param parent parent if the view is opened from another view
     * @param controller controller
     * @param apiWrapper apiWrapper
     * @param root root folder path
     */
    importModel(importTable, parent, controller, apiWrapper, root) {
        return __awaiter(this, void 0, void 0, function* () {
            controller = controller || this;
            apiWrapper = apiWrapper || this._apiWrapper;
            root = root || this._root;
            let view = new importModelWizard_1.ImportModelWizard(apiWrapper, root, parent);
            if (importTable) {
                view.importTable = importTable;
            }
            else {
                view.importTable = yield controller._deployedModelService.getRecentImportTable();
            }
            controller.registerEvents(view);
            // Open view
            //
            yield view.open();
            yield view.refresh();
            return view;
        });
    }
    /**
     * Opens the dialog to edit model
     */
    editModel(model, parent, controller, apiWrapper, root) {
        return __awaiter(this, void 0, void 0, function* () {
            controller = controller || this;
            apiWrapper = apiWrapper || this._apiWrapper;
            root = root || this._root;
            let view = new editModelDialog_1.EditModelDialog(apiWrapper, root, parent, model);
            controller.registerEvents(view);
            // Open view
            //
            view.open();
            yield view.refresh();
            return view;
        });
    }
    /**
     * Opens the wizard for prediction
     */
    predictModel(models, parent, controller, apiWrapper, root) {
        return __awaiter(this, void 0, void 0, function* () {
            controller = controller || this;
            apiWrapper = apiWrapper || this._apiWrapper;
            root = root || this._root;
            const onnxSupported = yield controller._predictService.serverSupportOnnxModel();
            if (onnxSupported) {
                yield controller._deployedModelService.installDependencies();
                let view = new predictWizard_1.PredictWizard(apiWrapper, root, parent, models);
                view.importTable = yield controller._deployedModelService.getRecentImportTable();
                controller.registerEvents(view);
                view.on(modelViewBase_1.LoadModelParametersEventName, (args) => __awaiter(this, void 0, void 0, function* () {
                    if (controller) {
                        const modelArtifact = yield view.getModelFileName();
                        yield controller.executeAction(view, modelViewBase_1.LoadModelParametersEventName, args, controller.loadModelParameters, controller._deployedModelService, modelArtifact === null || modelArtifact === void 0 ? void 0 : modelArtifact.filePath);
                    }
                }));
                // Open view
                //
                yield view.open();
                yield view.refresh();
                return view;
            }
            else {
                apiWrapper.showErrorMessage(constants.onnxNotSupportedError);
                return undefined;
            }
        });
    }
    /**
     * Register events in the main view
     * @param view main view
     */
    registerEvents(view) {
        // Register events
        //
        super.registerEvents(view);
        view.on(modelViewBase_1.ListAccountsEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            yield this.executeAction(view, modelViewBase_1.ListAccountsEventName, args, this.getAzureAccounts, this._amlService);
        }));
        view.on(modelViewBase_1.ListSubscriptionsEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let azureArgs = args;
            yield this.executeAction(view, modelViewBase_1.ListSubscriptionsEventName, args, this.getAzureSubscriptions, this._amlService, azureArgs.account);
        }));
        view.on(modelViewBase_1.ListWorkspacesEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let azureArgs = args;
            yield this.executeAction(view, modelViewBase_1.ListWorkspacesEventName, args, this.getWorkspaces, this._amlService, azureArgs.account, azureArgs.subscription, azureArgs.group);
        }));
        view.on(modelViewBase_1.ListGroupsEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let azureArgs = args;
            yield this.executeAction(view, modelViewBase_1.ListGroupsEventName, args, this.getAzureGroups, this._amlService, azureArgs.account, azureArgs.subscription);
        }));
        view.on(modelViewBase_1.ListAzureModelsEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let azureArgs = args;
            yield this.executeAction(view, modelViewBase_1.ListAzureModelsEventName, args, this.getAzureModels, this._amlService, azureArgs.account, azureArgs.subscription, azureArgs.group, azureArgs.workspace);
        }));
        view.on(modelViewBase_1.ListModelsEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            const table = args;
            yield this.executeAction(view, modelViewBase_1.ListModelsEventName, args, this.getRegisteredModels, this._deployedModelService, table);
        }));
        view.on(modelViewBase_1.RegisterLocalModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let models = args;
            yield this.executeAction(view, modelViewBase_1.RegisterLocalModelEventName, args, this.registerLocalModel, this._deployedModelService, models);
            view.refresh();
        }));
        view.on(modelViewBase_1.RegisterModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            const importTable = args;
            yield this.executeAction(view, modelViewBase_1.RegisterModelEventName, args, this.importModel, importTable, view, this, this._apiWrapper, this._root);
        }));
        view.on(modelViewBase_1.PredictWizardEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            const models = args;
            yield this.executeAction(view, modelViewBase_1.PredictWizardEventName, args, this.predictModel, models, undefined, this, this._apiWrapper, this._root);
        }));
        view.on(modelViewBase_1.EditModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            const model = args;
            yield this.executeAction(view, modelViewBase_1.EditModelEventName, args, this.editModel, model, view, this, this._apiWrapper, this._root);
        }));
        view.on(modelViewBase_1.UpdateModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            const model = args;
            yield this.executeAction(view, modelViewBase_1.UpdateModelEventName, args, this.updateModel, this._deployedModelService, model);
        }));
        view.on(modelViewBase_1.DeleteModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            const model = args;
            yield this.executeAction(view, modelViewBase_1.DeleteModelEventName, args, this.deleteModel, this._deployedModelService, model);
        }));
        view.on(modelViewBase_1.RegisterAzureModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let models = args;
            yield this.executeAction(view, modelViewBase_1.RegisterAzureModelEventName, args, this.registerAzureModel, this._amlService, this._deployedModelService, models);
        }));
        view.on(modelViewBase_1.DownloadAzureModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let registerArgs = args;
            yield this.executeAction(view, modelViewBase_1.DownloadAzureModelEventName, args, this.downloadAzureModel, this._amlService, registerArgs.account, registerArgs.subscription, registerArgs.group, registerArgs.workspace, registerArgs.model);
        }));
        view.on(modelViewBase_1.ListDatabaseNamesEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            yield this.executeAction(view, modelViewBase_1.ListDatabaseNamesEventName, args, this.getDatabaseList, this._predictService);
        }));
        view.on(modelViewBase_1.ListTableNamesEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let dbName = args;
            yield this.executeAction(view, modelViewBase_1.ListTableNamesEventName, args, this.getTableList, this._predictService, dbName);
        }));
        view.on(modelViewBase_1.ListColumnNamesEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let tableColumnsArgs = args;
            yield this.executeAction(view, modelViewBase_1.ListColumnNamesEventName, args, this.getTableColumnsList, this._predictService, tableColumnsArgs);
        }));
        view.on(modelViewBase_1.PredictModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let predictArgs = args;
            yield this.executeAction(view, modelViewBase_1.PredictModelEventName, args, this.generatePredictScript, this._predictService, predictArgs, predictArgs.model, predictArgs.filePath);
        }));
        view.on(modelViewBase_1.DownloadRegisteredModelEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let model = args;
            yield this.executeAction(view, modelViewBase_1.DownloadRegisteredModelEventName, args, this.downloadRegisteredModel, this._deployedModelService, model);
        }));
        view.on(modelViewBase_1.StoreImportTableEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let importTable = args;
            yield this.executeAction(view, modelViewBase_1.StoreImportTableEventName, args, this.storeImportTable, this._deployedModelService, importTable);
        }));
        view.on(modelViewBase_1.VerifyImportTableEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            let importTable = args;
            yield this.executeAction(view, modelViewBase_1.VerifyImportTableEventName, args, this.verifyImportTable, this._deployedModelService, importTable);
        }));
        view.on(modelViewBase_1.SourceModelSelectedEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            view.modelSourceType = args;
            yield view.refresh();
        }));
        view.on(modelViewBase_1.SignInToAzureEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            yield this.executeAction(view, modelViewBase_1.SignInToAzureEventName, args, this.signInToAzure, this._amlService);
            yield view.refresh();
        }));
    }
    /**
     * Opens the dialog for model management
     */
    manageRegisteredModels(importTable) {
        return __awaiter(this, void 0, void 0, function* () {
            let view = new manageModelsDialog_1.ManageModelsDialog(this._apiWrapper, this._root);
            if (importTable) {
                view.importTable = importTable;
            }
            else {
                view.importTable = yield this._deployedModelService.getRecentImportTable();
            }
            // Register events
            //
            this.registerEvents(view);
            // Open view
            //
            view.open();
            return view;
        });
    }
    signInToAzure(service) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service.signInToAzure();
        });
    }
    getAzureAccounts(service) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service.getAccounts();
        });
    }
    getAzureSubscriptions(service, account) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service.getSubscriptions(account);
        });
    }
    getAzureGroups(service, account, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service.getGroups(account, subscription);
        });
    }
    getWorkspaces(service, account, subscription, group) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!account || !subscription) {
                return [];
            }
            return yield service.getWorkspaces(account, subscription, group);
        });
    }
    getRegisteredModels(registeredModelService, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return registeredModelService.getDeployedModels(table);
        });
    }
    getAzureModels(service, account, subscription, resourceGroup, workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!account || !subscription || !resourceGroup || !workspace) {
                return [];
            }
            return (yield service.getModels(account, subscription, resourceGroup, workspace)) || [];
        });
    }
    registerLocalModel(service, models) {
        return __awaiter(this, void 0, void 0, function* () {
            if (models) {
                yield Promise.all(models.map((model) => __awaiter(this, void 0, void 0, function* () {
                    if (model && model.targetImportTable) {
                        const localModel = model.modelData;
                        if (localModel) {
                            yield service.deployLocalModel(localModel, model.modelDetails, model.targetImportTable);
                        }
                    }
                    else {
                        throw Error(constants.invalidModelToRegisterError);
                    }
                })));
            }
            else {
                throw Error(constants.invalidModelToRegisterError);
            }
        });
    }
    updateModel(service, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model) {
                yield service.updateModel(model);
            }
            else {
                throw Error(constants.invalidModelToRegisterError);
            }
        });
    }
    deleteModel(service, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model) {
                yield service.deleteModel(model);
            }
            else {
                throw Error(constants.invalidModelToRegisterError);
            }
        });
    }
    registerAzureModel(azureService, service, models) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!models) {
                throw Error(constants.invalidAzureResourceError);
            }
            yield Promise.all(models.map((model) => __awaiter(this, void 0, void 0, function* () {
                if (model && model.targetImportTable) {
                    const azureModel = model.modelData;
                    if (azureModel && azureModel.account && azureModel.subscription && azureModel.group && azureModel.workspace && azureModel.model) {
                        let filePath;
                        try {
                            const filePath = yield azureService.downloadModel(azureModel.account, azureModel.subscription, azureModel.group, azureModel.workspace, azureModel.model);
                            if (filePath) {
                                yield service.deployLocalModel(filePath, model.modelDetails, model.targetImportTable);
                            }
                            else {
                                throw Error(constants.invalidModelToRegisterError);
                            }
                        }
                        finally {
                            if (filePath) {
                                yield fs.promises.unlink(filePath);
                            }
                        }
                    }
                }
                else {
                    throw Error(constants.invalidModelToRegisterError);
                }
            })));
        });
    }
    getDatabaseList(predictService) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield predictService.getDatabaseList();
        });
    }
    getTableList(predictService, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield predictService.getTableList(databaseName);
        });
    }
    getTableColumnsList(predictService, databaseTable) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield predictService.getTableColumnsList(databaseTable);
        });
    }
    generatePredictScript(predictService, predictParams, registeredModel, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!predictParams) {
                throw Error(constants.invalidModelToPredictError);
            }
            const result = yield predictService.generatePredictScript(predictParams, registeredModel, filePath);
            return result;
        });
    }
    storeImportTable(registeredModelService, table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (table) {
                yield registeredModelService.storeRecentImportTable(table);
            }
            else {
                throw Error(constants.invalidImportTableError(undefined, undefined));
            }
        });
    }
    verifyImportTable(registeredModelService, table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (table) {
                return yield registeredModelService.verifyConfigTable(table);
            }
            else {
                throw Error(constants.invalidImportTableError(undefined, undefined));
            }
        });
    }
    downloadRegisteredModel(registeredModelService, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!model) {
                throw Error(constants.invalidModelToPredictError);
            }
            return yield registeredModelService.downloadModel(model);
        });
    }
    loadModelParameters(registeredModelService, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!model) {
                return undefined;
            }
            return yield registeredModelService.loadModelParameters(model);
        });
    }
    downloadAzureModel(azureService, account, subscription, resourceGroup, workspace, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!account || !subscription || !resourceGroup || !workspace || !model) {
                throw Error(constants.invalidAzureResourceError);
            }
            const filePath = yield azureService.downloadModel(account, subscription, resourceGroup, workspace, model);
            if (filePath) {
                return filePath;
            }
            else {
                throw Error(constants.invalidModelToRegisterError);
            }
        });
    }
}
exports.ModelManagementController = ModelManagementController;
//# sourceMappingURL=modelManagementController.js.map