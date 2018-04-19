import { removeEncoderInstance } from '../../../src/helpers/remove-encoder-instance';

describe('removeEncoderInstance()', () => {

    let encoderId;
    let encoderInstancesRegistry;

    beforeEach(() => {
        encoderId = 'a fake encoder id';
        encoderInstancesRegistry = new Map();
    });

    describe('without an entry with the given id', () => {

        it('should throw an error', () => {
            expect(() => {
                removeEncoderInstance(encoderId, encoderInstancesRegistry);
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
            expect(removeEncoderInstance(encoderId, encoderInstancesRegistry)).to.equal(entry);
        });

        it('should remove the entry', () => {
            removeEncoderInstance(encoderId, encoderInstancesRegistry);

            expect(encoderInstancesRegistry.has(encoderId)).to.be.false;
        });

    });

});
