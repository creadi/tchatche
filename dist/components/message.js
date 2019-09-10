"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = require("lit-html");
var message = function (_a) {
    var message = _a.message, isBot = _a.isBot;
    return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <div class=\"message-container ", "\">\n      <div class=\"message ", "\">\n        ", "\n      </div>\n    </div>\n  "], ["\n    <div class=\"message-container ", "\">\n      <div class=\"message ", "\">\n        ", "\n      </div>\n    </div>\n  "])), isBot ? 'bot-message-container' : 'user-message-container', isBot ? 'bot-message' : 'user-message', message);
};
exports.default = (function (messages) {
    return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <div id=\"tchatche-messages\">\n      ", "\n      <div class=\"after-messages\"></div>\n    </div>\n  "], ["\n    <div id=\"tchatche-messages\">\n      ", "\n      <div class=\"after-messages\"></div>\n    </div>\n  "])), messages.map(message));
});
var templateObject_1, templateObject_2;
