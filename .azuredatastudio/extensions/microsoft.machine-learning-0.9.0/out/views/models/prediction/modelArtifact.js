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
exports.ModelArtifact = void 0;
const utils = require("../../../common/utils");
/**
* Wizard to register a model
*/
class ModelArtifact {
    /**
     * Creates new model artifact
     */
    constructor(_filePath, _deleteAtClose = true) {
        this._filePath = _filePath;
        this._deleteAtClose = _deleteAtClose;
    }
    get filePath() {
        return this._filePath;
    }
    /**
     * Closes the artifact and disposes the resources
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._deleteAtClose) {
                try {
                    yield utils.deleteFile(this._filePath);
                }
                catch (_a) {
                }
            }
        });
    }
}
exports.ModelArtifact = ModelArtifact;
//# sourceMappingURL=modelArtifact.js.map