describe('module', () => {

    let worker;

    after((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 500);
    });

    beforeEach(() => {
        worker = new Worker('base/src/module.js');
    });

    describe('cancel()', () => {

        // @todo

    });

    describe('encode()', () => {

        // @todo

    });

    describe('instantiate()', () => {

        // @todo

    });

    describe('register()', () => {

        let id;
        let port;

        beforeEach(() => {
            const { port1, port2 } = new MessageChannel();

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

                worker.postMessage({ id, method: 'register', params: { port } }, [ port ]);
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
                worker.postMessage({ id, method: 'register', params: { port: port1 } }, [ port1 ]);
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

                worker.postMessage({ id, method: 'register', params: { port } }, [ port ]);
            });

        });

    });

});
