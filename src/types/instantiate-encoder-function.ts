import { TInstantiateEncoderFunction } from './instantiate-encoder-function';

export type TInstantiateEncoderFunction = (encoderId: number, mimeType: string, sampleRate: number) => MessagePort;
