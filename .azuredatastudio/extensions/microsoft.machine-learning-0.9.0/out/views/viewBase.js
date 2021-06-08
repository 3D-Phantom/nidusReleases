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
exports.ViewBase = exports.LocalPathsEventName = exports.CallEventNamePostfix = void 0;
const azdata = require("azdata");
const constants = require("../common/constants");
const path = require("path");
const eventEmitter_1 = require("../common/eventEmitter");
exports.CallEventNamePostfix = 'Callback';
exports.LocalPathsEventName = 'localPaths';
/**
 * Base class for views
 */
class ViewBase extends eventEmitter_1.EventEmitterCollection {
    constructor(_apiWrapper, _root, _parent) {
        super();
        this._apiWrapper = _apiWrapper;
        this._root = _root;
        this._parent = _parent;
        this._toDispose = [];
        this.connectionUrl = '';
        this.componentMaxLength = 350;
        this.buttonMaxLength = 150;
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
    getEventNames() {
        return [exports.LocalPathsEventName];
    }
    getCallbackEventNames() {
        return this.getEventNames().map(eventName => {
            return ViewBase.getCallbackEventName(eventName);
        });
    }
    static getCallbackEventName(eventName) {
        return `${eventName}${exports.CallEventNamePostfix}`;
    }
    registerEvents() {
        if (this._parent) {
            const events = this.getEventNames();
            if (events) {
                events.forEach(eventName => {
                    this.on(eventName, (arg) => {
                        var _a;
                        (_a = this._parent) === null || _a === void 0 ? void 0 : _a.sendRequest(eventName, arg);
                    });
                });
            }
            const callbackEvents = this.getCallbackEventNames();
            if (callbackEvents) {
                callbackEvents.forEach(eventName => {
                    var _a;
                    (_a = this._parent) === null || _a === void 0 ? void 0 : _a.on(eventName, (arg) => {
                        this.sendRequest(eventName, arg);
                    });
                });
            }
        }
    }
    sendRequest(requestType, arg) {
        this.fire(requestType, arg);
    }
    sendCallbackRequest(requestType, arg) {
        this.fire(requestType, arg);
    }
    sendDataRequest(eventName, arg, callbackEventName) {
        return __awaiter(this, void 0, void 0, function* () {
            let emitter;
            let promise = new Promise((resolve, reject) => {
                if (!callbackEventName) {
                    callbackEventName = ViewBase.getCallbackEventName(eventName);
                }
                emitter = this.on(callbackEventName, result => {
                    let callbackArgs = result;
                    if (callbackArgs) {
                        if (callbackArgs.inputArgs === arg) {
                            if (callbackArgs.error) {
                                reject(callbackArgs.error);
                            }
                            else {
                                resolve(callbackArgs.data);
                            }
                        }
                    }
                    else {
                        reject(constants.notSupportedEventArg);
                    }
                });
                this.fire(eventName, arg);
            });
            const result = yield promise;
            if (emitter && callbackEventName) {
                this.disposeEvent(callbackEventName, emitter);
            }
            return result;
        });
    }
    getLocalPaths(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendDataRequest(exports.LocalPathsEventName, options);
        });
    }
    getLocationTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                return `${connection.serverName} ${connection.databaseName ? connection.databaseName : ''}`;
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
    /**
     * Dialog model instance
     */
    get mainViewPanel() {
        var _a;
        return this._mainViewPanel || ((_a = this._parent) === null || _a === void 0 ? void 0 : _a.mainViewPanel);
    }
    set mainViewPanel(value) {
        this._mainViewPanel = value;
    }
    showInfoMessage(message) {
        this.showMessage(message, azdata.window.MessageLevel.Information);
    }
    showErrorMessage(message, error) {
        this.showMessage(`${message} ${error ? constants.getErrorMessage(error) : ''}`, azdata.window.MessageLevel.Error);
    }
    showMessage(message, level) {
        if (this.mainViewPanel) {
            this.mainViewPanel.message = {
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
    dispose() {
        super.dispose();
        this._toDispose.forEach(disposable => disposable.dispose());
    }
}
exports.ViewBase = ViewBase;
//# sourceMappingURL=viewBase.js.map