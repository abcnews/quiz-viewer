const { h, Component } = require('preact');
const style = require('./style.scss');
const cx = require('classnames');
const Explanation = require('../explanation');
const Description = require('../description');
const { filterExplanations } = require('../../utils');

const Tick = require('../../images/tick.svg.js');

class RangeChoice extends Component {
  constructor() {
    super();
    this.handleInteraction = this.handleInteraction.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
  }

  componentDidMount() {
    const { min, max } = this.props.question;
    this.setState({
      response: Math.round((max - min) / 2)
    });
  }

  handleAnswer(answerId) {
    const {
      id,
      type,
      value,
      answer,
      lenience,
      explanations
    } = this.props.question;
    const { response } = this.state;

    const score =
      lenience > 0
        ? value *
          (1 - Math.min(lenience, Math.abs(answer - response)) / lenience)
        : response === answer ? value : 0;

    // Pass response data back to quiz for recording.
    this.props.handleResponse(
      Object.assign({}, { id, type, value, score, response })
    );

    this.setState({
      finalised: true,
      isCorrect: score >= value,
      explanations: explanations
        .filter(filterExplanations(score))
        .map(d => d.text)
    });
  }

  handleInteraction(e) {
    let { prefix, suffix } = this.props.question;
    let response = e.target.value;
    this.setState({
      response,
      interacted: true,
      answerText: prefix + response + suffix
    });
  }

  render(
    { question, className, confirmAnswer, displayResult },
    {
      answers,
      isCorrect,
      answerText,
      response,
      finalised,
      interacted,
      explanations
    }
  ) {
    let { description, answer, min, max, step, prefix, suffix } = question;
    let questionText = question.question;

    return (
      <div className={cx(className)}>
        <h2>{questionText}</h2>
        {description ? <Description content={description} /> : null}
        <div className={cx(style.answer)}>
          <span
            style={`left: ${(response - 1) / (max - min) * 100}%`}
            aria-hidden={interacted ? true : false}
            className={cx(style.answerText)}
          >
            {answerText || 'Answer using the slider below'}
          </span>
          <span
            style={`left: ${((finalised ? answer : response) - 1) /
              (max - min) *
              100}%; opacity: ${finalised ? '1' : '0'};`}
            className={cx(style.answerText, style.answerCorrect)}
          >
            {finalised ? answer : null}
          </span>
        </div>
        <div className={cx(style.control)}>
          <input
            aria-valuemin={min}
            aria-valuemax={max}
            onMouseDown={this.handleInteraction}
            onTouchStart={this.handleInteraction}
            onInput={this.handleInteraction}
            onChange={this.handleInteraction}
            className={cx(style.input)}
            type="range"
            disabled={finalised}
            value={response}
            min={min}
            max={max}
            step={step}
          />
          <div aria-hidden="true" className={cx(style.min)}>
            {prefix}
            {min}
            {suffix}
          </div>
          <div aria-hidden="true" className={cx(style.max)}>
            {prefix}
            {max}
            {suffix}
          </div>
        </div>
        <button
          disabled={finalised || !interacted}
          onClick={finalised ? null : this.handleAnswer}
          className={cx(style.btn, style.btnFilled)}
        >
          Submit
        </button>
        {finalised ? (
          <Explanation
            isCorrect={displayResult ? isCorrect : null}
            explanations={explanations}
          />
        ) : null}
      </div>
    );
  }
}

module.exports = RangeChoice;
