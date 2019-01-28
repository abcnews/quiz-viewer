const { h, Component } = require("preact");
const styles = require("./index.scss");
const { auth } = require("../../firebase");
const logErr = require("@abcnews/err")("quiz-viewer");

class Auth extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = { user: null };
  }

  componentWillMount() {
    // TODO: this should probably all move to the auth module which should pass back a user object
    auth.onAuthStateChanged(user => {
      if (user) {
        // Make the user re-authenticate every two days.
        if (new Date() - new Date(user.metadata.lastSignInTime) > 172800000) {
          auth.signOut();
          return;
        }
      }
      this.setState({ user });
    });

    // Confirm the link is a sign-in with email link.
    if (auth.isSignInWithEmailLink(window.location.href)) {
      this.setState({ loginStatus: "verifying" });
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      auth
        .signInWithEmailLink(email, window.location.href)
        .then(function(result) {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(logErr);
    }
  }

  handleLogin(email) {
    auth
      .sendSignInLinkToEmail(email, {
        url: window.location.href,
        handleCodeInApp: true
      })
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        this.setState({ loginStatus: "pending" });
      })
      .catch(logErr);
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const invalidEmail = !/.*@abc.net.au$/.test(this.state.email);
    if (!invalidEmail) {
      this.handleLogin(this.state.email);
      this.setState({ sendingEmail: true });
    }
    this.setState({ invalidEmail });
  }

  onChange(ev) {
    this.setState({ email: ev.srcElement.value });
  }

  render(
    { loginStatus, children },
    { email, invalidEmail, sendingEmail, user }
  ) {
    if (user) {
      return <div>{children}</div>;
    }

    return (
      <div className={styles.panel}>
        <div className={styles.panelHeading}>Login</div>
        <div className={styles.panelBody}>
          {!loginStatus && sendingEmail ? (
            <p className={`${styles.alert} ${styles.alertInfo}`} role="alert">
              Sending email.
            </p>
          ) : null}

          {loginStatus === "pending" ? (
            <p className={`${styles.alert} ${styles.alertInfo}`} role="alert">
              Please check your email to complete login.
            </p>
          ) : null}

          {invalidEmail ? (
            <p
              className={`${styles.alert} ${styles.alertWarning}`}
              role="alert"
            >
              You must use an ABC email address.
            </p>
          ) : null}

          {loginStatus === "verifying" ? (
            <p
              className={`${styles.alert} ${styles.alertWarning}`}
              role="alert"
            >
              Verifying your credentials
            </p>
          ) : (
            <form onSubmit={this.handleSubmit}>
              <div className={`${styles.formGroup}`}>
                <label for="email">ABC email address</label>{" "}
                <input
                  type="text"
                  name="email"
                  id="email"
                  className={styles.formControl}
                  placehoder="smith.jane@abc.net.au"
                  onChange={this.onChange}
                  value={email}
                />
              </div>{" "}
              <button className={styles.btn} type="submit">
                Get link
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

module.exports = Auth;
