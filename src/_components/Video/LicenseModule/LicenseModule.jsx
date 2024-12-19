import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import MenuItem from "@material-ui/core/MenuItem";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import { dateDiffDayCount, checkValidationForMarkAsDoneForLicense } from "../../../_helpers/util";
// Common components
import InputField from "../../Common/InputField/InputField";
import ButtonField from "../../Common/ButtonField/ButtonField";
import DropDown from "../../Common/DropDown/DropDown";
import { CommonModel } from "../../Common/Model/CommonModel";
import Lock from "../../Common/Locked/Locked";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import {
  isValidatedForm,
  checkDateValidation,
} from "../../Common/FormHelper/FormValidSetter";
import { DEFAULT_JSON } from "../../../_helpers/util";
import { userService } from "../../../_services/user.service";

// helpers
import LockedPopup from "../LockedPopup";

import { history } from "../../../_helpers/history";
import { constantText } from "../../../_helpers/constants.text";
import { getLocalData } from "../../../_helpers/util";

// actions
import { videoMgmtActions } from "../../../_actions/videoMgmt.action";
// services
import { edit_licence_service } from "../../../_services/videoMgmt.service";


// images
import MarkDone from "images/tick.svg";
import FilterIcon from "images/filter-icon.svg";
import Edit from "images/edit.svg";
import TimetableIcon from "images/timetable-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import CountryRegionGrouping from "images/CountryRegionGrouping.svg";
//css
import '../../../../public/css/Common/License.css';

import { apiCalls } from "../../../_services/common.service";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

const CustomDropdown = ({ statusChanger, status, licenseData }) => {
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
          statusChanger(
            status == "Active" ? "InActive" : "Active",
            licenseData
          );
        }}
      >
        {status == "Active" ? "Inactive License" : "Activate License"}
      </MenuItem>
    </DropDown>
  );
};

class LicenseModule extends Component {
  constructor(props) {
    super(props);
    let { state } = this.props;
    let { currentTabData, stage } = this.props;
    this.state = {
      contentId: this.props.contentId,
      language: this.props.language,
      searchString: "",
      showFilterDrawer: false,
      manualJsonSchema: [],
      commonmodel_section: [],
      statusFilter: "",
      templateJsonSchema: [],
      templateJsonEditSchema: [],
      JSONSchema: [],
      formData: {
        reason: "",
        currentStatus: "",
        uuid: "",
        fromDate: "",
        toDate: "",
        country: "",
        businessType: "",
        billingType: {},
        tvodTier: "",
        platform: "",
        dateCreated: "",
        createdBy: "",
        updatedBy: "",
      },
      licence_uuid: "",
      licenseList: [],
      businessTypeList: [],
      billingTypeList: [],
      platformsList: [],
      limit: constantText.search_limit,
      showStatePopup: false,
      currentStatus: "",
      expiredLicense: "",
      lockedBy: "",
      lockedByEmail: "",
      dateCreated: "",
      markAsDoneForValidation: "",
      filters: {
        searchVal: "",
        status: null,
        sort: "",
        fromDate: "",
        toDate: "",
        country: [],
        platform: [],
        billingType: [],
        businessType: [],
      },
      copyLicenseList: [],
      showStatePopupLock: false,
      filterButton: true,
      error: false,
      errorMsg: "",
      applyFilterKey: false,
      applyFilterText: false,
      reasonErrorMsg: "",
      license: [],
      licenseCount:'',
      allowEdit:true,
    };
  }

  async componentDidMount() {
    const requestedParams = {
      contentId: this.state.contentId,
    };
    await this.getUserDetails();
    this.props.getLicenseData(requestedParams);
  }

