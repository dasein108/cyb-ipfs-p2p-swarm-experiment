import { expect } from 'aegir/chai';
export const expectError = (error, message) => {
    if (error instanceof Error) {
        expect(error.message).to.equal(message);
    }
    else {
        expect('Did not throw error:').to.equal(message);
    }
};
//# sourceMappingURL=util.js.map