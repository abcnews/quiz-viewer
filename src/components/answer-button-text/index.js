const { h, Component } = require('preact');
const style = require('./style.scss');
const cn = require('classnames/bind').bind(style);

class AnswerButtonText extends Component {
  componentWillMount() {
    this.setState({ isSelected: false });
  }

  handleSelect(e) {
    let { selectAnswer, deselectAnswer, answer } = this.props;
    let isSelected = !this.state.isSelected;

    if (isSelected) {
      selectAnswer && selectAnswer(answer);
    } else {
      deselectAnswer && deselectAnswer(answer);
    }

    this.setState({ isSelected });
  }

  render() {
    let { isActive, isCorrect } = this.props;
    let isDisabled = !isActive;
    let { text, label } = this.props.answer;
    let isSelected = this.state.isSelected;

    return (
      <div
        onClick={isActive ? this.handleSelect.bind(this) : null}
        className={cn('answer', { isSelected, isDisabled, isCorrect })}
        title={text}
      >
        <span className={cn('answerLabel')}>{label}</span>{' '}
        <span className={cn('answerText')}>{text}</span>
      </div>
    );
  }
}

module.exports = AnswerButtonText;
