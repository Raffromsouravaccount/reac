import React, { Component, Fragment } from "react";

//Sub Components
import CheckList from "../../Common/PublishContent/CheckList";
import QuickLinks from "../../Common/PublishContent/QuickLink";
import PublishContent from "../../Common/PublishContent/PublishContent";
import PublishedHistory from "../../Common/PublishContent/PublishedHistory";
import AddSchedule from "../../Common/PublishContent/AddSchedule";
import ScheduleContent from "../../Common/PublishContent/SceduleContent";
import ScheduleHistory from "../../Common/PublishContent/ScheduleHistory";
import RejectedContent from "../../Common/PublishContent/RejectedContent";
import UnpublishedHistory from "../../Common/PublishContent/UnPublishedHistory";

//Common Components
import OtherLangModel from "../../Common/Model/OtherLangModel";
import { CommonModel } from "../../Common/Model/CommonModel";
import SelectWithSearch from "../../Common/SelectWithSearch/SelectWithSearch";
import BadgeBox from "./../../Common/BadgeBox/BadgeBox";
import Button from "../../Common/ButtonField/ButtonField";

//Services
import { apiCalls, commonService } from "../../../_services/common.service";

//Helper files
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";
import { getLocalData, getSelectedGroup } from "../../../_helpers/util";
import { history } from "../../../_helpers/history";
import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";

//Icons
import MovieSquarGreenIcon from "images/movie-squar-green-icon.svg";

//css
import '../../../../public/css/Common/Checklist.css';

class CheckListComp extends Component {
  constructor(props) {
    super(props);
    let { state } = this.props;
    let filterKey = state ? (state == "quick-filing") ? "quickFiling" : "singleLanding" : "properties";
    this.state = {
      userInfo: getLocalData("userData"),
      allStatus: [],
      videoState: filterKey,
      contentId: null, language: "", status: null,
      checkListArr: constantText.video_checkList_arr.filter(data => (data[filterKey])),
      translationDone: false, relatedContentDone: false, collectionAssignmentDone: false,translationMarkDone: false,
      assignedLang: [], otherLang: [],
      publishHistory: [], scheduleHistory: [], unPublishedHistory: [],
      scheduleArr: [], scheduleData: { scheduledPublicationTime: "", countryData: [], selectedCountry: [] },
      licenceCountries: [], allCountries: [], publishSelCountryData: [], rePublishSelCountryData: [], unPublishedCountryData: [],publishScheduleSelCountry: [],
      unPublishedSelCountryData: [], rejecSelCountryData: [],
      reasonData: [],
      reasonSelData: null,
      selectedCountryArr: [], selectedLang: [], selectedLangArr: [], currentSchedule: {},
      checkListDone: false, showOtherLangModel: false, showUnPublishedPopup: false, showPublishedPopup: false, showDeleteSchedulePopup: false,
      error: null,
      reasonRequired: true,
      scheduleFocus: React.createRef(),
      unpublishErrorMsg: null,
      licenseExpired: true,
      changedToSchedule: false,
      changedToSchCountry: [],
      updateSch: false,
      model: {
        detail: "",
        open: false,
        disableBackdropClick: false,
        desc: "",
        showBtn1: true,
        showBtn2: true,
        btn1: constantText.videoConstants.yes,
        btn2: constantText.videoConstants.no
      },
    };
  }


  componentDidMount() {
    let { contentId, language } = this.props;
    this.setState(prevState => ({ contentId, language }), async () => {
      await this.getVideoDetails();
      this.getReasonData();
      this.getVideoHistory();
      this.getAllCountrys(contentId);
      this.getLicense()
      this.getAllStatus();
      this.getAllStatesStatus(contentId);
      this.getLanguageList();
    });
  }

  getReasonData = async() => {
    let { status } = this.state;
    if(status === constantText.tvShowsConstants.submittedToReview || status === constantText.tvShowsConstants.published || status === constantText.tvShowsConstants.changed) {
      let reasonResData = await commonService.getReasonTypeMasterData();
      this.setState({ reasonData: reasonResData })
    }
  }

  getLicense = async () => {
    let { contentId } = this.state;
    let url = `${Config.videoLicense}/${contentId}`;
    let response = await apiCalls(url, 'GET', null, null, false, false, this.autoSaveError);
    if(response?.length > 0){
      let activeLicense = response.find(item => item.status == '1');
      if(!activeLicense) {
        this.setState({ licenseExpired: false })
      } else {
        this.setState({ licenseExpired: true })
      }
    }
  }

