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
exports.ModelDetailsPage = void 0;
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
const modelsDetailsTableComponent_1 = require("./modelsDetailsTableComponent");
/**
 * View to pick model details
 */
class ModelDetailsPage extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent) {
        super(apiWrapper, parent.root, parent);
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._formBuilder = modelBuilder.formContainer();
        this.modelDetails = new modelsDetailsTableComponent_1.ModelsDetailsTableComponent(this._apiWrapper, modelBuilder, this);
        this.modelDetails.registerComponent(modelBuilder);
        this.modelDetails.addComponents(this._formBuilder);
        this.refresh();
        this._form = this._formBuilder.component();
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a;
        return (_a = this.modelDetails) === null || _a === void 0 ? void 0 : _a.data;
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
            if (this.modelDetails) {
                yield this.modelDetails.refresh();
            }
        });
    }
    onEnter() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refresh();
        });
    }
    /**
     * Returns page title
     */
    get title() {
        return constants.modelDetailsPageTitle;
    }
    validate() {
        if (!this.data || this.data.length === 0) {
            this.showErrorMessage(constants.modelsRequiredError);
            return Promise.resolve(false);
        }
        else if (this.data && this.data.length > 0 && !this.data.find(x => { var _a; return !((_a = x.modelDetails) === null || _a === void 0 ? void 0 : _a.modelName); })) {
            return Promise.resolve(true);
        }
        else {
            this.showErrorMessage(constants.modelNameRequiredError);
            return Promise.resolve(false);
        }
    }
}
exports.ModelDetailsPage = ModelDetailsPage;
//# sourceMappingURL=modelDetailsPage.js.map