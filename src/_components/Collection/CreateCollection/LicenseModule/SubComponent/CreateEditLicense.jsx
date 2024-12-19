import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import LicenseModuleJSON from "../../../Schema/LicenseModule.json";

import ButtonField from '../../../../Common/ButtonField/ButtonField';
import FormRender from "../../../../Common/FormHelper/FormRender";
import BadgeBox from "../../../../Common/BadgeBox/BadgeBox";

import Config from "../../../../../Config/config";
import { constantText } from '../../../../../_helpers/constants.text';
import { getSelectedGroup } from '../../../../../_helpers/util';
import { DEFAULT_JSON } from '../../../../Common/FormHelper/FormValidSetter';
import {
  isValidatedForm
} from "../../../../Common/FormHelper/FormValidSetter";

import AngleLeftArrow from "images/angle-left-arrow.svg";

//Services
import { apiCalls } from "../../../../../_services/common.service";
import { collectionService } from '../../../../../_services/collection.service';


class CreateEditLicense extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editTab: this.props.editTab,
      manualJsonSchema: [],
      formData: {
        currentStatus: '',
        country: '',
        businessType: '',
        billingType: '',
        platform: ''
      },
      license_uuid: '',
      currentStatus: '',
      status: null,
      isLocked: false,
      isDisabled: false,
      disableSubmitButton: true,
      collectionId: null,
      licenceId: null
    }
  }

  componentDidMount() {
    const json = LicenseModuleJSON;
    let { collectionId, licenseData } = this.props;
    this.getCollectionData();
    this.setState({
      manualJsonSchema: DEFAULT_JSON(json?.manual_section),
      collectionId: collectionId || null
    });

    let formData = {
      country: "",
      businessType: "",
      billingType: "",
      platform: "",
      currentStatus: ""
    };

    if (licenseData) {
      formData.country = licenseData?.country;
      formData.businessType = licenseData?.businessType;
      formData.billingType = licenseData?.billingType;
      formData.platform = licenseData?.platform;
      formData.currentStatus = licenseData?.currentStatus;
      formData.tupleId = licenseData?.id;
      this.setState({
        formData: {
          ...formData
        },
        licenceId: licenseData?.id,
        currentStatus: licenseData.currentStatus
      }, () => {
        this.fillEditDetails(licenseData);
      });
    }
  }

  getCollectionData = async () => {
    const { collectionId } = this.props;
    let response = await apiCalls(`${Config.collectionProperties}/${collectionId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  fillEditDetails = (response) => {
    if (response) {
      const contentData = response;
      const platform = contentData?.platform ? contentData?.platform?.map(
        (platform_item) => platform_item[0]
      ) : [];
      const country = contentData?.country ? contentData?.country?.map(
        (country_item) => country_item[0]
      ) : [];
      const jsonObj = {
        billingType: contentData?.billingType,
        businessType: contentData?.businessType,
        country: country,
        platform: platform,
        tupleId: contentData?.tupleId,
      };
      const copyJSON = [...this.state.manualJsonSchema];
      copyJSON.forEach((item) => {
        const value = jsonObj[item?.name];
        item.value =
          item.type === "dropdown"
            ? value === ""
              ? null
              : value
            : value || "";
      });
      this.setState({
        manualJsonSchema: copyJSON
      })
    }
  };

  setSelectDataArr = (res, index) => {
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON[index];
    if (updatedElement?.name === "country") {
      const GroupName = [];
      res?.forEach((group) => {
        group?.countries?.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      updatedElement.data = GroupName || [];
    } else if (updatedElement) {
      updatedElement.data = res || [];
    }
    this.setState({ manualJsonSchema: copyJSON });
  };

  selectGroup = (event, group) => {
    const { manualJsonSchema } = this.state;
    const copyLicense = [...manualJsonSchema];
    const copyElement = { ...copyLicense[0] };
    const copyOptions = [...copyElement?.data];
    copyElement.value = getSelectedGroup(event, group, copyOptions, copyElement?.value);

    copyLicense[0] = copyElement;
    this.setState({ manualJsonSchema: copyLicense });
  };
  InputChanger = (event, elemIndex) => {
    let { status, manualJsonSchema } = this.state;
    const copyJSON = manualJsonSchema;
    const updatedElement = copyJSON[elemIndex];
    if (status === constantText.collectionConstants.published) {
      this.setState({ status: constantText.collectionConstants.changed })
    }
    if (updatedElement?.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      if (updatedElement) {
        updatedElement.value = event?.target  ?  event?.target?.value:null
      }
    }
    if (updatedElement?.name === "businessType" && (updatedElement?.name === "businessType") != undefined &&
      updatedElement != undefined
    ) {
      const billIndex = copyJSON.findIndex(e => e?.name === "billingType");
      if (updatedElement?.value?.title === "Premium" || updatedElement?.value?.title === "premium_downloadable") {
        copyJSON[billIndex].disabled = false;
      } else {
        copyJSON[billIndex].disabled = true,
          copyJSON[billIndex].value = ""
      }
    }
    this.setState({
      manualJsonSchema: copyJSON,
      disableSubmitButton: false
    });
  };

  handleMarkAsDone = (mode) => {
    const { selectedTab } = this.props;
    this.props.markAsDone(selectedTab, mode);
  };

  generateObject(data) {
    if (data && data.length > 0) {
      const map = [];
      data.forEach((index) => {
        map.push(index.id);
      });
      return map;
    } else {
      return data;
    }
  }

  submitLicence = async () => {
    const { manualJsonSchema, collectionId } = this.state;
    const copyJSON = [...manualJsonSchema];
    const updatedElement = copyJSON;
    this.setState({ manualJsonSchema: copyJSON });
    const validateObj = {};
    updatedElement.forEach((item) => {
      validateObj[item.name] = item?.value;
    });
    updatedElement.valid = true;
    const jsonObj = {
      platformId: validateObj.platform
        ? this.generateObject(validateObj.platform)
        : [],
      countriesId: validateObj.country
        ? this.generateObject(validateObj.country)
        : [],
      businessTypeId: validateObj.businessType
        ? validateObj.businessType.id
        : null,
      billingTypeId: validateObj.billingType
        ? validateObj.billingType.id
        : null,
    };
    this.setState({
      ...jsonObj
    });
    const response = await collectionService.collection_create_licence_service(collectionId, jsonObj);
    if (response && response.status === 200) {
      this.props.openLicenseForm();
    }
    this.handleMarkAsDone(false);
  };

  updateLicence = async () => {
    const { collectionId, licenceId, currentStatus, manualJsonSchema  } = this.state;
    const copyJSON = manualJsonSchema;
    const { formValidity, validatedForm } = isValidatedForm(copyJSON);
    this.setState({
      JSONSchema: validatedForm,
      disableSubmitButton: false,
    });
    if (formValidity) {
      const updatedElement = copyJSON;
      this.setState({ manualJsonSchema: copyJSON });
      const validateObj = {};
      updatedElement.forEach((item) => {
        validateObj[item.name] = item?.value;
      });
      const jsonObj = {
        id: licenceId,
        platformId: validateObj.platform
          ? this.generateObject(validateObj.platform)
          : [],
        countriesId: validateObj.country
          ? this.generateObject(validateObj.country)
          : [],
        status: currentStatus,
        businessTypeId: validateObj.businessType
          ? validateObj.businessType.id
          : "",
        billingTypeId: validateObj.billingType
          ? validateObj.billingType.id
          : null,
      };

      const response = await collectionService.collection_edit_licence_service(collectionId, jsonObj);
      if (response && response.status === 200) {
        this.props.openLicenseForm();
      }
    }
    this.handleMarkAsDone(false);
  }

  render() {
    let { manualJsonSchema, editTab, disableSubmitButton, status } = this.state;
    return (
      <div className="whitebox">
        <div className="col-12">
          <div className="Rectangle-13">
            <div className="profile-head flex align-items-center justify-content-between">
              <div
                className="back-user-btn flex align-items-center auto-back-btn"
                onClick={() => this.props.openLicenseForm()}
              >
                <div className="Create-License">
                  <span className="Path-1146">
                    <AngleLeftArrow />
                  </span>
                  <strong>
                    {editTab === 1 ? constantText.edit_licence : constantText.create_licence}
                  </strong>
                </div>
              </div>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
              </div>
            </div>
          </div>
          <form>
            <Fragment>
              <div className="row input-space-35">
                {manualJsonSchema.length && (
                  <FormRender
                    form={manualJsonSchema}
                    onChange={this.InputChanger}
                    selectGroup={this.selectGroup}
                    setSelectDataArr={this.setSelectDataArr}
                    serverCall={true}
                  />
                )}
              </div>
              <div className="row input-space-35">
                <div className="col-md-6 col-lg-6 form-save-btn p-b-20">
                  <ButtonField
                    data-test="submit-license-button"
                    className="zee-btn-field zee-full"
                    variant="contained"
                    color="primary"
                    buttonText={"SAVE"}
                    disabled={disableSubmitButton}
                    onClick={editTab === 1 ? this.updateLicence : this.submitLicence}
                  />
                </div>
              </div>
            </Fragment>
          </form>
        </div>
      </div>
    );
  }
}

export { CreateEditLicense };
export default connect(null, null)(CreateEditLicense);
