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
exports.HttpClient = void 0;
const fs = require("fs");
const request = require("request");
const constants = require("./constants");
const DownloadTimeout = 20000;
const GetTimeout = 10000;
class HttpClient {
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request.get(url, { timeout: GetTimeout }, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }
                    if (response.statusCode === 404) {
                        return reject(constants.resourceNotFoundError);
                    }
                    if (response.statusCode !== 200) {
                        return reject(constants.httpGetRequestError(response.statusCode, response.statusMessage));
                    }
                    resolve(body);
                });
            });
        });
    }
    download(downloadUrl, targetPath, outputChannel) {
        return new Promise((resolve, reject) => {
            let totalMegaBytes = undefined;
            let receivedBytes = 0;
            let printThreshold = 0.1;
            let downloadRequest = request.get(downloadUrl, { timeout: DownloadTimeout })
                .on('error', downloadError => {
                outputChannel.appendLine(constants.downloadError);
                reject(downloadError);
            })
                .on('response', (response) => {
                if (response.statusCode !== 200) {
                    outputChannel.appendLine(constants.downloadError);
                    return reject(response.statusMessage);
                }
                let contentLength = response.headers['content-length'];
                let totalBytes = parseInt(contentLength || '0');
                totalMegaBytes = totalBytes / (1024 * 1024);
                outputChannel.appendLine(`'Downloading' (0 / ${totalMegaBytes.toFixed(2)} MB)`);
            })
                .on('data', (data) => {
                receivedBytes += data.length;
                if (totalMegaBytes) {
                    let receivedMegaBytes = receivedBytes / (1024 * 1024);
                    let percentage = receivedMegaBytes / totalMegaBytes;
                    if (percentage >= printThreshold) {
                        outputChannel.appendLine(`${constants.downloadingProgress} (${receivedMegaBytes.toFixed(2)} / ${totalMegaBytes.toFixed(2)} MB)`);
                        printThreshold += 0.1;
                    }
                }
            });
            downloadRequest.pipe(fs.createWriteStream(targetPath))
                .on('close', () => __awaiter(this, void 0, void 0, function* () {
                resolve();
            }))
                .on('error', (downloadError) => {
                reject(downloadError);
                downloadRequest.abort();
            });
        });
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=httpClient.js.map