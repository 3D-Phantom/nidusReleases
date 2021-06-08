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
exports.LanguageContentView = void 0;
const languageViewBase_1 = require("./languageViewBase");
const constants = require("../../common/constants");
class LanguageContentView extends languageViewBase_1.LanguageViewBase {
    /**
     *
     */
    constructor(apiWrapper, parent, _modelBuilder, _formBuilder, _languageContent) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
        this._formBuilder = _formBuilder;
        this._languageContent = _languageContent;
        this._isLocalPath = true;
        this._localPath = this._modelBuilder.radioButton()
            .withProperties({
            value: 'local',
            name: 'extensionLocation',
            label: constants.extLangLocal,
            checked: true
        }).component();
        this._serverPath = this._modelBuilder.radioButton()
            .withProperties({
            value: 'server',
            name: 'extensionLocation',
            label: this.getServerTitle(),
        }).component();
        this._localPath.onDidClick(() => {
            this._isLocalPath = true;
        });
        this._serverPath.onDidClick(() => {
            this._isLocalPath = false;
        });
        let flexRadioButtonsModel = this._modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row',
            justifyContent: 'space-between'
            //width: parent.componentMaxLength
        }).withItems([
            this._localPath, this._serverPath
        ]).component();
        this.extensionFile = this._modelBuilder.inputBox().withProperties({
            value: '',
            width: parent.componentMaxLength - parent.browseButtonMaxLength - parent.spaceBetweenComponentsLength
        }).component();
        let fileBrowser = this._modelBuilder.button().withProps({
            label: '...',
            width: parent.browseButtonMaxLength,
            CSSStyles: {
                'text-align': 'end'
            },
            secondary: true
        }).component();
        let flexFilePathModel = this._modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row',
            justifyContent: 'space-between'
        }).withItems([
            this.extensionFile, fileBrowser
        ]).component();
        this.filePathSelected(args => {
            this.extensionFile.value = args.filePath;
        });
        fileBrowser.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
            this.onOpenFileBrowser({ filePath: '', target: this._isLocalPath ? constants.localhost : this.connectionUrl });
        }));
        this.extensionFileName = this._modelBuilder.inputBox().withProperties({
            value: '',
            width: parent.componentMaxLength
        }).component();
        this.envVariables = this._modelBuilder.inputBox().withProperties({
            value: '',
            width: parent.componentMaxLength
        }).component();
        this.parameters = this._modelBuilder.inputBox().withProperties({
            value: '',
            width: parent.componentMaxLength
        }).component();
        this.load();
        this._formBuilder.addFormItems([{
                component: flexRadioButtonsModel,
                title: constants.extLangExtensionFileLocation
            }, {
                component: flexFilePathModel,
                title: constants.extLangExtensionFilePath,
                required: true
            }, {
                component: this.extensionFileName,
                title: constants.extLangExtensionFileName,
                required: true
            }, {
                component: this.envVariables,
                title: constants.extLangEnvVariables
            }, {
                component: this.parameters,
                title: constants.extLangParameters
            }]);
    }
    load() {
        if (this._languageContent) {
            this._isLocalPath = this._languageContent.isLocalFile;
            this._localPath.checked = this._isLocalPath;
            this._serverPath.checked = !this._isLocalPath;
            this.extensionFile.value = this._languageContent.pathToExtension;
            this.extensionFileName.value = this._languageContent.extensionFileName;
            this.envVariables.value = this._languageContent.environmentVariables;
            this.parameters.value = this._languageContent.parameters;
        }
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isLocalPath = true;
            this._localPath.checked = this._isLocalPath;
            this._serverPath.checked = !this._isLocalPath;
            this.load();
        });
    }
    get updatedContent() {
        var _a;
        return {
            pathToExtension: this.extensionFile.value || '',
            extensionFileName: this.extensionFileName.value || '',
            parameters: this.parameters.value || '',
            environmentVariables: this.envVariables.value || '',
            isLocalFile: this._isLocalPath || false,
            platform: (_a = this._languageContent) === null || _a === void 0 ? void 0 : _a.platform
        };
    }
}
exports.LanguageContentView = LanguageContentView;
//# sourceMappingURL=languageContentView.js.map