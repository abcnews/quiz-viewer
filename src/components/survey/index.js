const { h, Component } = require('preact');
const style = require('./style.scss');
const Question = require('../question');
const Panel = require('../panel');
const Share = require('../../images/share.svg.js');
const Explanation = require('../explanation');
const { filterExplanations } = require('../../utils');

// Should this 'question' type be counted as a question for the purposes of results
const isQuestion = definition =>
  [
    'multipleChoiceSimple',
    'multipleChoiceImage',
    'multipleChoiceMultipleSelection'
  ].indexOf(definition.type) > -1;

class Survey extends Component {
  constructor() {
    super();
    this.handleShare = this.handleShare.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentWillMount() {
    const questions = this.props.definition.questions;
    const totalQuestions = questions.filter(isQuestion).length;

    // Initialise results data
    this.responses = {};

    this.setState({
      questions: questions.map((question, i) => {
        let id = question.id || i;
        return Object.assign({}, question);
      }),
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
    this.responses[response.id] = response;

    let {
      totalQuestions,
      currentScore,
      availableScore,
      remainingQuestions
    } = this.state;

    remainingQuestions--;
    currentScore += response.score;
    availableScore += response.value;

    let explanations;

    if (remainingQuestions === 0) {
      // Explanations
      explanations = this.props.definition.explanation
        .filter(filterExplanations(currentScore))
        .map(d => d.text);
    }

    this.setState({
      currentScore,
      availableScore,
      remainingQuestions,
      explanations
    });

    const results = {
      answered: Object.keys(this.responses).length,
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
    for (let key in this.responses) {
      const value = this.responses[key];
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
      <div className={style.quiz}>
        <div className={style.status}>
          <Panel>
            <span className={style.remaining}>
              {remainingQuestions
                ? `${remainingQuestions} question${
                    remainingQuestions === 1 ? '' : 's'
                  } left`
                : 'Survey complete'}
            </span>

            <button className={style.share} onClick={this.handleShare}>
              <Share />Share
            </button>
          </Panel>
        </div>
        <div className={style.questions}>
          {questions.map(q => (
            <Question
              confirmAnswer={true}
              displayResult={false}
              handleResponse={this.handleResponse}
              question={q}
            />
          ))}
          {explanations && explanations.length ? (
            <Panel>
              <Explanation
                className={style.explanation}
                explanations={explanations}
              />
            </Panel>
          ) : null}
        </div>
      </div>
    );
  }
}

module.exports = Survey;
