import { IEncoder } from '../interfaces';
import { closePort } from './close-port';
import { removeEncoderInstance } from './remove-encoder-instance';

export const finishEncoding = (
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IEncoder, MessagePort, boolean ]>
): Promise<ArrayBuffer[]> => {
    const [ encoder, port, isRecording ] = removeEncoderInstance(encoderId, encoderInstancesRegistry);

    if (!isRecording) {
        return Promise.resolve(encoder.encode());
    }

    return new Promise<ArrayBuffer[]>((resolve) => {
        port.onmessage = ({ data }) => {
            if (data.channelData === null) {
                closePort(port);

                resolve(encoder.encode());
            } else {
                encoder.record(data.channelData);
            }
        };
    });
};
