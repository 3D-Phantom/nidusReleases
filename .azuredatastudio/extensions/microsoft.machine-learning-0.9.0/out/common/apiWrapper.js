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
exports.ApiWrapper = void 0;
const vscode = require("vscode");
const azdata = require("azdata");
/**
 * Wrapper class to act as a facade over VSCode and Data APIs and allow us to test / mock callbacks into
 * this API from our code
 */
class ApiWrapper {
    createOutputChannel(name) {
        return vscode.window.createOutputChannel(name);
    }
    createTerminalWithOptions(options) {
        return vscode.window.createTerminal(options);
    }
    getCurrentConnection() {
        return azdata.connection.getCurrentConnection();
    }
    getCredentials(connectionId) {
        return azdata.connection.getCredentials(connectionId);
    }
    registerCommand(command, callback, thisArg) {
        return vscode.commands.registerCommand(command, callback, thisArg);
    }
    executeCommand(command, ...rest) {
        return vscode.commands.executeCommand(command, ...rest);
    }
    registerTaskHandler(taskId, handler) {
        azdata.tasks.registerTask(taskId, handler);
    }
    getUriForConnection(connectionId) {
        return azdata.connection.getUriForConnection(connectionId);
    }
    getProvider(providerId, providerType) {
        return azdata.dataprotocol.getProvider(providerId, providerType);
    }
    showErrorMessage(message, ...items) {
        return vscode.window.showErrorMessage(message, ...items);
    }
    showInfoMessage(message, ...items) {
        return vscode.window.showInformationMessage(message, ...items);
    }
    showOpenDialog(options) {
        return vscode.window.showOpenDialog(options);
    }
    startBackgroundOperation(operationInfo) {
        azdata.tasks.startBackgroundOperation(operationInfo);
    }
    openExternal(target) {
        return vscode.env.openExternal(target);
    }
    getExtension(extensionId) {
        return vscode.extensions.getExtension(extensionId);
    }
    getConfiguration(section, resource) {
        return vscode.workspace.getConfiguration(section, resource);
    }
    createTab(title) {
        return azdata.window.createTab(title);
    }
    createModelViewDialog(title, dialogName, width, dialogStyle, dialogPosition, renderHeader, renderFooter, dialogProperties) {
        return azdata.window.createModelViewDialog(title, dialogName, width, dialogStyle, dialogPosition, renderHeader, renderFooter, dialogProperties);
    }
    createWizard(title) {
        return azdata.window.createWizard(title);
    }
    createWizardPage(title) {
        return azdata.window.createWizardPage(title);
    }
    openDialog(dialog) {
        return azdata.window.openDialog(dialog);
    }
    getAllAccounts() {
        return azdata.accounts.getAllAccounts();
    }
    getAccountSecurityToken(account, tenant, resource) {
        return azdata.accounts.getAccountSecurityToken(account, tenant, resource);
    }
    showQuickPick(items, options, token) {
        return vscode.window.showQuickPick(items, options, token);
    }
    listDatabases(connectionId) {
        return azdata.connection.listDatabases(connectionId);
    }
    getServerInfo(connectionId) {
        return azdata.connection.getServerInfo(connectionId);
    }
    openTextDocument(options) {
        return vscode.workspace.openTextDocument(options);
    }
    connect(fileUri, connectionId) {
        return azdata.queryeditor.connect(fileUri, connectionId);
    }
    runQuery(fileUri, options, runCurrentQuery) {
        azdata.queryeditor.runQuery(fileUri, options, runCurrentQuery);
    }
    showTextDocument(uri, options) {
        return vscode.window.showTextDocument(uri, options);
    }
    createButton(label, position) {
        return azdata.window.createButton(label, position);
    }
    registerWidget(widgetId, handler) {
        azdata.ui.registerModelViewProvider(widgetId, handler);
    }
    getAzurecoreApi() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.azurecoreApi) {
                this.azurecoreApi = yield ((_a = this.getExtension("Microsoft.azurecore" /* name */)) === null || _a === void 0 ? void 0 : _a.activate());
                if (!this.azurecoreApi) {
                    throw new Error('Unable to retrieve azurecore API');
                }
            }
            return this.azurecoreApi;
        });
    }
}
exports.ApiWrapper = ApiWrapper;
//# sourceMappingURL=apiWrapper.js.map