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
exports.LanguageViewBase = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const constants = require("../../common/constants");
const path = require("path");
class LanguageViewBase {
    constructor(_apiWrapper, _root, _parent) {
        this._apiWrapper = _apiWrapper;
        this._root = _root;
        this._parent = _parent;
        this.connectionUrl = '';
        // Events
        //
        this._onEdit = new vscode.EventEmitter();
        this.onEdit = this._onEdit.event;
        this._onUpdate = new vscode.EventEmitter();
        this.onUpdate = this._onUpdate.event;
        this._onDelete = new vscode.EventEmitter();
        this.onDelete = this._onDelete.event;
        this._fileBrowser = new vscode.EventEmitter();
        this.fileBrowser = this._fileBrowser.event;
        this._filePathSelected = new vscode.EventEmitter();
        this.filePathSelected = this._filePathSelected.event;
        this._onUpdated = new vscode.EventEmitter();
        this.onUpdated = this._onUpdated.event;
        this._onList = new vscode.EventEmitter();
        this.onList = this._onList.event;
        this._onListLoaded = new vscode.EventEmitter();
        this.onListLoaded = this._onListLoaded.event;
        this._onFailed = new vscode.EventEmitter();
        this.onFailed = this._onFailed.event;
        this.componentMaxLength = 350;
        this.browseButtonMaxLength = 20;
        this.spaceBetweenComponentsLength = 10;
        if (this._parent) {
            if (!this._root) {
                this._root = this._parent.root;
            }
            this.connection = this._parent.connection;
            this.connectionUrl = this._parent.connectionUrl;
        }
        this.registerEvents();
    }
    registerEvents() {
        if (this._parent) {
            this._dialog = this._parent.dialog;
            this.fileBrowser(url => {
                var _a;
                (_a = this._parent) === null || _a === void 0 ? void 0 : _a.onOpenFileBrowser(url);
            });
            this.onUpdate(model => {
                var _a;
                (_a = this._parent) === null || _a === void 0 ? void 0 : _a.onUpdateLanguage(model);
            });
            this.onEdit(model => {
                var _a;
                (_a = this._parent) === null || _a === void 0 ? void 0 : _a.onEditLanguage(model);
            });
            this.onDelete(model => {
                var _a;
                (_a = this._parent) === null || _a === void 0 ? void 0 : _a.onDeleteLanguage(model);
            });
            this.onList(() => {
                var _a;
                (_a = this._parent) === null || _a === void 0 ? void 0 : _a.onListLanguages();
            });
            this._parent.filePathSelected(x => {
                this.onFilePathSelected(x);
            });
            this._parent.onUpdated(x => {
                this.onUpdatedLanguage(x);
            });
            this._parent.onFailed(x => {
                this.onActionFailed(x);
            });
            this._parent.onListLoaded(x => {
                this.onListLanguageLoaded(x);
            });
        }
    }
    getLocationTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                return `${connection.serverName} ${connection.databaseName ? connection.databaseName : constants.extLangLocal}`;
            }
            return constants.noConnectionError;
        });
    }
    getServerTitle() {
        if (this.connection) {
            return this.connection.serverName;
        }
        return constants.noConnectionError;
    }
    getCurrentConnectionUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                return yield this._apiWrapper.getUriForConnection(connection.connectionId);
            }
            return '';
        });
    }
    getCurrentConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getCurrentConnection();
        });
    }
    loadConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield this.getCurrentConnection();
            this.connectionUrl = yield this.getCurrentConnectionUrl();
        });
    }
    updateLanguage(updateModel) {
        return new Promise((resolve, reject) => {
            this.onUpdateLanguage(updateModel);
            this.onUpdated(() => {
                resolve();
            });
            this.onFailed(err => {
                reject(err);
            });
        });
    }
    deleteLanguage(model) {
        return new Promise((resolve, reject) => {
            this.onDeleteLanguage(model);
            this.onUpdated(() => {
                resolve();
            });
            this.onFailed(err => {
                reject(err);
            });
        });
    }
    listLanguages() {
        return new Promise((resolve, reject) => {
            this.onListLanguages();
            this.onListLoaded(list => {
                resolve(list);
            });
            this.onFailed(err => {
                reject(err);
            });
        });
    }
    /**
     * Dialog model instance
     */
    get dialog() {
        return this._dialog;
    }
    set dialog(value) {
        this._dialog = value;
    }
    showInfoMessage(message) {
        this.showMessage(message, azdata.window.MessageLevel.Information);
    }
    showErrorMessage(message, error) {
        this.showMessage(`${message} ${constants.getErrorMessage(error)}`, azdata.window.MessageLevel.Error);
    }
    onUpdateLanguage(model) {
        this._onUpdate.fire(model);
    }
    onUpdatedLanguage(model) {
        this._onUpdated.fire(model);
    }
    onActionFailed(error) {
        this._onFailed.fire(error);
    }
    onListLanguageLoaded(list) {
        this._onListLoaded.fire(list);
    }
    onEditLanguage(model) {
        this._onEdit.fire(model);
    }
    onDeleteLanguage(model) {
        this._onDelete.fire(model);
    }
    onListLanguages() {
        this._onList.fire();
    }
    onOpenFileBrowser(fileBrowseArgs) {
        this._fileBrowser.fire(fileBrowseArgs);
    }
    onFilePathSelected(fileBrowseArgs) {
        this._filePathSelected.fire(fileBrowseArgs);
    }
    showMessage(message, level) {
        if (this._dialog) {
            this._dialog.message = {
                text: message,
                level: level
            };
        }
    }
    get root() {
        return this._root || '';
    }
    asAbsolutePath(filePath) {
        return path.join(this._root || '', filePath);
    }
    createNewContent() {
        return {
            extensionFileName: '',
            isLocalFile: true,
            pathToExtension: '',
        };
    }
    createNewLanguage() {
        return {
            name: '',
            contents: []
        };
    }
}
exports.LanguageViewBase = LanguageViewBase;
//# sourceMappingURL=languageViewBase.js.map