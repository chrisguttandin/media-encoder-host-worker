import { createRegisterEncoder } from '../../../src/factories/register-encoder';
import { stub } from 'sinon';

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
        wrap = stub();

        registerEncoder = createRegisterEncoder(encoderBrokerRegistry, encoderIds, wrap);
    });

    describe('with an error thrown by wrap()', () => {
        let error;

        beforeEach(() => {
            error = new Error('a fake error');

            wrap.throws(error);
        });

        it('should call wrap() with the given port', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWithExactly(port);

                done();
            });
        });

        it('should rethrow the error', (done) => {
            registerEncoder(encoderId, port).catch((err) => {
                expect(err).to.equal(error);

                done();
            });
        });

        it('should not add anything to the encoderBrokerRegistry', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(0);

                done();
            });
        });

        it('should not add anything to the encoderIds', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(0);

                done();
            });
        });
    });

    describe('with an error thrown by characterize()', () => {
        let encoderBroker;
        let error;

        beforeEach(() => {
            encoderBroker = { characterize: stub() };
            error = new Error('a fake error');

            wrap.returns(encoderBroker);
            encoderBroker.characterize.rejects(error);
        });

        it('should call wrap() with the given port', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWithExactly(port);

                done();
            });
        });

        it('should call characterize() on the encoderBroker returned by wrap()', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBroker.characterize).to.have.been.calledOnceWithExactly();

                done();
            });
        });

        it('should rethrow the error', (done) => {
            registerEncoder(encoderId, port).catch((err) => {
                expect(err).to.equal(error);

                done();
            });
        });

        it('should not add anything to the encoderBrokerRegistry', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(0);

                done();
            });
        });

        it('should not add anything to the encoderIds', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(0);

                done();
            });
        });
    });

    describe('with an existing entry', () => {
        let encoderBroker;
        let regex;

        beforeEach(() => {
            encoderBroker = { characterize: stub() };
            regex = 'a fake regex';

            encoderBrokerRegistry.set(regex, 'a fake entry');

            wrap.returns(encoderBroker);
            encoderBroker.characterize.resolves(regex);
        });

        it('should call wrap() with the given port', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWithExactly(port);

                done();
            });
        });

        it('should call characterize() on the encoderBroker returned by wrap()', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBroker.characterize).to.have.been.calledOnceWithExactly();

                done();
            });
        });

        it('should throw an error', (done) => {
            registerEncoder(encoderId, port).catch((err) => {
                expect(err.name).to.equal('Error');
                expect(err.message).to.equal('There is already an encoder stored which handles exactly the same mime types.');

                done();
            });
        });

        it('should not add anything to the encoderBrokerRegistry', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(1);
                expect(encoderBrokerRegistry.get(regex)).to.equal('a fake entry');

                done();
            });
        });

        it('should not add anything to the encoderIds', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(0);

                done();
            });
        });
    });

    describe('with an existing encoder', () => {
        let encoderBroker;
        let regex;

        beforeEach(() => {
            encoderBroker = { characterize: stub() };
            regex = 'a fake regex';

            encoderIds.set(encoderId, 'a fake entry');

            wrap.returns(encoderBroker);
            encoderBroker.characterize.resolves(regex);
        });

        it('should call wrap() with the given port', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(wrap).to.have.been.calledOnceWithExactly(port);

                done();
            });
        });

        it('should call characterize() on the encoderBroker returned by wrap()', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBroker.characterize).to.have.been.calledOnceWithExactly();

                done();
            });
        });

        it('should throw an error', (done) => {
            registerEncoder(encoderId, port).catch((err) => {
                expect(err.name).to.equal('Error');
                expect(err.message).to.equal('There is already an encoder registered with an id called "a fake encoder id".');

                done();
            });
        });

        it('should not add anything to the encoderBrokerRegistry', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderBrokerRegistry.size).to.equal(0);

                done();
            });
        });

        it('should not add anything to the encoderIds', (done) => {
            registerEncoder(encoderId, port).catch(() => {
                expect(encoderIds.size).to.equal(1);
                expect(encoderIds.get(encoderId)).to.equal('a fake entry');

                done();
            });
        });
    });

    describe('without an existing entry', () => {
        let encoderBroker;
        let regex;

        beforeEach(() => {
            encoderBroker = { characterize: stub() };
            regex = 'a fake regex';

            wrap.returns(encoderBroker);
            encoderBroker.characterize.resolves(regex);
        });

        it('should call wrap() with the given port', async () => {
            await registerEncoder(encoderId, port);

            expect(wrap).to.have.been.calledOnceWithExactly(port);
        });

        it('should call characterize() on the encoderBroker returned by wrap()', async () => {
            await registerEncoder(encoderId, port);

            expect(encoderBroker.characterize).to.have.been.calledOnceWithExactly();
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
