"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var defaultState = {
    conversation: [],
    config: [],
    data: {},
    pace: 500,
};
var isSetConfigAction = function (action) {
    return action.type === exports.actionType.SET_CONFIG;
};
var isSetDataAction = function (action) {
    return action.type === exports.actionType.SET_DATA;
};
var isSetMessageAction = function (action) {
    return action.type === exports.actionType.SET_MSG;
};
var isSetCurrentAction = function (action) {
    return action.type === exports.actionType.SET_CURRENT;
};
var isSetEndAction = function (action) {
    return action.type === exports.actionType.SET_END;
};
exports.actionType = {
    SET_DATA: 'SET_DATA',
    SET_MSG: 'SET_MSG',
    SET_CURRENT: 'SET_CURRENT',
    SET_CONFIG: 'SET_CONFIG',
    SET_END: 'SET_END',
};
var reducer = function (state, action) {
    var _a;
    if (state === void 0) { state = defaultState; }
    if (isSetConfigAction(action)) {
        return __assign(__assign({}, state), { config: action.payload.messages, pace: action.payload.pace });
    }
    if (isSetDataAction(action)) {
        return __assign(__assign({}, state), { data: __assign(__assign({}, state.data), (_a = {}, _a[action.payload.property] = action.payload.value, _a)) });
    }
    if (isSetMessageAction(action)) {
        return __assign(__assign({}, state), { conversation: __spreadArrays(state.conversation, [action.payload]) });
    }
    if (isSetCurrentAction(action)) {
        return __assign(__assign({}, state), { current: action.payload });
    }
    if (isSetEndAction(action)) {
        return __assign(__assign({}, state), { end: true });
    }
    return state;
};
exports.store = redux_1.createStore(reducer);
var runIn = function (time) { return function (func) {
    return setTimeout(function () { return func(); }, time);
}; };
var addMessage = function (msg) {
    exports.store.dispatch({ type: 'SET_MSG', payload: msg });
    runIn(100)(function () {
        var end = document.querySelector('#tchatche-messages > div.after-messages');
        if (end) {
            end.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    });
};
var focusInput = function () {
    // @ts-ignore
    var input = document.querySelector('#tchatche-user-action > input');
    if (input) {
        runIn(100)(function () { return input.focus(); });
    }
};
var isEnd = function (submited) {
    return Object.keys(submited).includes('isEnd');
};
var runMessage = function (msg, pace, data) {
    var says = msg.botSays(data);
    says.map(function (message, i) { return runIn(pace * (i + 1))(function () { return addMessage({ message: message, isBot: true }); }); });
    runIn((says.length) * pace)(function () {
        exports.store.dispatch({ type: 'SET_CURRENT', payload: msg });
        focusInput();
    });
};
exports.action = {
    init: function (messages, pace) {
        if (pace === void 0) { pace = 500; }
        exports.store.dispatch({ type: 'SET_CONFIG', payload: { messages: messages, pace: pace } });
        var first = messages[0];
        if (first) {
            runMessage(first, pace, exports.store.getState().data);
        }
    },
    userAnswered: function (submited) {
        var data = submited.data;
        exports.store.dispatch({ type: 'SET_CURRENT', payload: undefined });
        if (data) {
            exports.store.dispatch({ type: 'SET_DATA', payload: data });
            addMessage({ message: data.label || data.value });
        }
        if (isEnd(submited)) {
            exports.store.dispatch({ type: 'SET_END' });
        }
        else {
            var _a = exports.store.getState(), config = _a.config, data_1 = _a.data;
            var next = config.find(function (_a) {
                var id = _a.id;
                return id === submited.nextMessageId;
            });
            if (next) {
                var pace = exports.store.getState().pace;
                runMessage(next, pace, data_1);
            }
        }
    },
    setData: function (property, value) {
        return exports.store.dispatch({ type: 'SET_DATA', payload: { property: property, value: value } });
    },
};
