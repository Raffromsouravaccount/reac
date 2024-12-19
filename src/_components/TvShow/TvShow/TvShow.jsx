import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

// components
import ContentProperties from "./../ContentProperties/ContentProperties";
import CastAndCrew from "../CastAndCrew/CastAndCrew";
import LicenseModule from "../LicenseModule/LicenseModule";
import CreateLicense from "../LicenseModule/SubComponents/CreateLicense";
import Images from "../Images/Images";
import SeoDetails from "../SeoDetails/SeoDetails";
import MapContent from "../MapContent/MapContent";
import CheckList from "../Checklist/Checklist";

//Common Component
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";

//Services
import { apiCalls } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../../src/_actions/alertMessages.action';
//Helper Files
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { getLocalData } from "../../../_helpers/util";
import { permissionObj } from "../../../_helpers/permission";

//Constant files
import {
  breadCrumbs,
  quickLinks,
  quickLinksForQuickFiling,
} from "./breadCrumbs";
import { constantText } from "../../../_helpers/constants.text";

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";

//css
import "../../../../public/css/Common/CreateTabHead.css";

class TvShow extends Component {
  constructor(props) {
    super(props);
    let { state } = props;
    let filterKey = state ? state == "quick-filing" ? "quickFiling" : "singleLanding" : "main";
    this.state = {
      tvShowState: filterKey,
      userData: getLocalData("userData"),
      selectedTab: 0, tvShowId: null, jsonData: {},
      language: Config.defaultLanguageCode,
      leftTab: constantText.tvShow_left_tab_options_arr?.filter(data => data[filterKey]) || [],
      stage: "Draft", externalId: null, createLicenseForm: false, editLicenseForm: 0, licenceData: "",
    };
  }

