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
exports.ModelPythonClient = void 0;
const azdata = require("azdata");
const UUID = require("vscode-languageclient/lib/utils/uuid");
const utils = require("../common/utils");
const constants = require("../common/constants");
const os = require("os");
/**
 * Python client for ONNX models
 */
class ModelPythonClient {
    /**
     * Creates new instance
     */
    constructor(_outputChannel, _apiWrapper, _processService, _config, _packageManager) {
        this._outputChannel = _outputChannel;
        this._apiWrapper = _apiWrapper;
        this._processService = _processService;
        this._config = _config;
        this._packageManager = _packageManager;
    }
    /**
     * Deploys models in the SQL database using mlflow
     * @param connection
     * @param modelPath
     */
    deployModel(connection, modelPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.installDependencies();
            yield this.executeDeployScripts(connection, modelPath);
        });
    }
    /**
     * Installs dependencies for python client
     */
    installDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            yield utils.executeTasks(this._apiWrapper, constants.installModelMngDependenciesMsgTaskName, [
                this._packageManager.installRequiredPythonPackages(this._config.modelsRequiredPythonPackages)
            ], true);
        });
    }
    /**
     *
     * @param modelPath Loads model parameters
     */
    loadModelParameters(modelPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeModelParametersScripts(modelPath);
        });
    }
    executeModelParametersScripts(modelFolderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            modelFolderPath = utils.makeLinuxPath(modelFolderPath);
            let scripts = [
                'import onnx',
                'import json',
                `onnx_model_path = '${modelFolderPath}'`,
                `onnx_model = onnx.load_model(onnx_model_path)`,
                `type_list = ['undefined',
			'float', 'uint8', 'int8', 'uint16', 'int16', 'int32', 'int64', 'string', 'bool', 'double',
			'uint32', 'uint64', 'complex64', 'complex128', 'bfloat16']`,
                `type_map = {
				onnx.TensorProto.DataType.FLOAT: 'REAL',
				onnx.TensorProto.DataType.UINT8: 'TINYINT',
				onnx.TensorProto.DataType.INT16: 'SMALLINT',
				onnx.TensorProto.DataType.INT32: 'INT',
				onnx.TensorProto.DataType.INT64: 'BIGINT',
				onnx.TensorProto.DataType.STRING: 'VARCHAR(MAX)',
				onnx.TensorProto.DataType.DOUBLE: 'FLOAT'}`,
                `parameters = {
				"inputs": [],
				"outputs": []
			}`,
                `def addParameters(list, paramType):
			for id, p in enumerate(list):
				p_type = ''
				value = p.type.tensor_type.elem_type
				if value in type_map:
					p_type = type_map[value]
				name = type_list[value]
				if name != 'undefined':
					parameters[paramType].append({
						'name': p.name,
						'type': p_type,
						'originalType': name
					})`,
                'addParameters(onnx_model.graph.input, "inputs")',
                'addParameters(onnx_model.graph.output, "outputs")',
                'print(json.dumps(parameters))'
            ];
            let pythonExecutable = yield this._config.getPythonExecutable(true);
            let output = yield this._processService.execScripts(pythonExecutable, scripts, [], undefined);
            let parametersJson = JSON.parse(output);
            return Object.assign({}, parametersJson);
        });
    }
    executeDeployScripts(connection, modelFolderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let home = utils.makeLinuxPath(os.homedir());
            modelFolderPath = utils.makeLinuxPath(modelFolderPath);
            let credentials = yield this._apiWrapper.getCredentials(connection.connectionId);
            if (connection) {
                let server = connection.serverName;
                const experimentId = `ads_ml_experiment_${UUID.generateUuid()}`;
                const credential = connection.userName ? `${connection.userName}:${credentials[azdata.ConnectionOptionSpecialType.password]}@` : '';
                let scripts = [
                    'import mlflow.onnx',
                    `tracking_uri = "file://${home}/mlruns"`,
                    'print(tracking_uri)',
                    'import onnx',
                    'from mlflow.tracking.client import MlflowClient',
                    `onx = onnx.load("${modelFolderPath}")`,
                    `mlflow.set_tracking_uri(tracking_uri)`,
                    'client = MlflowClient()',
                    `exp_name = "${experimentId}"`,
                    `db_uri_artifact = "mssql+pyodbc://${credential}${server}/MlFlowDB?driver=ODBC+Driver+17+for+SQL+Server&"`,
                    'client.create_experiment(exp_name, artifact_location=db_uri_artifact)',
                    'mlflow.set_experiment(exp_name)',
                    'mlflow.onnx.log_model(onx, "pipeline_vectorize")'
                ];
                let pythonExecutable = yield this._config.getPythonExecutable(true);
                yield this._processService.execScripts(pythonExecutable, scripts, [], this._outputChannel);
            }
        });
    }
}
exports.ModelPythonClient = ModelPythonClient;
//# sourceMappingURL=modelPythonClient.js.map