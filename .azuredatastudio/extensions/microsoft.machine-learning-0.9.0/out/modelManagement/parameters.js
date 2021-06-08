"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountName = exports.path1 = exports.projectName0 = exports.container = exports.origin = exports.apiVersion = exports.acceptLanguage = exports.id = exports.resourceGroup = exports.workspace = exports.workspaceName = exports.resourceGroupName = exports.subscriptionId = void 0;
exports.subscriptionId = {
    parameterPath: 'subscriptionId',
    mapper: {
        required: true,
        serializedName: 'subscriptionId',
        type: {
            name: 'String'
        }
    }
};
exports.resourceGroupName = {
    parameterPath: 'resourceGroupName',
    mapper: {
        required: true,
        serializedName: 'resourceGroupName',
        type: {
            name: 'String'
        }
    }
};
exports.workspaceName = {
    parameterPath: 'workspaceName',
    mapper: {
        required: true,
        serializedName: 'workspaceName',
        type: {
            name: 'String'
        }
    }
};
exports.workspace = {
    parameterPath: 'workspace',
    mapper: {
        required: true,
        serializedName: 'workspace',
        type: {
            name: 'String'
        }
    }
};
exports.resourceGroup = {
    parameterPath: 'resourceGroup',
    mapper: {
        required: true,
        serializedName: 'resourceGroup',
        type: {
            name: 'String'
        }
    }
};
exports.id = {
    parameterPath: 'id',
    mapper: {
        required: true,
        serializedName: 'id',
        type: {
            name: 'String'
        }
    }
};
exports.acceptLanguage = {
    parameterPath: 'acceptLanguage',
    mapper: {
        serializedName: 'accept-language',
        defaultValue: 'en-US',
        type: {
            name: 'String'
        }
    }
};
exports.apiVersion = {
    parameterPath: 'apiVersion',
    mapper: {
        required: true,
        serializedName: 'api-version',
        type: {
            name: 'String'
        }
    }
};
exports.origin = {
    parameterPath: 'origin',
    mapper: {
        required: true,
        serializedName: 'origin',
        type: {
            name: 'String'
        }
    }
};
exports.container = {
    parameterPath: 'container',
    mapper: {
        required: true,
        serializedName: 'container',
        type: {
            name: 'String'
        }
    }
};
exports.projectName0 = {
    parameterPath: [
        'options',
        'projectName'
    ],
    mapper: {
        serializedName: 'projectName',
        type: {
            name: 'String'
        }
    }
};
exports.path1 = {
    parameterPath: [
        'options',
        'path'
    ],
    mapper: {
        serializedName: 'path',
        type: {
            name: 'String'
        }
    }
};
exports.accountName = {
    parameterPath: [
        'options',
        'accountName'
    ],
    mapper: {
        serializedName: 'accountName',
        type: {
            name: 'String'
        }
    }
};
//# sourceMappingURL=parameters.js.map