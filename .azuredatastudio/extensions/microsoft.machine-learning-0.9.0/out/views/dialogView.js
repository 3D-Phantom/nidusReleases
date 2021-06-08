"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogView = void 0;
const mainViewBase_1 = require("./mainViewBase");
/**
 * Dialog view to create and manage a dialog
 */
class DialogView extends mainViewBase_1.MainViewBase {
    /**
     * Creates new instance
     */
    constructor(apiWrapper) {
        super(apiWrapper);
    }
    createDialogPage(title, componentView) {
        let viewPanel = this._apiWrapper.createTab(title);
        this.addPage(componentView);
        this.registerContent(viewPanel, componentView);
        return viewPanel;
    }
    /**
     * Creates a new dialog
     * @param title title
     * @param pages pages
     */
    createDialog(title, pages) {
        this._dialog = this._apiWrapper.createModelViewDialog(title);
        this._dialog.content = pages.map(x => this.createDialogPage(x.title || '', x));
        return this._dialog;
    }
}
exports.DialogView = DialogView;
//# sourceMappingURL=dialogView.js.map