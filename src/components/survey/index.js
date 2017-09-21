const { h, Component } = require('preact');
const Question = require('../question');
const logErr = require('@abcnews/err')('quiz-viewer');

// Should this 'question' type be counted as a question for the purposes of results
const isQuestion = definition =>
  ['multipleChoiceSimple'].indexOf(definition.type) > -1;

class Survey extends Component {
  componentWillMount() {
    this.id = this.props.config.quizId || url2cmid(window.location.href);
  }

  getAnsweredQuestionCount() {
    return this.state.definition.questions.filter(function(q) {
      return q.isQuestion() && q.isAnswered();
    }).length;
  }

  componentDidMount() {
    const hostname = document.location.hostname;
    const isProduction =
      hostname === 'www.abc.net.au' || hostname === 'mobile.abc.net.au';
    const dataUrl = `http://www.abc.net.au/dat/news/interactives/quizzes/quiz-${this
      .id}${isProduction ? '' : '-preview'}.json${isProduction
      ? ''
      : '?cb' + Math.random()}`;

    fetch(dataUrl)
      .then(res => res.json())
      .then(definition => {
        this.definition = definition;
        this.setState({
          questions: definition.questions,
          currentScore: 0,
          availableScoreAnswered: 0,
          remainingQuestionCount: definition.questions.reduce(
            (total, definition) => (isQuestion(definition) ? ++total : total),
            0
          )
        });
      })
      .catch(err => {
        logErr(err);
        this.setState({ err: err });
      });
  }

  render() {
    if (this.state.err)
      return (
        <div className={style.error}>
          <p>{`There was an error loading this quiz. Please try again.`}</p>
        </div>
      );

    // Return undefined if we don't have the quiz definition yet.
    // TODO: maybe do a loading spinner?
    if (!this.state.questions) return;

    return (
      <div className={style.quiz}>
        <div className={style.status}>
          <div className={style.panel}>
            <h3 className={style.title}>Score</h3>
            <p className={style.score}>
              {this.state.currentScore} / {this.state.availableScoreAnswered}
            </p>
            <p className={style.remainingQuestions}>
              {this.state.remainingQuestionCount
                ? `${this.state.remainingQuestionCount} question${this.state
                    .remainingQuestions === 1
                    ? ''
                    : 's'} remaining`
                : `Finished!`}
            </p>
          </div>
          <div className={style.share} />
        </div>
        <div className={style.questions}>
          {this.state.questions.map(q => <Question question={q} />)}
        </div>
      </div>
    );
  }
}

module.exports = Survey;
