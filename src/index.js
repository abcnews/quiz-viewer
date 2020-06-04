const { h, render } = require('preact');
const url2cmid = require('@abcnews/url2cmid');
const fastclick = require('fastclick');
const a2o = require('@abcnews/alternating-case-to-object');
const {whenDOMReady} = require('@abcnews/env-utils')
const App = require('./components');

// Polyfills
require('es6-object-assign/auto'); // Object.assign for IE

function init() {
  [...document.querySelectorAll('a[name^=quiz],a[id^=quiz]')].forEach(anchor => {
    const props = a2o(anchor.getAttribute("id") || anchor.getAttribute("name"));
    const mount = document.createElement("div");    
    anchor.parentElement.insertBefore(mount, anchor);
    anchor.parentElement.removeChild(anchor);
    fastclick.attach(mount);
    render(<App id={(props.id || url2cmid(window.location.href)).toString()} />, mount);
  })
}

whenDOMReady.then(init);

if (module.hot) {
  module.hot.accept('./components', () => {
    try {
      whenDOMReady.then(init);
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
