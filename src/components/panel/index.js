const { h } = require('preact');
const style = require('./style.scss');
const cx = require('classnames/bind').bind(style);

module.exports = ({ children, className }) => {
  return <div className={cx(style.panel, className)}>{children}</div>;
};
