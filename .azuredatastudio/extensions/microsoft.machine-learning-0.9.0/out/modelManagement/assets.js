"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
const msRest = require("@azure/ms-rest-js");
const Mappers = require("./mappers");
const Parameters = require("./parameters");
class Assets {
    constructor(client) {
        this.client = client;
    }
    queryById(subscriptionId, resourceGroup, workspace, id, options, callback) {
        return this.client.sendOperationRequest({
            subscriptionId,
            resourceGroup,
            workspace,
            id,
            options
        }, queryByIdOperationSpec, callback);
    }
}
exports.Assets = Assets;
const serializer = new msRest.Serializer(Mappers);
const queryByIdOperationSpec = {
    httpMethod: 'GET',
    path: 'modelmanagement/v1.0/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.MachineLearningServices/workspaces/{workspace}/assets/{id}',
    urlParameters: [Parameters.subscriptionId, Parameters.resourceGroup, Parameters.workspace, Parameters.id],
    responses: {
        200: {
            bodyMapper: Mappers.Asset
        },
        default: {
            bodyMapper: Mappers.ModelErrorResponse
        }
    },
    serializer
};
//# sourceMappingURL=assets.js.map