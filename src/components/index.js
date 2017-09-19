const { h, Component } = require('preact');
const style = require('./style.scss');
const url2cmid = require('@abcnews/url2cmid');
const firebase = require('firebase');
const uuid = require('uuid/v1');

// Quiz types
const Quiz = require('./quiz');
const Survey = require('./survey');

// Quiz types map
const components = {
  quiz: Quiz,
  survey: Survey
};

class App extends Component {
  componentWillMount() {
    this.hostname = document.location.hostname;
    this.isProduction = !!this.hostname.match(/^(www|mobile).abc.net.au$/);
    this.quizId = this.props.config.quizId || url2cmid(window.location.href);
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
        console.error(err);
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

  render() {
    if (!this.state.definition) return;

    const type = this.state.definition.type;
    const QuizType = components[type];

    if (!QuizType) {
      console.error(
        `Quiz type specified in the data file (${type}) is not defined.`
      );
      return (
        <div className={style.error}>
          <p>{`There was an error loading this quiz. Please try again.`}</p>
        </div>
      );
    }

    return (
      <QuizType
        handleResults={this.handleResults.bind(this)}
        definition={this.state.definition}
      />
    );
  }
}

module.exports = App;
