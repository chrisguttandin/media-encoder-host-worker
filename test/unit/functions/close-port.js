import { beforeEach, describe, expect, it, vi } from 'vitest';
import { closePort } from '../../../src/functions/close-port';

describe('closePort()', () => {
    let port;

    beforeEach(() => {
        port = { close: vi.fn(), onmessage: () => {} };
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
