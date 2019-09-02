import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TClosePortFunction } from './close-port-function';
import { TInstantiateEncoderFunction } from './instantiate-encoder-function';
import { TPickCapableEncoderBrokerFunction } from './pick-capable-encoder-broker-function';

export type TInstantiateEncoderFactory = (
    closePort: TClosePortFunction,
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>,
    pickCapableEncoderBroker: TPickCapableEncoderBrokerFunction
) => TInstantiateEncoderFunction;
