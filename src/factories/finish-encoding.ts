import type { closePort as closePortFunction } from '../functions/close-port';
import type { createRemoveEncoderInstance } from './remove-encoder-instance';

export const createFinishEncoding = (
    closePort: typeof closePortFunction,
    removeEncoderInstance: ReturnType<typeof createRemoveEncoderInstance>
) => {
    return (encoderInstanceId: number) => {
        const [encoderBroker, port, isRecording, sampleRate] = removeEncoderInstance(encoderInstanceId);

        if (!isRecording) {
            return encoderBroker.encode(encoderInstanceId, null);
        }

        return new Promise<ArrayBuffer[]>((resolve) => {
            port.onmessage = ({ data }) => {
                if (data.length === 0) {
                    closePort(port);

                    resolve(encoderBroker.encode(encoderInstanceId, null));
                } else {
                    encoderBroker.record(encoderInstanceId, sampleRate, data);
                }
            };
        });
    };
};
