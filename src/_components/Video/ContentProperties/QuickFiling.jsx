import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";

//Common Components
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import LockedPopup from '../LockedPopup';

//Steps Components
import TitleSummary from "./Steps/TitleSummary";
import Classification from "./Steps/Classification";
import ControlFields from "./Steps/ControlFields";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import Config from '../../../Config/config';
import { getLocalData } from '../../../_helpers/util';
import {
  requiredValidate, alphanumericValidate, characterValidate, numberValidate,
  maxLength
} from '../../../_helpers/validation';
import QuickFilingJson from '../Schema/QuickFiling/ContentProperties.json';
import SinglePageLandingJson from '../Schema/ContentProperties/ContentProperties.json';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";

//Css files
import "../../../../public/css/Common/ContentProperties.css";

class QuickFiling extends Component {
  constructor(props) {
    super(props);
    let { state }= props;
    let { title_summary, global, classification } = state? (state== 'quick-filing')? QuickFilingJson: SinglePageLandingJson: {};
    this.state = {
      userInfo: getLocalData("userData"),
      tabData: state? (state== 'quick-filing')? constantText.quick_filing_content_properties_header_arr:
        constantText.single_page_landing_content_properties_header_arr: [],
      action: "UnPublished",
      selectedTab: 0, contentId: null,
      title_summary, global, classification,
      isLocked: false, lockedBy: "", lockedByEmail: "", showLockedPopup: false,
      canMarkAsDaone: false, error: false,
    };
  }

  componentDidMount() {
    let { contentId } = this.props;
    this.setState({ contentId: contentId || null }, () => {
      if (contentId) this.fetchContentData();
    });
  }

  fetchContentData = async () => {
    let { contentId } = this.state;
    let { language } = this.props;
    let url = `${Config.movieDetails}/${contentId}/${language}/properties`;
    let response = await apiCalls(url, "GET", {});
    if (response) {
      let { contentData } = response;
      this.updateValues(contentData || {});
    }
  };

