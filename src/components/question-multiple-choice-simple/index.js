const { h, Component } = require('preact');
const style = require('./style.scss');
const markdown = require('marked');
const cn = require('classnames/bind').bind(style);
const labels = 'abcdefghijklmnopqrstuvwxyz'.split('');
const AnswerButtonText = require('../answer-button-text');
const Explanation = require('../explanation');

class MultipleChoiceSimple extends Component {
  constructor() {
    super();
    this.handleAnswer = this.handleAnswer.bind(this);
  }
  componentWillMount() {
    // Give each of the answers a persistent label.
    this.props.question.answers.forEach((a, i) => {
      a.label = labels[i];
      a.correct = a.value >= this.props.question.value;
    });
  }

  handleAnswer(id) {
    let response = this.props.question.answers[id];
    this.setState({
      response,
      result:
        response.value >= this.props.question.value ? 'correct' : 'incorrect'
    });

    // TODO: Let the quiz know this question has been answered.
  }

  render({ question }, { response, result }) {
    let isActive = !response;
    let { description, answers, explanation } = question;
    let questionText = question.question;

    return (
      <div className={style.question}>
        <h2>{questionText}</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: markdown(description)
          }}
        />
        <div>
          {answers.map((answer, i) => (
            <AnswerButtonText
              id={i}
              label={answer.label}
              text={answer.text}
              isActive={!response}
              isSelected={answer === response}
              isCorrect={!isActive && answer.correct}
              handleSelect={this.handleAnswer}
              answer={answer}
            />
          ))}
        </div>
        {response ? (
          <Explanation
            result={result}
            answerExplanation={response.explanation}
            questionExplanation={explanation}
          />
        ) : null}
      </div>
    );
  }
}

module.exports = MultipleChoiceSimple;
