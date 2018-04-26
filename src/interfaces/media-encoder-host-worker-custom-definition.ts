import { IWorkerDefinition } from 'worker-factory';

export interface IMediaEncoderHostWorkerCustomDefinition extends IWorkerDefinition {

    cancel: {

        params: {

            encoderId: number;

        };

        response: {

            result: null;

        };

    };

    encode: {

        params: {

            encoderId: number;

        };

        response: {

            result: ArrayBuffer[];

            transferables: ArrayBuffer[];

        };

        transferables: ArrayBuffer[];

    };

    instantiate: {

        params: {

            encoderId: number;

            mimeType: string;

        };

        response: {

            result: MessagePort;

            transferables: [ MessagePort ];

        };

    };

    register: {

        params: {

            port: MessagePort;

        };

        response: {

            result: RegExp;

        };

    };

}
