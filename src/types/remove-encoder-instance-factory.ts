import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';
import { TGetEncoderInstanceFunction } from './get-encoder-instance-function';
import { TRemoveEncoderInstanceFunction } from './remove-encoder-instance-function';

export type TRemoveEncoderInstanceFactory = (
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>,
    getEncoderInstance: TGetEncoderInstanceFunction
) => TRemoveEncoderInstanceFunction;
