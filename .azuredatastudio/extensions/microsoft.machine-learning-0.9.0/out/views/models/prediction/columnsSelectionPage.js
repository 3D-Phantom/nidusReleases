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
exports.ColumnsSelectionPage = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const inputColumnsComponent_1 = require("./inputColumnsComponent");
const outputColumnsComponent_1 = require("./outputColumnsComponent");
/**
 * View to pick model source
 */
class ColumnsSelectionPage extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent) {
        super(apiWrapper, parent.root, parent);
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._formBuilder = modelBuilder.formContainer();
        this.inputColumnsComponent = new inputColumnsComponent_1.InputColumnsComponent(this._apiWrapper, this);
        this.inputColumnsComponent.registerComponent(modelBuilder);
        this.inputColumnsComponent.addComponents(this._formBuilder);
        this.outputColumnsComponent = new outputColumnsComponent_1.OutputColumnsComponent(this._apiWrapper, this);
        this.outputColumnsComponent.registerComponent(modelBuilder);
        this.outputColumnsComponent.addComponents(this._formBuilder);
        this._form = this._formBuilder.component();
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a, _b;
        return ((_a = this.inputColumnsComponent) === null || _a === void 0 ? void 0 : _a.data) && ((_b = this.outputColumnsComponent) === null || _b === void 0 ? void 0 : _b.data) ?
            Object.assign({}, this.inputColumnsComponent.data, { outputColumns: this.outputColumnsComponent.data }) :
            undefined;
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
            if (this._formBuilder) {
                if (this.inputColumnsComponent) {
                    yield this.inputColumnsComponent.refresh();
                }
                if (this.outputColumnsComponent) {
                    yield this.outputColumnsComponent.refresh();
                }
            }
        });
    }
    validate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.data;
            const validated = data !== undefined && data.databaseName !== undefined && data.inputColumns !== undefined && data.outputColumns !== undefined
                && data.tableName !== undefined && this.inputColumnsComponent !== undefined && ((_a = this.inputColumnsComponent) === null || _a === void 0 ? void 0 : _a.isDataValue)
                && !data.inputColumns.find(x => (x.columnName === constants.selectColumnTitle) || !x.columnName);
            if (!validated) {
                this.showErrorMessage(constants.invalidModelParametersError);
            }
            return Promise.resolve(validated);
        });
    }
    onEnter() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.inputColumnsComponent) === null || _a === void 0 ? void 0 : _a.onLoading());
            yield ((_b = this.outputColumnsComponent) === null || _b === void 0 ? void 0 : _b.onLoading());
            try {
                const modelParameters = yield this.loadModelParameters();
                if (modelParameters && this.inputColumnsComponent && this.outputColumnsComponent) {
                    this.inputColumnsComponent.modelParameters = modelParameters;
                    this.outputColumnsComponent.modelParameters = modelParameters;
                    yield this.outputColumnsComponent.refresh();
                }
            }
            catch (error) {
                this.showErrorMessage(constants.loadModelParameterFailedError, error);
            }
            yield ((_c = this.inputColumnsComponent) === null || _c === void 0 ? void 0 : _c.onLoaded());
            yield ((_d = this.outputColumnsComponent) === null || _d === void 0 ? void 0 : _d.onLoaded());
        });
    }
    /**
     * Returns page title
     */
    get title() {
        return constants.columnSelectionPageTitle;
    }
}
exports.ColumnsSelectionPage = ColumnsSelectionPage;
//# sourceMappingURL=columnsSelectionPage.js.map