import { createRemoveEncoderInstance } from '../../../src/factories/remove-encoder-instance';

describe('removeEncoderInstance()', () => {

    let encoderId;
    let encoderInstancesRegistry;
    let removeEncoderInstance;

    beforeEach(() => {
        encoderId = 'a fake encoder id';
        encoderInstancesRegistry = new Map();

        removeEncoderInstance = createRemoveEncoderInstance(encoderInstancesRegistry);
    });

    describe('without an entry with the given id', () => {

        it('should throw an error', () => {
            expect(() => {
                removeEncoderInstance(encoderId);
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
            expect(removeEncoderInstance(encoderId)).to.equal(entry);
        });

        it('should remove the entry', () => {
            removeEncoderInstance(encoderId);

            expect(encoderInstancesRegistry.has(encoderId)).to.be.false;
        });

    });

});
