const { h } = require('preact');
const style = require('./style.scss');
const cx = require('classnames');
const markdown = require('marked');

module.exports = ({
  className,
  questionExplanation,
  answerExplanation,
  result
}) => {
  return (
    <div
      className={cx(style.explanation, className, style[result])}
      dangerouslySetInnerHTML={{
        __html:
          markdown(answerExplanation || '') +
          markdown(questionExplanation || '')
      }}
    />
  );
};
