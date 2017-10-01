import { h, Component } from 'preact';
import markdown from 'marked';

module.exports = class Description extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({ content }) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: markdown(content)
        }}
      />
    );
  }
};
