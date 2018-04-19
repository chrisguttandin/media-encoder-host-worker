export interface IEncoder {

    cancel (): void;

    encode (): ArrayBuffer[];

    record (channelData: Float32Array[]): void;

}
