import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

//Sub Components
import CheckList from "../../../Common/PublishContent/CheckList";
import QuickLinks from "../../../Common/PublishContent/QuickLink";
import PublishContent from "../../../Common/PublishContent/PublishContent";
import PublishedHistory from "../../../Common/PublishContent/PublishedHistory";
import UnpublishedHistory from "../../../Common/PublishContent/UnPublishedHistory";

//Common Components
import OtherLangModel from "../../../Common/Model/OtherLangModel";
import { CommonModel } from "../../../Common/Model/CommonModel";
import SelectWithSearch from "../../../Common/SelectWithSearch/SelectWithSearch";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";

//Services
import { apiCalls, commonService } from "../../../../_services/common.service";

//Helper files
import Config from "../../../../Config/config";
import { constantText } from "../../../../_helpers/constants.text";
import { permissionObj } from "../../../../_helpers/permission";
import { getLocalData } from "../../../../_helpers/util";
import { history } from "../../../../_helpers/history";

//Icons
import MovieSquarGreenIcon from "images/movie-squar-green-icon.svg";

//css
import "../../../../../public/css/Common/Checklist.css";

class CheckListComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: getLocalData("userData"),
      contentId: null, language: "", status: null,
      checkListArr: constantText.collection_checkList_arr,
      translationDone: false,
      allStatus: [],
      allLang: [], assignedLang: [], otherLang: [],
      publishHistory: [], unPublishedHistory: [],
      licenceCountries: [], allCountries: [], publishSelCountryData: [], rePublishSelCountryData: [], unPublishedCountryData: [],
      unPublishedSelCountryData: [], rejecSelCountryData: [],
      reasonData: [],
      reasonSelData: null,
      selectedCountryArr: [], selectedLang: [], selectedLangArr: [],
      checkListDone: false, showOtherLangModel: false, showUnPublishedPopup: false, showPublishedPopup: false,
      error: null,
      model: {
        detail: "",
        open: false,
        disableBackdropClick: false,
        desc: "",
        showBtn1: true,
        showBtn2: true,
        btn1: constantText.contentConstants.yes,
        btn2: constantText.contentConstants.no
      },
    };
  }

  componentDidMount() {
    let { contentId, language } = this.props;
    this.setState(prevState => ({ contentId, language }), () => {
      this.getAllStatus();
      this.getCollectionData(contentId);
      this.getCheckListData(contentId);
      this.getLicenseCountry(contentId)
      this.getCollectionHistory();
      this.getLanguageList();
    });
  }

  getAllStatus = async () => {
    let response = await apiCalls(`${Config.masterUrl}/ContentState`, 'GET', {});
    if (response) {
      this.setState({ allStatus: response });
    }
  }

  getLicenseCountry = async contentId => {
    let response = await apiCalls(`${Config.collectionLicenseCountry}/${contentId}`, 'GET', {});
    if (response) {
      this.setState({allCountries: response});
    }
  }

  getCheckListData = async contentId => {
    let { checkListArr } = this.state;
    let response = await apiCalls(`${Config.collectionAction}/${contentId}`, 'GET', {});
    if (response) {
      let relatedContentStatus = response?.find(data => data.sectionName === 'relatedContent');
      let collectionAssignmentStatus = response?.find(data => data.sectionName === 'collectionAssignment');
      checkListArr = checkListArr.map(data => {
        let apiItem = response.find(item => item.sectionName === data.doneKey);
        data.done = apiItem?.isDone ? true : false;
        return data;
      });
      let checklistStatus = checkListArr.find(item => item.done == false);
      this.setState(prevState => ({
        checkListArr: checkListArr,
        collectionAssignmentDone: collectionAssignmentStatus?.isDone ? true : false,
        checkListDone: checklistStatus ? false : true,
        relatedContentDone: relatedContentStatus?.isDone ? true : false,
      }));
    }
  }

  getCollectionData = async contentId => {
    let response = await apiCalls(`${Config.collectionProperties}/${contentId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  getCollectionHistory = async () => {
    let { contentId } = this.state;
    let url = `${Config.workflowHistory}/collection/${contentId}`;
    let response = await apiCalls(url, "GET", null, null);
    if (response) {
      let { publish, unpublish} = response || {};
      this.setState({
        publishHistory: publish?.country,
        unPublishedHistory: unpublish
      });
    }
  }

  getLanguageList = async () => {
    let { contentId } = this.state;
    let url = `${Config.collectionLanguageListStatus}/${contentId}`;
    let response = await apiCalls(url, "GET", null, `/collection/edit/${contentId}`);
    if (response) {
      let checkTranslationStatus = response?.assigned?.filter(data => data.translationStatus == 1);
      this.setState({
        translationDone: checkTranslationStatus?.isDone ? false : true,
        assignedLang: response?.assigned,
        otherLang: response?.unassigned
      });
    }
  }

  getUnUsedCountry = () => {
    let { selectedCountryArr, licenceCountries, publishHistory, unPublishedHistory } = this.state;
    publishHistory?.map(data => data?.title?.map(countryObj => {
      selectedCountryArr.push(countryObj?.title);
    }));
    unPublishedHistory?.map(data => data?.title?.map(countryObj => {
      selectedCountryArr.push(countryObj?.title);
    }));
    let remainingCountryArr = licenceCountries?.filter(data => (!selectedCountryArr.includes(data.title)));
    remainingCountryArr =

      this.setState({
        allCountries: remainingCountryArr
      });
  }

  handleMultiSelect = (event, id, name, value) => {
    let { error } = this.state;
    let selectedCountryArr = [];
    if (name != "reasonSelData") {
      selectedCountryArr = selectedCountryArr?.concat(value?.map(data => data?.title));
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
      history.push(`/collection/edit/${contentId}/translation`, { language: selectedLangArr });
    }
  }

  showHideUnPublishedModel = async data => {
    let { showUnPublishedPopup, unPublishedSelCountryData, reasonSelData, reasonData } = this.state;
    let unPublishedCountry = [], reasonResData;
    data?.map(obj => {
      unPublishedCountry = unPublishedCountry?.concat(obj.title);
      return obj;
    });
    if(reasonData.length === 0) {
      reasonResData = await commonService.getReasonTypeMasterData();
    } else {
      reasonResData = reasonData;
    }
    this.setState({
      showUnPublishedPopup: !showUnPublishedPopup,
      unPublishedCountryData: data || [],
      unPublishedSelCountryData: data?.length > 0 ? unPublishedSelCountryData : [],
      reasonSelData: data?.length > 0 ? reasonSelData : null,
      reasonData: reasonResData,
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
    let index = selectedLang?.indexOf(langObj[keyText]);
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


  publishContent = () => {
    const alertData = {
      title: constantText.collectionConstants.publish,
      desc: constantText.collectionConstants.publishAlertDesc,
    }
    this.showProfileModelAlert(constantText.collectionConstants.published, alertData)
  }

  UnPublishContent = () => {
    let { reasonSelData,unPublishedSelCountryData } = this.state;
    if ( !reasonSelData || unPublishedSelCountryData.length == 0) {
      this.setState({ unpublishErrorMsg: constantText.contentConstants.unpublishErrorMsg })
      return;
    }
    const alertData = {
      title: constantText.contentConstants.unpublish,
      desc: constantText.contentConstants.unPublishAlertDesc
    }
    this.setState({ showUnPublishedPopup: false, unpublishErrorMsg: null  });
    this.showProfileModelAlert(constantText.collectionConstants.unpublished, alertData)
  }


  handleModel = (flag, modelAction) => {
    let { publishSelCountryData, status, allStatus, scheduleArr, unPublishedSelCountryData, rePublishSelCountryData} = this.state;
    if (!flag || modelAction.detail.type === 'confirmed') {
      this.closeModel();
      return;
    }
    if (modelAction.detail.type === constantText.collectionConstants.published) {
      const currentStatus = allStatus.find(item => item.title === status);
      const unpublishStatus = allStatus.find(item => item.title === constantText.collectionConstants.published);
      let country = rePublishSelCountryData?.length > 0 ? rePublishSelCountryData : publishSelCountryData;
      let data = {
        fromState: currentStatus?.id,
        toState: unpublishStatus?.id,
        contentType: constantText.collectionConstants.contentType,
        contentData: { country: country }
      };
      this.setState({ publishSelCountryData: [] }, () => {
        const alertData = {
          title: constantText.collectionConstants.published,
          desc: constantText.collectionConstants.publishedDesc
        }
        this.serverCallsAction(data, alertData)
      });
    }
    if (modelAction.detail.type === constantText.collectionConstants.unpublished) {
      const currentStatus = allStatus.find(item => item.title === status);
      const nextStatus = allStatus.find(item => item.title === constantText.collectionConstants.unpublished);
      let data = {
        fromState: currentStatus?.id,
        toState: nextStatus?.id,
        contentType: constantText.collectionConstants.contentType,
        contentData: { country: unPublishedSelCountryData }
      };
      if (unPublishedSelCountryData?.length > 0) {
        const alertData = {
          title: constantText.collectionConstants.unpublished,
          desc: constantText.collectionConstants.unpublishedDesc
        }
        this.serverCallsAction(data, alertData);
      }
      else {
        this.setState({ error: "Please select the country." });
      }
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

  showConfirmModal = (alertData) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = false;
    shallowModel.btn1 = constantText.contentConstants.ok
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: 'confirmed'
    }
    this.setState({ model: shallowModel });
  }

  showProfileModelAlert = (actionType, alertData) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: actionType,
    }
    this.setState({ model: shallowModel });
  }

  serverCallsAction = async (data, alertData) => {
    let { contentId } = this.state;
    let url = `${Config.workflowAPI}/${contentId}`;
    let response = await apiCalls(url, 'PUT', data, null, true);
    if (response) {
      this.setState({
        selectedCountryArr: [], publishSelCountryData: [], unPublishedCountryData: [],
        unPublishedSelCountryData: [], rejecSelCountryData: [],
        reasonSelData: null
      }, () => {
        this.showConfirmModal(alertData);
        this.componentDidMount();
      });
    }
  }

  getPublishComp = () => {
    const { allCountries, selectedCountryArr, publishSelCountryData, checkListDone } = this.state;
    let canPublish = (permissionObj?.["movies"]?.["publish"]?.["canCreate"]() && checkListDone);
    return (
      <PublishContent countryData={allCountries} selectedCountry={publishSelCountryData}
        handleMultiSelect={this.handleMultiSelect} multiple={true} keyText={"title"}
        canPublish={canPublish} publishAction={this.publishContent}
        remainingCountryData={allCountries?.filter(obj => !selectedCountryArr.includes(obj.title))}
      />
    );
  };

  getPublishHistoryComp = () => {
    const { publishHistory, checkListDone, status } = this.state;
    let canPublish = (permissionObj?.["movies"]?.["publish"]?.["canCreate"]() && checkListDone);
    return (
      (publishHistory?.length > 0) ?
        <div className="box-sec history-box p-all-10 m-b-30">
          <PublishedHistory className="" status={status} canPublish={canPublish}
            publishHistory={publishHistory}
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

  getUnPublishedUI = () => {
    let { unPublishedCountryData, unPublishedSelCountryData, reasonData, reasonSelData, error, unpublishErrorMsg } = this.state;
    return (
      <div>
        <div className="unpublish-ui-row">
          <SelectWithSearch
            label={constantText.create_movie_images_gc_text}
            name="unPublishedSelCountryData" data={unPublishedCountryData} value={unPublishedSelCountryData}
            multiple={true} moreText="more" limitTags={2} disableCloseOnSelect={true} keyText="title"
            onChange={this.handleMultiSelect} error={!!error} errorMsg={error}
          />
        </div>
        <div className="unpublish-ui-row">
          <SelectWithSearch
            label={constantText.reason_text}
            name="reasonSelData" data={reasonData} value={reasonSelData}
            multiple={false} disableCloseOnSelect={false} onChange={this.handleMultiSelect}
          />
        </div>
        {unpublishErrorMsg && <p className="error">{unpublishErrorMsg}</p>}
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
            onChange={this.handleMultiSelect} error={!!error} errorMsg={error}
          />
        </div>
        {unpublishErrorMsg && <p className="error">{unpublishErrorMsg}</p>}
      </div>
    )
  }

  checkSubmitReviewPermission = () => {
    let { checkListDone, status, translationDone } = this.state;
    if(status === constantText.contentConstants.archived || checkListDone === false) return true;
    if (translationDone) return true;
    return false
  }

  render() {
    const { checkListArr, translationDone, showOtherLangModel, assignedLang, otherLang, selectedLang,
      allCountries, selectedCountryArr, rejecSelCountryData, status, publishHistory, showUnPublishedPopup, showPublishedPopup, model } = this.state;

    let canPublish = permissionObj?.["movies"]?.["publish"]?.["canCreate"]();
    let canUnPublish = permissionObj?.["movies"]?.["unPublish"]?.["canCreate"]();

    return (
      <div>
        <div className="whitebox m-b-30">
          <div className="checklist-area">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>{constantText.checkList_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
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
                status={status}
                keyText="title" showTranslation={true}
                showHideOtherLangModel={() => this.showHideOtherLangModel(false)}
                translationDone={!translationDone}
                disableReviewButton={this.checkSubmitReviewPermission()}
                showReviewButton={false} submitToReviewAction={this.submitToReview}
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

                {canPublish &&
                  <div className="box-sec p-all-10 m-b-30">
                    {this.getPublishComp()}
                  </div>
                }
                {
                  (canUnPublish && publishHistory?.length > 0) &&
                    <Fragment>
                      <div className="m-b-30"></div>
                      <div className="Schedule-box p-all-10">
                        <div className="flex align-items-center justify-content-between">
                          <div className="icon-w-text">
                            <MovieSquarGreenIcon />
                            {constantText.contentConstants.publishThisContentFor}
                            {`${publishHistory?.map((countryObj) => (countryObj.title)).join(', ')}.`}
                          </div>
                          {canUnPublish &&
                            <div className="red-text hand-cursor" onClick={() => {
                              this.setState({ unPublishedSelCountryData: publishHistory }, () => this.showHideUnPublishedModel(publishHistory))
                            }}>
                              {constantText.unPublish_content_text}
                            </div>
                          }
                        </div>
                      </div>
                    </Fragment>
                }
            </div>
          </div>
          </div>
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
          state={showUnPublishedPopup} title={constantText.contentConstants.unpublish}
          des={constantText.un_published_confirm_text}
          btn1Action={this.UnPublishContent}
          btn2Action={() => this.showHideUnPublishedModel()}
          handleClose={() => this.showHideUnPublishedModel()}
          Form={this.getUnPublishedUI()}
        />

        <CommonModel
          className='popup-wrap status-popup' showIcon={false}
          state={showPublishedPopup} title={constantText.contentConstants.republish}
          des={constantText.contentConstants.republishDesc}
          btn1Action={this.publishContent}
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

export default CheckListComp;
