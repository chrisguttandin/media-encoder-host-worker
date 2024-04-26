import type {
    IExtendableMediaRecorderWavEncoderBrokerDefinition,
    wrap as wrapFunction
} from 'extendable-media-recorder-wav-encoder-broker';

export const createRegisterEncoder =
    (
        encoderBrokerRegistry: Map<string, [RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition]>,
        encoderIds: Map<number, string>,
        wrap: typeof wrapFunction
    ) =>
    async (encoderId: number, port: MessagePort) => {
        const encoderBroker = wrap(port);
        const regex = await encoderBroker.characterize();
        const regexAsString = regex.toString();

        if (encoderBrokerRegistry.has(regexAsString)) {
            throw new Error('There is already an encoder stored which handles exactly the same mime types.');
        }

        if (encoderIds.has(encoderId)) {
            throw new Error(`There is already an encoder registered with an id called "${encoderId}".`);
        }

        encoderBrokerRegistry.set(regexAsString, [regex, encoderBroker]);
        encoderIds.set(encoderId, regexAsString);

        return regex;
    };
