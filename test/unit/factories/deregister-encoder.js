import { createDeregisterEncoder } from '../../../src/factories/deregister-encoder';

describe('deregisterEncoder()', () => {
    let deregisterEncoder;
    let encoderBrokerRegistry;
    let encoderIds;

    beforeEach(() => {
        encoderBrokerRegistry = new Map();
        encoderIds = new Map();

        deregisterEncoder = createDeregisterEncoder(encoderBrokerRegistry, encoderIds);
    });

    describe('without an existing encoder', () => {
        it('should throw an error', () => {
            expect(() => deregisterEncoder('a fake encoder id')).to.throw(Error, 'There was no encoder stored with the given id.');
        });
    });

    describe('with an existing encoder', () => {
        let encoderId;

        beforeEach(() => {
            encoderId = 'a fake encoder id';
        });

        describe('without an existing entry', () => {
            beforeEach(() => {
                encoderIds.set(encoderId, 'a fake entry');
            });

            it('should return undefined', () => {
                expect(deregisterEncoder(encoderId)).to.be.undefined;
            });

            it('should not change the encoderBrokerRegistry', () => {
                deregisterEncoder(encoderId);

                expect(encoderBrokerRegistry.size).to.equal(0);
            });

            it('should delete the encoder', () => {
                deregisterEncoder(encoderId);

                expect(encoderIds.size).to.equal(0);
            });
        });

        describe('with an existing entry', () => {
            let regex;

            beforeEach(() => {
                regex = 'a fake regex';

                encoderBrokerRegistry.set(regex, 'a fake entry');
                encoderIds.set(encoderId, regex);
            });

            it('should return undefined', () => {
                expect(deregisterEncoder(encoderId)).to.be.undefined;
            });

            it('should delete the entry', () => {
                deregisterEncoder(encoderId);

                expect(encoderBrokerRegistry.size).to.equal(0);
            });

            it('should delete the encoder', () => {
                deregisterEncoder(encoderId);

                expect(encoderIds.size).to.equal(0);
            });
        });
    });
});
