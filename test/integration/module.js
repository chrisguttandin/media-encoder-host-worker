import { beforeEach, describe, expect, it } from 'vitest';

describe('module', () => {
    let worker;

    beforeEach(() => {
        worker = new Worker(new URL('../../src/module', import.meta.url), { type: 'module' });
    });

    describe('deregister()', () => {
        let encoderId;
        let id;

        beforeEach(() => {
            encoderId = 17;
            id = 43;
        });

        describe('with a not yet registered encoder', () => {
            it('should return an error', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'There was no encoder stored with the given id.'
                        },
                        id
                    });

                    resolve();
                });

                worker.postMessage({ id, method: 'deregister', params: { encoderId } });

                return promise;
            });
        });

        describe('with a previously registered encoder', () => {
            beforeEach(() => {
                const { promise, resolve } = Promise.withResolvers();
                const { port1, port2 } = new MessageChannel();

                port2.onmessage = ({ data }) => {
                    port2.postMessage({ id: data.id, result: /^mime\/type$/ });
                };

                const onMessage = () => {
                    worker.removeEventListener('message', onMessage);

                    resolve();
                };

                worker.addEventListener('message', onMessage);
                worker.postMessage({ id, method: 'register', params: { encoderId, port: port1 } }, [port1]);

                return promise;
            });

            it('should return null', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({ id, result: null });

                    resolve();
                });

                worker.postMessage({ id, method: 'deregister', params: { encoderId } });

                return promise;
            });
        });
    });

    describe('encode()', ({ skip }) => {
        // @todo
        skip();
    });

    describe('instantiate()', ({ skip }) => {
        // @todo
        skip();
    });

    describe('register()', () => {
        let encoderId;
        let id;
        let port;

        beforeEach(() => {
            const { port1, port2 } = new MessageChannel();

            encoderId = 17;
            id = 43;
            port = port1;

            port2.onmessage = ({ data }) => {
                port2.postMessage({ id: data.id, result: /^mime\/type$/ });
            };
        });

        describe('with a not yet registered regex', () => {
            it('should return a regex', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({ id, result: /^mime\/type$/ });

                    resolve();
                });

                worker.postMessage({ id, method: 'register', params: { encoderId, port } }, [port]);

                return promise;
            });
        });

        describe('with a previously registered regex', () => {
            beforeEach(() => {
                const { promise, resolve } = Promise.withResolvers();
                const { port1, port2 } = new MessageChannel();

                port2.onmessage = ({ data }) => {
                    port2.postMessage({ id: data.id, result: /^mime\/type$/ });
                };

                const onMessage = () => {
                    worker.removeEventListener('message', onMessage);

                    resolve();
                };

                worker.addEventListener('message', onMessage);
                worker.postMessage({ id, method: 'register', params: { encoderId, port: port1 } }, [port1]);

                encoderId += 1;

                return promise;
            });

            it('should return an error', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'There is already an encoder stored which handles exactly the same mime types.'
                        },
                        id
                    });

                    resolve();
                });

                worker.postMessage({ id, method: 'register', params: { encoderId, port } }, [port]);

                return promise;
            });
        });

        describe('with a previously registered encoder', () => {
            beforeEach(() => {
                const { promise, resolve } = Promise.withResolvers();
                const { port1, port2 } = new MessageChannel();

                port2.onmessage = ({ data }) => {
                    port2.postMessage({ id: data.id, result: /^x-mime\/type$/ });
                };

                const onMessage = () => {
                    worker.removeEventListener('message', onMessage);

                    resolve();
                };

                worker.addEventListener('message', onMessage);
                worker.postMessage({ id, method: 'register', params: { encoderId, port: port1 } }, [port1]);

                return promise;
            });

            it('should return an error', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'There is already an encoder registered with an id called "17".'
                        },
                        id
                    });

                    resolve();
                });

                worker.postMessage({ id, method: 'register', params: { encoderId, port } }, [port]);

                return promise;
            });
        });
    });
});
