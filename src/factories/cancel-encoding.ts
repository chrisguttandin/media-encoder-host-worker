import { TCancelEncodingFactory } from '../types';

export const createCancelEncoding: TCancelEncodingFactory = (closePort, removeEncoderInstance) => {
    return (encoderId) => {
        const [ encoderBroker, port, isRecording ] = removeEncoderInstance(encoderId);

        encoderBroker.cancel();

        if (isRecording) {
            closePort(port);
        }
    };
};
