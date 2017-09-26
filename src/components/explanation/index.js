import { h } from 'preact';
import style from './style.scss';
import cx from 'classnames';
import markdown from 'marked';
import { CSSTransitionGroup } from 'react-transition-group';

module.exports = ({ className, explanations, isCorrect }) => {
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
        key="key"
        className={cx(
          style.explanation,
          {
            [style.correct]: isCorrect === true,
            [style.incorrect]: isCorrect === false
          },
          className
        )}
        dangerouslySetInnerHTML={{
          __html: markdown(explanations.join('\n\n'))
        }}
      />
    </CSSTransitionGroup>
  );
};
