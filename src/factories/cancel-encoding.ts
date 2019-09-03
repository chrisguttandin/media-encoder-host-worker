import { TCancelEncodingFactory } from '../types';

export const createCancelEncoding: TCancelEncodingFactory = (closePort, removeEncoderInstance) => {
    return (encoderId, encoderInstancesRegistry) => {
        const [ encoderBroker, port, isRecording ] = removeEncoderInstance(encoderId, encoderInstancesRegistry);

        encoderBroker.cancel();

        if (isRecording) {
            closePort(port);
        }
    };
};
