import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TInstantiateEncoderFactory } from '../types';

export const createInstantiateEncoder: TInstantiateEncoderFactory = (closePort, encoderInstancesRegistry, pickCapableEncoderBroker) => {
    return (encoderId, mimeType): MessagePort => {
        if (encoderInstancesRegistry.has(encoderId)) {
            throw new Error(`There is already an encoder registered with an id called "${ encoderId }".`);
        }

        const encoderBroker = pickCapableEncoderBroker(mimeType);
        const { port1, port2 } = new MessageChannel();
        const entry: [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ] = [ encoderBroker, port1, true ];

        encoderInstancesRegistry.set(encoderId, entry);

        port1.onmessage = ({ data }) => {
            if (data.length === 0) {
                closePort(port1);

                entry[2] = false;
            } else {
                encoderBroker.record(encoderId, data);
            }
        };

        return port2;
    };
};
