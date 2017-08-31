const { h, render } = require('preact');

const root = document.querySelector('[data-quiz-viewer-root]');

function init() {
  const App = require('./components');

  render(<App config={root.dataset} />, root, root.firstChild);
}

init();

if (module.hot) {
  module.hot.accept('./components', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/error-box');

      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
  console.debug(`[quiz-viewer] public path: ${__webpack_public_path__}`);
}
