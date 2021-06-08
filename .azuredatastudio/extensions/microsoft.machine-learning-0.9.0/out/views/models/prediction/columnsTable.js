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
exports.ColumnsTable = void 0;
const azdata = require("azdata");
const constants = require("../../../common/constants");
const modelViewBase_1 = require("../modelViewBase");
const WarningButtonDimensions = {
    height: 16,
    width: 16
};
/**
 * View to render azure models in a table
 */
class ColumnsTable extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a view to render azure models in a table
     */
    constructor(apiWrapper, _modelBuilder, parent, _forInput = true) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
        this._forInput = _forInput;
        this._parameters = [];
        this._loader = this.registerComponent(this._modelBuilder);
    }
    /**
     * Register components
     * @param modelBuilder model builder
     */
    registerComponent(modelBuilder) {
        let columnHeader;
        if (this._forInput) {
            columnHeader = [
                {
                    displayName: constants.columnName,
                    ariaLabel: constants.columnName,
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: '',
                    ariaLabel: '',
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.inputName,
                    ariaLabel: constants.inputName,
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 120,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                }
            ];
        }
        else {
            columnHeader = [
                {
                    displayName: constants.outputName,
                    ariaLabel: constants.outputName,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 200,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.displayName,
                    ariaLabel: constants.displayName,
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.dataTypeName,
                    ariaLabel: constants.dataTypeName,
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                }
            ];
        }
        this._table = modelBuilder.declarativeTable()
            .withProperties({
            columns: columnHeader,
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
        return this._loader;
    }
    /**
     * Load data in the component
     * @param workspaceResource Azure workspace
     */
    loadInputs(modelParameters, table) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onLoading();
            this._parameters = [];
            let tableData = [];
            if (this._table && table) {
                if (this._forInput) {
                    let columns;
                    try {
                        columns = yield this.listColumnNames(table);
                    }
                    catch (_a) {
                        columns = [];
                    }
                    if ((modelParameters === null || modelParameters === void 0 ? void 0 : modelParameters.inputs) && columns) {
                        tableData = tableData.concat(modelParameters.inputs.map(input => this.createInputTableRow(input, columns)));
                    }
                }
                this._table.data = tableData;
            }
            yield this.onLoaded();
        });
    }
    loadOutputs(modelParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            this.onLoading();
            this._parameters = [];
            let tableData = [];
            if (this._table) {
                if (!this._forInput) {
                    if ((modelParameters === null || modelParameters === void 0 ? void 0 : modelParameters.outputs) && constants.supportedDataTypes) {
                        tableData = tableData.concat(modelParameters.outputs.map(output => this.createOutputTableRow(output, constants.supportedDataTypes)));
                    }
                }
                this._table.data = tableData;
            }
            this.onLoaded();
        });
    }
    createOutputTableRow(modelParameter, dataTypes) {
        if (this._modelBuilder) {
            const outputContainer = this._modelBuilder.flexContainer().withLayout({
                flexFlow: 'row',
                width: this.componentMaxLength + 20,
                justifyContent: 'flex-start'
            }).component();
            const warningButton = this.createWarningButton();
            warningButton.onDidClick(() => {
                let warningButtonProperties = {
                    xPos: 0,
                    yPos: 0,
                    width: WarningButtonDimensions.width,
                    height: WarningButtonDimensions.height
                };
                this.openWarningCalloutDialog(constants.columnDataTypeMismatchWarningHeading, 'output-table-row-dialog', constants.outputColumnDataTypeNotSupportedWarning, constants.learnMoreLink, constants.mlExtDocLink, warningButtonProperties);
            });
            const css = {
                'padding-top': '5px',
                'padding-right': '5px',
                'margin': '0px'
            };
            const name = modelParameter.name;
            let dataType = dataTypes.find(x => x === modelParameter.type);
            if (!dataType) {
                // Output type not supported
                //
                dataType = dataTypes[0];
                outputContainer.addItem(warningButton, {
                    CSSStyles: css
                });
            }
            let nameInput = this._modelBuilder.dropDown().withProperties({
                values: dataTypes,
                width: this.componentMaxLength,
                value: dataType
            }).component();
            outputContainer.addItem(nameInput, {
                CSSStyles: {
                    'padding': '0px',
                    'padding-right': '10px',
                    'margin': '0px'
                }
            });
            this._parameters.push({ columnName: name, paramName: name, dataType: dataType });
            nameInput.onValueChanged(() => {
                const value = nameInput.value;
                if (value !== modelParameter.type) {
                    let selectedRow = this._parameters.find(x => x.paramName === name);
                    if (selectedRow) {
                        selectedRow.dataType = value;
                    }
                    outputContainer.addItem(warningButton, {
                        CSSStyles: css
                    });
                }
                else {
                    outputContainer.removeItem(warningButton);
                }
            });
            let displayNameInput = this._modelBuilder.inputBox().withProperties({
                value: name,
                width: 200
            }).component();
            displayNameInput.onTextChanged(() => {
                let selectedRow = this._parameters.find(x => x.paramName === name);
                if (selectedRow) {
                    selectedRow.columnName = displayNameInput.value || name;
                }
            });
            return [`${name}(${modelParameter.originalType ? modelParameter.originalType : constants.unsupportedModelParameterType})`, displayNameInput, outputContainer];
        }
        return [];
    }
    createInputTableRow(modelParameter, columns) {
        if (this._modelBuilder && columns) {
            let values = columns.map(c => { return { name: c.columnName, displayName: `${c.columnName}(${c.dataType})` }; });
            if (columns.length > 0 && columns[0].columnName !== constants.selectColumnTitle) {
                values = [{ displayName: constants.selectColumnTitle, name: '' }].concat(values);
            }
            const name = modelParameter.name;
            let column = values.find(x => x.name.toLocaleUpperCase() === modelParameter.name.toLocaleUpperCase());
            if (!column) {
                column = values.length > 0 ? values[0] : undefined;
            }
            const currentColumn = columns.find(x => x.columnName === (column === null || column === void 0 ? void 0 : column.name));
            let nameInput = this._modelBuilder.dropDown().withProperties({
                values: values,
                value: column,
                width: this.componentMaxLength
            }).component();
            if (column) {
                this._parameters.push({ columnName: column.name, paramName: name, paramType: modelParameter.type, maxLength: currentColumn === null || currentColumn === void 0 ? void 0 : currentColumn.maxLength });
            }
            const inputContainer = this._modelBuilder.flexContainer().withLayout({
                flexFlow: 'row',
                width: this.componentMaxLength + 20,
                justifyContent: 'flex-start'
            }).component();
            const warningButton = this.createWarningButton();
            warningButton.onDidClick(() => {
                let warningButtonProperties = {
                    xPos: 0,
                    yPos: 0,
                    width: WarningButtonDimensions.width,
                    height: WarningButtonDimensions.height
                };
                this.openWarningCalloutDialog(constants.columnDataTypeMismatchWarningHeading, 'input-table-row-dialog', constants.columnDataTypeMismatchWarning, constants.learnMoreLink, constants.mlExtDocLink, warningButtonProperties);
            });
            const css = {
                'padding-top': '5px',
                'padding-right': '5px',
                'margin': '0px'
            };
            nameInput.onValueChanged(() => {
                const selectedColumn = nameInput.value;
                const value = selectedColumn ? selectedColumn.name : undefined;
                let selectedRow = this._parameters.find(x => x.paramName === name);
                if (selectedRow) {
                    selectedRow.columnName = value || '';
                    let tableColumn = columns.find(x => x.columnName === value);
                    if (tableColumn) {
                        selectedRow.maxLength = tableColumn.maxLength;
                    }
                }
                const currentColumn = columns.find(x => x.columnName === value);
                if (currentColumn && modelParameter.type === (currentColumn === null || currentColumn === void 0 ? void 0 : currentColumn.dataType)) {
                    inputContainer.removeItem(warningButton);
                }
                else {
                    inputContainer.addItem(warningButton, {
                        CSSStyles: css
                    });
                }
            });
            const label = this._modelBuilder.inputBox().withProperties({
                value: `${name}(${modelParameter.originalType ? modelParameter.originalType : constants.unsupportedModelParameterType})`,
                enabled: false,
                width: this.componentMaxLength
            }).component();
            inputContainer.addItem(label, {
                CSSStyles: {
                    'padding': '0px',
                    'padding-right': '10px',
                    'margin': '0px'
                }
            });
            if (currentColumn && modelParameter.type !== (currentColumn === null || currentColumn === void 0 ? void 0 : currentColumn.dataType)) {
                inputContainer.addItem(warningButton, {
                    CSSStyles: css
                });
            }
            const image = this._modelBuilder.image().withProperties({
                width: 50,
                height: 50,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/arrow.svg'),
                    light: this.asAbsolutePath('images/light/arrow.svg')
                },
                iconWidth: 20,
                iconHeight: 20,
                title: 'maps'
            }).component();
            return [nameInput, image, inputContainer];
        }
        return [];
    }
    createWarningButton() {
        const warningButton = this._modelBuilder.button().withProperties({
            width: `${WarningButtonDimensions.width}px`,
            height: `${WarningButtonDimensions.height}px`,
            title: constants.columnDataTypeMismatchWarningHelper,
            iconPath: {
                dark: this.asAbsolutePath('images/warning.svg'),
                light: this.asAbsolutePath('images/warning.svg'),
            },
            iconHeight: `${WarningButtonDimensions.height}px`,
            iconWidth: `${WarningButtonDimensions.width}px`
        }).component();
        return warningButton;
    }
    openWarningCalloutDialog(dialogHeading, dialogName, calloutMessageText, calloutMessageLinkText, calloutMessageLinkUrl, dialogProperties) {
        /**
         * Here a specific value is assigned to dialogWidth. This meets design guidelines.
         */
        const dialog = azdata.window.createModelViewDialog(dialogHeading, dialogName, 288, 'callout', 'left', true, false, dialogProperties);
        const warningTab = azdata.window.createTab('warning');
        warningTab.registerContent((view) => __awaiter(this, void 0, void 0, function* () {
            const warningContentContainer = view.modelBuilder.divContainer().withProperties({}).component();
            const messageTextComponent = view.modelBuilder.text().withProperties({
                value: calloutMessageText,
                CSSStyles: {
                    'font-size': '12px',
                    'line-height': '16px',
                    'margin': '0 0 12px 0'
                }
            }).component();
            warningContentContainer.addItem(messageTextComponent);
            if (calloutMessageLinkText && calloutMessageLinkUrl) {
                const messageLinkComponent = view.modelBuilder.hyperlink().withProperties({
                    label: calloutMessageLinkText,
                    url: calloutMessageLinkUrl,
                    CSSStyles: {
                        'font-size': '13px',
                        'margin': '0px'
                    }
                }).component();
                warningContentContainer.addItem(messageLinkComponent);
            }
            view.initializeModel(warningContentContainer);
        }));
        // set tab as content
        dialog.content = [warningTab];
        azdata.window.openDialog(dialog);
    }
    /**
     * Returns selected data
     */
    get data() {
        return this._parameters;
    }
    /**
     * Refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ColumnsTable = ColumnsTable;
//# sourceMappingURL=columnsTable.js.map