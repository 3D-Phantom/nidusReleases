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
exports.InputColumnsComponent = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const columnsTable_1 = require("./columnsTable");
const tableSelectionComponent_1 = require("../tableSelectionComponent");
/**
 * View to render filters to pick an azure resource
 */
class InputColumnsComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a new view
     */
    constructor(apiWrapper, parent) {
        super(apiWrapper, parent.root, parent);
    }
    /**
     * Register components
     * @param modelBuilder model builder
     */
    registerComponent(modelBuilder) {
        this._tableSelectionComponent = new tableSelectionComponent_1.TableSelectionComponent(this._apiWrapper, this, {
            editable: false,
            preSelected: false,
            databaseTitle: constants.columnDatabase,
            tableTitle: constants.columnTable,
            databaseInfo: constants.columnDatabaseInfo,
            tableInfo: constants.columnTableInfo,
            defaultDbName: constants.selectDatabaseTitle,
            defaultTableName: constants.selectTableTitle,
            useImportModelCache: false,
            layout: 'horizontal'
        });
        this._tableSelectionComponent.registerComponent(modelBuilder);
        this._tableSelectionComponent.onSelectedChanged(() => __awaiter(this, void 0, void 0, function* () {
            yield this.onTableSelected();
        }));
        this._columns = new columnsTable_1.ColumnsTable(this._apiWrapper, modelBuilder, this);
        this._form = modelBuilder.formContainer().withFormItems([{
                title: constants.inputColumns,
                component: this._columns.component
            }]).component();
        return this._form;
    }
    addComponents(formBuilder) {
        if (this._columns && this._tableSelectionComponent && this._tableSelectionComponent.component) {
            formBuilder.addFormItems([{
                    title: '',
                    component: this._tableSelectionComponent.component
                }, {
                    title: constants.inputColumns,
                    component: this._columns.component
                }]);
        }
    }
    removeComponents(formBuilder) {
        if (this._columns && this._tableSelectionComponent && this._tableSelectionComponent.component) {
            formBuilder.removeFormItem({
                title: '',
                component: this._tableSelectionComponent.component
            });
            formBuilder.removeFormItem({
                title: constants.inputColumns,
                component: this._columns.component
            });
        }
    }
    /**
     * Returns the created component
     */
    get component() {
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        return Object.assign({}, this.databaseTable, {
            inputColumns: this.columnNames
        });
    }
    get isDataValue() {
        var _a;
        return this._tableSelectionComponent !== undefined && ((_a = this._tableSelectionComponent) === null || _a === void 0 ? void 0 : _a.isDataValid);
    }
    /**
     * loads data in the components
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._tableSelectionComponent) {
                this._tableSelectionComponent.refresh();
            }
        });
    }
    set modelParameters(value) {
        this._modelParameters = value;
    }
    onLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._columns) {
                yield this._columns.onLoading();
            }
        });
    }
    onLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._columns) {
                yield this._columns.onLoaded();
            }
        });
    }
    /**
     * refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadData();
        });
    }
    onTableSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._tableSelectionComponent !== undefined && this._tableSelectionComponent.isDataValid) {
                yield this.loadWithTable(this.databaseTable);
            }
        });
    }
    loadWithTable(table) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._tableLoadingPromise) {
                try {
                    yield this._tableLoadingPromise;
                }
                catch (_b) {
                }
            }
            this._tableLoadingPromise = (_a = this._columns) === null || _a === void 0 ? void 0 : _a.loadInputs(this._modelParameters, table);
            yield this._tableLoadingPromise;
            this._tableLoadingPromise = undefined;
        });
    }
    get databaseTable() {
        var _a;
        let selectedItem = (_a = this._tableSelectionComponent) === null || _a === void 0 ? void 0 : _a.data;
        return {
            databaseName: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.databaseName,
            tableName: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.tableName,
            schema: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.schema
        };
    }
    get columnNames() {
        var _a;
        return (_a = this._columns) === null || _a === void 0 ? void 0 : _a.data;
    }
}
exports.InputColumnsComponent = InputColumnsComponent;
//# sourceMappingURL=inputColumnsComponent.js.map