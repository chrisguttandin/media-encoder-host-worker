import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';

export const removeEncoderInstance = (
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>
): [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ] => {
    const entry = encoderInstancesRegistry.get(encoderId);

    if (entry === undefined) {
        throw new Error('There was no instance of an encoder stored with the given id.');
    }

    encoderInstancesRegistry.delete(encoderId);

    return entry;
};
