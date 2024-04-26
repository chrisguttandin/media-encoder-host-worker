import type { createGetEncoderInstance } from './get-encoder-instance';

export const createRequestPartialEncoding = (getEncoderInstance: ReturnType<typeof createGetEncoderInstance>) => {
    return (encoderInstanceId: number, timeslice: number) => {
        const [encoderBroker] = getEncoderInstance(encoderInstanceId);

        return encoderBroker.encode(encoderInstanceId, timeslice);
    };
};
