import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';

export type TRemoveEncoderInstanceFunction = (
    encoderId: number
) => [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ];
