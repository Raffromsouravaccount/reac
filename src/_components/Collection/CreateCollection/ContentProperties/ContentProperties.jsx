import React, { Component } from "react";
import { connect } from "react-redux";

//Steps Components
import TitleSummary from "./Steps/TitleSummary";
import ControlFields from "./Steps/ControlFields";

//Common Components
import LeftTab from "../../../Common/LeftTab/CommonLeftTab";
import checkValidity from "../../../Common/FormHelper/FieldValidator";
import Lock from "../../../Common/Locked/Locked";
import { CommonModel } from "../../../Common/Model/CommonModel";
import BadgeBox from "./../../../Common/BadgeBox/BadgeBox";

//Services
import { apiCalls } from "../../../../_services/common.service";

//Helper Files
import { addTag } from "../../../Common/CommonFunction/CommonFuntion";
import Config from "../../../../Config/config";
import { getLocalData, getSelectedGroup, DEFAULT_JSON } from "../../../../_helpers/util";
import { constantText } from "../../../../_helpers/constants.text";
import { requiredValidate } from "../../../../_helpers/validation";

//Json files
import PropertiesJson from "../../Schema/ContentProperties.json";

//Images
import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";

class ContentProperties extends Component {
  constructor(props) {
    super(props);
    let { title_summary, global } = PropertiesJson;
    this.state = {
      userInfo: getLocalData("userData"),
      tabData: constantText.collection_content_properties_header_arr,
      selectedTab: 0, collectionId: null,
      title_summary, global,
      status: null,
      showLockedPopup: false, canMarkAsDone: false, error: false,
      controlFieldsData: {},
    };
  }

  componentDidMount() {
    let { collectionId } = this.props;
    this.setState(prevState => ({ collectionId: collectionId || null }), () => {
      if (collectionId) {
        this.getCollectionData();
        this.setInitialData();
        this.getControlFieldData();
      }
    });
  }

