import client from './grpc/client';
require('dotenv').config();
import {ProtoMessage} from '../types/interfaces';
import Bots from './slaveBot/slaveBot';
import {logger} from './utils/logger';

export default class Net {
    bots;

    constructor(tokens: Array<string>, chatIDs: Array<number>) {
        this.bots = new Bots(tokens, chatIDs, this.sendMessageToClient);
        this.bots.launchBots();
    }

    sendMessageFromClient(message: ProtoMessage) {
        const sendMessageTo = this.bots.context.get(message.chatID);
        if (sendMessageTo) {
            this.bots.sendMessage(sendMessageTo, message.text);
        } else {
            logger.error(`sendMessageFromClient error, no such chat id = ${message.chatID}`);
        }
    }

    sendMessageToClient(message: ProtoMessage) {
        if (message.chatID !== undefined) {
            logger.debug(`sendMessageToClient: chatID: ${message.chatID}, text = ${message.text}`);
            client.recieve(message, function(creationFailed: string, productCreated: unknown) {
                console.log('On Success:', productCreated);
                console.log('On Failure:', creationFailed);
            });
        } else {
            logger.error(`sendMessageToClient error, no such chat id = ${message.chatID}`);
        }
    }
}