  updateValues = dataObj => {
    let { isLocked, lockedBy, lockedByEmail, isDone } = dataObj;
    let { title_summary, global, classification, userInfo } = this.state;
    title_summary = (title_summary && this.updateArrValue(title_summary, dataObj));
    classification = (classification && this.updateArrValue(classification, dataObj));
    global = (global && dataObj?.globalProperties) ? this.updateArrValue(global, dataObj.globalProperties) : global;

    this.setState({
      title_summary, global, classification,
      isLocked: (isLocked && (userInfo.userID != lockedByEmail)) ? true : false,
      lockedBy: lockedBy || "",
      lockedByEmail: lockedByEmail || "",
    }, () => {
      this.checkIfMarkAsDone();
      this.props?.markAsDone(0, !!isDone)
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

  handleChange = (event, rootIndex, index, stepName) => {
    let { value } = event.target;
    this.handleStateChange(stepName, index, value);
  };

  handleDate = (event, rootIndex, index, stepName) => {
    let { value } = event.target;
    value = value ? moment(value).format(constantText.date_format_placeholder) : value;
    this.handleStateChange(stepName, index, value);
  };

  handleTime = (value, rootIndex, index, stepName) => {
    this.handleStateChange(stepName, index, value && value.format("HH:mm:ss"));
  };

  onEditorValueChange = (rootIndex, index, value, stepName) => {
    this.handleStateChange(stepName, index, value);
  };

  handleMultiSelect = (event, rootIndex, index, value, stepName) => {
    this.handleStateChange(stepName, index, value);
  };

  handleStateChange = (stepName, index, value) => {
    let stepNameArr = this.state[stepName].slice();
    let shallowArr = [...stepNameArr];
    let { text, numeric, maxTextLength } = shallowArr[index];

    let errorMsg = (((text && numeric) ? alphanumericValidate(value) : text ? characterValidate(value) :
      numeric ? numberValidate(value) : null) ||
      (maxTextLength && maxLength(maxTextLength, value))) || null;
    shallowArr[index] = { ...shallowArr[index], value, errorMsg };
    this.setState(prevState => ({ [stepName]: shallowArr }), () => this.props.markAsDone(0, false));
  };

  setSelectDataArr = (stepName, rootIndex, index, data) => {
    let stepNameArr = this.state[stepName].slice();
    let shallowArr = [...stepNameArr];
    shallowArr[index] = { ...shallowArr[index], data: data || [] };
    this.setState((prevState) => ({ [stepName]: shallowArr }));
  };

  formatData = (data, checkLength) => {
    let formattedData = {};
    for (let obj of data) {
      let { name, value, multiple } = obj;
      if (!checkLength || (checkLength && (multiple ? value.length > 0 : value))) {
        formattedData[name] = value;
      }
    }
    return formattedData;
  };

  checkError = (dataArr, checkRequired) => {
    let error = null;
    for (let obj of dataArr) {
      let { name, required, multiple, errorMsg } = obj;
      let value = obj["value"];
      if (errorMsg) return (error = name);
      if (checkRequired && required && requiredValidate(multiple ? !!value.length : value))
        return (error = name);
    }
    return error;
  };

  formatAllData = (checkRequired) => {
    let { title_summary, global, classification, action } = this.state;
    let { language } = this.props;
    let allData = classification ? [...title_summary, ...classification] : [...title_summary];
    let error = this.checkError(global ? [...allData, ...global] : [...allData], checkRequired);
    let formattedData = this.formatData(allData, false);
    formattedData = this.formatData(allData, true);

    if (global && Object.keys(this.formatData(global, true)).length > 0) {
      formattedData.globalProperties = this.formatData(global, true);
    }

    let movieData = { language, action, movie: formattedData };
    return { error, movieData };
  };

  autoSave = async () => {
    let { contentId, isLocked } = this.state;
    let { match, state } = this.props;
    let { movieData, error } = this.formatAllData(false);
    movieData.movie.isDone = false;
    movieData.movie.isLocked = (match?.params?.id) ? true : false;
    if (!isLocked && !error) {
      let url = `${Config.movieProperties}/${contentId}`;
      if(state== 'quick-filing'){
        movieData.movie.isMultiAudio = true;
      }
      if(state== 'single-landing-page'){
        url = `${Config.movieProperties}/single/landing/${contentId}`;
      }
      let response = await apiCalls(url, "PUT", movieData, '/dashboard', true);
      if (response) {
        let { contentId } = response;
        this.setState((prevState) => ({
          error: false,
          contentId: contentId || this.state.contentId,
        }));
        this.checkIfMarkAsDone();
      }
    }
  };

  checkIfMarkAsDone = () => {
    let { error } = this.formatAllData(true);
    this.setState({ canMarkAsDaone: !error ? true : false });
  };

  markAsDone = async () => {
    let { contentId } = this.state;
    let { match, state } = this.props;
    let { movieData, error } = this.formatAllData(false);
    if (error) {
      return this.setState({ error });
    } else {
      movieData.movie.isDone = true;
      movieData.movie.isLocked = (match?.params?.id) ? true : false;
      let url = `${Config.movieProperties}/${contentId}`;
      if(state== 'quick-filing'){
        movieData.movie.isMultiAudio = true;
      }
      if(state== 'single-landing-page'){
        url = `${Config.movieProperties}/single/landing/${contentId}`;
      }
      let response = await apiCalls(url, "PUT", movieData);
      if (response) {
        this.props.markAsDone(0, true);
      }
    }
  };

  showHideLockPopup = isLocked => {
    let { showLockedPopup } = this.state;
    this.setState({
      isLocked,
      showLockedPopup: !showLockedPopup
    }, () => {
      if (!isLocked) {
        this.autoSave();
      }
    });
  }

  getTitleSummaryUI = () => {
    let { selectedTab, title_summary, global, isLocked, error } = this.state;
    return (
      <TitleSummary
        title_summary={title_summary}
        global={global}
        setSelectDataArr={this.setSelectDataArr}
        onBlur={this.autoSave}
        handleChange={this.handleChange}
        onEditorValueChange={this.onEditorValueChange}
        handleMultiSelect={this.handleMultiSelect}
        handleDate={this.handleDate}
        handleTime={this.handleTime}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={isLocked}
      />
    );
  };

  getClassificationUI = () => {
    let { selectedTab, classification, isLocked, error } = this.state;
    return (
      <Classification
        classification={classification}
        setSelectDataArr={this.setSelectDataArr}
        onBlur={this.autoSave}
        handleChange={this.handleChange}
        handleMultiSelect={this.handleMultiSelect}
        handleDate={this.handleDate}
        handleTime={this.handleTime}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={isLocked}
      />
    );
  }

  getControlFieldUI = () => {
    let { contentId, selectedTab } = this.state;
    let { language } = this.props;
    return (
      <ControlFields
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        contentId={contentId}
        language={language}
      />
    );
  }

  getSinglePageUI= ()=> {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  getQuickFilingUI= ()=> {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getClassificationUI()}
        {(selectedTab == 2) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  handleTab = (event, selectedTab) => this.setState({ selectedTab });

  render() {
    let { selectedTab, tabData, canMarkAsDaone, showLockedPopup, isLocked, lockedBy } = this.state;
    let { state, match, currentTabData } = this.props;
    return (
      <div className="create-movie">
        <div className={(match?.params?.id && isLocked) ? "lock-screen" : ""}>
          <div className="lock-dot-top"></div>
          <div className="lock-dot-bottom"></div>
          <div className="lock-dot-left"></div>
          <div className="lock-dot-right"></div>
          {(match?.params?.id && isLocked) && (
            <div className="lock-user-info">
              <div className="loc-icon" onClick={() => this.showHideLockPopup(true)}><LockIcon /></div>
              {lockedBy && <div className="user-name">{lockedBy}</div>}
            </div>
          )}
          <div className="whitebox remove-b-radius">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.content_properties_text}</h4>
              <div className="status-head flex align-items-center">
                <div className="cm-draft">{constantText.draft_text}</div>
                <div className="autosave">
                  {constantText.all_fields_auto_save_text}
                </div>
                <div data-test="markAsDoneBtn"
                  className={`mark-done ${currentTabData?.done ? "mark-active" : canMarkAsDaone ? "mark-fill-active" : ""} auto-mark-done`}
                  onClick={() => {
                    if (canMarkAsDaone)
                      this.markAsDone();
                  }}>
                  <span><MarkDone /></span>
                  {constantText.mark_as_done_text}
                </div>
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable"
                options={tabData} selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab}
              />
            </div>
          </div>

          <div className="movieForm-tab">
            {state ? (state == 'quick-filing')? this.getQuickFilingUI(): this.getSinglePageUI(): null}
          </div>
        </div>
        <LockedPopup className="popup-wrap status-popup" state={showLockedPopup} lockedBy={lockedBy}
          doneAction={() => this.showHideLockPopup(false)} cancelAction={() => this.showHideLockPopup(true)} />
      </div>
    );
  }
}

export default QuickFiling;
