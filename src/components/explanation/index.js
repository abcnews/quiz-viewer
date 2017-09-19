import { h } from 'preact';
import style from './style.scss';
import cx from 'classnames';
import markdown from 'marked';
import { CSSTransitionGroup } from 'react-transition-group';

module.exports = ({
  className,
  questionExplanation,
  answerExplanation,
  isCorrect
}) => {
  return (
    <CSSTransitionGroup
      transitionAppear={true}
      transitionAppearTimeout={1000}
      transitionEnter={false}
      transitionLeave={false}
      transitionName={{
        appear: style.appear,
        appearActive: style.appearActive
      }}
    >
      <div
        key={questionExplanation + answerExplanation}
        className={cx(style.explanation, className, {
          [style.correct]: isCorrect === true,
          [style.incorrect]: isCorrect === false
        })}
        dangerouslySetInnerHTML={{
          __html:
            markdown(answerExplanation || '') +
            markdown(questionExplanation || '')
        }}
      />
    </CSSTransitionGroup>
  );
};
