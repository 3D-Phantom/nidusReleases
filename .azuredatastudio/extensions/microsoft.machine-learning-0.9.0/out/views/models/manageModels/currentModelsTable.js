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
exports.CurrentModelsTable = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const constants = require("../../../common/constants");
const modelViewBase_1 = require("../modelViewBase");
const modelArtifact_1 = require("../prediction/modelArtifact");
const utils = require("../../../common/utils");
/**
 * View to render registered models table
 */
class CurrentModelsTable extends modelViewBase_1.ModelViewBase {
    /**
     * Creates new view
     */
    constructor(apiWrapper, parent, _settings) {
        super(apiWrapper, parent.root, parent);
        this._settings = _settings;
        this._selectedModels = [];
        this._onModelSelectionChanged = new vscode.EventEmitter();
        this.onModelSelectionChanged = this._onModelSelectionChanged.event;
        this.modelCounts = 0;
    }
    /**
     *
     * @param modelBuilder register the components
     */
    registerComponent(modelBuilder) {
        this._modelBuilder = modelBuilder;
        let columns = [];
        if (this._settings.selectable) {
            columns.push({
                displayName: '',
                valueType: azdata.DeclarativeDataType.component,
                isReadOnly: true,
                width: 50,
                headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
            });
        }
        columns.push(...[
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
                width: 150,
                headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
            },
            {
                displayName: constants.modelVersion,
                ariaLabel: constants.modelVersion,
                valueType: azdata.DeclarativeDataType.string,
                isReadOnly: true,
                width: 150,
                headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
            },
            {
                displayName: constants.modelFramework,
                ariaLabel: constants.modelFramework,
                valueType: azdata.DeclarativeDataType.string,
                isReadOnly: true,
                width: 150,
                headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
            }
        ]);
        if (this._settings.editable) {
            columns.push(...[{
                    displayName: '',
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
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
            ]);
            columns.push({
                displayName: '',
                valueType: azdata.DeclarativeDataType.component,
                isReadOnly: true,
                width: 50,
                headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
            });
        }
        this._table = modelBuilder.declarativeTable()
            .withProperties({
            columns: columns,
            data: [],
            ariaLabel: constants.mlsConfigTitle
        })
            .component();
        this._loader = modelBuilder.loadingComponent()
            .withItem(this._table)
            .withProperties({
            loading: true
        }).component();
        return this._loader;
    }
    addComponents(formBuilder) {
        if (this.component) {
            formBuilder.addFormItem({ title: '', component: this.component });
        }
    }
    removeComponents(formBuilder) {
        if (this.component) {
            formBuilder.removeFormItem({ title: '', component: this.component });
        }
    }
    /**
     * Returns the component
     */
    get component() {
        return this._loader;
    }
    set selectedModels(value) {
        this._selectedModels = value;
    }
    /**
     * Loads the data in the component
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onLoading();
            if (this._table) {
                let models;
                if (this.importTable) {
                    models = yield this.listModels(this.importTable);
                }
                let tableData = [];
                if (models) {
                    tableData = tableData.concat(models.map(model => this.createTableRow(model)));
                }
                this.modelCounts = models === undefined || models.length === 0 ? 0 : models.length;
                this._table.data = tableData;
            }
            else {
                this.modelCounts = 0;
            }
            this.onModelSelected();
            yield this.onLoaded();
        });
    }
    onLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader) {
                this._loader.loading = true;
            }
        });
    }
    onLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader) {
                this._loader.loading = false;
            }
        });
    }
    get isEmpty() {
        return this.modelCounts === 0;
    }
    createTableRow(model) {
        let row = [model.modelName, model.created, model.version, model.framework];
        if (this._modelBuilder) {
            const selectButton = this.createSelectButton(model);
            if (selectButton) {
                row = [selectButton, model.modelName, model.created, model.version, model.framework];
            }
            const editButtons = this.createEditButtons(model);
            if (editButtons && editButtons.length > 0) {
                row = row.concat(editButtons);
            }
        }
        return row;
    }
    createSelectButton(model) {
        let selectModelButton = undefined;
        if (this._modelBuilder && this._settings.selectable) {
            let onSelectItem = (checked) => {
                if (!this._settings.multiSelect) {
                    this._selectedModels = [];
                }
                const foundItem = this._selectedModels.find(x => x === model);
                if (checked && !foundItem) {
                    this._selectedModels.push(model);
                }
                else if (foundItem) {
                    this._selectedModels = this._selectedModels.filter(x => x !== model);
                }
                this.onModelSelected();
            };
            if (this._settings.multiSelect) {
                const checkbox = this._modelBuilder.checkBox().withProperties({
                    name: 'amlModel',
                    value: model.id,
                    width: 15,
                    height: 15,
                    checked: this._selectedModels && this._selectedModels.find(x => x.id === model.id)
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
                    checked: this._selectedModels && this._selectedModels.find(x => x.id === model.id)
                }).component();
                radioButton.onDidClick(() => {
                    onSelectItem(radioButton.checked || false);
                });
                selectModelButton = radioButton;
            }
        }
        return selectModelButton;
    }
    createEditButtons(model) {
        let dropButton = undefined;
        let predictButton = undefined;
        let editButton = undefined;
        if (this._modelBuilder && this._settings.editable) {
            dropButton = this._modelBuilder.button().withProperties({
                label: '',
                title: constants.deleteTitle,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/delete_inverse.svg'),
                    light: this.asAbsolutePath('images/light/delete.svg')
                },
                width: 16,
                height: 16
            }).component();
            dropButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const confirm = yield utils.promptConfirm(constants.confirmDeleteModel(model.modelName), this._apiWrapper);
                    if (confirm) {
                        yield this.sendDataRequest(modelViewBase_1.DeleteModelEventName, model);
                        if (this.parent) {
                            yield this.parent.refresh();
                        }
                    }
                }
                catch (error) {
                    this.showErrorMessage(`${constants.updateModelFailedError} ${constants.getErrorMessage(error)}`);
                }
            }));
            predictButton = this._modelBuilder.button().withProperties({
                label: '',
                title: constants.predictModel,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/predict_inverse.svg'),
                    light: this.asAbsolutePath('images/light/predict.svg')
                },
                width: 16,
                height: 16
            }).component();
            predictButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.sendDataRequest(modelViewBase_1.PredictWizardEventName, [model]);
            }));
            editButton = this._modelBuilder.button().withProperties({
                label: '',
                title: constants.editTitle,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/edit_inverse.svg'),
                    light: this.asAbsolutePath('images/light/edit.svg')
                },
                width: 16,
                height: 16
            }).component();
            editButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.sendDataRequest(modelViewBase_1.EditModelEventName, model);
            }));
        }
        return editButton && dropButton && predictButton ? [editButton, dropButton, predictButton] : undefined;
    }
    onModelSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            this._onModelSelectionChanged.fire();
            if (this._downloadedFile) {
                yield this._downloadedFile.close();
            }
            this._downloadedFile = undefined;
        });
    }
    /**
     * Returns selected data
     */
    get data() {
        return this._selectedModels;
    }
    getDownloadedModel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._downloadedFile && this.data && this.data.length > 0) {
                this._downloadedFile = new modelArtifact_1.ModelArtifact(yield this.downloadRegisteredModel(this.data[0]));
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
exports.CurrentModelsTable = CurrentModelsTable;
//# sourceMappingURL=currentModelsTable.js.map