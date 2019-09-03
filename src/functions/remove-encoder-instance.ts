import { TRemoveEncoderInstanceFunction } from '../types';

export const removeEncoderInstance: TRemoveEncoderInstanceFunction = (encoderId, encoderInstancesRegistry) => {
    const entry = encoderInstancesRegistry.get(encoderId);

    if (entry === undefined) {
        throw new Error('There was no instance of an encoder stored with the given id.');
    }

    encoderInstancesRegistry.delete(encoderId);

    return entry;
};
