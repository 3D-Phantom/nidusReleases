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
exports.ModelViewBase = exports.SignInToAzureEventName = exports.VerifyImportTableEventName = exports.StoreImportTableEventName = exports.LoadModelParametersEventName = exports.SourceModelSelectedEventName = exports.DeleteModelEventName = exports.UpdateModelEventName = exports.EditModelEventName = exports.RegisterModelEventName = exports.PredictWizardEventName = exports.PredictModelEventName = exports.DownloadRegisteredModelEventName = exports.DownloadAzureModelEventName = exports.RegisterAzureModelEventName = exports.RegisterLocalModelEventName = exports.ListWorkspacesEventName = exports.ListGroupsEventName = exports.ListSubscriptionsEventName = exports.ListColumnNamesEventName = exports.ListTableNamesEventName = exports.ListDatabaseNamesEventName = exports.ListAccountsEventName = exports.ListAzureModelsEventName = exports.ListModelsEventName = exports.ModelActionType = exports.ModelSourceType = void 0;
const viewBase_1 = require("../viewBase");
var ModelSourceType;
(function (ModelSourceType) {
    ModelSourceType["Local"] = "Local";
    ModelSourceType["Azure"] = "Azure";
    ModelSourceType["RegisteredModels"] = "RegisteredModels";
})(ModelSourceType = exports.ModelSourceType || (exports.ModelSourceType = {}));
var ModelActionType;
(function (ModelActionType) {
    ModelActionType[ModelActionType["Import"] = 0] = "Import";
    ModelActionType[ModelActionType["Predict"] = 1] = "Predict";
})(ModelActionType = exports.ModelActionType || (exports.ModelActionType = {}));
// Event names
//
exports.ListModelsEventName = 'listModels';
exports.ListAzureModelsEventName = 'listAzureModels';
exports.ListAccountsEventName = 'listAccounts';
exports.ListDatabaseNamesEventName = 'listDatabaseNames';
exports.ListTableNamesEventName = 'listTableNames';
exports.ListColumnNamesEventName = 'listColumnNames';
exports.ListSubscriptionsEventName = 'listSubscriptions';
exports.ListGroupsEventName = 'listGroups';
exports.ListWorkspacesEventName = 'listWorkspaces';
exports.RegisterLocalModelEventName = 'registerLocalModel';
exports.RegisterAzureModelEventName = 'registerAzureLocalModel';
exports.DownloadAzureModelEventName = 'downloadAzureLocalModel';
exports.DownloadRegisteredModelEventName = 'downloadRegisteredModel';
exports.PredictModelEventName = 'predictModel';
exports.PredictWizardEventName = 'predictWizard';
exports.RegisterModelEventName = 'registerModel';
exports.EditModelEventName = 'editModel';
exports.UpdateModelEventName = 'updateModel';
exports.DeleteModelEventName = 'deleteModel';
exports.SourceModelSelectedEventName = 'sourceModelSelected';
exports.LoadModelParametersEventName = 'loadModelParameters';
exports.StoreImportTableEventName = 'storeImportTable';
exports.VerifyImportTableEventName = 'verifyImportTable';
exports.SignInToAzureEventName = 'signInToAzure';
/**
 * Base class for all model management views
 */