  componentDidMount = async () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map(item => item.isDone = false);
    const defaultTab = { ...this.props?.location?.state }
    if (match?.params?.id) {
      this.setState(
        (prevState) => ({ tvShowId: match.params.id, defaultTab }),
        () => this.handlePermission()
      );
    } else {
      this.getTvShowId();
    }
  };

  getTvShowId = async () => {
    let { state } = this.props;
    let journeyType = state ? (state == "quick-filing") ? "2" : "3" : "1";
    let response = await apiCalls(Config.tvShowProperties, "POST", { tvShow: { journeyType } });
    let { tvShowId } = response;
    this.setTvShowId(tvShowId);
  };

  setTvShowId = (tvShowId) => {
    let { state } = this.props;
    this.setState(
      (prevState) => ({ tvShowId }),
      () => this.handlePermission()
    );
    let route = state
      ? state == "quick-filing"
        ? `/tvshow/quick/edit/${tvShowId}`
        : `/tvshow/single/edit/${tvShowId}`
      : `/tvshow/edit/${tvShowId}`;
    history.push(route);
  };

  getJsonData = async () => {
    let { state } = this.props;
    const type = state ? (state == "quick-filing") ? 'tvShow_QuickFilling_Structure' : 'tvShow_SingleLanding_Structure' :
      'tvShow_StandardJourney_Structure';
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getTvShowStatus = async () => {
    let { userData, leftTab, tvShowId } = this.state;
    const response = await apiCalls(
      `${Config.tvShow.action}/${tvShowId}`,
      "GET",
      null,
      null,
      false
    );
    if (response && response.length > 0) {
      let resData = response.filter((elem) => leftTab.find(({ sectionName }) => elem.sectionName === sectionName));
      let shallowArr = [...leftTab];
      resData?.map((data) => {
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
      const notDone = resData?.filter((data) => !data.isDone);
      const checklistObj = shallowArr.find(item => item.permissionSubKey === 'checklistModule');
      checklistObj.isDone = (notDone?.length === 0 && (resData.length >= (shallowArr.length - 1))) ? true : false;
      this.setState((prevState) => ({ leftTab: shallowArr }));
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
      this.getTvShowStatus();
      this.getJsonData();
    });
  };

  markAsDone = async (index, isDone) => {
    let { tvShowId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = {
        tvShowId, isDone,
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
    let { tvShowId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      tvShowId, isLocked: true,
      sectionName: shallowArr[index]?.sectionName,
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState((prevState) => ({ leftTab: shallowArr }));
    }
  };

  markAsDoneNLockedAction = async (data) => {
    const response = await apiCalls(Config.tvShow?.action, "POST", data, null, true, null, this.autoSaveError);
    return response;
  };

  setTitle = (showTitle) => {
    this.setState({ showTitle });
  };

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getTvShowStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  getExternalId = (externalId) => {
    this.setState({ externalId });
  };

  handleTab = (event, selectedTab) =>
    this.setState({ selectedTab, createLicenseForm: false }, () => this.getTvShowStatus());

  handleRoute = (route) => {
    history.push(route);
  };

  linksClickHandler = (data) => {
    history.push(this.props?.match?.url + data.path);
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

  getTvShowTabsComp = () => {
    let { jsonData, tvShowId, leftTab, selectedTab, language, createLicenseForm, editLicenseForm, licenceData, stage,
      externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && jsonData.ContentProperties && (
          <ContentProperties {...this.props} language={language} tvShowId={tvShowId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            stage={stage} setStage={this.setStage} autoSaveError={this.autoSaveError} setTitle={this.setTitle}
            getShowStatus={this.getTvShowStatus} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties}
          />
        )}
        {selectedTab == 1 && jsonData.CastNCrew && (
          <CastAndCrew {...this.props} language={language} tvShowId={tvShowId} stage={stage} selectedTab={selectedTab}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} getShowStatus={this.getTvShowStatus}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.CastNCrew}
          />
        )}
        {(selectedTab === 2 && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} language={language} tvShowId={tvShowId} stage={stage}
            openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} jsonData={jsonData.License}
          />
        ) : (
          selectedTab === 2 && (
            <LicenseModule {...this.props} language={language} tvShowId={tvShowId} stage={stage}
              openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} selectedTab={selectedTab}
              currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession}
              openLicenseEditForm={this.openEditForm} jsonData={jsonData.License}
            />
          )
        )}
        {selectedTab == 3 && tvShowId && jsonData.Images && (
          <Images {...this.props} language={language} tvShowId={tvShowId} stage={stage} markAsDone={this.markAsDone}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession}
            autoSaveError={this.autoSaveError} externalId={externalId} jsonData={jsonData.Images}
          />
        )}
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails tvShowId={tvShowId} selectedTab={selectedTab} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} stage={stage}
            autoSaveError={this.autoSaveError} jsonData={jsonData.Seo}
          />
        )}
        {selectedTab == 5 && jsonData.MapContent && (
          <MapContent contentId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            getTvShowStatus={this.getTvShowStatus} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.MapContent}
          />
        )}
        {selectedTab == 6 && (
          <CheckList tvShowId={tvShowId} language={language} selectedTab={selectedTab} autoSaveError={this.autoSaveError} />
        )}
      </div>
    );
  };

  getQuickFilingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, tvShowId, language, createLicenseForm, editLicenseForm, licenceData, stage,
      externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && jsonData.ContentProperties && (
          <ContentProperties {...this.props} language={language} tvShowId={tvShowId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            stage={stage} setStage={this.setStage} autoSaveError={this.autoSaveError} setTitle={this.setTitle}
            getShowStatus={this.getTvShowStatus} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties}
          />
        )}
        {(selectedTab === 1 && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} language={language} tvShowId={tvShowId} stage={stage}
            openLicenseForm={this.openCreateLicenseForm} editTab={editLicenseForm} autoSaveError={this.autoSaveError}
            licenseData={licenceData} markAsDone={this.markAsDone} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession}
            openLicenseEditForm={this.openEditForm} jsonData={jsonData.License}
          />
        ) : (
          selectedTab === 1 && (
            <LicenseModule {...this.props} language={language} tvShowId={tvShowId} stage={stage}
              openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]}
              selectedTab={selectedTab} unLockedSession={this.unLockedSession} openLicenseEditForm={this.openEditForm}
              jsonData={jsonData.License}
            />
          )
        )}
        {selectedTab == 2 && tvShowId && jsonData.Images && (
          <Images {...this.props} tvShowId={tvShowId} stage={stage} markAsDone={this.markAsDone}
            selectedTab={selectedTab} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} externalId={externalId} jsonData={jsonData.Images}
          />
        )}
        {selectedTab == 4 && tvShowId && jsonData.MapContent && (
          <MapContent contentId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            getTvShowStatus={this.getTvShowStatus} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.MapContent}
          />
        )}
        {selectedTab === 3 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} selectedTab={selectedTab} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} stage={stage}
            autoSaveError={this.autoSaveError} jsonData={jsonData.Seo}
          />
        )}
        {selectedTab == 5 && (
          <CheckList tvShowId={tvShowId} language={language} state='quick-filing' selectedTab={selectedTab}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  getSingleLandingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, tvShowId, language, createLicenseForm, editLicenseForm, licenceData, stage,
      externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && jsonData.ContentProperties && (
          <ContentProperties {...this.props} language={language} tvShowId={tvShowId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
            stage={stage} setStage={this.setStage} autoSaveError={this.autoSaveError} setTitle={this.setTitle}
            getShowStatus={this.getTvShowStatus} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties}
          />
        )}
        {selectedTab == 1 && jsonData.CastNCrew && (
          <CastAndCrew {...this.props} language={language} tvShowId={tvShowId} stage={stage} selectedTab={selectedTab}
            markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} getShowStatus={this.getTvShowStatus}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.CastNCrew}
          />
        )}
        {(selectedTab === 2 && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} language={language} tvShowId={tvShowId} stage={stage}
            openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} selectedTab={selectedTab}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} editTab={editLicenseForm}
            licenseData={licenceData} openLicenseEditForm={this.openEditForm} jsonData={jsonData.License}
          />
        ) : (
          selectedTab === 2 && (
            <LicenseModule {...this.props} language={language} tvShowId={tvShowId} stage={stage}
              openLicenseForm={this.openCreateLicenseForm} markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]}
              selectedTab={selectedTab} unLockedSession={this.unLockedSession} openLicenseEditForm={this.openEditForm}
              jsonData={jsonData.License}
            />
          )
        )}
        {selectedTab == 3 && tvShowId && jsonData.Images && (
          <Images {...this.props} tvShowId={tvShowId} markAsDone={this.markAsDone} selectedTab={selectedTab}
            stage={stage} currentTabData={leftTab[selectedTab]} unLockedSession={this.unLockedSession}
            autoSaveError={this.autoSaveError} externalId={externalId} jsonData={jsonData.Images}
          />
        )}
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} selectedTab={selectedTab} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} stage={stage}
            autoSaveError={this.autoSaveError} jsonData={jsonData.Seo}
          />
        )}
        {selectedTab == 5 && tvShowId && jsonData.MapContent && (
          <MapContent contentId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            getTvShowStatus={this.getTvShowStatus} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} jsonData={jsonData.MapContent}
          />
        )}
        {selectedTab == 6 && (
          <CheckList tvShowId={tvShowId} language={language} state='quick-filing' selectedTab={selectedTab}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (item.key && permissionObj?.['tvShows'] && permissionObj?.['tvShows']?.[item.key] && permissionObj?.['tvShows']?.[item.key]) ? permissionObj?.['tvShows']?.[item.key]?.canUpdate() : true)
    return links;
  }

  getOptions = () => {
    let { tvShowState } = this.state;
    if (tvShowState === 'quickFiling') {
      return quickLinksForQuickFiling
    };
    if (tvShowState === 'singleLanding') {
      return this.quickLinksEnable(quickLinksForQuickFiling)
    } else {
      return this.quickLinksEnable(quickLinks)
    }
  }

  render() {
    let { leftTab, selectedTab, externalId } = this.state;
    let { match, state } = this.props;
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links}
          typography={breadCrumbs.typography(match?.params?.id ? "edit" : "create", state)}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <span
              data-test={'handleRoute'}
              onClick={() => this.handleRoute("/tvshow")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{state ? (state == "quick-filing") ? constantText.quick_filing_text :
                constantText.single_landing_page_text : constantText.tvShowsConstant.tvShow}
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
              {state
                ? state == "quick-filing"
                  ? this.getQuickFilingTabsComp()
                  : this.getSingleLandingTabsComp()
                : this.getTvShowTabsComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                showTips={(state && ((state == "quick-filing") || (state == "single-landing"))) ? true : false}
                options={this.getOptions()}
                clicked={this.linksClickHandler}
                customText={"You can convert this page to Main TV Show Page on Editing."} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TvShow;
