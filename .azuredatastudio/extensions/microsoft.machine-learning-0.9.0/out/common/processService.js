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
exports.ProcessService = void 0;
const childProcess = require("child_process");
const ExecScriptsTimeoutInSeconds = 1800000;
class ProcessService {
    constructor() {
        this.timeout = ExecScriptsTimeoutInSeconds;
    }
    execScripts(exeFilePath, scripts, args, outputChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const scriptExecution = childProcess.spawn(exeFilePath, args);
                let timer;
                let output = '';
                // Add listeners to print stdout and stderr if an output channel was provided
                scriptExecution.stdout.on('data', data => {
                    if (outputChannel) {
                        this.outputDataChunk(data, outputChannel, '    stdout: ');
                    }
                    output = output + data.toString();
                });
                scriptExecution.stderr.on('data', data => {
                    if (outputChannel) {
                        this.outputDataChunk(data, outputChannel, '    stderr: ');
                    }
                    output = output + data.toString();
                });
                scriptExecution.on('exit', (code) => {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    if (code === 0) {
                        resolve(output);
                    }
                    else {
                        reject(`Process exited with code: ${code}. output: ${output}`);
                    }
                });
                timer = setTimeout(() => {
                    try {
                        scriptExecution.kill();
                    }
                    catch (error) {
                        console.log(error);
                    }
                }, this.timeout);
                scripts.forEach(script => {
                    scriptExecution.stdin.write(`${script}\n`);
                });
                scriptExecution.stdin.end();
            });
        });
    }
    executeBufferedCommand(cmd, outputChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (outputChannel) {
                    outputChannel.appendLine(`    > ${cmd}`);
                }
                let child = childProcess.exec(cmd, {
                    timeout: this.timeout
                }, (err, stdout) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(stdout);
                    }
                });
                // Add listeners to print stdout and stderr if an output channel was provided
                if (outputChannel) {
                    child.stdout.on('data', data => { this.outputDataChunk(data, outputChannel, '    stdout: '); });
                    child.stderr.on('data', data => { this.outputDataChunk(data, outputChannel, '    stderr: '); });
                }
            });
        });
    }
    outputDataChunk(data, outputChannel, header) {
        data.toString().split(/\r?\n/)
            .forEach(line => {
            outputChannel.appendLine(header + line);
        });
    }
}
exports.ProcessService = ProcessService;
//# sourceMappingURL=processService.js.map