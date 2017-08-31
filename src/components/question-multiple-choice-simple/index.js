const { h, Component } = require('preact');
const style = require('./style.scss');
const markdown = require('marked');
const cn = require('classnames/bind').bind(style);
const labels = 'abcdefghijklmnopqrstuvwxyz'.split('');
const AnswerButtonText = require('../answer-button-text');

class MultipleChoiceSimple extends Component {
  componentWillMount() {
    // Give each of the answers a persistent label.
    this.props.question.answers.forEach((a, i) => {
      a.label = labels[i];
      a.selected = false;
      a.correct = a.value >= this.props.question.value;
    });
    this.setState({
      selectedAnswer: null
    });
  }

  handleAnswer(answer) {
    this.setState({
      selectedAnswer: answer
    });
    this.props.question.answers.forEach(a => {
      a.selected = a === answer;
    });
    this.props.handleAnswer(this.props.question);
  }

  render() {
    let isActive = !this.state.selectedAnswer;
    let { question, description, answers, explanation } = this.props.question;

    let explanationHtml = isActive ? null : (
      <div
        dangerouslySetInnerHTML={{
          __html:
            markdown(this.state.selectedAnswer.explanation || '') +
            markdown(explanation || '')
        }}
      />
    );

    return (
      <div className={style.question}>
        <h2>{question}</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: markdown(description)
          }}
        />
        <div>
          {answers.map(answer => (
            <AnswerButtonText
              isActive={isActive}
              isSelected={answer.selected}
              isCorrect={!isActive && answer.correct}
              selectAnswer={this.handleAnswer.bind(this)}
              answer={answer}
            />
          ))}
        </div>
        {explanationHtml}
      </div>
    );
  }
}

module.exports = MultipleChoiceSimple;
