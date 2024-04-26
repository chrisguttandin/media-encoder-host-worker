import { createGetEncoderInstance } from '../../../src/factories/get-encoder-instance';

describe('getEncoderInstance()', () => {
    let encoderInstanceId;
    let encoderInstancesRegistry;
    let getEncoderInstance;

    beforeEach(() => {
        encoderInstanceId = 'a fake encoder instance id';
        encoderInstancesRegistry = new Map();

        getEncoderInstance = createGetEncoderInstance(encoderInstancesRegistry);
    });

    describe('without an entry with the given id', () => {
        it('should throw an error', () => {
            expect(() => {
                getEncoderInstance(encoderInstanceId);
            }).to.throw(Error, 'There was no instance of an encoder stored with the given id.');
        });
    });

    describe('with an entry with the given id', () => {
        let entry;

        beforeEach(() => {
            entry = ['a', 'fake', 'entry'];

            encoderInstancesRegistry.set(encoderInstanceId, entry);
        });

        it('should return the entry', () => {
            expect(getEncoderInstance(encoderInstanceId)).to.equal(entry);
        });
    });
});
