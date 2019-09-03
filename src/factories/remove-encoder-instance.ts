import { TRemoveEncoderInstanceFactory } from '../types';

export const createRemoveEncoderInstance: TRemoveEncoderInstanceFactory = (encoderInstancesRegistry) => {
    return (encoderId) => {
        const entry = encoderInstancesRegistry.get(encoderId);

        if (entry === undefined) {
            throw new Error('There was no instance of an encoder stored with the given id.');
        }

        encoderInstancesRegistry.delete(encoderId);

        return entry;
    };
};
