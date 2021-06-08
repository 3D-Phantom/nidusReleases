"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceModels = void 0;
const msRest = require("@azure/ms-rest-js");
const Mappers = require("./mappers");
const Parameters = require("./parameters");
/**
 * Workspace models client
 */
class WorkspaceModels {
    constructor(client) {
        this.client = client;
    }
    listModels(resourceGroupName, workspaceName, options, callback) {
        return this.client.sendOperationRequest({
            resourceGroupName,
            workspaceName,
            options
        }, listModelsOperationSpec, callback);
    }
}
exports.WorkspaceModels = WorkspaceModels;
const serializer = new msRest.Serializer(Mappers);
const listModelsOperationSpec = {
    httpMethod: 'GET',
    path: 'modelmanagement/v1.0/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningServices/workspaces/{workspaceName}/models',
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.workspaceName
    ],
    queryParameters: [
        Parameters.apiVersion
    ],
    headerParameters: [
        Parameters.acceptLanguage
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ListWorkspaceModelsResult
        },
        default: {
            bodyMapper: Mappers.MachineLearningServiceError
        }
    },
    serializer
};
//# sourceMappingURL=workspacesModels.js.map