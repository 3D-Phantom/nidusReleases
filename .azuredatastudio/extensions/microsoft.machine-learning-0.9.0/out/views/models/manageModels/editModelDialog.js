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
exports.EditModelDialog = void 0;
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const dialogView_1 = require("../../dialogView");
const modelDetailsEditPage_1 = require("./modelDetailsEditPage");
/**
 * Dialog to render registered model views
 */
class EditModelDialog extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, root, _parentView, _model) {
        super(apiWrapper, root);
        this._parentView = _parentView;
        this._model = _model;
        this.dialogView = new dialogView_1.DialogView(this._apiWrapper);
    }
    /**
     * Opens a dialog to edit models.
     */
    open() {
        this.editModelPage = new modelDetailsEditPage_1.ModelDetailsEditPage(this._apiWrapper, this, this._model);
        let registerModelButton = this._apiWrapper.createButton(constants.extLangSaveButtonText);
        registerModelButton.onClick(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.editModelPage) {
                const valid = yield this.editModelPage.validate();
                if (valid) {
                    try {
                        yield this.sendDataRequest(modelViewBase_1.UpdateModelEventName, (_a = this.editModelPage) === null || _a === void 0 ? void 0 : _a.data);
                        this.showInfoMessage(constants.modelUpdatedSuccessfully);
                        if (this._parentView) {
                            yield this._parentView.refresh();
                        }
                    }
                    catch (error) {
                        this.showInfoMessage(`${constants.modelUpdateFailedError} ${constants.getErrorMessage(error)}`);
                    }
                }
            }
        }));
        let dialog = this.dialogView.createDialog(constants.editModelTitle, [this.editModelPage]);
        dialog.customButtons = [registerModelButton];
        this.mainViewPanel = dialog;
        dialog.okButton.hidden = true;
        dialog.cancelButton.label = constants.extLangDoneButtonText;
        dialog.registerCloseValidator(() => {
            return false; // Blocks Enter key from closing dialog.
        });
        this._apiWrapper.openDialog(dialog);
    }
    /**
     * Resets the tabs for given provider Id
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dialogView) {
                this.dialogView.refresh();
            }
        });
    }
}
exports.EditModelDialog = EditModelDialog;
//# sourceMappingURL=editModelDialog.js.map