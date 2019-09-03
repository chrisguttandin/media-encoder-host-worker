import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';

export type TRemoveEncoderInstanceFunction = (
    encoderId: number,
    encoderInstancesRegistry: Map<number, [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ]>
) => [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ];
