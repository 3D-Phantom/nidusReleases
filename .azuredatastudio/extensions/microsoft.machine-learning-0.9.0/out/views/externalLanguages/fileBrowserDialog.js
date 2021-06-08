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
exports.FileBrowserDialog = void 0;
const vscode = require("vscode");
const constants = require("../../common/constants");
class FileBrowserDialog {
    constructor(_apiWrapper, ownerUri) {
        this._apiWrapper = _apiWrapper;
        this.ownerUri = ownerUri;
        this._onPathSelected = new vscode.EventEmitter();
        this.onPathSelected = this._onPathSelected.event;
    }
    /**
     * Opens a dialog to browse server files and folders.
     */
    showDialog() {
        let fileBrowserTitle = '';
        this._fileBrowserDialog = this._apiWrapper.createModelViewDialog(fileBrowserTitle);
        let fileBrowserTab = this._apiWrapper.createTab(constants.extLangFileBrowserTabTitle);
        this._fileBrowserDialog.content = [fileBrowserTab];
        fileBrowserTab.registerContent((view) => __awaiter(this, void 0, void 0, function* () {
            this._fileBrowserTree = view.modelBuilder.fileBrowserTree()
                .withProperties({ ownerUri: this.ownerUri, width: 420, height: 700 })
                .component();
            this._selectedPathTextBox = view.modelBuilder.inputBox()
                .withProperties({ inputType: 'text' })
                .component();
            this._fileBrowserTree.onDidChange((args) => {
                if (this._selectedPathTextBox) {
                    this._selectedPathTextBox.value = args.fullPath;
                }
            });
            let fileBrowserContainer = view.modelBuilder.formContainer()
                .withFormItems([{
                    component: this._fileBrowserTree,
                    title: ''
                }, {
                    component: this._selectedPathTextBox,
                    title: constants.extLangSelectedPath
                }
            ]).component();
            view.initializeModel(fileBrowserContainer);
        }));
        this._fileBrowserDialog.okButton.onClick(() => {
            if (this._selectedPathTextBox) {
                let selectedPath = this._selectedPathTextBox.value || '';
                this._onPathSelected.fire(selectedPath);
            }
        });
        this._fileBrowserDialog.cancelButton.onClick(() => {
            this._onPathSelected.fire('');
        });
        this._fileBrowserDialog.okButton.label = constants.extLangOkButtonText;
        this._fileBrowserDialog.cancelButton.label = constants.extLangCancelButtonText;
        this._apiWrapper.openDialog(this._fileBrowserDialog);
    }
}
exports.FileBrowserDialog = FileBrowserDialog;
//# sourceMappingURL=fileBrowserDialog.js.map