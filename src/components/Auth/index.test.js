const { h } = require('preact');
const render = require('preact-render-to-string');
const htmlLooksLike = require('html-looks-like');

const Auth = require('.');

describe('Auth', () => {
  test('It renders', () => {
    const actual = render(<Auth />);
    const expected = `
      <div>
        Find me in {{ ... }}
      </div>
    `;

    htmlLooksLike(actual, expected);
  });
});
