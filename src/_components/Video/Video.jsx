import React, { Component } from "react";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Components
import ContentProperties from "./ContentProperties/ContentProperties";
import CastAndCrew from "./CastAndCrew/CastAndCrew";
import CreateEditVideo from "./CreateEditVideo/CreateEditVideo";
import LicenseModule from "./LicenseModule/LicenseModule";
import ManualLicense from "./LicenseModule/subComponent/CreateLicense";
import Images from "./Images/Images";
import SeoDetails from "./SeoComponent/SeoDetails";
import MapContent from "./MapContent/MapContent";
import Checklist from "./CheckList/CheckList";

//Common Component
import LeftTab from "../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../Common/BreadCrumbs/BreadCrumbs";
import QuickLinks from "../Common/QuickLinks/QuickLinks";
//Services
import { apiCalls } from "../../_services/common.service";

//Helper Files
import { history } from "../../_helpers/history";
import { permissionObj } from "../../_helpers/permission";
import Config from "../../Config/config";
import { getLocalData } from "../../_helpers/util";
import { showSuccessErrorMsg } from "../../_actions/alertMessages.action";

//Constant files
import {
  breadCrumbs,
  quickLinks,
  quickLinksForQuickFiling,
} from "./breadCrumbs";
import { constantText } from "../../_helpers/constants.text";

//Images
import AngleLeftArrow from "../../../public/images/angle-left-arrow.svg";
//css
import '../../../public/css/Common/CreateTabHead.css';

