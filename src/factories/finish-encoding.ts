import { TFinishEncodingFactory } from '../types';

export const createFinishEncoding: TFinishEncodingFactory = (closePort, removeEncoderInstance) => {
    return (encoderId, encoderInstancesRegistry) => {
        const [ encoderBroker, port, isRecording ] = removeEncoderInstance(encoderId, encoderInstancesRegistry);

        if (!isRecording) {
            return Promise.resolve(encoderBroker.encode(encoderId, null));
        }

        return new Promise<ArrayBuffer[]>((resolve) => {
            port.onmessage = ({ data }) => {
                if (data.length === 0) {
                    closePort(port);

                    resolve(encoderBroker.encode(encoderId, null));
                } else {
                    encoderBroker.record(encoderId, data);
                }
            };
        });
    };
};
