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
exports.ModelImportLocationPage = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const tableSelectionComponent_1 = require("../tableSelectionComponent");
const dataInfoComponent_1 = require("../../dataInfoComponent");
/**
 * View to pick model source
 */
class ModelImportLocationPage extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent) {
        super(apiWrapper, parent.root, parent);
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._formBuilder = modelBuilder.formContainer();
        this.tableSelectionComponent = new tableSelectionComponent_1.TableSelectionComponent(this._apiWrapper, this, {
            editable: true,
            preSelected: true,
            databaseTitle: constants.databaseName,
            tableTitle: constants.tableName,
            databaseInfo: constants.databaseToStoreInfo,
            tableInfo: constants.tableToStoreInfo,
            defaultDbName: constants.selectModelDatabaseTitle,
            defaultTableName: constants.selectModelTableTitle,
            useImportModelCache: true
        });
        this._dataInfoComponent = new dataInfoComponent_1.DataInfoComponent(this._apiWrapper, this);
        this._dataInfoComponent.width = 350;
        this._dataInfoComponent.iconSettings = {
            css: {
                'border': 'solid',
                'margin': '5px',
            },
            width: 50,
            height: 50,
            containerHeight: 100,
            containerWidth: 100
        };
        this._dataInfoComponent.registerComponent(modelBuilder);
        this.tableSelectionComponent.onSelectedChanged(() => __awaiter(this, void 0, void 0, function* () {
            yield this.onTableSelected();
        }));
        this.tableSelectionComponent.registerComponent(modelBuilder);
        this.tableSelectionComponent.addComponents(this._formBuilder);
        if (this._dataInfoComponent.component) {
            this._formBuilder.addFormItem({
                title: '',
                component: this._dataInfoComponent.component
            });
        }
        this._form = this._formBuilder.component();
        return this._form;
    }
    onTableSelected() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let importTableIsValid = false;
            if ((_a = this.tableSelectionComponent) === null || _a === void 0 ? void 0 : _a.data) {
                this.importTable = (_b = this.tableSelectionComponent) === null || _b === void 0 ? void 0 : _b.data;
                if (this.tableSelectionComponent !== undefined && this.tableSelectionComponent.isDataValid) {
                    importTableIsValid = true;
                }
            }
            if (this.importTable && this._dataInfoComponent) {
                this._dataInfoComponent.loading();
                // Add table name to the models imported.
                // Since Table name is picked last as per new flow this hasn't been set yet.
                (_c = this.modelsViewData) === null || _c === void 0 ? void 0 : _c.forEach(x => x.targetImportTable = this.importTable);
                if (!importTableIsValid) {
                    this._dataInfoComponent.title = constants.selectModelsTableMessage;
                    this._dataInfoComponent.iconSettings.path = 'noicon';
                }
                else {
                    const validated = yield this.verifyImportConfigTable(this.importTable);
                    if (validated) {
                        this._dataInfoComponent.title = constants.modelSchemaIsAcceptedMessage;
                        this._dataInfoComponent.iconSettings.path = this.asAbsolutePath('images/validItem.svg');
                    }
                    else {
                        this._dataInfoComponent.title = constants.modelSchemaIsNotAcceptedMessage;
                        this._dataInfoComponent.iconSettings.path = this.asAbsolutePath('images/invalidItem.svg');
                    }
                }
                yield this._dataInfoComponent.refresh();
            }
        });
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a;
        return (_a = this.tableSelectionComponent) === null || _a === void 0 ? void 0 : _a.data;
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
            if (this.tableSelectionComponent) {
                yield this.tableSelectionComponent.refresh();
            }
            if (this._dataInfoComponent) {
                yield this._dataInfoComponent.refresh();
            }
        });
    }
    /**
     * Returns page title
     */
    get title() {
        return constants.modelImportTargetPageTitle;
    }
    disposePage() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    validate() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let validated = false;
            if (this.data && this.tableSelectionComponent !== undefined && this.tableSelectionComponent.isDataValid) {
                validated = true;
                validated = yield this.verifyImportConfigTable(this.data);
                if (!validated) {
                    this.showErrorMessage(constants.invalidImportTableSchemaError((_a = this.data) === null || _a === void 0 ? void 0 : _a.databaseName, (_b = this.data) === null || _b === void 0 ? void 0 : _b.tableName));
                }
            }
            else {
                this.showErrorMessage(constants.invalidImportTableError((_c = this.data) === null || _c === void 0 ? void 0 : _c.databaseName, (_d = this.data) === null || _d === void 0 ? void 0 : _d.tableName));
            }
            return validated;
        });
    }
}
exports.ModelImportLocationPage = ModelImportLocationPage;
//# sourceMappingURL=modelImportLocationPage.js.map