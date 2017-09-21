const { h } = require('preact');
const style = require('./style.css');
const render = ({ message }) => <div className={style.error}>{message}</div>;
module.exports = render;
