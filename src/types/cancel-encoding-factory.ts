import { TCancelEncodingFunction } from './cancel-encoding-function';
import { TClosePortFunction } from './close-port-function';
import { TRemoveEncoderInstanceFunction } from './remove-encoder-instance-function';

export type TCancelEncodingFactory = (
    closePort: TClosePortFunction,
    removeEncoderInstance: TRemoveEncoderInstanceFunction
) => TCancelEncodingFunction;
