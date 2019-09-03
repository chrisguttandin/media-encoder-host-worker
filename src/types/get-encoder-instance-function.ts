import { IExtendableMediaRecorderWavEncoderBrokerDefinition } from 'extendable-media-recorder-wav-encoder-broker';

export type TGetEncoderInstanceFunction = (
    encoderId: number
) => [ IExtendableMediaRecorderWavEncoderBrokerDefinition, MessagePort, boolean ];
