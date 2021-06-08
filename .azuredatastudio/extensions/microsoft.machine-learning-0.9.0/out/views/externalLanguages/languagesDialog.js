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
exports.LanguagesDialog = void 0;
const currentLanguagesTab_1 = require("./currentLanguagesTab");
const addEditLanguageTab_1 = require("./addEditLanguageTab");
const languageViewBase_1 = require("./languageViewBase");
const constants = require("../../common/constants");
class LanguagesDialog extends languageViewBase_1.LanguageViewBase {
    constructor(apiWrapper, root) {
        super(apiWrapper, root);
    }
    /**
     * Opens a dialog to manage packages used by notebooks.
     */
    showDialog() {
        this.dialog = this._apiWrapper.createModelViewDialog(constants.extLangDialogTitle);
        this.currentLanguagesTab = new currentLanguagesTab_1.CurrentLanguagesTab(this._apiWrapper, this);
        let languageUpdateModel = {
            language: this.createNewLanguage(),
            content: this.createNewContent(),
            newLang: true
        };
        this.addNewLanguageTab = new addEditLanguageTab_1.AddEditLanguageTab(this._apiWrapper, this, languageUpdateModel);
        this.dialog.okButton.hidden = true;
        this.dialog.cancelButton.label = constants.extLangDoneButtonText;
        this.dialog.content = [this.currentLanguagesTab.tab, this.addNewLanguageTab.tab];
        this.dialog.registerCloseValidator(() => {
            return false; // Blocks Enter key from closing dialog.
        });
        this._apiWrapper.openDialog(this.dialog);
    }
    /**
     * Resets the tabs for given provider Id
     */
    reset() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.currentLanguagesTab) === null || _a === void 0 ? void 0 : _a.reset());
            yield ((_b = this.addNewLanguageTab) === null || _b === void 0 ? void 0 : _b.reset());
        });
    }
}
exports.LanguagesDialog = LanguagesDialog;
//# sourceMappingURL=languagesDialog.js.map