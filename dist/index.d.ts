import { BotConfig, Message as Msg } from './types';
declare const createBot: (config: BotConfig) => {
    on: (event: "end", callback: (d: {
        conversation: Msg[];
        data: object;
    }) => void) => void;
};
export default createBot;
