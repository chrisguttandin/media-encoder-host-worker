import { createWorker } from 'worker-factory';
import { cancelEncoding } from './helpers/cancel-encoding';
import { finishEncoding } from './helpers/finish-encoding';
import { instantiateEncoder } from './helpers/instantiate-encoder';
import { loadEncoder } from './helpers/load-encoder';
import { IEncoder, IEncoderConstructor, IMediaEncoderHostWorkerCustomDefinition } from './interfaces';

export * from './interfaces';
export * from './types';

const encoderConstructorRegistry: Map<string, [ RegExp, IEncoderConstructor ]> = new Map();
const encoderInstancesRegistry: Map<number, [ IEncoder, MessagePort, boolean ]> = new Map();

createWorker<IMediaEncoderHostWorkerCustomDefinition>(self, {
    cancel: ({ encoderId }) => {
        cancelEncoding(encoderId, encoderInstancesRegistry);

        return { result: null };
    },
    encode: async ({ encoderId }) => {
        const arrayBuffers = await finishEncoding(encoderId, encoderInstancesRegistry);

        return { result: arrayBuffers, transferables: arrayBuffers };
    },
    instantiate: ({ encoderId, mimeType }) => {
        const port = instantiateEncoder(encoderConstructorRegistry, encoderId, encoderInstancesRegistry, mimeType);

        return { result: port, transferables: [ port ] };
    },
    load: ({ url }) => {
        return { result: loadEncoder(encoderConstructorRegistry, url) };
    }
});