class Video extends Component {
  constructor(props) {
    super(props);
    let { state } = props;
    let filterKey = state == "quick-filing" ? "quickFiling" : "properties";
    this.state = {
      userData: getLocalData("userData"),
      jsonData: {}, selectedTab: 0, videoId: null,
      language: "EN",
      stage: { title: "Draft" },
      leftTab:
        constantText?.video_left_tab_options_arr?.filter(
          (data) => data[filterKey]
        ) || [],
      createLicenseForm: false,
      editLicenseForm: 0,
      licenceData: "",
      externalId: null,
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map((item) => (item.isDone = false));
    const defaultTab = { ...this.props.location?.state };
    if (match?.params?.id) {
      this.setState(
        (prevState) => ({ videoId: match.params.id, defaultTab }),
        () => this.handlePermission()
      );
    } else {
      this.getVideoId();
    }
  };

  getVideoId = async () => {
    let { state } = this.props;
    let journeyType = state && state == "quick-filing" ? "2" : "1";
    let response = await apiCalls(Config.videoProperties, "POST", {
      video: { journeyType },
    });
    let { videoId } = response;
    this.setVideoId(videoId);
  };

  setVideoId = (videoId) => {
    let { state } = this.props;
    this.setState(
      (prevState) => ({ videoId }),
      () => this.handlePermission()
    );
    let route =
      state == "quick-filing"
        ? `/video/quick/edit/${videoId}`
        : `/video/edit/${videoId}`;
    history.push(route);
  };

  getJsonData= async()=> {
    let { state } = this.props;
    const type = (state && state == "quick-filing") ? 'video_QuickFilling_Structure' : 'video_frontend_structure';
    const response= await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if(response) {
      const { data }= response;
      this.setState(prevState=> ({jsonData: data || {}}));
    }
  }

  getVideoStatus = async () => {
    let { userData, leftTab, videoId } = this.state;
    const response = await apiCalls(
      `${Config.video.action}/${videoId}`,
      "GET",
      null,
      null,
      false
    );
    if (response && response.length > 0) {
      let shallowArr = [...leftTab];
      response?.map((data) => {
        const { sectionName, isDone, isLocked, lockedByUser } = data;
        const { id, firstName, lastName } = lockedByUser || {};
        const index = shallowArr?.findIndex(
          (obj) => obj?.sectionName == sectionName
        );
        shallowArr[index] = {
          ...shallowArr[index],
          isDone,
          isLocked: isLocked && id != userData?.userID ? true : false,
          lockedBy: isLocked ? `${firstName} ${lastName}` : "",
        };
      });
      this.setState(
        (prevState) => ({ leftTab: shallowArr }),
        () => {
          this.setChecklistCheck();
        }
      );
    } else {
      this.setChecklistCheck();
    }
  };

  handlePermission = () => {
    let { leftTab } = this.state;
    let selectedTab = leftTab?.findIndex(
      (data) =>
        !data?.permissionKey ||
        (data?.permissionSubKey
          ? permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[
              data.permissionName
            ]()
          : permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    this.setState(prevState => ({ selectedTab }), () => {
      this.getJsonData();
      this.getVideoStatus();
    });
  };

  setCheckListIsDone = (flag) => {
    let { leftTab } = this.state;
    let shallowArr = [...leftTab];
    shallowArr.forEach((item) => {
      if (item.permissionSubKey === "checklistModule") {
        item.isDone = flag;
      }
    });
    this.setState({ leftTab: shallowArr });
  };

  setChecklistCheck = () => {
    let { leftTab } = this.state;
    let shallowArr = [...leftTab];
    const checkIsDone = shallowArr.find(
      (item) =>
        item.permissionSubKey !== "checklistModule" && item.isDone === false
    );
    if (!checkIsDone) {
      this.setCheckListIsDone(true);
    } else {
      this.setCheckListIsDone(false);
    }
  }

  markAsDone = async (index, isDone) => {
    let { videoId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = {
        videoId,
        isDone,
        sectionName: shallowArr[index]?.sectionName,
      };
      const response = await this.markAsDoneNLockedAction(data);
      if (response) {
        shallowArr[index] = { ...shallowArr[index], isDone };
      }
    } else {
      shallowArr[index] = { ...shallowArr[index], isDone };
    }
    this.setState((prevState) => ({ leftTab: shallowArr }));
  };

  unLockedSession = async (index) => {
    let { videoId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      videoId,
      isLocked: true,
      sectionName: shallowArr[index]?.sectionName,
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState((prevState) => ({ leftTab: shallowArr }));
    }
  };

  markAsDoneNLockedAction = async (data) => {
    const response = await apiCalls(
      Config.video.action,
      "POST",
      data,
      null,
      true,
      null,
      this.autoSaveError
    );
    return response;
  };

  handleTab = (event, selectedTab) =>
    this.setState({ selectedTab, createLicenseForm: false }, () =>
      this.getVideoStatus()
    );

  handleRoute = (route) => {
    history.push(route);
  };

  linksClickHandler = (data) => {
    const { stage } = this.state;
    history.push(this.props.match?.url + data.path, stage);
  };

  openCreateLicenseForm = () => {
    this.setState((prevState) => ({
      editLicenseForm: 0,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: "",
    }));
  };

  openEditForm = (data) => {
    this.setState((prevState) => ({
      editLicenseForm: 1,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: data,
    }));
  };

  setStage = (stage) => {
    stage = stage || { ...this.state.stage };
    const defaultTab = { ...this.state.defaultTab };
    let selectedTab = this.state.selectedTab;
    if (
      defaultTab &&
      defaultTab.selectedTab !== undefined &&
      !defaultTab.redirected
    ) {
      selectedTab = defaultTab.selectedTab;
      const leftTab = [...this.state.leftTab];
      selectedTab = leftTab.findIndex((x) => x.label === defaultTab.tabLabel);
      if (selectedTab == -1) {
        selectedTab = 0;
      }
      defaultTab.redirected = true;
    }
    this.setState({ stage, selectedTab, defaultTab });
  };

  setTitle = (videoTitle) => {
    this.setState({ videoTitle });
  };

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(
        error?.data?.message,
        null,
        "Alert",
        true,
        null,
        null,
        this.getVideoStatus
      );
    } else {
      showSuccessErrorMsg(
        error?.data?.message,
        null,
        "Error",
        true,
        null,
        true
      );
    }
  };
  getExternalId = (externalId) => {
    this.setState({ externalId });
  };

  quickLinksEnable = (links) => {
    links.map(
      (item) =>
        (item.enable =
          item.key &&
          permissionObj?.["videos"] &&
          permissionObj?.["videos"]?.[item.key] &&
          permissionObj?.["videos"]?.[item.key]
            ? permissionObj?.["videos"]?.[item.key]?.canUpdate()
            : true)
    );
    return links;
  };

  getVideoTabsComp = () => {
    let { jsonData, leftTab, selectedTab, videoId, language, createLicenseForm, editLicenseForm, licenceData,
      stage, externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && videoId && jsonData.ContentProperties) && (
          <ContentProperties {...this.props} videoId={videoId} selectedTab={selectedTab} stage={stage} setStage={this.setStage}
            autoSaveError={this.autoSaveError} setTitle={this.setTitle} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} getVideoStatus={this.getVideoStatus}
            getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties || {}}
          />
        )}
        {(selectedTab == 1 && videoId && jsonData.CastNCrew) && (
          <CastAndCrew videoId={videoId} language={language} selectedTab={selectedTab} markAsDone={this.markAsDone}
            stage={stage} getVideoStatus={this.getVideoStatus} autoSaveError={this.autoSaveError}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.CastNCrew || {}}
          />
        )}
        {(selectedTab == 2 && videoId && jsonData.Video) && (
          <CreateEditVideo {...this.props} contentId={videoId} markAsDone={this.markAsDone} selectedTab={selectedTab}
            stage={stage} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            getVideoStatus={this.getVideoStatus} autoSaveError={this.autoSaveError} externalId={externalId}
            jsonData={jsonData.Video || []} refreshActionStatus={this.getVideoStatus}
          />
        )}
        {(selectedTab === 3 && jsonData.License) && createLicenseForm == true ? (
          <ManualLicense {...this.props} language={language} contentId={videoId} openLicenseForm={this.openCreateLicenseForm}
            editTab={editLicenseForm} stage={stage} selectedTab={selectedTab} licenseData={licenceData}
            markAsDone={this.markAsDone} openLicenseEditForm={this.openEditForm} autoSaveError={this.autoSaveError}
            currentTabData={leftTab[selectedTab]} jsonData={jsonData.License || []}
          />
        ) : (
          (selectedTab === 3 && jsonData.License) && (
            <LicenseModule {...this.props} language={language} contentId={videoId} selectedTab={selectedTab}
              stage={stage} openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone}
              openLicenseEditForm={this.openEditForm} unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError}
              currentTabData={leftTab[selectedTab]} jsonData={jsonData.License || []}
            />
          )
        )}
        {(selectedTab == 4 && videoId && jsonData.Images) && (
          <Images {...this.props} videoId={videoId} markAsDone={this.markAsDone} selectedTab={selectedTab}
            stage={stage} unLockedSession={this.unLockedSession} getVideoStatus={this.getVideoStatus}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} externalId={externalId}
            jsonData={jsonData.Images || {}}
          />
        )}
        {(selectedTab == 5 && videoId && jsonData.Seo) && (
          <SeoDetails language={language} contentId={videoId} openLicenseForm={this.openCreateLicenseForm}
            editTab={editLicenseForm} selectedTab={selectedTab} licenseData={licenceData} stage={stage}
            markAsDone={this.markAsDone} openLicenseEditForm={this.openEditForm} unLockedSession={this.unLockedSession}
            autoSaveError={this.autoSaveError} currentTabData={leftTab[selectedTab]} jsonData={jsonData.Seo || []}
          />
        )}
        {(selectedTab == 6 && videoId && jsonData.MapContent) && (
          <MapContent contentId={videoId} language={language} selectedTab={selectedTab} stage={stage}
            getMovieStatus={this.getMovieStatus} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.MapContent || []}
          />
        )}
        {(selectedTab == 7 && videoId) && (
          <Checklist contentId={videoId} language={language} selectedTab={selectedTab}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
          />
        )}
      </div>
    );
  };

  getQuickFilingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, videoId, language, createLicenseForm, editLicenseForm, licenceData, stage,
      externalId } = this.state;
    let { state } = this.props;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && videoId && jsonData.ContentProperties) && (
          <ContentProperties {...this.props} videoId={videoId} selectedTab={selectedTab} stage={stage} setStage={this.setStage}
            autoSaveError={this.autoSaveError} setTitle={this.setTitle} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} getVideoStatus={this.getVideoStatus}
            getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties || {}}
          />
        )}
        {(selectedTab == 1 && videoId && jsonData.Video) && (
          <CreateEditVideo {...this.props} language={language} contentId={videoId} autoSaveError={this.autoSaveError}
            selectedTab={selectedTab} stage={stage} markAsDone={this.markAsDone} getMovieStatus={this.getMovieStatus}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.Video || []} refreshActionStatus={this.getVideoStatus}
          />
        )}
        {(selectedTab === 2 && videoId && jsonData.License) && createLicenseForm == true ? (
          <ManualLicense {...this.props} language={language} contentId={videoId} openLicenseForm={this.openCreateLicenseForm}
            editTab={editLicenseForm} selectedTab={selectedTab} licenseData={licenceData} stage={stage}
            markAsDone={this.markAsDone} openLicenseEditForm={this.openEditForm} autoSaveError={this.autoSaveError}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} jsonData={jsonData.License || []}
          />
        ) : (
          (selectedTab === 2 && jsonData.License) && (
            <LicenseModule {...this.props} language={language} contentId={videoId} selectedTab={selectedTab}
              openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} stage={stage}
              openLicenseEditForm={this.openEditForm} unLockedSession={this.unLockedSession}
              autoSaveError={this.autoSaveError} currentTabData={leftTab[selectedTab]} jsonData={jsonData.License || []}
            />
          )
        )}
        {(selectedTab == 3 && videoId && jsonData.Images) && (
          <Images {...this.props} videoId={videoId} markAsDone={this.markAsDone} selectedTab={selectedTab}
            stage={stage} unLockedSession={this.unLockedSession} getVideoStatus={this.getVideoStatus}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} externalId={externalId}
            jsonData={jsonData.Images || {}}
          />
        )}
        {(selectedTab == 4 && videoId && jsonData.Seo) && (
          <SeoDetails {...this.props} contentId={videoId} markAsDone={this.markAsDone} selectedTab={selectedTab}
            stage={stage} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} jsonData={jsonData.Seo || []}
          />
        )}
        {(selectedTab == 5 && videoId && jsonData.MapContent) && (
          <MapContent contentId={videoId} language={language} selectedTab={selectedTab} stage={stage}
            getMovieStatus={this.getVideoStatus} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} jsonData={jsonData.MapContent || []}
          />
        )}
        {selectedTab == 6 && videoId && (
          <Checklist contentId={videoId} language={language} state={state} selectedTab={selectedTab}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
          />
        )}
      </div>
    );
  };

  render() {
    let { leftTab, selectedTab, externalId } = this.state;
    let { match, state } = this.props;
    let pageTitle = constantText.video_text;
    if (state && state === "quick-filing") {
      pageTitle = constantText.quick_filing_text;
    }
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links}
          typography={breadCrumbs.typography(
            match?.params?.id ? "edit" : "create",
            state
          )}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <span 
            data-test = {'handleRoute'}
            onClick={() => this.handleRoute("/video")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>
                {match?.params?.id ? pageTitle : constantText.video_text}
              </span>
            </strong>
          </div>
          {externalId &&
            <div className="head-external-id">
              <span className="text">{constantText.external_id_text}</span>
              <span className="num">{externalId}</span>
            </div>
          }
        </div>

        <div className="col-3-box">
          <div className="row gutter-minus-10">
            <div className="col-md-4 col-lg-3 col-xl-2 gutter-10 left-section">
              <div className="whitebox">
                <LeftTab
                  className="leftTab-widget"
                  orientation="vertical"
                  variant="scrollable"
                  options={leftTab}
                  selectedTab={selectedTab}
                  showIcon={true}
                  Icon1={RadioButtonCheckedIcon}
                  Icon2={CheckCircleIcon}
                  Icon3={RadioButtonUncheckedIcon}
                  handleChange={this.handleTab}
                />
              </div>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-8 gutter-10 mid-section">
              {state == "quick-filing"
                ? this.getQuickFilingTabsComp()
                : this.getVideoTabsComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks
                className=""
                header_text={constantText.quick_links_text}
                showTips={state && state == "quick-filing" ? true : false}
                options={
                  state
                    ? state == "quick-filing"
                      ? quickLinksForQuickFiling
                      : this.quickLinksEnable(quickLinksForQuickFiling)
                    : this.quickLinksEnable(quickLinks)
                }
                clicked={this.linksClickHandler}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Video;
