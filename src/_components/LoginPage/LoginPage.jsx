import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { loginActions } from "../../_actions/login.actions";
import Config from "../../Config/config";
import Zee5Logo from "images/ZEE5_For_White_bg.svg";
import GoogleIcon from "images/google-icon.svg";
import Alert from "@material-ui/lab/Alert";

import "./LoginPage.css";
import { isAuthenticated, deleteLocalData } from "../../_helpers/util";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    if (isAuthenticated()) {
      this.props.history.push("/dashboard");
    }
  }

  componentDidMount() {
    deleteLocalData();
  }

  handleADFSLogin = () => {
    let path = Config.ADFSLoginURL;
    window.location.href = path;
  };
  handleGoogleLogin = () => {
    let path = Config.GoogleLoginURL;
    window.location.href = path;
  };

  render() {
    return (
      <div className="login-page flex align-items-center">
        <img className="login-bg" src="images/login-bg.svg" alt="bg" />
        <div className="login-box">
          <div className="login-head flex align-items-center">
            <div className="logo col-5">
              <Zee5Logo />
            </div>
            <div className="col-7">
              <div className="login-img">
                <img src="images/animation_body.gif" alt="animation" />
              </div>
            </div>
          </div>
          <div className="login-b">
            <div className="wl-text">Welcome</div>
            <div className="sub-text">Login to continue to ZEE5 CMS</div>
            <Button
              onClick={this.handleADFSLogin}
              variant="contained"
              color="primary"
              className="l-adfs-btn"
            >
              Login with ADFS
            </Button>
            <div className="l-choice">
              <div className="text">or Login with other Account</div>
            </div>
            <Button
              onClick={this.handleGoogleLogin}
              variant="contained"
              className="l-google-btn"
            >
              <GoogleIcon /> Login with Google
          </Button>
            <div className="help-t">
              Need help in login? Please contact administrator <br />
              <a className="email" href="mailto:cmssupport@zee5.com">cmssupport@zee5.com</a>
              {this.props.loggingIn.message && <Alert variant="filled" severity="error">
                {this.props.loggingIn.message && this.props.loggingIn.message}
              </Alert>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggingIn: state.login_reducer,
  };
};

const actionCreators = {
  login: loginActions.login,
  logout: loginActions.logout,
};

const connectedLoginPage = connect(mapStateToProps, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };