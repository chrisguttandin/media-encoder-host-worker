import type { TTypedArray } from 'worker-factory';
import type { closePort as closePortFunction } from '../functions/close-port';
import type { TEncoderInstancesRegistryEntry } from '../types';
import type { createPickCapableEncoderBroker } from './pick-capable-encoder-broker';

export const createInstantiateEncoder = (
    closePort: typeof closePortFunction,
    encoderInstancesRegistry: Map<number, TEncoderInstancesRegistryEntry>,
    pickCapableEncoderBroker: ReturnType<typeof createPickCapableEncoderBroker>
) => {
    return (encoderInstanceId: number, mimeType: string, sampleRate: number) => {
        if (encoderInstancesRegistry.has(encoderInstanceId)) {
            throw new Error(`There is already an encoder instance registered with an id called "${encoderInstanceId}".`);
        }

        const encoderBroker = pickCapableEncoderBroker(mimeType);
        const { port1, port2 } = new MessageChannel();
        const entry: TEncoderInstancesRegistryEntry = [encoderBroker, port1, true, sampleRate];

        encoderInstancesRegistry.set(encoderInstanceId, entry);

        port1.onmessage = ({ data }) => {
            if (data.length === 0) {
                closePort(port1);

                entry[2] = false;
            } else {
                encoderBroker.record(
                    encoderInstanceId,
                    sampleRate,
                    data.map((channelDataOrNumberOfSamples: number | TTypedArray) =>
                        typeof channelDataOrNumberOfSamples === 'number'
                            ? new Float32Array(channelDataOrNumberOfSamples)
                            : channelDataOrNumberOfSamples
                    )
                );
            }
        };

        return port2;
    };
};
