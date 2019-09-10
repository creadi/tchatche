"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = require("lit-html");
var message_1 = __importDefault(require("./components/message"));
var userAction_1 = __importDefault(require("./components/userAction"));
var store_1 = require("./store");
var createBot = function (config) {
    var listeners = [];
    store_1.store.subscribe(function () {
        var _a = store_1.store.getState(), conversation = _a.conversation, current = _a.current, end = _a.end, data = _a.data;
        if (end) {
            listeners
                .filter(function (_a) {
                var event = _a.event;
                return event === 'end';
            })
                .forEach(function (_a) {
                var callback = _a.callback;
                return callback({ conversation: conversation, data: data });
            });
        }
        var App = lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <div id=\"tchatche-container\">\n        ", "\n        <div id=\"tchatche-user-action\">\n          ", "\n        </div>\n      </div>\n    "], ["\n      <div id=\"tchatche-container\">\n        ", "\n        <div id=\"tchatche-user-action\">\n          ", "\n        </div>\n      </div>\n    "])), message_1.default(conversation), current ? userAction_1.default(current.userAction) : null);
        lit_html_1.render(App, config.container);
    });
    store_1.action.init(config.messages, config.pace);
    return {
        on: function (event, callback) {
            listeners.push({ event: event, callback: callback });
        }
    };
};
exports.default = createBot;
var templateObject_1;
