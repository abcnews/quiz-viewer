const { h, Component } = require('preact');
const style = require('./style.scss');
const firebase = require('firebase');
const uuid = require('uuid/v1');
const logErr = require('@abcnews/err')('quiz-viewer');
const ErrorBox = require('./error-public');

// Quiz types
const Quiz = require('./quiz');
const Survey = require('./survey');

// Quiz types map
const components = {
  quiz: Quiz,
  survey: Survey
};

class App extends Component {
  constructor() {
    super();
    this.handleResults = this.handleResults.bind(this);
  }

  componentWillMount() {
    this.hostname = document.location.hostname;
    this.isProduction = !!this.hostname.match(/^(www|mobile).abc.net.au$/);
    this.quizId = this.props.id;
    this.session = localStorage.getItem(`abc-quiz-${this.quizId}`) || uuid();
    localStorage.setItem(`abc-quiz-${this.quizId}`, this.session);
    this.db = (firebase.apps[0] ||
      firebase.initializeApp({
        databaseURL: 'https://abc-quiz.firebaseio.com'
      })
    )
      .database()
      .ref(
        `/responses/${this.quizId.replace('.', '-')}${this.isProduction
          ? ''
          : '-preview'}`
      );
  }

  componentDidMount() {
    const dataUrl = `http://www.abc.net.au/dat/news/interactives/quizzes/quiz-${this
      .quizId}${this.isProduction ? '' : '-preview'}.json${this.isProduction
      ? ''
      : '?cb' + Math.random()}`;

    fetch(dataUrl)
      .then(res => res.json())
      .then(definition => {
        this.setState({ definition });
      })
      .catch(err => {
        logErr(err);
        this.setState({ err: err });
      });
  }

  handleResults(results) {
    if (this.responseId) {
      this.db.child(this.responseId).update(results);
    } else {
      results.session = this.session;
      this.responseId = this.db.push(results).key;
    }
  }

  render(_, { definition, err }) {
    if (err) {
      return (
        <ErrorBox
          message={`There was an error loading this quiz. Please try again.`}
        />
      );
    }

    if (!definition) return;

    const type = definition ? definition.type : null;
    const QuizType = components[type];

    if (!QuizType) {
      logErr(
        new Error(
          `Quiz type specified in the data file (${type}) is not defined.`
        )
      );
      return (
        <ErrorBox
          message={`There was an error loading this quiz. Please try again.`}
        />
      );
    }

    return (
      <QuizType handleResults={this.handleResults} definition={definition} />
    );
  }
}

module.exports = App;
