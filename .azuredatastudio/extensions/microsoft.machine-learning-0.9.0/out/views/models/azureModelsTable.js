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
exports.AzureModelsTable = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const constants = require("../../common/constants");
const modelViewBase_1 = require("./modelViewBase");
/**
 * View to render azure models in a table
 */
class AzureModelsTable extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a view to render azure models in a table
     */
    constructor(apiWrapper, _modelBuilder, parent, _multiSelect = true) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
        this._multiSelect = _multiSelect;
        this._selectedModel = [];
        this._onModelSelectionChanged = new vscode.EventEmitter();
        this.onModelSelectionChanged = this._onModelSelectionChanged.event;
        this._table = this.registerComponent(this._modelBuilder);
    }
    /**
     * Register components
     * @param modelBuilder model builder
     */
    registerComponent(modelBuilder) {
        this._table = modelBuilder.declarativeTable()
            .withProperties({
            columns: [
                {
                    displayName: '',
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.modelName,
                    ariaLabel: constants.modelName,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 150,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.modelCreated,
                    ariaLabel: constants.modelCreated,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 100,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.modelFramework,
                    ariaLabel: constants.modelFramework,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 100,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.modelFrameworkVersion,
                    ariaLabel: constants.modelFrameworkVersion,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 100,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                }
            ],
            data: [],
            ariaLabel: constants.mlsConfigTitle
        })
            .component();
        return this._table;
    }
    get component() {
        return this._table;
    }
    /**
     * Load data in the component
     * @param workspaceResource Azure workspace
     */
    loadData(workspaceResource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._table) {
                if (workspaceResource) {
                    this._models = yield this.listAzureModels(workspaceResource);
                    let tableData = [];
                    if (this._models) {
                        tableData = tableData.concat(this._models.map(model => this.createTableRow(model)));
                    }
                    if (this.isTableEmpty) {
                        this._table.dataValues = [];
                        this._table.data = [];
                    }
                    else {
                        this._table.data = tableData;
                    }
                }
                else {
                    this._table.dataValues = [];
                    this._table.data = [];
                }
            }
            this._onModelSelectionChanged.fire();
        });
    }
    get isTableEmpty() {
        return !this._models || this._models.length === 0;
    }
    createTableRow(model) {
        if (this._modelBuilder) {
            let selectModelButton;
            let onSelectItem = (checked) => {
                const foundItem = this._selectedModel.find(x => x === model);
                if (checked && !foundItem) {
                    this._selectedModel.push(model);
                }
                else if (foundItem) {
                    this._selectedModel = this._selectedModel.filter(x => x !== model);
                }
                this._onModelSelectionChanged.fire();
            };
            if (this._multiSelect) {
                const checkbox = this._modelBuilder.checkBox().withProperties({
                    name: 'amlModel',
                    value: model.id,
                    width: 15,
                    height: 15,
                    checked: false
                }).component();
                checkbox.onChanged(() => {
                    onSelectItem(checkbox.checked || false);
                });
                selectModelButton = checkbox;
            }
            else {
                const radioButton = this._modelBuilder.radioButton().withProperties({
                    name: 'amlModel',
                    value: model.id,
                    width: 15,
                    height: 15,
                    checked: false
                }).component();
                radioButton.onDidClick(() => {
                    onSelectItem(radioButton.checked || false);
                });
                selectModelButton = radioButton;
            }
            return [selectModelButton, model.name, model.createdTime, model.framework, model.frameworkVersion];
        }
        return [];
    }
    /**
     * Returns selected data
     */
    get data() {
        if (this._models && this._selectedModel) {
            return this._selectedModel;
        }
        return undefined;
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
exports.AzureModelsTable = AzureModelsTable;
//# sourceMappingURL=azureModelsTable.js.map