  getCollectionData = async() => {
    const { collectionId } = this.props;
    let response = await apiCalls(`${Config.collectionProperties}/${collectionId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  setInitialData = () => {
    let { title_summary, global } = PropertiesJson;
    this.setState(prevState => ({
      title_summary: DEFAULT_JSON(title_summary),
      global: DEFAULT_JSON(global)
    }), () => this.fetchContentData());
  }

  fetchContentData = async () => {
    let { collectionId } = this.state;
    let url = `${Config.collectionProperties}/${collectionId}`;
    let response = await apiCalls(url, "GET", {}, `/collection/edit/${collectionId}`);
    if (response) {
      this.props.getExternalId(response?.externalId)
      this.updateValues(response || {});
    }
  };

  getControlFieldData = async () => {
    let { collectionId } = this.props;
    let controlFieldsData = {...this.state.controlFieldsData}
    let url = `${Config.collectionProperties}/controlFields/${collectionId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      controlFieldsData = {...controlFieldsData, ...response}
      this.setState({ controlFieldsData });
    }
  }

  updateValues = dataObj => {
    let { contentState } = dataObj;
    let { title_summary, global, classification, specialCategory, specialCategoryArr } = this.state;
    title_summary = title_summary ? this.updateArrValue(title_summary, dataObj) : title_summary;

    global = (dataObj?.globalProperties && dataObj?.globalProperties.length && global) ?
      this.updateArrValue(global, dataObj.globalProperties) : global;

    specialCategory = (dataObj?.specialCategory && dataObj?.specialCategory.length && specialCategory) ?
      dataObj?.specialCategory?.map(specialCategoryObj => this.updateArrValue(specialCategoryArr, specialCategoryObj)) :
      specialCategory;

    this.setState({
      title_summary, global, classification, specialCategory
    }, () => {
      this.checkIfMarkAsDone();
      this.props?.setStage(contentState?.title);
    });
  }

  updateArrValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map(data => {
      return {
        ...data,
        value: updatedObj[data["name"]] || data["value"],
      };
    });
    return updatedData;
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let response = await apiCalls(`/master/Tags?title=${value}`, "GET", {}, null, false) || [];
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = response) : (shallowArr[index]["data"] = response);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  }

  handleStateChange = async(event, index, stepName) => {
    let { status } = this.state;
    let { value } = event.target;
    let stepNameArr = this.state[stepName].slice();
    let shallowArr = [...stepNameArr];
    const { name } = shallowArr[index];
    if (status === constantText.collectionConstants.published) {
      this.setState({status : constantText.castProfile.changed})
    }
    if (status === constantText.contentConstants.unpublished || status === constantText.contentConstants.scheduled || status === constantText.contentConstants.needWork) {
      this.setState({ status: constantText.contentConstants.draft });
    }
    let { errorText } = checkValidity(value, shallowArr[index].validation, false);
    shallowArr[index] = { ...shallowArr[index], value: (name == "tags" && !errorText) ?
        await addTag(value, 'collection') : value, errorText, isChanged: true };
    this.setState(
      (prevState) => ({
        [stepName]: shallowArr
      }), () => {
        if (stepNameArr[index]["type"] == "checkbox" || stepNameArr[index]["type"] === "dropdownAsync") {
          this.autoSave();
        }
      }
    );
  };

  setSelectDataArr = (stepName, index, data) => {
    let stepNameArr = this.state[stepName].slice();
    let shallowArr = [...stepNameArr];
    shallowArr[index] = { ...shallowArr[index], data: data || [] };
    this.setState((prevState) => ({ [stepName]: shallowArr }));
  };

  formatValue = (value, isArray) => {
    if (isArray) {
      return value.map(item => {
        return item.id;
      })
    }
    return value.id;
  }

  formatData = (data, checkLength) => {
    let formattedData = {};
    for (let obj of data ? data : []) {
      let { name, value, multiple, type, isChanged = false } = obj;
      if (isChanged === true || typeof value == "boolean" || type === "time" || !checkLength ||
        (checkLength && (multiple ? value?.length > 0 : value))) {
        if ((type === 'dropdown' || type === 'dropdownAsync' || name== "tags") && value) {
          value = this.formatValue(value, multiple)
        }
        formattedData[name] = value;
        obj.isChanged = false
      }
    }
    return formattedData;
  };

  formatNestedData = (dataArr) => {
    let formattedData = dataArr?.filter((nestedObj) => {
      let hasValue = true;
      for (let key in nestedObj) {
        if (!nestedObj[key] || nestedObj[key].length <= 0) hasValue = false;
      }
      if (hasValue) return nestedObj;
    });
    return formattedData;
  };

  checkError = (dataArr, checkRequired) => {
    let error = null;
    for (let obj of dataArr) {
      let { name, multiple, validation, errorText } = obj;
      let { required } = validation || {};
      let value = obj["value"];
      if (errorText) return (error = name);
      if (checkRequired && !!required && requiredValidate(multiple ? !!value?.length : value)) {
        return (error = name);
      }
    }
    return error;
  };

  formatAllData = (checkRequired) => {
    let { title_summary, global } = this.state;
    let allData = [...title_summary, ...global];
    let error = this.checkError(allData, checkRequired);
    let collectionData = this.formatData(allData, true);

    if (Object.keys(this.formatData(global, true))?.length > 0) {
      collectionData.globalProperties = { ...collectionData.globalProperties, ...this.formatData(global, true) };
    }

    return { error, collectionData };
  };

  autoSave = async () => {
    let { collectionId } = this.state;
    let { collectionData, error } = this.formatAllData(false);
    if (!error) {
      let url = `${Config.collectionProperties}/${collectionId}`;
      let response = await apiCalls(url, "PUT", collectionData, null, false, false, this.props.autoSaveError);
      if (response) {
        this.props.markAsDone(this.props?.selectedTab, false);
        this.checkIfMarkAsDone();
      }
    }
  };

  selectCountryGroup = (event, group, stepName, rootIndex, index) => {
    const section = JSON.parse(JSON.stringify(this.state[stepName]));
    const element = { ...section[rootIndex][index] };
    const options = [...element.data];
    element.value = getSelectedGroup(event, group, options, element.value);

    section[rootIndex][index] = element;
    this.setState({ [stepName]: section });
  };

  checkIfMarkAsDone = () => {
    let { error } = this.formatAllData(true);
    this.setState({ canMarkAsDone: !error ? true : false });
  };

  markAsDone = async () => {
    this.props?.markAsDone(this.props?.selectedTab, true);
  };

  showHideLockPopup = () => {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({
      showLockedPopup: !showLockedPopup
    }));
  }

  unLockProperties = () => {
    this.showHideLockPopup();
    this.props?.unLockedSession(this.props?.selectedTab);
  }

  getTitleSummaryUI = () => {
    let { selectedTab, title_summary, error } = this.state;
    let { isLocked } = this.props?.currentTabData ? this.props?.currentTabData : '';
    return (
      <TitleSummary
        title_summary={title_summary || []}
        specialCategory={[]}
        global={[]}
        groupWiseTitle={[]}
        selectGroup={this.selectCountryGroup}
        setSelectDataArr={this.setSelectDataArr}
        handleSearchableInput={this.handleSearchableInput}
        onBlur={this.autoSave}
        handleChange={this.handleStateChange}
        handleSearchableInput={this.handleSearchableInput}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={!!isLocked}
      />
    );
  };

  getControlFieldUI = () => {
    let { collectionId, selectedTab, controlFieldsData } = this.state;
    let { language } = this.props;
    return (
      <ControlFields
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        collectionId={collectionId}
        language={language}
        controlFieldsData={controlFieldsData}
      />
    );
  }

  handleTab = (event, selectedTab) => {
    const tabData = [...this.state.tabData]
    if(tabData[selectedTab].label === "Control Fields" && !tabData[selectedTab].fetched) {
      this.getControlFieldData();
      tabData[selectedTab].fetched = true;
    }
    this.setState({ selectedTab, tabData });
  }

  render() {
    let { tabData, selectedTab, canMarkAsDone, showLockedPopup, status } = this.state;
    let { currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div className="create-movie">
        <Lock
          lock={isLocked}
          lockedBy={lockedBy}
          clicked={this.showHideLockPopup}>
          <div className="whitebox remove-b-radius">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.content_properties_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div className="autosave">
                  {constantText.all_fields_auto_save_text}
                </div>
                <div
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
            <div className="cr-mov-tab p-b-30 collection-tab">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" data-test="handleTab-btn"
                options={tabData} selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab}
              />
              <div className="collec-sub-type">
                <span className="label">{constantText.sub_type_text}</span>
                <span className="text">{constantText.mannual_text}</span>
              </div>
            </div>
          </div>

          <div className="movieForm-tab">
            {(selectedTab == 0) && this.getTitleSummaryUI()}
            {(selectedTab == 1) && this.getControlFieldUI()}
          </div>
        </Lock>
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
