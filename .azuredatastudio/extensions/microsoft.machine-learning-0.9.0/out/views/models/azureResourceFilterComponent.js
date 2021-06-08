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
exports.AzureResourceFilterComponent = void 0;
const vscode = require("vscode");
const modelViewBase_1 = require("./modelViewBase");
const constants = require("../../common/constants");
/**
 * View to render filters to pick an azure resource
 */
const componentWidth = 300;
class AzureResourceFilterComponent extends modelViewBase_1.ModelViewBase {
    /**
     * Creates a new view
     */
    constructor(apiWrapper, _modelBuilder, parent) {
        super(apiWrapper, parent.root, parent);
        this._modelBuilder = _modelBuilder;
        this._azureAccounts = [];
        this._azureSubscriptions = [];
        this._azureGroups = [];
        this._azureWorkspaces = [];
        this._onWorkspacesSelectedChanged = new vscode.EventEmitter();
        this.onWorkspacesSelectedChanged = this._onWorkspacesSelectedChanged.event;
        this._accounts = this._modelBuilder.dropDown().withProperties({
            width: componentWidth
        }).component();
        this._subscriptions = this._modelBuilder.dropDown().withProperties({
            width: componentWidth
        }).component();
        this._groups = this._modelBuilder.dropDown().withProperties({
            width: componentWidth
        }).component();
        this._workspaces = this._modelBuilder.dropDown().withProperties({
            width: componentWidth
        }).component();
        this._accounts.onValueChanged((newValue) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (newValue.selected !== ((_a = this._accounts.value) === null || _a === void 0 ? void 0 : _a.name)) {
                yield this.onAccountSelected();
            }
        }));
        this._subscriptions.onValueChanged((newValue) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            if (newValue.selected !== ((_b = this._subscriptions.value) === null || _b === void 0 ? void 0 : _b.name)) {
                yield this.onSubscriptionSelected();
            }
        }));
        this._groups.onValueChanged((newValue) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            if (newValue.selected !== ((_c = this._groups.value) === null || _c === void 0 ? void 0 : _c.name)) {
                yield this.onGroupSelected();
            }
        }));
        this._workspaces.onValueChanged((newValue) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            if (newValue.selected !== ((_d = this._workspaces.value) === null || _d === void 0 ? void 0 : _d.name)) {
                yield this.onWorkspaceSelectedChanged();
            }
        }));
        this._form = this._modelBuilder.formContainer().withFormItems([{
                title: constants.azureAccount,
                component: this._accounts
            }, {
                title: constants.azureSubscription,
                component: this._subscriptions
            }, {
                title: constants.azureGroup,
                component: this._groups
            }, {
                title: constants.azureModelWorkspace,
                component: this._workspaces
            }], {
            titleFontSize: '13px',
            horizontal: true,
        }).component();
        this._form.setLayout({
            padding: '0'
        });
    }
    addComponents(formBuilder) {
        if (this._form) {
            formBuilder.addFormItems([{
                    title: '',
                    component: this._form
                }]);
        }
    }
    removeComponents(formBuilder) {
        if (this._form) {
            formBuilder.removeFormItem({
                title: '',
                component: this._form
            });
        }
    }
    /**
     * Returns the created component
     */
    get component() {
        return this._form;
    }
    /**
     * Returns selected data
     */
    get data() {
        return {
            account: this.account,
            subscription: this.subscription,
            group: this.group,
            workspace: this.workspace
        };
    }
    /**
     * loads data in the components
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            this._azureAccounts = yield this.listAzureAccounts();
            if (this._azureAccounts && this._azureAccounts.length > 0) {
                let values = this._azureAccounts.map(a => { return { displayName: a.displayInfo.displayName, name: a.key.accountId }; });
                this._accounts.values = values;
                this._accounts.value = values[0];
            }
            else {
                this._accounts.values = [];
                this._accounts.value = undefined;
            }
            yield this.onAccountSelected();
        });
    }
    get accountIsValid() {
        return this._azureAccounts !== undefined && this._azureAccounts.length > 0 && this._azureSubscriptions !== undefined && this._azureSubscriptions.length > 0;
    }
    /**
     * refreshes the view
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadData();
        });
    }
    onAccountSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            this._azureSubscriptions = yield this.listAzureSubscriptions(this.account);
            if (this._azureSubscriptions && this._azureSubscriptions.length > 0) {
                let values = this._azureSubscriptions.map(s => { return { displayName: s.name, name: s.id }; });
                this._subscriptions.values = values;
                this._subscriptions.value = values[0];
            }
            else {
                this._subscriptions.values = [];
                this._subscriptions.value = undefined;
            }
            yield this.onSubscriptionSelected();
        });
    }
    onSubscriptionSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            this._azureGroups = yield this.listAzureGroups(this.account, this.subscription);
            if (this._azureGroups && this._azureGroups.length > 0) {
                let values = this._azureGroups.map(s => { return { displayName: s.name, name: s.id }; });
                this._groups.values = values;
                this._groups.value = values[0];
            }
            else {
                this._groups.values = [];
                this._groups.value = undefined;
            }
            yield this.onGroupSelected();
        });
    }
    onGroupSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWorkspace = this._workspaces.value;
            this._azureWorkspaces = yield this.listWorkspaces(this.account, this.subscription, this.group);
            if (this._azureWorkspaces && this._azureWorkspaces.length > 0) {
                let values = this._azureWorkspaces.map(s => { return { displayName: s.name || '', name: s.id || '' }; });
                this._workspaces.values = values;
                this._workspaces.value = values[0];
            }
            else {
                this._workspaces.values = [];
                this._workspaces.value = undefined;
            }
            if (currentWorkspace !== this._workspaces.value) {
                this.onWorkspaceSelectedChanged();
            }
        });
    }
    onWorkspaceSelectedChanged() {
        this._onWorkspacesSelectedChanged.fire();
    }
    get workspace() {
        return this._azureWorkspaces && this._workspaces.value ? this._azureWorkspaces.find(a => a.id === this._workspaces.value.name) : undefined;
    }
    get account() {
        return this._azureAccounts && this._accounts.value ? this._azureAccounts.find(a => a.key.accountId === this._accounts.value.name) : undefined;
    }
    get group() {
        return this._azureGroups && this._groups.value ? this._azureGroups.find(a => a.id === this._groups.value.name) : undefined;
    }
    get subscription() {
        return this._azureSubscriptions && this._subscriptions.value ? this._azureSubscriptions.find(a => a.id === this._subscriptions.value.name) : undefined;
    }
}
exports.AzureResourceFilterComponent = AzureResourceFilterComponent;
//# sourceMappingURL=azureResourceFilterComponent.js.map