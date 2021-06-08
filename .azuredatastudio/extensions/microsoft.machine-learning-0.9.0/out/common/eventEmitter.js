"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitterCollection = void 0;
const vscode = require("vscode");
class EventEmitterCollection extends vscode.Disposable {
    /**
     *
     */
    constructor() {
        super(() => this.dispose());
        this._events = new Map();
    }
    on(evt, listener, thisArgs) {
        var _a;
        if (!this._events.has(evt)) {
            this._events.set(evt, []);
        }
        let eventEmitter = new vscode.EventEmitter();
        eventEmitter.event(listener, thisArgs);
        (_a = this._events.get(evt)) === null || _a === void 0 ? void 0 : _a.push(eventEmitter);
        return eventEmitter;
    }
    fire(evt, arg) {
        var _a;
        if (!this._events.has(evt)) {
            this._events.set(evt, []);
        }
        (_a = this._events.get(evt)) === null || _a === void 0 ? void 0 : _a.forEach(eventEmitter => {
            eventEmitter.fire(arg);
        });
    }
    disposeEvent(evt, emitter) {
        if (this._events.has(evt)) {
            const emitters = this._events.get(evt);
            if (emitters) {
                this._events.set(evt, emitters.filter(x => x !== emitter));
            }
        }
        emitter.dispose();
    }
    dispose() {
        this._events.forEach(events => {
            events.forEach(event => {
                event.dispose();
            });
        });
    }
}
exports.EventEmitterCollection = EventEmitterCollection;
//# sourceMappingURL=eventEmitter.js.map