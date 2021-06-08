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
exports.ModelBrowsePage = void 0;
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
const localModelsComponent_1 = require("./localModelsComponent");
const azureModelsComponent_1 = require("./azureModelsComponent");
const utils = require("../../common/utils");
const currentModelsComponent_1 = require("./manageModels/currentModelsComponent");
/**
 * View to pick model source
 */
class ModelBrowsePage extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent, _multiSelect = true, _selectedModels) {
        super(apiWrapper, parent.root, parent);
        this._multiSelect = _multiSelect;
        this._selectedModels = _selectedModels;
        this._title = constants.localModelPageTitle;
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._formBuilder = modelBuilder.formContainer();
        this.localModelsComponent = new localModelsComponent_1.LocalModelsComponent(this._apiWrapper, this, this._multiSelect);
        this.localModelsComponent.registerComponent(modelBuilder);
        this.azureModelsComponent = new azureModelsComponent_1.AzureModelsComponent(this._apiWrapper, this, this._multiSelect);
        this.azureModelsComponent.registerComponent(modelBuilder);
        this.registeredModelsComponent = new currentModelsComponent_1.CurrentModelsComponent(this._apiWrapper, this, {
            selectable: true,
            multiSelect: this._multiSelect,
            editable: false
        });
        this.registeredModelsComponent.registerComponent(modelBuilder);
        // Mark a model in the list as selected
        if (this._selectedModels && this.registeredModelsComponent.modelTable) {
            this.registeredModelsComponent.modelTable.selectedModels = this._selectedModels;
        }
        this._form = this._formBuilder.component();
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        return this.modelsViewData;
    }
    /**
     * Returns the component
     */
    get component() {
        return this._form;
    }
    /**
     * Refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._formBuilder) {
                if (this._currentModelSourceType !== this.modelSourceType) {
                    this._currentModelSourceType = this.modelSourceType;
                    if (this.modelSourceType === modelViewBase_1.ModelSourceType.Local) {
                        if (this.localModelsComponent && this.azureModelsComponent && this.registeredModelsComponent) {
                            this.azureModelsComponent.removeComponents(this._formBuilder);
                            this.registeredModelsComponent.removeComponents(this._formBuilder);
                            yield this.localModelsComponent.refresh();
                            this.localModelsComponent.addComponents(this._formBuilder);
                        }
                    }
                    else if (this.modelSourceType === modelViewBase_1.ModelSourceType.Azure) {
                        if (this.localModelsComponent && this.azureModelsComponent && this.registeredModelsComponent) {
                            this.localModelsComponent.removeComponents(this._formBuilder);
                            this.registeredModelsComponent.removeComponents(this._formBuilder);
                            yield this.azureModelsComponent.refresh();
                            this.azureModelsComponent.addComponents(this._formBuilder);
                        }
                    }
                    else if (this.modelSourceType === modelViewBase_1.ModelSourceType.RegisteredModels) {
                        if (this.localModelsComponent && this.azureModelsComponent && this.registeredModelsComponent) {
                            this.localModelsComponent.removeComponents(this._formBuilder);
                            this.azureModelsComponent.removeComponents(this._formBuilder);
                            yield this.registeredModelsComponent.refresh();
                            this.registeredModelsComponent.addComponents(this._formBuilder);
                        }
                    }
                }
            }
            this.loadTitle();
        });
    }
    loadTitle() {
        if (this.modelSourceType === modelViewBase_1.ModelSourceType.Local) {
            this._title = constants.localModelPageTitle;
        }
        else if (this.modelSourceType === modelViewBase_1.ModelSourceType.Azure) {
            this._title = constants.azureModelPageTitle;
        }
        else if (this.modelSourceType === modelViewBase_1.ModelSourceType.RegisteredModels) {
            this._title = constants.importedModelsPageTitle;
        }
        else {
            this._title = constants.modelSourcePageTitle;
        }
    }
    /**
     * Returns page title
     */
    get title() {
        this.loadTitle();
        return this._title;
    }
    validate() {
        let validated = false;
        if (this.modelSourceType === modelViewBase_1.ModelSourceType.Local && this.localModelsComponent) {
            validated = this.localModelsComponent.data !== undefined && this.localModelsComponent.data.length > 0;
        }
        else if (this.modelSourceType === modelViewBase_1.ModelSourceType.Azure && this.azureModelsComponent) {
            validated = this.azureModelsComponent.data !== undefined && this.azureModelsComponent.data.length > 0;
        }
        else if (this.modelSourceType === modelViewBase_1.ModelSourceType.RegisteredModels && this.registeredModelsComponent) {
            validated = this.registeredModelsComponent.data !== undefined && this.registeredModelsComponent.data.length > 0;
        }
        if (!validated) {
            this.showErrorMessage(constants.invalidModelToSelectError);
        }
        return Promise.resolve(validated);
    }
    onEnter() {
        return Promise.resolve();
    }
    onLeave() {
        return __awaiter(this, void 0, void 0, function* () {
            this.modelsViewData = [];
            if (this.modelSourceType === modelViewBase_1.ModelSourceType.Local && this.localModelsComponent) {
                if (this.localModelsComponent.data !== undefined && this.localModelsComponent.data.length > 0) {
                    this.modelsViewData = this.localModelsComponent.data.map(x => {
                        const fileName = utils.getFileName(x);
                        return {
                            modelData: x,
                            modelDetails: {
                                modelName: fileName,
                                fileName: fileName
                            },
                            targetImportTable: this.importTable
                        };
                    });
                }
            }
            else if (this.modelSourceType === modelViewBase_1.ModelSourceType.Azure && this.azureModelsComponent) {
                if (this.azureModelsComponent.data !== undefined && this.azureModelsComponent.data.length > 0) {
                    this.modelsViewData = this.azureModelsComponent.data.map(x => {
                        var _a, _b, _c, _d, _e, _f;
                        return {
                            modelData: {
                                account: x.account,
                                subscription: x.subscription,
                                group: x.group,
                                workspace: x.workspace,
                                model: x.model
                            },
                            modelDetails: {
                                modelName: ((_a = x.model) === null || _a === void 0 ? void 0 : _a.name) || '',
                                fileName: (_b = x.model) === null || _b === void 0 ? void 0 : _b.name,
                                framework: (_c = x.model) === null || _c === void 0 ? void 0 : _c.framework,
                                frameworkVersion: (_d = x.model) === null || _d === void 0 ? void 0 : _d.frameworkVersion,
                                description: (_e = x.model) === null || _e === void 0 ? void 0 : _e.description,
                                created: (_f = x.model) === null || _f === void 0 ? void 0 : _f.createdTime
                            },
                            targetImportTable: this.importTable
                        };
                    });
                }
            }
            else if (this.modelSourceType === modelViewBase_1.ModelSourceType.RegisteredModels && this.registeredModelsComponent) {
                if (this.registeredModelsComponent.data !== undefined) {
                    this.modelsViewData = this.registeredModelsComponent.data.map(x => {
                        return {
                            modelData: x,
                            modelDetails: {
                                modelName: ''
                            },
                            targetImportTable: this.importTable
                        };
                    });
                }
            }
        });
    }
    disposePage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.azureModelsComponent) {
                yield this.azureModelsComponent.disposeComponent();
            }
            if (this.registeredModelsComponent) {
                yield this.registeredModelsComponent.disposeComponent();
            }
        });
    }
}
exports.ModelBrowsePage = ModelBrowsePage;
//# sourceMappingURL=modelBrowsePage.js.map