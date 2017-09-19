const { h, Component } = require('preact');
const style = require('./style.scss');
const Question = require('../question');
const Panel = require('../panel');
const Share = require('!desvg-loader/preact!svg-loader!../../images/share.svg');

// Should this 'question' type be counted as a question for the purposes of results
const isQuestion = definition =>
  ['multipleChoiceSimple', 'multipleChoiceImage'].indexOf(definition.type) > -1;

class Quiz extends Component {
  constructor() {
    super();
    this.handleShare = this.handleShare.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentWillMount() {
    const questions = this.props.definition.questions;
    const totalQuestions = questions.filter(isQuestion).length;

    // Define a local copy of the questions so we can keep props immutable.
    this.questions = new Map(
      questions.map((question, i) => {
        let id = question.id || i;
        return [id, Object.assign({}, question)];
      })
    );

    // Initialise results data
    this.responses = new Map();

    this.results = {
      answered: 0,
      remaining: this.responses.size,
      completed: false,
      score: 0,
      responses: Array.from(this.responses.values())
    };

    this.setState({
      questions: Array.from(this.questions.values()),
      totalQuestions,
      currentScore: 0,
      availableScore: 0,
      remainingQuestions: totalQuestions
    });
  }

  handleShare(e) {
    e.preventDefault();
    ABC.News.shareTools.show({
      $target: $(e.target)
    });
  }

  // Handle a response object passed back from a question component.
  handleResponse(response) {
    this.responses.set(response.id, response);

    let {
      totalQuestions,
      currentScore,
      availableScore,
      remainingQuestions
    } = this.state;

    remainingQuestions--;
    currentScore += response.score;
    availableScore += response.value;

    this.setState({ currentScore, availableScore, remainingQuestions });

    const results = {
      answered: this.responses.size,
      remaining: remainingQuestions,
      completed: remainingQuestions === 0,
      score: currentScore,
      responses: this.resultsObjectFromMap(this.responses)
    };

    this.props.handleResults(results);
  }

  resultsObjectFromMap(responses) {
    const obj = Object(null);
    for (let [key, value] of responses) {
      const { id, ...result } = value;
      obj[id] = result;
    }
    return obj;
  }

  render(
    props,
    {
      questions,
      totalQuestions,
      remainingQuestions,
      currentScore,
      availableScore
    }
  ) {
    return (
      <div className={style.quiz}>
        <div className={style.status}>
          <Panel>
            <h3 className={style.title}>Your score</h3>
            <p className={style.score}>
              {currentScore} / {availableScore}
            </p>
            <p className={style.remaining}>
              {remainingQuestions
                ? `${remainingQuestions} question${remainingQuestions === 1
                    ? ''
                    : 's'} remaining`
                : `Finished!`}
            </p>

            <button className={style.share} onClick={this.handleShare}>
              <Share />Share quiz
            </button>
          </Panel>
        </div>
        <div className={style.questions}>
          {questions.map(q => (
            <Question handleResponse={this.handleResponse} question={q} />
          ))}
        </div>
      </div>
    );
  }
}

module.exports = Quiz;
