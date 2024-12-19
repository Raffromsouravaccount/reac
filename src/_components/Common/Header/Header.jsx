import React, { Component } from "react";
import { connect } from "react-redux";
import { loginActions } from "../../../_actions/login.actions";
import { userActions } from "../../../_actions/user.action";
import { getLocalData } from "../../../_helpers/util";
import { apiCalls } from '../../../_services/common.service';
import Config from '../../../Config/config';

import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";

import DropDown from "../DropDown/DropDown";

import BellIcon from "images/bell-icon.svg";
import UserProfileIcon from "images/user-profile-icon.svg";
import BackToTopIcon from "images/back-to-top-icon.svg";

import "./Header.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openLogoutDropdown: false,
      showTopBtn: false,
    };
  }
  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll, true);
  }
  handleScroll = (e) => {
    let scrollY = window.scrollY;
    if(scrollY >= 750){
      this.setState({showTopBtn: true});
    }
    else {
      this.setState({showTopBtn: false});
    }
  }
  clickScroll = () =>{
    window?.scrollTo({top: 0, behavior : 'smooth'});
    this.setState({showTopBtn: false});
  }
  handleLogout = async () => {
    let response = await apiCalls(Config.userLogout, "GET", {});
    this.props.logout();
    this.setState({ openLogoutDropdown: false });
  };

  handleOpenClose = () => {
    this.setState((previewState) => ({
      openLogoutDropdown: !previewState.openLogoutDropdown,
    }));
  };

  handleClose = () => {
    this.setState({ openLogoutDropdown: false });
  };

  render() {
    let { openLogoutDropdown, showTopBtn } = this.state;
    let firstName = getLocalData("userData")?.firstName;
    let lastName = getLocalData("userData")?.lastName;
    return (
      <div className="h-wrap c-n">
        <div id="clickScrollBtn" className={ showTopBtn ? "back-to-top" : "back-to-top hide"} onClick={this.clickScroll}><BackToTopIcon /></div>
        <AppBar position="static">
          <ToolBar>
            <div className="full">
              <div className="flex justify-content-between">
                <div className="col-l s-logo">
                  <a href="/dashboard">
                    <img src="images/ZEE5_logo.svg" alt="logo" />
                  </a>
                </div>
                <div className="col-r flex align-items-center">
                  <IconButton color="inherit">
                    <Badge badgeContent={0} color="secondary">
                      <BellIcon />
                    </Badge>
                  </IconButton>
                  <div className="flex align-items-center h-logout-btn">
                    <IconButton color="inherit">
                      <span className="text">
                        <UserProfileIcon />
                        <span className="u-name">
                          <span>{`${firstName} ${lastName}`}</span>
                        </span>
                      </span>
                    </IconButton>
                    <DropDown
                      className="logout-link"
                      open={openLogoutDropdown}
                      handleOpenClose={this.handleOpenClose}
                      handleClose={this.handleClose}
                    >
                      <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                    </DropDown>
                  </div>
                </div>
              </div>
            </div>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login_reducer: state.login_reducer.user,
    userDetails: state.user_reducer.userdetails,
  };
};

const actionCreators = {
  login_action: loginActions.login_action,
  logout: loginActions.logout,
  getUserData: userActions.user_details_action,
};
export default connect(mapStateToProps, actionCreators)(Header);
