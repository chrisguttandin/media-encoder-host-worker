import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { closePort } from './close-port';
import { removeEncoderInstance } from './remove-encoder-instance';

export const finishEncoding = (
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>
): Promise<ArrayBuffer[]> => {
    const [ encoderBroker, port, isRecording ] = removeEncoderInstance(encoderId, encoderInstancesRegistry);

    if (!isRecording) {
        return Promise.resolve(encoderBroker.encode(encoderId));
    }

    return new Promise<ArrayBuffer[]>((resolve) => {
        port.onmessage = ({ data }) => {
            if (data.channelData === null) {
                closePort(port);

                resolve(encoderBroker.encode(encoderId));
            } else {
                encoderBroker.record(encoderId, data.channelData);
            }
        };
    });
};
