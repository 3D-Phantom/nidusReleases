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
exports.ModelsDetailsTableComponent = void 0;
const azdata = require("azdata");
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
/**
 * View to pick local models file
 */
class ModelsDetailsTableComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates new view
     */
    constructor(apiWrapper, _modelBuilder, parent) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
    }
    /**
     *
     * @param modelBuilder Register the components
     */
    registerComponent(modelBuilder) {
        this._table = modelBuilder.declarativeTable()
            .withProperties({
            columns: [
                {
                    displayName: constants.modelFileName,
                    ariaLabel: constants.modelFileName,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 150,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.modelName,
                    ariaLabel: constants.modelName,
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 150,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.modelDescription,
                    ariaLabel: constants.modelDescription,
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 100,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: '',
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
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
    addComponents(formBuilder) {
        if (this._table) {
            formBuilder.addFormItems([{
                    title: '',
                    component: this._table
                }]);
        }
    }
    removeComponents(formBuilder) {
        if (this._table) {
            formBuilder.removeFormItem({
                title: '',
                component: this._table
            });
        }
    }
    /**
     * Load data in the component
     * @param workspaceResource Azure workspace
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            const models = this.modelsViewData;
            if (this._table && models) {
                let tableData = [];
                tableData = tableData.concat(models.map(model => this.createTableRow(model)));
                this._table.data = tableData;
                if (tableData.length === 0) {
                    this._table.dataValues = tableData;
                }
            }
        });
    }
    createTableRow(model) {
        if (this._modelBuilder && model && model.modelDetails) {
            const nameComponent = this._modelBuilder.inputBox().withProperties({
                value: model.modelDetails.modelName,
                width: this.componentMaxLength - 100,
                required: true
            }).component();
            const descriptionComponent = this._modelBuilder.inputBox().withProperties({
                value: model.modelDetails.description,
                width: this.componentMaxLength
            }).component();
            descriptionComponent.onTextChanged(() => {
                if (model.modelDetails) {
                    model.modelDetails.description = descriptionComponent.value;
                }
            });
            nameComponent.onTextChanged(() => {
                if (model.modelDetails) {
                    model.modelDetails.modelName = nameComponent.value || '';
                }
            });
            let deleteButton = this._modelBuilder.button().withProperties({
                label: '',
                title: constants.deleteTitle,
                width: 15,
                height: 15,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/delete_inverse.svg'),
                    light: this.asAbsolutePath('images/light/delete.svg')
                },
            }).component();
            deleteButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
                this.modelsViewData = this.modelsViewData.filter(x => x !== model);
                yield this.refresh();
            }));
            return [model.modelDetails.fileName, nameComponent, descriptionComponent, deleteButton];
        }
        return [];
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
        return this._table;
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
exports.ModelsDetailsTableComponent = ModelsDetailsTableComponent;
//# sourceMappingURL=modelsDetailsTableComponent.js.map