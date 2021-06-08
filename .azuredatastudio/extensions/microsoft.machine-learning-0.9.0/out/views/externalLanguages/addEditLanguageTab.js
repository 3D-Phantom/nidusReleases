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
exports.AddEditLanguageTab = void 0;
const constants = require("../../common/constants");
const languageViewBase_1 = require("./languageViewBase");
const languageContentView_1 = require("./languageContentView");
class AddEditLanguageTab extends languageViewBase_1.LanguageViewBase {
    constructor(apiWrapper, parent, _languageUpdateModel) {
        super(apiWrapper, parent.root, parent);
        this._languageUpdateModel = _languageUpdateModel;
        this._editMode = false;
        this._editMode = !this._languageUpdateModel.newLang;
        this._dialogTab = apiWrapper.createTab(constants.extLangNewLanguageTabTitle);
        this._dialogTab.registerContent((view) => __awaiter(this, void 0, void 0, function* () {
            let language = this._languageUpdateModel.language;
            let content = this._languageUpdateModel.content;
            this.languageName = view.modelBuilder.inputBox().withProperties({
                value: language.name,
                width: '150px',
                enabled: !this._editMode
            }).withValidation(component => component.value !== '').component();
            let formBuilder = view.modelBuilder.formContainer();
            formBuilder.addFormItem({
                component: this.languageName,
                title: constants.extLangLanguageName,
                required: true
            });
            this.languageView = new languageContentView_1.LanguageContentView(this._apiWrapper, this, view.modelBuilder, formBuilder, content);
            if (!this._editMode) {
                this.saveButton = view.modelBuilder.button().withProperties({
                    label: constants.extLangInstallButtonText,
                    width: '100px'
                }).component();
                this.saveButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.updateLanguage(this.updatedData);
                    }
                    catch (err) {
                        this.showErrorMessage(constants.extLangInstallFailedError, err);
                    }
                }));
                formBuilder.addFormItem({
                    component: this.saveButton,
                    title: ''
                });
            }
            yield view.initializeModel(formBuilder.component());
            yield this.reset();
        }));
    }
    get updatedData() {
        var _a, _b;
        return {
            language: {
                name: ((_a = this.languageName) === null || _a === void 0 ? void 0 : _a.value) || '',
                contents: this._languageUpdateModel.language.contents
            },
            content: ((_b = this.languageView) === null || _b === void 0 ? void 0 : _b.updatedContent) || this._languageUpdateModel.content,
            newLang: this._languageUpdateModel.newLang
        };
    }
    get tab() {
        return this._dialogTab;
    }
    reset() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.languageName) {
                this.languageName.value = this._languageUpdateModel.language.name;
            }
            (_a = this.languageView) === null || _a === void 0 ? void 0 : _a.reset();
        });
    }
}
exports.AddEditLanguageTab = AddEditLanguageTab;
//# sourceMappingURL=addEditLanguageTab.js.map