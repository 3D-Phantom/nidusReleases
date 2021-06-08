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
exports.ModelDetailsComponent = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
/**
 * View to render filters to pick an azure resource
 */
class ModelDetailsComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a new view
     */
    constructor(apiWrapper, parent, _model) {
        super(apiWrapper, parent.root, parent);
        this._model = _model;
    }
    /**
     * Register components
     * @param modelBuilder model builder
     */
    registerComponent(modelBuilder) {
        this._createdComponent = modelBuilder.text().withProperties({
            value: this._model.created
        }).component();
        this._deployedComponent = modelBuilder.text().withProperties({
            value: this._model.deploymentTime
        }).component();
        this._frameworkComponent = modelBuilder.text().withProperties({
            value: this._model.framework
        }).component();
        this._frameworkVersionComponent = modelBuilder.text().withProperties({
            value: this._model.frameworkVersion
        }).component();
        this._nameComponent = modelBuilder.inputBox().withProperties({
            width: this.componentMaxLength,
            value: this._model.modelName
        }).component();
        this._descriptionComponent = modelBuilder.inputBox().withProperties({
            width: this.componentMaxLength,
            value: this._model.description,
            multiline: true,
            height: 50
        }).component();
        this._form = modelBuilder.formContainer().withFormItems([{
                title: '',
                component: this._nameComponent
            },
            {
                title: '',
                component: this._descriptionComponent
            }]).component();
        return this._form;
    }
    addComponents(formBuilder) {
        if (this._nameComponent && this._descriptionComponent && this._createdComponent && this._deployedComponent && this._frameworkComponent && this._frameworkVersionComponent) {
            formBuilder.addFormItems([{
                    title: constants.modelName,
                    component: this._nameComponent
                }, {
                    title: constants.modelCreated,
                    component: this._createdComponent
                },
                {
                    title: constants.modelImported,
                    component: this._deployedComponent
                }, {
                    title: constants.modelFramework,
                    component: this._frameworkComponent
                }, {
                    title: constants.modelFrameworkVersion,
                    component: this._frameworkVersionComponent
                }, {
                    title: constants.modelDescription,
                    component: this._descriptionComponent
                }]);
        }
    }
    removeComponents(formBuilder) {
        if (this._nameComponent && this._descriptionComponent && this._createdComponent && this._deployedComponent && this._frameworkComponent && this._frameworkVersionComponent) {
            formBuilder.removeFormItem({
                title: constants.modelCreated,
                component: this._createdComponent
            });
            formBuilder.removeFormItem({
                title: constants.modelCreated,
                component: this._frameworkComponent
            });
            formBuilder.removeFormItem({
                title: constants.modelCreated,
                component: this._frameworkVersionComponent
            });
            formBuilder.removeFormItem({
                title: constants.modelCreated,
                component: this._deployedComponent
            });
            formBuilder.removeFormItem({
                title: constants.modelName,
                component: this._nameComponent
            });
            formBuilder.removeFormItem({
                title: constants.modelDescription,
                component: this._descriptionComponent
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
     * Returns selected data
     */
    get data() {
        var _a, _b;
        let model = Object.assign({}, this._model);
        model.modelName = ((_a = this._nameComponent) === null || _a === void 0 ? void 0 : _a.value) || '';
        model.description = ((_b = this._descriptionComponent) === null || _b === void 0 ? void 0 : _b.value) || '';
        return model;
    }
    /**
     * loads data in the components
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
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
}
exports.ModelDetailsComponent = ModelDetailsComponent;
//# sourceMappingURL=modelDetailsComponent.js.map