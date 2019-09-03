import { createGetEncoderInstance } from '../../../src/factories/get-encoder-instance';

describe('getEncoderInstance()', () => {

    let encoderId;
    let encoderInstancesRegistry;
    let getEncoderInstance;

    beforeEach(() => {
        encoderId = 'a fake encoder id';
        encoderInstancesRegistry = new Map();

        getEncoderInstance = createGetEncoderInstance(encoderInstancesRegistry);
    });

    describe('without an entry with the given id', () => {

        it('should throw an error', () => {
            expect(() => {
                getEncoderInstance(encoderId);
            }).to.throw(Error, 'There was no instance of an encoder stored with the given id.');
        });

    });

    describe('with an entry with the given id', () => {

        let entry;

        beforeEach(() => {
            entry = [ 'a', 'fake', 'entry' ];

            encoderInstancesRegistry.set(encoderId, entry);
        });

        it('should return the entry', () => {
            expect(getEncoderInstance(encoderId)).to.equal(entry);
        });

    });

});
