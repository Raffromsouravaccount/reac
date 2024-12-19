import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import MenuItem from "@material-ui/core/MenuItem";

//Common Components
import InputField from "../../Common/InputField/InputField";
import SelectWithSearch from "../../Common/SelectWithSearch/SelectWithSearch";
import ButtonField from '../../Common/ButtonField/ButtonField';
import Breadcrumbs from '../../Common/BreadCrumbs/BreadCrumbs';
import DropDown from '../../Common/DropDown/DropDown';
import CheckBox from '../../Common/CheckBox/CheckBox';

//Helper files
import { breadCrumbs } from './breadCrumbs';
import { history } from '../../../_helpers/history';
import { getLocalData, titleCase } from '../../../_helpers/util';
import Config from '../../../Config/config';
import { constantText } from '../../../_helpers/constants.text';
import { apiCalls } from '../../../_services/common.service';
import { requiredValidate, minLength, maxLength, characterValidate,
  charactersWithSpacialValidate } from "../../../_helpers/validation";

//Redux Action files
import { roleActions } from '../../../_actions/role.action';

//Icons
import AccordianActive from 'images/arrow-active-icon.svg';
import AccordianNormal from 'images/arrow-icon.svg';
import AngleLeftArrow from 'images/angle-left-arrow.svg';

//Css files
import './CreateRole.css';

class CreateEditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: getLocalData('userData'),
      moduleArr: [], selectedModuleArr: [],
      contentTypeArr: [], selectedContentType: [],
      allPermission: [], Permission: [],
      role_details: {
        name: "", description: "",
      },
      status: "",
      edit: false, openStatusDropdown: false, disabled: false, error: false,
      accordianIndex: null, accordianModuleName: ""
    };
  }

  async componentDidMount() {
    let { match } = this.props;
    if (match?.params?.id) {
      let roleId = match?.params?.id;
      let response = await apiCalls(`${Config.rolesUrl}?id=${roleId}`, 'GET', {});
      if (response) {
        this.setManageRoleState(response);
      }
    }
    else if (match.path == '/role/create') {
      this.getAllPermission();
    }
    else {
      history.push('/roles');
    }
  }

  getAllPermission = async () => {
    const response = await apiCalls(`${Config.metaDataUrl}/permission`, "GET");
    if (response) {
      this.setState({ allPermission: this.checkSelectAll(response.data || []) }, () => this.getModuleContentType());
    }
  }

  openCloseAccordian = (index, moduleName) => {
    let { accordianIndex, accordianModuleName } = this.state;
    this.setState({
      accordianIndex: (index == accordianIndex && accordianModuleName == moduleName) ? null : index,
      accordianModuleName: (index == accordianIndex && accordianModuleName == moduleName) ? "" : moduleName
    });
  }

  setManageRoleState = currentRoleDetails => {
    const {userInfo}= this.state;
    let { id, name, status, description, permission } = currentRoleDetails;
    this.setState({
      edit: true, status,
      disabled: (userInfo?.RoleName== "Administrator")? false: true,
      Permission: permission || [],
      role_details: {
        id, name,
        description: description || ""
      }
    }, () => {
      this.getAllPermission();
    });
  }

  getModuleContentType = () => {
    let { allPermission, Permission } = this.state;
    let selectedModuleArr = Permission?.map(moduleObj => moduleObj.ParentModule);
    let contentTypeArr = selectedModuleArr?.includes('Content Management') ?
      allPermission.filter(moduleObj => (moduleObj?.ParentModule == 'Content Management')) : [];
    contentTypeArr = contentTypeArr?.length > 0 ?
      contentTypeArr[0]?.ModulePermission?.map(subModule => subModule?.Module) : [];

    let selectedContentType = Permission?.filter(moduleObj => (moduleObj?.ParentModule == 'Content Management'));
    selectedContentType = selectedContentType?.length > 0 ?
      selectedContentType[0]?.ModulePermission?.map(subModule => subModule?.Module) : [];
    this.setState({
      selectedModuleArr, contentTypeArr, selectedContentType,
      moduleArr: Permission
    }, () => this.updatePermission());
  }

  updatePermission = () => {
    let { allPermission, Permission } = this.state;
    allPermission?.map(allModuleObj => allModuleObj?.ModulePermission?.map(allSubModuleObj => {
      Permission?.map(moduleObj => moduleObj?.ModulePermission?.map(subModuleObj => {
        if (allSubModuleObj.Module == subModuleObj.Module) {
          allSubModuleObj.SubModule = subModuleObj.SubModule
        }
      }));
      return allSubModuleObj;
    }));
    this.setState({ allPermission: this.checkSelectAll(allPermission || []) });
  }

  checkSelectAll = Permission => {
    Permission?.map(data => {
      data.ModulePermission?.map(permissionObj => {
        let selectAll = 0;
        for (let key in permissionObj?.SubModule) {
          selectAll = (permissionObj.SubModule[key]['CreateEdit'] == 0 || permissionObj.SubModule[key]['View'] == 0) ?
            ++selectAll : selectAll;

          permissionObj.selectAll = selectAll > 0 ? false : true;
        }
      });
    });
    return Permission;
  }

  handleChange = event => {
    let { name, value } = event.target;
    let { role_details } = this.state;
    this.setState({
      role_details: {
        ...role_details,
        [name]: value.replace(/^\s\s*/, '')
      }
    });
  };

  handleModuleSelect = (event, id, name, value) => {
    let { selectedContentType } = this.state;
    let contentTypeArr = [].concat(...value.map(data => data?.ModulePermission.filter(obj => (data.ParentModule == "Content Management" && obj.Module))));
    contentTypeArr = contentTypeArr.map(data => data.Module);
    let selectedModuleArr = value.map(data => data.ParentModule);
    this.setState({
      [name]: value,
      contentTypeArr, selectedModuleArr,
      selectedContentType: selectedModuleArr.includes('Content Management') ? selectedContentType : []
    });
  }

  handleContentSelect = (event, id, name, value) => {
    this.setState({
      [name]: value
    });
  }

  selectCheckBox = (event, parentModuleName, moduleName, subModuleName, type, value) => {
    let { allPermission } = this.state;
    let selectAll = 0;
    allPermission?.map(data => {
      if (data.ParentModule === parentModuleName) {
        data.ModulePermission?.map(permissionObj => {
          if (permissionObj?.Module === moduleName) {
            for (let key in permissionObj?.SubModule) {
              if (subModuleName) {
                permissionObj.SubModule[subModuleName][type] = value ? 1 : 0;
                permissionObj.SubModule[subModuleName]['CreateEdit'] = (type == 'View' && !value) ? 0 :
                  permissionObj.SubModule[subModuleName]['CreateEdit'];
                permissionObj.SubModule[subModuleName]['View'] = ((type == 'CreateEdit' && value) ||
                  (type == 'View' && permissionObj.SubModule[subModuleName]['CreateEdit'] == 1)) ? 1 :
                  (type == 'CreateEdit' && !value) ? permissionObj.SubModule[subModuleName]['View'] : value ? 1 : 0
              }
              else {
                permissionObj.SubModule[key]['CreateEdit'] = value ? 1 : 0;
                permissionObj.SubModule[key]['View'] = value ? 1 : 0;
              }
              selectAll = (permissionObj.SubModule[key]['CreateEdit'] == 0 || permissionObj.SubModule[key]['View'] == 0) ?
                ++selectAll : selectAll;
              permissionObj.selectAll = selectAll > 0 ? false : true;
            }
          }
        });
      }
    });

    this.setState({ allPermission });
  }

  formatPermissionData = data => {
    let { selectedModuleArr, selectedContentType } = this.state;
    let permissionArr = data?.filter(moduleObj => (moduleObj.ParentModule != 'Content Management') ?
      selectedModuleArr.includes(moduleObj.ParentModule) :
      ((moduleObj.ModulePermission = moduleObj?.ModulePermission?.filter(subModule => (
        selectedContentType.includes(subModule.Module)))) && moduleObj?.ModulePermission?.length > 0 &&
        selectedModuleArr.includes(moduleObj.ParentModule))
    );
    return permissionArr;
  }

  removeSelectAllKey = data => {
    let permission = data.map(moduleObj => {
      let moduleArr = moduleObj?.ModulePermission?.map(permissionObj => {
        let { Module, SubModule } = permissionObj;
        return { Module, SubModule };
      });
      moduleObj.ModulePermission = moduleArr;
      return moduleObj;
    });
    return permission;
  }

  createUpdateRole = () => {
    let { allPermission, role_details, edit } = this.state;
    let { name, description } = role_details;

    let updatedData = {};
    if (!name || minLength(3, name) || maxLength(250, name) || charactersWithSpacialValidate(name)) {
      return this.setState({ error: true });
    }
    if (description && (minLength(3, description) || maxLength(500, description) || characterValidate(description))) {
      return this.setState({ error: true });
    }
    else {
      for (let key in role_details) {
        if (role_details[key].length > 0) {
          updatedData[key] = (key === "name") ? titleCase(role_details[key]) : role_details[key];
        }
      }
      updatedData.permission = this.removeSelectAllKey(this.formatPermissionData(allPermission)) || [];
      if (edit) {
        let { id, ...rest } = updatedData;
        this.props.updateRole(id, rest);
      }
      else {
        this.props.createRole(updatedData);
      }
    }
  }

  activateDeactivateRole = async () => {
    this.handleCloseStatusDropdown();
    let { role_details, status } = this.state;
    let { id } = role_details;
    let data = { status: status == "1" ? "0" : "1" };
    const response = await apiCalls(`${Config.rolesUrl}/${id}`, "PATCH", data);
    if (response) {
      this.handleRoute("/roles");
    }
  }

  handleOpenCloseStatusDropDown = () => {
    let { openStatusDropdown } = this.state;
    this.setState({ openStatusDropdown: !openStatusDropdown });
  }

  handleCloseStatusDropdown = () => {
    this.setState({ openStatusDropdown: false });
  }

  handleRoute = route => {
    history.push(route);
  }

  render() {
    let { match } = this.props;
    let { allPermission, moduleArr, selectedModuleArr, contentTypeArr, selectedContentType, role_details, edit, status,
      openStatusDropdown, accordianModuleName, accordianIndex, disabled, error } = this.state;
    let { name, description } = role_details;
    return (
      <div className="d-wrap c-n">
        <Breadcrumbs className="" links={breadCrumbs.links} typography={breadCrumbs.typography(match && match.path)} />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <span data-test="angleleftarrow-route" onClick={() => this.handleRoute('/roles')}><AngleLeftArrow /></span>
            <strong><span>{match && match.path == '/role/create' ? constantText.create_role_button_text :
              constantText.manage_role_text}</span></strong>
          </div>
        </div>

        <div className="create-u-form">
          <div className="create-u-head flex align-items-center justify-content-between">
            <div className="l-title">{constantText.role_details_text}</div>
            {edit &&
              <div className="r-text flex align-items-center">
                <div className="status-change flex align-items-center">
                  <div className="text" data-test="create-u-form-text">Change Status</div>
                  <div className={status == "1" ? "status-dropdown val" : "status-dropdown val inactive"}>
                    <DropDown buttonText={status == "1" ? constantText.active_text : constantText.inActive_text}
                      open={openStatusDropdown} handleOpenClose={this.handleOpenCloseStatusDropDown}
                      handleClose={this.handleCloseStatusDropdown}>
                      <MenuItem onClick={this.activateDeactivateRole} disabled={disabled}>{status == "1" ?
                        constantText.inActive_role_text : constantText.active_role_text}</MenuItem>
                    </DropDown>
                  </div>
                </div>
              </div>
            }
          </div>
          <form>
            <div className="inner">
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-input-field auto-role-name" label="Role Name" required={true} value={name} name="name"
                    error={(error && (requiredValidate(name) || minLength(3, name) ||
                      maxLength(250, name) || charactersWithSpacialValidate(name))) ? true : false} data-test="role-name-input"
                    errorMsg={requiredValidate(name) || minLength(3, name) || maxLength(250, name) ||
                      charactersWithSpacialValidate(name)}
                    onChange={this.handleChange} disabled={disabled} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <SelectWithSearch className="zee-SelectWSearch-field auto-module" id="moduleArr" name="moduleArr"
                    label={"Module"} placeholder="" data-test="role-module-select" disabled={disabled}
                    disableCloseOnSelect={true} limitTags={1} moreText={'more'} multiple={true}
                    data={allPermission} keyText={'ParentModule'} value={moduleArr} onChange={this.handleModuleSelect} />
                </div>
                {(contentTypeArr?.length > 0) &&
                  <div className="col-md-6 col-lg-4">
                    <SelectWithSearch className="zee-SelectWSearch-field auto-contentType" id="selectedContentType" name="selectedContentType"
                      label={"Content Type"} placeholder="" disabled={disabled}
                      disableCloseOnSelect={true} limitTags={1} moreText={'more'} multiple={true} data-test="role-content-select"
                      data={contentTypeArr} value={selectedContentType} onChange={this.handleContentSelect} />
                  </div>
                }
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <InputField className="zee-textarea-field auto-description" label="Description" value={description} multiline
                    name="description" onChange={this.handleChange} data-test="role-description-input"
                    error={(error && minLength(3, description) || (maxLength(500, description) ||
                      charactersWithSpacialValidate(description))) ? true : false}
                    errorMsg={minLength(3, description) || maxLength(500, description) || charactersWithSpacialValidate(description)}
                    disabled={disabled} />
                </div>
              </div>

              {(selectedModuleArr && ((selectedModuleArr?.length > 0 && selectedModuleArr[0] != "Content Management") ||
                (selectedModuleArr.length > 1) ||
                (selectedModuleArr.length == 1 && selectedModuleArr.includes("Content Management") && selectedContentType.length > 0))) &&
                <div className="role-permission">
                  <div className="title">{constantText.sections_text}</div>
                  {allPermission?.map((moduleObj, moduleIndex) => {
                    if ((selectedModuleArr.includes(moduleObj.ParentModule) && moduleObj.ParentModule != "Content Management") ||
                      (moduleObj.ParentModule == "Content Management" && selectedContentType?.length > 0)) {
                      let divIndex = 0;
                      return (
                        <div className="prms-box" key={moduleIndex}>
                          <div className="hide-md-ele show-sm-ele bg-bar">{moduleObj.ParentModule}</div>
                          <div className="prms-head flex align-items-center hide-sm-ele">
                            <div className="col-14 heading p-lr-10">{constantText.module_text}</div>
                            <div className="col-15 heading p-lr-10">{constantText.content_type_sub_type}</div>
                            <div className="col-71 flex align-items-center justify-content-between">
                              <div className="heading p-lr-10">{constantText.sections_text}</div>
                            </div>
                          </div>

                          <div className="prms-con flex">
                            <div className="col-14 heading p-lr-10 hide-sm-ele select-all-space">{moduleObj.ParentModule}</div>
                            {moduleObj?.ModulePermission?.map((permissionObj, perIndex) => {
                              if (moduleObj.ParentModule != "Content Management" ||
                                (selectedContentType.includes(permissionObj.Module))) {
                                divIndex = divIndex + 1;
                                return (
                                  <Fragment key={perIndex}>
                                    {divIndex > 1 && <div className="col-14 heading p-lr-10 hide-sm-ele"></div>}
                                    <div className={`col-15 heading p-lr-10 select-all-space accordion-head
                                      ${(perIndex == accordianIndex && accordianModuleName == permissionObj.Module) ?
                                        'open' : ""}`} data-test="opencloseAccordian-btn"
                                      onClick={() => this.openCloseAccordian(perIndex, permissionObj.Module)} >
                                      <span className="icon">
                                        <AccordianNormal className="normal-icon" />
                                        <AccordianActive className="active-icon" />
                                      </span>

                                      {permissionObj.Module}
                                    </div>
                                    <div className={`col-71 hide-sm-ele mobile-view-checkbox
                                      ${(perIndex == accordianIndex && accordianModuleName == permissionObj.Module) ? 'open-accordian' : ''}`}>
                                      <div className="prms-white-box flex justify-content-end">
                                        <div className="prms-selectAll heading p-lr-10 flex align-items-center">
                                          <CheckBox className={`zee-checkbox-field auto-selectAll-${permissionObj.Module.split(' ').join('')}`}
                                            label={permissionObj.selectAll ? constantText.unSelect_all_text : constantText.select_all_text}
                                            disabled={disabled}
                                            labelPlacemen="end" checked={permissionObj.selectAll || false}
                                            handleCheckBox={(event, value) =>
                                              this.selectCheckBox(event, moduleObj.ParentModule, permissionObj.Module, null, null, value)} />
                                        </div>
                                      </div>
                                      <div className="prms-add-edit flex align-items-center">
                                        <div className="col-1-third flex align-items-center heading">
                                          <div className="prms-w-1 p-lr-10"></div>
                                          <div className="prms-w-2 text-center p-lr-10">
                                            {constantText.add_edit_text}
                                          </div>
                                        </div>
                                        <div className="col-1-third flex align-items-center heading hide-md-elm">
                                          <div className="prms-w-1 p-lr-10"></div>
                                          <div className="prms-w-2 text-center p-lr-10">
                                            {constantText.add_edit_text}
                                          </div>
                                        </div>
                                        <div className="col-1-third flex align-items-center heading hide-lg-elm">
                                          <div className="prms-w-1 p-lr-10"></div>
                                          <div className="prms-w-2 text-center p-lr-10">
                                            {constantText.add_edit_text}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="prms-chcekbox flex">
                                        {Object.keys(permissionObj?.SubModule).map((data, subIndex) => {
                                          return (
                                            <div className="col-1-third flex align-items-center" key={subIndex}>
                                              <div className="prms-text prms-w-1 p-lr-10">
                                                {(data == 'SEOMetaData' || data == 'EPG') ? `${data.slice(0, 3)} ${data.slice(3)}` :
                                                  data.replace(/([A-Z])/g, ' $1').trim()}
                                              </div>
                                              <div className="add-edit-checkbox prms-w-2 p-lr-10">
                                                <CheckBox 
                                                  className={`zee-checkbox-field auto-${permissionObj.Module.split(' ').join('')}-${data.split(' ').join('')}`}
                                                  handleCheckBox={(event, value) =>
                                                  this.selectCheckBox(event, moduleObj.ParentModule, permissionObj.Module, data, 'CreateEdit', value)}
                                                  labelPlacement="top" disabled={disabled}
                                                  checked={permissionObj.SubModule[data]['CreateEdit'] ? true : false} />
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </Fragment>
                                )
                              }
                            })}

                          </div>
                        </div>
                      )
                    }
                  })}

                </div>
              }

              <div className="row">
                <div className="col-md-6 col-lg-4 form-save-btn">
                  <ButtonField className="zee-btn-field zee-full" data-test="create-update-role" variant="contained" color="primary"
                    buttonText={'Save'} onClick={this.createUpdateRole} disabled={disabled} />
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    );
  }
};

const actionCreators = dispatch => {
  return {
    createRole: updatedObj => dispatch(roleActions.create_role_action(updatedObj)),
    updateRole: (id, updatedObj) => dispatch(roleActions.update_roles_action(id, updatedObj))
  }
};

export default connect(null, actionCreators)(CreateEditRole);
