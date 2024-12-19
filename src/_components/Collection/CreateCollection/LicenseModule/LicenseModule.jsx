import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import MenuItem from "@material-ui/core/MenuItem";

import { constantText } from '../../../../_helpers/constants.text';
import InputField from '../../../Common/InputField/InputField';
import LockedPopup from "../../../CreateMovie/LockedPopup";
import Lock from '../../../Common/Locked/Locked';
import { CommonModel } from "../../../Common/Model/CommonModel";
import DropDown from "../../../Common/DropDown/DropDown";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import FormRender from "../../../Common/FormHelper/FormRender";
import checkValidity from "../../../Common/FormHelper/FieldValidator";

import Config from "../../../../Config/config";
import { collectionActions } from '../../../../_actions/collection.actions';
//Services
import { apiCalls } from "../../../../_services/common.service";
import JSONSchema from '../../Schema/LicenseModule.json';


import MarkDone from 'images/tick.svg';
import Edit from 'images/edit.svg';
import CountryRegionGrouping from "images/CountryRegionGrouping.svg";

const CustomDropdown = ({ statusChanger, status, licenseData, disabled }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropDown
      open={open}
      buttonText={status}
      handleClose={() => setOpen(!open)}
      handleOpenClose={() => setOpen(!open)}
    >
      <MenuItem
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
          statusChanger(
            status == "Active" ? '0' : '1',
            licenseData
          );
        }}
      >
        {status === 'Active' ? "Inactivate License" : "Activate License"}
      </MenuItem>
    </DropDown>
  );
};

