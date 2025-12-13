import { beforeEach, describe, expect, it } from 'vitest';
import { closePort } from '../../../src/functions/close-port';
import { spy } from 'sinon';

describe('closePort()', () => {
    let port;

    beforeEach(() => {
        port = { close: spy(), onmessage: () => {} };
    });

    it('should set the onmessage handler of the given port to null', () => {
        closePort(port);

        expect(port.onmessage).to.be.null;
    });

    it('should close the given port', () => {
        closePort(port);

        expect(port.close).to.have.been.calledOnce;
    });
});
