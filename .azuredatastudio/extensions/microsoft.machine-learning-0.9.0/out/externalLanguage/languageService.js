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
exports.LanguageService = void 0;
/**
 * Manage package dialog model
 */
class LanguageService {
    constructor(_apiWrapper, _languageExtensionService) {
        this._apiWrapper = _apiWrapper;
        this._languageExtensionService = _languageExtensionService;
        this.connectionUrl = '';
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield this.getCurrentConnection();
            this.connectionUrl = yield this.getCurrentConnectionUrl();
        });
    }
    getLanguageList() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionUrl) {
                return yield this._languageExtensionService.listLanguages(this.connectionUrl);
            }
            return [];
        });
    }
    deleteLanguage(languageName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionUrl) {
                yield this._languageExtensionService.deleteLanguage(this.connectionUrl, languageName);
            }
        });
    }
    updateLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionUrl) {
                yield this._languageExtensionService.updateLanguage(this.connectionUrl, language);
            }
        });
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
}
exports.LanguageService = LanguageService;
//# sourceMappingURL=languageService.js.map