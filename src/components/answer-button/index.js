const { h, Component } = require('preact');
const style = require('./style.scss');
const cn = require('classnames/bind').bind(style);
const Tick = require('../../images/tick.svg.js');
const Cross = require('../../images/cross.svg.js');
const url2cmid = require('@abcnews/url2cmid');

import { CSSTransitionGroup } from 'react-transition-group';

class AnswerButtonImage extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.handleSelect(this.props.id);
  }

  render({ isSelected, isActive, isCorrect, role, label, text, image }) {
    let isDisabled = !isActive;

    let Icon;
    if (isSelected) Icon = Tick;
    if ((isDisabled && isCorrect) || (!!isSelected && isCorrect === null))
      Icon = Tick;
    if (isSelected && isCorrect === false) Icon = Cross;

    let url =
      image && image.match(/abc.net.au/)
        ? `http://www.abc.net.au/news/image/${url2cmid(image)}-3x2-940x627.jpg`
        : image;

    return (
      <li
        role={role}
        aria-selected={isSelected}
        aria-disabled={!isActive}
        onClick={isActive ? this.handleSelect : null}
        className={cn('answer', {
          isSelected,
          isDisabled,
          [style.isCorrect]: isCorrect === true,
          [style.isIncorrect]: isCorrect === false,
          [style.image]: !!image
        })}
      >
        {image ? (
          <div className={style.imageContainer}>
            <img src={url} />
          </div>
        ) : null}
        <div className={style.text}>
          <span className={cn('answerLabel')}>{label + ' '}</span>
          <span className={cn('answerText')}>{text}</span>
          {Icon ? <Icon ariaHidden={isActive} className={style.icon} /> : null}
        </div>
      </li>
    );
  }
}

module.exports = AnswerButtonImage;
