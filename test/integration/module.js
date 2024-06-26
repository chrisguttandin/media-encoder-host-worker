describe('module', () => {
    let worker;

    beforeEach(() => {
        worker = new Worker('base/src/module.js');
    });

    describe('deregister()', () => {
        let encoderId;
        let id;

        beforeEach(() => {
            encoderId = 17;
            id = 43;
        });

        describe('with a not yet registered encoder', () => {
            it('should return an error', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'There was no encoder stored with the given id.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage({ id, method: 'deregister', params: { encoderId } });
            });
        });

        describe('with a previously registered encoder', () => {
            beforeEach((done) => {
                const { port1, port2 } = new MessageChannel();

                port2.onmessage = ({ data }) => {
                    port2.postMessage({ id: data.id, result: /^mime\/type$/ });
                };

                const onMessage = () => {
                    worker.removeEventListener('message', onMessage);

                    done();
                };

                worker.addEventListener('message', onMessage);
                worker.postMessage({ id, method: 'register', params: { encoderId, port: port1 } }, [port1]);
            });

            it('should return null', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({ id, result: null });

                    done();
                });

                worker.postMessage({ id, method: 'deregister', params: { encoderId } });
            });
        });
    });

    describe('encode()', () => {
        // @todo
    });

    describe('instantiate()', () => {
        // @todo
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
            it('should return a regex', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({ id, result: /^mime\/type$/ });

                    done();
                });

                worker.postMessage({ id, method: 'register', params: { encoderId, port } }, [port]);
            });
        });

        describe('with a previously registered regex', () => {
            beforeEach((done) => {
                const { port1, port2 } = new MessageChannel();

                port2.onmessage = ({ data }) => {
                    port2.postMessage({ id: data.id, result: /^mime\/type$/ });
                };

                const onMessage = () => {
                    worker.removeEventListener('message', onMessage);

                    done();
                };

                worker.addEventListener('message', onMessage);
                worker.postMessage({ id, method: 'register', params: { encoderId, port: port1 } }, [port1]);

                encoderId += 1;
            });

            it('should return an error', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'There is already an encoder stored which handles exactly the same mime types.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage({ id, method: 'register', params: { encoderId, port } }, [port]);
            });
        });

        describe('with a previously registered encoder', () => {
            beforeEach((done) => {
                const { port1, port2 } = new MessageChannel();

                port2.onmessage = ({ data }) => {
                    port2.postMessage({ id: data.id, result: /^x-mime\/type$/ });
                };

                const onMessage = () => {
                    worker.removeEventListener('message', onMessage);

                    done();
                };

                worker.addEventListener('message', onMessage);
                worker.postMessage({ id, method: 'register', params: { encoderId, port: port1 } }, [port1]);
            });

            it('should return an error', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'There is already an encoder registered with an id called "17".'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage({ id, method: 'register', params: { encoderId, port } }, [port]);
            });
        });
    });
});
