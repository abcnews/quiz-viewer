const { h, Component } = require('preact');

// Specific question type modules
const MultipleChoiceSimple = require('../question-multiple-choice-simple');
const Note = require('../question-note');

// Question types map
const components = {
  note: Note,
  multipleChoiceSimple: MultipleChoiceSimple
};

class Question extends Component {
  render() {
    const type = this.props.question.type;
    const QuestionType = components[type];

    if (!QuestionType) {
      console.error(
        `Question type specified in the data file (${type}) is not defined.`
      );
      return (
        <div className={style.error}>
          <p
          >{`There was an error loading this question. Please try reloading the page.`}</p>
        </div>
      );
    }

    return (
      <QuestionType
        handleAnswer={this.props.handleAnswer}
        question={this.props.question}
      />
    );
  }
}

module.exports = Question;
