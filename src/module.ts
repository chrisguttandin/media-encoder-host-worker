import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TWorkerImplementation, createWorker } from 'worker-factory';
import { cancelEncoding } from './functions/cancel-encoding';
import { finishEncoding } from './functions/finish-encoding';
import { instantiateEncoder } from './functions/instantiate-encoder';
import { registerEncoder } from './functions/register-encoder';
import { IMediaEncoderHostWorkerCustomDefinition } from './interfaces';

export * from './interfaces';
export * from './types';

const encoderBrokerRegistry: Map<string, [ RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition ]> = new Map();
const encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]> = new Map();

createWorker<IMediaEncoderHostWorkerCustomDefinition>(self, <TWorkerImplementation<IMediaEncoderHostWorkerCustomDefinition>> {
    cancel: ({ encoderId }) => {
        cancelEncoding(encoderId, encoderInstancesRegistry);

        return { result: null };
    },
    encode: async ({ encoderId }) => {
        const arrayBuffers = await finishEncoding(encoderId, encoderInstancesRegistry);

        return { result: arrayBuffers, transferables: arrayBuffers };
    },
    instantiate: ({ encoderId, mimeType }) => {
        const port = instantiateEncoder(encoderBrokerRegistry, encoderId, encoderInstancesRegistry, mimeType);

        return { result: port, transferables: [ port ] };
    },
    register: async ({ port }) => {
        return { result: await registerEncoder(encoderBrokerRegistry, port) };
    }
});
