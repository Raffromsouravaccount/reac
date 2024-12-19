import React, { Component } from "react";
import { connect } from "react-redux";
import { loginActions } from "../../../_actions/login.actions";
import MyLoader from "../ContentLoader/ContentLoader";


class Callback extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var paramsString = this.props?.location?.search;
    const params = new URLSearchParams(paramsString);
    const userCode = params.get("code");
    if (userCode) {
      this.props?.login_action(userCode);
    }
    else {
      this.props?.history?.push("/login");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.login_reducer !== this.props.login_reducer) {
      this.props?.history?.push("/dashboard");
    } else {
      this.props?.history?.push("/login");
    }
  }

  render() {
    return (
      <div className="col-md-6 col-md-offset-3">
        <MyLoader />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login_reducer: state.login_reducer.user,
  };
};

const actionCreators = {
  login_action: loginActions.login_action,
  logout: loginActions.logout,
};
const connectedCallback = connect(mapStateToProps, actionCreators)(Callback);
export { connectedCallback as Callback };