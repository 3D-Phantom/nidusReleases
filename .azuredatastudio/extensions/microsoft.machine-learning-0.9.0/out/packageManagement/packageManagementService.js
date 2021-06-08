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
exports.PackageManagementService = void 0;
const constants = require("../common/constants");
const utils = require("../common/utils");
class PackageManagementService {
    /**
     * Creates a new instance of ServerConfigManager
     */
    constructor(_apiWrapper, _queryRunner) {
        this._apiWrapper = _apiWrapper;
        this._queryRunner = _queryRunner;
    }
    /**
     * Returns true if mls is installed in the give SQL server instance
     */
    isMachineLearningServiceEnabled(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._queryRunner.isMachineLearningServiceEnabled(connection);
        });
    }
    /**
     * Returns true if R installed in the give SQL server instance
     */
    isRInstalled(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._queryRunner.isRInstalled(connection);
        });
    }
    /**
     * Returns true if python installed in the give SQL server instance
     */
    isPythonInstalled(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._queryRunner.isPythonInstalled(connection);
        });
    }
    /**
     * Updates external script config
     * @param connection SQL Connection
     * @param enable if true external script will be enabled
     */
    enableExternalScriptConfig(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let current = yield this._queryRunner.isMachineLearningServiceEnabled(connection);
            if (current) {
                this._apiWrapper.showInfoMessage(constants.mlsEnabledMessage);
                return current;
            }
            let confirmed = yield utils.promptConfirm(constants.confirmEnableExternalScripts, this._apiWrapper);
            if (confirmed) {
                yield this._queryRunner.updateExternalScriptConfig(connection, true);
                current = yield this._queryRunner.isMachineLearningServiceEnabled(connection);
                if (current) {
                    this._apiWrapper.showInfoMessage(constants.mlsEnabledMessage);
                }
                else {
                    this._apiWrapper.showErrorMessage(constants.mlsConfigUpdateFailed);
                }
            }
            else {
                this._apiWrapper.showErrorMessage(constants.externalScriptsIsRequiredError);
            }
            return current;
        });
    }
    /**
     * Returns python packages installed in SQL server instance
     * @param connection SQL Connection
     */
    getPythonPackages(connection, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._queryRunner.getPythonPackages(connection, databaseName);
        });
    }
    /**
     * Returns python packages installed in SQL server instance
     * @param connection SQL Connection
     */
    getRPackages(connection, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._queryRunner.getRPackages(connection, databaseName);
        });
    }
}
exports.PackageManagementService = PackageManagementService;
//# sourceMappingURL=packageManagementService.js.map