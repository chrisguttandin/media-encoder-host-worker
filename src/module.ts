import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createCancelEncoding } from './factories/cancel-encoding';
import { createFinishEncoding } from './factories/finish-encoding';
import { createInstantiateEncoder } from './factories/instantiate-encoder';
import { createPickCapableEncoderBroker } from './factories/pick-capable-encoder-broker';
import { closePort } from './functions/close-port';
import { registerEncoder } from './functions/register-encoder';
import { removeEncoderInstance } from './functions/remove-encoder-instance';
import { IMediaEncoderHostWorkerCustomDefinition } from './interfaces';

export * from './interfaces';
export * from './types';

const cancelEncoding = createCancelEncoding(closePort, removeEncoderInstance);
const encoderBrokerRegistry: Map<string, [ RegExp, IExtendableMediaRecorderWavEncoderBrokerDefinition ]> = new Map();
const encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]> = new Map();
const finishEncoding = createFinishEncoding(closePort, removeEncoderInstance);
const pickCapableEncoderBroker = createPickCapableEncoderBroker(encoderBrokerRegistry);
const instantiateEncoder = createInstantiateEncoder(closePort, encoderInstancesRegistry, pickCapableEncoderBroker);

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
        const port = instantiateEncoder(encoderId, mimeType);

        return { result: port, transferables: [ port ] };
    },
    register: async ({ port }) => {
        return { result: await registerEncoder(encoderBrokerRegistry, port) };
    }
});
