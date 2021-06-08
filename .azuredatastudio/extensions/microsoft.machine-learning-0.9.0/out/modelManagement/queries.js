"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectQuery = exports.getDeleteModelQuery = exports.getUpdateModelQuery = exports.getModelContentQuery = exports.getInsertModelQuery = exports.getConfigureTableQuery = exports.getConfigTableVerificationQuery = exports.getDeployedModelsQuery = exports.getDatabaseConfigureQuery = void 0;
const utils = require("../common/utils");
function getDatabaseConfigureQuery(configTable) {
    return `
		IF NOT EXISTS (
			SELECT name
				FROM sys.databases
				WHERE name = N'${utils.doubleEscapeSingleQuotes(configTable.databaseName)}'
		)
			CREATE DATABASE [${utils.doubleEscapeSingleBrackets(configTable.databaseName)}]
			`;
}
exports.getDatabaseConfigureQuery = getDatabaseConfigureQuery;
function getDeployedModelsQuery(table) {
    return `
		${exports.selectQuery}
		FROM ${utils.getRegisteredModelsThreePartsName(table.databaseName || '', table.tableName || '', table.schema || '')}
		WHERE model_name not like 'MLmodel' and model_name not like 'conda.yaml'
		ORDER BY model_id
		`;
}
exports.getDeployedModelsQuery = getDeployedModelsQuery;
/**
 * Verifies config table has the expected schema
 * @param databaseName
 * @param tableName
 */
function getConfigTableVerificationQuery(table) {
    let tableName = table.tableName;
    let schemaName = table.schema;
    const twoPartTableName = utils.getRegisteredModelsTwoPartsName(table.tableName || '', table.schema || '');
    return `
		IF NOT EXISTS (
			SELECT name
				FROM sys.databases
				WHERE name = N'${utils.doubleEscapeSingleQuotes(table.databaseName)}'
		)
		BEGIN
			SELECT 1
		END
		ELSE
		BEGIN
			USE [${utils.doubleEscapeSingleBrackets(table.databaseName)}]
			IF EXISTS
				(  SELECT t.name, s.name
					FROM sys.tables t join sys.schemas s on t.schema_id=t.schema_id
					WHERE t.name = '${utils.doubleEscapeSingleQuotes(tableName)}'
					AND s.name = '${utils.doubleEscapeSingleQuotes(schemaName)}'
				)
			BEGIN
				IF EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_name')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_id')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_description')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_framework')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_framework_version')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_version')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_creation_time')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='model_deployment_time')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='deployed_by')
					AND EXISTS (SELECT * FROM syscolumns WHERE ID=OBJECT_ID('${twoPartTableName}') AND NAME='run_id')
				BEGIN
					SELECT 1
				END
				ELSE
				BEGIN
					SELECT 0
				END
			END
			ELSE
				SELECT 1
		END
		`;
}
exports.getConfigTableVerificationQuery = getConfigTableVerificationQuery;
/**
 * Creates the import table if doesn't exist
 */
function getConfigureTableQuery(table) {
    let tableName = table.tableName;
    let schemaName = table.schema;
    const twoPartTableName = utils.getRegisteredModelsTwoPartsName(table.tableName || '', table.schema || '');
    return `
		IF NOT EXISTS
			(  SELECT t.name, s.name
				FROM sys.tables t join sys.schemas s on t.schema_id=t.schema_id
				WHERE t.name = '${utils.doubleEscapeSingleQuotes(tableName)}'
				AND s.name = '${utils.doubleEscapeSingleQuotes(schemaName)}'
			)
		BEGIN
		CREATE TABLE ${twoPartTableName}(
			[model_id] [int] IDENTITY(1,1) NOT NULL,
			[model_name] [varchar](256) NOT NULL,
			[model_framework] [varchar](256) NULL,
			[model_framework_version] [varchar](256) NULL,
			[model] [varbinary](max) NOT NULL,
			[model_version] [varchar](256) NULL,
			[model_creation_time] [datetime2] NULL,
			[model_deployment_time] [datetime2] NULL,
			[deployed_by] [int] NULL,
			[model_description] [varchar](256) NULL,
			[run_id] [varchar](256) NULL,
		CONSTRAINT [${utils.doubleEscapeSingleBrackets(tableName)}_models_pk] PRIMARY KEY CLUSTERED
		(
			[model_id] ASC
		)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
		) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
		ALTER TABLE ${twoPartTableName} ADD  CONSTRAINT [${utils.doubleEscapeSingleBrackets(tableName)}_deployment_time]  DEFAULT (getdate()) FOR [model_deployment_time]
		END
		`;
}
exports.getConfigureTableQuery = getConfigureTableQuery;
function getInsertModelQuery(model, table) {
    const twoPartTableName = utils.getRegisteredModelsTwoPartsName(table.tableName || '', table.schema || '');
    const threePartTableName = utils.getRegisteredModelsThreePartsName(table.databaseName || '', table.tableName || '', table.schema || '');
    let updateScript = `
		INSERT INTO ${twoPartTableName}
		(model_name, model, model_version, model_description, model_creation_time, model_framework, model_framework_version, run_id)
		VALUES (
			'${utils.doubleEscapeSingleQuotes(model.modelName || '')}',
			${utils.doubleEscapeSingleQuotes(model.content || '')},
			'${utils.doubleEscapeSingleQuotes(model.version || '')}',
			'${utils.doubleEscapeSingleQuotes(model.description || '')}',
			'${utils.doubleEscapeSingleQuotes(model.created || '')}',
			'${utils.doubleEscapeSingleQuotes(model.framework || '')}',
			'${utils.doubleEscapeSingleQuotes(model.frameworkVersion || '')}',
			'${utils.doubleEscapeSingleQuotes(model.runId || '')}')
		`;
    return `
		${updateScript}
		${exports.selectQuery}
		FROM ${threePartTableName}
		WHERE model_id = SCOPE_IDENTITY();
		`;
}
exports.getInsertModelQuery = getInsertModelQuery;
/**
 * Returns the query for loading model content from database
 * @param model model information
 */
