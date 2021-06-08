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
exports.CurrentLanguagesTab = void 0;
const constants = require("../../common/constants");
const languageViewBase_1 = require("./languageViewBase");
const languagesTable_1 = require("./languagesTable");
class CurrentLanguagesTab extends languageViewBase_1.LanguageViewBase {
    constructor(apiWrapper, parent) {
        super(apiWrapper, parent.root, parent);
        this._installedLangsTab = this._apiWrapper.createTab(constants.extLangInstallTabTitle);
        this._installedLangsTab.registerContent((view) => __awaiter(this, void 0, void 0, function* () {
            // TODO: only supporting single location for now. We should add a drop down for multi locations mode
            //
            let locationTitle = yield this.getServerTitle();
            this._locationComponent = view.modelBuilder.text().withProperties({
                value: locationTitle
            }).component();
            this._languageTable = new languagesTable_1.LanguagesTable(apiWrapper, view.modelBuilder, this);
            this._installLanguagesTable = this._languageTable.table;
            let formModel = view.modelBuilder.formContainer()
                .withFormItems([{
                    component: this._locationComponent,
                    title: constants.extLangTarget
                }, {
                    component: this._installLanguagesTable,
                    title: ''
                }]).component();
            this._loader = view.modelBuilder.loadingComponent()
                .withItem(formModel)
                .withProperties({
                loading: true
            }).component();
            yield view.initializeModel(this._loader);
            yield this.reset();
        }));
    }
    get tab() {
        return this._installedLangsTab;
    }
    onLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader) {
                yield this._loader.updateProperties({ loading: true });
            }
        });
    }
    onLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader) {
                yield this._loader.updateProperties({ loading: false });
            }
        });
    }
    reset() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onLoading();
            try {
                yield ((_a = this._languageTable) === null || _a === void 0 ? void 0 : _a.reset());
            }
            catch (err) {
                this.showErrorMessage(constants.getErrorMessage(err));
            }
            finally {
                yield this.onLoaded();
            }
        });
    }
}
exports.CurrentLanguagesTab = CurrentLanguagesTab;
//# sourceMappingURL=currentLanguagesTab.js.map