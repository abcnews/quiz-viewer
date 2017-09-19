const { h, Component } = require('preact');
const style = require('./style.scss');
const cn = require('classnames/bind').bind(style);
const Tick = require('!desvg-loader/preact!svg-loader!../../images/tick.svg');
const Cross = require('!desvg-loader/preact!svg-loader!../../images/cross.svg');
const url2cmid = require('@abcnews/url2cmid');

class AnswerButtonImage extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.handleSelect(this.props.id);
  }

  render({ isSelected, isActive, isCorrect, label, text, image }) {
    let isDisabled = !isActive;
    let url = image.match(/abc.net.au/)
      ? `http://www.abc.net.au/news/image/${url2cmid(image)}-3x2-940x627.jpg`
      : image;
    return (
      <button
        disabled={!isActive}
        onClick={isActive ? this.handleSelect : null}
        className={cn('answer', { isSelected, isDisabled, isCorrect })}
        title={text}
      >
        <img src={url} />
        <div className={style.text}>
          <span className={cn('answerLabel')}>{label}</span>
          <span className={cn('answerText')}>{text}</span>
          {isDisabled & isCorrect ? <Tick /> : null}
          {isDisabled & isSelected & !isCorrect ? <Cross /> : null}
        </div>
      </button>
    );
  }
}

module.exports = AnswerButtonImage;
