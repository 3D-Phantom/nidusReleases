"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelConfigRecent = void 0;
const TableConfigName = 'MLS_ModelTableConfigName';
class ModelConfigRecent {
    /**
     *
     */
    constructor(_memento) {
        this._memento = _memento;
    }
    getModelTable(connection) {
        return this._memento.get(this.getKey(connection));
    }
    storeModelTable(connection, table) {
        if (connection && (table === null || table === void 0 ? void 0 : table.databaseName) && (table === null || table === void 0 ? void 0 : table.tableName) && (table === null || table === void 0 ? void 0 : table.schema)) {
            const current = this.getModelTable(connection);
            if (!current || current.databaseName !== table.databaseName || current.tableName !== table.tableName || current.schema !== table.schema) {
                this._memento.update(this.getKey(connection), table);
            }
        }
    }
    getKey(connection) {
        return `${TableConfigName}_${connection.serverName}`;
    }
}
exports.ModelConfigRecent = ModelConfigRecent;
//# sourceMappingURL=modelConfigRecent.js.map