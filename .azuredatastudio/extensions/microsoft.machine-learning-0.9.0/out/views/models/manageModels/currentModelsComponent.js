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
exports.CurrentModelsComponent = void 0;
const constants = require("../../../common/constants");
const dataInfoComponent_1 = require("../../dataInfoComponent");
const modelViewBase_1 = require("../modelViewBase");
const currentModelsTable_1 = require("./currentModelsTable");
const tableSelectionComponent_1 = require("../tableSelectionComponent");
/**
 * View to render current registered models
 */
class CurrentModelsComponent extends modelViewBase_1.ModelViewBase {
    /**
     *
     * @param apiWrapper Creates new view
     * @param parent page parent
     */
    constructor(apiWrapper, parent, _settings) {
        super(apiWrapper, parent.root, parent);
        this._settings = _settings;
    }
    /**
     *
     * @param modelBuilder register the components
     */
    registerComponent(modelBuilder) {
        this._tableSelectionComponent = new tableSelectionComponent_1.TableSelectionComponent(this._apiWrapper, this, {
            editable: false,
            preSelected: true,
            databaseTitle: constants.databaseName,
            tableTitle: constants.tableName,
            databaseInfo: constants.modelDatabaseInfo,
            tableInfo: constants.modelTableInfo,
            layout: 'vertical',
            defaultDbName: constants.selectModelDatabaseTitle,
            defaultTableName: constants.selectModelTableTitle,
            useImportModelCache: true
        });
        this._tableSelectionComponent.registerComponent(modelBuilder);
        this._tableSelectionComponent.onSelectedChanged(() => __awaiter(this, void 0, void 0, function* () {
            yield this.onTableSelected();
        }));
        this._dataTable = new currentModelsTable_1.CurrentModelsTable(this._apiWrapper, this, this._settings);
        this._dataTable.registerComponent(modelBuilder);
        let dataCountString = constants.getDataCount(0);
        this._tableDataCountContainer = modelBuilder.flexContainer().component();
        this._tableDataCountComponent = modelBuilder.text().withProperties({
            value: dataCountString,
            margin: '0'
        }).component();
        this._tableDataCountContainer.addItem(this._tableDataCountComponent, {
            CSSStyles: {
                'font-size': '13px',
                'margin': '0'
            }
        });
        let formModelBuilder = modelBuilder.formContainer();
        this._loader = modelBuilder.loadingComponent()
            .withItem(formModelBuilder.component())
            .withProperties({
            loading: true
        }).component();
        this._emptyModelsComponent = new dataInfoComponent_1.DataInfoComponent(this._apiWrapper, this);
        this._emptyModelsComponent.width = 200;
        this._emptyModelsComponent.height = 250;
        this._emptyModelsComponent.title = constants.modelsListEmptyMessage;
        this._emptyModelsComponent.description = constants.modelsListEmptyDescription;
        this._emptyModelsComponent.iconSettings = {
            css: { 'padding-top': '30px' },
            path: this.asAbsolutePath('images/emptyTable.svg'),
            width: 128,
            height: 128
        };
        this._emptyModelsComponent.registerComponent(modelBuilder);
        this._labelContainer = modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '750px',
            height: '400px',
            justifyContent: 'flex-start',
            textAlign: 'center'
        }).component();
        this._subheadingContainer = modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '452px'
        }).component();
        this._subheadingTextComponent = modelBuilder.text().withProperties({
            value: this.modelActionType === modelViewBase_1.ModelActionType.Import ? constants.viewImportModelsDesc : constants.viewImportModeledForPredictDesc,
            CSSStyles: {
                'font-size': '13px'
            }
        }).component();
        this._subheadingLinkComponent = modelBuilder.hyperlink().withProperties({
            label: constants.learnMoreLink,
            url: constants.importModelsDoc,
            CSSStyles: {
                'font-size': '13px'
            }
        }).component();
        if (this._emptyModelsComponent.component) {
            this._labelContainer.addItem(this._emptyModelsComponent.component, {
                CSSStyles: {
                    'margin': '0 auto'
                }
            });
        }
        this._subheadingContainer.addItems([this._subheadingTextComponent, this._subheadingLinkComponent]);
        this.addComponents(formModelBuilder);
        return this._loader;
    }
    addComponents(formBuilder) {
        if (this.modelSourceType === modelViewBase_1.ModelSourceType.RegisteredModels) {
            this._formBuilder = formBuilder;
            if (this._tableSelectionComponent && this._dataTable && this._tableDataCountContainer && this._labelContainer && this._subheadingContainer) {
                formBuilder.addFormItem({ title: '', component: this._subheadingContainer });
                this._tableSelectionComponent.addComponents(formBuilder);
                formBuilder.addFormItem({ title: '', component: this._tableDataCountContainer });
                this._dataTable.addComponents(formBuilder);
                if (this._dataTable.isEmpty) {
                    formBuilder.addFormItem({ title: '', component: this._labelContainer });
                }
                if (this._tableDataCountComponent) {
                    this._tableDataCountComponent.value = constants.getDataCount(this._dataTable.modelCounts);
                }
            }
        }
    }
    removeComponents(formBuilder) {
        if (this._tableSelectionComponent && this._dataTable && this._labelContainer && this._tableDataCountContainer && this._subheadingContainer) {
            this._tableSelectionComponent.removeComponents(formBuilder);
            this._dataTable.removeComponents(formBuilder);
            formBuilder.removeFormItem({ title: '', component: this._labelContainer });
            formBuilder.removeFormItem({ title: '', component: this._tableDataCountContainer });
            formBuilder.removeFormItem({ title: '', component: this._subheadingContainer });
        }
    }
    /**
     * Returns the component
     */
    get component() {
        return this._loader;
    }
    /**
     * Refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._emptyModelsComponent) {
                yield this._emptyModelsComponent.refresh();
            }
            yield this.onLoading();
            try {
                if (this._tableSelectionComponent && this._dataTable) {
                    yield this._tableSelectionComponent.refresh();
                    this.refreshComponents();
                }
            }
            catch (err) {
                this.showErrorMessage(constants.getErrorMessage(err));
            }
            finally {
                yield this.onLoaded();
            }
        });
    }
    get data() {
        var _a;
        return (_a = this._dataTable) === null || _a === void 0 ? void 0 : _a.data;
    }
    refreshComponents() {
        if (this._formBuilder) {
            this.removeComponents(this._formBuilder);
            this.addComponents(this._formBuilder);
        }
    }
    onTableSelected() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this._tableSelectionComponent) === null || _a === void 0 ? void 0 : _a.data) {
                if ((_b = this._tableSelectionComponent) === null || _b === void 0 ? void 0 : _b.isDataValid) {
                    this.importTable = (_c = this._tableSelectionComponent) === null || _c === void 0 ? void 0 : _c.data;
                    yield this.storeImportConfigTable();
                }
                if (this._dataTable) {
                    yield this._dataTable.refresh();
                    if (this._emptyModelsComponent) {
                        if ((_d = this._tableSelectionComponent) === null || _d === void 0 ? void 0 : _d.defaultDbNameIsSelected) {
                            this._emptyModelsComponent.title = constants.selectModelDatabaseMessage;
                            this._emptyModelsComponent.description = '';
                        }
                        else if ((_e = this._tableSelectionComponent) === null || _e === void 0 ? void 0 : _e.defaultTableNameIsSelected) {
                            this._emptyModelsComponent.title = constants.selectModelTableMessage;
                            this._emptyModelsComponent.description = '';
                        }
                        else {
                            this._emptyModelsComponent.title = constants.modelsListEmptyMessage;
                            this._emptyModelsComponent.description = constants.modelsListEmptyDescription;
                        }
                        yield this._emptyModelsComponent.refresh();
                    }
                    if (this._tableDataCountComponent) {
                        this._tableDataCountComponent.value = constants.getDataCount(this._dataTable.modelCounts);
                    }
                }
                this.refreshComponents();
            }
        });
    }
    get modelTable() {
        return this._dataTable;
    }
    /**
     * disposes the view
     */
    disposeComponent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._dataTable) {
                yield this._dataTable.disposeComponent();
            }
        });
    }
    /**
     * returns the title of the page
     */
    get title() {
        return constants.currentModelsTitle;
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
}
exports.CurrentModelsComponent = CurrentModelsComponent;
//# sourceMappingURL=currentModelsComponent.js.map