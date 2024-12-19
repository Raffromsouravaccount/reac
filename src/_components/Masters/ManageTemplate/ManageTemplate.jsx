import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";

//icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import CloseIcon from "images/close-icon.svg";
import CheckCircleIcon from "images/check-circle-icon.svg";

//Helper Files
import {
  INCREASE_REQUEST,
  DECREASE_REQUEST,
} from "../../../_constants/common.constants";
import Config from "../../../Config/config";
import DropDown from "../../Common/DropDown/DropDown";
import ButtonField from "../../Common/ButtonField/ButtonField";
import { masterConstants } from "../master.constant";
import { userActions } from "../../../_actions/user.action";
import { history } from "../../../_helpers/history";
import { permissionObj } from "../../../_helpers/permission";
import { titleCase , getSelectedGroup} from "../../../_helpers/util";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import {
  formValidityCheck,
  isValidatedForm,
  DEFAULT_JSON,
} from "../../Common/FormHelper/FormValidSetter";
//Json
import TemplateJson from "./Schema/Template.json";
import LicenseJson from "./Schema/License.json";
//Services
import { apiCalls } from "../../../_services/common.service";
//Css
import "./ManageTemplate.css";

const CustomDropdown = ({ statusChanger, status }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropDown
      open={open}
      buttonText={status}
      handleClose={() => setOpen(!open)}
      handleOpenClose={() => setOpen(!open)}
    >
      <MenuItem
        onClick={() => {
          setOpen(!open);
          statusChanger(status == "Active" ? "0" : "1");
        }}
      >
        {status == "Active" ? "Inactive" : "Active"}
      </MenuItem>
    </DropDown>
  );
};
let DEAFULT_LicenseJson = JSON.stringify(LicenseJson);
const DEFAULT_LICENSE = (json) => {
  const JSONArr = [];
  const OBJ = {};
  OBJ.name = "License";
  OBJ.data = json;
  JSONArr.push(OBJ);
  return JSONArr;
};
const uuidWiseArray = (arr) => {
  if(Array.isArray(arr)){
    return arr.map(item => item?.id);
  }
  else {
    return arr?.id;
  }
}
class ManageTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesArr: [],
      JSONSchema: DEFAULT_JSON(TemplateJson) || [],
      LicenseSchema: DEFAULT_LICENSE(JSON.parse(DEAFULT_LicenseJson)) || [],
      formIsValid: false,
      templateIsValid: false,
      mode: null,
      moduleName: "",
      buttonText: "",
      apiKey: "",
      isDisabled: true,
    };
  }

  componentDidMount() {
    const paramsString = this.props.location?.search;
    const params = new URLSearchParams(paramsString);
    const mode = params.get("mode");
    const { location } = this.props;
    if (location?.state && ["Create", "View", "Edit"].some((e) => e === mode)) {
      const { data, moduleName, buttonText, apiKey  } = location?.state || {};
      this.setState({
        mode: mode,
        data: data,
        moduleName: moduleName,
        buttonText: buttonText,
        apiKey: apiKey,
        isDisabled: mode !== "Edit",
      });
      if (mode !== "View") {
        this.setOptions(mode, data);
      }
    } else {
      history.push("/manage-masters?module=LicenceTemplate");
    }
  }
  setOptions = async (mode, data) => {
    const { LicenseSchema, JSONSchema } = this.state;
    const objectWiseArr = (mainArr, idArr) => {
      if(mainArr){
        if(Array.isArray(idArr)){
          return mainArr?.filter( item => uuidWiseArray(idArr).includes(item?.id));
        }
        else{
          return mainArr[mainArr?.findIndex( item => item?.id === idArr?.id)];
        }

      }
      else{
        return mainArr;
      }

    }
    let templateValid = false;
    let formValid = false;
    const copy = [...LicenseSchema];
    const copyJsonSchema = [...JSONSchema];
    const copyData = [...copy[0].data];
    const Groups = (await this.fetchMaster("CountryGroup")) || [];
    const BusinessType = (await this.fetchMaster("BusinessType")) || [];
    const BillingType = (await this.fetchMaster("BillingType")) || [];
    const TVODTier = (await this.fetchMaster("TVODTier")) || [];
    const Platform = (await this.fetchMaster("Platform")) || [];
    const GroupName = [];
    Groups.forEach((group) => {
      group?.countries?.forEach((item) => {
        const obj = { ...item };
        obj.group = group?.title;
        GroupName.push(obj);
      });
    });
    //Setting data
    copyData[0].data = GroupName;
    copyData[1].data = BusinessType;
    copyData[2].data = BillingType;
    copyData[3].data = TVODTier;
    copyData[4].data = Platform;
    DEAFULT_LicenseJson = JSON.stringify(copyData);
    if (mode === "Edit" && data?.licenceTemplateDetails) {
      data.licenceTemplateDetails= data?.licenceTemplateDetails.sort((data1, data2)=> {
        return new Date(data1.createdOn) - new Date(data2.createdOn);
      });
      copyJsonSchema[0].value = data?.title;
      copyJsonSchema[0].touched = data?.title ? 1 : 0;
      const { formValidity } = isValidatedForm(copyJsonSchema);
      formValid = formValidity;
      //Setting values
      data?.licenceTemplateDetails.forEach((template, index) => {
        const {
          id = null,
          countryId = null,
          BusinessType = null,
          BillingType = null,
          TVODTier = null,
          platformId = null,
        } = template || {};
        if (index === 0) {
          if(id){
            copy[0].id = id;
          }
          copyData[0].value = countryId ? objectWiseArr(copyData[0]?.data, countryId) : null;
          copyData[1].value = BusinessType ? objectWiseArr(copyData[1]?.data, BusinessType): null;
          copyData[2].value = BillingType ? objectWiseArr(copyData[2]?.data, BillingType) : null;
          copyData[3].value = TVODTier ? objectWiseArr(copyData[3]?.data, TVODTier) : null;
          copyData[4].value = platformId ? objectWiseArr(copyData[4]?.data, platformId) : null;
          //touched
          copyData[0].touched = 1;
          copyData[1].touched = 1;
          copyData[2].touched = 1;
          copyData[3].touched = 1;
          copyData[4].touched = 1;
          if (
            BusinessType?.title === "Premium" ||
            BusinessType?.title === "premium_downloadable"
          ) {
            copyData[2].display = true;
          }
        } else {
          const copyNewLicense = DEFAULT_LICENSE(
            JSON.parse(DEAFULT_LicenseJson)
          );
          const copyNewObj = { ...copyNewLicense[0] };
          const copyNewData = [...copyNewObj.data];
          if(id){
            copyNewObj.id = id;
          }
          copyNewData[0].value = countryId ? objectWiseArr(copyNewData[0]?.data, countryId) : null;
          copyNewData[1].value = BusinessType ? objectWiseArr(copyNewData[1]?.data, BusinessType) : null;
          copyNewData[2].value = BillingType ? objectWiseArr(copyNewData[2]?.data, BillingType) : null;
          copyNewData[3].value = TVODTier ? objectWiseArr(copyNewData[3]?.data, TVODTier) : null;
          copyNewData[4].value = platformId ? objectWiseArr(copyNewData[4]?.data, platformId) : null;
          copyNewData[0].touched = 1;
          copyNewData[1].touched = 1;
          copyNewData[2].touched = 1;
          copyNewData[3].touched = 1;
          copyNewData[4].touched = 1;
          if (
            BusinessType?.title === "Premium" ||
            BusinessType?.title === "premium_downloadable"
          ) {
            copyNewData[2].display = true;
          }
          copy.push(copyNewObj);
        }
      });
      copy.forEach((item) => {
        const { formValidity } = formValidityCheck(item.data);
        templateValid = formValidity;
      });
    }
    this.setState({
      JSONSchema,
      copyJsonSchema,
      LicenseSchema: copy,
      templateIsValid: templateValid,
      formIsValid: formValid,
    });
  };
  fetchMaster = async (type) => {
    this.props.INCREASE_REQUEST();
    const url = `${Config.masterUrl}/${type}`;
    const res = await apiCalls(url, "GET", {});
    this.props.DECREASE_REQUEST();
    return res;
  };
  formatDate = (dateString) => {
    const date = new Date(dateString);
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    let year = date.getFullYear();
    return ` ${day} ${monthName} ${year}`;
  };
  TitleChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else if(updatedElement) {
      updatedElement.value =
        updatedElement?.type === "checkbox"
          ? event.target.checked
          : (event.target.value.trim() ? event.target.value : event.target.value.trim());
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
    if(updatedElement){
      updatedElement.valid = isValid;
      updatedElement.errorText = errorText;
       //updated element's touched property
       updatedElement.touched = 1;
    }
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({ JSONSchema: copyJSON, formIsValid: formValidity });
  };
  LicenseChanger = (event, innerIndex, outerIndex) => {
    let valid = true;
    const copyJSON = [...this.state.LicenseSchema];
    const updatedLicense = copyJSON[outerIndex];
    const updatedElement = updatedLicense?.data;
    if(updatedElement){
      updatedElement[innerIndex].value = event.target.value;
      //updated element's touched property
      updatedElement[innerIndex].touched = 1;
    }
    copyJSON.forEach((item) => {
      const { formValidity } = formValidityCheck(item.data);
      valid = valid && formValidity;
    });
    //Check Business Condition
    if (updatedElement ? updatedElement[innerIndex].name === "BussinessType" : "") {
      if (
        event.target.value?.title !== "Premium" &&
        event.target.value?.title !== "premium_downloadable"
      ) {
        updatedElement[2].display = false;
      } else {
        updatedElement[2].display = true;
      }
    }
    this.setState({ LicenseSchema: copyJSON, templateIsValid: valid });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleSave = async () => {
    const { JSONSchema, LicenseSchema, mode, data } = this.state;
    const {
      createMaster,
      updateMaster,
      INCREASE_REQUEST,
      DECREASE_REQUEST,
    } = this.props;
    let successPath, errPath;
    successPath = errPath = "/manage-masters?module=LicenceTemplate";
    const obj = {};
    obj.title = JSONSchema[0].value;
    obj.type = "LicenceTemplate";
    obj.licenceTemplateDetails = [];
    LicenseSchema.forEach((item, index) => {
      const templateObj = {};
      if(item?.id){
        templateObj.id = item?.id;
      }
      templateObj.countryId = uuidWiseArray(item.data[0].value);
      templateObj.businessTypeId = uuidWiseArray(item.data[1].value);
      templateObj.billingTypeId = item.data[2].value ? uuidWiseArray(item.data[2].value) : "";
      templateObj.tvodTierId = item.data[3].value ? uuidWiseArray(item.data[3].value) : "";
      templateObj.platformId = item.data[4].value ? uuidWiseArray(item.data[4].value) : [];
      obj?.licenceTemplateDetails.push(templateObj);
    });

    if (mode === "Create") {
      INCREASE_REQUEST();
      createMaster(obj, successPath, errPath);
      DECREASE_REQUEST();
    } else {
      INCREASE_REQUEST();
      updateMaster(data?.id, obj, successPath, errPath);
      DECREASE_REQUEST();
    }
  };
  handleAddRemoveLicense = (index) => {
    if (index === 0) {
      this.addLicense();
    } else {
      this.removeLicense(index);
    }
  };
  addLicense = () => {
    const OBJ = {};
    OBJ.name = "License";
    OBJ.data = JSON.parse(DEAFULT_LicenseJson);
    const copyLicenseSchema = [...this.state.LicenseSchema];
    copyLicenseSchema.push(OBJ);
    this.setState({ LicenseSchema: copyLicenseSchema, templateIsValid: false });
  };
  removeLicense = async (selected) => {
    let valid = true;
    const copyLicenseSchema = [...this.state.LicenseSchema];
    const copySelected = copyLicenseSchema[selected];
    if(copySelected?.id){
      const res =  await this.patchRemoveLicense(copySelected?.id);
      if(res){
          copyLicenseSchema.splice(selected, 1);
          copyLicenseSchema.forEach((item) => {
            const { formValidity } = formValidityCheck(item.data);
            valid = valid && formValidity;
          });
      }
    }
    else {
      copyLicenseSchema.splice(selected, 1);
      copyLicenseSchema.forEach((item) => {
        const { formValidity } = formValidityCheck(item.data);
        valid = valid && formValidity;
      });
    }
    this.setState({ LicenseSchema: copyLicenseSchema, templateIsValid: valid });
  };
  handleRoute = (route) => {
    history.push(route);
  };
  patchRemoveLicense = async (id) => {
    const { patchMaster } = this.props;
    const apiType = "LicenceTemplateDetails";
    const redirectPath = "/manage-masters/template?mode=Edit";
    const postObj = {};
    postObj.status = "2";
    const res = await patchMaster(id, apiType, postObj, redirectPath, redirectPath);
    return res;
  };
  handleEditStatus = async (status) => {
    const { patchMaster } = this.props;
    const { data, apiKey} = this.state;
    const redirectPath = "/manage-masters/template?mode=Edit";
    const postObj = {};
    postObj.status = status;
    const res = await patchMaster(data?.id, apiKey, postObj, redirectPath, redirectPath);
    if(res){
      const copyData = { ...this.state.data };
      copyData.status = status;
      this.setState({ data: copyData });
    }
  };
  selectGroup = (event, group, index) => {
    let valid = false;
    const { LicenseSchema } = this.state;
    const copyLicense = [...LicenseSchema];
    const copyLicenseIndex = { ...copyLicense[index] };
    const copyLicenseForm = [...copyLicenseIndex.data];
    const copyElement = { ...copyLicenseForm[0] };
    const copyOptions = [...copyElement.data];
    copyElement.value = getSelectedGroup(event, group, copyOptions, copyElement.value);

    copyLicense[index].data[0] = copyElement;
    copyLicense.forEach((item) => {
      const { formValidity } = formValidityCheck(item.data);
      valid = formValidity;
    });
    this.setState({ LicenseSchema: copyLicense, templateIsValid: valid });
  };
  handleEditPath = () => {
    const { data } = this.state;
    this.setState({mode: "Edit"});
    this.setOptions("Edit", data);
    const { location, history } = window;
    const newUrl = location.protocol + "//" + location.host + location.pathname + '?mode=Edit';
    history.pushState({path: newUrl},'',newUrl);
  };
  render() {
    let {
      moduleName,
      buttonText,
      apiKey,
      mode,
      formIsValid,
      templateIsValid,
      JSONSchema,
      LicenseSchema,
      data,
    } = this.state;
    const { canCreate } = permissionObj?.masters;
    const joinName = (obj) => {
      if(obj?.first_name && obj?.last_name){
        return `${obj?.first_name} ${obj?.last_name}`;
      }
      else {
        return '';
      }
    }
    return (
      <div>
        <div className="countrygroup d-wrap c-n">
          <div className="bread-crumb top-minus-20">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link
                data-test="masters"
                color="inherit"
                onClick={() => this.handleRoute("/masters")}
              >
                {masterConstants.masterHeader}
              </Link>
              <Link
                data-test="master-module"
                color="inherit"
                onClick={() =>
                  this.handleRoute(`/manage-masters?module=${apiKey}`)
                }
              >
                {moduleName}
              </Link>
              <Typography color="textPrimary">{`${mode} ${buttonText}`}</Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn auto-back-btn">
              <span
                data-test="manage-master-backbtn"
                onClick={() =>
                  this.handleRoute(`/manage-masters?module=${apiKey}`)
                }
              >
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{`${mode} ${buttonText}`}</span>
              </strong>
            </div>
          </div>

          <div className="create-u-form p-detail-w">
            <div
              className={
                mode === "View"
                  ? "create-u-head flex align-items-center justify-content-between"
                  : "create-u-head flex align-items-center justify-content-between m-b-30"
              }
            >
              <div className="l-title">{"Template Details"}</div>
              {mode === "Edit" && (
                <div className="l-title flex justify-content-between">
                  {"Change Status"}
                  <div
                    className={
                      data?.status === "0"
                        ? "ml-10 status-dropdown val inactive"
                        : "ml-10 status-dropdown val"
                    }
                  >
                    <CustomDropdown
                      status={
                        data?.status === "0"
                          ? "Inactive"
                          : "Active"
                      }
                      statusChanger={this.handleEditStatus}
                    />
                  </div>
                </div>
              )}
              {mode === "View" && (
              <div className="flex justify-content-between">
                <div className="p-status">
                  <span className="text">Template Status</span>
                  <span
                    className={`val ${
                      data?.status === "1" ? "" : "inactive"
                    }`}
                  >
                    {data?.status == "1" ? (
                      <CheckCircleIcon />
                    ) : (
                      <CloseIcon />
                    )}
                    {data?.status == "1"
                      ? ` ${masterConstants.active}`
                      : ` ${masterConstants.inActive}`}
                  </span>
                </div>
                {canCreate() && <div className="edit-btn m-l-20">
                  <ButtonField
                    buttonText={masterConstants.editTemplate}
                    className="zee-btn-field zee-full MuiButton-containedPrimary"
                    onClick={() => this.handleEditPath()}
                  />
              </div>}
              </div>
              )}
            </div>

            {mode === "View" && (
              <div className="countrybox temp-view">
                <div className="row pb-20 ">
                  <div className="col-md-6 col-lg-4">
                    <div className="p-b-10 flex">
                      <div className="text l-title">{"Template Title "}</div>
                      <div className="l-value">{data?.title}</div>
                    </div>
                  </div>
                </div>
                {data?.licenceTemplateDetails &&
                  data.licenceTemplateDetails.map((template, index) => (
                    <Fragment key={index}>
                      {index !== 0 && (
                        <div className="row m-t-10 m-b-10">
                          <div className="w-100">
                            <Divider />
                          </div>
                        </div>
                      )}
                      <div key={index} className="row ">
                        <div className="col-md-6 col-lg-4">
                          <div className="p-b-10 flex ">
                            <div className="text l-title">
                              {"Country/Grouping "}
                            </div>
                            <div className="l-value">
                              {template?.countryId.map(
                                (item) => item?.title
                              ).join(", ")}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <div className="p-b-10 flex ">
                            <div className="text l-title">
                              {"Business Type "}
                            </div>
                            <div className="l-value">
                              {template?.BusinessType?.title}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <div className="p-b-10 flex ">
                            <div className="text l-title">{"TVOD Tier "}</div>
                            <div className="l-value">
                              {template?.TVODTier?.title}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <div className="p-b-10 flex">
                            <div className="text l-title">{"Platform "}</div>
                            <div className="l-value">
                              {template?.platformId.map(
                                (item) => item?.title
                              ).join(", ")}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <div className="p-b-10 flex">
                            <div className="text l-title">
                              {"Billing Type "}
                            </div>
                            <div className="l-value">
                              {template?.BillingType?.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
              </div>
            )}

            {mode !== "View" && (
              <div className="flex">
                <FormRender form={JSONSchema} onChange={this.TitleChanger} />
              </div>
            )}

            {mode !== "View" &&
              LicenseSchema.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="create-u-head flex align-items-center justify-content-between m-b-30">
                    <div className="l-title">{`${item.name} ${index + 1}`}</div>
                  </div>
                  <div className="flex repeat-box">
                    <FormRender
                      groupIndex={index}
                      form={item.data}
                      selectGroup={(e, group) =>
                        this.selectGroup(e, group, index)
                      }
                      onChange={(e, inner) =>
                        this.LicenseChanger(e, inner, index)
                      }
                    />
                    <div
                      className={
                        index === 0
                          ? `add-btn create-btn`
                          : `remove-btn create-btn`
                      }
                    >
                      <ButtonField
                        data-test="handleAddRemoveLicense"
                        buttonText={index === 0 ? "+" : "-"}
                        onClick={() => this.handleAddRemoveLicense(index)}
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))}

            {mode !== "View" && (
              <div className="flex pb-20">
                <div className="col-md-6 col-lg-4 form-save-btn">
                  <ButtonField
                    className="zee-btn-field zee-full"
                    variant="contained"
                    color="primary"
                    disabled={!(templateIsValid && formIsValid)}
                    onClick={this.handleSave}
                    buttonText={"Save"}
                  />
                </div>
              </div>
            )}

            {mode === "View" && (
              <div className="u-detail-footer flex align-items-center">
                <div className="created-by">
                  <span className="text">Created By</span>
                  <span className="value">{joinName(data?.created_by)}</span>
                  <span className="m-l-20">
                    {data?._created_on && this.formatDate(data?._created_on)}
                  </span>
                </div>
                <div className="updated-by">
                  <span className="text">Updated By</span>
                  <span className="value">{joinName(data?.modified_by)}</span>
                  <span className="m-l-20">
                    {data?._modified_on && this.formatDate(data?._modified_on)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const actionCreators = {
  createMaster: userActions.create_master_action,
  updateMaster: userActions.update_master_action,
  patchMaster: userActions.patch_master_action,
  INCREASE_REQUEST: () => (dispatch) => {
    dispatch({ type: INCREASE_REQUEST });
  },
  DECREASE_REQUEST: () => (dispatch) => {
    dispatch({ type: DECREASE_REQUEST });
  },
};

export default connect(null, actionCreators)(ManageTemplate);
