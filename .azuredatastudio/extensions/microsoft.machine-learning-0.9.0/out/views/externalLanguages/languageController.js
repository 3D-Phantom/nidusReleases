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
exports.LanguageController = void 0;
const languagesDialog_1 = require("./languagesDialog");
const languageEditDialog_1 = require("./languageEditDialog");
const fileBrowserDialog_1 = require("./fileBrowserDialog");
const constants = require("../../common/constants");
class LanguageController {
    /**
     *
     */
    constructor(_apiWrapper, _root, _service) {
        this._apiWrapper = _apiWrapper;
        this._root = _root;
        this._service = _service;
    }
    /**
     * Opens the manage language dialog and connects events to the model
     */
    manageLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            let dialog = new languagesDialog_1.LanguagesDialog(this._apiWrapper, this._root);
            // Load current connection
            //
            yield this._service.load();
            dialog.connection = this._service.connection;
            dialog.connectionUrl = this._service.connectionUrl;
            // Handle dialog events and connect to model
            //
            dialog.onEdit(model => {
                this.editLanguage(dialog, model);
            });
            dialog.onDelete((deleteModel) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.executeAction(dialog, this.deleteLanguage, this._service, deleteModel);
                    dialog.onUpdatedLanguage(deleteModel);
                }
                catch (err) {
                    dialog.onActionFailed(err);
                }
            }));
            dialog.onUpdate((updateModel) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.executeAction(dialog, this.updateLanguage, this._service, updateModel);
                    dialog.onUpdatedLanguage(updateModel);
                }
                catch (err) {
                    dialog.onActionFailed(err);
                }
            }));
            dialog.onList(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    let result = yield this.listLanguages(this._service);
                    dialog.onListLanguageLoaded(result);
                }
                catch (err) {
                    dialog.onActionFailed(err);
                }
            }));
            this.onSelectFile(dialog);
            // Open dialog
            //
            dialog.showDialog();
            return dialog;
        });
    }
    executeAction(dialog, func, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield func(...args);
            yield dialog.reset();
            return result;
        });
    }
    editLanguage(parent, languageUpdateModel) {
        let editDialog = new languageEditDialog_1.LanguageEditDialog(this._apiWrapper, parent, languageUpdateModel);
        editDialog.showDialog();
    }
    onSelectFile(dialog) {
        dialog.fileBrowser((args) => __awaiter(this, void 0, void 0, function* () {
            let filePath = '';
            if (args.target === constants.localhost) {
                filePath = yield this.getLocalFilePath();
            }
            else {
                filePath = yield this.getServerFilePath(args.target);
            }
            dialog.onFilePathSelected({ filePath: filePath, target: args.target });
        }));
    }
    getServerFilePath(connectionUrl) {
        return new Promise((resolve) => {
            let dialog = new fileBrowserDialog_1.FileBrowserDialog(this._apiWrapper, connectionUrl);
            dialog.onPathSelected((selectedPath) => {
                resolve(selectedPath);
            });
            dialog.showDialog();
        });
    }
    getLocalFilePath() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this._apiWrapper.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false
            });
            return result && result.length > 0 ? result[0].fsPath : '';
        });
    }
    deleteLanguage(model, deleteModel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield model.deleteLanguage(deleteModel.language.name);
        });
    }
    listLanguages(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.getLanguageList();
        });
    }
    updateLanguage(model, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!updateModel.language) {
                return;
            }
            let contents = [];
            if (updateModel.language.contents && updateModel.language.contents.length >= 0) {
                contents = updateModel.language.contents.filter(x => x.platform !== updateModel.content.platform);
            }
            contents.push(updateModel.content);
            updateModel.language.contents = contents;
            yield model.updateLanguage(updateModel.language);
        });
    }
}
exports.LanguageController = LanguageController;
//# sourceMappingURL=languageController.js.map