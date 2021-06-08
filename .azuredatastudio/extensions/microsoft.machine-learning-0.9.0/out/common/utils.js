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
exports.getServerName = exports.getServerPort = exports.getKeyValueString = exports.getUserHome = exports.getPythonExeName = exports.getDefaultPythonLocation = exports.getFileName = exports.writeFileFromHex = exports.getRegisteredModelsTwoPartsName = exports.getRegisteredModelsThreePartsName = exports.getScriptWithDBChange = exports.makeLinuxPath = exports.promptConfirm = exports.executeTasks = exports.doubleEscapeSingleBrackets = exports.doubleEscapeSingleQuotes = exports.isWindows = exports.sortPackageVersions = exports.comparePackageVersions = exports.getRPackagesFolderPath = exports.getPackageFilePath = exports.getPythonExePath = exports.getPythonInstallationLocation = exports.createFolder = exports.isDirectory = exports.exists = exports.readFileInHex = exports.deleteFile = exports.execCommandOnTempFile = void 0;
const azdata = require("azdata");
const UUID = require("vscode-languageclient/lib/utils/uuid");
const path = require("path");
const os = require("os");
const fs = require("fs");
const constants = require("./constants");
const util_1 = require("util");
function execCommandOnTempFile(content, command) {
    return __awaiter(this, void 0, void 0, function* () {
        let tempFilePath = '';
        try {
            tempFilePath = path.join(os.tmpdir(), `ads_ml_temp_${UUID.generateUuid()}`);
            yield fs.promises.writeFile(tempFilePath, content);
            let result = yield command(tempFilePath);
            return result;
        }
        finally {
            yield deleteFile(tempFilePath);
        }
    });
}
exports.execCommandOnTempFile = execCommandOnTempFile;
/**
 * Deletes a file
 * @param filePath file path
 */
function deleteFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (filePath) {
            yield fs.promises.unlink(filePath);
        }
    });
}
exports.deleteFile = deleteFile;
function readFileInHex(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let buffer = yield fs.promises.readFile(filePath);
        return `0X${buffer.toString('hex')}`;
    });
}
exports.readFileInHex = readFileInHex;
function exists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return util_1.promisify(fs.exists)(path);
    });
}
exports.exists = exists;
function isDirectory(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stat = yield fs.promises.lstat(path);
            return stat.isDirectory();
        }
        catch (_a) {
            return false;
        }
    });
}
exports.isDirectory = isDirectory;
function createFolder(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let folderExists = yield exists(dirPath);
        if (!folderExists) {
            yield fs.promises.mkdir(dirPath);
        }
    });
}
exports.createFolder = createFolder;
function getPythonInstallationLocation(rootFolder) {
    return path.join(rootFolder, 'python');
}
exports.getPythonInstallationLocation = getPythonInstallationLocation;
function getPythonExePath(rootFolder) {
    return path.join(getPythonInstallationLocation(rootFolder), constants.pythonBundleVersion, process.platform === constants.winPlatform ? 'python.exe' : 'bin/python3');
}
exports.getPythonExePath = getPythonExePath;
function getPackageFilePath(rootFolder, packageName) {
    return path.join(rootFolder, constants.rLPackagedFolderName, packageName);
}
exports.getPackageFilePath = getPackageFilePath;
function getRPackagesFolderPath(rootFolder) {
    return path.join(rootFolder, constants.rLPackagedFolderName);
}
exports.getRPackagesFolderPath = getRPackagesFolderPath;
/**
 * Compares two version strings to see which is greater.
 * @param first First version string to compare.
 * @param second Second version string to compare.
 * @returns 1 if the first version is greater, -1 if it's less, and 0 otherwise.
 */
function comparePackageVersions(first, second) {
    let firstVersion = first.split('.').map(numStr => Number.parseInt(numStr));
    let secondVersion = second.split('.').map(numStr => Number.parseInt(numStr));
    // If versions have different lengths, then append zeroes to the shorter one
    if (firstVersion.length > secondVersion.length) {
        let diff = firstVersion.length - secondVersion.length;
        secondVersion = secondVersion.concat(new Array(diff).fill(0));
    }
    else if (secondVersion.length > firstVersion.length) {
        let diff = secondVersion.length - firstVersion.length;
        firstVersion = firstVersion.concat(new Array(diff).fill(0));
    }
    for (let i = 0; i < firstVersion.length; ++i) {
        if (firstVersion[i] > secondVersion[i]) {
            return 1;
        }
        else if (firstVersion[i] < secondVersion[i]) {
            return -1;
        }
    }
    return 0;
}
exports.comparePackageVersions = comparePackageVersions;
function sortPackageVersions(versions, ascending = true) {
    return versions.sort((first, second) => {
        let compareResult = comparePackageVersions(first, second);
        if (ascending) {
            return compareResult;
        }
        else {
            return compareResult * -1;
        }
    });
}
exports.sortPackageVersions = sortPackageVersions;
function isWindows() {
    return process.platform === 'win32';
}
exports.isWindows = isWindows;
/**
 * Escapes all single-quotes (') by prefixing them with another single quote ('')
 * ' => ''
 * @param value The string to escape
 */
function doubleEscapeSingleQuotes(value) {
    return value ? value.replace(/'/g, '\'\'') : '';
}
exports.doubleEscapeSingleQuotes = doubleEscapeSingleQuotes;
/**
 * Escapes all single-bracket ([]) by replacing them with another bracket quote ([[]])
 * ' => ''
 * @param value The string to escape
 */
