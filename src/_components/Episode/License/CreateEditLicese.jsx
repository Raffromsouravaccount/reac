import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
//Services
import { apiCalls } from "../../../_services/common.service";
// common components
import Config from "../../../Config/config";
import ButtonField from "../../Common/ButtonField/ButtonField";
import RadioButton from "../../Common/RadioButton/RadioButton";
import SelectWithSearch from "../../Common/SelectWithSearch/SelectWithSearch";
import { CommonModel } from "../../Common/Model/CommonModel";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import {
  isValidatedForm,
  checkDateValidation,
  formValidityCheck,
} from "../../Common/FormHelper/FormValidSetter";
// helpers
import { constantText } from "../../../_helpers/constants.text";
import { getLocalData, getSelectedGroup } from "../../../_helpers/util";

import { tvEpisodeService } from "../../../_services/tvEpisode.service";

import { userService } from "../../../_services/user.service";

// actions
import { tvEpisodeAction } from "../../../_actions/tvEpisode.action";


import AngleLeftArrow from "images/angle-left-arrow.svg";
import Edit from "images/edit.svg";
import Delete from "images/delete.svg";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

class CreateLicense extends Component {
  constructor(props) {
    super(props);
    let { state, seasonId, tvShowId ,episodeId} = props;
    this.state = {
      language: this.props.language,
      contentId: tvShowId,
      seasonId: seasonId,
      episodeId:episodeId,
      editTab: this.props.editTab,
      manualJsonSchema: [],
      JSONSchema: [],
      templateEdit: 0,
      formData: {
        fromDate: "",
        toDate: "",
        reason: "",
        currentStatus: "",
        country: "",
        businessType: "",
        billingType: {},
        tvodTier: {},
        platform: [],
        id: "",
      },
      displayName: "",
      errorMessageForDate: "",
      stage: { title: "Draft" },
      currentStatus: "",
      errorMsg: "",
      template: "",
      licenceStatus: "1",
      countriesList: [],
      businessTypeList: [],
      billingTypeList: [],
      tvodTierList: [],
      platformsList: [],
      templateList: [],
      licenseList: [],
      license_uuid: "",
      showStatePopup: false,
      error: false,
      isDisabled: false,
      templateListData: [],
      isLocked: false,
      template_data: "",
      dateCreated: "",
      template_static_edit: "",
      template_index: null,
      userDetails: [],
      assignedCountry: [],
      invalidCountryMsg: false,
      disableSubmitButton: true,
      disableTemplateButton: true,
      setName :this.props.licenseList?.data?this.props.licenseList?.data?.count:0
    };
  }
  componentDidMount() {
    const { jsonData } = this.props;
    this.setState({
      manualJsonSchema:JSON.parse(JSON.stringify( (jsonData))).manual_section,
      template_edit_section: JSON.parse(JSON.stringify((jsonData))).template_edit_section,
      template_section: JSON.parse(JSON.stringify((jsonData))).template_section,
    });
    this.getUserDetails();
    let formData = {
      fromDate: "",
      toDate: "",
      country: "",
      businessType: "",
      billingType: "",
      platform: "",
      tvodTier: "",
      uuid: "",
      currentStatus: "",
      reason: "",
      dateCreated: "",
      createdBy: "",
      updatedBy: "",
      updatedByEmail: "",
    };

    if (this.props.licenseData) {
      formData.fromDate =(this.props.licenseData.fromDate);
      formData.toDate = (this.props.licenseData.toDate);
      formData.country = this.props.licenseData.country;
      formData.businessType = this.props.licenseData.businessType;
      formData.billingType = this.props.licenseData.billingType;
      formData.tvodTier = this.props.licenseData.tvodTier;
      formData.platform = this.props.licenseData.platform;
      formData.uuid = this.props.licenseData.id;
      formData.currentStatus = this.props.licenseData.currentStatus;
      formData.reason = this.props.licenseData.reason;
      formData.dateCreated = this.props.licenseData.dateCreated;
      formData.createdBy = this.props.licenseData.createdBy;
      formData.updatedBy = this.props.licenseData.updatedBy;
      formData.updatedByEmail = this.props.licenseData.updatedByEmail;
      formData.tupleId = this.props.licenseData.id;
      formData.setName = this.props.licenseData.setName;
      formData.isParentTypeTvod = this.props.licenseData.isParentTypeTvod;
      formData.contentAgeRatingId = this.props.licenseData.contentAgeRating;

      this.setState({
        formData: {
          ...formData,
        },
        license_uuid: this.props.licenseData.templateId,
        currentStatus: this.props.licenseData.currentStatus,
        dateCreated: this.props.licenseData.dateCreated,
      });
    }
  }

  handleMarkAsDone = (mode) => {
    this.props.markAsDone(this.props?.selectedTab, mode);
  };