class LicenseModule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collectionId: this.props.collectionId,
      JSONSchema: JSONSchema,
      JSONCommonModel: JSONSchema?.commonmodel_section,
      licenceId: null,
      licenceData: [],
      copyLicenseList: [],
      filters: {
        searchVal: ""
      },
      formData: {
        currentStatus: 1,
        country: "",
        businessType: "",
        billingType: {},
        tvodTier: "",
        platform: "",
        reason: ""
      },
      status: null,
      isDone: false,
      showLockedPopup: false,
      readyToDone: false,
      showStatePopup: false,
      showHideStateLockedPopup: false,
      showStatePopupLock: false,
      reasonErrorMsg: ""
    }
  }

  componentDidMount() {
    this.getLicenseDetails();
    this.getCollectionData();
  }

  getCollectionData = async () => {
    const { collectionId } = this.props;
    let response = await apiCalls(`${Config.collectionProperties}/${collectionId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  async getLicenseDetails() {
    const { collectionId } = this.props;
    const requestedParams = {
      collectionId: collectionId
    };
    await this.props.getLicenseData(requestedParams);
  }

  componentWillReceiveProps(nextProps) {
    let localLicenseArray = [];
    if (nextProps.licenceData && nextProps.licenceData.data && nextProps.licenceData.data) {
      for (let itemIndex = 0; itemIndex < nextProps.licenceData.data.length; itemIndex++) {
        let template = nextProps.licenceData.data[itemIndex];
        let templateObject = {
          templateId: nextProps.licenceData.data.id,
          billingType: template.BillingType ? template.BillingType : "",
          businessType: template.BusinessType ? template.BusinessType : "",
          reasonType: template.ReasonType ? template.ReasonType : "",
          country:
            template.countriesId && template.countriesId.length > 0
              ? template.countriesId
              : [],
          platform:
            template.platformId && template.platformId.length > 0
              ? template.platformId
              : [],
          id: template.id ? template.id : "",
          currentStatus: template.status ? template.status : 1,
        };
        localLicenseArray.push(templateObject);
      }
      this.setState({
        licenceData: localLicenseArray,
        copyLicenseList: localLicenseArray,
      })
    } else {
      this.setState({
        licenceData: [],
      });
    }
  }

  handleSearch = (event) => {
    let { filters } = this.state;
    let { name, value } = event.target;
    this.setState({
      filters: {
        ...filters,
        [name]: value
      }
    }, () => {
      if (name == "searchVal") {
        this.applyFilterForCountry();
      }
    });
  }

  applyFilterForCountry = () => {
    let { filters, copyLicenseList } = this.state;
    let { searchVal } = filters;
    const dataFilter = searchVal.length
      ? copyLicenseList.filter((item) => {
        let isAvailabe = false;
        item?.country.forEach((con) => {
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
    this.setState({
      licenceData: dataFilter,
    });
  };

  checkValidation = () => {
    const { licenceData } = this.state;
    if (licenceData.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  showHideStatePopupLock = () => {
    this.setState({
      showStatePopupLock: !this.state.showStatePopupLock,
    });
  };

  showHideStatePopup = () => {
    this.setState({
      showLockedPopup: !this.state.showLockedPopup
    });
  };

  unLockProperties = () => {
    this.showHideStatePopupLock();
    this.unlockSession();
  }

  unlockSession = async () => {
    await this.props.unLockedSession(this.props?.selectedTab);
  }

  handleMarkAsDone = (mode) => {
    const { selectedTab } = this.props;
    this.props.markAsDone(selectedTab, mode);
  };

  generateObject(data) {
    if (data && data.length > 0) {
      const map = [];
      data.forEach((index) => {
        map.push(index?.id);
      });
      return map;
    } else {
      return data;
    }
  }

  activateDeactivateLicence = async () => {
    const { collectionId, JSONCommonModel, formData } = this.state;
    let copyData = [...JSONCommonModel];
    this.handleMarkAsDone(false);
    const { licenceId } = this.state;
    const updatedElement = { ...formData }
    let getReasonData = {};
    let jsonObj = {}
    if (updatedElement?.currentStatus === '1') {
      jsonObj = {
        id: licenceId,
        status: updatedElement?.currentStatus,
      };
    } else {
      copyData.map((data, index) => {
        getReasonData[data.name] = data.value;
      });
      jsonObj = {
        id: licenceId,
        status: updatedElement?.currentStatus,
        reasonType: getReasonData?.reason?.id
      };
    }
    if (updatedElement?.currentStatus === '1') {
      const response = await collectionService.collection_edit_licence_service(collectionId, jsonObj);
      if (response) {
        this.showHideStatePopup();
        const requestedParams = {
          collectionId: collectionId
        };
        this.props.getLicenseData(requestedParams);
      }
    } else if (getReasonData &&
      getReasonData?.reason &&
      (getReasonData?.reason?.id).length) {
      const response = await collectionService.collection_edit_licence_service(collectionId, jsonObj);
      if (response) {
        this.showHideStatePopup();
        const requestedParams = {
          collectionId: collectionId
        };
        this.props.getLicenseData(requestedParams);
        this.InputChanger(null, null, 'clearReason');
      }
    } else {
      this.setState({ reasonErrorMsg: constantText.reason_required });
    }
  };

  handleEditStatus = (status, licenseData) => {
    const { formData } = this.state;
    formData.country = this.generateObject(licenseData?.country);
    formData.businessType = licenseData?.businessType;
    formData.billingType = licenseData?.billingType;
    formData.reason = licenseData?.ReasonType;
    formData.platform = this.generateObject(licenseData?.platform);
    formData.id = licenseData?.id;
    formData.currentStatus = status;
    this.setState(
      {
        currentStatus: status,
        licenceId: licenseData?.id,
        formData: {
          ...formData,
        }
      }, () => {
        this.showHideStatePopup(licenseData?.id);
      }
    );
  };

  showHideStatePopup = (data) => {
    let { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup,
      licence_uuid: data,
    });
  };

  InputChanger = (event, elemIndex, secName) => {
    const { JSONCommonModel } = this.state;
    if (secName === 'clearReason') {
      const copyJSON = [...JSONCommonModel];
      const updatedElement = copyJSON[0];
      if (updatedElement.name === "reason") {
        updatedElement.value = '';
      }
      this.setState({
        JSONCommonModel: copyJSON
      })
    } else {
      const copyJSON = [...JSONCommonModel];
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
      this.setState({ reasonErrorMsg: "" });
    }
  };

  setSelectDataArr = (res, index) => {
    const { JSONCommonModel } = this.state;
    const copyJSON = [...JSONCommonModel];
    const updatedElement = copyJSON[index];
    updatedElement.data = res || [];
    this.setState({ JSONCommonModel: copyJSON });
  };

  render() {
    const { licenceData, filters, showStatePopupLock, showStatePopup, currentStatus, status, reasonErrorMsg, JSONCommonModel } = this.state;
    const { searchVal } = filters;
    let { currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div className="whitebox">
        <Lock
          lock={isLocked}
          lockedBy={lockedBy}
          clicked={this.showHideStatePopupLock}>
          <div className="ccm-head flex align-items-center justify-content-between m-b-30">
            <Fragment>
              <div
                className="back-user-btn flex align-items-center"
                onClick={() => this.handleRoute("/dashboard")}>
                <div className="text"><strong>{constantText.license_text}</strong></div>
              </div>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div
                  id={isLocked ? 'disabled-mark-done-div' : ''}
                  className={`${!isDone && this.checkValidation()
                    ? "mark-done mark-fill-active auto-mark-done"
                    : isDone
                      ? "mark-done mark-active auto-mark-done"
                      : "mark-done auto-mark-done"
                    }` }
                  onClick={() => this.checkValidation() && this.handleMarkAsDone(true)}
                >
                  <span>
                    <MarkDone />
                  </span>
                  Mark as Done
                </div>
              </div>
            </Fragment>
          </div>

          <div className="col-12 p-b-10">
            <div className="user-head lice-head flex justify-content-between align-items-center">
              <div className="col-md-5 lice-search">
                <InputField
                  name="searchVal"
                  className="auto-search"
                  data-test="search-input-field"
                  className="zee-input-field zee-input-h-40 m-b-0 auto-search"
                  value={searchVal}
                  onChange={(event) => this.handleSearch(event)}
                  label={constantText.search_licence_text}
                  disabled={isLocked}
                />
              </div>
              <div className="s-form flex">
                <div className="filter-w">
                  <div
                    id={isLocked ? 'disabled-mark-done-div' : ''}
                    disabled={isLocked}
                    className="btn-create-user btn-h-40 auto-createLicense"
                    onClick={() => !isLocked ? this.props.openLicenseForm() : ''}
                  >
                    {constantText.create_licence}
                  </div>
                </div>
              </div>
            </div>
            {licenceData.length > 0 ? (
              licenceData && licenceData.map((license_item, index) => (
                <div
                  key={index}
                  className="lice-box flex justify-content-between"
                  disabled={isLocked}
                >
                  <div className="left-area">
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
                        {license_item ? license_item.businessType?.title : ""}
                      </div>
                    </div>
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
                          {license_item ? license_item.billingType?.title : ""}
                        </div>
                      </div>
                    </Fragment>
                  </div>
                  <div className="right-area">
                    <div className="edit-btn-row flex align-items-center justify-content-end">
                      <div
                        disabled={isLocked}
                        className={
                          license_item?.currentStatus === '0'
                            ? "ml-10 status-dropdown val inactive"
                            : "ml-10 status-dropdown val"
                        }
                      >
                        <CustomDropdown
                          status={
                            license_item?.currentStatus === '0'
                              ? "Inactive"
                              : "Active"
                          }
                          disabled={isLocked}
                          licenseData={license_item}
                          statusChanger={
                            isLocked === true ? null : this.handleEditStatus
                          }
                        />
                      </div>
                      <div className="default-edit-btn">
                        <Edit
                          disabled={isLocked}
                          onClick={() =>
                            isLocked === true
                              ? null
                              : this.props.openLicenseEditForm(license_item)
                          }
                        />
                      </div>
                    </div>
                    {license_item?.reasonType?.title !== null && license_item?.currentStatus === '0' ? (
                      <div className="invalid-text">
                        {license_item ? `*` + license_item?.reasonType?.title : ""}
                      </div>
                    ) : (
                        "")}
                  </div>
                </div>
              ))) : (
                <div className="no-lice-box flex align-items-center justify-content-center">
                  <div className="flex align-items-center">
                    <CountryRegionGrouping />
                    {constantText.create_license_message_text}
                  </div>
                </div>
              )}
          </div>
          <LockedPopup
            className="popup-wrap status-popup"
            lockedBy={lockedBy}
            state={showStatePopupLock}
            lockedBy={lockedBy}
            doneAction={this.unLockProperties}
            cancelAction={this.showHideStatePopupLock}
          />
        </Lock>
        <CommonModel
          className="popup-wrap status-popup"
          state={showStatePopup}
          showTitle={true}
          title={
            currentStatus === '1'
              ? "Activate License"
              : "Inactivate License"
          }
          showIcon={false}
          showDes={true}
          des={
            currentStatus == '1'
              ? `${constantText.active_license_text}`
              : `${constantText.inActive_license_text}`
          }
          Form={
            currentStatus === "1" ? (
              ""
            ) : (
                <div className="inner">
                  <div className="f-filter">
                    {JSONCommonModel.length && (
                      <FormRender
                        form={JSONCommonModel}
                        onChange={this.InputChanger}
                        isDisable={isLocked}
                        serverCall={true}
                        setSelectDataArr={this.setSelectDataArr}
                      />
                    )}
                    <div className="invalid-text reason-text">{reasonErrorMsg}</div>
                  </div>
                </div>
              )}
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={this.activateDeactivateLicence}
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={this.showHideStatePopup}
          handleClose={this.showHideStatePopup}
        />
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  let licenceData = state.collection_reducer.collectionLicence;
  return {
    licenceData
  }
}

const actionCreators = {
  getLicenseData: collectionActions.collection_get_license
}

export { LicenseModule };
export default connect(mapStateToProps, actionCreators)(LicenseModule);
