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
exports.deactivate = exports.activate = void 0;
const mainController_1 = require("./controllers/mainController");
const apiWrapper_1 = require("./common/apiWrapper");
const queryRunner_1 = require("./common/queryRunner");
const processService_1 = require("./common/processService");
let controllers = [];
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiWrapper = new apiWrapper_1.ApiWrapper();
        let queryRunner = new queryRunner_1.QueryRunner(apiWrapper);
        let processService = new processService_1.ProcessService();
        // Start the main controller
        //
        let mainController = new mainController_1.default(context, apiWrapper, queryRunner, processService);
        controllers.push(mainController);
        context.subscriptions.push(mainController);
        yield mainController.activate();
    });
}
exports.activate = activate;
function deactivate() {
    for (let controller of controllers) {
        controller.deactivate();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=main.js.map