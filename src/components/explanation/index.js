const { h, Component } = require('preact');
const style = require('./style.scss');
const cx = require('classnames');
const markdown = require('marked');
const { CSSTransitionGroup } = require('react-transition-group');

module.exports = class Explanation extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({ className, explanations, isCorrect }) {
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
          role="alert"
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
  }
};
