const { h, Component } = require('preact');
const style = require('./style.scss');
const Question = require('../question');

// Should this 'question' type be counted as a question for the purposes of results
const isQuestion = definition =>
  ['multipleChoiceSimple'].indexOf(definition.type) > -1;

class Quiz extends Component {
  componentDidMount() {
    // Initialise results data
    this.responses = new Map();
    this.props.definition.questions.filter(isQuestion).forEach((q, i) => {
      this.responses.set(q, {
        type: q.type,
        value: q.value,
        index: i,
        score: 0
      });
    });

    this.results = {
      answered: 0,
      remaining: this.responses.size,
      completed: false,
      score: 0,
      responses: Array.from(this.responses.values())
    };

    this.setState({
      currentScore: 0,
      availableScoreAnswered: 0,
      remainingQuestionCount: this.results.remaining
    });
  }

  handleAnswer(question) {
    let answer = question.answers.find(a => a.selected);
    let response = this.responses.get(question);
    response.response = { label: answer.label, text: answer.text };
    response.score = answer.value;
    this.results.answered++;
    this.results.remaining--;
    this.results.completed = this.results.remaining === 0;
    this.results.score += answer.value;

    this.props.handleResults(this.results);

    this.setState({
      remainingQuestionCount: this.results.remaining,
      currentScore: (this.state.currentScore += response.score),
      availableScoreAnswered: (this.state.availableScoreAnswered +=
        response.value)
    });
  }

  render() {
    let { questions } = this.props.definition;

    return (
      <div>
        <div className={style.status}>
          <div className={style.panel}>
            <h3 className={style.title}>Score</h3>
            <p className={style.score}>
              {this.state.currentScore} / {this.state.availableScoreAnswered}
            </p>
            <p className={style.remainingQuestions}>
              {this.state.remainingQuestionCount ? (
                `${this.state.remainingQuestionCount} question${this.state
                  .remainingQuestionCount === 1
                  ? ''
                  : 's'} remaining`
              ) : (
                `Finished!`
              )}
            </p>
          </div>
          <div className={style.share} />
        </div>
        <div className={style.questions}>
          {questions.map(q => (
            <Question
              handleAnswer={this.handleAnswer.bind(this)}
              question={q}
            />
          ))}
        </div>
      </div>
    );
  }
}

module.exports = Quiz;
