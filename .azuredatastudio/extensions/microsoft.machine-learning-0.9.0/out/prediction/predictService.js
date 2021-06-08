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
exports.PredictService = void 0;
const utils = require("../common/utils");
const queries = require("./queries");
/**
 * Service to make prediction
 */
class PredictService {
    /**
     * Creates new instance
     */
    constructor(_apiWrapper, _queryRunner) {
        this._apiWrapper = _apiWrapper;
        this._queryRunner = _queryRunner;
    }
    /**
     * Returns the list of databases
     */
    getDatabaseList() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                return yield this._apiWrapper.listDatabases(connection.connectionId);
            }
            return [];
        });
    }
    /**
     * Returns true if server supports ONNX
     */
    serverSupportOnnxModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let connection = yield this.getCurrentConnection();
                if (connection) {
                    const serverInfo = yield this._apiWrapper.getServerInfo(connection.connectionId);
                    // Right now only Azure SQL Edge and MI support Onnx
                    //
                    return serverInfo && (serverInfo.engineEditionId === 9 || serverInfo.engineEditionId === 8);
                }
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    /**
     * Generates prediction script given model info and predict parameters
     * @param predictParams predict parameters
     * @param registeredModel model parameters
     */
    generatePredictScript(predictParams, registeredModel, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let query = '';
            if (registeredModel && registeredModel.id) {
                query = queries.getPredictScriptWithModelId(registeredModel.id, predictParams.inputColumns || [], predictParams.outputColumns || [], predictParams, registeredModel.table);
            }
            else if (filePath) {
                let modelBytes = yield utils.readFileInHex(filePath || '');
                query = queries.getPredictScriptWithModelBytes(modelBytes, predictParams.inputColumns || [], predictParams.outputColumns || [], predictParams);
            }
            let document = yield this._apiWrapper.openTextDocument({
                language: 'sql',
                content: query
            });
            yield this._apiWrapper.executeCommand('vscode.open', document.uri);
            yield this._apiWrapper.connect(document.uri.toString(), connection.connectionId);
            this._apiWrapper.runQuery(document.uri.toString(), undefined, false);
            return query;
        });
    }
    /**
     * Returns list of tables given database name
     * @param databaseName database name
     */
    getTableList(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let list = [];
            if (connection) {
                let query = utils.getScriptWithDBChange(connection.databaseName, databaseName, queries.getTablesScript(databaseName));
                let result = yield this._queryRunner.safeRunQuery(connection, query);
                if (result && result.rows && result.rows.length > 0) {
                    result.rows.forEach(row => {
                        list.push({
                            databaseName: databaseName,
                            tableName: row[0].displayValue,
                            schema: row[1].displayValue
                        });
                    });
                }
            }
            return list;
        });
    }
    /**
     *Returns list of column names of a database
     * @param databaseTable table info
     */
    getTableColumnsList(databaseTable) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            let list = [];
            if (connection && databaseTable.databaseName) {
                const query = utils.getScriptWithDBChange(connection.databaseName, databaseTable.databaseName, queries.getTableColumnsScript(databaseTable));
                let result = yield this._queryRunner.safeRunQuery(connection, query);
                if (result && result.rows && result.rows.length > 0) {
                    result.rows.forEach(row => {
                        list.push({
                            columnName: row[0].displayValue,
                            dataType: row[1].displayValue.toLocaleUpperCase(),
                            maxLength: row[2].isNull ? undefined : +row[2].displayValue.toLocaleUpperCase()
                        });
                    });
                }
            }
            return list;
        });
    }
    getCurrentConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getCurrentConnection();
        });
    }
}
exports.PredictService = PredictService;
//# sourceMappingURL=predictService.js.map