class ModelViewBase extends viewBase_1.ViewBase {
    constructor(apiWrapper, root, parent) {
        super(apiWrapper, root, parent);
        this._modelSourceType = ModelSourceType.Local;
        this._modelsViewData = [];
        this._modelActionType = ModelActionType.Import;
    }
    getEventNames() {
        return super.getEventNames().concat([exports.ListModelsEventName,
            exports.ListAzureModelsEventName,
            exports.ListAccountsEventName,
            exports.ListSubscriptionsEventName,
            exports.ListGroupsEventName,
            exports.ListWorkspacesEventName,
            exports.RegisterLocalModelEventName,
            exports.RegisterAzureModelEventName,
            exports.RegisterModelEventName,
            exports.SourceModelSelectedEventName,
            exports.ListDatabaseNamesEventName,
            exports.ListTableNamesEventName,
            exports.ListColumnNamesEventName,
            exports.PredictModelEventName,
            exports.DownloadAzureModelEventName,
            exports.DownloadRegisteredModelEventName,
            exports.LoadModelParametersEventName,
            exports.StoreImportTableEventName,
            exports.VerifyImportTableEventName,
            exports.EditModelEventName,
            exports.UpdateModelEventName,
            exports.DeleteModelEventName,
            exports.SignInToAzureEventName,
            exports.PredictWizardEventName]);
    }
    /**
     * Parent view
     */
    get parent() {
        return this._parent ? this._parent : undefined;
    }
    /**
     * list azure models
     */
    listAzureModels(workspaceResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = workspaceResource;
            return yield this.sendDataRequest(exports.ListAzureModelsEventName, args);
        });
    }
    /**
     * list registered models
     */
    listModels(table) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.ListModelsEventName, table);
        });
    }
    /**
     * lists azure accounts
     */
    listAzureAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.ListAccountsEventName);
        });
    }
    /**
     * lists database names
     */
    listDatabaseNames() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.ListDatabaseNamesEventName);
        });
    }
    /**
     * lists table names
     */
    listTableNames(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.ListTableNamesEventName, dbName);
        });
    }
    /**
     * lists column names
     */
    listColumnNames(table) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.ListColumnNamesEventName, table);
        });
    }
    /**
     * lists azure subscriptions
     * @param account azure account
     */
    listAzureSubscriptions(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                account: account
            };
            return yield this.sendDataRequest(exports.ListSubscriptionsEventName, args);
        });
    }
    /**
     * registers local model
     * @param localFilePath local file path
     */
    importLocalModel(models) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.RegisterLocalModelEventName, models);
        });
    }
    /**
     * downloads registered model
     * @param model model to download
     */
    downloadRegisteredModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.DownloadRegisteredModelEventName, model);
        });
    }
    /**
     * download azure model
     * @param args azure resource
     */
    downloadAzureModel(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.DownloadAzureModelEventName, resource);
        });
    }
    /**
     * Loads model parameters
     */
    loadModelParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.LoadModelParametersEventName);
        });
    }
    /**
     * registers azure model
     * @param args azure resource
     */
    importAzureModel(models) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.RegisterAzureModelEventName, models);
        });
    }
    /**
     * Stores the name of the table as recent config table for importing models
     */
    storeImportConfigTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendRequest(exports.StoreImportTableEventName, this.importTable);
        });
    }
    /**
     * Verifies if table is valid to import models to
     */
    verifyImportConfigTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.VerifyImportTableEventName, table);
        });
    }
    /**
     * registers azure model
     * @param args azure resource
     */
    generatePredictScript(model, filePath, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = Object.assign({}, params, {
                model: model,
                filePath: filePath,
                loadFromRegisteredModel: !filePath
            });
            return yield this.sendDataRequest(exports.PredictModelEventName, args);
        });
    }
    /**
     * list resource groups
     * @param account azure account
     * @param subscription azure subscription
     */
    listAzureGroups(account, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                account: account,
                subscription: subscription
            };
            return yield this.sendDataRequest(exports.ListGroupsEventName, args);
        });
    }
    /**
     * Sets model action type
     */
    set modelActionType(value) {
        if (this.parent) {
            this.parent.modelActionType = value;
        }
        else {
            this._modelActionType = value;
        }
    }
    /**
     * Returns model action type
     */
    get modelActionType() {
        if (this.parent) {
            return this.parent.modelActionType;
        }
        else {
            return this._modelActionType;
        }
    }
    /**
     * Sets model source type
     */
    set modelSourceType(value) {
        if (this.parent) {
            this.parent.modelSourceType = value;
        }
        else {
            this._modelSourceType = value;
        }
    }
    /**
     * Returns model source type
     */
    get modelSourceType() {
        if (this.parent) {
            return this.parent.modelSourceType;
        }
        else {
            return this._modelSourceType;
        }
    }
    /**
     * Sets model data
     */
    set modelsViewData(value) {
        if (this.parent) {
            this.parent.modelsViewData = value;
        }
        else {
            this._modelsViewData = value;
        }
    }
    /**
     * Returns model data
     */
    get modelsViewData() {
        if (this.parent) {
            return this.parent.modelsViewData;
        }
        else {
            return this._modelsViewData;
        }
    }
    /**
     * Sets import table
     */
    set importTable(value) {
        if (this.parent) {
            this.parent.importTable = value;
        }
        else {
            this._importTable = value;
        }
    }
    /**
     * Returns import table
     */
    get importTable() {
        if (this.parent) {
            return this.parent.importTable;
        }
        else {
            return this._importTable;
        }
    }
    /**
     * lists azure workspaces
     * @param account azure account
     * @param subscription azure subscription
     * @param group azure resource group
     */
    listWorkspaces(account, subscription, group) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                account: account,
                subscription: subscription,
                group: group
            };
            return yield this.sendDataRequest(exports.ListWorkspacesEventName, args);
        });
    }
}
exports.ModelViewBase = ModelViewBase;
//# sourceMappingURL=modelViewBase.js.map