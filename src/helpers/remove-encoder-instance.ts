import { IEncoder } from '../interfaces';

export const removeEncoderInstance = (
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IEncoder, MessagePort, boolean ]>
): [ IEncoder, MessagePort, boolean ] => {
    const entry = encoderInstancesRegistry.get(encoderId);

    if (entry === undefined) {
        throw new Error('There was no instance of an encoder stored with the given id.');
    }

    encoderInstancesRegistry.delete(encoderId);

    return entry;
};
