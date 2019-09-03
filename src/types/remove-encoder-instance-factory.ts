import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TRemoveEncoderInstanceFunction } from './remove-encoder-instance-function';

export type TRemoveEncoderInstanceFactory = (
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>
) => TRemoveEncoderInstanceFunction;
