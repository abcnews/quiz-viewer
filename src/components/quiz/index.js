const { h, Component } = require('preact');
const style = require('./style.scss');
const Question = require('../question');
const Panel = require('../panel');
const Explanation = require('../explanation');
const Share = require('!desvg-loader/preact!svg-loader!../../images/share.svg');
const { filterExplanations } = require('../../utils');

// Should this 'question' type be counted as a question for the purposes of results
const isQuestion = definition =>
  [
    'multipleChoiceSimple',
    'multipleChoiceImage',
    'multipleChoiceMultipleSelection',
    'rangeChoice'
  ].indexOf(definition.type) > -1;

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

    let scoreDifference = false;
    let explanations;

    if (remainingQuestions === 0) {
      const { aggregatedResults: { aggregate } } = this.props;

      if (aggregate) {
        const averageResult = aggregate.totalScore / aggregate.availableScore;
        const result = currentScore / availableScore;
        const difference = averageResult - result;
        const rounded = Math.round(Math.abs(difference * 100));

        scoreDifference =
          rounded === 0
            ? 'exactly average'
            : `${rounded}% ${difference > 0 ? 'worse' : 'better'} than average`;
      }

      // Explanations
      explanations = this.props.definition.explanation
        .filter(filterExplanations(currentScore))
        .map(d => d.text);
    }

    this.setState({
      currentScore,
      availableScore,
      remainingQuestions,
      scoreDifference,
      explanations
    });

    const results = {
      answered: this.responses.size,
      remaining: remainingQuestions,
      completed: remainingQuestions === 0,
      score: currentScore,
      value: availableScore,
      responses: this.resultsObject()
    };

    this.props.handleResults(results);
  }

  resultsObject() {
    const obj = Object(null);
    for (let [key, value] of this.responses) {
      const { id, ...result } = value;
      obj[id] = result;
    }
    return obj;
  }

  render(
    _,
    {
      questions,
      totalQuestions,
      remainingQuestions,
      currentScore,
      availableScore,
      scoreDifference,
      explanations
    }
  ) {
    return (
      <div className={style.quiz} role="region">
        <div className={style.questions}>
          {questions.map(q => (
            <Question
              displayResult={true}
              confirmAnswer={q.type === 'multipleChoiceMultipleSelection'}
              handleResponse={this.handleResponse}
              question={q}
            />
          ))}
          {explanations ? (
            <Panel>
              <Explanation
                className={style.explanation}
                explanations={explanations}
              />
            </Panel>
          ) : null}
        </div>
        <div className={style.status}>
          <Panel>
            <div role="status" aria-live="polite">
              <span className={style.title}>
                {remainingQuestions ? 'Your score' : 'Final score'}
              </span>
              <span className={style.score}>
                {round(currentScore, 2)} / {availableScore}
              </span>
              <span className={style.remaining}>
                {remainingQuestions
                  ? `${remainingQuestions} question${remainingQuestions === 1
                      ? ''
                      : 's'} left`
                  : null}
              </span>

              {scoreDifference ? (
                <span>
                  ... (or {Math.round(currentScore / availableScore * 100)}%)
                  which is {scoreDifference}.
                </span>
              ) : null}
            </div>
            <button className={style.share} onClick={this.handleShare}>
              <Share />Share quiz
            </button>
          </Panel>
        </div>
      </div>
    );
  }
}

module.exports = Quiz;

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
