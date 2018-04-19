import { IEncoder } from '../interfaces';
import { closePort } from './close-port';
import { removeEncoderInstance } from './remove-encoder-instance';

export const cancelEncoding = (encoderId: number, encoderInstancesRegistry: Map<number, [ IEncoder, MessagePort, boolean ]>): void => {
    const [ encoder, port, isRecording ] = removeEncoderInstance(encoderId, encoderInstancesRegistry);

    encoder.cancel();

    if (isRecording) {
        closePort(port);
    }
};
