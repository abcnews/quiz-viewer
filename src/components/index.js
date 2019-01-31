const { h, Component } = require("preact");
const style = require("./style.scss");
const uuid = require("uuid/v1");
const logErr = require("@abcnews/err")("quiz-viewer");
const ErrorBox = require("./error-public");
const Auth = require("./Auth");
const { database, auth } = require("../firebase");

var fetch = require("unfetch/dist/unfetch");

// Quiz types
const Quiz = require("./quiz");
const Survey = require("./survey");

// Quiz types map
const components = {
  quiz: Quiz,
  survey: Survey
};

class App extends Component {
  constructor() {
    super();
    this.handleResults = this.handleResults.bind(this);
  }

  componentWillMount() {
    this.hostname = document.location.hostname;
    this.isProduction = !!this.hostname.match(/^(www|mobile).abc.net.au$/);
    this.quizId = this.props.id;
    try {
      this.session = localStorage.getItem(`abc-quiz-${this.quizId}`) || uuid();
      localStorage.setItem(`abc-quiz-${this.quizId}`, this.session);
    } catch (e) {
      this.session = uuid();
    }

    this.responsesRef = database.ref(
      `/responses/${this.quizId.replace(".", "-")}${
        this.isProduction ? "" : "-preview"
      }`
    );

    this.resultsRef = database.ref(
      `/results/${this.quizId.replace(".", "-")}${
        this.isProduction ? "" : "-preview"
      }`
    );

    this.resultsRef.on("value", snapshot => {
      this.setState({
        aggregatedResults: snapshot.val()
      });
    });
  }

  componentDidMount() {
    const handleErr = err => {
      logErr(err);
      this.setState({ err: err });
    };

    if (this.isProduction) {
      database
        .ref(`/definition/${this.quizId}/published`)
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            this.setState({ definition: snapshot.val() });
          } else {
            fetch(
              `http://www.abc.net.au/dat/news/interactives/quizzes/quiz-${
                this.quizId
              }.json`
            )
              .then(res => res.json())
              .then(definition => {
                this.setState({ definition });
              })
              .catch(handleErr);
          }
        })
        .catch(handleErr);
    } else {
      database
        .ref(`/definition/${this.quizId}/versions`)
        .limitToLast(1)
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(snap => {
              this.setState({ definition: snap.val() });
            });
          } else {
            fetch(
              `http://www.abc.net.au/dat/news/interactives/quizzes/quiz-${
                this.quizId
              }-preview.json?${Math.random()}`
            )
              .then(res => res.json())
              .then(definition => {
                this.setState({ definition });
              })
              .catch(handleErr);
          }
        })
        .catch(handleErr);
    }
  }

  handleResults(results) {
    if (this.responseId) {
      this.responsesRef.child(this.responseId).update(results);
    } else {
      results.session = this.session;
      this.responseId = this.responsesRef.push(results).key;
    }
  }

  render(_, { definition, aggregatedResults, err, user }) {
    if (err) {
      console.log("this.isProduction", this.isProduction, err.code);
      if (!this.isProduction && err.code === "PERMISSION_DENIED") {
        return <Auth />;
      }
      return (
        <ErrorBox
          message={`There was an error loading this quiz. Please try again.`}
        />
      );
    }

    if (!definition) return;

    const type = definition ? definition.type : null;
    const QuizType = components[type];

    if (!QuizType) {
      logErr(
        new Error(
          `Quiz type specified in the data file (${type}) is not defined.`
        )
      );
      return (
        <ErrorBox
          message={`There was an error loading this quiz. Please try again.`}
        />
      );
    }

    return (
      <QuizType
        handleResults={this.handleResults}
        definition={definition}
        aggregatedResults={aggregatedResults}
      />
    );
  }
}

module.exports = App;
