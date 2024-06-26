import type { TEncoderInstancesRegistryEntry } from '../types';
import type { createGetEncoderInstance } from './get-encoder-instance';

export const createRemoveEncoderInstance = (
    encoderInstancesRegistry: Map<number, TEncoderInstancesRegistryEntry>,
    getEncoderInstance: ReturnType<typeof createGetEncoderInstance>
) => {
    return (encoderInstanceId: number) => {
        const entry = getEncoderInstance(encoderInstanceId);

        encoderInstancesRegistry.delete(encoderInstanceId);

        return entry;
    };
};
