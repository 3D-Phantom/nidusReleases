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
exports.ModelSourcesComponent = void 0;
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
/**
 * View to pick model source
 */
class ModelSourcesComponent extends modelViewBase_1.ModelViewBase {
    constructor(apiWrapper, parent, _options = [modelViewBase_1.ModelSourceType.Local, modelViewBase_1.ModelSourceType.Azure]) {
        super(apiWrapper, parent.root, parent);
        this._options = _options;
        this._sourceType = modelViewBase_1.ModelSourceType.Local;
        this._defaultSourceType = modelViewBase_1.ModelSourceType.Local;
    }
    /**
     *
     * @param modelBuilder Register components
     */
    registerComponent(modelBuilder) {
        this._sourceType = this._options && this._options.length > 0 ? this._options[0] : this._defaultSourceType;
        this.modelSourceType = this._sourceType;
        let selectedCardId = this.convertSourceIdToString(this._sourceType);
        this._localModel = {
            descriptions: [{
                    textValue: constants.localModelSource,
                    textStyles: {
                        'font-size': '14px'
                    }
                }],
            id: this.convertSourceIdToString(modelViewBase_1.ModelSourceType.Local),
            icon: { light: this.asAbsolutePath('images/fileUpload.svg'), dark: this.asAbsolutePath('images/fileUpload.svg') }
        };
        this._amlModel = {
            descriptions: [{
                    textValue: constants.azureModelSource,
                    textStyles: {
                        'font-size': '14px'
                    }
                }],
            id: this.convertSourceIdToString(modelViewBase_1.ModelSourceType.Azure),
            icon: { light: this.asAbsolutePath('images/aml.svg'), dark: this.asAbsolutePath('images/aml.svg') }
        };
        this._registeredModels = {
            descriptions: [{
                    textValue: constants.registeredModelsSource,
                    textStyles: {
                        'font-size': '14px'
                    }
                }],
            id: this.convertSourceIdToString(modelViewBase_1.ModelSourceType.RegisteredModels),
            icon: { light: this.asAbsolutePath('images/imported.svg'), dark: this.asAbsolutePath('images/imported.svg') }
        };
        let components = [];
        this._options.forEach(option => {
            switch (option) {
                case modelViewBase_1.ModelSourceType.Local:
                    if (this._localModel) {
                        components.push(this._localModel);
                    }
                    break;
                case modelViewBase_1.ModelSourceType.Azure:
                    if (this._amlModel) {
                        components.push(this._amlModel);
                    }
                    break;
                case modelViewBase_1.ModelSourceType.RegisteredModels:
                    if (this._registeredModels) {
                        components.push(this._registeredModels);
                    }
                    break;
            }
        });
        let radioCardGroup = modelBuilder.radioCardGroup()
            .withProperties({
            cards: components,
            iconHeight: '100px',
            iconWidth: '100px',
            cardWidth: '170px',
            cardHeight: '170px',
            ariaLabel: 'test',
            selectedCardId: selectedCardId
        }).component();
        this._flexContainer = modelBuilder.flexContainer().withLayout({
            flexFlow: 'column'
        }).withItems([radioCardGroup]).component();
        this._selectedSourceLabel = modelBuilder.text().withProperties({
            value: this.getSourceTypeDescription(this._sourceType),
            CSSStyles: {
                'font-size': '13px',
                'margin': '0',
                'width': '438px'
            }
        }).component();
        this._toDispose.push(radioCardGroup.onSelectionChanged(({ cardId }) => {
            const selectedValue = this.convertSourceIdToEnum(cardId);
            if (selectedValue !== this._sourceType) {
                this._sourceType = selectedValue;
                if (this._selectedSourceLabel) {
                    this._selectedSourceLabel.value = this.getSourceTypeDescription(this._sourceType);
                }
                this.sendRequest(modelViewBase_1.SourceModelSelectedEventName, this._sourceType);
            }
        }));
        this._form = modelBuilder.formContainer().withFormItems([{
                title: '',
                component: this._flexContainer
            }, {
                title: '',
                component: this._selectedSourceLabel
            }]).component();
        return this._form;
    }
    convertSourceIdToString(sourceId) {
        return sourceId.toString();
    }
    convertSourceIdToEnum(sourceId) {
        switch (sourceId) {
            case modelViewBase_1.ModelSourceType.Local.toString():
                return modelViewBase_1.ModelSourceType.Local;
            case modelViewBase_1.ModelSourceType.Azure.toString():
                return modelViewBase_1.ModelSourceType.Azure;
            case modelViewBase_1.ModelSourceType.RegisteredModels.toString():
                return modelViewBase_1.ModelSourceType.RegisteredModels;
        }
        return this._defaultSourceType;
    }
    getSourceTypeDescription(sourceId) {
        if (this.modelActionType === modelViewBase_1.ModelActionType.Import) {
            switch (sourceId) {
                case modelViewBase_1.ModelSourceType.Local:
                    return constants.localModelSourceDescriptionForImport;
                case modelViewBase_1.ModelSourceType.Azure:
                    return constants.azureModelSourceDescriptionForImport;
            }
        }
        else if (this.modelActionType === modelViewBase_1.ModelActionType.Predict) {
            switch (sourceId) {
                case modelViewBase_1.ModelSourceType.Local:
                    return constants.localModelSourceDescriptionForPredict;
                case modelViewBase_1.ModelSourceType.Azure:
                    return constants.azureModelSourceDescriptionForPredict;
                case modelViewBase_1.ModelSourceType.RegisteredModels:
                    return constants.importedModelSourceDescriptionForPredict;
            }
        }
        return '';
    }
    addComponents(formBuilder) {
        if (this._flexContainer && this._selectedSourceLabel) {
            formBuilder.addFormItem({ title: '', component: this._flexContainer });
            formBuilder.addFormItem({ title: '', component: this._selectedSourceLabel });
        }
    }
    removeComponents(formBuilder) {
        if (this._flexContainer && this._selectedSourceLabel) {
            formBuilder.removeFormItem({ title: '', component: this._flexContainer });
            formBuilder.removeFormItem({ title: '', component: this._selectedSourceLabel });
        }
    }
    /**
     * Returns selected data
     */
    get data() {
        return this._sourceType;
    }
    /**
     * Returns the component
     */
    get component() {
        return this._form;
    }
    /**
     * Refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ModelSourcesComponent = ModelSourcesComponent;
//# sourceMappingURL=modelSourcesComponent.js.map