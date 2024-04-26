import type { TEncoderInstancesRegistryEntry } from '../types';

export const createGetEncoderInstance = (encoderInstancesRegistry: Map<number, TEncoderInstancesRegistryEntry>) => {
    return (encoderInstanceId: number) => {
        const entry = encoderInstancesRegistry.get(encoderInstanceId);

        if (entry === undefined) {
            throw new Error('There was no instance of an encoder stored with the given id.');
        }

        return entry;
    };
};