function doubleEscapeSingleBrackets(value) {
    return value ? value.replace(/\[/g, '[[').replace(/\]/g, ']]') : '';
}
exports.doubleEscapeSingleBrackets = doubleEscapeSingleBrackets;
/**
 * Installs dependencies for the extension
 */
function executeTasks(apiWrapper, taskName, dependencies, parallel) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let msgTaskName = taskName;
            apiWrapper.startBackgroundOperation({
                displayName: msgTaskName,
                description: msgTaskName,
                isCancelable: false,
                operation: (op) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let result = [];
                        // Install required packages
                        //
                        if (parallel) {
                            result = yield Promise.all(dependencies);
                        }
                        else {
                            for (let index = 0; index < dependencies.length; index++) {
                                result.push(yield dependencies[index]);
                            }
                        }
                        op.updateStatus(azdata.TaskStatus.Succeeded);
                        resolve(result);
                    }
                    catch (error) {
                        let errorMsg = constants.taskFailedError(taskName, error ? error.message : '');
                        op.updateStatus(azdata.TaskStatus.Failed, errorMsg);
                        reject(errorMsg);
                    }
                })
            });
        });
    });
}
exports.executeTasks = executeTasks;
function promptConfirm(message, apiWrapper) {
    return __awaiter(this, void 0, void 0, function* () {
        let choices = {};
        choices[constants.msgYes] = true;
        choices[constants.msgNo] = false;
        let options = {
            placeHolder: message
        };
        let result = yield apiWrapper.showQuickPick(Object.keys(choices).map(c => {
            return {
                label: c
            };
        }), options);
        if (result === undefined) {
            throw Error('invalid selection');
        }
        return choices[result.label] || false;
    });
}
exports.promptConfirm = promptConfirm;
function makeLinuxPath(filePath) {
    const parts = filePath.split('\\');
    return parts.join('/');
}
exports.makeLinuxPath = makeLinuxPath;
/**
 *
 * @param currentDb Wraps the given script with database switch scripts
 * @param databaseName
 * @param script
 */
function getScriptWithDBChange(currentDb, databaseName, script) {
    if (!currentDb) {
        currentDb = 'master';
    }
    let escapedDbName = doubleEscapeSingleBrackets(databaseName);
    let escapedCurrentDbName = doubleEscapeSingleBrackets(currentDb);
    return `
	USE [${escapedDbName}]
	${script}
	USE [${escapedCurrentDbName}]
	`;
}
exports.getScriptWithDBChange = getScriptWithDBChange;
/**
 * Returns full name of model registration table
 * @param config config
 */
function getRegisteredModelsThreePartsName(db, table, schema) {
    const dbName = doubleEscapeSingleBrackets(db);
    const schemaName = doubleEscapeSingleBrackets(schema);
    const tableName = doubleEscapeSingleBrackets(table);
    return `[${dbName}].[${schemaName}].[${tableName}]`;
}
exports.getRegisteredModelsThreePartsName = getRegisteredModelsThreePartsName;
/**
 * Returns full name of model registration table
 * @param config config object
 */
function getRegisteredModelsTwoPartsName(table, schema) {
    const schemaName = doubleEscapeSingleBrackets(schema);
    const tableName = doubleEscapeSingleBrackets(table);
    return `[${schemaName}].[${tableName}]`;
}
exports.getRegisteredModelsTwoPartsName = getRegisteredModelsTwoPartsName;
/**
 * Write a file using a hex string
 * @param content file content
 */
function writeFileFromHex(content) {
    return __awaiter(this, void 0, void 0, function* () {
        content = content.startsWith('0x') || content.startsWith('0X') ? content.substr(2) : content;
        const tempFilePath = path.join(os.tmpdir(), `ads_ml_temp_${UUID.generateUuid()}`);
        yield fs.promises.writeFile(tempFilePath, Buffer.from(content, 'hex'));
        return tempFilePath;
    });
}
exports.writeFileFromHex = writeFileFromHex;
/**
 *
 * @param filePath Returns file name
 */
function getFileName(filePath) {
    if (filePath) {
        return filePath.replace(/^.*[\\\/]/, '');
    }
    else {
        return '';
    }
}
exports.getFileName = getFileName;
function getDefaultPythonLocation() {
    return path.join(getUserHome() || '', 'azuredatastudio-python', constants.adsPythonBundleVersion, getPythonExeName());
}
exports.getDefaultPythonLocation = getDefaultPythonLocation;
function getPythonExeName() {
    return process.platform === constants.winPlatform ? 'python.exe' : 'bin/python3';
}
exports.getPythonExeName = getPythonExeName;
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
exports.getUserHome = getUserHome;
function getKeyValueString(key, value, separator = '=') {
    return `${key}${separator}${value}`;
}
exports.getKeyValueString = getKeyValueString;
function getServerPort(connection) {
    if (!connection) {
        return '';
    }
    let index = connection.serverName.indexOf(',');
    if (index > 0) {
        return connection.serverName.substring(index + 1);
    }
    else {
        return '1433';
    }
}
exports.getServerPort = getServerPort;
function getServerName(connection) {
    if (!connection) {
        return '';
    }
    let index = connection.serverName.indexOf(',');
    if (index > 0) {
        return connection.serverName.substring(0, index);
    }
    else {
        return connection.serverName;
    }
}
exports.getServerName = getServerName;
//# sourceMappingURL=utils.js.map