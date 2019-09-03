import { createRemoveEncoderInstance } from '../../../src/factories/remove-encoder-instance';
import { stub } from 'sinon';

describe('removeEncoderInstance()', () => {

    let encoderId;
    let encoderInstancesRegistry;
    let getEncoderInstance;
    let removeEncoderInstance;

    beforeEach(() => {
        encoderId = 'a fake encoder id';
        encoderInstancesRegistry = new Map();
        getEncoderInstance = stub();

        removeEncoderInstance = createRemoveEncoderInstance(encoderInstancesRegistry, getEncoderInstance);
    });

    describe('with an error thrown by getEncoderInstance()', () => {

        beforeEach(() => {
            getEncoderInstance.throws(new Error('a fake error'));
        });

        it('should rethrow the error', () => {
            expect(() => {
                removeEncoderInstance(encoderId);
            }).to.throw(Error, 'a fake error');
        });

    });

    describe('with an entry return by getEncoderInstance()', () => {

        let entry;

        beforeEach(() => {
            entry = [ 'a', 'fake', 'entry' ];

            encoderInstancesRegistry.set(encoderId, entry);
            getEncoderInstance.returns(entry);
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
