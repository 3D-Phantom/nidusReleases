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
exports.Config = void 0;
const constants = require("../common/constants");
const fs_1 = require("fs");
const path = require("path");
const utils = require("../common/utils");
const configFileName = 'config.json';
const defaultPythonExecutable = '';
const defaultRExecutable = '';
/**
 * Extension Configuration from app settings
 */
class Config {
    constructor(_root, _apiWrapper) {
        this._root = _root;
        this._apiWrapper = _apiWrapper;
    }
    /**
     * Loads the config values
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawConfig = yield fs_1.promises.readFile(path.join(this._root, configFileName));
            this._configValues = JSON.parse(rawConfig.toString());
        });
    }
    /**
     * Returns the config value of required python packages. The order of the packages is based on the order they should install
     */
    get requiredSqlPythonPackages() {
        return this._configValues.sqlPackageManagement.requiredPythonPackages;
    }
    /**
     * Returns the config value of required r packages. The order of the packages is based on the order they should install
     */
    get requiredSqlRPackages() {
        return this._configValues.sqlPackageManagement.requiredRPackages;
    }
    /**
     * Returns r packages repository
     */
    get rPackagesRepository() {
        return this._configValues.sqlPackageManagement.rPackagesRepository;
    }
    /**
     * Returns python path from user settings
     */
    getPythonExecutable(verify) {
        return __awaiter(this, void 0, void 0, function* () {
            let executable = this.config.get(constants.pythonPathConfigKey) || defaultPythonExecutable;
            if (!executable) {
                executable = utils.getDefaultPythonLocation();
            }
            else {
                const exeName = utils.getPythonExeName();
                const isFolder = yield utils.isDirectory(executable);
                if (isFolder && executable.indexOf(exeName) < 0) {
                    executable = path.join(executable, exeName);
                }
            }
            let checkExist = executable && executable.toLocaleUpperCase() !== 'PYTHON' && executable.toLocaleUpperCase() !== 'PYTHON3';
            if (verify && checkExist && !(yield utils.exists(executable))) {
                throw new Error(constants.cannotFindPython(executable));
            }
            return executable;
        });
    }
    /**
     * Returns true if python package management is enabled
     */
    get pythonEnabled() {
        return this.config.get(constants.pythonEnabledConfigKey) || false;
    }
    /**
     * Returns true if r package management is enabled
     */
    get rEnabled() {
        return this.config.get(constants.rEnabledConfigKey) || false;
    }
    /**
     * Returns registered models table name
     */
    get registeredModelTableName() {
        return this._configValues.modelManagement.registeredModelsTableName;
    }
    /**
     * Returns registered models table schema name
     */
    get registeredModelTableSchemaName() {
        return this._configValues.modelManagement.registeredModelsTableSchemaName;
    }
    /**
     * Returns registered models table name
     */
    get registeredModelDatabaseName() {
        return this._configValues.modelManagement.registeredModelsDatabaseName;
    }
    /**
     * Returns Azure ML API
     */
    get amlModelManagementUrl() {
        return this._configValues.modelManagement.amlModelManagementUrl;
    }
    /**
     * Returns Azure ML API
     */
    get amlExperienceUrl() {
        return this._configValues.modelManagement.amlExperienceUrl;
    }
    /**
     * Returns Azure ML API Version
     */
    get amlApiVersion() {
        return this._configValues.modelManagement.amlApiVersion;
    }
    /**
     * Returns model management python packages
     */
    get modelsRequiredPythonPackages() {
        return this._configValues.modelManagement.requiredPythonPackages;
    }
    /**
     * Returns r path from user settings
     */
    getRExecutable(verify) {
        return __awaiter(this, void 0, void 0, function* () {
            let executable = this.config.get(constants.rPathConfigKey) || defaultRExecutable;
            let checkExist = executable && executable.toLocaleUpperCase() !== 'R';
            if (verify && checkExist && !(yield utils.exists(executable))) {
                throw new Error(constants.cannotFindR(executable));
            }
            return executable;
        });
    }
    get config() {
        return this._apiWrapper.getConfiguration(constants.mlsConfigKey);
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map