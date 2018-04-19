describe('module', () => {

    let worker;

    after((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 500);
    });

    beforeEach(() => {
        worker = new Worker('base/src/module.ts');
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

    describe('load()', () => {

        let id;

        beforeEach(() => {
            id = 43;
        });

        describe('with no encoder registered within the loaded script', () => {

            let url;

            beforeEach(() => {
                url = '/base/test/fixtures/no-encoder.js';
            });

            it('should return an error', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'No encoder could not be registered.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage({ id, method: 'load', params: { url } });
            });

        });

        describe('with one encoder registered within the loaded script', () => {

            let url;

            beforeEach(() => {
                url = '/base/test/fixtures/encoder.js';
            });

            describe('with an not yet loaded url', () => {

                it('should return a regex', (done) => {
                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({ id, result: /^mime\/type$/ });

                        done();
                    });

                    worker.postMessage({ id, method: 'load', params: { url } });
                });

            });

            describe('with a previously loaded url', () => {

                beforeEach((done) => {
                    const onMessage = () => {
                        worker.removeEventListener('message', onMessage);

                        done();
                    };

                    worker.addEventListener('message', onMessage);
                    worker.postMessage({ id, method: 'load', params: { url } });
                });

                it('should return an error', (done) => {
                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({
                            error: {
                                // @todo Define a more meaningful error code.
                                code: -32603,
                                message: 'There is already an encoder stored with the given url.'
                            },
                            id
                        });

                        done();
                    });

                    worker.postMessage({ id, method: 'load', params: { url } });
                });

            });

        });

        describe('with two encoders registered within the loaded script', () => {

            let url;

            beforeEach(() => {
                url = '/base/test/fixtures/two-encoders.js';
            });

            it('should return an error', (done) => {
                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            // @todo Define a more meaningful error code.
                            code: -32603,
                            message: 'It is only possible to register one encoder at a time.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage({ id, method: 'load', params: { url } });
            });

        });

    });

});
