import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { closePort } from './close-port';
import { removeEncoderInstance } from './remove-encoder-instance';

export const cancelEncoding = (
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>
): void => {
    const [ encoderBroker, port, isRecording ] = removeEncoderInstance(encoderId, encoderInstancesRegistry);

    encoderBroker.cancel();

    if (isRecording) {
        closePort(port);
    }
};
