require('@testing-library/jest-dom');
const {TextDecoder, TextEncoder} = require('util');
const {cleanup} = require('@testing-library/react');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

afterEach(() => {
  cleanup();
});