  componentWillReceiveProps = (nextProps) => {
    const { jsonData,state } = this.props;
    const { expiredLicense } = this.state
    const checkValidationForMarkAsDone = DEFAULT_JSON(jsonData[0]?.manual_section)
    const requiredLicenseField = []
    for(let jsonFields of checkValidationForMarkAsDone){
      if(jsonFields?.validation?.required){
        requiredLicenseField.push(jsonFields?.name)
        }
    }
    const json = jsonData[0];
    let {search_filter_section, template_section, commonmodel_section}  = json;
    this.setState({
      manualJsonSchema: DEFAULT_JSON(search_filter_section),
      templateJsonSchema: DEFAULT_JSON(template_section),
      templateJsonEditSchema: DEFAULT_JSON(search_filter_section),
      commonmodel_section: DEFAULT_JSON(commonmodel_section)
    });
    const { userID } = getLocalData("userData");
    if (this.props.licenseList != nextProps.licenseList) {
      let localLicenseArray = [];
      if (
        nextProps.licenseList &&
        nextProps.licenseList.data &&
        nextProps.licenseList.data
      ) {
        let licenseCount = nextProps?.licenseList?.data?.license?.length;
        for (
          let itemIndex = 0;
          itemIndex < nextProps.licenseList.data.license.length;
          itemIndex++
        ) {
          let template = nextProps.licenseList.data.license[itemIndex];
          let templateObject = {
            templateId: nextProps.licenseList.data.id,
            billingType: template.BillingType ? template.BillingType : "",
            businessType: template.BusinessType ? template.BusinessType : "",
            country:
              template.countriesId && template.countriesId.length > 0
                ? template.countriesId
                : [],
            fromDate: template.validFrom ? template.validFrom : "",
            platform:
              template.platformId && template.platformId.length > 0
                ? template.platformId
                : [],
            reason: template.reasonType ? template.reasonType : "",
            toDate: template.validUntil ? template.validUntil : "",
            tvodTier: template.TVODTier ? template.TVODTier : "",
            id: template.id ? template.id : "",
            currentStatus: template.status ? template.status : "Active",
            createdBy: template.createdBy ? template.createdBy : "",
            updatedBy: template.updatedBy ? template.updatedBy : "",
            updatedByEmail: template.updatedByEmail
              ? template.updatedByEmail
              : "",
            dateCreated: template.createdOn ? template.createdOn : "",
            setName:template?.setName?template?.setName :"",
            isParentTypeTvod:template?.isParentTypeTvod,
            contentAgeRating:template?.contentAgeRating?.title ? template?.contentAgeRating:"",
            validateCountries :this.validateUserCountries(template?.countriesId),
          };
          localLicenseArray.push(templateObject);
        }
        const markAsDoneValue = checkValidationForMarkAsDoneForLicense(
          localLicenseArray,
          requiredLicenseField
        );
        if (markAsDoneValue && expiredLicense !== 1) {
          this.handleMarkAsDone(false);
        } 
        this.setState({
          licenseList: localLicenseArray,
          copyLicenseList: localLicenseArray,
          licenseCount: licenseCount,
          markAsDoneForValidation: markAsDoneValue,
        });
      } else {
        this.setState({
          licenseList: [],
        });
      }
    }
    if (nextProps.masterRecords) {
      if (nextProps.masterRecords.businessTypeRecords) {
        this.setState({
          businessTypeList: nextProps.masterRecords.businessTypeRecords || [],
        });
      } else if (nextProps.masterRecords.billingTypeRecords) {
        this.setState({
          billingTypeList: nextProps.masterRecords.billingTypeRecords || [],
        });
      } else if (nextProps.masterRecords.platformRecords) {
        this.setState({
          platformsList: nextProps.masterRecords.platformRecords || [],
        });
      }
    }
  };
  removeLock = async () => {
    this.showHideStatePopupLock();
    this.props.unLockedSession(this.props?.selectedTab, false);
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  handleMarkAsDone = (mode) => {
    this.props.markAsDone(this.props?.selectedTab, mode);
  };
  async getUserDetails(){
    const { userID } = getLocalData("userData");
    var userDetail = await userService.user_details_service(userID);
    this.setState({
    userDetails:userDetail
    })
    }

    validateUserCountries = (countriesList)=>{
      let validCountries  = []
      let {userDetails}= this.state
      const countryArray= countriesList?.map((country,index)=>{
        for(let userCountries of userDetails?.countries )
        {
          if(userCountries?.title==country[0].title){
            validCountries.push(userCountries)
          }
        }
        })
        if(validCountries?.length===countriesList?.length){
          return true
        }else{
          return false
        }
    }

  setSelectDataArr = (res, index) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON[index];
    updatedElement.data = res || [];
    this.setState({ manualJsonSchema: copyJSON });
  };
  setSelectDataArrComonArr = (res, index) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.commonmodel_section];
    const updatedElement = copyJSON[index];
    updatedElement.data = res || [];
    this.setState({ commonmodel_section: copyJSON });
  };

  InputChangerCommonable = (event, elemIndex) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.commonmodel_section];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value =
        updatedElement.type === "checkbox"
          ? event.target.checked
          : event.target.value;
    }
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.errorText = errorText;
    updatedElement.touched = 1;

    this.setState({ commonmodel_section: copyJSON, reasonErrorMsg: "" });
  };
  InputChanger = (event, elemIndex) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value =
        updatedElement.type === "checkbox"
          ? event.target.checked
          : event.target.value;
    }
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    const fromIndex = copyJSON?.findIndex((e) => e?.name === "fromDate");
    const toIndex = copyJSON?.findIndex((e) => e?.name === "toDate");

    const billingTypeIndex = copyJSON?.findIndex(
      (e) => e?.name === "billingType"
    );
    const businessTypeIndex = copyJSON?.findIndex(
      (e) => e?.name === "businessType"
    );
    const contentAgeRatingIndex = copyJSON?.findIndex(
      (e) => e?.name === "contentAgeRatingId"
    );
    const platformIndex = copyJSON?.findIndex((e) => e?.name === "platform");
    const statusIndex = copyJSON?.findIndex((e) => e?.name === "status");
    let fromDate, toDate;
    if (updatedElement.name === "toDate"||updatedElement.name === "fromDate") {
      copyJSON[fromIndex].errorText = null;
      copyJSON[toIndex].errorText = null;
      fromDate = new Date(copyJSON[fromIndex]?.value).getTime();
      toDate = new Date(copyJSON[toIndex]?.value).getTime();
      const { dateValidation, errorText } = checkDateValidation(
        fromDate,
        toDate
      );
      updatedElement.errorText = errorText;
      updatedElement.toDate = dateValidation;
    }

    let formValidButton = true;
    fromDate = new Date(copyJSON[fromIndex]?.value)?.getTime();
    toDate = new Date(copyJSON[toIndex]?.value)?.getTime();
    const { dateValidation } = checkDateValidation(fromDate, toDate);
    if (fromDate && toDate) {
      formValidButton = dateValidation && formValidButton;
    } else if (
      copyJSON[billingTypeIndex]?.value ||
      copyJSON[businessTypeIndex]?.value ||
      copyJSON[platformIndex]?.value?.length > 0 ||
      copyJSON[statusIndex]?.value||
      copyJSON[contentAgeRatingIndex]?.value
    ) {
      formValidButton = false;
    }
    updatedElement.touched = 1;
    this.setState({
      manualJsonSchema: copyJSON,
      filterButton: formValidButton,
    });
  };

  InputChanger2 = (event, elemIndex) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value =
        updatedElement.type === "checkbox"
          ? event.target.checked
          : event.target.value;
    }
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    updatedElement.touched = 1;
    this.setState({ manualJsonSchema: copyJSON });

    let { filters } = this.state;
    const {
      searchVal,
      platform,
      billingType,
      businessType,
      fromDate,
      toDate,
      status,
    } = filters;
  };

  async getBusinessType(type, masterType) {
    await this.props.getBusinessTypes(type, masterType);
  }

  async getBillingType(type, masterType) {
    await this.props.getBillingTypes(type, masterType);
  }

  async getPlatform(type, masterType) {
    await this.props.getPlatforms(type, masterType);
  }

  handleRoute = (route, detail) => {
    history.push(route, detail);
  };
  openCountryPermissionModal = ()=>{
    this.setState({allowEdit:false})
  }

  showHideFilterDrawer = () => {
    let { searchVal } = this.state.filters;

    this.setState({ filters: { searchVal: "" } });
    let { showFilterDrawer } = this.state;
    this.setState({
      showFilterDrawer: !showFilterDrawer,
    });
  };

  handleEditStatus = (status, licenseData) => {
    const { formData, contentId } = this.state;
    formData.fromDate = licenseData?.fromDate;
    formData.toDate = licenseData?.toDate;
    formData.country = licenseData?.country?.title;
    formData.businessType = licenseData?.businessType;
    formData.billingType = licenseData?.billingType;
    formData.tvodTier = licenseData?.tvodTier;
    formData.platform = licenseData?.platform;
    formData.id = licenseData?.id;
    formData.currentStatus = status;
    formData.dateCreated = licenseData?.dateCreated;
    formData.createdBy = licenseData?.createdBy;
    formData.updatedBy = licenseData?.updatedBy;
    formData.updatedByEmail = licenseData?.updatedByEmail;
    formData.setName = licenseData?.setName
    this.setState(
      {
        currentStatus: status,
        dateCreated: licenseData?.dateCreated,
        applyFilterKey: false,
        formData: {
          ...formData,
        },
      },
      () => {
        this.showHideStatePopup(licenseData?.id);
      }
    );
  };

  activateDeactivateLicence = async () => {
    this.handleMarkAsDone(false);
    const {
      licence_uuid,
      contentId,
      currentStatus,
      language,
      commonmodel_section,
    } = this.state;
    let copyData = [...commonmodel_section];
    const { formValidity, validatedForm } = isValidatedForm(copyData);
    let getReasonData = {};
    copyData.map((data, index) => {
      getReasonData[data.name] = data.value;
    });
    const requestedData = {
      status: currentStatus,
      reasonType: getReasonData?.reason?.id,
    };
    if (currentStatus === "Active") {
      var response = await edit_licence_service(
        licence_uuid,
        contentId,
        requestedData
      );
      if (response) {
        this.showHideStatePopup();
        const requestedParams = {
          contentId: contentId,
          language: language,
        };
        this.props.getLicenseData(requestedParams);
        this.setState({ reasonErrorMsg: "" });
      }
    } else {
      if (
        getReasonData &&
        getReasonData?.reason &&
        (getReasonData?.reason?.id).length
      ) {
        var response = await edit_licence_service(
          licence_uuid,
          contentId,
          requestedData
        );
        if (response) {
          this.showHideStatePopup();
          const requestedParams = {
            contentId: contentId,
            language: language,
          };
          this.props.getLicenseData(requestedParams);
          this.setState({ reasonErrorMsg: "" });
        }
      } else {
        this.setState({ reasonErrorMsg: constantText.reason_required });
      }
    }
  };

  handleDate = (event) => {
    let { name, value } = event.target;
    let { formData, filters } = this.state;
    this.setState({
      formData: {
        ...formData,
        [name]: value,
      },
      filters: {
        ...filters,
        [name]: value,
      },
    });
  };

  clearFilter = () => {
    let { manualJsonSchema, copyLicenseList } = this.state;
    let searchCopyJSON = manualJsonSchema;
    for (let i = 0; i < searchCopyJSON.length; i++) {
      searchCopyJSON[i].value = "";
    }

    this.setState({
      licenseList: copyLicenseList,
      manualJsonSchema: [...manualJsonSchema],
      applyFilterKey: false,
      filterButton: true,
    });

    this.showHideFilterDrawer();
  };
  getFilterDrawerUI = () => {
    let { manualJsonSchema } = this.state;
    const { filterButton } = this.state;
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{constantText.filters_header_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            {manualJsonSchema?.length && (
              <FormRender
                form={manualJsonSchema}
                onChange={this.InputChanger}
                handleBlur={this.autoSave}
                setSelectDataArr={this.setSelectDataArr}
                serverCall={true}
              />
            )}
          </div>
        </div>

        <div className="bottom-w filter-btn">
          <ButtonField
            color="secondary"
            className="apply-btn"
            disabled={filterButton}
            buttonText={constantText.apply_filter_text}
            onClick={() => {
              this.applyFilterForDrawer();
              this.showHideFilterDrawer();
            }}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            buttonText={constantText.clear_text}
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };

  showHideStatePopup = (data) => {
    let { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup,
      licence_uuid: data,
      reasonErrorMsg: "",
    });
  };

  showHideStatePopupLock = (data) => {
    let { showStatePopupLock } = this.state;
    this.setState({
      showStatePopupLock: !showStatePopupLock,
      licence_uuid: data,
    });
  };

  getExpiredLicense = () => {
    const { contentId, language } = this.props;
    this.setState({
      expiredLicense: "1",
    });
    const tvShowId = this.state.contentId;
    const requestedParams = {
      contentId: tvShowId,
      language: language,
      expired: "all",
    };
    this.props.getLicenseData(requestedParams);
  };

  handleExpiredLicence = () => {
    const { contentId, language } = this.state;
    this.setState(
      {
        expiredLicense: 0,
      },
      () => {
        const requestedParams = {
          contentId: contentId,
          language: language,
        };
        this.props.getLicenseData(requestedParams);
      }
    );
  };

  applyFilterForDrawer = (event) => {
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON;
    this.setState({ manualJsonSchema: copyJSON });
    const validateObj = {};
    updatedElement.forEach((item) => {
      validateObj[item.name] = item?.value;
    });
    let { filters } = this.state;
    let { name, value } = event ? event?.target : "";
    this.setState(
      {
        filters: {
          ...filters,
          [name]: value,
        },
      },
      () => this.applyFilter(validateObj)
    );
  };

  applyFilter = (validateObj) => {
    let { filters, copyLicenseList } = this.state;
    let checkFilter;
    if (
      validateObj.fromDate ||
      validateObj.toDate ||
      validateObj.businessType ||
      validateObj.billingType ||
      validateObj.status ||
      validateObj.contentAgeRatingId||
      validateObj?.platform?.length > 0
    ) {
      checkFilter = true;
    } else {
      checkFilter = false;
    }
    let { searchVal } = filters;
    let filteredLicense = searchVal?.length
      ? copyLicenseList?.filter((item) => {
          let isAvailabe = false;
          item.country.forEach((con) => {
            con.forEach((list) => {
              if (
                String(list.title)
                  .toLowerCase()
                  .includes(String(searchVal).toLowerCase())
              ) {
                isAvailabe = true;
              }
            });
          });
          return isAvailabe;
        })
      : copyLicenseList;
    filteredLicense = validateObj?.fromDate
      ? copyLicenseList?.filter(
          (dateExtract) =>
            new Date(dateExtract?.fromDate).toISOString().slice(0, 10) >=
            new Date(validateObj?.fromDate).toISOString().slice(0, 10)
        )
      : filteredLicense;
    filteredLicense = validateObj?.toDate
      ? filteredLicense?.filter(
          (dateExtract) =>
            new Date(dateExtract?.toDate).toISOString().slice(0, 10) <=
            new Date(validateObj?.toDate).toISOString().slice(0, 10)
        )
      : filteredLicense;
    filteredLicense = validateObj?.businessType
      ? filteredLicense.filter(
          (dataExtract) =>
            dataExtract.businessType.title === validateObj.businessType.title
        )
      : filteredLicense;
      filteredLicense = validateObj?.contentAgeRatingId
      ? filteredLicense.filter(
          (dataExtract) =>
            dataExtract.contentAgeRating.title === validateObj.contentAgeRatingId.title
        )
      : filteredLicense;
    filteredLicense = validateObj?.billingType
      ? filteredLicense.filter(
          (dataExtract) =>
            dataExtract.billingType.title === validateObj.billingType.title
        )
      : filteredLicense;
    filteredLicense = validateObj?.status
      ? filteredLicense.filter(
          (template) => template?.currentStatus === validateObj?.status
        )
      : filteredLicense;
    if (validateObj?.platform?.length > 0) {
      filteredLicense = validateObj?.platform
        ? filteredLicense.filter((item) => {
            let isAvailabe = false;
            item?.platform?.forEach((con) => {
              con?.forEach((conItem) => {
                validateObj?.platform.forEach((item) => {
                  if (
                    String(conItem?.title)
                      .toLowerCase()
                      .includes(String(item?.title).toLowerCase())
                  ) {
                    isAvailabe = true;
                  }
                });
              });
            });
            return isAvailabe;
          })
        : filteredLicense;
    }

    this.setState({
      licenseList: filteredLicense,
      applyFilterKey: checkFilter,
      applyFilterText: true,
    });
  };

  applyFilterForCountry = () => {
    let { filters, copyLicenseList, licenseList, applyFilterKey } = this.state;
    let { searchVal } = filters;
    let filteredLicenseListData;
    if (applyFilterKey && applyFilterKey === true) {
      filteredLicenseListData = licenseList;
      if (licenseList.length <= 0) {
        filteredLicenseListData = copyLicenseList;
      }
    } else {
      filteredLicenseListData = copyLicenseList;
    }
    const dataFilter = searchVal.length
      ? filteredLicenseListData.filter((item) => {
          let isAvailabe = false;
          item.country.forEach((con) => {
            con.forEach((list) => {
              if (
                String(list.title)
                  .toLowerCase()
                  .includes(String(searchVal).toLowerCase())
              ) {
                isAvailabe = true;
              }
            });
          });
          return isAvailabe;
        })
      : filteredLicenseListData;
    this.setState({
      licenseList: dataFilter,
    });
  };
  closeCommonModel = ()=>{
    this.setState({allowEdit:true})
  }


  checkValidation = () => {
    const { licenseList } = this.state;
    if (licenseList.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  handleMarkAsDone = (mode) => {
    this.props.markAsDone(this.props?.selectedTab, mode);
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  lockUnlockLicence = async () => {
    this.props.unLockedSession(this.props?.selectedTab);
  };

  render() {
    let {
      filters,
      showFilterDrawer,
      licenseList,
      showStatePopup,
      currentStatus,
      expiredLicense,
      showStatePopupLock,
      applyFilterKey,
      copyList,
      applyFilterText,
      commonmodel_section,
      reasonErrorMsg,
      allowEdit,
      licenseCount,
      markAsDoneForValidation
    } = this.state;
    const { searchVal } = filters;
    const getDayCount = (validUntil) => {
      let days = dateDiffDayCount(validUntil);
      let signDays = Math.sign(days);
      let expDays = dateDiffDayCount(validUntil) <= 5;
      if (signDays > 0 && expDays) {
        return days;
      } else if (signDays === 0 && expDays) {
        return "Today";
      } else {
        return null;
      }
    };

    let { state } = this.props;
    let { currentTabData, stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div className="whitebox">
        <Lock
          lock={isLocked}
          lockedBy={lockedBy}
          clicked={this.showHideStatePopupLock}
        >
          <div className="ccm-head flex align-items-center justify-content-between m-b-30">
            {expiredLicense === "1" ? (
              <Fragment>
                <div
                  className="back-user-btn flex align-items-center"
                  onClick={this.handleExpiredLicence}
                >
                  <div className="Create-License flex align-items-center">
                    <span className="item">
                      <AngleLeftArrow />
                    </span>
                    <span className="item">
                      <strong>{constantText.expired_license}</strong>
                    </span>
                  </div>
                </div>
                <div className="status-head flex alexpiredign-items-center">
                  {stage?.title && (
                    <BadgeBox
                      className="create-movie-stage"
                      status={stage.title}
                    />
                  )}
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="back-user-btn flex align-items-center">
                  <div className="text">
                    <strong>{constantText.license_text}</strong>
                  </div>
                </div>
                <div className="status-head flex align-items-center">
                  {stage?.title && (
                    <BadgeBox
                      className="create-movie-stage"
                      id={isLocked ? "disabled-mark-done-div" : ""}
                      status={stage.title}
                    />
                  )}
                  <div
                    id={isLocked ? "disabled-mark-done-div" : ""}
                    className={`${
                      !isDone && this.checkValidation() && !markAsDoneForValidation
                        ? "mark-done mark-fill-active"
                        : isDone
                        ? "mark-done mark-active"
                        : "mark-done"
                    }`}
                    onClick={() =>
                      this.checkValidation() && !isDone && !isLocked && !markAsDoneForValidation
                        ? this.markAsDone()
                        : {}
                    }
                  >
                    <span>
                      <MarkDone />
                    </span>
                    {constantText.mark_as_done_text}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <div className="col-12 p-b-10">
            <div className="user-head lice-head flex justify-content-between align-items-center">
              <div className="col-md-5 lice-search">
                <InputField
                  name="searchVal"
                  className="zee-input-field zee-input-h-40 m-b-0"
                  value={searchVal}
                  onChange={this.applyFilterForDrawer}
                  label={constantText.search_licence_text}
                  disabled={isLocked}
                />
              </div>
              {expiredLicense === "1" ? (
                ""
              ) : (
                <div className="s-form flex">
                  <div className="filter-w">
                    <ButtonField
                      id={isLocked ? "disabled-mark-done-div" : ""}
                      color="secondary"
                      className="short-btn btn-h-40"
                      buttonText={"Expired License"}
                      onClick={this.getExpiredLicense}
                      disabled={isLocked}
                    />
                    <ButtonField
                      color="secondary"
                      id={isLocked ? "disabled-mark-done-div" : ""}
                      className={
                        applyFilterKey
                          ? "filter-btn btn-h-40 current-active-filter"
                          : "filter-btn btn-h-40"
                      }
                      Icon={FilterIcon}
                      buttonText={"Filters"}
                      onClick={this.showHideFilterDrawer}
                      disabled={isLocked}
                    />
                    {isLocked && isLocked === true ? (
                      <div
                        className="btn-create-user btn-h-40"
                        id={isLocked ? "disabled-mark-done-div" : ""}
                      >
                        {constantText.create_licence}
                      </div>
                    ) : (
                      <div
                        id={isLocked ? "disabled-mark-done-div" : ""}
                        className="btn-create-user btn-h-40"
                        onClick={() => this.props.openLicenseForm()}
                      >
                        {constantText.create_licence}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {licenseList?.length > 0 ? (
              licenseList &&
              licenseList.map((license_item, index) => (
                <div
                  key={index}
                  className="lice-box flex justify-content-between"
                  disabled={isLocked}
                > 
                <div className="lice-title-head">{license_item?.setName?license_item?.setName:""}</div>
                  <div className="left-area">
                    <div className="text-data row">
                      <div className="col-lg-12 col-xl-6 flex">
                        <div className="label">
                          {constantText.licensing_from_text}
                        </div>
                        <div className="text">
                        {license_item?.fromDate ? moment(license_item.fromDate).format(constantText.date_format_for_created_uodated_by) : ""}
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6 flex">
                        <div className="label">
                          {constantText.licensing_to_text}
                        </div>
                        <div className="text">
                        {license_item?.toDate ? moment( license_item.toDate).format(constantText.date_format_for_created_uodated_by) : ""} 
                        </div>
                      </div>
                    </div>
                    <div className="text-data flex">
                      <div className="label">
                        {constantText.licensing_country_text}
                      </div>
                      <div key={index} className="text">
                        {license_item &&
                          license_item?.country
                            ?.map((item, index) =>
                              item[0] ? item[0]?.title : ""
                            )
                            .join(", ")}
                      </div>
                    </div>
                    <div className="text-data flex">
                      <div className="label">{constantText.business_type}</div>
                      <div className="text">
                        {license_item ? license_item.businessType.title : ""}
                      </div>
                    </div>
                    <div className="text-data flex">
                      <div className="label">{constantText.content_age_rating}</div>
                      <div className="text">
                        {license_item ? license_item?.contentAgeRating?.title : ""}
                      </div>
                    </div>
                    {state === "single-landing-page" ||
                    state === "quick-filing" ? (
                      ""
                    ) : (
                      <Fragment>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.license_platform}
                          </div>
                          <div className="text" key={index}>
                            {license_item &&
                              license_item?.platform
                                ?.map((platform_item, index) =>
                                  platform_item[0] ? platform_item[0].title : ""
                                )
                                .join(", ")}
                          </div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.billing_type}
                          </div>
                          <div className="text">
                            {license_item ? license_item.billingType.title : ""}
                          </div>
                        </div>
                        <div className="text-data flex">
                          <div className="label">
                            {constantText.tvod_tier_text}
                          </div>
                          <div className="text">
                            {license_item ? license_item.tvodTier.title : ""}
                          </div>
                        </div>
                      </Fragment>
                    )}
                  </div>
                  <div className="right-area">
                    <div className="edit-btn-row flex align-items-center justify-content-end">
                      <div
                        disabled={isLocked}
                        id={isLocked ? "disabled-mark-done-div" : ""}
                        className={
                          license_item?.currentStatus === "0"
                            ? "ml-10 status-dropdown val inactive"
                            : "ml-10 status-dropdown val"
                        }
                      >
                        {expiredLicense && expiredLicense?.length ? (
                          ""
                        ) : (
                          <CustomDropdown
                            status={
                              license_item?.currentStatus === "0"
                                ? "Inactive"
                                : "Active"
                            }
                            licenseData={license_item}
                            statusChanger={
                              isLocked === true ? null:license_item&&license_item?.validateCountries==false?this.openCountryPermissionModal: this.handleEditStatus
                            }
                          />
                        )}
                      </div>
                      <div
                        className="default-edit-btn"
                        id={isLocked ? "disabled-mark-done-div" : ""}
                      >
                        <Edit
                    onClick={() =>
                    isLocked === true
                    ? null:license_item&&license_item?.validateCountries==false?this.openCountryPermissionModal()
                    : this.props.openLicenseEditForm(license_item)
                    }
                        />
                      </div>
                    </div>
                    {license_item?.toDate
                      ? getDayCount(license_item?.toDate) && (
                          <div className="s-badge license red flex align-items-center ">
                            <TimetableIcon />
                            {getDayCount(license_item?.toDate) === "Today" ? (
                              `License Expires Today`
                            ) : (
                              <Fragment>
                                License Expires in {" "}
                                {getDayCount(license_item?.toDate)}
                                &nbsp; day
                                <span className="t-lowercase">(s)</span>
                              </Fragment>
                            )}
                          </div>
                        )
                      : null}

                    {expiredLicense !== "1" &&
                    license_item?.reason?.title !== null &&
                    license_item?.reason?.title ? (
                      <div className="invalid-text">
                        {license_item ? `*` + license_item?.reason?.title : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-lice-box flex align-items-center justify-content-center">
                <div className="flex align-items-center">
                  <CountryRegionGrouping />
                  {expiredLicense && expiredLicense.length > 0
                    ? constantText.no_expire_license
                    : applyFilterText === true&&licenseCount>0
                    ?  constantText.no_licence_found:
                     applyFilterText === true&&licenseCount===0
                    ? constantText.create_license_message_text
                    : constantText.create_license_message_text}
                </div>
              </div>
            )}
          </div>
          <div className="sidebarBox">
            <Drawer
              open={showFilterDrawer}
              anchor="right"
              onClose={this.showHideFilterDrawer}
            >
              {this.getFilterDrawerUI()}
            </Drawer>
          </div>
          <LockedPopup
            className="popup-wrap status-popup"
            state={showStatePopupLock}
            lockedBy={lockedBy}
            doneAction={this.removeLock}
            cancelAction={this.showHideStatePopupLock}
          />
        </Lock>
        <CommonModel
          className="popup-wrap status-popup"
          state={showStatePopup}
          showTitle={true}
          title={
            currentStatus == "InActive"
              ? `Inactivate License`
              : "Activate License"
          }
          showIcon={false}
          showDes={true}
          des={
            currentStatus == "Active"
              ? `${constantText.active_license_text}`
              : `${constantText.inActive_license_text}`
          }
          Form={
            currentStatus === "Active" ? (
              ""
            ) : (
              <div className="inner">
                <div className="f-filter">
                  {commonmodel_section.length && (
                    <FormRender
                      form={commonmodel_section}
                      onChange={this.InputChangerCommonable}
                      isDisable={isLocked}
                      serverCall={true}
                      setSelectDataArr={this.setSelectDataArrComonArr}
                    />
                  )}
                </div>
              </div>
            )
          }
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={this.activateDeactivateLicence}
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={this.showHideStatePopup}
          handleClose={this.showHideStatePopup}
        />
           {allowEdit===false&&(
        <CommonModel
              className="popup-wrap status-popup"
              state={ true}
              showTitle={true}
              title="License"
              showIcon={false}
              showDes={true}
              des={"You don't have permission for these licensing countries, so you are unable to edit this license."}
              showBtn1={true}
              btn1Text={constantText.ok_text}
              btn1Action = {this.closeCommonModel}
              showBtn2={false}
            />    
            )}
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  var licenseList = state.videoMgmt_reducer.licenseRecords;
  return {
    licenseList,
  };
};

const actionCreators = {
  getLicenseData: videoMgmtActions.list_license_action,
};

export { LicenseModule };
export default connect(mapStateToProps, actionCreators)(LicenseModule);
