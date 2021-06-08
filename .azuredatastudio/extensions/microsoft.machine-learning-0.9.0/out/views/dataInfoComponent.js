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
exports.DataInfoComponent = void 0;
const viewBase_1 = require("./viewBase");
/**
 * View to pick model source
 */
class DataInfoComponent extends viewBase_1.ViewBase {
    constructor(apiWrapper, parent) {
        super(apiWrapper, parent.root, parent);
        this._width = 200;
        this._height = 200;
        this._title = '';
        this._description = '';
        this._defaultIconSize = 128;
    }
    registerComponent(modelBuilder) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this._descriptionComponent = modelBuilder.text().withProperties({
            value: this._description,
        }).component();
        this._labelComponent = modelBuilder.text().withProperties({
            value: this._title,
        }).component();
        this._labelContainer = modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: 'auto',
            height: this._height,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }).component();
        if (!this._iconSettings) {
            this._iconSettings = {
                css: {},
                height: this._defaultIconSize,
                width: this._defaultIconSize,
                path: '',
            };
        }
        this._iconComponent = modelBuilder.image().withProperties({
            width: (_b = (_a = this._iconSettings) === null || _a === void 0 ? void 0 : _a.containerWidth) !== null && _b !== void 0 ? _b : this._defaultIconSize,
            height: (_d = (_c = this._iconSettings) === null || _c === void 0 ? void 0 : _c.containerHeight) !== null && _d !== void 0 ? _d : this._defaultIconSize,
            iconWidth: (_f = (_e = this._iconSettings) === null || _e === void 0 ? void 0 : _e.width) !== null && _f !== void 0 ? _f : this._defaultIconSize,
            iconHeight: (_h = (_g = this._iconSettings) === null || _g === void 0 ? void 0 : _g.height) !== null && _h !== void 0 ? _h : this._defaultIconSize,
            title: this._title
        }).component();
        let iconContainer = modelBuilder.flexContainer().withLayout({
            width: (_k = (_j = this._iconSettings) === null || _j === void 0 ? void 0 : _j.containerWidth) !== null && _k !== void 0 ? _k : this._defaultIconSize,
        }).component();
        iconContainer.addItem(this._iconComponent, {
            CSSStyles: (_m = (_l = this._iconSettings) === null || _l === void 0 ? void 0 : _l.css) !== null && _m !== void 0 ? _m : {}
        });
        this._labelContainer.addItem(iconContainer);
        this._labelContainer.addItem(this._labelComponent, {
            CSSStyles: {
                'font-size': '16px'
            }
        });
        this._labelContainer.addItem(this._descriptionComponent, {
            CSSStyles: {
                'font-size': '13px'
            }
        });
        this._loadingComponent = modelBuilder.loadingComponent().withItem(this._labelContainer).withProperties({
            loading: false
        }).component();
        return this._loadingComponent;
    }
    set width(value) {
        this._width = value;
    }
    set height(value) {
        this._height = value;
    }
    set title(value) {
        this._title = value;
    }
    set description(value) {
        this._description = value;
    }
    set iconSettings(value) {
        this._iconSettings = value;
    }
    get iconSettings() {
        return this._iconSettings || {};
    }
    get component() {
        return this._loadingComponent;
    }
    loading() {
        if (this._loadingComponent) {
            this._loadingComponent.loading = true;
        }
    }
    loaded() {
        if (this._loadingComponent) {
            this._loadingComponent.loading = false;
        }
    }
    refresh() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded();
            if (this._labelComponent) {
                this._labelComponent.value = this._title;
            }
            if (this._descriptionComponent) {
                this._descriptionComponent.value = this._description;
            }
            if (this._iconComponent) {
                this._iconComponent.iconPath = (_a = this._iconSettings) === null || _a === void 0 ? void 0 : _a.path;
            }
            if (this._labelContainer) {
                this._labelContainer.height = this._height;
                this._labelContainer.width = this._width;
            }
            return Promise.resolve();
        });
    }
}
exports.DataInfoComponent = DataInfoComponent;
//# sourceMappingURL=dataInfoComponent.js.map