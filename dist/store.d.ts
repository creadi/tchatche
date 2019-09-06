import { Message, BotMessage, OnSubmitData, OnSubmitEnd } from './types';
interface State {
    conversation: Message[];
    config: BotMessage[];
    current?: BotMessage;
    data: object;
    end?: boolean;
    pace: number;
}
interface SetDataAction {
    type: 'SET_DATA';
    payload: {
        property: string;
        value: string;
    };
}
interface SetConfigAction {
    type: 'SET_CONFIG';
    payload: {
        messages: BotMessage[];
        pace: number;
    };
}
interface SetMessageAction {
    type: 'SET_MSG';
    payload: {
        message: string;
        isBot?: boolean;
    };
}
interface SetCurrentAction {
    type: 'SET_CURRENT';
    payload: BotMessage | undefined;
}
interface SetEndAction {
    type: 'SET_END';
}
declare type Action = SetDataAction | SetMessageAction | SetCurrentAction | SetConfigAction | SetEndAction;
export declare const actionType: {
    SET_DATA: string;
    SET_MSG: string;
    SET_CURRENT: string;
    SET_CONFIG: string;
    SET_END: string;
};
export declare const store: import("redux").Store<State, Action>;
export declare const action: {
    init: (messages: BotMessage[], pace?: number) => void;
    userAnswered: (submited: OnSubmitData | OnSubmitEnd) => void;
    setData: (property: string, value: any) => {
        type: "SET_DATA";
        payload: {
            property: string;
            value: any;
        };
    };
};
export {};
