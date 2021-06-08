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
exports.ModelDetailsEditPage = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const modelDetailsComponent_1 = require("./modelDetailsComponent");
/**
 * View to pick model source
 */
class ModelDetailsEditPage extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent, _model) {
        super(apiWrapper, parent.root, parent);
        this._model = _model;
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._formBuilder = modelBuilder.formContainer();
        this.modelDetailsComponent = new modelDetailsComponent_1.ModelDetailsComponent(this._apiWrapper, this, this._model);
        this.modelDetailsComponent.registerComponent(modelBuilder);
        this.modelDetailsComponent.addComponents(this._formBuilder);
        this._form = this._formBuilder.component();
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a;
        return (_a = this.modelDetailsComponent) === null || _a === void 0 ? void 0 : _a.data;
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
            if (this.modelDetailsComponent) {
                yield this.modelDetailsComponent.refresh();
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let validated = false;
            if ((_a = this.data) === null || _a === void 0 ? void 0 : _a.modelName) {
                validated = true;
            }
            else {
                this.showErrorMessage(constants.modelNameRequiredError);
            }
            return validated;
        });
    }
}
exports.ModelDetailsEditPage = ModelDetailsEditPage;
//# sourceMappingURL=modelDetailsEditPage.js.map