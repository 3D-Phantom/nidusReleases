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
exports.LanguagesTable = void 0;
const azdata = require("azdata");
const constants = require("../../common/constants");
const languageViewBase_1 = require("./languageViewBase");
class LanguagesTable extends languageViewBase_1.LanguageViewBase {
    /**
     *
     */
    constructor(apiWrapper, _modelBuilder, parent) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
        this._table = _modelBuilder.declarativeTable()
            .withProperties({
            columns: [
                {
                    displayName: constants.extLangLanguageName,
                    ariaLabel: constants.extLangLanguageName,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 100,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.extLangLanguagePlatform,
                    ariaLabel: constants.extLangLanguagePlatform,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 150,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: constants.extLangLanguageCreatedDate,
                    ariaLabel: constants.extLangLanguageCreatedDate,
                    valueType: azdata.DeclarativeDataType.string,
                    isReadOnly: true,
                    width: 150,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: '',
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                },
                {
                    displayName: '',
                    valueType: azdata.DeclarativeDataType.component,
                    isReadOnly: true,
                    width: 50,
                    headerCssStyles: Object.assign({}, constants.cssStyles.tableHeader),
                    rowCssStyles: Object.assign({}, constants.cssStyles.tableRow),
                }
            ],
            data: [],
            ariaLabel: constants.mlsConfigTitle
        })
            .component();
    }
    get table() {
        return this._table;
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            let languages;
            languages = yield this.listLanguages();
            let tableData = [];
            if (languages) {
                languages.forEach(language => {
                    if (!language.contents || language.contents.length === 0) {
                        language.contents.push(this.createNewContent());
                    }
                    tableData = tableData.concat(language.contents.map(content => this.createTableRow(language, content)));
                });
            }
            this._table.dataValues = tableData;
        });
    }
    createTableRow(language, content) {
        if (this._modelBuilder) {
            let dropLanguageButton = this._modelBuilder.button().withProperties({
                label: '',
                title: constants.deleteTitle,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/delete_inverse.svg'),
                    light: this.asAbsolutePath('images/light/delete.svg')
                },
                width: 15,
                height: 15
            }).component();
            dropLanguageButton.onDidClick(() => __awaiter(this, void 0, void 0, function* () {
                yield this.deleteLanguage({
                    language: language,
                    content: content,
                    newLang: false
                });
            }));
            let editLanguageButton = this._modelBuilder.button().withProperties({
                label: '',
                title: constants.editTitle,
                iconPath: {
                    dark: this.asAbsolutePath('images/dark/edit_inverse.svg'),
                    light: this.asAbsolutePath('images/light/edit.svg')
                },
                width: 15,
                height: 15
            }).component();
            editLanguageButton.onDidClick(() => {
                this.onEditLanguage({
                    language: language,
                    content: content,
                    newLang: false
                });
            });
            return [{ value: language.name }, { value: content.platform || '' }, { value: language.createdDate || '' }, { value: dropLanguageButton }, { value: editLanguageButton }];
        }
        return [];
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadData();
        });
    }
}
exports.LanguagesTable = LanguagesTable;
//# sourceMappingURL=languagesTable.js.map