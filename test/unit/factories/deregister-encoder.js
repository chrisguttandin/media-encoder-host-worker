import { createDeregisterEncoder } from '../../../src/factories/deregister-encoder';

describe('deregisterEncoder()', () => {
    let deregisterEncoder;
    let encoderBrokerRegistry;
    let ports;

    beforeEach(() => {
        encoderBrokerRegistry = new Map();
        ports = new Map();

        deregisterEncoder = createDeregisterEncoder(encoderBrokerRegistry, ports);
    });

    describe('without an existing port', () => {
        it('should throw an error', () => {
            expect(() => deregisterEncoder('a fake port')).to.throw(Error, 'There is no encoder stored which wraps this port.');
        });
    });

    describe('with an existing port', () => {
        let port;

        beforeEach(() => {
            port = 'a fake port';
        });

        describe('without an existing entry', () => {
            beforeEach(() => {
                ports.set(port, 'a fake entry');
            });

            it('should return undefined', () => {
                expect(deregisterEncoder(port)).to.be.undefined;
            });

            it('should not change the encoderBrokerRegistry', () => {
                deregisterEncoder(port);

                expect(encoderBrokerRegistry.size).to.equal(0);
            });

            it('should delete the port', () => {
                deregisterEncoder(port);

                expect(ports.size).to.equal(0);
            });
        });

        describe('with an existing entry', () => {
            let regex;

            beforeEach(() => {
                regex = 'a fake regex';

                encoderBrokerRegistry.set(regex, 'a fake entry');
                ports.set(port, regex);
            });

            it('should return undefined', () => {
                expect(deregisterEncoder(port)).to.be.undefined;
            });

            it('should delete the entry', () => {
                deregisterEncoder(port);

                expect(encoderBrokerRegistry.size).to.equal(0);
            });

            it('should delete the port', () => {
                deregisterEncoder(port);

                expect(ports.size).to.equal(0);
            });
        });
    });
});
