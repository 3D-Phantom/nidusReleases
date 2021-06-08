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
exports.AzureModelRegistryService = void 0;
const azdata = require("azdata");
const constants = require("../common/constants");
const arm_machinelearningservices_1 = require("@azure/arm-machinelearningservices");
const ms_rest_js_1 = require("@azure/ms-rest-js");
const workspacesModels_1 = require("./workspacesModels");
const assets_1 = require("./assets");
const polly = require("polly-js");
const artifacts_1 = require("./artifacts");
const UUID = require("vscode-languageclient/lib/utils/uuid");
const path = require("path");
const os = require("os");
const utils = require("../common/utils");
/**
 * Azure Model Service
 */
class AzureModelRegistryService {
    /**
     * Creates new service
     */
    constructor(_apiWrapper, _config, _httpClient, _outputChannel) {
        this._apiWrapper = _apiWrapper;
        this._config = _config;
        this._httpClient = _httpClient;
        this._outputChannel = _outputChannel;
    }
    /**
     * Returns list of azure accounts
     */
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getAllAccounts();
        });
    }
    /**
     * Returns list of azure subscriptions
     * @param account azure account
     */
    getSubscriptions(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (yield this._apiWrapper.getAzurecoreApi()).getSubscriptions(account, true);
            return data === null || data === void 0 ? void 0 : data.subscriptions;
        });
    }
    /**
     * Returns list of azure groups
     * @param account azure account
     * @param subscription azure subscription
     */
    getGroups(account, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (yield this._apiWrapper.getAzurecoreApi()).getResourceGroups(account, subscription, true);
            return data === null || data === void 0 ? void 0 : data.resourceGroups;
        });
    }
    /**
     * Returns list of workspaces
     * @param account azure account
     * @param subscription azure subscription
     * @param resourceGroup azure resource group
     */
    getWorkspaces(account, subscription, resourceGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetchWorkspaces(account, subscription, resourceGroup);
        });
    }
    /**
     * Returns list of models
     * @param account azure account
     * @param subscription azure subscription
     * @param resourceGroup azure resource group
     * @param workspace azure workspace
     */
    getModels(account, subscription, resourceGroup, workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetchModels(account, subscription, resourceGroup, workspace);
        });
    }
    /**
     * Download an azure model to a temporary location
     * @param account azure account
     * @param subscription azure subscription
     * @param resourceGroup azure resource group
     * @param workspace azure workspace
     * @param model azure model
     */
    downloadModel(account, subscription, resourceGroup, workspace, model) {
        return __awaiter(this, void 0, void 0, function* () {
            let downloadedFilePath = '';
            for (const tenant of account.properties.tenants) {
                try {
                    const downloadUrls = yield this.getAssetArtifactsDownloadLinks(account, subscription, resourceGroup, workspace, model, tenant);
                    if (downloadUrls && downloadUrls.length > 0) {
                        downloadedFilePath = yield this.execDownloadArtifactTask(downloadUrls[0]);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            return downloadedFilePath;
        });
    }
    set AzureMachineLearningClient(value) {
        this._amlClient = value;
    }
    set ModelClient(value) {
        this._modelClient = value;
    }
    signInToAzure() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._apiWrapper.executeCommand(constants.signInToAzureCommand);
        });
    }
    /**
     * Execute the background task to download the artifact
     */
    execDownloadArtifactTask(downloadUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield utils.executeTasks(this._apiWrapper, constants.downloadModelMsgTaskName, [this.downloadArtifact(downloadUrl)], true);
            return results && results.length > 0 ? results[0] : constants.noResultError;
        });
    }
    downloadArtifact(downloadUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempFilePath = path.join(os.tmpdir(), `ads_ml_temp_${UUID.generateUuid()}`);
            yield this._httpClient.download(downloadUrl, tempFilePath, this._outputChannel);
            return tempFilePath;
        });
    }
    fetchWorkspaces(account, subscription, resourceGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let resources = [];
            try {
                for (const tenant of account.properties.tenants) {
                    const client = yield this.getAmlClient(account, subscription, tenant);
                    let result = resourceGroup ? yield client.workspaces.listByResourceGroup(resourceGroup.name) : yield client.workspaces.listBySubscription();
                    if (result) {
                        resources.push(...result);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
            return resources;
        });
    }
    fetchModels(account, subscription, resourceGroup, workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            let resources = [];
            for (const tenant of account.properties.tenants) {
                try {
                    let options = {
                        baseUri: this.getBaseUrl(workspace, this._config.amlModelManagementUrl)
                    };
                    const client = yield this.getAmlClient(account, subscription, tenant, options, this._config.amlApiVersion);
                    let modelsClient = this.getModelClient(client);
                    resources = resources.concat(yield modelsClient.listModels(resourceGroup.name, workspace.name || ''));
                }
                catch (error) {
                    console.log(error);
                }
            }
            return resources;
        });
    }
    fetchModelAsset(subscription, resourceGroup, workspace, model, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelId = this.getModelId(model);
            if (modelId) {
                let modelsClient = new assets_1.Assets(client);
                return yield modelsClient.queryById(subscription.id, resourceGroup.name, workspace.name || '', modelId);
            }
            else {
                throw Error(constants.invalidModelIdError(model.url));
            }
        });
    }
    getAssetArtifactsDownloadLinks(account, subscription, resourceGroup, workspace, model, tenant) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                baseUri: this.getBaseUrl(workspace, this._config.amlModelManagementUrl)
            };
            const modelManagementClient = yield this.getAmlClient(account, subscription, tenant, options, this._config.amlApiVersion);
            const asset = yield this.fetchModelAsset(subscription, resourceGroup, workspace, model, modelManagementClient);
            options.baseUri = this.getBaseUrl(workspace, this._config.amlExperienceUrl);
            const experienceClient = yield this.getAmlClient(account, subscription, tenant, options, this._config.amlApiVersion);
            const artifactClient = new artifacts_1.Artifacts(experienceClient);
            let downloadLinks = [];
            if (asset && asset.artifacts) {
                const downloadLinkPromises = [];
                for (const artifact of asset.artifacts) {
                    const parts = artifact.id
                        ? this.getPartsFromAssetIdOrPrefix(artifact.id)
                        : this.getPartsFromAssetIdOrPrefix(artifact.prefix);
                    if (parts) {
                        const promise = polly()
                            .waitAndRetry(3)
                            .executeForPromise(() => __awaiter(this, void 0, void 0, function* () {
                            const artifact = yield artifactClient.getArtifactContentInformation2(experienceClient.subscriptionId, resourceGroup.name, workspace.name || '', parts.origin, parts.container, { path: parts.path });
                            if (artifact) {
                                return artifact.contentUri || '';
                            }
                            else {
                                return Promise.reject();
                            }
                        }));
                        downloadLinkPromises.push(promise);
                    }
                }
                try {
                    downloadLinks = yield Promise.all(downloadLinkPromises);
                }
                catch (rejectedPromiseError) {
                    return rejectedPromiseError;
                }
                return downloadLinks;
            }
            else {
                throw Error(constants.noArtifactError(model.url));
            }
        });
    }
    getPartsFromAssetIdOrPrefix(idOrPrefix) {
        const artifactRegex = /^(.+?)\/(.+?)\/(.+?)$/;
        if (idOrPrefix) {
            const parts = artifactRegex.exec(idOrPrefix);
            if (parts && parts.length === 4) {
                return {
                    origin: parts[1],
                    container: parts[2],
                    path: parts[3]
                };
            }
        }
        return undefined;
    }
    getBaseUrl(workspace, server) {
        let baseUri = `https://${workspace.location}.${server}`;
        if (workspace.location === 'chinaeast2') {
            baseUri = `https://${workspace.location}.${server}`;
        }
        return baseUri;
    }
    getModelClient(amlClient) {
        var _a;
        return (_a = this._modelClient) !== null && _a !== void 0 ? _a : new workspacesModels_1.WorkspaceModels(amlClient);
    }
    getAmlClient(account, subscription, tenant, options = undefined, apiVersion = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._amlClient) {
                return this._amlClient;
            }
            else {
                const tokens = yield this._apiWrapper.getAccountSecurityToken(account, tenant.id, azdata.AzureResource.ResourceManagement);
                let token = '';
                let tokenType = undefined;
                if (tokens) {
                    token = tokens.token;
                    tokenType = tokens.tokenType;
                }
                const client = new arm_machinelearningservices_1.AzureMachineLearningWorkspaces(new ms_rest_js_1.TokenCredentials(token, tokenType), subscription.id, options);
                if (apiVersion) {
                    client.apiVersion = apiVersion;
                }
                return client;
            }
        });
    }
    getModelId(model) {
        const amlAssetRegex = /^aml:\/\/asset\/(.+)$/;
        const id = model ? amlAssetRegex.exec(model.url || '') : undefined;
        return id && id.length === 2 ? id[1] : '';
    }
}
exports.AzureModelRegistryService = AzureModelRegistryService;
//# sourceMappingURL=azureModelRegistryService.js.map