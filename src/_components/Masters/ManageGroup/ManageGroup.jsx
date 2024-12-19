import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import MenuItem from "@material-ui/core/MenuItem";

//icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import CloseIcon from "images/close-icon.svg";
import CheckCircleIcon from "images/check-circle-icon.svg";

//Helper Files
import DropDown from "../../Common/DropDown/DropDown";
import InputField from "../../Common/InputField/InputField";
import ButtonField from "../../Common/ButtonField/ButtonField";
import { masterConstants } from "../master.constant";
import { userActions } from "../../../_actions/user.action";
import { history } from "../../../_helpers/history";
import { titleCase } from "../../../_helpers/util";
import GroupTable from "./GroupTable/GroupTable";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import {
  formValidityCheck,
  DEFAULT_JSON,
} from "../../Common/FormHelper/FormValidSetter";
//Json
import ManageGroupJson from "./Schema/ManageGroup.json";
//Css
import "./ManageGroup.css";

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
        {status == "Active" ?  "Inactive" : "Active" }
      </MenuItem>
    </DropDown>
  );
};

class ManageGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesArr: [],
      JSONSchema: DEFAULT_JSON(ManageGroupJson) || [],
      formIsValid: false,
      availableSearch: "",
      assignedSearch: "",
      selectedCountries: [],
      mode: null,
      isDisabled: true,
      Description: "",
      GroupName: "",
    };
  }

  componentDidMount() {
    const paramsString = this.props.location?.search;
    const params = new URLSearchParams(paramsString);
    const mode = params.get("mode");
    const { location } = this.props;
    if (location?.state && ["Create", "View", "Edit"].some((e) => e === mode)) {
      this.props.fetchCountries();
      let selected = [];
      let groupName = "";
      let description = "";
      let copyJson = [...this.state.JSONSchema];
      const { data, apiKey } = location?.state || {};
      if (mode === "Edit") {
        groupName = data?.title || "";
        description = data?.description || "";
        copyJson.forEach((item) => {
          item.value = data[item?.name] || "";
          //check validity
          const { isValid, errorText } = checkValidity(
            item.value,
            item.validation
          );
          item.valid = isValid;
          item.errorText = errorText;
          //updated element's touched property
          item.touched = 1;
        });
      }
      const { formValidity } = formValidityCheck(copyJson);
      this.setState({
        mode: mode,
        data: data,
        apiKey: apiKey,
        selectedCountries: selected,
        Description: description,
        JSONSchema: copyJson,
        formIsValid: formValidity,
        GroupName: groupName,
        isDisabled: mode !== "Edit",
      });
    } else {
      history.push("/manage-masters?module=CountryGroup");
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let { countriesArr } = nextProps;
      this.setState({
        countriesArr: countriesArr || [],
      }, this.setSelectedCountries);
  };
  setSelectedCountries = () => {
    const { countriesArr, mode, data } = this.state;
    if(mode === "Edit" || mode === "View"){
     const selected =  countriesArr.filter( 
        (item) => data?.countries.includes(item?.id)
      ) || [];
     
      this.setState({selectedCountries : selected});
    }
  }
  formatDate = dateString => {
    const date = new Date(dateString);
    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];   
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    let year = date.getFullYear();
    return ` ${day} ${monthName} ${year}`;  
  }
  InputChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value =
        updatedElement.type === "checkbox"
          ? event.target.checked
          : (event.target.value.trim() ? event.target.value : event.target.value.trim());
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    //updated element's touched property
    updatedElement.touched = 1;
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({ JSONSchema: copyJSON, formIsValid: formValidity });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleCreateEditGroup = async () => {
    const { createMaster, updateMaster, location } = this.props;
    const { pathname, search } = location;
    const apiKey = "CountryGroup";
    const successPath = "/manage-masters?module=CountryGroup";
    const errPath = pathname + search;
    const postObj = {};
    const {
      selectedCountries,
      formIsValid,
      JSONSchema,
      mode,
      data,
    } = this.state;
    if (selectedCountries.length !== 0 && formIsValid) {
      JSONSchema.forEach((item) => {
        postObj[item?.name] = (item?.name === "title") ? titleCase(item?.value) : item?.value;
      });
      postObj.countries = selectedCountries.map(e => e.id);
      postObj.type = apiKey;
      if (mode === "Create") {
        createMaster(postObj, successPath, errPath);
      } else {
        const res = await updateMaster(
          data.id,
          postObj,
          successPath,
          errPath
        );
      }
    }
  };
  handleRoute = (route) => {
    history.push(route);
  };
  handleRowSelectAll = (event) => {
    const { countriesArr, mode, data } = this.state;
    const copySelected = mode === "Edit" ? data?.countries || [] : [];
    const availableCountries = countriesArr.filter(
      (item) => (item?.is_group_assigned === false)
    );
    const availableWithSelected = [...availableCountries, ...copySelected];
    if (event.target?.checked) {
      this.setState({ selectedCountries: availableWithSelected });
    } else {
      this.setState({ selectedCountries: [] });
    }
  };
  handleRowSelect = (row) => {
    const selectedCopy = [...this.state.selectedCountries];
    const isExist = selectedCopy.some((e) => e.title === row.title);
    if (isExist) {
      const rowIndex = selectedCopy.findIndex(
        (e) => e.title === row.title
      );
      selectedCopy.splice(rowIndex, 1);
    } else {
      selectedCopy.push(row);
    }
    this.setState({ selectedCountries: selectedCopy });
  };
  handleEditStatus = async (status) => {
    const { patchMaster, location } = this.props;
    const { data, apiKey} = this.state;
    const redirectPath = "/manage-masters/country-group?mode=Edit";
    const postObj = {};
    postObj.status = status;
    const res = await patchMaster(data?.id, apiKey, postObj, redirectPath, redirectPath);
    if(res){
      const copyData = { ...this.state.data };
      copyData.status = status;
      this.setState({ data: copyData });
    }
  };
  handleRemoveAssigned = (title) => {
    const copySelected = [...this.state.selectedCountries];
    const findIndex = copySelected.findIndex(
      (e) => e.title === title
    );
    copySelected.splice(findIndex, 1);
    this.setState({ selectedCountries: copySelected });
  };
  render() {
    let {
      countriesArr,
      mode,
      formIsValid,
      JSONSchema,
      data,
      availableSearch,
      selectedCountries,
      assignedSearch,
    } = this.state;
    const joinName = (obj) => {
      if(obj?.first_name && obj?.last_name){
        return `${obj?.first_name} ${obj?.last_name}`;
      }
      else {
        return '';
      }
    }
    const copySelected = mode === "Edit" ? countriesArr.filter( 
      (item) => data?.countries.includes(item?.id)
    ) || [] : [];
    const availableCountries = countriesArr.filter(
      (item) => (item?.is_group_assigned === false)
    );
    const availableWithSelected =
      mode === "View"
        ? countriesArr.filter((item) => data?.countries.includes(item?.id)) || []
        : [...availableCountries, ...copySelected];
    const availableData = availableWithSelected.filter((item) => {
      const searchItem = `${item?.title}`;
      return searchItem
        .toLowerCase()
        .includes(availableSearch.toString().toLowerCase());
    });
    const assignedData = selectedCountries?.filter((item) => {
      const searchItem = `${item?.title}`;
      return searchItem
        .toLowerCase()
        .includes(assignedSearch.toString().toLowerCase());
    });
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
                  this.handleRoute("/manage-masters?module=CountryGroup")
                }
              >
                {"Country Grouping"}
              </Link>
              <Typography color="textPrimary">{`${mode} Group`}</Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn auto-back-btn">
              <span
                 data-test="manage-master-backbtn"
                onClick={() =>
                  this.handleRoute("/manage-masters?module=CountryGroup")
                }
              >
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{`${mode} Group`}</span>
              </strong>
            </div>
          </div>

          <div className="create-u-form p-detail-w">
            <div className="create-u-head flex align-items-center justify-content-between">
              <div className="l-title">{"Group Details"}</div>
              {mode === "Edit" && (
                <div className="l-title flex justify-content-between">
                  {"Change Status"}
                  <div
                    className={
                      data?.status == "1"
                        ? "ml-10 status-dropdown val"
                        : "ml-10 status-dropdown val inactive"
                    }
                  >
                    <CustomDropdown
                      status={
                        data?.status === "1"
                          ? "Active"
                          : "Inactive"     
                      }
                      statusChanger={this.handleEditStatus}
                    />
                  </div>
                </div>
              )}
              {mode === "View" && (
                <div className="p-status">
                  <span className="text">Profile Status</span>
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
              )}
            </div>
            <div className="countrybox">
              {mode === "View" && (
                <div className="row input-space-35">
                  <div className="col-md-6 col-lg-4">
                    <div className="pb-20 flex align-items-center">
                      <div className="l-title">{"Group Name "}</div>
                      <div className="l-value">{data?.title}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="pb-20 flex align-items-center">
                      <div className="l-title">{"Description "}</div>
                      <div className="l-value">{data?.description}</div>
                    </div>
                  </div>
                </div>
              )}
              {mode !== "View" && (
                <div className="row input-space-35">
                  <FormRender form={JSONSchema} onChange={this.InputChanger} />
                </div>
              )}
              {/* Country Blocks */}
              <div className="row">
                <div className="col-md-12 col-lg-6 available-sec">
                  <div className="whitebox h-100">
                    <div className="create-u-head flex align-items-center justify-content-between">
                      <div className="l-title">{mode==="View"? "Assigned Countries" :"Available Countries"}</div>
                    </div>
                    <div className="countrylist">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <InputField
                            name={"availableSearch"}
                            className="zee-input-field zee-input-h-40"
                            value={availableSearch}
                            onChange={this.handleChange}
                            label="Search Country"
                          />
                        </div>
                      </div>
                      <div className="con-grouptable">
                        {availableData && (
                          <GroupTable
                            selectMode={mode !== "View"}
                            rows={availableData}
                            selectedArr={selectedCountries}
                            handleSelect={this.handleRowSelect}
                            handleSelectAll={this.handleRowSelectAll}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {mode !== "View" && (
                  <div className="col-md-12 col-lg-6 assigned-sec">
                    <div className="whitebox">
                      <div className="create-u-head flex align-items-center justify-content-between">
                        <div className="l-title">{"Assigned Countries"}</div>
                      </div>
                      {selectedCountries.length === 0 ? (
                        <div className="countrylist blank flex align-items-center justify-content-center">
                          <div className="text-center empty-counrty-list">
                            <h4>You haven't selected any country yet.</h4>
                            <p>
                              Please select country's from available country to
                              get assigned.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="countrylist">
                          <div className="row">
                            <div className="col-md-6 col-lg-6">
                              <InputField
                                name={"assignedSearch"}
                                className="zee-input-field zee-input-h-40 auto-search"
                                value={assignedSearch}
                                onChange={this.handleChange}
                                label="Search Country"
                              />
                            </div>
                          </div>
                          <div className="con-grouptable">
                            <GroupTable
                              selectMode={false}
                              actionRemove={true}
                              rows={assignedData}
                              selectedArr={[]}
                              removeHandler={this.handleRemoveAssigned}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {mode !== "View" && (
                <div className="pt-20 row">
                  <div className="col-md-6 col-lg-4 form-save-btn">
                    <ButtonField
                      className="zee-btn-field zee-full"
                      variant="contained"
                      color="primary"
                      disabled={
                        formIsValid === false || selectedCountries.length === 0
                      }
                      onClick={this.handleCreateEditGroup}
                      buttonText={"Save"}
                    />
                  </div>
                </div>
              )}
            </div>
            {mode === "View" && (
              <div className="u-detail-footer flex align-items-center">
                <div className="created-by">
                  <span className="text">Created By</span>
                  <span className="value">{joinName(data?.created_by)}</span>
                  <span className="m-l-20">
                    {data?._modified_on && this.formatDate(data?._created_on)}
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

const mapStateToProps = (state) => {
  let { countriesArr } = state.user_reducer;
  return {
    countriesArr,
  };
};

const actionCreators = {
  fetchCountries: userActions.fetch_countries_action,
  createMaster: userActions.create_master_action,
  updateMaster: userActions.update_master_action,
  patchMaster: userActions.patch_master_action,
};

export default connect(mapStateToProps, actionCreators)(ManageGroup);
