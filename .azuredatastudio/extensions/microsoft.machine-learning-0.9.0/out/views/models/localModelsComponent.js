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
exports.LocalModelsComponent = void 0;
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
/**
 * View to pick local models file
 */
class LocalModelsComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates new view
     */
    constructor(apiWrapper, parent, _multiSelect = true) {
        super(apiWrapper, parent.root, parent);
        this._multiSelect = _multiSelect;
    }
    /**
     *
     * @param modelBuilder Register the components
     */
    registerComponent(modelBuilder) {
        this._localPath = modelBuilder.inputBox().withProperties({
            value: '',
            width: this.componentMaxLength - this.browseButtonMaxLength - this.spaceBetweenComponentsLength
        }).component();
        this._localBrowse = modelBuilder.button().withProperties({
            iconPath: { light: this.asAbsolutePath('images/light/browseLocal.svg'), dark: this.asAbsolutePath('images/dark/browseLocal.svg') },
            iconHeight: '24px',
            iconWidth: '24px',
            width: '24px',
            height: '24px'
        }).component();
        this._localBrowse.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
            let options = {
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: this._multiSelect,
                filters: { 'ONNX File': ['onnx'] }
            };
            const filePaths = yield this.getLocalPaths(options);
            if (this._localPath && filePaths && filePaths.length > 0) {
                this._localPath.value = this._multiSelect ? filePaths.join(';') : filePaths[0];
            }
            else if (this._localPath) {
                this._localPath.value = '';
            }
        }));
        this._flex = modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row',
            justifyContent: 'space-between',
            width: this.componentMaxLength
        }).withItems([
            this._localPath, this._localBrowse
        ], {
            CSSStyles: {
                'padding-right': '5px'
            }
        }).component();
        this._form = modelBuilder.formContainer().withFormItems([{
                title: '',
                component: this._flex
            }]).component();
        return this._form;
    }
    addComponents(formBuilder) {
        if (this._flex) {
            formBuilder.addFormItem({
                title: constants.modelLocalSourceTitle,
                component: this._flex
            }, { info: constants.modelLocalSourceTooltip });
        }
    }
    removeComponents(formBuilder) {
        if (this._flex) {
            formBuilder.removeFormItem({
                title: '',
                component: this._flex
            });
        }
    }
    /**
     * Returns selected data
     */
    get data() {
        var _a, _b;
        if ((_a = this._localPath) === null || _a === void 0 ? void 0 : _a.value) {
            return (_b = this._localPath) === null || _b === void 0 ? void 0 : _b.value.split(';');
        }
        else {
            return [];
        }
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
     * Returns the page title
     */
    get title() {
        return constants.localModelsTitle;
    }
}
exports.LocalModelsComponent = LocalModelsComponent;
//# sourceMappingURL=localModelsComponent.js.map