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
exports.LanguageEditDialog = void 0;
const constants = require("../../common/constants");
const addEditLanguageTab_1 = require("./addEditLanguageTab");
const languageViewBase_1 = require("./languageViewBase");
class LanguageEditDialog extends languageViewBase_1.LanguageViewBase {
    constructor(apiWrapper, parent, _languageUpdateModel) {
        super(apiWrapper, parent.root, parent);
        this._languageUpdateModel = _languageUpdateModel;
    }
    /**
     * Opens a dialog to edit a language or a content of a language
     */
    showDialog() {
        var _a;
        this._dialog = this._apiWrapper.createModelViewDialog(constants.extLangDialogTitle);
        this.addNewLanguageTab = new addEditLanguageTab_1.AddEditLanguageTab(this._apiWrapper, this, this._languageUpdateModel);
        this._dialog.cancelButton.label = constants.extLangCancelButtonText;
        this._dialog.okButton.label = constants.extLangSaveButtonText;
        (_a = this.dialog) === null || _a === void 0 ? void 0 : _a.registerCloseValidator(() => __awaiter(this, void 0, void 0, function* () {
            return yield this.onSave();
        }));
        this._dialog.content = [this.addNewLanguageTab.tab];
        this._apiWrapper.openDialog(this._dialog);
    }
    onSave() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.addNewLanguageTab) {
                try {
                    yield this.updateLanguage(this.addNewLanguageTab.updatedData);
                    return true;
                }
                catch (err) {
                    this.showErrorMessage(constants.extLangUpdateFailedError, err);
                    return false;
                }
            }
            return false;
        });
    }
    /**
     * Resets the tabs for given provider Id
     */
    reset() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.addNewLanguageTab) === null || _a === void 0 ? void 0 : _a.reset());
        });
    }
}
exports.LanguageEditDialog = LanguageEditDialog;
//# sourceMappingURL=languageEditDialog.js.map