  getUserDetails = async () => {
    const { userID } = getLocalData("userData");
    var userDetails = await userService.user_details_service(userID);
    if (userDetails) {
      this.setState(
        {
          userDetails: userDetails.countries,
        },
        () => {
          this.handleCountryDisableData(userDetails.countries);
        }
      );
    }
  };
  componentWillReceiveProps = (nextProps) => {
    this.fillEditDetails(this.state.formData);
    this.fillEditDetailsTemplate(
      this.state.template_data,
      this.state.template_index
    );
    if (
      nextProps.licenseList &&
      nextProps.licenseList.data &&
      nextProps.licenseList.data.contentData
    ) {
      this.setState({
        licenseList: nextProps.licenseList.data.contentData.licenceModule,
      });
    }

    if (nextProps.templateList) {
      this.setState({
        templateList: nextProps.templateList || [],
      });
    }
  };

  InputChangerTemplate = (event, innerIndex, outerIndex) => {
    const copyJSON = [...this.state.templateListData];
    const copyTemplate = copyJSON[outerIndex];
    const updatedElement = copyTemplate?.licenseDate[innerIndex];
   if(updatedElement) updatedElement.value = event?.target?.value;
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validationcopyJSON
    );
    if(updatedElement)updatedElement.valid = isValid;
   if(updatedElement) updatedElement.errorText = errorText;
    const fromIndex = copyTemplate?.licenseDate.findIndex(
      (e) => e?.name === "fromDate"
    );
    const toIndex = copyTemplate?.licenseDate?.findIndex(
      (e) => e?.name === "toDate"
    );
    let updatedFromDate = copyTemplate?.licenseDate[fromIndex];
    let updatedToDate = copyTemplate?.licenseDate[toIndex];
  if(updatedFromDate)  updatedFromDate.errorText = null;
   if(updatedFromDate) updatedToDate.errorText = null;
    if (
      copyTemplate?.licenseDate[fromIndex] ||
      copyTemplate?.licenseDate[toIndex]
    ) {
      let fromDate = new Date(updatedFromDate?.value).getTime();
      let toDate = new Date(updatedToDate?.value).getTime();
      const { dateValidation, errorText } = checkDateValidation(
        fromDate,
        toDate
      );
   if(updatedFromDate)updatedElement.errorText = errorText;
    }
    if(updatedFromDate)updatedElement.touched = 1;
    let formValidButton = true;
    copyJSON.forEach((templateLicense, licenseIndex) => {
      const { formValidity } = formValidityCheck(templateLicense?.licenseDate);
      formValidButton = formValidity && formValidButton;
    });
    copyJSON.forEach((templateLicense, licenseIndex) => {
      let fromDate = new Date(templateLicense?.licenseDate[0].value)?.getTime();
      let toDate = new Date(templateLicense?.licenseDate[1].value)?.getTime();
      const { dateValidation } = checkDateValidation(fromDate, toDate);
      if (dateValidation === true) {
        formValidButton = false;
      }
    });
    this.setState({
      templateListData: copyJSON,
      disableTemplateButton: !formValidButton,
    });
  };
  setSelectDataArrForTemplateHandle = (res, innerIndex, outerIndex) => {
    const copyJSON = [...this.state.templateListData];
    const copyTemplate = copyJSON[outerIndex];
    const updatedElement = copyTemplate?.licenseDate[innerIndex];
    updatedElement.data=res ||[] 
    this.setState({ template_item: {licenseDate:updatedElement} });
  };

  fillEditDetails = async (response) => {
    const { contentId } = this.state;
    if (response) {
      const contentData = response;
      const platform = contentData?.platform?.map(
        (platform_item, index) => platform_item[0]
      );
      const country = contentData?.country
        ? contentData?.country?.map((country_item, index) => country_item[0])
        : null;
      const jsonObj = {
        billingType: contentData?.billingType,
        businessType: contentData?.businessType,
        country: country,
        dateCreated: contentData?.dateCreated,
        fromDate: contentData?.fromDate,
        platform: platform,
        toDate: contentData?.toDate,
        tupleId: contentData?.tupleId,
        tvodTier: contentData?.tvodTier,
        setName:contentData?.setName,
        isParentTypeTvod: contentData?.isParentTypeTvod,
        contentAgeRatingId: contentData?.contentAgeRatingId,
      };
      const copyJSON = [...this.state.manualJsonSchema];
      copyJSON.forEach((item) => {
        const value = jsonObj[item?.name];
        item.value =
        item.type === "dropdown" ||
        item.type === "autocreate" ||
        item.type === "dropdownAsync" ||
        item.type === "SearchableWithCreate"||
        item.type === "checkbox"
          ? value === ""
            ? (item.multiple ? [] : null)
            : value
          : value || "";
        item.touched = 0;
      });
    }
  };

  fillEditDetailsTemplate = async (response, index) => {
    const { contentId } = this.state;
    if (response) {
      const contentData = response[index];
      const jsonObj = {
        billingType: contentData?.billingType,
        businessType: contentData?.businessType,
        country: contentData?.country,
        dateCreated: contentData?.dateCreated,
        platform: contentData?.platform,
        tvodTier: contentData?.tvodTier,
        setName: contentData?.setName,
        isParentTypeTvod: contentData?.isParentTypeTvod
      };
      const copyJSON = [...this.state.template_edit_section];
      copyJSON.forEach((item) => {
        const value = jsonObj[item?.name];
        item.value =
          item.type === "dropdown"
            ? value === ""
              ? null
              : value
            : value || "";
        item.touched = 0;
      });
      this.setState({ template_edit_section: copyJSON });
    }
  };

 



  async getTemplate(type, masterType) {
    await this.props.getTemplates(type, masterType);
  }

  handleCountryDisableData = (dbUserCountry) => {
    const { countriesList } = this.state;
    const newArr = [];
    this.setState({
      countriesList: newArr,
    });
  };

  handleMultiSelect = (event, id, name, value) => {
    let { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        [name]: value,
      },
    });
  };

  checkValidation = () => {
    const { formData } = this.state;
    if (
      formData["fromDate"] &&
      formData["toDate"] &&
      formData["country"] &&
      formData["businessType"]
    ) {
      return true;
    } else {
      return false;
    }
  };
  selectGroupForTemplate = (event, group) => {
    let valid = false;
    const { template_edit_section } = this.state;
    const copyLicense = template_edit_section?[...template_edit_section]:null;
    const copyElement = copyLicense?copyLicense[0]:null;
    const copyOptions = copyElement?[...copyElement.data]:[];
    if(copyElement)copyElement.value = getSelectedGroup(event, group, copyOptions, copyElement?.value);
    const { errorText } = checkValidity(
      copyElement?.value,
      copyElement?.validation
    );
    if(copyElement)copyElement.errorText = errorText;
    let formValidButton = true;
    const { formValidity } = formValidityCheck(copyLicense);
    formValidButton = formValidity && formValidButton;
    this.setState({ template_edit_section: copyLicense, disableSubmitButton: !formValidity });
  };
  setSelectDataArrTemplate = (res, index) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.template_edit_section];
    const updatedElement = copyJSON[index];
    if (updatedElement.name === "country") {
      const GroupName = [];
      res?.forEach((group) => {
        group?.countries?.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      updatedElement.data = GroupName || [];
    } else {
      updatedElement.data = res || [];
    }
    this.setState({ template_edit_section: copyJSON });
  };

  selectGroup = (event, group) => {
    let valid = false;
    const { manualJsonSchema } = this.state;
    const copyLicense = [...manualJsonSchema];
    const copyElement = copyLicense[3];
    const copyOptions =copyElement?[...copyElement?.data]:null;
    if(copyElement)copyElement.value = getSelectedGroup(event, group, copyOptions, copyElement?.value);

    let formValidButton = true;
    const { formValidity } = formValidityCheck(copyLicense);
    formValidButton = formValidity && formValidButton;
    let fromDate = new Date(copyLicense[1]?.value)?.getTime();
    let toDate = new Date(copyLicense[2]?.value)?.getTime();
    const { dateValidation } = checkDateValidation(fromDate, toDate);
    if (dateValidation === true) {
      formValidButton = false;
    }
   
    this.setState({
      manualJsonSchema: copyLicense,
      disableSubmitButton: !formValidButton,
    });
  };
  setSelectDataArr = (res, index) => {
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON[index];
    if (updatedElement.name === "country") {
      const GroupName = [];
      res?.forEach((group) => {
        group?.countries?.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      updatedElement.data = GroupName || [];
    } else {
      updatedElement.data = res || [];
    }
    this.setState({ manualJsonSchema: copyJSON });
  };

  InputChanger = (event, elemIndex) => {
    let { journeyType } = this.props;
    const { JSON, item } = this.props || {};
    const copyJSON = [...this.state.manualJsonSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event?.target?.value;
      updatedElement.file = event?.target?.files[0];
    } else if (updatedElement) {
      updatedElement.value = event?.target  ?  event?.target?.value:null
    }
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
   if(updatedElement) updatedElement.errorText = errorText;
    const fromIndex = copyJSON?.findIndex((e) => e?.name === "fromDate");
    const toIndex = copyJSON?.findIndex((e) => e?.name === "toDate");
    let fromDate, toDate;
    if (copyJSON[fromIndex]?.value || copyJSON[toIndex]?.value) {
      copyJSON[fromIndex].errorText = null;
      copyJSON[toIndex].errorText = null;
      fromDate = new Date(copyJSON[fromIndex]?.value).getTime();
      toDate = new Date(copyJSON[toIndex]?.value).getTime();
      const { dateValidation, errorText } = checkDateValidation(
        fromDate,
        toDate
      );
      if(updatedElement)updatedElement.errorText = errorText;
      if(updatedElement)updatedElement.toDate = dateValidation;
    }
    if (journeyType === '1') {
      if (
        updatedElement?.name === "businessType" &&
        (updatedElement?.name === "businessType") != undefined &&
        updatedElement != undefined
      ) {
        const billIndex = copyJSON.findIndex((e) => e?.name === "billingType");
        if (
          updatedElement?.value?.title === "Premium" ||
          updatedElement?.value?.title === "premium_downloadable"
        ) {
          copyJSON[billIndex].value = "";
          copyJSON[billIndex].disabled = false;
        } else if (updatedElement?.value) {
          copyJSON[billIndex].value = "";
          copyJSON[billIndex].disabled = true;
        }
      }
    }
    if(updatedElement)updatedElement.touched = 1;
    let formValidButton = true;
    const { formValidity } = formValidityCheck(copyJSON);
    formValidButton = formValidity && formValidButton;
    fromDate = new Date(copyJSON[fromIndex]?.value)?.getTime();
    toDate = new Date(copyJSON[toIndex]?.value)?.getTime();
    const { dateValidation } = checkDateValidation(fromDate, toDate);
    if (dateValidation === true) {
      formValidButton = false;
    }
    this.setState({
      manualJsonSchema: copyJSON,
      disableSubmitButton: !formValidButton,
    });
  };

  InputChangerGroup = (event, elemIndex) => {
    const { JSON, item, state } = this.props || {};
    const copyJSON = [...this.state.template_edit_section]
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event?.target?.value;
      updatedElement.file = event?.target?.files[0];
    } else {
      if(updatedElement)updatedElement.value =
        updatedElement?.type === "checkbox"
          ? event?.target?.checked
          : event?.target?.value;
    }
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );

    if (state === undefined) {
      if (
        updatedElement?.name === "businessType" &&
        (updatedElement?.name === "businessType") != undefined &&
        updatedElement != undefined
      ) {
        const billIndex = copyJSON.findIndex((e) => e?.name === "billingType");
        if (
          updatedElement?.value?.title === "Premium" ||
          updatedElement?.value?.title === "premium_downloadable"
        ) {
          copyJSON[billIndex].value = "";
          copyJSON[billIndex].disabled = false;
        } else if (updatedElement?.value) {
          copyJSON[billIndex].value = "";
          copyJSON[billIndex].disabled = true;
        }
      }
    }
    updatedElement.touched = 1;
    let formValidButton = true;
    copyJSON.forEach((templateLicense, licenseIndex) => {
      const { formValidity, validatedForm } = isValidatedForm(
        templateLicense?.licenseDate
      );
      templateLicense.licenseDate = validatedForm;
      formValidButton = formValidity && formValidButton;
    });

    this.setState({ template_edit_section: copyJSON });
  };
  handleTemplateEdit = (templateData, index) => {
    let { userDetails } = this.state;
    let getTemplateData = templateData[index];
    let response = getTemplateData;
    const checkTheValidCountry = this.checkOnlyExistCountry(getTemplateData);
    this.setState(
      {
        templateEdit: 1,
        template_data: templateData,
        template_copyData: templateData,
        template_index: index,
      },
      () => this.fillEditDetailsTemplate(templateData, index)
    );
  };
  checkOnlyExistCountry = (templateListData) => {
    let { userDetails } = this.state;
    const dataCountry = Object.values(templateListData.country);
    var validate_Array = dataCountry.filter(function (item, index) {
      var name = item.title.split(".")[0]; //name
      for (let i = 0; i < userDetails.length; i++) {
        if (userDetails[i].title === name) return true;
      }
      return false;
    });
    return validate_Array;
  };

  handleTemplate = (event, id, name, value) => {
    const { jsonData } = this.props;
    const { templateList } = this.state;
    let localtemplateArray = [];
    let data = templateList.filter(function (element) {
      if (value?.DisplayName === element?.DisplayName) {
        return element;
      }
    });
    if (data) {
      for (let itemIndex = 0; itemIndex < data.length; itemIndex++) {
        for (
          let templateIndex = 0;
          templateIndex < data[itemIndex].template.length;
          templateIndex++
        ) {
          let template = data[itemIndex].template[templateIndex];
          let templateObject = {
            templateId: data[itemIndex].uuid,
            billingType: template.billingType
              ? template.billingType
              : template.BillingType,
            businessType: template.businessType
              ? template.businessType
              : template.BusinessType,
            contentAgeRatingId: template?.contentAgeRatingId,
            country:
              template.countryId && template.countryId.length > 0
                ? template.countryId
                : template.CountryId,
            platform:
              template.platformId && template.platformId.length > 0
                ? template.platformId
                : template.PlatformId,
            tvodTier: template.tvodTier ? template.tvodTier : template.TVODTier,
            currentStatus: template.currentStatus
              ? template.currentStatus
              : "Active",
            licenseDate: JSON.parse(JSON.stringify(jsonData)).template_section,
          };
          localtemplateArray.push(templateObject);
        }
      }
    }
    this.setState(
      {
        template: value,
        templateListData: localtemplateArray,
        disableTemplateButton: true,
      },
      () => this.validateUserCountry(localtemplateArray)
    );
  };

  validateUserCountry = (data) => {
    let { templateListData, userDetails } = this.state;
    let localLicenseArray = [];
    if (templateListData) {
      for (
        let itemIndex = 0;
        itemIndex < templateListData?.length;
        itemIndex++
      ) {
        let template = templateListData[itemIndex];
        let templateObject = {
          templateId: templateListData[itemIndex].uuid,
          billingType: template.billingType ? template.billingType : {},
          businessType: template.businessType ? template.businessType : {},
          country:
            template?.country && template?.country.length > 0
              ? template?.country
              : [],
          platform:
            template?.platform && template?.platform?.length > 0
              ? template?.platform
              : [],
          tvodTier: template.tvodTier ? template.tvodTier : {},
          currentStatus: template.currentStatus
            ? template.currentStatus
            : "Active",
          invalidCountry: this.handleValidateError(template),
          licenseDate: template.licenseDate,
          setName :template?.setName,
          isParentTypeTvod: template?.isParentTypeTvod,
          contentAgeRatingId:template?.contentAgeRatingId
        };
        localLicenseArray.push(templateObject);
      }
    }
    this.setState({
      templateListData: localLicenseArray,
    });
  };

  handleValidateError = (templateListData) => {
    let { userDetails } = this.state;
    const dataCountry = templateListData?Object.values(templateListData.country):'';
    var validate_Array =dataCountry? dataCountry.filter(function (item, index) {
      var name = item.title.split(".")[0];
      for (let i = 0; i < userDetails.length; i++) {
        if (userDetails[i].title === name) return false;
      }
      return true;
    }):[];
    return validate_Array;
  };



  handlerButtonChange = async () => {
    let dataSet = true;
    let { formData } = this.state;
    if (formData.toDate) {
      let fromDate = new Date(formData?.fromDate).getTime();
      let toDate = new Date(formData?.toDate).getTime();
      const { dateValidation, errorText } = checkDateValidation(
        fromDate,
        toDate
      );
      if (dateValidation === true) {
        dataSet = true;
      } else {
        dataSet = false;
      }
      this.setState({
        error: true,
        disableTemplateButton: dataSet,
      });
    }
  };
  editLicence = async () => {
    const { formData, contentId, seasonId ,episodeId} = this.state;
    const copyJSON = [...this.state.manualJsonSchema];
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
      const { userID } = getLocalData("userData");

      const jsonObj = {
        validFrom: validateObj.fromDate ? validateObj.fromDate : "",
        validUntil: validateObj.toDate ? validateObj.toDate : "",
        id: formData.tupleId ? formData.tupleId : "",
        fromDate: validateObj.fromDate ? validateObj.fromDate : "",
        platformId: validateObj?.platform
          ? this.generateObject(validateObj?.platform)
          : [],
        countriesId: validateObj?.country
          ? this.generateObject(validateObj?.country)
          : [],
        status: "1",
        billingTypeId: validateObj?.billingType
          ? validateObj?.billingType?.id
          : null,
        tvodTierId: validateObj?.tvodTier ? validateObj?.tvodTier?.id : null,
        reasonType: null,
        businessTypeId: validateObj.businessType
          ? validateObj.businessType.id
          : null,
        setName: validateObj.setName ? validateObj.setName.trim() : "",
        isParentTypeTvod: validateObj.isParentTypeTvod
          ? validateObj.isParentTypeTvod
          : false,
          contentAgeRatingId: validateObj.contentAgeRatingId
          ? validateObj.contentAgeRatingId.id
          : null,
      };
      const licenseId = formData.tupleId;
      var response = await tvEpisodeService.edit_licence_service(
        licenseId,
        contentId,
        seasonId,
        episodeId,
        jsonObj
      );
      if (response) {
        this.props.openLicenseForm();
        this.handleMarkAsDone(false);
      }
    }
  };

  editLicenceTemplate = () => {
    const { template_index, template_copyData, template } = this.state;
    const copyJSON = [...this.state.template_edit_section];
    const { formValidity, validatedForm } = isValidatedForm(copyJSON);
    this.setState({
      JSONSchema: validatedForm,
      disableSubmitButton: true,
    });
    if (formValidity) {
      const updatedElement = copyJSON;
      const validateObj = {};
      updatedElement.forEach((item) => {
        validateObj[item.name] = item?.value;
      });
      template_copyData[template_index].billingType = validateObj.billingType;
      template_copyData[template_index].businessType = validateObj.businessType;
      template_copyData[template_index].tvodTier = validateObj.tvodTier;
      template_copyData[template_index].country = validateObj.country;
      template_copyData[template_index].platform = validateObj.platform;
      this.setState(
        {
          template: template,
          templateListData: template_copyData,
          templateEdit: "",
        },
        () => this.validateUserCountry(template_copyData)
      );
    }
  };
  submitLicence = async () => {
    const { JSON, item } = this.props;
    const { seasonId, contentId,episodeId } = this.state;
    const copyJSON = [...this.state.manualJsonSchema];
    const { formValidity, validatedForm } = isValidatedForm(copyJSON);
    if (formValidity) {
      const updatedElement = copyJSON;
      const validateObj = {};
      const validateArr = [];
      updatedElement.forEach((item) => {
        validateObj[item.name] = item?.value;
      });
      updatedElement.valid = true;
      updatedElement.errorText = "";
      const jsonObj = {
        validFrom: validateObj.fromDate ? validateObj.fromDate : "",
        validUntil: validateObj.toDate ? validateObj.toDate : "",
        fromDate: validateObj.fromDate ? validateObj.fromDate : "",
        platformId: validateObj.platform
          ? this.generateObject(validateObj.platform)
          : [],
        countriesId: validateObj.country
          ? this.generateObject(validateObj.country)
          : [],
        status: "1",
        reasonType: null,
        billingTypeId: validateObj.billingType
          ? validateObj.billingType.id
          : "",
        tvodTierId: validateObj.tvodTier ? validateObj.tvodTier.id : "",
        businessTypeId: validateObj.businessType
          ? validateObj.businessType.id
          : "",
        setName: validateObj.setName ? validateObj.setName.trim() : "",
        isParentTypeTvod: validateObj.isParentTypeTvod
          ? validateObj.isParentTypeTvod
          : false,
        contentAgeRatingId: validateObj.contentAgeRatingId
          ? validateObj.contentAgeRatingId.id
          : null,
      };
      validateArr.push(jsonObj);
      const response = await tvEpisodeService.create_licence_service(
        validateArr,
        contentId,
        seasonId,
        episodeId
      );
      if (response) {
        this.props.openLicenseForm();
        this.handleMarkAsDone(false);
      }
    }
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
  submitTemplateLicence = async (templateListData) => {
    const copyJSON = [...this.state.templateListData];
    const copyTemplate = copyJSON;
    const { formValidity, validatedForm } = isValidatedForm(copyTemplate);
    const { formData } = this.state;
    const jsonObject = templateListData;
    let validateObj = jsonObject.filter((filterItems) => filterItems);
    const platFormArr = [];
    for (let i = 0; i < validateObj?.length; i++) {
      const jsonObj = {
        setName: validateObj[i]?.licenseDate[0]?.value.trim(),
        isParentTypeTvod: validateObj[i]?.licenseDate[4]
        ? validateObj[i]?.licenseDate[4]?.value
        : false,
       contentAgeRatingId: validateObj[i]?.licenseDate[1]
        ? validateObj[i]?.licenseDate[1]?.value?.id
        : "",
        validFrom: validateObj[i]?.licenseDate[2]?.value
          ? validateObj[i]?.licenseDate[2]?.value
          : "",
        validUntil: validateObj[i]?.licenseDate[3]?.value
          ? validateObj[i]?.licenseDate[3]?.value
          : "",
        fromDate: validateObj[i]?.licenseDate[2]?.value
          ? validateObj[i]?.licenseDate[2]?.value
          : "",
        platformId: validateObj[i]?.platform
          ? this.generateObject(validateObj[i].platform)
          : [],
        countriesId: validateObj[i]?.country
          ? this.checkValidationForUSerCountry(
              this.generateObject(validateObj[i].country)
            )
          : [],
        status: "1",
        reasonType: null,
        billingTypeId: validateObj[i].billingType
          ? validateObj[i].billingType.id
          : "",
        tvodTierId: validateObj[i].tvodTier ? validateObj[i].tvodTier.id : "",
        businessTypeId: validateObj[i].businessType
          ? validateObj[i].businessType.id
          : "",
      };
      platFormArr.push(jsonObj);
    }
    const responseGenerate = this.generateObjectForSubmitLicense(platFormArr);
    this.setState({
      ...responseGenerate,
    });
    if (responseGenerate && responseGenerate.length === 0) {
      this.setState({
        showStatePopup: true,
        invalidCountryMsg: true,
      });
    } else {
      const { seasonId, contentId ,episodeId} = this.state;
      const response = await tvEpisodeService.create_licence_service(
        responseGenerate,
        contentId,
        seasonId,
        episodeId
      );
      if (response) {
        this.props.openLicenseForm();
        this.handleMarkAsDone(false);
      }
    }
  };
  generateObjectForSubmitLicense = (licenceData) => {
    const validateData = licenceData?licenceData.filter((data) => {
      if (data?.countriesId?.length > 0) {
        return true;
      } else {
        return false;
      }
    }):null;
    return validateData;
  };

  checkValidationForUSerCountry = (templateListData) => {
    let { userDetails } = this.state;
    let countryID;
    let dataArr = [];
    var validate_Array =templateListData? templateListData.filter(function (item, index) {
      for (let i = 0; i < userDetails.length; i++) {
        if (userDetails[i].id === item) {
          dataArr.push(item);
        }
      }
    }):[];
    return dataArr;
  };

  saveTemplateLicence = async () => {
    const { contentId, displayName, formData } = this.state;
    const requestedData = {
      contentId: contentId,
      action: "draft",
      contentData: {
        licence: [
          {
            currentStatus: "Active",
            displayName: displayName,
            template: [formData],
          },
        ],
        isLocked: true,
      },
    };
    var response = await create_licence_service(requestedData);
    if (response && response.status === 200) {
      this.props.openLicenseForm();
    }
  };

  handleLicenceChange = (event) => {
    this.getTemplate("LicenceTemplate", "TEMPLATE");
    let { value } = event?.target;
    this.setState({
      licenceStatus: value,
    });
  };

  showHideStatePopup = () => {
    let { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup,
    });
  };

  handleStatePopup = () => {
    this.props.openLicenseForm();
  };

  handleEdit = async (index, data, template_data) => {
    const { formData } = this.state;
    formData.country = data.Country ? data.Country : data.country;
    formData.businessType = data.BusinessType
      ? data.BusinessType
      : data.businessType;
    formData.billingType = data?.BillingType
      ? data.billingType.title
      : data.billingType.title;
    formData.tvodTier = data.TVODTier ? data.TVODTier : data.tvodTier;
    formData.platform = data.Platform ? data.Platform : data.platform;
    formData.isLocked = true;
    formData.isDone = false;

    const copyJSON = [...this.state.manualJsonSchema];
    copyJSON.forEach((item) => {
      const value = jsonObj[item?.name];
      item.value =
        item.type === "dropdown" ? (value === "" ? null : value) : value || "";
      item.touched = 0;
    });

    this.setState({
      ...formData,
      editTab: 1,
      template_data: template_data,
      template_index: index,
    });
  };

  updateTemplateLicence = () => {
    const { formData, templateListData, template_index } = this.state;
    let templateData = templateListData;
    templateListData[template_index] = formData;
    this.setState(
      {
        templateListData: templateData,
        editTab: "",
      },
      () => {
        this.validateUserCountry(templateData);
      }
    );
  };

  handleDeleteTemplate = (data, index) => {
    let data_item = data;
    data.splice(index, 1);
    let formValidButton = true;
    data_item.forEach((templateLicense, licenseIndex) => {
      const { formValidity } = formValidityCheck(templateLicense?.licenseDate);
      formValidButton = formValidity && formValidButton;
    });
    data_item.forEach((templateLicense, licenseIndex) => {
      let fromDate = new Date(templateLicense?.licenseDate[1].value)?.getTime();
      let toDate = new Date(templateLicense?.licenseDate[2].value)?.getTime();
      const { dateValidation } = checkDateValidation(fromDate, toDate);
      if (dateValidation === true) {
        formValidButton = false;
      }
    });
    this.setState({
      templateListData: data_item,
      disableTemplateButton: !formValidButton,
    });
  };

  render() {
    let {
      JSONSchema,
      licenceStatus,
      editTab,
      formData,
      templateList,
      template,
      showStatePopup,
      templateListData,
      template_data,
      invalidCountryMsg,
      manualJsonSchema,
      template_edit_section,
      disableSubmitButton,
      disableTemplateButton,
      templateEdit,
      template_section,
    } = this.state;
    let { fromDate, toDate } = formData;

    let { state, stage,journeyType } = this.props;
    let minDate = new Date();
    return (
      <div className="whitebox">
        <div className="col-12">
          <div className="Rectangle-13">
            <div className="profile-head flex align-items-center justify-content-between">
              <div
                className="back-user-btn flex align-items-center"
                onClick={() => {
                  editTab === 1
                    ? this.props.openLicenseForm()
                    : this.showHideStatePopup();
                }}
              >
                <span className="Path-1146">
                  <AngleLeftArrow />
                </span>
                <strong>
                  <div className="Create-License">
                    {editTab === 1
                      ? constantText.edit_licence
                      : constantText.create_licence}
                  </div>
                </strong>
              </div>
              <div className="status-head flex align-items-center">
                {stage?.title && (
                  <BadgeBox
                    className="create-movie-stage"
                    status={stage?.title}
                  />
                )}
              </div>
            </div>
            {editTab === 1 ||
            journeyType =="2" ||
            journeyType =="3" ? (
              <Fragment></Fragment>
            ) : (
              <div className="lice-radio-tab col-12">
                <RadioButton
                  className="zee-radio-field"
                  name="manual"
                  areaLabel="manual"
                  value={licenceStatus}
                  onChange={this.handleLicenceChange}
                  labelPlacement="end"
                  data={constantText.license_Arr}
                />
              </div>
            )}
            {templateEdit === 1 ? (
              <form>
                <div className="row input-space-35">
                  {template_edit_section.length && (
                    <FormRender
                      form={template_edit_section}
                      onChange={this.InputChangerGroup}
                      selectGroup={this.selectGroupForTemplate}
                      setSelectDataArr={this.setSelectDataArrTemplate}
                      serverCall={true}
                    />
                  )}
                </div>

                <div className="col-md-6 col-lg-6 form-save-btn p-b-20">
                  <ButtonField
                    className="zee-btn-field zee-full"
                    variant="contained"
                    color="primary"
                    buttonText={"SAVE"}
                    onClick={this.editLicenceTemplate}
                  />
                </div>
              </form>
            ) : (
              <>
                {licenceStatus === "2" ? (
                  <form>
                    <div className="lice-template">
                      <div className="row input-space-35">
                        <div className="col-md-6 col-lg-6">
                          <SelectWithSearch
                            name="template"
                            className="zee-SelectWSearch-field"
                            label="Select Template"
                            limitTags={1}
                            moreText={"more"}
                            multiple={false}
                            data={templateList}
                            value={template || []}
                            keyText={"DisplayName"}
                            required={true}
                            onChange={this.handleTemplate}
                          />
                        </div>
                      </div>
                      {templateListData
                        ? templateListData.map((template_item, index) => (
                            <Fragment key={index}>
                              <div className="row input-space-35">
                                {template_item?.licenseDate?.length && (
                                  <FormRender
                                  serverCall={true}
                                  form={template_item?.licenseDate}
                                  setSelectDataArr={(e,i)=>this.setSelectDataArrForTemplateHandle(e,i,index)}  
                                    onChange={(e, i) =>
                                      this.InputChangerTemplate(e, i, index)
                                    }
                                  />
                                )}
                              </div>

                              <div className="lice-list">
                                <div className="lice-box flex justify-content-between m-b-30">
                                  <div className="left-area">
                                    <div className="text-data flex">
                                      <div className="label">
                                        {constantText.licensing_country_text}
                                      </div>
                                      <div className="text">
                                        {template_item?.country
                                          ? template_item?.country
                                              ?.map((item) => item?.title)
                                              .join(", ")
                                          : ""}
                                        &nbsp;&nbsp;
                                        <div className="red-text">
                                          {template_item?.invalidCountry
                                            ? template_item?.invalidCountry
                                                ?.length > 0 &&
                                              template_item?.invalidCountry
                                                .map((item) => item?.title)
                                                .join(", ") +
                                                ` ${constantText.assigned_country_error}`
                                            : ""}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-data flex">
                                      <div className="label">
                                        {constantText.business_type}
                                      </div>
                                      <div className="text">
                                        {template_item?.BusinessType
                                          ? template_item?.BusinessType?.title
                                          : template_item.businessType?.title}
                                      </div>
                                    </div>
                                    <div className="text-data flex">
                                      <div className="label">
                                        {constantText.license_platform}
                                      </div>
                                      <div className="text">
                                        {template_item?.Platform
                                          ? template_item?.Platform?.map(
                                              (item) => item?.title
                                            ).join(", ")
                                          : template_item?.platform
                                              ?.map((item) => item?.title)
                                              .join(", ")}
                                      </div>
                                    </div>
                                    <div className="text-data flex">
                                      <div className="label">
                                        {constantText.billing_type}
                                      </div>
                                      <div className="text">
                                        {template_item.BillingType
                                          ? template_item?.BillingType?.title
                                          : template_item.billingType?.title}
                                      </div>
                                    </div>
                                    <div className="text-data flex">
                                      <div className="label">
                                        {constantText.tvod_tier_text}
                                      </div>
                                      <div className="text">
                                        {template_item.TVODTier
                                          ? template_item?.TVODTier?.title
                                          : template_item?.tvodTier?.title}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="right-area">
                                    <div className="edit-btn-row flex align-items-center justify-content-end">
                                      <div className="right-area">
                                        <div className="edit-btn-row flex align-items-center justify-content-end">
                                          <div className="default-edit-btn">
                                            <Edit
                                              onClick={() =>
                                                this.handleTemplateEdit(
                                                  templateListData,
                                                  index
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="default-delete-btn">
                                            <Delete
                                              onClick={() =>
                                                this.handleDeleteTemplate(
                                                  templateListData,
                                                  index
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          ))
                        : ""}
                    </div>
                    {templateListData && templateListData.length ? (
                      <div className="row input-space-35">
                        <div className="col-md-6 col-lg-6 form-save-btn p-b-20">
                          <ButtonField
                            className="zee-btn-field zee-full"
                            variant="contained"
                            color="primary"
                            buttonText={"SAVE"}
                            disabled={disableTemplateButton}
                            onClick={() =>
                              this.submitTemplateLicence(templateListData)
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </form>
                ) : (
                  <form>
                    <div className="row input-space-35">
                      {manualJsonSchema?.length && (
                        <FormRender
                          form={manualJsonSchema}
                          serverCall={true}
                          onChange={this.InputChanger}
                          selectGroup={this.selectGroup}
                          setSelectDataArr={this.setSelectDataArr}
                        />
                      )}
                    </div>
                    <div className="country-warning-message m-b-10" > {constantText.countryLevelCheckForSeasonAndEpisode}</div>
                    <div className="row input-space-35">
                      <div className="col-md-6 col-lg-6 form-save-btn p-b-20">
                        <ButtonField
                           data-test="submit-license-button"
                          className="zee-btn-field zee-full"
                          variant="contained"
                          color="primary"
                          buttonText={"SAVE"}
                          disabled={disableSubmitButton}
                          onClick={
                            editTab === 1
                              ? this.editLicence
                              : this.submitLicence
                          }
                        />
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {editTab === 1 ? (
            ""
          ) : (
            <CommonModel
              className="popup-wrap status-popup"
              state={showStatePopup}
              showTitle={true}
              title="License"
              showIcon={false}
              showDes={true}
              des={
                invalidCountryMsg
                  ? `${constantText.licence_invalid_country}`
                  : `${constantText.licence_save_message}`
              }
              showBtn1={true}
              btn1Text={constantText.ok_text}
              btn1Action={
                invalidCountryMsg
                  ? this.showHideStatePopup
                  : this.handleStatePopup
              }
              showBtn2={true}
              btn2Text={"Cancel"}
              btn2Action={this.showHideStatePopup}
            />
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let masterRecords = state.master_reducer;
  let licenseList = state.movieMgmt_reducer.licenseRecords;
  let templateList = state.movieMgmt_reducer.templateRecords;
  return {
    masterRecords,
    licenseList,
    templateList,
  };
};
const actionCreators = {
  getTemplates: tvEpisodeAction.fetch_template_action,
  saveData: tvEpisodeAction.create_licence_action,
  getLicenseData: tvEpisodeAction.list_license_action,
  editLicence: tvEpisodeAction.edit_licence_action,
};
export {CreateLicense};
export default connect(mapStateToProps, actionCreators)(CreateLicense);
