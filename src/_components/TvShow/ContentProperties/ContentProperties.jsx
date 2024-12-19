import React, { Component, Fragment } from "react";

//Common Components
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import LockComp from "../../Common/Locked/Locked";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { CommonModel } from "../../Common/Model/CommonModel";
import checkValidity from "../../Common/FormHelper/FieldValidator";

//Steps Components
import TitleSummary from "./Steps/TitleSummary";
import Classification from "./Steps/Classification";
import ControlFields from "./Steps/ControlFields";
import GlobalFields from "./Steps/GlobalFields";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper files
import { addTag, validateReleaseAndTelecastDate } from "../../Common/CommonFunction/CommonFuntion";
import { constantText } from '../../../_helpers/constants.text';
import {
  manageDropDownValidation, manageValidationForLanguage,
  manageValidationForSpacialCat, manageValidationForGenre, manageValidationForSubType
} from './contentValidation';
import Config from '../../../Config/config';
import { getLocalData, formatCountryGroup, getSelectedGroup, getTextFromHtml } from '../../../_helpers/util';
import { requiredValidate } from '../../../_helpers/validation';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";

//Css files
import "../../../../public/css/Common/ContentProperties.css";

class ContentProperties extends Component {
  constructor(props) {
    super(props);
    let { state, jsonData } = props;
    let { title_summary, specialCategory, specialCategoryArr, classification, awards, awardFieldArr, globalFields,
      globalFieldsArr } = jsonData;
    let filterKey = state ? state == "quick-filing" ? "quickFiling" : "singleLanding" : "main";
    this.state = {
      status: null,
      userInfo: getLocalData("userData"),
      tabData: constantText.tvshow_content_properties_header_arr?.filter(data => data[filterKey]) || [],
      selectedTab: 0, tvShowId: null, stage: "",
      title_summary, specialCategory, specialCategoryArr, classification, awards, awardFieldArr,
      globalFields, globalFieldsArr,
      showLockedPopup: false, canMarkAsDone: false, error: false,
      tvShowGlobalPropertyIdArr: []
    };

  }

  componentDidMount() {
    let { tvShowId } = this.props;
    this.setState(prevState => ({ tvShowId: tvShowId || null }), () => {
      if (tvShowId) {
        this.fetchContentData();
        this.fetchGlobalFieldData();
      }
    });
  }

