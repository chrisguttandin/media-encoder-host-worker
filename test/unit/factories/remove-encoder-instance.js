import { createRemoveEncoderInstance } from '../../../src/factories/remove-encoder-instance';
import { stub } from 'sinon';

describe('removeEncoderInstance()', () => {
    let encoderInstanceId;
    let encoderInstancesRegistry;
    let getEncoderInstance;
    let removeEncoderInstance;

    beforeEach(() => {
        encoderInstanceId = 'a fake encoder instance id';
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
                removeEncoderInstance(encoderInstanceId);
            }).to.throw(Error, 'a fake error');
        });
    });

    describe('with an entry return by getEncoderInstance()', () => {
        let entry;

        beforeEach(() => {
            entry = ['a', 'fake', 'entry'];

            encoderInstancesRegistry.set(encoderInstanceId, entry);
            getEncoderInstance.returns(entry);
        });

        it('should return the entry', () => {
            expect(removeEncoderInstance(encoderInstanceId)).to.equal(entry);
        });

        it('should remove the entry', () => {
            removeEncoderInstance(encoderInstanceId);

            expect(encoderInstancesRegistry.has(encoderInstanceId)).to.be.false;
        });
    });
});
