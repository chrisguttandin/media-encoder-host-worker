import { IEncoder } from './encoder';

export interface IEncoderConstructor {

    new (mimeType: string): IEncoder;

}
