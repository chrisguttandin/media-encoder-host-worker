import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TGetEncoderInstanceFunction } from './get-encoder-instance-function';

export type TGetEncoderInstanceFactory = (
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>
) => TGetEncoderInstanceFunction;