  getVideoDetails = async () => {
    const { contentId } = this.state;
    let url = `${Config.videoProperties}/${contentId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title });
    }
  }

  getAllStatus = async () => {
    let response = await apiCalls(`${Config.masterUrl}/ContentState`, 'GET', {});
    if (response) {
      this.setState({ allStatus: response });
    }
  }


  getAllStatesStatus = async contentId => {
    let response = await apiCalls(`${Config.video.action}/${contentId}`, 'GET', {});
    if (response) {
      let { checkListArr } = this.state;
      let relatedContentStatus = response?.find(data => data.sectionName === 'relatedContent');
      let collectionAssignmentStatus = response?.find(data => data.sectionName === 'collectionAssignment');
      checkListArr = checkListArr?.map(data => {
        let apiItem = response.find(item => item.sectionName === data.doneKey);
        data.done = apiItem?.isDone ? true : false;
        return data;
      });
      let checklistItems = await response.filter((itm) => {
        return constantText.videoChecklistSections.indexOf(itm.sectionName) > -1;
      });
      let checklistStatus;
      if(checklistItems && checklistItems.length > 0) {
        checklistStatus = checklistItems?.find(item => item.isDone == false);
      } else {
        checklistStatus = true
      }
      this.setState({
        checkListArr: checkListArr,
        collectionAssignmentDone: collectionAssignmentStatus?.isDone ? true : false,
        checkListDone: checklistStatus ? false : true,
        relatedContentDone: relatedContentStatus?.isDone ? true : false,
      })
    }
  }

  getAllCountrys = async (contentId) => {
    let response = await apiCalls(`${Config.video.licenseCountries}/${contentId}`, 'GET', {});
    if(response) {
      response?.map(item =>{
        item['group'] = 'All-Country'
      })
      this.setState({ allCountries: response })
    } else {
      this.setState({ allCountries: [] })
    }
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

  getLanguageList = async () => {
    let { contentId } = this.state;
    let url = `${Config.video.languageListStatus}/${contentId}`;
    let response = await apiCalls(url, "GET", null, `/video/edit/${contentId}`);
    if (response) {
      let translationStatus = await this.checkTranslationStatus(response);
      this.setState({
        translationDone: translationStatus?.translationPublish,
        translationMarkDone: translationStatus?.translationMarkDone,
        assignedLang: response?.assigned,
        otherLang: response?.unassigned
      });
    }
  }

  getVideoHistory = async () => {
    let { contentId, language } = this.state;
    let url = `${Config.workflowHistory}/video/${contentId}`;
    let response = await apiCalls(url, "GET", null, `/video/edit/${contentId}`);
    if (response) {
      let { publish, schedule, unpublish} = response || {};
      this.setState({
        publishHistory: publish?.country,
        scheduleHistory: schedule,
        unPublishedHistory: unpublish
      });
    }
  }

  handleMultiSelect = (event, id, name, value) => {
    let { error, unpublishErrorMsg, reasonSelData, unPublishedCountryData } = this.state;
    let selectedCountryArr = [];
    if ( reasonSelData && unPublishedCountryData.length > 0 ) {
      this.setState({ unpublishErrorMsg: null });
    }
    if (name != "reasonSelData") {
      selectedCountryArr = selectedCountryArr?.concat(value?.map(data => data?.title));
    }
    if(name == "reasonSelData" && value) {
      this.setState({reasonRequired: true})
    }

    this.setState({
      [name]: value,
      selectedCountryArr,
      error: (name == "unPublishedSelCountryData" && value.length > 0) ? null : error
    });
  }

  handleScheduleData = (event, index, name, value) => {
    let scheduleValue = value;
    let { scheduleArr } = this.state;
    scheduleArr[index][name] = scheduleValue;
    this.setState({ scheduleArr });
  }

  addRemoveSchedule = (event, index) => {
    let { scheduleArr, scheduleData, allCountries } = this.state;
    let shallowArr = [...scheduleArr];
    if (index >= 0) {
      shallowArr.splice(index, 1);
    }
    else {
      let updatedData = { ...scheduleData, countryData: allCountries };
      shallowArr.push(updatedData);
    }
    this.setState({ scheduleArr: shallowArr, updateSch: false, changedToSchedule: false });
  }

  showHideOtherLangModel = goToRoute => {
    let { contentId, selectedLangArr, showOtherLangModel } = this.state;
    let { state } = this.props;
    this.setState({ showOtherLangModel: !showOtherLangModel, selectedLang: [], selectedLangArr: [] });
    if (goToRoute && selectedLangArr.length > 0) {
      if (state == 'quick-filing') {
        history.push(`/video/quick/edit/${contentId}/translation`, { language: selectedLangArr });
      } else {
        history.push(`/video/edit/${contentId}/translation`, { language: selectedLangArr });
      }
    }
  }

  showHideDeleteScheduleModel = (event, currentSchedule) => {
    this.setState({ currentSchedule });
    const alertData = {
      title: constantText.videoConstants.schedule,
      desc: constantText.videoConstants.deleteScheduleAlertDesc,
    }
    this.showProfileModelAlert(constantText.videoConstants.deleteSchedule, alertData)
  }

  showHideUnPublishedModel = async data => {
    let { showUnPublishedPopup, unPublishedSelCountryData, reasonSelData, reasonData } = this.state;
    let unPublishedCountry = [];
    data?.map(obj => {
      unPublishedCountry = unPublishedCountry?.concat(obj.title);
      return obj;
    });
    this.setState({
      showUnPublishedPopup: !showUnPublishedPopup,
      unPublishedCountryData: data || [],
      unPublishedSelCountryData: data?.length > 0 ? unPublishedSelCountryData : [],
      reasonSelData: data?.length > 0 ? reasonSelData : null,
      reasonData
    });
  }

  showHidePublishedModel = data => {
    let { showPublishedPopup, reasonSelData } = this.state;
    this.setState({
      showPublishedPopup: !showPublishedPopup,
      rePublishSelCountryData: data?.length > 0 ? data : [],
      reasonSelData: data?.length > 0 ? reasonSelData : null
    });
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

  formatDataForSchedule = scheduleObj => {
    let { id, scheduledPublicationTime, selectedCountry } = scheduleObj;
    let country = [...selectedCountry];
    let newCountry = []
    country.forEach(item => {
      newCountry.push({ id: item.id, title:item.title })
    });
    return { id, scheduledPublicationTime, country: newCountry };
  }

  submitToReview = () => {
    const alertData = {
      title: constantText.videoConstants.submitToReview,
      desc: constantText.videoConstants.submitToReviewDesc,
    }
    this.showProfileModelAlert(constantText.videoConstants.submittedToReview, alertData)
  }

  showProfileModelAlert = (actionType, alertData, index) => {
    const { model, status } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: actionType,
      index: index
    }
    this.setState({ model: shallowModel });
  }

  handleModel = (flag, modelAction) => {
    let { publishSelCountryData, status, allStatus, rePublishSelCountryData, scheduleArr, currentSchedule, unPublishedSelCountryData, publishScheduleSelCountry, allCountries } = this.state;
    let allNewCountry = [];
    allCountries?.map(item => allNewCountry.push({id: item.id, title: item.title}))
    if (!flag || modelAction.detail.type === 'confirmed') {
      this.setState({ publishSelCountryData: [] })
      this.closeModel();
      return;
    }
    if (modelAction.detail.type === constantText.videoConstants.deleteSchedule) {
      let country = [...currentSchedule?.country];
      let newCountry = [];
      country.map(item => {  newCountry.push({ id: item.id, title: item.title }) })
      country = newCountry;
      let data = {
        contentType: constantText.videoConstants.contentType,
        contentData: { country: newCountry }
      };
      const alertData = {
        title: constantText.videoConstants.deleteSchedule,
        desc: constantText.videoConstants.deletedScheduleAlertDesc
      }
      this.deleteServerCallsAction(data, alertData)
    }
    if (modelAction.detail.type === constantText.videoConstants.published) {
      const currentStatus = allStatus.find(item => item.title === status);
      const unpublishStatus = allStatus.find(item => item.title === constantText.videoConstants.published);
      let country = rePublishSelCountryData?.length > 0 ? rePublishSelCountryData : publishSelCountryData?.length > 0 ? publishSelCountryData : publishScheduleSelCountry ? publishScheduleSelCountry : null;
      let newCountry = [];
      country.map(item => {  newCountry.push({ id: item.id, title: item.title }) })
      let data = {
        fromState: currentStatus.id,
        toState: unpublishStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: { country: allNewCountry.length > 0 ? allNewCountry: newCountry }
      };
      this.setState({ publishSelCountryData: [], showPublishedPopup: false }, () => {
        const alertData = {
          title: constantText.videoConstants.published,
          desc: constantText.videoConstants.publishedDesc
        }
        this.serverCallsAction(data, alertData)
      });
    }
    if (modelAction.detail.type === constantText.videoConstants.republished) {
      const currentStatus = allStatus.find(item => item.title === status);
      const unpublishStatus = allStatus.find(item => item.title === constantText.videoConstants.published);
      let country = rePublishSelCountryData?.length > 0 ? rePublishSelCountryData : publishSelCountryData;
      let newCountry = [];
      country.map(item => {  newCountry.push({ id: item.id, title: item.title }) })
      let data = {
        fromState: currentStatus.id,
        toState: unpublishStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: { country: newCountry }
      };
      this.setState({ publishSelCountryData: [], showPublishedPopup: false }, () => {
        const alertData = {
          title: constantText.videoConstants.republished,
          desc: constantText.videoConstants.republishedDesc
        }
        this.serverCallsAction(data, alertData)
      });
    }
    if (modelAction.detail.type === constantText.videoConstants.unpublished) {
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.videoConstants.unpublished);
      const country = [...publishSelCountryData];
      let newCountry = [];
      country.map(item => {  newCountry.push({ id: item.id, title: item.title }) })
      let data = {
        fromState: currentStatus.id,
        toState: nextStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: { country: allNewCountry }
      };
      if (unPublishedSelCountryData?.length > 0) {
        const alertData = {
          title: constantText.videoConstants.unpublished,
          desc: constantText.videoConstants.unpublishedDesc
        }
        this.serverCallsAction(data, alertData);
      }
      else {
        this.setState({ error: "Please select the country." });
      }
    }
    if (modelAction.detail.type === constantText.videoConstants.scheduled) {
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.videoConstants.scheduled);
      let data = {
        fromState: currentStatus.id,
        toState: nextStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: this.formatDataForSchedule(scheduleArr[modelAction?.detail?.index])
      };
      const alertData = {
        title: constantText.videoConstants.scheduled,
        desc: constantText.videoConstants.scheduledDesc
      }
      this.serverCallsAction(data, alertData, modelAction?.detail?.index)
    }
    if (modelAction.detail.type === constantText.videoConstants.updateScheduled) {
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.videoConstants.scheduled);
      const { groupName, scheduledPublishOn, selectedCountry, scheduledPublicationTime } = scheduleArr[0];
      let country = [...selectedCountry];
      let newCountry = [];
      selectedCountry.map(item => {  newCountry.push({ id: item.id, title: item.title }) })
      let data = {
        fromState: currentStatus.id,
        toState: nextStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: { groupName, scheduledPublishOn, scheduledPublicationTime, country: newCountry }
      };
      this.setState({ scheduleArr: [] }, () => {
        const alertData = {
          title: constantText.videoConstants.scheduled,
          desc: constantText.videoConstants.updateScheduledDesc
        }
        this.updateServerCallsAction(data, alertData)
      });
    }
    if (modelAction.detail.type === constantText.videoConstants.needWork) {
      let { language, reasonSelData, status, allStatus } = this.state;
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.videoConstants.needWork);
      let data = {
        fromState: currentStatus.id,
        toState: nextStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: { description: reasonSelData }
      };
      this.setState({ rejecSelCountryData: [] }, () => {
        const alertData = {
          title: constantText.videoConstants.needWork,
          desc: constantText.videoConstants.needWorkSubmitAlertDesc
        }
        this.serverCallsAction(data, alertData)
      });
    }
    if (modelAction.detail.type === constantText.videoConstants.submittedToReview) {
      let { language, status, allStatus } = this.state;
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.videoConstants.submittedToReview);
      let data = {
        fromState: currentStatus.id,
        toState: nextStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: {  }
      };
      this.setState({ rejecSelCountryData: [] }, () => {
        const alertData = {
          title: constantText.videoConstants.submittedToReview,
          desc: constantText.videoConstants.submittedToReviewDesc
        }
        this.serverCallsAction(data, alertData)
      });
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
    shallowModel.detail = '';
    this.setState({ model: shallowModel });
  }

  publishContent = () => {
    const alertData = {
      title: constantText.videoConstants.publish,
      desc: constantText.videoConstants.publishAlertDesc,
    }
    this.showProfileModelAlert(constantText.videoConstants.published, alertData)
  }

  republishContent = () => {
    let modelAction = {
      detail:{
        type: 'Republished'
      }
    }
    this.handleModel(true, modelAction)
  }

  UnPublishContent = () => {
      let { language, reasonSelData, status, allStatus,unPublishedSelCountryData } = this.state;
      if(!reasonSelData) {
        this.setState({reasonRequired: false})
      }
      if ( !reasonSelData || unPublishedSelCountryData.length == 0) {
        this.setState({ unpublishErrorMsg: constantText.videoConstants.unpublishErrorMsg })
        return;
      }
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.videoConstants.unpublished);
      let data = {
        fromState: currentStatus.id,
        toState: nextStatus.id,
        contentType: constantText.videoConstants.contentType,
        contentData: { description:  reasonSelData, country: unPublishedSelCountryData}
      };
      this.setState({ rejecSelCountryData: [],showUnPublishedPopup: false  }, () => {
        const alertData = {
          title: constantText.videoConstants.unpublished,
          desc: constantText.videoConstants.unpublishedDesc
        }
        this.serverCallsAction(data, alertData)
      });
  }

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getTvShowStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  scheduleContent = (index, scheduleData) => {
    let scheduleDataCopy = [...scheduleData];
    let scheduleElement = scheduleDataCopy[index];
    if(scheduleElement){
      let newDate = new Date();
      let selectedDate = new Date(scheduleElement?.scheduledPublicationTime);
      let currentTime = newDate.getHours()*60+newDate.getMinutes();
      let selectedTime = selectedDate.getHours()*60+selectedDate.getMinutes();
      if ((selectedDate <= newDate) && selectedTime <= currentTime) {
        let error = {
          data:{
            message: constantText.valid_Time_Msg
          }
        }
        this.autoSaveError(error)
        return;
      };
    }
    const alertData = {
      title: constantText.videoConstants.schedule,
      desc: constantText.videoConstants.scheduleAlertDesc
    }
    this.showProfileModelAlert(constantText.videoConstants.scheduled, alertData, index)
  }

  publishScheduledContent = (event, data) => {
    this.setState(prevState => ({ publishScheduleSelCountry: data?.country || [] }), () => this.publishContent());
  }

  updateSchedule = (event, index, scheduleObj) => {
    let { scheduleArr, allCountries, scheduleHistory, scheduleFocus } = this.state;
    let { scheduledTime, country, groupName} = scheduleObj;
    let updatedCountry = []
    country.map(item => {
      item['group'] = 'All-Country';
      let filteredItem = allCountries?.find(childItem => item.title === childItem.title);
      if(!filteredItem){
        updatedCountry.push(item);
      }
    });
    let shallowArr = [...scheduleArr];
    const newCountries = [...country, ...allCountries];
    let updatedData = {
      scheduledPublicationTime: scheduledTime,
      countryData: newCountries,
      selectedCountry: allCountries,
      groupName: groupName,
      scheduleIndex: index
    };
    let i = shallowArr.findIndex(item => item.scheduledPublicationTime == updatedData.scheduledPublicationTime);
    if(i == -1) {
      shallowArr[0] = updatedData;
      if(scheduleFocus.current){
        scheduleFocus.current.scrollIntoView({
           behavior: "smooth",
           block: "nearest"
        })
      }
    }
    this.setState({ scheduleArr: shallowArr, allCountries, scheduleHistory, updateSch: true });
  };

  needWorkAction = () => {
    const alertData = {
      title: constantText.videoConstants.needWork,
      desc: constantText.videoConstants.needWorkAlertDesc,
    }
    this.showProfileModelAlert(constantText.videoConstants.needWork, alertData)
  }

  updateThisSchedule = (index, scheduleData) => {
    let scheduleDataCopy = [...scheduleData];
    let scheduleElement = scheduleDataCopy[index];
    if(scheduleElement){
      let newDate = new Date();
      let selectedDate = new Date(scheduleElement?.scheduledPublicationTime);
      let currentTime = newDate.getHours()*60+newDate.getMinutes();
      let selectedTime = selectedDate.getHours()*60+selectedDate.getMinutes();
      if ((selectedDate <= newDate) && selectedTime <= currentTime) {
        let error = {
          data:{
            message: constantText.valid_Time_Msg
          }
        }
        this.autoSaveError(error)
        return;
      };
    }
    const alertData = {
      title: constantText.videoConstants.schedule,
      desc: constantText.videoConstants.updateScheduleDesc,
    }
    this.showProfileModelAlert(constantText.videoConstants.updateScheduled, alertData)
  }

  serverCallsAction = async (data, alertData, index) => {
    this.closeModel();
    let { contentId, scheduleArr } = this.state;
    let url = `${Config.workflowAPI}/${contentId}`;
    let response = await apiCalls(url, 'PUT', data, null, true, false, this.autoSaveError);
    if (response) {
      if(index || index == 0) {
        let shallowArr = [...scheduleArr];
        shallowArr.splice(index, 1);
        this.setState({ scheduleArr: shallowArr })
      }
      this.setState({ reasonSelData: null,unPublishedSelCountryData: [], rePublishSelCountryData:[], publishScheduleSelCountry: [], updateSch: false, changedToSchedule: false  })
      this.showConfirmModal(alertData);
      this.componentDidMount();
    }
  }

  updateServerCallsAction = async (data, alertData) => {
    this.closeModel();
    let { contentId } = this.state;
    let url = `${Config.updateSchedule}/${contentId}`;
    let response = await apiCalls(url, 'PUT', data, null, true, false, this.autoSaveError);
    if (response) {
      this.setState({ updateSch: false, changedToSchedule: false })
      this.showConfirmModal(alertData);
      this.componentDidMount();
    }
  }

  deleteServerCallsAction = async (data, alertData) => {
    this.closeModel();
    let { contentId } = this.state;
    let url = `${Config.castDeleteWorkflow}/${contentId}`;
    let response = await apiCalls(url, 'Delete', data, null, true, false, this.autoSaveError);
    if (!response) {
      this.setState({ updateSch: false, changedToSchedule: false })
      this.showConfirmModal(alertData);
      this.componentDidMount();
    }
  }

  showConfirmModal = (alertData) => {
    const { model, status } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = false;
    shallowModel.btn1 = constantText.videoConstants.ok
    shallowModel.title = alertData.title;
    shallowModel.desc = alertData.desc;
    shallowModel.detail = {
      type: 'confirmed'
    }
    this.setState({ model: shallowModel });
  }

  selectCountryGroup = (event, group, index, selectedCountry, type) => {
    const options = [...this.state.allCountries];
    const scheduleArrOpt = [...this.state.scheduleArr];
    if(type == 'published'){
      let selectedValue = [...selectedCountry];
      selectedValue = getSelectedGroup(event, group, options, selectedValue);
      this.setState({ publishSelCountryData: selectedValue });
    }
    if (type == 'scheduled'){
      let selectedValue = [...selectedCountry[index].selectedCountry];
      selectedValue = getSelectedGroup(event, group, scheduleArrOpt[index].countryData, selectedValue);
      scheduleArrOpt[index].selectedCountry = selectedValue;
      this.setState({ scheduleArr: scheduleArrOpt });
    }
  };

  rescheduleHandler = (country) => {
    let { scheduleFocus } = this.state;
    country.map(item => item['group'] = 'All-Country');
    let minDateFormate = new Date();
    const newSchedule = [{
      minDateValue: minDateFormate,
      countryData: country,
      selectedCountry: country
    }]
    if(scheduleFocus.current){
      scheduleFocus.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }
    this.setState({ changedToSchedule: true, changedToSchCountry: country, scheduleArr: newSchedule});
  }

  getPublishComp = () => {
    const { allCountries, selectedCountryArr, publishSelCountryData, checkListDone, translationDone } = this.state;
    let canPublish = (permissionObj?.["movies"]?.["publish"]?.["canCreate"]() && checkListDone && translationDone);
    return (
      <PublishContent selectGroup={(event, group) => this.selectCountryGroup(event, group, null, this.state.publishSelCountryData, 'published')} groupBy={'group'} countryData={allCountries?.length > 0 ? allCountries : []} selectedCountry={allCountries}
        handleMultiSelect={() => {}} multiple={true} keyText={"title"}
        canPublish={canPublish} publishAction={this.publishContent}
      />
    );
  };

  getPublishHistoryComp = () => {
    const { publishHistory, checkListDone, status, translationDone, licenseExpired } = this.state;
    let canPublish = (permissionObj?.["movies"]?.["publish"]?.["canCreate"]() && checkListDone && translationDone && licenseExpired);
    return (
      (publishHistory?.length > 0) ?
        <div className="box-sec history-box p-all-10 m-b-30">
          <PublishedHistory className="" status={status} canPublish={canPublish}
            publishHistory={publishHistory}
            rescheduleContent={(event, data) => this.rescheduleHandler(data)}
            publishContent={(event, data) => this.showHidePublishedModel(data)}
          />
        </div> : null
    );
  };

  getUnPublishHistoryComp = () => {
    let { unPublishedHistory } = this.state;
    return (
      (unPublishedHistory?.country?.length > 0) ?
        <UnpublishedHistory className="m-b-30" unPublishedHistory={unPublishedHistory} /> :
        null
    );
  }

  getAddScheduleComp = () => {
    return (
      <AddSchedule className="" addSchedule={this.addRemoveSchedule} />
    )
  }

  getSelectedCountry = selectedCountry => {
    let { allCountries, updateSch, changedToSchedule } = this.state;
    if(updateSch || changedToSchedule) return selectedCountry;
    let newSelectedCountry = [];
    selectedCountry.map(item => {
      allCountries.map(allCItem => {
        if(item.id === allCItem.id) {
          newSelectedCountry.push(item)
        }
      })
    })
    return newSelectedCountry;
  }

  getUniqueCountry = (allCountries, schedule, index) => {
    let { scheduleHistory } = this.state;
    let scheduleItem = scheduleHistory.find(item => item.groupName === schedule.groupName);
    let allCountry = allCountries || [];
    const allNewCountry = [...scheduleItem?.country, ...allCountry]
    let uniqueCountry = allNewCountry.reduce((unique, o) => {
      if(!unique.some(obj => obj.id === o.id))  unique.push(o);
      return unique;
    },[]);
    uniqueCountry.map(item => item['group'] = 'All-Country')
    return uniqueCountry;
  }

  getScheduleComp = () => {
    let { scheduleArr, checkListDone, translationDone, updateSch, scheduleHistory, allCountries, changedToSchedule, changedToSchCountry, scheduleFocus } = this.state;
    let canSchedule = (permissionObj?.["movies"]?.["schedule"]?.["canCreate"]() && checkListDone && translationDone);
    let minDateFormate = new Date();
    allCountries = allCountries || [];
    scheduleArr?.map((item, i) => {
      item.minDateValue = minDateFormate;
      item.countryData = updateSch ? this.getUniqueCountry(allCountries, item, i) : changedToSchedule ? changedToSchCountry : allCountries,
      item.selectedCountry = this.getSelectedCountry(item.countryData)
    })
    return (
      (scheduleArr.length > 0) ?
        <ScheduleContent className="" selectGroup={(event, group, index) => this.selectCountryGroup(event, group, index, this.state.scheduleArr, 'scheduled')} groupBy={'group'} checkListDone={checkListDone} multiple={true} keyText={"title"}
        scheduleData={scheduleArr} handleScheduleData={this.handleScheduleData}
        removeSchedule={this.addRemoveSchedule} totalSchedule={scheduleHistory?.length || 0} canPublish={canSchedule} update={updateSch} changedToSchedule={changedToSchedule} updateSchedule={this.updateThisSchedule} scheduleContentAction={this.scheduleContent}
      /> : null
    )
  }

  getScheduleHistoryComp = () => {
    const { scheduleHistory, translationDone, checkListDone } = this.state;
    let canPublish = (permissionObj?.["movies"]?.["publish"]?.["canCreate"]() && checkListDone && translationDone);
    return (
      (scheduleHistory?.length > 0) ?
        <ScheduleHistory canPublish={canPublish} className="" publishScheduledContent={this.publishScheduledContent}
          scheduleHistory={scheduleHistory}
          updateScheduleAction={this.updateSchedule} deleteScheduleAction={this.showHideDeleteScheduleModel} /> :
        null
    )
  }

  getUnPublishedUI = () => {
    let { unPublishedCountryData, unPublishedSelCountryData, reasonData, reasonSelData, error, unpublishErrorMsg, reasonRequired } = this.state;
    return (
      <div>
        <div className="unpublish-ui-row">
          <SelectWithSearch
            label={constantText.create_movie_images_gc_text}
            name="unPublishedSelCountryData" data={unPublishedCountryData} value={unPublishedSelCountryData}
            multiple={true} moreText="more" limitTags={2} disableCloseOnSelect={true} keyText="title"
            onChange={() => {}}  error={unPublishedSelCountryData.length > 0 ? false : true} errorMsg={unPublishedSelCountryData.length > 0 ? null : constantText.selectCountryError} required={unPublishedSelCountryData.length > 0 ? false : true}
          />
        </div>
        <div className="unpublish-ui-row">
          <SelectWithSearch
            label={constantText.reason_text}
            name="reasonSelData" data={reasonData} value={reasonSelData}
            multiple={false} disableCloseOnSelect={false} onChange={this.handleMultiSelect}
            required={reasonRequired} error={reasonRequired ? false : true} errorMsg={reasonRequired ? null : constantText.selectReasonError}
          />
        </div>
      </div>
    )
  }

  getPublishedUI = () => {
    let { unPublishedCountryData, rePublishSelCountryData, reasonData, reasonSelData, error, unpublishErrorMsg } = this.state;
    return (
      <div>
        <div className="unpublish-ui-row">
          <SelectWithSearch
            label={constantText.create_movie_images_gc_text}
            name="unPublishedSelCountryData" data={rePublishSelCountryData} value={rePublishSelCountryData}
            multiple={true} moreText="more" limitTags={2} disableCloseOnSelect={true} keyText="title"
            onChange={() => {}} error={!!error} errorMsg={error}
          />
        </div>
        {unpublishErrorMsg && <p className="error">{unpublishErrorMsg}</p>}
      </div>
    )
  }

  checkSubmitReviewPermission = () => {
    let { checkListDone, status, translationDone } = this.state;
    if(status === constantText.videoConstants.archived || !checkListDone) return true;
    if (!translationDone) return true;
    return false
  }

  render() {
    const { checkListArr, translationDone, relatedContentDone, collectionAssignmentDone, showOtherLangModel,
      assignedLang, otherLang, selectedLang, allCountries, selectedCountryArr, status,
      publishHistory, showUnPublishedPopup, model, reasonData, reasonSelData, translationMarkDone, checkListDone, scheduleFocus, showPublishedPopup, videoState } = this.state;

    let canPublish = permissionObj?.["videos"]?.["publish"]?.["canCreate"]();
    let canUnPublish = permissionObj?.["videos"]?.["unPublish"]?.["canCreate"]();
    let canReject = permissionObj?.["videos"]?.["reject"]?.["canCreate"]();

    let showReviewBtn = (!canPublish && (status === constantText.contentConstants.draft || status === constantText.contentConstants.changed || status === constantText.contentConstants.needWork)) ? true : false;
    return (
      <div>
        <div data-test="checklistWrapper" className="whitebox m-b-30">
          <div className="checklist-area">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4 data-test="checklistText">{constantText.checkList_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status}  />}
              </div>
            </div>
            <div className="checklist">
              <CheckList
                checkListArr={checkListArr}
                markAsDoneText={constantText.details_full_done_text}
                partialltDoneText={constantText.details_partially_done_text}
              />
              <QuickLinks
                assignedLang={assignedLang}
                keyText="title"
                canPublish={canPublish}
                showTranslation={(videoState == 'quickFiling' || videoState == 'singleLanding') ? false : true} showRelatedContent={true} showCollectionAssignment={true}
                showHideOtherLangModel={() => this.showHideOtherLangModel(false)}
                translationDone={translationMarkDone} relatedContentDone={relatedContentDone}
                collectionAssignmentDone={collectionAssignmentDone}
                status={status}
                disableReviewButton={this.checkSubmitReviewPermission()}
                showReviewButton={showReviewBtn} submitToReviewAction={this.submitToReview}
              />
            </div>
          </div>
        </div>

         {
          (canPublish || canUnPublish || publishHistory?.length > 0) &&
          <div className="whitebox m-b-30">
            <div className="cklist-content p-b-20">
              <div className="ccm-head flex align-items-center justify-content-between">
                <h4>{constantText.published_or_scheduled_content_text}</h4>
              </div>
              <div className="col-12">

                {this.getUnPublishHistoryComp()}
                {this.getPublishHistoryComp()}

                {
                (canPublish && status !== constantText.videoConstants.archived) &&
                <div className="box-sec p-all-10 m-b-30">

                  {this.getPublishComp()}

                  {
                    (publishHistory?.length > 0) &&
                    <Fragment>
                      <div className="m-b-30"></div>
                      <div className="Schedule-box p-all-10">
                        <div className="flex align-items-center justify-content-between">
                          <div className="icon-w-text">
                            <MovieSquarGreenIcon />
                            {constantText.videoConstants.publishThisContentFor}
                            {`${publishHistory?.map((countryObj) => (countryObj.title)).join(', ')}.`}
                          </div>
                          <Button
                             className="transparent-btn"
                             variant="contained"
                             disabled={((canUnPublish && translationDone && checkListDone) ? false : true)}
                             buttonText={constantText.unPublish_content_text}
                             onClick={() => {
                              this.setState({ unPublishedSelCountryData: publishHistory }, () => this.showHideUnPublishedModel(publishHistory))
                            }} />
                        </div>
                      </div>
                    </Fragment>
                  }
                </div>
                }

                {canPublish && status !== constantText.videoConstants.archived && this.getAddScheduleComp()}

                <div ref={scheduleFocus}>
                  {this.getScheduleComp()}
                </div>
                {this.getScheduleHistoryComp()}
              </div>
            </div>
          </div>
        }

        {
          (status === constantText.videoConstants.submittedToReview && canPublish) ?
          <RejectedContent
          countryData={reasonData} selectedReason={reasonSelData} multiple={false}
          handleMultiSelect={this.handleMultiSelect} canReject={canUnPublish}
          needWorkAction={this.needWorkAction}
          remainingCountryData={allCountries?.filter(obj => !selectedCountryArr.includes(obj.title))}
        /> : null
        }

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
          className='popup-wrap status-popup' showIcon={false}
          state={showUnPublishedPopup} title={constantText.videoConstants.unpublish}
          des={constantText.un_published_confirm_text}
          btn1Action={this.UnPublishContent}
          btn2Action={() => this.showHideUnPublishedModel()}
          handleClose={() => this.showHideUnPublishedModel()}
          Form={this.getUnPublishedUI()}
        />

        <CommonModel
          className='popup-wrap status-popup' showIcon={false}
          state={showPublishedPopup} title={constantText.videoConstants.republish}
          des={constantText.videoConstants.republishDesc}
          btn1Action={this.republishContent}
          btn2Action={() => this.showHidePublishedModel()}
          handleClose={() => this.showHidePublishedModel()}
          Form={this.getPublishedUI()}
        />

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

export default CheckListComp