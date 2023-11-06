import { logger } from '../utils/logger';
import { clientInstance, netSlaveBotInstance } from '../index';

class GRPCstream {
    #stream: any;

    get self() {
        return this.#stream;
    }

    connect() {
        this.#stream = clientInstance.startChatTG(
            (error: string, newsStatus: { success: string }) => {
                if (error) {
                    console.error(error);
                }
                console.log('Stream success: ', newsStatus.success);
                clientInstance.close();
            },
        );
        this.#stream.on('data', (response: { array: Array<string> }) => {
            console.log('Message from backend: ', {
                text: response.array[0],
                chatID: response.array[1],
            });
            netSlaveBotInstance.sendMessageFromClient({
                text: response.array[0],
                chatid: Number(response.array[1]),
                fileLink: '',
                mimetype: '',
            });
        });
        this.#stream.on('end', () => {
            logger.info('End grpc stream');
            setTimeout(() => this.connect(), 1000);
        });
        this.#stream.on('error', (error: string) => {
            logger.error('Error catch, stream:  ', error);
        });
    }
}

export default GRPCstream;
