"use strict";
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
exports.WizardView = void 0;
const mainViewBase_1 = require("./mainViewBase");
/**
 * Wizard view to creates wizard and pages
 */
class WizardView extends mainViewBase_1.MainViewBase {
    /**
     *
     */
    constructor(apiWrapper) {
        super(apiWrapper);
    }
    createWizardPage(title, componentView) {
        let viewPanel = this._apiWrapper.createWizardPage(title);
        this.registerContent(viewPanel, componentView);
        componentView.viewPanel = viewPanel;
        return viewPanel;
    }
    /**
     * Adds wizard page
     * @param page page
     * @param index page index
     */
    addWizardPage(page, index) {
        if (this._wizard) {
            const currentPage = this._wizard.currentPage;
            if (page && currentPage < index) {
                this.addPage(page, index);
                this._wizard.removePage(index);
                this.createWizardPage(page.title || '', page);
                this._wizard.addPage(page.viewPanel, index);
                this._wizard.setCurrentPage(currentPage);
            }
        }
    }
    /**
     * Adds wizard page
     * @param page page
     * @param index page index
     */
    removeWizardPage(page, index) {
        if (this._wizard && this._pages[index] === page) {
            this._pages = this._pages.splice(index);
            this._wizard.removePage(index);
        }
    }
    /**
     *
     * @param title Creates anew wizard
     * @param pages wizard pages
     */
    createWizard(title, pages) {
        this._wizard = this._apiWrapper.createWizard(title);
        this._pages = pages;
        this._wizard.pages = pages.map(x => this.createWizardPage(x.title || '', x));
        this._wizard.onPageChanged((info) => __awaiter(this, void 0, void 0, function* () {
            yield this.onWizardPageChanged(info);
        }));
        return this._wizard;
    }
    validate(pageInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.lastPage) !== undefined) {
                let idxLast = pageInfo.lastPage;
                let lastPage = this._pages[idxLast];
                if (lastPage && lastPage.validate) {
                    return yield lastPage.validate();
                }
            }
            return true;
        });
    }
    onWizardPageChanged(pageInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.lastPage) !== undefined) {
                let idxLast = pageInfo.lastPage;
                let lastPage = this._pages[idxLast];
                if (lastPage && lastPage.onLeave) {
                    yield lastPage.onLeave();
                }
            }
            if ((pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.newPage) !== undefined) {
                let idx = pageInfo.newPage;
                let page = this._pages[idx];
                if (page && page.onEnter) {
                    if (this._wizard && this._wizard.pages.length > idx) {
                        this._wizard.pages[idx].title = page.title;
                    }
                    yield page.onEnter();
                }
            }
        });
    }
    get wizard() {
        return this._wizard;
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.refresh.call(this);
        });
    }
}
exports.WizardView = WizardView;
//# sourceMappingURL=wizardView.js.map