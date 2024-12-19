import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import MenuItem from "@material-ui/core/MenuItem";

//Common Components
import InputField from "../../Common/InputField/InputField";
import SelectWithSearch from "../../Common/SelectWithSearch/SelectWithSearch";
import ButtonField from "../../Common/ButtonField/ButtonField";
import DropDown from "../../Common/DropDown/DropDown";
import { CommonModel } from '../../Common/Model/CommonModel';

//Helper files
import { userConstants } from "../user.constants";
import { userActions } from "../../../_actions/user.action";
import { history } from "../../../_helpers/history";
import { getLocalData, getSelectedGroup, formatCountryGroup } from "../../../_helpers/util";
import {
  requiredValidate, minLength, maxLength, phoneNumberValidate, characterValidate,
  objectRequiredFieldValidation, numberValidate
} from "../../../_helpers/validation";
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { edituserConstants } from "./editUserConstant";

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import { INCREASE_REQUEST, DECREASE_REQUEST } from './../../../_constants/common.constants';
import ActivateIcon from 'images/activate-icon.svg';
import DeactivateIcon from 'images/Deactivate-icon.svg';

//Css
import "./EditUser.css";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      updatedData: {},
      rolesArr: [],
      languageArr: [],
      countriesArr: [],
      error: null,
      openStatusDropdown: false,
      showStatePopup: false,
    };
  }

  componentDidMount() {
    this.fetchUserData();
    this.getUserData();
  }

  fetchUserData = async () => {
    this.props.fetchRoles('type=Others');
    this.props.fetchLanguage("status=all");
  }

  getUserData = async () => {
    let { match } = this.props;
    if (match?.params?.id) {
      let { id } = match?.params;
      this.props.getUserData(id);
      const Groups = (await this.fetchMaster("CountryGroup")) || [];
      const groupData = await formatCountryGroup(Groups);
      groupData && this.setState({ countriesArr: groupData });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    let { currentUser, rolesArr, countriesArr, languageArr } = nextProps;
    this.setState({
      userData: currentUser || {},
      updatedData: {},
      rolesArr: rolesArr || [],
      languageArr: languageArr || [],
    },
      () => this.getRoleNameFromId()
    );
  };

  fetchMaster = async (type) => {
    this.props.INCREASE_REQUEST();
    const url = `${Config.masterUrl}/${type}`;
    const res = await apiCalls(url, "GET", {});
    this.props.DECREASE_REQUEST();
    return res;
  };

  selectGroup = (event, selectedgroup) => {
    const { userData, updatedData } = this.state;
    const copyUserData = { ...userData };
    const copyUpdatedData = { ...updatedData };
    const { countriesArr } = this.state;
    copyUserData.countries = getSelectedGroup(event, selectedgroup, countriesArr, copyUserData.countries);
    copyUpdatedData.countries = getSelectedGroup(event, selectedgroup, countriesArr, copyUserData.countries);
    this.setState({ userData: copyUserData , updatedData : copyUpdatedData });
  };

  filterActiveData = () => {
    let { userData, rolesArr, countriesArr, languageArr } = this.state;
    let { roleValue, countries, translationLanguages } = userData;
    rolesArr = rolesArr?.filter(data => (data.id == roleValue.id || data.status == "1"));
    countriesArr = countriesArr?.filter(data => (data.status == "1" ||
      countries?.map(obj => obj?.title).includes(data?.title)));

    languageArr = languageArr?.filter(data => (data.status == "1" ||
      translationLanguages?.map(obj => obj?.title).includes(data?.title)));

    this.setState(prevState => ({ rolesArr, countriesArr, languageArr }));
  }

  getRoleNameFromId = () => {
    let { userData, rolesArr } = this.state;
    let roleValue = {};
    rolesArr?.map((data) => {
      if (data.id == userData?.roleId) {
        roleValue = { Name: data.name, id: data.id };
      }
    });
    this.setState({
      userData: {
        ...userData,
        roleValue,
      },
    }, () => this.filterActiveData());
  };

  handleChange = (event) => {
    let { name, value } = event.target;
    this.handleStateChange(event, "", name, value.replace(/^\s\s*/, ''));
  };

  handleStateChange = (event, id, name, value) => {
    let { userData, updatedData } = this.state;
    this.setState({
      userData: {
        ...userData,
        [name]: value
      },
      updatedData: {
        ...updatedData,
        [name]: value
      },
      roleError: false, countryError: false, languageError: false
    });
  };

  showHideStatePopup = currentUser => {
    let { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup
    });
  }

  activateDeactivateUser = () => {
    this.handleCloseStatusDropdown();
    let { userData } = this.state;
    let { id, userStatus } = userData;
    this.setState({
      showStatePopup: false
    }, async () => {
      let data = {
        userStatus: userStatus == "1" ? "2" : "1",
      };
      let response = await apiCalls(`${Config.usersUrl}/${id}`, "PATCH", data);
      if (response) {
        this.getUserData();
      }
    })
  };

  updateUser = () => {
    let { userData, updatedData, rolesArr, countriesArr, languageArr } = this.state;
    let { id, firstName, lastName, roleId, translationLanguages, countries } = userData;
    let { phone, comments, roleValue } = updatedData;

    countries = countries?.map(data => data?.id);
    let validateData = { firstName, lastName, countries, role: roleValue && roleValue?.Name ? roleValue?.Name : roleId };

    let userrole = getLocalData("userData")?.role;

    if (translationLanguages && translationLanguages?.length > 0) {
      validateData.translationLanguages = translationLanguages;
    }
    let error = objectRequiredFieldValidation(validateData);
    let inActiveRoleError = roleValue ? !!(rolesArr?.filter(data => (data.id == roleValue?.id))[0]?.status == "0") :
      !!(rolesArr?.filter(data => (data.id == roleId))[0]?.status == "0");

    let inActiveCountryError = !!(countriesArr?.filter(data => (
      countries.includes(data?.id) && data?.status == "0"))?.length > 0);

    let inActiveLanguageError = (translationLanguages && translationLanguages?.length > 0) ?
      !!(languageArr?.filter(data => (
        translationLanguages?.map(obj => obj.title).includes(data.title) && data.status == "0"))?.length > 0) : false;

    if (error || inActiveRoleError || inActiveCountryError || inActiveLanguageError ||
      characterValidate(firstName) || minLength(3, firstName) || maxLength(250, firstName) ||
      characterValidate(lastName) || minLength(3, lastName) || maxLength(250, lastName) || phoneNumberValidate(phone) ||
      maxLength(250, comments) || (roleValue && roleValue?.Name == userrole && userrole != "admin")) {
      return this.setState({
        error: true,
        roleError: inActiveRoleError ? "Please select all active role" : null,
        countryError: inActiveCountryError ? "Please select all active country" : null,
        languageError: inActiveLanguageError ? "Please select all active language" : null
      });
    } else {
      if (updatedData?.translationLanguages) {
        updatedData.language = translationLanguages.map(data => data?.id);
        delete updatedData.translationLanguages;
      }
      if (updatedData.countries) {
        updatedData.group = countries;
        delete updatedData.countries;
      }
      if (roleValue) {
        updatedData.roleId = roleValue.id;
        delete updatedData.roleValue;
      }
      if (updatedData?.phone !== undefined) {
        updatedData.phoneNumber = phone;

        delete updatedData.phone;

      }
      this.props.updateUser(id, updatedData);
    }
  };

  handleOpenCloseStatusDropDown = () => {
    let { openStatusDropdown } = this.state;
    this.setState({ openStatusDropdown: !openStatusDropdown });
  };

  handleCloseStatusDropdown = () => {
    this.setState({ openStatusDropdown: false });
  };

  handleRoute = (route) => {
    history.push(route);
  };

  handleRoleRoute = (route) => {
    window.open(route, "_blank");
  };

  render() {
    let { rolesArr, countriesArr, languageArr, userData, openStatusDropdown, error, roleError, countryError,
      languageError, showStatePopup } = this.state;
    let { firstName, lastName, email, phone, translationLanguages, countries, roleValue, comments, userStatus, group } = userData;


    let disableSaveButton = !firstName || !lastName || countries?.length <= 0 || group?.length <= 0 ||
      (!roleValue && !roleValue?.Name)? true : false;
    countries && countries?.length > 0 ? group = countries : countries;
    return (
      <div>
        <div className="d-wrap c-n">
          <div className="bread-crumb top-minus-20">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link color="inherit" data-test="handle-route" onClick={() => this.handleRoute("/users")}>
                {userConstants.header}
              </Link>
              <Typography color="textPrimary">
                {userConstants.editUserTxt}
              </Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn">
              <span data-test="left-handle-route" onClick={() => this.handleRoute("/users")}>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{userConstants.editUserTxt}</span>
              </strong>
            </div>
          </div>

          <div className="create-u-form">
            <div className="create-u-head flex align-items-center justify-content-between">
              <div className="l-title">{userConstants.profileDetailTxt}</div>
              <div className="r-text flex align-items-center">
                <div className="status-change flex align-items-center">
                  <div className="text">Change Status</div>
                  <div className={userStatus == "1" ? "status-dropdown val" : "status-dropdown val inactive"} >
                    <DropDown buttonText={userStatus == "1" ? userConstants.active : userConstants.inActive}
                      open={openStatusDropdown} handleOpenClose={this.handleOpenCloseStatusDropDown}
                      handleClose={this.handleCloseStatusDropdown}
                    >
                      <MenuItem data-test="edit-active-inactive-button" onClick={this.showHideStatePopup}>
                        {userStatus == "1" ? "Deactivate User" : "Activate User"}
                      </MenuItem>
                    </DropDown>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="inner">
                <div className="row">
                  <div className="col-md-6 col-lg-4">
                    <InputField className="zee-input-field auto-firstName" label="First Name" required={true} value={firstName || ""}
                      name="firstName"
                      error={error && (requiredValidate(firstName) || minLength(3, firstName) ||
                        maxLength(250, firstName) || characterValidate(firstName)) ? true : false
                      }
                      errorMsg={requiredValidate(firstName) || minLength(3, firstName) || maxLength(250, firstName) ||
                        characterValidate(firstName)
                      }
                      data-test="edit-user-firstname"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <InputField className="zee-input-field auto-lastName" label="Last Name" required={true} value={lastName || ""}
                      name="lastName"
                      error={error && (requiredValidate(lastName) || minLength(3, lastName) ||
                        maxLength(250, lastName) || characterValidate(lastName)) ? true : false
                      }
                      errorMsg={requiredValidate(lastName) || minLength(3, lastName) || maxLength(250, lastName) ||
                        characterValidate(lastName)
                      }
                      data-test="edit-user-lastname"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <InputField className="zee-input-field auto-email" label="Email ID" value={email || ""} name="email" onChange={this.handleChange} />
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <InputField className="zee-input-field auto-phone" label="Phone Number" value={phone || ""}
                      name="phone" onChange={this.handleChange} data-test="edit-user-number"
                      error={(error && (numberValidate(phone) || phoneNumberValidate(phone))) && phone?.length ? true : false}
                      errorMsg={numberValidate(phone) || phoneNumberValidate(phone)}
                    />
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <SelectWithSearch className="zee-SelectWSearch-field auto-roleValue" id="roleValue" name="roleValue"
                      label={userConstants.role_name_text} placeholder="" disableCloseOnSelect={false}
                      limitTags={1} moreText={"more"} multiple={false}
                      data={rolesArr?.map((data) => ({ id: data.id, Name: data.name }))}
                      keyText={"Name"} value={roleValue?.Name ? roleValue : null}
                      data-test="edit-role-change"
                      onChange={this.handleStateChange}
                      required={true}
                      error={(error && !roleValue?.Name ? true : false) || !!roleError}
                      errorMsg={roleError || constantText.role_msg_text}
                    />

                    {roleValue && roleValue.Name && (
                      <div className="role-m-link">
                        <Link data-test="handle-role-route" className="auto-consolidated-link" onClick={() => this.handleRoleRoute(`/role/edit/${roleValue?.id}`)} >
                          {edituserConstants.consolidatedPermissionView}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <SelectWithSearch className="zee-SelectWSearch-field" id="translationLanguages"
                      name="translationLanguages" label={userConstants.translation_lang_text} placeholder=""
                      disableCloseOnSelect={true} limitTags={1} moreText={"more"} multiple={true}
                      data={languageArr?.map((data) => ({ id: data?.id, title: data.title, code: data.code }))}
                      keyText={"title"} value={translationLanguages || []}
                      onChange={this.handleStateChange}
                      error={!!languageError}
                      errorMsg={languageError}
                    />
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <SelectWithSearch className="zee-SelectWSearch-field" id="countries" name="countries"
                      label={userConstants.region_text} placeholder="" disableCloseOnSelect={true}
                      limitTags={1} moreText={"more"} multiple={true}
                      data={countriesArr}
                      keyText={"title"} value={group ? group : countries || []}
                      data-test="edit-user-country"
                      onChange={this.handleStateChange}
                      required={true}
                      error={(error && minLength(1, (group ? group : countries)) ? true : false) || !!countryError}
                      errorMsg={countryError || constantText.group_text}
                      groupBy={(option) => option["group"]}
                      selectGroup={(e, group) =>
                        this.selectGroup(e, group)
                      }
                    />
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <InputField className="zee-textarea-field" label="Comments"
                      value={comments || ""} multiline name="comments"
                      onChange={this.handleChange}
                      data-test="edit-user-comments"
                      error={!!(error && maxLength(250, comments || "")) ? true : false}
                      errorMsg={maxLength(250, comments)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-4 form-save-btn">
                    <ButtonField className="zee-btn-field zee-full" variant="contained"
                      color="primary" buttonText={"Save"}
                      disabled={disableSaveButton}
                      data-test="update-user-button"
                      onClick={this.updateUser}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <CommonModel className='popup-wrap status-popup' state={showStatePopup}
            showTitle={true} title={`${(userStatus == "1") ? 'Deactivate' : 'Activate'} User`}
            showIcon={true} icon={(userStatus == "1") ? <DeactivateIcon /> : <ActivateIcon />}
            showDes={true} des={`Do you want to ${(userStatus == "1") ? 'Deactivate' : 'Activate'} the User?`}
            showBtn1={true} btn1Text={'Yes'} btn1Action={this.activateDeactivateUser}
            showBtn2={true} btn2Text={'No'} btn2Action={this.showHideStatePopup}
            handleClose={this.showHideStatePopup}
          />
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  let { allUsers, rolesArr, countriesArr, languageArr } = state.user_reducer;
  return {
    rolesArr, countriesArr, languageArr,
    currentUser: allUsers,
  };
};

const actionCreators = {
  getUserData: userActions.fetchUserByIdKey_action,
  fetchRoles: userActions.fetch_roles_action,
  fetchLanguage: userActions.fetch_language_action,
  updateUser: userActions.update_users_action,
  INCREASE_REQUEST: () => (dispatch) => {
    dispatch({ type: INCREASE_REQUEST });
  },
  DECREASE_REQUEST: () => (dispatch) => {
    dispatch({ type: DECREASE_REQUEST });
  },
};

export default connect(mapStateToProps, actionCreators)(EditUser);
