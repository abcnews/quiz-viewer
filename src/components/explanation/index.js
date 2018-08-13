const { h, Component } = require('preact');
const style = require('./style.scss');
const cx = require('classnames');
const markdown = require('marked');

module.exports = class Explanation extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({ className, explanations, isCorrect }) {
    if (explanations.join('').trim().length === 0) return null;
    return (
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
    );
  }
};
