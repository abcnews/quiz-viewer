const { h, Component } = require('preact');
const markdown = require('marked');

class Note extends Component {
  render() {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: markdown(this.props.question.note)
        }}
      />
    );
  }
}

module.exports = Note;
