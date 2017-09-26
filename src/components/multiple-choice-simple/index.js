import { h, Component } from 'preact';
import style from './style.scss';
import markdown from 'marked';
import classnames from 'classnames/bind';
import AnswerButton from '../answer-button';
import Explanation from '../explanation';

const cn = classnames.bind(style);
const labels = 'abcdefghijklmnopqrstuvwxyz'.split('');

class MultipleChoiceSimple extends Component {
  constructor() {
    super();
    this.handleAnswer = this.handleAnswer.bind(this);
    this.finaliseAnswer = this.finaliseAnswer.bind(this);
  }
  componentWillMount() {
    const { question } = this.props;

    // Define a local copy of the answers to this question so we can keep props immutable.
    this.answers = new Map(
      question.answers.map((a, i) => {
        let id = a.id || i; // TODO: remove this after quiz-editor properly adds guids to each answer.
        let label = labels[i];
        let isCorrect =
          question.type === 'multipleChoiceMultipleSelection'
            ? a.value >=
              this.props.question.value /
                question.answers.filter(a => a.value > 0).length
            : a.value >= this.props.question.value;
        return [
          id,
          Object.assign({}, a, {
            id,
            label,
            isCorrect
          })
        ];
      })
    );

    this.setState({ answers: Array.from(this.answers.values()) });
  }

  handleAnswer(answerId) {
    const answer = this.answers.get(answerId);
    const { type } = this.props.question;

    if (type === 'multipleChoiceMultipleSelection') {
      answer.isSelected = !answer.isSelected; // Toggle state
    } else {
      for (let [key, answer] of this.answers) {
        answer.isSelected = key === answerId; // Select just the one
      }
    }

    this.setState({ answers: this.state.answers });

    if (!this.props.confirmAnswer) {
      this.finaliseAnswer();
    }
  }

  finaliseAnswer() {
    const { id, type, value } = this.props.question;
    const { answers } = this.state;
    const selected = answers.filter(a => a.isSelected);
    const score = selected.reduce((t, a) => t + a.value, 0);
    const responses = selected.map(a => a.id);

    // Pass response data back to quiz for recording.
    this.props.handleResponse(
      Object.assign({}, { id, type, value, score, responses })
    );

    this.setState({ selected, isCorrect: score >= value });
  }

  render(
    { question, className, confirmAnswer, displayResult },
    { answers, selected, isCorrect }
  ) {
    let { description, explanation } = question;
    let questionText = question.question;

    return (
      <div
        className={cn(className, style.question, {
          [style.confirmAnswer]: confirmAnswer
        })}
      >
        <h2>{questionText}</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: markdown(description)
          }}
        />
        <div className={style.answers}>
          {answers.map(answer => (
            <AnswerButton
              id={answer.id}
              label={answer.label}
              text={answer.text}
              image={answer.image}
              isActive={!selected}
              isSelected={answer.isSelected}
              isCorrect={displayResult ? selected && answer.isCorrect : null}
              handleSelect={selected ? null : this.handleAnswer}
            />
          ))}
        </div>

        {confirmAnswer ? (
          <button
            className={`${style.btn} ${style.btnFilled}`}
            disabled={!!selected}
            onClick={this.finaliseAnswer}
          >
            Submit
          </button>
        ) : null}

        {selected ? (
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
