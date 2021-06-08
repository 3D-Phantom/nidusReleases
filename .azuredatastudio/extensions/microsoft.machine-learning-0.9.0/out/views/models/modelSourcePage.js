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
exports.ModelSourcePage = void 0;
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
const modelSourcesComponent_1 = require("./modelSourcesComponent");
/**
 * View to pick model source
 */
class ModelSourcePage extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent, _options = [modelViewBase_1.ModelSourceType.Local, modelViewBase_1.ModelSourceType.Azure]) {
        super(apiWrapper, parent.root, parent);
        this._options = _options;
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._formBuilder = modelBuilder.formContainer();
        this.modelResources = new modelSourcesComponent_1.ModelSourcesComponent(this._apiWrapper, this, this._options);
        this.modelResources.registerComponent(modelBuilder);
        this.modelResources.addComponents(this._formBuilder);
        this._form = this._formBuilder.component();
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a;
        return ((_a = this.modelResources) === null || _a === void 0 ? void 0 : _a.data) || modelViewBase_1.ModelSourceType.Local;
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
        });
    }
    /**
     * Returns page title
     */
    get title() {
        return constants.modelSourcePageTitle;
    }
    disposePage() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ModelSourcePage = ModelSourcePage;
//# sourceMappingURL=modelSourcePage.js.map