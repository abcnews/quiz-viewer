const { h, Component } = require('preact');
const style = require('./style.scss');
const cn = require('classnames/bind').bind(style);
const Tick = require('!desvg-loader/preact!svg-loader!../../images/tick.svg');
const Cross = require('!desvg-loader/preact!svg-loader!../../images/cross.svg');

class AnswerButtonText extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.handleSelect(this.props.id);
  }

  render({ isSelected, isActive, isCorrect, label, text }) {
    let isDisabled = !isActive;

    return (
      <button
        disabled={!isActive}
        onClick={isActive ? this.handleSelect : null}
        className={cn('answer', { isSelected, isDisabled, isCorrect })}
        title={text}
      >
        <span className={cn('answerLabel')}>{label}</span>
        <span className={cn('answerText')}>{text}</span>
        {isDisabled & isCorrect ? <Tick /> : null}
        {isDisabled & isSelected & !isCorrect ? <Cross /> : null}
      </button>
    );
  }
}

module.exports = AnswerButtonText;
