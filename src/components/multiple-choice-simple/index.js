const { h, Component } = require('preact');
const style = require('./style.scss');
const cx = require('classnames');
const AnswerButton = require('../answer-button');
const Explanation = require('../explanation');
const Description = require('../description');

const labels = 'abcdefghijklmnopqrstuvwxyz'.split('');

class MultipleChoiceSimple extends Component {
  constructor() {
    super();
    this.handleAnswer = this.handleAnswer.bind(this);
    this.finaliseAnswer = this.finaliseAnswer.bind(this);
  }
  componentWillMount() {
    const { question } = this.props;
    let answers = [];

    // Define a local copy of the answers to this question so we can keep props immutable.
    this.answers = (question.answers || []).reduce((m, a, i) => {
      let id = a.id || i; // TODO: remove this after quiz-editor properly adds guids to each answer.
      let label = labels[i];
      let isCorrect =
        question.type === 'multipleChoiceMultipleSelection'
          ? a.value >=
            this.props.question.value /
              question.answers.filter(a => a.value > 0).length
          : a.value >= this.props.question.value;

      m[id] = Object.assign({}, a, {
        id,
        label,
        isCorrect
      });
      answers.push(m[id]);
      return m;
    }, {});

    this.setState({ selected: [], answers });
  }

  handleAnswer(answerId) {
    const answer = this.answers[answerId];
    const { type, maxSelections } = this.props.question;
    const { answers, selected } = this.state;

    if (type === 'multipleChoiceMultipleSelection') {
      answer.isSelected = !answer.isSelected; // Toggle state
      if (answer.isSelected) {
        selected.push(answer);
      } else {
        selected.splice(selected.indexOf(answer), 1);
      }

      // Make sure we don't select more than allowed.
      if (maxSelections > 0) {
        while (selected.length > maxSelections) {
          selected.shift().isSelected = false;
        }
      }
    } else {
      for (let key in this.answers) {
        let answer = this.answers[key];
        answer.isSelected = key === answerId; // Select just the one
        answer.isSelected && selected.push(answer);
      }
    }

    this.setState({ answers: this.state.answers, selected });

    if (!this.props.confirmAnswer) {
      this.finaliseAnswer();
    }
  }

  finaliseAnswer() {
    const { id, type, value } = this.props.question;
    const { answers, selected } = this.state;
    const score = selected.reduce((t, a) => t + a.value, 0);
    const responses = selected.map(a => a.id);

    // Pass response data back to quiz for recording.
    this.props.handleResponse(
      Object.assign({}, { id, type, value, score, responses })
    );

    this.setState({ selected, isCorrect: score >= value, finalised: true });
  }

  render(
    { question, className, confirmAnswer, displayResult },
    { answers, selected, isCorrect, finalised }
  ) {
    let { description, explanation, type, id } = question;
    let questionText = question.question;

    return (
      <div
        className={cx(className, {
          [style.confirmAnswer]: confirmAnswer
        })}
      >
        <h2 id={`lbl${id}`}>{questionText}</h2>
        {description ? <Description id={id} content={description} /> : null}
        <ul
          className={style.answers}
          role="group"
          aria-labelledby={`lbl${id}`}
          style={
            !!window.MSInputMethodContext && !!document.documentMode
              ? 'height: 1%;'
              : null
          }
        >
          {answers.map(answer => (
            <AnswerButton
              id={answer.id}
              role="checkbox"
              label={answer.label}
              text={answer.text}
              image={answer.image}
              imageAlt={answer.imageAlt}
              isActive={!finalised}
              isSelected={answer.isSelected}
              isCorrect={displayResult ? finalised && answer.isCorrect : null}
              handleSelect={finalised ? null : this.handleAnswer}
            />
          ))}
        </ul>

        {confirmAnswer ? (
          <button
            className={`${style.btn} ${style.btnFilled}`}
            disabled={!!finalised}
            onClick={this.finaliseAnswer}
          >
            Submit
          </button>
        ) : null}

        {finalised ? (
          <Explanation
            isCorrect={displayResult ? isCorrect : null}
            explanations={selected
              .map(r => r.explanation)
              .concat([explanation])}
          />
        ) : null}
      </div>
    );
  }
}

module.exports = MultipleChoiceSimple;
