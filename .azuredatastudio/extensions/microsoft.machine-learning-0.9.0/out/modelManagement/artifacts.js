"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artifacts = void 0;
const msRest = require("@azure/ms-rest-js");
const Mappers = require("./mappers");
const Parameters = require("./parameters");
class Artifacts {
    constructor(client) {
        this.client = client;
    }
    getArtifactContentInformation2(subscriptionId, resourceGroupName, workspaceName, origin, container, options, callback) {
        return this.client.sendOperationRequest({
            subscriptionId,
            resourceGroupName,
            workspaceName,
            origin,
            container,
            options
        }, getArtifactContentInformation2OperationSpec, callback);
    }
}
exports.Artifacts = Artifacts;
const serializer = new msRest.Serializer(Mappers);
const getArtifactContentInformation2OperationSpec = {
    httpMethod: 'GET',
    path: 'artifact/v1.0/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningServices/workspaces/{workspaceName}/artifacts/contentinfo/{origin}/{container}',
    urlParameters: [
        Parameters.subscriptionId,
        Parameters.resourceGroupName,
        Parameters.workspaceName,
        Parameters.origin,
        Parameters.container,
        Parameters.apiVersion
    ],
    queryParameters: [
        Parameters.projectName0,
        Parameters.path1,
        Parameters.accountName
    ],
    responses: {
        200: {
            bodyMapper: Mappers.ArtifactContentInformationDto
        },
        default: {}
    },
    serializer
};
//# sourceMappingURL=artifacts.js.map