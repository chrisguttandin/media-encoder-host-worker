import { IWorkerDefinition } from 'worker-factory';

export interface IMediaEncoderHostWorkerCustomDefinition extends IWorkerDefinition {
    deregister: {
        params: {
            encoderId: number;
        };

        response: {
            result: null;
        };
    };

    encode: {
        params: {
            encoderInstanceId: number;

            timeslice: null | number;
        };

        response: {
            result: ArrayBuffer[];

            transferables: ArrayBuffer[];
        };

        transferables: ArrayBuffer[];
    };

    instantiate: {
        params: {
            encoderInstanceId: number;

            mimeType: string;

            sampleRate: number;
        };

        response: {
            result: MessagePort;

            transferables: [MessagePort];
        };
    };

    register: {
        params: {
            encoderId: number;

            port: MessagePort;
        };

        response: {
            result: RegExp;
        };
    };
}
