import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { closePort } from './close-port';

const pickCapableEncoderBroker = (
    encoderBrokerRegistry: Map<string, [ RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition ]>,
    mimeType: string
) => {
    for (const [ regex, encoderBroker ] of Array.from(encoderBrokerRegistry.values())) {
        if (regex.test(mimeType)) {
            return encoderBroker;
        }
    }

    throw new Error('There is no encoder registered which could handle the given mimeType.');
};

export const instantiateEncoder = (
    encoderBrokerRegistry: Map<string, [ RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition ]>,
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>,
    mimeType: string
): MessagePort => {
    if (encoderInstancesRegistry.has(encoderId)) {
        throw new Error(`There is already an encoder registered with an id called "${ encoderId }".`);
    }

    const encoderBroker = pickCapableEncoderBroker(encoderBrokerRegistry, mimeType);
    const { port1, port2 } = new MessageChannel();
    const entry: [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ] = [ encoderBroker, port1, true ];

    encoderInstancesRegistry.set(encoderId, entry);

    port1.onmessage = ({ data }) => {
        if (data.channelData === null) {
            closePort(port1);

            entry[2] = false;
        } else {
            encoderBroker.record(encoderId, data.channelData);
        }
    };

    return port2;
};
