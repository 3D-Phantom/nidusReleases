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
exports.DeployedModelService = void 0;
const utils = require("../common/utils");
const constants = require("../common/constants");
const queries = require("./queries");
/**
 * Service to deployed models
 */
class DeployedModelService {
    /**
     * Creates new instance
     */
    constructor(_apiWrapper, _config, _queryRunner, _modelClient, _recentModelService) {
        this._apiWrapper = _apiWrapper;
        this._config = _config;
        this._queryRunner = _queryRunner;
        this._modelClient = _modelClient;
        this._recentModelService = _recentModelService;
    }
    /**
     * Returns deployed models
     */
    getDeployedModels(table) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let list = [];
            if (!table.databaseName || !table.tableName || !table.schema) {
                return [];
            }
            if (connection) {
                const query = queries.getDeployedModelsQuery(table);
                let result = yield this._queryRunner.safeRunQuery(connection, query);
                if (result && result.rows && result.rows.length > 0) {
                    result.rows.forEach(row => {
                        list.push(this.loadModelData(row, table));
                    });
                }
            }
            else {
                throw Error(constants.noConnectionError);
            }
            return list;
        });
    }
    /**
     * Downloads model
     * @param model model object
     */
    downloadModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let fileContent = '';
            if (connection) {
                const query = queries.getModelContentQuery(model);
                let result = yield this._queryRunner.safeRunQuery(connection, query);
                if (result && result.rows && result.rows.length > 0) {
                    for (let index = 0; index < result.rows[0].length; index++) {
                        const column = result.rows[0][index];
                        let content = column.displayValue;
                        content = content.startsWith('0x') || content.startsWith('0X') ? content.substr(2) : content;
                        fileContent = fileContent + content;
                    }
                    return yield utils.writeFileFromHex(fileContent);
                }
                else {
                    throw Error(constants.invalidModelToSelectError);
                }
            }
            else {
                throw Error(constants.noConnectionError);
            }
        });
    }
    /**
     * Loads model parameters
     */
    loadModelParameters(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._modelClient.loadModelParameters(filePath);
        });
    }
    /**
     * Deploys local model
     * @param filePath model file path
     * @param details model details
     */
    deployLocalModel(filePath, details, table) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection && table.databaseName) {
                yield this.configureImport(connection, table);
                let currentModels = yield this.getDeployedModels(table);
                const content = yield utils.readFileInHex(filePath);
                let modelToAdd = Object.assign({}, {
                    id: 0,
                    content: content,
                    table: table
                }, details);
                yield this._queryRunner.runWithDatabaseChange(connection, queries.getInsertModelQuery(modelToAdd, table), table.databaseName);
                let updatedModels = yield this.getDeployedModels(table);
                if (updatedModels.length < currentModels.length + 1) {
                    throw Error(constants.importModelFailedError(details === null || details === void 0 ? void 0 : details.modelName, filePath));
                }
            }
            else {
                throw new Error(constants.noConnectionError);
            }
        });
    }
    /**
     * Updates a model
     */
    updateModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection && model && model.table && model.table.databaseName) {
                yield this._queryRunner.runWithDatabaseChange(connection, queries.getUpdateModelQuery(model), model.table.databaseName);
            }
            else {
                throw new Error(constants.noConnectionError);
            }
        });
    }
    /**
     * Updates a model
     */
    deleteModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection && model && model.table && model.table.databaseName) {
                yield this._queryRunner.runWithDatabaseChange(connection, queries.getDeleteModelQuery(model), model.table.databaseName);
            }
            else {
                throw new Error(constants.noConnectionError);
            }
        });
    }
    configureImport(connection, table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection && table.databaseName) {
                let query = queries.getDatabaseConfigureQuery(table);
                yield this._queryRunner.safeRunQuery(connection, query);
                query = queries.getConfigureTableQuery(table);
                yield this._queryRunner.runWithDatabaseChange(connection, query, table.databaseName);
            }
        });
    }
    /**
     * Verifies if the given table name is valid to be used as import table. If table doesn't exist returns true to create new table
     * Otherwise verifies the schema and returns true if the schema is supported
     * @param connection database connection
     * @param table config table name
     */
    verifyConfigTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection && table.databaseName) {
                let databases = yield this._apiWrapper.listDatabases(connection.connectionId);
                // If database exist verify the table schema
                //
                if ((yield databases).find(x => x === table.databaseName)) {
                    const query = queries.getConfigTableVerificationQuery(table);
                    const result = yield this._queryRunner.runWithDatabaseChange(connection, query, table.databaseName);
                    return result !== undefined && result.rows.length > 0 && result.rows[0][0].displayValue === '1';
                }
                else {
                    return true;
                }
            }
            else {
                throw new Error(constants.noConnectionError);
            }
        });
    }
    /**
     * Installs the dependencies required for model management
     */
    installDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._modelClient.installDependencies();
        });
    }
    getRecentImportTable() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let table;
            if (connection) {
                table = this._recentModelService.getModelTable(connection);
                if (!table) {
                    table = {
                        databaseName: (_a = connection.databaseName) !== null && _a !== void 0 ? _a : 'master',
                        tableName: this._config.registeredModelTableName,
                        schema: this._config.registeredModelTableSchemaName
                    };
                }
            }
            else {
                throw new Error(constants.noConnectionError);
            }
            return table;
        });
    }
    storeRecentImportTable(importTable) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                this._recentModelService.storeModelTable(connection, importTable);
            }
            else {
                throw new Error(constants.noConnectionError);
            }
        });
    }
    loadModelData(row, table) {
        return {
            id: +row[0].displayValue,
            modelName: row[1].displayValue,
            description: row[2].displayValue,
            version: row[3].displayValue,
            created: row[4].displayValue,
            framework: row[5].displayValue,
            frameworkVersion: row[6].displayValue,
            deploymentTime: row[7].displayValue,
            deployedBy: row[8].displayValue,
            runId: row[9].displayValue,
            contentLength: +row[10].displayValue,
            table: table
        };
    }
    getCurrentConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getCurrentConnection();
        });
    }
}
exports.DeployedModelService = DeployedModelService;
//# sourceMappingURL=deployedModelService.js.map