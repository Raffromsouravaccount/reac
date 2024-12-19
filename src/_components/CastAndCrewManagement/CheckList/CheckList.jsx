import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

//Sub Components
import CheckList from "../../Common/PublishContent/CheckList";
import QuickLinks from "../../Common/PublishContent/QuickLink";

//Common Components
import OtherLangModel from "../../Common/Model/OtherLangModel";
import { CommonModel } from "../../Common/Model/CommonModel";
import BadgeBox from "./../../Common/BadgeBox/BadgeBox";

//Common Components
import Button from "./../../Common/ButtonField/ButtonField";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper files
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";
import { getLocalData } from "../../../_helpers/util";
import { history } from "../../../_helpers/history";

//css
import "../../../../public/css/Common/Checklist.css";

class CheckListComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: getLocalData("userData"),
      contentId: null, language: "", status: null,
      checkListArr: constantText.castNCrew_checkList_arr,
      translationDone: false,
      checkPartiallyTrans: false,
      allLang: [], assignedLang: [], otherLang: [],
      publishHistory: [], unPublishedHistory: [],
      licenceCountries: [], allCountries: [],
      publishSelCountryData: [], unPublishedCountryData: [], unPublishedSelCountryData: [],
      reasonData: ["License expired", "On Hold", "Missing metadata", "Missing video file",
        "Missing images", "Missing subtitle", "Legal issue"], reasonSelData: null,
      selectedCountryArr: [], selectedLang: [], selectedLangArr: [],
      checkListDone: false, showOtherLangModel: false, showUnPublishedPopup: false,
      error: null,
      isDisabled: false,
      allStatus: [],
      model: {
        detail: "",
        open: false,
        disableBackdropClick: false,
        desc: "",
        showBtn1: true,
        showBtn2: true,
        btn1: constantText.castProfile.yes,
        btn2: constantText.no_text
      },
    };
  }

  componentDidMount() {
    let { contentId, language } = this.props;
    let {checkListArr} = this.state;
    checkListArr?.map(item => {
      item.done = false;
      if(item.doneKey == 'faq'){
        item.done = true;
      }
    });
    this.setState(prevState => ({ contentId, language }), () => {
      this.getCastData(contentId);
      this.getCastTranslations();
      this.getAllStatus();
      this.getCheckListData(contentId);
    });
  }

  getCastTranslations = async () => {
    let { contentId } = this.state;
    const response = await apiCalls(`${Config.castLanguageListStatus}/${contentId}`, "GET");
    if (response) {
      const translationStatus = await this.checkTranslationStatus(response);
      this.setState({
        translationDone: translationStatus.translationPublish,
        translationMarkDone: translationStatus.translationMarkDone,
        assignedLang: response?.assigned,
        otherLang:  response?.unassigned
      });
    }
  }

  getCastData = async contentId => {
    const response = await apiCalls(`${Config.createProfileUrl}/${contentId}`, "GET");
    if (response) {
      let { contentState } = response;
      this.setState({
        status: contentState?.title,
      });
    }
  }

  getAllStatus = async() => {
    let response = await apiCalls(`${Config.masterUrl}/ContentState`, 'GET', {});
    if (response) {
      this.setState({allStatus: response});
    }
  }

  getCheckListData = async contentId => {
    let { checkListArr} = this.state;
    let response = await apiCalls(`${Config.castChecklist}/${contentId}`, 'GET', {});
    if (response) {
      let { checkListArr } = this.state;
      checkListArr = checkListArr?.map(data => {
        let apiItem = response.find(item => item.sectionName === data.doneKey);
        data.done = apiItem?.isDone ? true : false;
        return data;
      });
      checkListArr?.map(item => {
        if(item.doneKey == 'faq'){
          item.done = true;
        }
      });
      let checklistItems = response.filter((itm) => {
        return constantText.cast_and_Crew_Sections.indexOf(itm.sectionName) > -1;
      });
      let checklistStatus;
      if(checklistItems && checklistItems.length > 0) {
        checklistStatus = checklistItems?.find(item => item.isDone == false);
      } else {
        checklistStatus = true
      }
      this.setState({
        checkListArr: checkListArr,
        checkListDone: checklistStatus ? false : true,
      })
    }

  };


  handleMultiSelect = (event, id, name, value) => {
    let { error } = this.state;
    let selectedCountryArr = [];
    if (name != "reasonSelData") {
      selectedCountryArr = selectedCountryArr?.concat(value?.map(data => data?.country));
    }
    this.setState({
      [name]: value,
      selectedCountryArr,
      error: (name == "unPublishedSelCountryData" && value.length > 0) ? null : error
    });
  }

  showHideOtherLangModel = goToRoute => {
    let { contentId, selectedLangArr, showOtherLangModel } = this.state;
    this.setState({ showOtherLangModel: !showOtherLangModel, selectedLang: [], selectedLangArr: [] });
    if (goToRoute && selectedLangArr.length > 0) {
      history.push(`/cast/edit/${contentId}/translation`, { language: selectedLangArr });
    }
  }

  publishContent = () => {
    let { language, status, allStatus } = this.state;
    const currentStatus = allStatus.find(item => item.title === status);
    const nextState = allStatus.find(item => item.title === constantText.castProfile.published);
    let data = {
      fromState: currentStatus?.id,
      toState: nextState?.id,
      contentType: constantText?.castProfileContentType,
      language,
      contentData: { }
    };
    let alertData = {
      title: constantText.castProfile.published,
      desc: constantText.castProfile.publishedDesc
    }
    this.serverCallsAction(data, alertData);
  }

  unPublishContent = () => {
    let { language, status, allStatus } = this.state;
    const currentStatus = allStatus.find(item => item.title === status);
    const nextState = allStatus.find(item => item.title === constantText.castProfile.unpublished);
    let data = {
      fromState: currentStatus?.id,
      toState: nextState?.id,
      contentType: constantText.castProfile.contentType,
      language,
      contentData: { }
    };
    let alertData = {
      title: constantText.castProfile.unpublished,
      desc: constantText.castProfile.unpublishedDesc
    }
    this.serverCallsAction(data, alertData);
  }

  serverCallsAction = async (data, alertData) => {
    let { contentId, status } = this.state;
    let response = await apiCalls(`${Config.workflowAPI}/${contentId}`, "PUT", data);
    if (response) {
      const { model } = this.state;
      let shallowModel = { ...model };
      const title = alertData.title
      const desc = alertData.desc
      shallowModel.open = true;
      shallowModel.showBtn1 = true;
      shallowModel.showBtn2 = false;
      shallowModel.disableBackdropClick = true;
      shallowModel.title = title;
      shallowModel.desc = desc;
      shallowModel.btn1 = constantText.castProfile.ok;
      shallowModel.detail = {
        contentPubUnpub: true
      }
      this.setState({ model: shallowModel });
    }
  }

  closeModel = () => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = false;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = '';
    shallowModel.desc = '';
    this.setState({ model: shallowModel });
  }

  handleModel = async (action, modelAction) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    if (modelAction?.detail?.contentPubUnpub) {
      history.push('/cast');
      return;
    }
    if (action) {
      if (modelAction?.detail?.type === constantText.castProfile.published) {
        this.closeModel();
        this.unPublishContent();
      }
      if ((modelAction?.detail?.type === constantText.castProfile.unpublished) || (modelAction?.detail?.type === constantText.castProfile.draft) || (modelAction?.detail?.type === constantText.castProfile.draft) || (modelAction?.detail?.type === constantText.castProfile.changed)) {
        this.closeModel();
        this.publishContent();
      }
    } else {
      this.closeModel();
    }
  }

  showProfileModelAlert = () => {
    const { model, status } = this.state;
    let shallowModel = { ...model };
    let title = '';
    let desc = '';
    if (status === constantText.castProfile.unpublished || status === constantText.castProfile.draft || status === constantText.castProfile.changed) {
      title = constantText.castProfile.publish;
      desc = constantText.castProfile.publishAlertDesc
    }else {
      title = constantText.castProfile.unpublish;
      desc = constantText.castProfile.unPublishAlertDesc
    }
    shallowModel.open = true;
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = title;
    shallowModel.desc = desc;
    shallowModel.detail = {
      type: status
    }
    this.setState({ model: shallowModel });
  }

  selectLanguage = (langObj, keyText) => {
    let { selectedLang, selectedLangArr } = this.state;
    let index = selectedLang.indexOf(langObj[keyText]);
    if (index > -1) {
      selectedLang.splice(index, 1);
      selectedLangArr.splice(index, 1);
    }
    else {
      selectedLang.push(langObj[keyText]);
      selectedLangArr.push(langObj);
    }
    this.setState({ selectedLang, selectedLangArr });
  }

  checkPublishUnpublishPermission = () => {
    let { status, checkListDone, translationDone } = this.state;
    if(!translationDone) return true;
    let publish = (permissionObj?.["cast"]?.["publish"]?.["canCreate"]() && translationDone && checkListDone) ? true : false;
    if ((status === constantText.castProfile.unpublished || status === constantText.castProfile.draft || status === constantText.castProfile.changed)) {
      if (publish){
        return false
      } else {
        return true
      }
    }
  }

  getButtonText = () => {
    let { status } = this.state;
    return ((status === constantText.castProfile.unpublished || status === constantText.castProfile.draft || status === constantText.castProfile.changed || !status) ? constantText.castProfilepublished : constantText.castProfileUnpublished);
  }

  checkTranslationStatus = async(response) => {
    let checkTranslationStatusAssigned = response?.assigned?.find(data => data.translationStatus == 1 && !data.isDone);
    let checkTranslationStatusUnassigned = response?.unassigned?.find(data => data.translationStatus == 1 && !data.isDone);

    let checkTranslationStatusDoneAssigned = response?.assigned?.find(data => data.translationStatus == 1 && data.isDone);
    let checkTranslationStatusDoneUnassigned = response?.unassigned?.find(data => data.translationStatus == 1 && data.isDone);

    let checkDoneTranslationAssigned = response?.assigned?.find(data => data.translationStatus == 2 && data.isDone);
    let checkDoneTranslationUnassigned = response?.unassigned?.find(data => data.translationStatus == 2 && data.isDone);

    let checkNotDoneTranslationAssigned = response?.assigned?.find(data => data.translationStatus == 2 && !data.isDone);
    let checkNotDoneTranslationUnassigned = response?.unassigned?.find(data => data.translationStatus == 2 && !data.isDone);

    let checkTranslationStatusAssigned1 = response?.assigned?.find(data => data.translationStatus == 1);
    let checkTranslationStatusUnassigned2 = response?.unassigned?.find(data => data.translationStatus == 1);

    if ((checkTranslationStatusDoneAssigned || checkTranslationStatusDoneUnassigned || checkDoneTranslationAssigned || checkDoneTranslationUnassigned) && (!checkTranslationStatusAssigned && !checkTranslationStatusUnassigned && !checkNotDoneTranslationAssigned && !checkNotDoneTranslationUnassigned)) {
      return this.getTranslationStatus(true, true)
    }

    if (!checkTranslationStatusAssigned1 && !checkTranslationStatusUnassigned2 && (!checkDoneTranslationAssigned && !checkDoneTranslationUnassigned && !checkDoneTranslationAssigned && !checkDoneTranslationUnassigned)) {
      return this.getTranslationStatus(true, false)
    }
    if (!checkTranslationStatusAssigned && !checkTranslationStatusUnassigned && !checkDoneTranslationAssigned && !checkDoneTranslationUnassigned && !checkTranslationStatusAssigned1 && !checkTranslationStatusUnassigned2 && !checkNotDoneTranslationAssigned && !checkNotDoneTranslationUnassigned) {
      return this.getTranslationStatus(false, false)
    }
    if (checkNotDoneTranslationAssigned || checkNotDoneTranslationUnassigned && (!checkDoneTranslationAssigned && !checkDoneTranslationUnassigned)) {
      return this.getTranslationStatus(false, false)
    }
    if ((checkDoneTranslationAssigned || checkDoneTranslationUnassigned) && (!checkTranslationStatusAssigned && !checkTranslationStatusUnassigned)) {
      return this.getTranslationStatus(true, true)
    }
    if (checkTranslationStatusAssigned || checkTranslationStatusUnassigned) {
      return this.getTranslationStatus(false, false)
    }
  }

  getTranslationStatus = (publishStatus, markStatus) => {
    let translationObj = { translationPublish: publishStatus, translationMarkDone: markStatus }
    return translationObj;
  }

  checkSubmitReviewPermission = () => {
    let { checkListDone, status, translationDone, relatedContentDone, collectionAssignmentDone } = this.state;
    if (!translationDone || !checkListDone) return true;
    return false
  }

  render() {
    const { checkListArr, translationDone, assignedLang, status, model, showOtherLangModel, selectedLang, otherLang, translationMarkDone } = this.state;
      let canPublish = (permissionObj?.["cast"]?.["publish"]?.["canCreate"]());
      const buttonText = this.getButtonText();
    return (
      <div>
        <div className="whitebox m-b-30">
          <div className="checklist-area">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>{constantText.checkList_text}</h4>
              <div className="status-head flex align-items-center">
                <BadgeBox status={status} />
              </div>
            </div>
            <div className="checklist">
              <CheckList
                checkListArr={checkListArr}
                markAsDoneText={constantText.details_full_done_text}
                partialltDoneText={constantText.details_partially_done_text}
              />
              <QuickLinks
                assignedLang={assignedLang.length > 0 ? assignedLang : []}
                keyText="title"
                showTranslation={true}
                showHideOtherLangModel={() => this.showHideOtherLangModel(false)}
                translationDone={translationMarkDone}
                disableReviewButton={true}
                showReviewButton={false}
                submitToReviewAction={this.publishContent}
              />
              <div className="checklist-button">
              { (status !== constantText.castProfile.archived && !this.props.viewMode && canPublish) ?
                <Button className="zee-btn-field zee-half" variant="contained" color="primary"
                disabled={this.checkPublishUnpublishPermission()}
                buttonText={buttonText}
                onClick={this.showProfileModelAlert} />
                : null  }
              </div>
            </div>
          </div>
        </div>
        <OtherLangModel
          className="popup-wrap status-popup other-lang-poupup"
          state={showOtherLangModel}
          languageList={otherLang} keyText="title"
          selectedLang={selectedLang}
          showBtn1={true} btn1Text="Yes" btn1Action={allLang => this.showHideOtherLangModel(true)}
          showBtn2={true} btn2Text="No" btn2Action={allLang => this.showHideOtherLangModel(false)}
          selectLanguage={this.selectLanguage}
          handleClose={() => this.showHideOtherLangModel(false)} />
        <CommonModel
          className="popup-wrap status-popup"
          state={model.open}
          showIcon={false}
          showTitle={true}
          title={model.title}
          showDes={true}
          des={model.desc}
          showBtn1={model.showBtn1}
          btn1Text={model.btn1}
          btn1Action={() => this.handleModel(true, model)}
          showBtn2={model.showBtn2}
          btn2Action={() => this.handleModel(false, model)}
        />
      </div>
    );
  }
}

export default CheckListComp;
