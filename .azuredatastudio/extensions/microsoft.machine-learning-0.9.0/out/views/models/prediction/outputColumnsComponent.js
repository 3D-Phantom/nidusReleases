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
exports.OutputColumnsComponent = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const columnsTable_1 = require("./columnsTable");
/**
 * View to render filters to pick an azure resource
 */
class OutputColumnsComponent extends modelViewBase_1.ModelViewBase {
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
        this._columns = new columnsTable_1.ColumnsTable(this._apiWrapper, modelBuilder, this, false);
        this._form = modelBuilder.formContainer().withFormItems([{
                title: constants.azureAccount,
                component: this._columns.component
            }]).component();
        return this._form;
    }
    addComponents(formBuilder) {
        if (this._columns) {
            formBuilder.addFormItems([{
                    title: constants.outputColumns,
                    component: this._columns.component
                }]);
            if (this._form) {
                this._form.updateCssStyles({
                    'font-size': '16px'
                });
            }
            this._columns.component.updateCssStyles({
                'font-size': '12px'
            });
        }
    }
    removeComponents(formBuilder) {
        if (this._columns) {
            formBuilder.removeFormItem({
                title: constants.outputColumns,
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
     * loads data in the components
     */
    loadData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._modelParameters) {
                (_a = this._columns) === null || _a === void 0 ? void 0 : _a.loadOutputs(this._modelParameters);
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
    /**
     * Returns selected data
     */
    get data() {
        var _a;
        return (_a = this._columns) === null || _a === void 0 ? void 0 : _a.data;
    }
}
exports.OutputColumnsComponent = OutputColumnsComponent;
//# sourceMappingURL=outputColumnsComponent.js.map