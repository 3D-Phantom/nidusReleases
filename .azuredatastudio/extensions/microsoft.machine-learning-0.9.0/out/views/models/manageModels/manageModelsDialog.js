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
exports.ManageModelsDialog = void 0;
const currentModelsComponent_1 = require("./currentModelsComponent");
const modelViewBase_1 = require("../modelViewBase");
const constants = require("../../../common/constants");
const dialogView_1 = require("../../dialogView");
/**
 * Dialog to render registered model views
 */
class ManageModelsDialog extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, root) {
        super(apiWrapper, root);
        this.dialogView = new dialogView_1.DialogView(this._apiWrapper);
    }
    /**
     * Opens a dialog to manage packages used by notebooks.
     */
    open() {
        this.currentLanguagesTab = new currentModelsComponent_1.CurrentModelsComponent(this._apiWrapper, this, {
            editable: true,
            selectable: false
        });
        this.currentLanguagesTab.modelSourceType = modelViewBase_1.ModelSourceType.RegisteredModels;
        let registerModelButton = this._apiWrapper.createButton(constants.registerModelTitle);
        registerModelButton.onClick(() => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.sendDataRequest(modelViewBase_1.RegisterModelEventName, (_b = (_a = this.currentLanguagesTab) === null || _a === void 0 ? void 0 : _a.modelTable) === null || _b === void 0 ? void 0 : _b.importTable);
        }));
        let dialog = this.dialogView.createDialog(constants.viewImportModelsTitle, [this.currentLanguagesTab]);
        dialog.isWide = true;
        dialog.dialogStyle = 'flyout';
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
exports.ManageModelsDialog = ManageModelsDialog;
//# sourceMappingURL=manageModelsDialog.js.map