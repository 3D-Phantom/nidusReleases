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
exports.PredictWizard = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const wizardView_1 = require("../../wizardView");
const modelSourcePage_1 = require("../modelSourcePage");
const columnsSelectionPage_1 = require("./columnsSelectionPage");
const modelArtifact_1 = require("./modelArtifact");
const modelBrowsePage_1 = require("../modelBrowsePage");
/**
 * Wizard to register a model
 */
class PredictWizard extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, root, parent, _selectedModels) {
        super(apiWrapper, root);
        this._selectedModels = _selectedModels;
        this._parentView = parent;
        this.modelActionType = modelViewBase_1.ModelActionType.Predict;
    }
    /**
     * Opens a dialog to manage packages used by notebooks.
     */
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.modelSourceType = modelViewBase_1.ModelSourceType.RegisteredModels;
            this.modelSourcePage = new modelSourcePage_1.ModelSourcePage(this._apiWrapper, this, [modelViewBase_1.ModelSourceType.RegisteredModels, modelViewBase_1.ModelSourceType.Local, modelViewBase_1.ModelSourceType.Azure]);
            this.columnsSelectionPage = new columnsSelectionPage_1.ColumnsSelectionPage(this._apiWrapper, this);
            this.modelBrowsePage = new modelBrowsePage_1.ModelBrowsePage(this._apiWrapper, this, false, this._selectedModels);
            this.wizardView = new wizardView_1.WizardView(this._apiWrapper);
            let wizard = this.wizardView.createWizard(constants.makePredictionTitle, [this.modelSourcePage,
                this.modelBrowsePage,
                this.columnsSelectionPage]);
            this.mainViewPanel = wizard;
            wizard.doneButton.label = constants.predictModel;
            wizard.generateScriptButton.hidden = true;
            wizard.displayPageTitles = true;
            wizard.doneButton.onClick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.onClose();
            }));
            wizard.cancelButton.onClick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.onClose();
            }));
            wizard.registerNavigationValidator((pageInfo) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let validated = true;
                if (pageInfo.newPage === undefined || pageInfo.newPage > pageInfo.lastPage) {
                    validated = this.wizardView ? yield this.wizardView.validate(pageInfo) : false;
                }
                if (validated) {
                    if (pageInfo.newPage === undefined) {
                        this.onLoading();
                        yield this.predict();
                        this.onLoaded();
                        if (this._parentView) {
                            (_a = this._parentView) === null || _a === void 0 ? void 0 : _a.refresh();
                        }
                    }
                    return true;
                }
                return validated;
            }));
            yield wizard.open();
            if (this._selectedModels) {
                yield wizard.setCurrentPage(wizard.pages.length - 1);
            }
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
    getModelFileName() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.modelResources && this.localModelsComponent && this.modelResources.data === modelViewBase_1.ModelSourceType.Local) {
                return new modelArtifact_1.ModelArtifact(this.localModelsComponent.data[0], false);
            }
            else if (this.modelResources && this.azureModelsComponent && this.modelResources.data === modelViewBase_1.ModelSourceType.Azure) {
                return yield this.azureModelsComponent.getDownloadedModel();
            }
            else if (this.modelBrowsePage && this.modelBrowsePage.registeredModelsComponent) {
                return yield ((_a = this.modelBrowsePage.registeredModelsComponent.modelTable) === null || _a === void 0 ? void 0 : _a.getDownloadedModel());
            }
            return undefined;
        });
    }
    predict() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let modelFilePath;
                let registeredModel = undefined;
                if (this.modelResources && this.modelResources.data && this.modelResources.data === modelViewBase_1.ModelSourceType.RegisteredModels
                    && this.modelBrowsePage && this.modelBrowsePage.registeredModelsComponent) {
                    const data = (_b = (_a = this.modelBrowsePage) === null || _a === void 0 ? void 0 : _a.registeredModelsComponent) === null || _b === void 0 ? void 0 : _b.data;
                    registeredModel = data && data.length > 0 ? data[0] : undefined;
                }
                else {
                    const artifact = yield this.getModelFileName();
                    modelFilePath = artifact === null || artifact === void 0 ? void 0 : artifact.filePath;
                }
                yield this.generatePredictScript(registeredModel, modelFilePath, (_c = this.columnsSelectionPage) === null || _c === void 0 ? void 0 : _c.data);
                return true;
            }
            catch (error) {
                this.showErrorMessage(`${constants.modelFailedToRegister} ${constants.getErrorMessage(error)}`);
                return false;
            }
        });
    }
    onClose() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const artifact = yield this.getModelFileName();
            if (artifact) {
                artifact.close();
            }
            yield ((_a = this.wizardView) === null || _a === void 0 ? void 0 : _a.disposePages());
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
exports.PredictWizard = PredictWizard;
//# sourceMappingURL=predictWizard.js.map