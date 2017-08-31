/*
 * Save results of a quiz to firebase.
 */

var Firebase;

Firebase = require('firebase');

module.exports = function(quiz, data, response) {
  var root;
  root = new Firebase('https://abc-quiz.firebaseio.com/');
  root = root.child(
    ('responses/' + quiz).replace('.', '-') +
      (document.location.hostname === 'www.abc.net.au' ||
      document.location.hostname === 'mobile.abc.net.au'
        ? ''
        : '-preview')
  );
  if (response) {
    root.child(response).set(data);
    return response;
  } else {
    return root.push(data).key();
  }
};
