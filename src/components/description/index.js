import { h, Component } from 'preact';
import markdown from 'marked';
import style from './style.scss';

module.exports = class Description extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({ content }) {
    return (
      <div
        className={style.description}
        dangerouslySetInnerHTML={{
          __html: markdown(content)
        }}
      />
    );
  }
};
