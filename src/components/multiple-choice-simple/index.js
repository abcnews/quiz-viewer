import { h, Component } from 'preact';
import style from './style.scss';
import markdown from 'marked';
import classnames from 'classnames/bind';
import AnswerButtonText from '../answer-button-text';
import AnswerButtonImage from '../answer-button-image';
import Explanation from '../explanation';

const cn = classnames.bind(style);
const labels = 'abcdefghijklmnopqrstuvwxyz'.split('');
const answerComponentMap = {
  multipleChoiceSimple: AnswerButtonText,
  multipleChoiceImage: AnswerButtonImage
};

class MultipleChoiceSimple extends Component {
  constructor() {
    super();
    this.handleAnswer = this.handleAnswer.bind(this);
  }
  componentWillMount() {
    const { question } = this.props;

    // Define a local copy of the answers to this question so we can keep props immutable.
    this.answers = new Map(
      question.answers.map((a, i) => {
        let id = a.id || i; // TODO: remove this after quiz-editor properly adds guids to each answer.
        let label = labels[i];
        let isCorrect = a.value >= this.props.question.value;
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
    const response = this.answers.get(answerId);
    const { id, type, value } = this.props.question;
    const score = response.value;
    // Pass response data back to quiz for recording.
    this.props.handleResponse(
      Object.assign({}, { id, type, value, score, response: response.id })
    );

    // Set the response state
    this.setState({ response });
  }

  render({ question, className }, { response, answers }) {
    let isActive = !response;
    let { description, explanation } = question;
    let questionText = question.question;
    let AnswerButton = answerComponentMap[question.type];

    return (
      <div className={cn(className, style.question)}>
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
              isActive={!response}
              isSelected={answer === response}
              isCorrect={!isActive && answer.isCorrect}
              handleSelect={this.handleAnswer}
            />
          ))}
        </div>

        {response ? (
          <Explanation
            isCorrect={response.isCorrect}
            answerExplanation={response.explanation}
            questionExplanation={explanation}
          />
        ) : null}
      </div>
    );
  }
}

module.exports = MultipleChoiceSimple;
