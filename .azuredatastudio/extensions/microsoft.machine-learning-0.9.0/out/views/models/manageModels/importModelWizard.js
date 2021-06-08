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
exports.ImportModelWizard = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const wizardView_1 = require("../../wizardView");
const modelSourcePage_1 = require("../modelSourcePage");
const modelDetailsPage_1 = require("../modelDetailsPage");
const modelBrowsePage_1 = require("../modelBrowsePage");
const modelImportLocationPage_1 = require("./modelImportLocationPage");
/**
 * Wizard to register a model
 */
class ImportModelWizard extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, root, parent) {
        super(apiWrapper, root);
        this._parentView = parent;
        this.modelActionType = modelViewBase_1.ModelActionType.Import;
    }
    /**
     * Opens a dialog to manage packages used by notebooks.
     */
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.modelSourcePage = new modelSourcePage_1.ModelSourcePage(this._apiWrapper, this);
            this.modelDetailsPage = new modelDetailsPage_1.ModelDetailsPage(this._apiWrapper, this);
            this.modelBrowsePage = new modelBrowsePage_1.ModelBrowsePage(this._apiWrapper, this);
            this.modelImportTargetPage = new modelImportLocationPage_1.ModelImportLocationPage(this._apiWrapper, this);
            this.wizardView = new wizardView_1.WizardView(this._apiWrapper);
            let wizard = this.wizardView.createWizard(constants.registerModelTitle, [this.modelSourcePage, this.modelBrowsePage, this.modelDetailsPage, this.modelImportTargetPage]);
            this.mainViewPanel = wizard;
            wizard.doneButton.label = constants.importModelDoneButton;
            wizard.generateScriptButton.hidden = true;
            wizard.displayPageTitles = true;
            wizard.registerNavigationValidator((pageInfo) => __awaiter(this, void 0, void 0, function* () {
                let validated = true;
                if (pageInfo.newPage > pageInfo.lastPage) {
                    validated = this.wizardView ? yield this.wizardView.validate(pageInfo) : false;
                }
                if (validated && pageInfo.newPage === undefined) {
                    this.onLoading();
                    let result = yield this.registerModel();
                    this.onLoaded();
                    if (this._parentView) {
                        this._parentView.importTable = this.importTable;
                        yield this._parentView.refresh();
                    }
                    return result;
                }
                return validated;
            }));
            yield wizard.open();
        });
    }
    onLoading() {
        this.refreshButtons(true);
    }
    onLoaded() {
        this.refreshButtons(false);
    }
    refreshButtons(loading) {
        if (this.wizardView && this.wizardView.wizard) {
            this.wizardView.wizard.cancelButton.enabled = !loading;
            this.wizardView.wizard.backButton.enabled = !loading;
        }
    }
    get modelResources() {
        var _a;
        return (_a = this.modelSourcePage) === null || _a === void 0 ? void 0 : _a.modelResources;
    }
    get localModelsComponent() {
        var _a;
        return (_a = this.modelBrowsePage) === null || _a === void 0 ? void 0 : _a.localModelsComponent;
    }
    get azureModelsComponent() {
        var _a;
        return (_a = this.modelBrowsePage) === null || _a === void 0 ? void 0 : _a.azureModelsComponent;
    }
    registerModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.modelResources && this.localModelsComponent && this.modelResources.data === modelViewBase_1.ModelSourceType.Local) {
                    yield this.importLocalModel(this.modelsViewData);
                }
                else {
                    yield this.importAzureModel(this.modelsViewData);
                }
                this._apiWrapper.showInfoMessage(constants.modelRegisteredSuccessfully);
                yield this.storeImportConfigTable();
                return true;
            }
            catch (error) {
                yield this.showErrorMessage(`${constants.modelFailedToRegister} ${constants.getErrorMessage(error)}`);
                return false;
            }
        });
    }
    /**
     * Refresh the pages
     */
    refresh() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.wizardView) === null || _a === void 0 ? void 0 : _a.refresh());
        });
    }
}
exports.ImportModelWizard = ImportModelWizard;
//# sourceMappingURL=importModelWizard.js.map