  fetchGlobalFieldData = async () => {
    let { tvShowId } = this.state;
    let url = `${Config.tvShow.global}/${tvShowId}?langCode=en&type=${Config.property}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      this.updateGlobalFieldsValues(response);
    }
  }

  fetchContentData = async () => {
    let { tvShowId } = this.state;
    let response = await apiCalls(`${Config.tvShowProperties}/${tvShowId}`, "GET", {});
    if (response) {
      this.props.getExternalId(response?.externalId);
      this.setState({ status: response?.contentState?.title })
      this.props.setStage(response?.contentState?.title);
      this.updateValues(response);
    }
  };

  updateValues = dataObj => {
    let { title_summary, specialCategory, specialCategoryArr, globalFields, classification, awards,
      awardFieldArr } = this.state;
    title_summary = title_summary ? this.updateArrValue(title_summary, dataObj) : title_summary;
    specialCategory = (specialCategory && dataObj?.specialCategory && dataObj?.specialCategory?.length) ?
      dataObj?.specialCategory?.map(specialCategoryObj => this.updateArrValue(specialCategoryArr, specialCategoryObj)) :
      specialCategory;
    classification = classification ? this.updateArrValue(classification, dataObj) : classification;
    awards = (awards && dataObj?.awards && dataObj?.awards?.length) ?
      dataObj?.awards?.map(awardsObj => this.updateArrValue(awardFieldArr, awardsObj)) :
      awards;
    this.setState({
      title_summary, specialCategory, globalFields, classification, awards
    }, () => {
      this.validationForXmlTitleUsingSubType('subtype', dataObj.subtype, 'title_summary', title_summary);
      this.checkIfMarkAsDone();
    });
  }

  updateGlobalFieldsValues = data => {
    let { globalFieldsArr, globalFields } = this.state;
    globalFields = (data?.length) ?
      data?.map(dataObj => this.updateArrValue(globalFieldsArr, dataObj)) :
      globalFields;
    this.setState({
      globalFields,
      tvShowGlobalPropertyIdArr: data?.length ? data : []
    }, () => {
      this.checkIfMarkAsDone();
    });
  }

  updateArrValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map(data => {
      manageDropDownValidation(stateArr, data["name"], updatedObj[data["name"]] || data["value"]);
      if (data["name"] == 'audioLanguages') {
        return {
          ...data,
          multiple: updatedObj.isMultiAudio,
          value: (updatedObj.isMultiAudio) ? updatedObj[data["name"]] : updatedObj[data["name"]] ?
            updatedObj[data["name"]][0] : data["value"],
        };
      }
      else {
        if ([data["name"]] == 'subtype') {
          this.validationForSubType([data["name"]], updatedObj[data["name"]]);
        }
        return {
          ...data,
          value: updatedObj[data["name"]] || data["value"],
        };
      }
    });
    return updatedData;
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let url = rootIndex ? (shallowArr[rootIndex][index]?.name == "tags") ? `${Config.masterTags}?title` :
      `${Config.castnamesUrl}?castName` : (shallowArr[index]?.name == "tags") ? `${Config.masterTags}?title` :
      `${Config.castnamesUrl}?castName`;

    let response = await apiCalls(`${url}=${value}`, "GET", {}, null, false) || [];
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = response) : (shallowArr[index]["data"] = response);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  }

  handleStateChange = async (event, rootIndex, index, stepName) => {
    let { status } = this.state;
    if (status === constantText.contentConstants.published) {
      this.setState({ status: constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submittedToReview) {
      this.setState({ status: constantText.contentConstants.draft })
    }
    if (status === constantText.contentConstants.unpublished) {
      this.setState({ status: constantText.contentConstants.draft })
    }
    let { value, triggerAutoSave } = event.target;
    let stepNameArr = this.state[stepName].slice();
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      const { name, type, keyText, validation } = rootArr[index];
      let errorIndex = (type == "SearchableWithCreate") ? value.findIndex(data => !!checkValidity(data[keyText], validation, false).errorText) : -1;
      let { errorText } = (type == "SearchableWithCreate") ? {
        errorText: (errorIndex > -1) ?
          checkValidity(value[errorIndex][keyText], validation, false).errorText : ""
      } : checkValidity(value, validation, false);
      rootArr[index] = { ...rootArr[index], value, errorText };
      if (name == "specialCategoryFrom" || name == "specialCategoryTo") {
        rootArr = manageValidationForSpacialCat(rootArr, name, value);
      }
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }), () => {
        this.props.markAsDone(this.props?.selectedTab, false);
      });
    }
    else {
      let shallowArr = [...stepNameArr];
      const { name, type, keyText, validation } = shallowArr[index];
      let errorIndex = (type == "SearchableWithCreate") ? value.findIndex(data => !!checkValidity(data[keyText], validation, false).errorText) : -1;
      let { errorText } = (type == "SearchableWithCreate") ? {
        errorText: (errorIndex > -1) ?
          checkValidity(value[errorIndex][keyText], validation, false).errorText : ""
      } : checkValidity(value, validation, false);
      shallowArr[index] = {
        ...shallowArr[index], value: (name == "tags" && !errorText) ? await addTag(value, 'tvshow') :
          value, errorText, isChanged: true
      };
      if (name == "dateZee5Published" || name == "telecastDate") {
        shallowArr = validateReleaseAndTelecastDate(shallowArr, name, value);
      }
      shallowArr = (name === "primaryLanguage" || name === "dubbedLanguageTitle") ?
        manageValidationForLanguage(shallowArr) : shallowArr;

      shallowArr = (name === "primaryGenre" || name === "secondaryGenre") ?
        manageValidationForGenre(shallowArr) : shallowArr;

      shallowArr = manageDropDownValidation(shallowArr, shallowArr[index]["name"], value);
      this.setState(prevState => ({ [stepName]: shallowArr }), () => {
        this.validationForSubType(name, value);
        this.validationForXmlTitleUsingSubType(name, value, stepName, shallowArr);
        this.props.markAsDone(this.props?.selectedTab, false);
        if (stepNameArr[index]["type"] == "checkbox" || triggerAutoSave) {
          this.autoSave();
        }
      }
      );
    }
  };

  validationForSubType = (name, value) => {
    let { classification } = this.state;
    classification = manageValidationForSubType(name, value, classification);
    this.setState(prevState => ({ classification }));
  }

  validationForXmlTitleUsingSubType = (name, value, stepName, shallowArr) => {
    if (name == "subtype") {
      const xmlTitleIndex = shallowArr.findIndex(item => item.name == "xmlTitle")
      if(xmlTitleIndex >= 0) {
        shallowArr[xmlTitleIndex].validation.required = value?.title?.toLowerCase() == constantText.xml_tvshow_subtype;
        this.setState(prevState => ({ [stepName]: shallowArr }));
      }
    }
  }

  selectGroup = (event, group, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let { value, data } = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let selectedData = getSelectedGroup(event, group, data, value);

    (rootIndex != null) ? (shallowArr[rootIndex][index]["value"] = selectedData) : (shallowArr[index]["value"] = selectedData);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  };

  selectGroupGlobal = (event, index, rootIndex, group, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let { data } = (rootIndex != null) ? shallowArr[rootIndex][0] : shallowArr[0];
    let selectedData = [];
    selectedData = getSelectedGroup(event, group, data, selectedData);

    (rootIndex != null) ? (shallowArr[rootIndex][0]["value"] = selectedData) : (shallowArr[0]["value"] = selectedData);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  };

  setSelectDataArr = (stepName, rootIndex, index, data) => {
    let stepNameArr = this.state[stepName].slice();
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      data = (rootArr[index].name === "specialCategoryCountry" || rootArr[index].name === "country") ? formatCountryGroup(data) : data;
      rootArr[index] = { ...rootArr[index], data: data || [] };
      shallowArr[rootIndex] = rootArr;
      this.setState((prevState) => ({ [stepName]: shallowArr }));
    } else {
      let shallowArr = [...stepNameArr];
      shallowArr[index] = { ...shallowArr[index], data: data || [] };
      shallowArr = (shallowArr[index].name === "primaryLanguage" || shallowArr[index].name === "dubbedLanguageTitle") ?
        manageValidationForLanguage(shallowArr) : shallowArr;
      shallowArr = (shallowArr[index].name === "primaryGenre" || shallowArr[index].name === "secondaryGenre") ?
        manageValidationForGenre(shallowArr) : shallowArr;
      this.setState((prevState) => ({ [stepName]: shallowArr }));
    }
  };

  addRemoveMultipleFields = (name, index) => {
    let shallowArr = this.state?.[name]?.slice() || [];
    let { specialCategoryArr, awardFieldArr, globalFieldsArr } = this.state;
    if (index > 0) {
      shallowArr.splice(index, 1);
    } else {
      let dataArr = (name == "specialCategory") ? specialCategoryArr : (name == "awards") ? awardFieldArr :
        (name == "globalFields") ? globalFieldsArr : [];
      shallowArr.push(dataArr);
    }
    this.setState((prevState) => ({ [name]: shallowArr }), () => (index > 0 && this.autoSave()));
  };

  formatValue = (value, isArray) => {
    if (isArray) {
      return value.map(item => {
        return item.id;
      })
    }
    return value?.id;
  }

  formatData = (data, checkLength) => {
    let formattedData = {};
    for (let obj of data ? data : []) {
      let { name, type, value, multiple, isChanged } = obj || {};
      if (typeof value == "boolean" || !!isChanged || !checkLength || (checkLength && (multiple ? value?.length > 0 : value))) {
        if ((type === 'dropdown' || type === 'dropdownAsync' || name == "tags") && (name != "showAirTimeDays") && value) {
          value = this.formatValue(value, multiple)
        }
        formattedData[name] = (type === "date" && value === "")? null: value;
      }
    }
    return formattedData;
  };

  formatNestedData = dataArr => {
    let formattedData = dataArr?.filter(nestedObj => {
      let hasValue = false;
      for (let key in nestedObj) {
        if (nestedObj[key]?.length >= 0) hasValue = true;
      }
      if (hasValue) return nestedObj;
    });
    return formattedData;
  };

  checkError = (dataArr, checkRequired) => {
    let error = null;
    for (let obj of dataArr) {
      let { name, type, value, multiple, validation, errorText } = obj;
      let { required } = validation || {};
      if (errorText) return (error = name);
      if (checkRequired && !!required && requiredValidate(multiple ? !!value?.length :
        (type == "textEditor") ? getTextFromHtml(value) : value)) {
        return (error = name);
      }
    }
    return error;
  };

  formatAllData = checkRequired => {
    let tvShow = {};
    let { title_summary, specialCategory, classification, awards, globalFields } = this.state;
    if (title_summary) {
      let shallowArr = (classification?.length > 0) ? [...title_summary, ...classification] : [...title_summary];
      let titleClassificationData = this.formatData(shallowArr, true);
      let titleClassifcationError = this.checkError(shallowArr, checkRequired);

      let specialCategoryArrOfObj = [];
      let specialCategoryObj = specialCategory?.map(awardNestedArr => awardNestedArr?.map(data => {
        specialCategoryArrOfObj = [...specialCategoryArrOfObj, data];
        return data;
      }));
      let specialCategoryError = this.checkError(specialCategoryArrOfObj, checkRequired);
      let specialCategoryArr = specialCategory?.map(awardNestedArr => this.formatData(awardNestedArr, false));
      specialCategoryArr = this.formatNestedData(specialCategoryArr);

      let awardsArrOfObj = [];
      let awardsObj = awards?.map(awardNestedArr => awardNestedArr?.map(data => {
        awardsArrOfObj = [...awardsArrOfObj, data];
        return data;
      }));
      let awardsError = this.checkError(awardsArrOfObj, checkRequired);
      let awardsArr = awards?.map(awardNestedArr => this.formatData(awardNestedArr, false));
      awardsArr = this.formatNestedData(awardsArr);

      if (titleClassificationData.audioLanguages && !Array.isArray(titleClassificationData.audioLanguages)) {
        const audLangs = Array(titleClassificationData.audioLanguages)
        titleClassificationData.audioLanguages = audLangs
      }

      let globalFieldsArrOfObj = [];
      let globalFieldsObj = globalFields?.map(awardNestedArr => awardNestedArr?.map(data => {
        globalFieldsArrOfObj = [...globalFieldsArrOfObj, data];
        return data;
      }));
      let globalFieldsError = this.checkError(globalFieldsArrOfObj, checkRequired);
      let globalFieldsArr = globalFields?.map(awardNestedArr => this.formatData(awardNestedArr, true));
      globalFieldsArr = this.formatNestedData(globalFieldsArr);

      let error = !!titleClassifcationError || !!specialCategoryError || !!awardsError || !!globalFieldsError;
      tvShow = { ...tvShow, ...titleClassificationData, awards: awardsArr, specialCategory: specialCategoryArr };
      return { tvShow, globalFieldsArr, error };
    }
  };

  autoSave = async () => {
    let { tvShowId } = this.state;
    let { currentTabData } = this.props;
    let { isLocked } = currentTabData;

    let { tvShow, error } = this.formatAllData(false);
    if (!isLocked && !error) {
      let url = `${Config.tvShowProperties}/${tvShowId}`;
      let response = await apiCalls(url, "PUT", { tvShow }, null, false, null, this.props?.autoSaveError);
      if (response) {
        this.props?.markAsDone(this.props?.selectedTab, false);
        this.checkIfMarkAsDone();
      }
      else {
        this.fetchContentData();
      }
    }
  };

  autoSaveGlobalFields = async (rootIndex, index) => {
    let tvShowGlobalPropertyId = null

    let { tvShowId, globalFields } = this.state;
    let { currentTabData } = this.props;
    let { isLocked } = currentTabData;
    let { globalFieldsArr, error } = this.formatAllData(false);
    let data = globalFields[rootIndex][index]
    let updateData = { [data.name]: (data.name == "country" || data.name == "subtitleLanguages" || data.name == "broadcastState") ? data.value.map(obj => obj.id) : data.value }
    if (tvShowGlobalPropertyId != null) { updateData.id = tvShowGlobalPropertyId }
    if (!isLocked && !error) {
      let url = `${Config.tvShow.global}/${tvShowId}`;
      let response = await apiCalls(url, "PUT", updateData, null, false, null, this.props?.autoSaveError);
      if (response) {
        this.props?.markAsDone(this.props?.selectedTab, false);
        this.checkIfMarkAsDone();
        this.fetchGlobalFieldData(rootIndex);
      }
    }
  };

  checkIfMarkAsDone = () => {
    let { error } = this?.formatAllData(true);
    this.setState({ canMarkAsDone: !error ? true : false });
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  showHideLockPopup = () => {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({ showLockedPopup: !showLockedPopup }));
  }

  unLockProperties = () => {
    this.showHideLockPopup();
    this.props.unLockedSession(this.props?.selectedTab);
  }

  getTitleSummaryUI = () => {
    let { selectedTab, title_summary, specialCategory } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <TitleSummary
        title_summary={title_summary || []}
        specialCategory={specialCategory || []}
        addRemoveMultipleFields={this.addRemoveMultipleFields}
        setSelectDataArr={this.setSelectDataArr}
        onBlur={this.autoSave}
        handleChange={this.handleStateChange}
        selectGroup={this.selectGroup}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        disabled={isLocked}
      />
    );
  };

  getClassificationUI = () => {
    let { selectedTab, classification, awards, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <Classification
        classification={classification || []}
        awards={awards || []}
        setSelectDataArr={this.setSelectDataArr}
        addRemoveMultipleFields={this.addRemoveMultipleFields}
        handleSearchableInput={this.handleSearchableInput}
        onBlur={this.autoSave}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={isLocked}
      />
    );
  }

  getControlFieldUI = () => {
    let { tvShowId, selectedTab } = this.state;
    let { language } = this.props;
    return (
      <ControlFields
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        tvShowId={tvShowId}
        language={language}
      />
    );
  }

  getGlobalFieldsUI = () => {
    let { selectedTab, globalFields, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <GlobalFields
        globalFields={globalFields || []}
        setSelectDataArr={this.setSelectDataArr}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        onBlur={this.autoSaveGlobalFields}
        error={error} disabled={isLocked}
        selectGroup={this.selectGroupGlobal}
      />
    );
  }

  getMovieUI = () => {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getClassificationUI()}
        {/* {(selectedTab == 2) && this.getGlobalFieldsUI()} */}
        {(selectedTab == 2) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  handleTab = (event, selectedTab) => {
    window.scrollTo(0, 0);
    this.setState({ selectedTab });
  }

  render() {
    let { stage, tabData, selectedTab, canMarkAsDone, showLockedPopup, status } = this.state;
    let { state, currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div className="create-movie">
        <LockComp lock={isLocked} lockedBy={lockedBy} clicked={this.showHideLockPopup} >
          <div className="whitebox remove-b-radius">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.content_properties_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div className="autosave">
                  {constantText.all_fields_auto_save_text}
                </div>
                <div
                  data-test="markIsDoneButton"
                  className={`mark-done ${isDone ? "mark-active" : canMarkAsDone ? "mark-fill-active" : ""} auto-mark-done`}
                  onClick={() => {
                    if (canMarkAsDone && !isLocked && !isDone)
                      this.markAsDone();
                  }}>
                  <span><MarkDone /></span>
                  {constantText.mark_as_done_text}
                </div>
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
                selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
            </div>
          </div>

          <div className="movieForm-tab">{this.getMovieUI()}</div>
        </LockComp>

        <CommonModel className="popup-wrap status-popup" state={showLockedPopup}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.unLockProperties}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.showHideLockPopup}
          handleClose={this.showHideLockPopup}
        />
      </div>
    );
  }
}
export default ContentProperties;
