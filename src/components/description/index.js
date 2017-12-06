const { h, Component } = require('preact');
const markdown = require('marked');
const style = require('./style.scss');

module.exports = class Description extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({ content, id }) {
    return (
      <div
        id={`desc${id}`}
        className={style.description}
        dangerouslySetInnerHTML={{
          __html: markdown(content)
        }}
      />
    );
  }
};
