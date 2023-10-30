import getConnect from './client';
import net from './server';

const getStream = () => {
    const client = getConnect();

    // @ts-ignores
    const stream = client.startChatTG(function(error, newsStatus) {
        if (error) {
            console.error(error);
        }
        console.log('Stream success: ', newsStatus.success);
        client.close();
    });
    // @ts-ignores
    stream.on('data', function(response) {
        // console.log(response);
        console.log({text: response.array[0], chatID: response.array[1]});
        net.sendMessageFromClient({text: response.array[0], chatID: response.array[1]});
    });
    stream.on('end', function() {
        console.log('End grpc stream');
    });

    return stream;
};


export default getStream;
