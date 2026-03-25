import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRegisterEncoder } from '../../../src/factories/register-encoder';

describe('registerEncoder()', () => {
    let encoderBrokerRegistry;
    let encoderId;
    let encoderIds;
    let port;
    let registerEncoder;
    let wrap;

    beforeEach(() => {
        encoderBrokerRegistry = new Map();
        encoderId = 'a fake encoder id';
        encoderIds = new Map();
        port = 'a fake port';
        wrap = vi.fn();

        registerEncoder = createRegisterEncoder(encoderBrokerRegistry, encoderIds, wrap);
    });

    describe('with an error thrown by wrap()', () => {
        let error;

        beforeEach(() => {
            error = new Error('a fake error');

            wrap.mockThrow(error);
        });

        it('should call wrap() with the given port', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWith(port);

                resolve();
            });

            return promise;
        });

        it('should rethrow the error', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch((err) => {
                expect(err).to.equal(error);

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderBrokerRegistry', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(0);

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderIds', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(0);

                resolve();
            });

            return promise;
        });
    });

    describe('with an error thrown by characterize()', () => {
        let encoderBroker;
        let error;

        beforeEach(() => {
            encoderBroker = { characterize: vi.fn() };
            error = new Error('a fake error');

            wrap.mockReturnValue(encoderBroker);
            encoderBroker.characterize.mockRejectedValue(error);
        });

        it('should call wrap() with the given port', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWith(port);

                resolve();
            });

            return promise;
        });

        it('should call characterize() on the encoderBroker returned by wrap()', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBroker.characterize).to.have.been.calledOnceWith();

                resolve();
            });

            return promise;
        });

        it('should rethrow the error', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch((err) => {
                expect(err).to.equal(error);

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderBrokerRegistry', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(0);

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderIds', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(0);

                resolve();
            });

            return promise;
        });
    });

    describe('with an existing entry', () => {
        let encoderBroker;
        let regex;

        beforeEach(() => {
            encoderBroker = { characterize: vi.fn() };
            regex = 'a fake regex';

            encoderBrokerRegistry.set(regex, 'a fake entry');

            wrap.mockReturnValue(encoderBroker);
            encoderBroker.characterize.mockResolvedValue(regex);
        });

        it('should call wrap() with the given port', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWith(port);

                resolve();
            });

            return promise;
        });

        it('should call characterize() on the encoderBroker returned by wrap()', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBroker.characterize).to.have.been.calledOnceWith();

                resolve();
            });

            return promise;
        });

        it('should throw an error', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch((err) => {
                expect(err.name).to.equal('Error');
                expect(err.message).to.equal('There is already an encoder stored which handles exactly the same mime types.');

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderBrokerRegistry', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(1);
                expect(encoderBrokerRegistry.get(regex)).to.equal('a fake entry');

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderIds', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(0);

                resolve();
            });

            return promise;
        });
    });

    describe('with an existing encoder', () => {
        let encoderBroker;
        let regex;

        beforeEach(() => {
            encoderBroker = { characterize: vi.fn() };
            regex = 'a fake regex';

            encoderIds.set(encoderId, 'a fake entry');

            wrap.mockReturnValue(encoderBroker);
            encoderBroker.characterize.mockResolvedValue(regex);
        });

        it('should call wrap() with the given port', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWith(port);

                resolve();
            });

            return promise;
        });

        it('should call characterize() on the encoderBroker returned by wrap()', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBroker.characterize).to.have.been.calledOnceWith();

                resolve();
            });

            return promise;
        });

        it('should throw an error', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch((err) => {
                expect(err.name).to.equal('Error');
                expect(err.message).to.equal('There is already an encoder registered with an id called "a fake encoder id".');

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderBrokerRegistry', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(0);

                resolve();
            });

            return promise;
        });

        it('should not add anything to the encoderIds', () => {
            const { promise, resolve } = Promise.withResolvers();

            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(1);
                expect(encoderIds.get(encoderId)).to.equal('a fake entry');

                resolve();
            });

            return promise;
        });
    });

    describe('without an existing entry', () => {
        let encoderBroker;
        let regex;

        beforeEach(() => {
            encoderBroker = { characterize: vi.fn() };
            regex = 'a fake regex';

            wrap.mockReturnValue(encoderBroker);
            encoderBroker.characterize.mockResolvedValue(regex);
        });

        it('should call wrap() with the given port', async () => {
            await registerEncoder(encoderId, port);

            expect(wrap).to.have.been.calledOnceWith(port);
        });

        it('should call characterize() on the encoderBroker returned by wrap()', async () => {
            await registerEncoder(encoderId, port);

            expect(encoderBroker.characterize).to.have.been.calledOnceWith();
        });

        it('should return the regex returned by characterize()', async () => {
            expect(await registerEncoder(encoderId, port)).to.equal(regex);
        });

        it('should add the encoderBroker to the encoderBrokerRegistry', async () => {
            await registerEncoder(encoderId, port);

            expect(encoderBrokerRegistry.size).to.equal(1);
            expect(encoderBrokerRegistry.get(regex)).to.deep.equal([regex, encoderBroker]);
        });

        it('should add the port to the encoderIds', async () => {
            await registerEncoder(encoderId, port);

            expect(encoderIds.size).to.equal(1);
            expect(encoderIds.get(encoderId)).to.equal(regex);
        });
    });
});
