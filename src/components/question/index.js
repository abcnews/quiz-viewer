const { h, Component } = require('preact');
const style = require('./style.scss');
const Panel = require('../panel');
const logErr = require('@abcnews/err')('quiz-viewer');

// Specific question type modules
const MultipleChoiceSimple = require('../multiple-choice-simple');
const Note = require('../note');

// Question types map
const components = {
  note: Note,
  multipleChoiceSimple: MultipleChoiceSimple,
  multipleChoiceImage: MultipleChoiceSimple,
  multipleChoiceMultipleSelection: MultipleChoiceSimple
};

class Question extends Component {
  render(props) {
    const type = this.props.question.type;
    const QuestionType = components[type];
    if (!QuestionType) {
      logErr(
        new Error(
          `Question type specified in the data file (${type}) is not defined.`
        )
      );
    }

    const error = (
      <div className={style.error}>
        <p>
          {
            'There was an error loading this question. Please try refresing the page.'
          }
        </p>
      </div>
    );

    return (
      <Panel>
        {QuestionType ? (
          <QuestionType {...props} className={style.question} />
        ) : (
          { error }
        )}
      </Panel>
    );
  }
}

module.exports = Question;