function getModelContentQuery(model) {
    const threePartTableName = utils.getRegisteredModelsThreePartsName(model.table.databaseName || '', model.table.tableName || '', model.table.schema || '');
    const len = model.contentLength !== undefined ? model.contentLength : 0;
    const maxLength = 1000;
    let numberOfColumns = len / maxLength;
    // The query provider doesn't return the whole file bites if too big. so loading the bites it blocks
    // and merge together to load the file
    numberOfColumns = numberOfColumns <= 0 ? 1 : numberOfColumns;
    let columns = [];
    let fileIndex = 0;
    for (let index = 0; index < numberOfColumns; index++) {
        const length = fileIndex === 0 ? maxLength + 1 : maxLength;
        columns.push(`substring(@str, ${fileIndex}, ${length}) as d${index}`);
        fileIndex = fileIndex + length;
    }
    if (fileIndex < len) {
        columns.push(`substring(@str, ${fileIndex}, ${maxLength}) as d${columns.length}`);
    }
    return `
		DECLARE @str varbinary(max)

		SELECT @str=model
		FROM ${threePartTableName}
		WHERE model_id = ${model.id};

		select ${columns.join(',')}
		`;
}
exports.getModelContentQuery = getModelContentQuery;
function getUpdateModelQuery(model) {
    const twoPartTableName = utils.getRegisteredModelsTwoPartsName(model.table.tableName || '', model.table.schema || '');
    const threePartTableName = utils.getRegisteredModelsThreePartsName(model.table.databaseName || '', model.table.tableName || '', model.table.schema || '');
    let updateScript = `
	UPDATE ${twoPartTableName}
	SET
	model_name = '${utils.doubleEscapeSingleQuotes(model.modelName || '')}',
	model_version = '${utils.doubleEscapeSingleQuotes(model.version || '')}',
	model_description = '${utils.doubleEscapeSingleQuotes(model.description || '')}',
	model_creation_time = '${utils.doubleEscapeSingleQuotes(model.created || '')}',
	model_framework = '${utils.doubleEscapeSingleQuotes(model.frameworkVersion || '')}',
	model_framework_version = '${utils.doubleEscapeSingleQuotes(model.frameworkVersion || '')}',
	run_id = '${utils.doubleEscapeSingleQuotes(model.runId || '')}'
	WHERE model_id = ${model.id}`;
    return `
	${updateScript}
	${exports.selectQuery}
	FROM ${threePartTableName}
	WHERE model_id = ${model.id};
	`;
}
exports.getUpdateModelQuery = getUpdateModelQuery;
function getDeleteModelQuery(model) {
    const twoPartTableName = utils.getRegisteredModelsTwoPartsName(model.table.tableName || '', model.table.schema || '');
    const threePartTableName = utils.getRegisteredModelsThreePartsName(model.table.databaseName || '', model.table.tableName || '', model.table.schema || '');
    let updateScript = `
		Delete from ${twoPartTableName}
		WHERE model_id = ${model.id}`;
    return `
		${updateScript}
		${exports.selectQuery}
		FROM ${threePartTableName}
		`;
}
exports.getDeleteModelQuery = getDeleteModelQuery;
exports.selectQuery = 'SELECT model_id, model_name, model_description, model_version, model_creation_time, model_framework, model_framework_version, model_deployment_time, deployed_by, run_id, len(model)';
//# sourceMappingURL=queries.js.map