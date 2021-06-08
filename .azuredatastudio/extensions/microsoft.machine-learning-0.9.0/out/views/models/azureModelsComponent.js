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
exports.AzureModelsComponent = void 0;
const modelViewBase_1 = require("./modelViewBase");
const azureResourceFilterComponent_1 = require("./azureResourceFilterComponent");
const azureModelsTable_1 = require("./azureModelsTable");
const modelArtifact_1 = require("./prediction/modelArtifact");
const azureSignInComponent_1 = require("./azureSignInComponent");
const dataInfoComponent_1 = require("../dataInfoComponent");
const constants = require("../../common/constants");
class AzureModelsComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Component to render a view to pick an azure model
     */
    constructor(apiWrapper, parent, _multiSelect = true) {
        super(apiWrapper, parent.root, parent);
        this._multiSelect = _multiSelect;
    }
    /**
     * Register components
     * @param modelBuilder model builder
     */
    registerComponent(modelBuilder) {
        this.azureFilterComponent = new azureResourceFilterComponent_1.AzureResourceFilterComponent(this._apiWrapper, modelBuilder, this);
        this.azureModelsTable = new azureModelsTable_1.AzureModelsTable(this._apiWrapper, modelBuilder, this, this._multiSelect);
        this.azureSignInComponent = new azureSignInComponent_1.AzureSignInComponent(this._apiWrapper, modelBuilder, this);
        this._loader = modelBuilder.loadingComponent()
            .withItem(this.azureModelsTable.component)
            .withProperties({
            loading: true
        }).component();
        this.azureModelsTable.onModelSelectionChanged(() => __awaiter(this, void 0, void 0, function* () {
            if (this._downloadedFile) {
                yield this._downloadedFile.close();
            }
            this._downloadedFile = undefined;
        }));
        this._emptyModelsComponent = new dataInfoComponent_1.DataInfoComponent(this._apiWrapper, this);
        this._emptyModelsComponent.width = 200;
        this._emptyModelsComponent.height = 250;
        this._emptyModelsComponent.iconSettings = {
            css: { 'padding-top': '30px' },
            width: 128,
            height: 128
        };
        this._emptyModelsComponent.registerComponent(modelBuilder);
        this.azureFilterComponent.onWorkspacesSelectedChanged(() => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            yield this.onLoading();
            yield ((_a = this.azureModelsTable) === null || _a === void 0 ? void 0 : _a.loadData((_b = this.azureFilterComponent) === null || _b === void 0 ? void 0 : _b.data));
            if (this._emptyModelsComponent) {
                if ((_c = this.azureModelsTable) === null || _c === void 0 ? void 0 : _c.isTableEmpty) {
                    this._emptyModelsComponent.title = constants.azureModelsListEmptyTitle;
                    this._emptyModelsComponent.description = constants.azureModelsListEmptyDescription;
                    this._emptyModelsComponent.iconSettings.path = this.asAbsolutePath('images/emptyTable.svg');
                }
                else {
                    this._emptyModelsComponent.title = '';
                    this._emptyModelsComponent.description = '';
                    this._emptyModelsComponent.iconSettings.path = 'noicon';
                }
                yield this._emptyModelsComponent.refresh();
            }
            yield this.onLoaded();
        }));
        this._form = modelBuilder.formContainer().withFormItems([{
                title: '',
                component: this.azureFilterComponent.component
            }, {
                title: '',
                component: this._loader
            }]).component();
        return this._form;
    }
    addComponents(formBuilder) {
        var _a;
        if (this.modelSourceType === modelViewBase_1.ModelSourceType.Azure) {
            this.removeComponents(formBuilder);
            if ((_a = this.azureFilterComponent) === null || _a === void 0 ? void 0 : _a.accountIsValid) {
                this.addAzureComponents(formBuilder);
            }
            else {
                this.addAzureSignInComponents(formBuilder);
            }
        }
    }
    removeComponents(formBuilder) {
        this.removeAzureComponents(formBuilder);
        this.removeAzureSignInComponents(formBuilder);
    }
    addAzureComponents(formBuilder) {
        var _a;
        if (this.azureFilterComponent && this._loader && ((_a = this._emptyModelsComponent) === null || _a === void 0 ? void 0 : _a.component)) {
            this.azureFilterComponent.addComponents(formBuilder);
            formBuilder.addFormItems([{
                    title: '',
                    component: this._loader
                }], { horizontal: true });
            formBuilder.addFormItems([{
                    title: '',
                    component: this._emptyModelsComponent.component
                }], { horizontal: true });
        }
    }
    removeAzureComponents(formBuilder) {
        var _a;
        if (this.azureFilterComponent && this._loader && ((_a = this._emptyModelsComponent) === null || _a === void 0 ? void 0 : _a.component)) {
            this.azureFilterComponent.removeComponents(formBuilder);
            formBuilder.removeFormItem({
                title: '',
                component: this._loader
            });
            formBuilder.removeFormItem({
                title: '',
                component: this._emptyModelsComponent.component
            });
        }
    }
    addAzureSignInComponents(formBuilder) {
        if (this.azureSignInComponent) {
            this.azureSignInComponent.addComponents(formBuilder);
        }
    }
    removeAzureSignInComponents(formBuilder) {
        if (this.azureSignInComponent) {
            this.azureSignInComponent.removeComponents(formBuilder);
        }
    }
    onLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader) {
                yield this._loader.updateProperties({ loading: true });
            }
        });
    }
    onLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader) {
                yield this._loader.updateProperties({ loading: false });
            }
        });
    }
    get component() {
        return this._form;
    }
    /**
     * Loads the data in the components
     */
    loadData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onLoaded();
            yield ((_a = this.azureFilterComponent) === null || _a === void 0 ? void 0 : _a.loadData());
        });
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a, _b;
        return ((_a = this.azureModelsTable) === null || _a === void 0 ? void 0 : _a.data) ? (_b = this.azureModelsTable) === null || _b === void 0 ? void 0 : _b.data.map(x => {
            var _a;
            return Object.assign({}, (_a = this.azureFilterComponent) === null || _a === void 0 ? void 0 : _a.data, {
                model: x
            });
        }) : undefined;
    }
    getDownloadedModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.data;
            if (!this._downloadedFile && data && data.length > 0) {
                this._downloadedFile = new modelArtifact_1.ModelArtifact(yield this.downloadAzureModel(data[0]));
            }
            return this._downloadedFile;
        });
    }
    /**
     * disposes the view
     */
    disposeComponent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._downloadedFile) {
                yield this._downloadedFile.close();
            }
        });
    }
    /**
     * Refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadData();
        });
    }
}
exports.AzureModelsComponent = AzureModelsComponent;
//# sourceMappingURL=azureModelsComponent.js.map