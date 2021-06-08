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
exports.MainViewBase = void 0;
/**
 * Base class for dialog and wizard
 */
class MainViewBase {
    /**
     *
     */
    constructor(_apiWrapper) {
        this._apiWrapper = _apiWrapper;
        this._pages = [];
    }
    registerContent(viewPanel, componentView) {
        viewPanel.registerContent((view) => __awaiter(this, void 0, void 0, function* () {
            if (componentView) {
                let component = componentView.registerComponent(view.modelBuilder);
                yield view.initializeModel(component);
                yield componentView.refresh();
            }
        }));
    }
    addPage(page, index) {
        if (index) {
            this._pages[index] = page;
        }
        else {
            this._pages.push(page);
        }
    }
    disposePages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._pages) {
                yield Promise.all(this._pages.map((p) => __awaiter(this, void 0, void 0, function* () {
                    if (p.disposePage) {
                        yield p.disposePage();
                    }
                })));
            }
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._pages) {
                yield Promise.all(this._pages.map((p) => __awaiter(this, void 0, void 0, function* () { return yield p.refresh(); })));
            }
        });
    }
}
exports.MainViewBase = MainViewBase;
//# sourceMappingURL=mainViewBase.js.map