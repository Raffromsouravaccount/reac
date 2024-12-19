import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

//Common Components
import InputField from "../../Common/InputField/InputField";
import SelectWithSearch from "../../Common/SelectWithSearch/SelectWithSearch";
import ButtonField from "../../Common/ButtonField/ButtonField";

//Helper files
import { userConstants } from "../user.constants";
import { edituserConstants } from "../EditUser/editUserConstant";
import { userActions } from "../../../_actions/user.action";
import { history } from "../../../_helpers/history";
import { filterActivatedData, getSelectedGroup, formatCountryGroup } from "../../../_helpers/util";
import {
  requiredValidate, minLength, maxLength, emailValidate, phoneNumberValidate, characterValidate,
  objectRequiredFieldValidation,
  numberValidate,
} from "../../../_helpers/validation";
import { constantText } from "../../../_helpers/constants.text";

//Services
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";

import AngleLeftArrow from "images/angle-left-arrow.svg";
import "./CreateUser.css";
import { INCREASE_REQUEST, DECREASE_REQUEST } from './../../../_constants/common.constants';

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        email: "", firstName: "", lastName: "", phoneNumber: "", roleValue: null,
        group: [], language: [], comments: ""
      },
      rolesArr: [],
      languageArr: [],
      countriesArr: [],
      error: false,
      currentRoleDetails: null,
    };
  }

  componentDidMount() {
    this.fetchUserDetails();
  }

  fetchUserDetails = async () => {
    this.props.fetchRoles('type=Others');
    this.props.fetchLanguage("status=all");
    const Groups = (await this.fetchMaster("CountryGroup")) || [];
    const groupData = await formatCountryGroup(Groups);
    groupData && this.setState({ countriesArr: groupData });
  }

  componentWillReceiveProps = (nextProps) => {
    let { rolesArr, languageArr, countriesArr } = nextProps;
    this.setState({
      rolesArr: filterActivatedData(rolesArr || [], "status", "1"),
      languageArr: filterActivatedData(languageArr || [], "status", "1"),
    });
  };

  fetchMaster = async (type) => {
    const url = `${Config.masterUrl}/${type}`;
    const res = await apiCalls(url, "GET", {});
    return res;
  };

  selectGroup = (event, selectedgroup) => {
    let valid = false;
    const { userData } = this.state;
    const copyUserData = { ...userData };
    const { countriesArr } = this.state;

    copyUserData.group = getSelectedGroup(event, selectedgroup, countriesArr, copyUserData.group);
    this.setState({ userData: copyUserData });
  };


  handleChange = (event) => {
    let { name, value } = event.target;
    value = name == "email" ? value.toLowerCase().replace(/^\s\s*/, '') : value.replace(/^\s\s*/, '');
    this.handleStateChange(event, "", name, value);
  };

  handleStateChange = (event, id, name, value) => {
    let { userData } = this.state;
    this.setState({
      userData: {
        ...userData,
        [name]: value,
      },
    });
  };

  formatGroupData = (data) => {
    let formatData =
      data &&
      data.map((obj) => {
        let { CurrentStatus, title, Icon } = obj;
        return { CurrentStatus, title, Icon };
      });
    return formatData;
  };

  createUser = () => {
    let { userData } = this.state;
    let { firstName, lastName, email, phoneNumber, roleValue, group, language, comments } = userData;
    group = group?.map(data => data?.id);

    let validateObj = { firstName, lastName, email, group };

    let error = objectRequiredFieldValidation(validateObj);

    if (error || !roleValue?.Name || maxLength(250, comments) || minLength(3, firstName) || characterValidate(firstName) ||
      maxLength(50, firstName) || characterValidate(lastName) || minLength(3, lastName) || maxLength(50, lastName) ||
      emailValidate(email) || (phoneNumber && (phoneNumberValidate(phoneNumber) || numberValidate(phoneNumber)))) {
      return this.setState({ error: true });
    }
    else {
      validateObj.roleId = roleValue.id;
      if (language?.length> 0) {
        validateObj.language = language?.map(data => data?.id);
      }
      if (phoneNumber) {
        validateObj.phoneNumber = phoneNumber;
      }
      if (comments) {
        validateObj.comments = comments;
      }
      this.props.createUser(validateObj);
    }
  };

  handleRoute = (route) => {
    history.push(route);
  };

  handleRoleRoute = (route) => {
    window.open(route, "_blank");
  };

  render() {
    let { rolesArr, countriesArr, languageArr, userData, error } = this.state;
    let { firstName, lastName, email, phoneNumber, language, group, roleValue, comments } = userData;

    let disableSaveButton = !firstName || !lastName || !email || group.length <= 0 || !roleValue?.Name? true : false;

    const breadstyle = { color: "inherit" };

    return (
      <div>
        <div className="d-wrap c-n">
          <div className="bread-crumb top-minus-20">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link style={breadstyle} data-test="handle-route-button" onClick={() => this.handleRoute("/users")}>{userConstants.header}</Link>
              <Typography color="textPrimary">{userConstants.createUserTxt}</Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn">
              <span data-test="left-handle-route" onClick={() => this.handleRoute("/users")}><AngleLeftArrow /></span>
              <strong>
                <span data-test="create-user-text">{userConstants.createUserTxt}</span>
              </strong>
            </div>
          </div>

          <div className="create-u-form">
            <div className="create-u-head flex align-items-center justify-content-between">
              <div className="l-title">{userConstants.profileDetailTxt}</div>
            </div>
            <div className="inner">
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-input-field auto-firstName" label="First Name" required={true} value={firstName}
                    name="firstName" data-test="user-firstname-input"
                    error={error && (requiredValidate(firstName) || minLength(3, firstName) || maxLength(250, firstName) ||
                      characterValidate(firstName)) ? true : false
                    }
                    errorMsg={requiredValidate(firstName) || minLength(3, firstName) || maxLength(250, firstName) ||
                      characterValidate(firstName)
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-input-field auto-lastName" label="Last Name" required={true} value={lastName} name="lastName"
                    data-test="user-lastname-input"
                    error={error && (requiredValidate(lastName) || minLength(3, lastName) || maxLength(250, lastName) ||
                      characterValidate(lastName)) ? true : false
                    }
                    errorMsg={requiredValidate(lastName) || minLength(3, lastName) || maxLength(250, lastName) ||
                      characterValidate(lastName)
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-input-field auto-email" label="Email ID" required={true} value={email} name="email"
                    data-test="user-email-input"
                    error={error && (requiredValidate(email) || minLength(3, email) || maxLength(250, email) ||
                      emailValidate(email)) ? true : false
                    }
                    errorMsg={requiredValidate(email) || minLength(3, email) || maxLength(250, email) ||
                      emailValidate(email)
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-input-field auto-phoneNumber" label="Phone Number" value={phoneNumber}
                    name="phoneNumber" data-test="user-number-input" onChange={this.handleChange}
                    error={(error && (numberValidate(phoneNumber) || phoneNumberValidate(phoneNumber))) && phoneNumber.length ? true : false}
                    errorMsg={numberValidate(phoneNumber) || phoneNumberValidate(phoneNumber)}
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <SelectWithSearch className="zee-SelectWSearch-field auto-roleValue" id="roleValue" name="roleValue"
                    data-test="role-value-button"
                    label={userConstants.role_name_text} placeholder="" disableCloseOnSelect={false}
                    limitTags={1} moreText={"more"} multiple={false} keyText={"Name"}
                    data={rolesArr?.map(data => ({ id: data.id, Name: data.name }))}
                    value={roleValue?.Name || null} onChange={this.handleStateChange} required={true}
                    error={error && !roleValue?.Name ? true : false}
                    errorMsg={constantText.role_msg_text}
                  />

                  {(roleValue && roleValue.Name) && (
                    <div className="role-m-link">
                      <Link onClick={() => this.handleRoleRoute(`/role/edit/${roleValue?.id}`)}>
                        {edituserConstants.consolidatedPermissionView}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-lg-4">
                  <SelectWithSearch className="zee-SelectWSearch-field" id="language" name="language"
                    label={userConstants.translation_lang_text} placeholder=""
                    disableCloseOnSelect={true} limitTags={1} moreText={"more"} multiple={true}
                    data={languageArr?.map(data => ({ id: data?.id, title: data.title, code: data.code }))}
                    keyText={"title"} value={language || []} onChange={this.handleStateChange}
                  />
                </div>

                <div className="col-md-6 col-lg-4">
                  <SelectWithSearch className="zee-SelectWSearch-field auto-group" id="group" name="group"
                    data-test="group-button"
                    label={userConstants.region_text} placeholder="" disableCloseOnSelect={true} limitTags={1}
                    moreText={"more"} multiple={true} keyText={"title"}
                    data={countriesArr}
                    value={group || []}
                    onChange={this.handleStateChange} required={true}
                    error={error && minLength(1, group) ? true : false}
                    errorMsg={constantText.group_text}
                    groupBy={(option) => option["group"]}
                    selectGroup={(e, group) =>
                      this.selectGroup(e, group)
                    }
                  />
                </div>
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-textarea-field auto-comments" label="Comments" value={comments} multiline
                    data-test="text-area-create-user"
                    name="comments" onChange={this.handleChange}
                    error={(error || minLength(3, comments) || maxLength(250, comments)) && comments.length ? true : false}
                    errorMsg={(maxLength(250, comments) || minLength(3, comments))}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-lg-4 form-save-btn">
                  <ButtonField className="zee-btn-field zee-full" variant="contained" color="primary"
                    buttonText={"Save"} disabled={disableSaveButton} data-test="create-user-button" onClick={this.createUser}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  let { rolesArr, languageArr, countriesArr } = state.user_reducer;
  return {
    rolesArr, languageArr,
    countriesArr
  };
};

const actionCreators = {
  createUser: userActions.createUser_action,
  fetchRoles: userActions.fetch_roles_action,
  fetchLanguage: userActions.fetch_language_action,
  INCREASE_REQUEST: () => (dispatch) => {
    dispatch({ type: INCREASE_REQUEST });
  },
  DECREASE_REQUEST: () => (dispatch) => {
    dispatch({ type: DECREASE_REQUEST });
  },
};

export default connect(mapStateToProps, actionCreators)(CreateUser);
