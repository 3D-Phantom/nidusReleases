"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputParameters = exports.getPredictColumnNames = exports.getColumnName = exports.getPredictInputColumnNames = exports.getInputColumnNames = exports.getEscapedColumnName = exports.getPredictScriptWithModelBytes = exports.getPredictScriptWithModelId = exports.getTablesScript = exports.getTableColumnsScript = void 0;
const utils = require("../common/utils");
const constants = require("../common/constants");
function getTableColumnsScript(databaseTable) {
    return `
SELECT COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME='${utils.doubleEscapeSingleQuotes(databaseTable.tableName)}'
AND TABLE_SCHEMA='${utils.doubleEscapeSingleQuotes(databaseTable.schema)}'
AND TABLE_CATALOG='${utils.doubleEscapeSingleQuotes(databaseTable.databaseName)}'
	`;
}
exports.getTableColumnsScript = getTableColumnsScript;
function getTablesScript(databaseName) {
    return `
SELECT TABLE_NAME,TABLE_SCHEMA
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='${utils.doubleEscapeSingleQuotes(databaseName)}'
	`;
}
exports.getTablesScript = getTablesScript;
function getPredictScriptWithModelId(modelId, columns, outputColumns, sourceTable, importTable) {
    const threePartTableName = utils.getRegisteredModelsThreePartsName(importTable.databaseName || '', importTable.tableName || '', importTable.schema || '');
    return `
DECLARE @model VARBINARY(max) = (
SELECT model
FROM ${threePartTableName}
WHERE model_id = ${modelId}
);
WITH predict_input
AS (
	SELECT TOP 1000
	${getInputColumnNames(columns, 'pi')}
FROM [${utils.doubleEscapeSingleBrackets(sourceTable.databaseName)}].[${sourceTable.schema}].[${utils.doubleEscapeSingleBrackets(sourceTable.tableName)}] AS pi
)
SELECT
${getPredictColumnNames(columns, 'predict_input')},
${getPredictInputColumnNames(outputColumns, 'p')}
FROM PREDICT(MODEL = @model, DATA = predict_input, runtime=onnx)
WITH (
${getOutputParameters(outputColumns)}
) AS p
`;
}
exports.getPredictScriptWithModelId = getPredictScriptWithModelId;
function getPredictScriptWithModelBytes(modelBytes, columns, outputColumns, sourceTable) {
    return `
WITH predict_input
AS (
	SELECT TOP 1000
	${getInputColumnNames(columns, 'pi')}
FROM [${utils.doubleEscapeSingleBrackets(sourceTable.databaseName)}].[${sourceTable.schema}].[${utils.doubleEscapeSingleBrackets(sourceTable.tableName)}] AS pi
)
SELECT
${getPredictColumnNames(columns, 'predict_input')},
${getPredictInputColumnNames(outputColumns, 'p')}
FROM PREDICT(MODEL = ${modelBytes}, DATA = predict_input, runtime=onnx)
WITH (
${getOutputParameters(outputColumns)}
) AS p
`;
}
exports.getPredictScriptWithModelBytes = getPredictScriptWithModelBytes;
function getEscapedColumnName(tableName, columnName) {
    return `[${utils.doubleEscapeSingleBrackets(tableName)}].[${utils.doubleEscapeSingleBrackets(columnName)}]`;
}
exports.getEscapedColumnName = getEscapedColumnName;
function getInputColumnNames(columns, tableName) {
    return columns.map(c => {
        const column = getEscapedColumnName(tableName, c.columnName);
        const maxLength = c.maxLength !== undefined ? c.maxLength : constants.varcharDefaultLength;
        let paramType = c.paramType === constants.varcharMax ? `VARCHAR(${maxLength})` : c.paramType;
        let columnName = c.dataType !== c.paramType ? `CAST(${column} AS ${paramType})`
            : `${column}`;
        return `${columnName} AS ${c.paramName}`;
    }).join(',\n	');
}
exports.getInputColumnNames = getInputColumnNames;
function getPredictInputColumnNames(columns, tableName) {
    return columns.map(c => {
        return getColumnName(tableName, c.paramName || '', c.columnName);
    }).join(',\n	');
}
exports.getPredictInputColumnNames = getPredictInputColumnNames;
function getColumnName(tableName, columnName, displayName) {
    const column = getEscapedColumnName(tableName, columnName);
    return columnName && columnName !== displayName ?
        `${column} AS [${utils.doubleEscapeSingleBrackets(displayName)}]` : column;
}
exports.getColumnName = getColumnName;
function getPredictColumnNames(columns, tableName) {
    return columns.map(c => {
        return c.paramName ? `${getEscapedColumnName(tableName, c.paramName)}`
            : `${getEscapedColumnName(tableName, c.columnName)}`;
    }).join(',\n');
}
exports.getPredictColumnNames = getPredictColumnNames;
function getOutputParameters(columns) {
    return columns.map(c => {
        return `${c.paramName} ${c.dataType}`;
    }).join(',\n');
}
exports.getOutputParameters = getOutputParameters;
//# sourceMappingURL=queries.js.map