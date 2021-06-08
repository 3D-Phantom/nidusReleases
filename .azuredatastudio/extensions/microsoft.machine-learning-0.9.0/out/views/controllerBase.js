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
exports.ControllerBase = void 0;
const viewBase_1 = require("./viewBase");
/**
 * Base classes for UI controllers
 */
class ControllerBase {
    /**
     * creates new instance
     */
    constructor(_apiWrapper) {
        this._apiWrapper = _apiWrapper;
    }
    /**
     * Executes an action and sends back callback event to the view
     */
    executeAction(dialog, eventName, inputArgs, func, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackEvent = viewBase_1.ViewBase.getCallbackEventName(eventName);
            try {
                let result = yield func(...args);
                dialog.sendCallbackRequest(callbackEvent, { inputArgs: inputArgs, data: result });
            }
            catch (error) {
                dialog.sendCallbackRequest(callbackEvent, { inputArgs: inputArgs, error: error });
            }
        });
    }
    /**
     * Register common events for views
     * @param view view
     */
    registerEvents(view) {
        view.on(viewBase_1.LocalPathsEventName, (args) => __awaiter(this, void 0, void 0, function* () {
            yield this.executeAction(view, viewBase_1.LocalPathsEventName, args, this.getLocalPaths, this._apiWrapper, args);
        }));
    }
    /**
     * Returns local file path picked by the user
     * @param apiWrapper apiWrapper
     */
    getLocalPaths(apiWrapper, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield apiWrapper.showOpenDialog(options);
            return result ? result === null || result === void 0 ? void 0 : result.map(x => x.fsPath) : [];
        });
    }
}
exports.ControllerBase = ControllerBase;
//# sourceMappingURL=controllerBase.js.map