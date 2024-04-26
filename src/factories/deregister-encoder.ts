import type { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';

export const createDeregisterEncoder =
    (encoderBrokerRegistry: Map<string, [RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition]>, encoderIds: Map<number, string>) =>
    (encoderId: number) => {
        const regexAsString = encoderIds.get(encoderId);

        if (regexAsString === undefined) {
            throw new Error('There was no encoder stored with the given id.');
        }

        encoderBrokerRegistry.delete(regexAsString);
        encoderIds.delete(encoderId);
    };
