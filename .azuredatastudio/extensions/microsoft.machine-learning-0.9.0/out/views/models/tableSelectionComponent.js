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
exports.TableSelectionComponent = void 0;
const vscode = require("vscode");
const modelViewBase_1 = require("./modelViewBase");
/**
 * View to render filters to pick an azure resource
 */
class TableSelectionComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a new view
     */
    constructor(apiWrapper, parent, _settings) {
        super(apiWrapper, parent.root, parent);
        this._settings = _settings;
        this._selectedTableName = '';
        this._selectedDatabaseName = '';
        this._dbNames = [];
        this._tableNames = [];
        this.tableMaxLength = this.componentMaxLength * 2 + 70;
        this._onSelectedChanged = new vscode.EventEmitter();
        this._existingTablesSelected = true;
        this.onSelectedChanged = this._onSelectedChanged.event;
    }
    /**
     * Register components
     * @param modelBuilder model builder
     */
    registerComponent(modelBuilder) {
        this._databases = modelBuilder.dropDown().withProperties({
            width: '275px'
        }).component();
        this._tables = modelBuilder.dropDown().withProperties({
            width: '275px'
        }).component();
        this._databases.onValueChanged((value) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (((_a = this._databases) === null || _a === void 0 ? void 0 : _a.values) && this._selectedDatabaseName !== value.selected) {
                this._selectedDatabaseName = value.selected;
                yield this.onDatabaseSelected();
            }
        }));
        this._existingTableButton = modelBuilder.radioButton().withProperties({
            name: 'tableName',
            value: 'existing',
            label: 'Existing table',
            checked: true
        }).component();
        this._newTableButton = modelBuilder.radioButton().withProperties({
            name: 'tableName',
            value: 'new',
            label: 'New table',
            checked: false
        }).component();
        this._newTableName = modelBuilder.inputBox().withProperties({
            width: this.componentMaxLength - 10,
            enabled: false
        }).component();
        const group = modelBuilder.groupContainer().withItems([
            this._existingTableButton,
            this._tables,
            this._newTableButton,
            this._newTableName
        ], {
            CSSStyles: {
                'padding-top': '5px'
            }
        }).component();
        this._existingTableButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            this._existingTablesSelected = true;
            this.refreshTableComponent();
            this._selectedTableName = (_c = (_b = this._tables) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '';
            yield this.onTableSelected();
        }));
        this._newTableButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
            this._existingTablesSelected = false;
            this.refreshTableComponent();
            this._selectedTableName = '';
            yield this.onTableSelected();
        }));
        this._newTableName.onTextChanged(() => __awaiter(this, void 0, void 0, function* () {
            if (this._newTableName) {
                this._selectedTableName = this._newTableName.value || '';
                yield this.onTableSelected();
            }
        }));
        this._tables.onValueChanged((value) => __awaiter(this, void 0, void 0, function* () {
            // There's an issue with dropdown doesn't set the value in editable mode. this is the workaround
            if (this._tables && value && this._selectedTableName !== value.selected) {
                this._selectedTableName = value.selected;
                yield this.onTableSelected();
            }
        }));
        const databaseForm = modelBuilder.formContainer().withFormItems([{
                title: this._settings.databaseTitle,
                component: this._databases,
            }], { info: this._settings.databaseInfo }).withLayout({
            padding: '0px'
        }).component();
        const tableForm = modelBuilder.formContainer();
        if (this._settings.editable) {
            tableForm.addFormItem({
                title: this._settings.tableTitle,
                component: group
            }, { info: this._settings.tableInfo });
        }
        else {
            tableForm.addFormItem({
                title: this._settings.tableTitle,
                component: this._tables
            }, { info: this._settings.tableInfo });
        }
        this._dbTableComponent = modelBuilder.flexContainer().withItems([
            databaseForm,
            tableForm.withLayout({
                padding: '0px'
            }).component()
        ], {
            flex: '0 0 auto',
            CSSStyles: {
                'align-items': 'flex-start',
                'padding-right': '16px',
            }
        }).withLayout({
            flexFlow: this._settings.layout === 'horizontal' ? 'row' : 'column',
            justifyContent: 'flex-start',
            width: this.tableMaxLength
        }).component();
        this._form = modelBuilder.formContainer().withFormItems([{
                title: '',
                component: this._dbTableComponent
            }]).component();
        return this._form;
    }
    addComponents(formBuilder) {
        if (this._dbTableComponent) {
            formBuilder.addFormItems([{
                    title: '',
                    component: this._dbTableComponent
                }]);
        }
    }
    removeComponents(formBuilder) {
        if (this._dbTableComponent) {
            formBuilder.removeFormItem({
                title: '',
                component: this._dbTableComponent
            });
        }
    }
    /**
     * Returns the created component
     */
    get component() {
        return this._dbTableComponent;
    }
    /**
     * Returns selected data
     */
    get data() {
        return this.databaseTable;
    }
    /**
     * Returns selected data
     */
    get defaultDbNameIsSelected() {
        return this.data === undefined || this.data.databaseName === this._settings.defaultDbName;
    }
    /**
     * Returns selected data
     */
    get defaultTableNameIsSelected() {
        return this.data === undefined || this.data.tableName === this._settings.defaultTableName;
    }
    get isDataValid() {
        return this.data !== undefined && this.data.databaseName !== '' && this.data.tableName !== '' && this.data.databaseName !== undefined && this.data.tableName !== undefined && this.data.databaseName !== this._settings.defaultDbName && this.data.tableName !== this._settings.defaultTableName;
    }
    /**
     * loads data in the components
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            this._dbNames = yield this.listDatabaseNames();
            let dbNames = this._dbNames;
            if (!this._dbNames.find(x => x === this._settings.defaultDbName)) {
                dbNames = [this._settings.defaultDbName].concat(this._dbNames);
            }
            if (this._databases && dbNames && dbNames.length > 0) {
                this._databases.values = dbNames;
                if (this.importTable && this._settings.preSelected) {
                    this._databases.value = this.importTable.databaseName;
                }
                else {
                    this._databases.value = dbNames[0];
                }
            }
            yield this.onDatabaseSelected();
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
    onDatabaseSelected() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._tableNames = yield this.listTableNames(this.databaseName || '');
            let tableNames = this._tableNames;
            if (this._settings.editable && this._tables && this._existingTableButton && this._newTableButton && this._newTableName) {
                this._existingTablesSelected = this._tableNames !== undefined && this._tableNames.length > 0;
                this._newTableButton.checked = !this._existingTablesSelected;
                this._existingTableButton.checked = this._existingTablesSelected;
            }
            this.refreshTableComponent();
            if (this._tableNames && !this._tableNames.find(x => x.tableName === this._settings.defaultTableName)) {
                const firstRow = { tableName: this._settings.defaultTableName, databaseName: '', schema: '' };
                tableNames = [firstRow].concat(this._tableNames);
            }
            if (this._tables && tableNames && tableNames.length > 0) {
                this._tables.values = tableNames.map(t => this.getTableFullName(t));
                if (this._settings.useImportModelCache && this.importTable && this.importTable.databaseName === ((_a = this._databases) === null || _a === void 0 ? void 0 : _a.value)) {
                    const selectedTable = tableNames.find(t => { var _a, _b; return t.tableName === ((_a = this.importTable) === null || _a === void 0 ? void 0 : _a.tableName) && t.schema === ((_b = this.importTable) === null || _b === void 0 ? void 0 : _b.schema); });
                    if (selectedTable) {
                        this._selectedTableName = this.getTableFullName(selectedTable);
                        this._tables.value = this.getTableFullName(selectedTable);
                    }
                    else {
                        this._selectedTableName = this._settings.editable ? this.getTableFullName(this.importTable) : this.getTableFullName(tableNames[0]);
                    }
                }
                else {
                    this._selectedTableName = this.getTableFullName(tableNames[0]);
                }
                this._tables.value = this._selectedTableName;
            }
            else if (this._tables) {
                this._tables.values = [];
                this._tables.value = '';
            }
            yield this.onTableSelected();
        });
    }
    refreshTableComponent() {
        if (this._settings.editable && this._tables && this._existingTableButton && this._newTableButton && this._newTableName) {
            this._tables.enabled = this._existingTablesSelected;
            this._newTableName.enabled = !this._existingTablesSelected;
        }
    }
    getTableFullName(table) {
        return table.tableName === this._settings.defaultTableName ? table.tableName : `${table.schema}.${table.tableName}`;
    }
    onTableSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            this._onSelectedChanged.fire();
        });
    }
    get databaseName() {
        var _a;
        return (_a = this._databases) === null || _a === void 0 ? void 0 : _a.value;
    }
    get databaseTable() {
        let selectedItem = this._tableNames.find(x => this.getTableFullName(x) === this._selectedTableName);
        if (!selectedItem) {
            const value = this._selectedTableName;
            const parts = value ? value.split('.') : undefined;
            selectedItem = {
                databaseName: this.databaseName,
                tableName: parts && parts.length > 1 ? parts[1] : value,
                schema: parts && parts.length > 1 ? parts[0] : 'dbo',
            };
        }
        return {
            databaseName: this.databaseName,
            tableName: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.tableName,
            schema: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.schema
        };
    }
}
exports.TableSelectionComponent = TableSelectionComponent;
//# sourceMappingURL=tableSelectionComponent.js.map