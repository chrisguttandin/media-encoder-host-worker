import { IEncoder, IEncoderConstructor } from '../interfaces';
import { closePort } from './close-port';

const instantiateCapableEncoder = (encoderConstructorRegistry: Map<string, [ RegExp, IEncoderConstructor ]>, mimeType: string) => {
    for (const [ regex, encoderConstructor ] of Array.from(encoderConstructorRegistry.values())) {
        if (regex.test(mimeType)) {
            return new encoderConstructor(mimeType);
        }
    }

    throw new Error('There is no encoder registered which could handle the given mimeType.');
};

export const instantiateEncoder = (
    encoderConstructorRegistry: Map<string, [ RegExp, IEncoderConstructor ]>,
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IEncoder, MessagePort, boolean ]>,
    mimeType: string
): MessagePort => {
    if (encoderInstancesRegistry.has(encoderId)) {
        throw new Error(`There is already an encoder registered with an id called "${ encoderId }".`);
    }

    const encoder = instantiateCapableEncoder(encoderConstructorRegistry, mimeType);
    const { port1, port2 } = new MessageChannel();
    const entry: [ IEncoder, MessagePort, boolean ] = [ encoder, port1, true ];

    encoderInstancesRegistry.set(encoderId, entry);

    port1.onmessage = ({ data }) => {
        if (data.channelData === null) {
            closePort(port1);

            entry[2] = false;
        } else {
            encoder.record(data.channelData);
        }
    };

    return port2;
};
