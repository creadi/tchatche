"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = require("lit-html");
var store_1 = require("../store");
var getData = function () { return store_1.store.getState().data; };
var isButtonAction = function (action) {
    return action.inputType === 'buttons';
};
var isInputAction = function (action) {
    return action.inputType === 'input';
};
var onClick = function (button, onSubmit) { return function () {
    return onSubmit(button, getData(), store_1.action.setData)
        .then(store_1.action.userAnswered);
}; };
var button = function (onSubmit) {
    return function (button) {
        return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <button\n        class=\"user-action user-action-button\"\n        @click=", "\n        type=\"button\"\n        >", "</button>\n    "], ["\n      <button\n        class=\"user-action user-action-button\"\n        @click=", "\n        type=\"button\"\n        >", "</button>\n    "])), onClick(button, onSubmit), button.label);
    };
};
var buttons = function (_a) {
    var buttons = _a.buttons, onSubmit = _a.onSubmit;
    return buttons.map(button(onSubmit));
};
var onKeyUp = function (onSubmit) {
    return function (e) {
        if (e.key === 'Enter') {
            onSubmit(e.target.value, getData(), store_1.action.setData)
                .then(function (submited) {
                store_1.action.userAnswered(submited);
                e.target.value = '';
            });
        }
    };
};
var input = function (_a) {
    var placeholder = _a.placeholder, onSubmit = _a.onSubmit, type = _a.type;
    return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <input\n      class=\"user-action user-action-input\"\n      placeholder=", "\n      type=", "\n      @keyup=", "\n      />\n  "], ["\n    <input\n      class=\"user-action user-action-input\"\n      placeholder=", "\n      type=", "\n      @keyup=", "\n      />\n  "])), placeholder || '', type || 'text', onKeyUp(onSubmit));
};
var inputType = function (action) {
    if (isButtonAction(action)) {
        return buttons(action);
    }
    if (isInputAction(action)) {
        return input(action);
    }
    return null;
};
exports.default = (function (action) {
    return lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    <div id=\"tchatche-user-action\">\n      ", "\n    </div>\n  "], ["\n    <div id=\"tchatche-user-action\">\n      ", "\n    </div>\n  "])), inputType(action));
});
var templateObject_1, templateObject_2, templateObject_3;
