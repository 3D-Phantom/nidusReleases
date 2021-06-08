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
exports.AzureSignInComponent = void 0;
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
/**
 * View to render filters to pick an azure resource
 */
const componentWidth = 300;
class AzureSignInComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a new view
     */
    constructor(apiWrapper, _modelBuilder, parent) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
        this._signInButton = this._modelBuilder.button().withProps({
            width: componentWidth,
            label: constants.azureSignIn,
            secondary: true
        }).component();
        this._signInButton.onDidClick(() => {
            this.sendRequest(modelViewBase_1.SignInToAzureEventName);
        });
        this._form = this._modelBuilder.formContainer().withFormItems([{
                title: constants.azureAccount,
                component: this._signInButton
            }]).component();
    }
    addComponents(formBuilder) {
        if (this._signInButton) {
            formBuilder.addFormItems([{
                    title: constants.azureAccount,
                    component: this._signInButton
                }]);
        }
    }
    removeComponents(formBuilder) {
        if (this._signInButton) {
            formBuilder.removeFormItem({
                title: constants.azureAccount,
                component: this._signInButton
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
     * refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AzureSignInComponent = AzureSignInComponent;
//# sourceMappingURL=azureSignInComponent.js.map