import { IExtendableMediaRecorderWavEncoderBrokerDefinition, wrap } from 'extendable-media-recorder-wav-encoder-broker';

export const registerEncoder = async (
    encoderBrokerRegistry: Map<string, [RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition]>,
    port: MessagePort
) => {
    const encoderBroker = wrap(port);
    const regex = await encoderBroker.characterize();
    const regexAsString = regex.toString();

    if (encoderBrokerRegistry.has(regexAsString)) {
        throw new Error('There is already an encoder stored which handles exactly the same mime types.');
    }

    encoderBrokerRegistry.set(regexAsString, [regex, encoderBroker]);

    return regex;
};
