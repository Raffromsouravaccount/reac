import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Sub Components
import Properties from "../Properties/Properties";
import CastNCrew from "../CastNCrew/CastNCrew";
import Video from "../Video/EpisodeVideo";
import SeoDetails from "../SeoDetails/SeoDetails";
import CreateEditLicense from "../License/CreateEditLicese"
import LicenseComponent from "../License/LicenseComponent"
import Images from "../Images/Images"
import Checklist from '../Checklist/Checklist';

//Common Components
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";

//Services
import { apiCalls } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../../src/_actions/alertMessages.action';

//Helper Files
import { constantText } from "../../../_helpers/constants.text";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import { episodeBreadcrumbUrls, history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { getLocalData } from "../../../_helpers/util";
import { breadCrumbs, quickLinks, quickLinksForQuickFiling } from "./breadCrumbs";
import { permissionObj } from "../../../_helpers/permission";

import AngleLeftArrow from "images/angle-left-arrow.svg";

class CreateEpisode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertiesData: null,
      journeyType: this.getJourneyType(),
      userData: getLocalData("userData"), jsonData: {},
      selectedTab: this.props?.location?.state?.selectedTab || 0,
      tvShowId: null, seasonId: null, episodeId: null, externalId: null,
      leftTab: constantText.episode_left_tab_options_arr,
      stage: null,
    };
  }

  getJourneyType() {
    const { location } = this.props;
    if (location?.pathname?.includes('episode/quick')) {
      return '2'
    } else if (location?.pathname?.includes('episode/single')) {
      return '3'
    }
    return '1'
  }

  componentDidMount = async () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map(item => item.isDone = false);
    const defaultTab = { ...this.props?.location?.state };
    if (match?.params?.id && match?.params?.seasonId && match?.params?.episodeId !== 'create') {
      this.setState(prevState => ({
        tvShowId: match?.params?.id, seasonId: match.params.seasonId,
        episodeId: match.params.episodeId, defaultTab
      }), () => this.handlePermission());
    } else {
      this.getEpisodeId();
    }
    this.filterTab(this.getJourneyType())
  };

  getEpisodeStage = async (response = null) => {
    let { episodeId, selectedTab } = this.state;
    if (!response && selectedTab != 0) {
      let url = `${Config?.episode?.episodeProperties}/${episodeId}`;
      response = await apiCalls(url, "GET", {}, this.props.match.path);
    }
    if (response) {
      const { externalId, contentState } = response;
      this.setState(prevState => ({
        propertiesData: response,
        externalId: externalId?.value,
        stage: contentState?.value?.title
      }));
    }
  }

  getEpisodeId = async () => {
    let { match } = this.props;
    const journeyType = this.getJourneyType()
    let response = await apiCalls(Config.episode.episodeProperties, "POST", {
      episode: { journeyType: journeyType ? journeyType : this.state.journeyType, seasonId: match.params?.seasonId }
    }, null, true, null, this.autoSaveError);
    let { episodeId } = response;
    this.setEpisodeId(episodeId, match.params.id, match.params?.seasonId);
  };

  setEpisodeId = (episodeId, tvShowId, seasonId) => {
    this.setState(prevState => ({ episodeId, tvShowId, seasonId }), () => this.handlePermission());
    let previousRoute = this.props?.match?.url;
    previousRoute = previousRoute?.replace("/create", '');
    let route = `${previousRoute}/${episodeId}`;
    history?.replace(route);
  };

  getJsonData = async () => {
    let journeyType = this.getJourneyType();
    const type = (journeyType == "3") ? "episode_Manual_SingleLanding_Structure" : (journeyType == "2") ?
      "episode_Manual_QuickFilling_Structure" : "episode_Manual_StandardJourney_Structure";
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  filterTab = journeyType => {
    let { leftTab } = this.state;
    let filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    leftTab = leftTab?.filter(data => data[filterKey]) || [];
    this.setState(prevState => ({ leftTab, journeyType }));
  };

  getEpisodeStatus = async () => {
    let { userData, leftTab, episodeId, stage } = this.state;
    const response = await apiCalls(`${Config.episode.action}/${episodeId}`, "GET", null, null,);
    if (response) {
      let shallowArr = [...leftTab];
      let ifAllSectionDone= true;
      let resData = response.filter((elem) => leftTab.find(( {sectionName} ) => elem.sectionName === sectionName));
      resData?.map(data => {
        const { sectionName, isDone, isLocked, lockedByUser } = data;
        const { id, firstName, lastName } = lockedByUser || {};
        const index = shallowArr?.findIndex(obj => obj?.sectionName == sectionName);
        ifAllSectionDone = !ifAllSectionDone ? false : isDone;
        shallowArr[index] = {
          ...shallowArr[index], isDone,
          isLocked: isLocked && id != userData?.userID ? true : false,
          lockedBy: isLocked ? `${firstName} ${lastName}` : "",
        };
      });
      const notDone = resData?.filter((data) => !data.isDone);
      const checklistObj = shallowArr.find(item => item.permissionSubKey === 'checklistModule');
      checklistObj.isDone = (notDone?.length === 0 && (resData.length >= (shallowArr.length - 1))) ? true : false;
      this.setState((prevState) => ({ leftTab: shallowArr }), () => this.getEpisodeStage());
    }
  };

  handlePermission = () => {
    let { leftTab } = this.state;
    let selectedTab = leftTab?.findIndex(data => !data?.permissionKey || (data?.permissionSubKey ?
      permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
      permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    let propsIndex = this.props?.location?.state?.selectedTab || false;
    let propsIndexPer = propsIndex ?
      !!permissionObj?.[leftTab[propsIndex]['permissionKey']]?.[leftTab[propsIndex]['permissionSubKey']]?.[leftTab[propsIndex]['permissionName']]() : false;
    this.setState(prevState => ({ selectedTab: propsIndexPer ? propsIndex : selectedTab }), () => {
      this.getEpisodeStatus()
      this.getJsonData();
    });
  };

  openEditForm = (data) => {
    this.setState(prevState => ({
      editLicenseForm: 1,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: data
    }));
  }

  markAsDone = async (index, isDone) => {
    let { episodeId, leftTab, stage } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = { episodeId, isDone, sectionName: shallowArr[index]?.sectionName };
      const response = await this.markAsDoneNLockedAction(data);
      if (response) {
        shallowArr[index] = { ...shallowArr[index], isDone };
      }
    } else {
      stage = (stage === constantText.contentConstants.published) ? constantText.contentConstants.changed :
        (stage === constantText.contentConstants.submittedToReview || stage === constantText.contentConstants.unpublished) ?
          constantText.contentConstants.draft : stage
      shallowArr[index] = { ...shallowArr[index], isDone };
    }
    this.setState((prevState) => ({ leftTab: shallowArr, stage }));
  };

  openCreateLicenseForm = () => {
    this.setState(prevState => ({
      editLicenseForm: 0,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: ''
    }));
  }

  unLockedSession = async (index) => {
    let { episodeId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      episodeId, isLocked: true,
      sectionName: shallowArr[index]?.sectionName,
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState((prevState) => ({ leftTab: shallowArr }));
    }
  };

  markAsDoneNLockedAction = async (data) => {
    const response = await apiCalls(Config.episode?.action, "POST", data, null, true, null, this.autoSaveError);
    return response;
  };

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getEpisodeStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  handleTab = (event, selectedTab) => {
    this.setState({ selectedTab, createLicenseForm: false }, () => this.getEpisodeStatus());
  };

  linksClickHandler = (data) => {
    history.push(this.props.match.url + data.path);
  };

  getEpisodeComp = () => {
    const { jsonData, selectedTab, journeyType, leftTab, editLicenseForm, createLicenseForm, tvShowId, episodeId,
      seasonId, licenceData, stage, externalId, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && episodeId && jsonData.ContentProperties && (
          <Properties {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} journeyType={journeyType}
            selectedTab={selectedTab} stage={stage} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} jsonData={jsonData.ContentProperties} setEpisodeStage={this.getEpisodeStage}/>
        )}
        {selectedTab == 1 && tvShowId && seasonId && episodeId && stage && jsonData.CastNCrew && (
          <CastNCrew {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            stage={stage} journeyType={journeyType} jsonData={jsonData.CastNCrew} />
        )}
        {selectedTab === 2 && tvShowId && seasonId && episodeId && stage && jsonData.Video && (
          <Video {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            stage={stage} journeyType={journeyType} jsonData={jsonData.Video} externalId={externalId} refreshActionStatus={this.getEpisodeStatus}/>
        )}
        {(selectedTab === 3 && tvShowId && seasonId && episodeId && jsonData.License) && createLicenseForm == true ? (
          <CreateEditLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId}
            seasonId={seasonId} episodeId={episodeId} currentTabData={leftTab[selectedTab]} editTab={editLicenseForm}
            licenseData={licenceData} journeyType={journeyType} selectedTab={selectedTab} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} openLicenseEditForm={this.openEditForm}
            jsonData={jsonData.License} />
        ) : (
            selectedTab === 3 && tvShowId && seasonId && episodeId && jsonData.License&& (
              <LicenseComponent {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm}
                selectedTab={selectedTab} tvShowId={tvShowId} episodeId={episodeId} seasonId={seasonId}
                unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} jsonData={jsonData.License} />
            )
          )
        }
        {selectedTab === 4 && episodeId && jsonData.Images &&
          <Images {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            markAsDone={this.markAsDone} selectedTab={selectedTab} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} stage={stage} unLockedSession={this.unLockedSession}
            journeyType={this.getJourneyType()} jsonData={jsonData.Images} externalId={externalId}
          />
        }
        {selectedTab === 5 && tvShowId && seasonId && episodeId && jsonData.Seo &&
          <SeoDetails {...this.props} tvShowId={tvShowId} stage={stage} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} journeyType={journeyType} jsonData={jsonData.Seo} propertiesData={propertiesData}/>
        }
        {
          selectedTab === 6 &&
          <Checklist {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} stage={stage}
            markAsDone={this.markAsDone} selectedTab={selectedTab} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} journeyType={journeyType} unLockedSession={this.unLockedSession}
            setEpisodeStage={this.getEpisodeStage}
          />
        }
      </div >
    );
  };

  getQuickFilingEpisodeComp = () => {
    const { jsonData, journeyType, selectedTab, leftTab, tvShowId, editLicenseForm, createLicenseForm, seasonId,
      episodeId, licenceData, stage, externalId, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && episodeId && jsonData.ContentProperties && (
          <Properties {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} journeyType={journeyType} setEpisodeStage={this.getEpisodeStage}
            jsonData={jsonData.ContentProperties} />
        )}
        {selectedTab === 1 && tvShowId && seasonId && episodeId && stage && jsonData.Video && (
          <Video {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            stage={stage} journeyType={journeyType} jsonData={jsonData.Video} externalId={externalId} refreshActionStatus={this.getEpisodeStatus} />
        )}
        {(selectedTab === 2 && tvShowId && seasonId && episodeId && jsonData.License) && createLicenseForm == true ? (
          <CreateEditLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId}
            seasonId={seasonId} episodeId={episodeId} currentTabData={leftTab[selectedTab]} editTab={editLicenseForm}
            licenseData={licenceData} journeyType={journeyType} selectedTab={selectedTab}
            openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} jsonData={jsonData.License} />
        ) : (
            selectedTab === 2 && tvShowId && seasonId && episodeId && jsonData.License&& (
              <LicenseComponent {...this.props} stage={stage} journeyType={journeyType} seasonId={seasonId}
                openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                episodeId={episodeId} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} jsonData={jsonData.License} />
            )
          )
        }
        {selectedTab === 3 && episodeId && jsonData.Images &&
          <Images {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            markAsDone={this.markAsDone} selectedTab={selectedTab} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} stage={stage} unLockedSession={this.unLockedSession}
            journeyType={this.getJourneyType()} jsonData={jsonData.Images} externalId={externalId}
          />
        }
        {selectedTab === 4 && tvShowId && seasonId && episodeId && jsonData.Seo &&
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} stage={stage} episodeId={episodeId}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} journeyType={journeyType} jsonData={jsonData.Seo} propertiesData={propertiesData}/>
        }
        {
          selectedTab === 5 &&
          <Checklist {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            markAsDone={this.markAsDone} selectedTab={selectedTab} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} stage={stage} journeyType={journeyType} unLockedSession={this.unLockedSession}
            setEpisodeStage={this.getEpisodeStage}
          />
        }
      </div >
    );
  };

  getSingleLandingEpisodeComp = () => {
    const {jsonData, journeyType, selectedTab, leftTab, tvShowId, editLicenseForm, createLicenseForm, seasonId,
      episodeId, licenceData, stage, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && episodeId && jsonData.ContentProperties && (
          <Properties {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} journeyType={journeyType} setEpisodeStage={this.getEpisodeStage}
            jsonData={jsonData.ContentProperties} />
        )}
        {selectedTab == 1 && tvShowId && seasonId && episodeId && stage && jsonData.CastNCrew && (
          <CastNCrew {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            stage={stage} journeyType={journeyType} jsonData={jsonData.CastNCrew} />
        )}
        {(selectedTab === 2 && tvShowId && seasonId && episodeId && jsonData.License) && createLicenseForm == true ? (
          <CreateEditLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData} journeyType={journeyType}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone}
            jsonData={jsonData.License} />
        ) : (
            selectedTab === 2 && tvShowId && seasonId && episodeId && jsonData.License&& (
              <LicenseComponent {...this.props} stage={stage} journeyType={journeyType}
                openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                episodeId={episodeId} seasonId={seasonId} unLockedSession={this.unLockedSession}
                currentTabData={leftTab[selectedTab]} openLicenseEditForm={this.openEditForm}
                markAsDone={this.markAsDone} jsonData={jsonData.License} />
            )
          )
        }
        {selectedTab === 3 && episodeId && jsonData.Images &&
          <Images {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            markAsDone={this.markAsDone} selectedTab={selectedTab} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} stage={stage} unLockedSession={this.unLockedSession}
            journeyType={this.getJourneyType()} jsonData={jsonData.Images} externalId={externalId} />
        }
        {selectedTab === 4 && tvShowId && seasonId && episodeId && jsonData.Seo &&
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} stage={stage} episodeId={episodeId}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} journeyType={journeyType} jsonData={jsonData.Seo} propertiesData={propertiesData}/>
        }
        {
          selectedTab === 5 &&
          <Checklist {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            markAsDone={this.markAsDone} selectedTab={selectedTab} currentTabData={leftTab[selectedTab]}
            autoSaveError={this.autoSaveError} stage={stage} journeyType={journeyType} unLockedSession={this.unLockedSession}
            setEpisodeStage={this.getEpisodeStage}
          />
        }
      </div>
    );
  };

  handleRoute = (route) => {
    const { selectedTab } = this.state
    history.push(route, { selectedTab: selectedTab });
  }

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (
      item.key &&
      permissionObj?.['episode'] &&
      permissionObj?.['episode']?.[item.key] &&
      permissionObj?.['episode']?.[item.key]
    ) ? permissionObj?.['episode']?.[item.key]?.canUpdate() : true)
    return links
  }

  getOptions = () => {
    let { journeyType } = this.state;
    if (journeyType === '2') {
      return quickLinksForQuickFiling
    }
    if (journeyType === '3') {
      return this.quickLinksEnable(quickLinksForQuickFiling)
    } else {
      return this.quickLinksEnable(quickLinks)
    }
  }

  render() {
    const { leftTab, selectedTab, journeyType, tvShowId, seasonId, externalId } = this.state;
    const { location, match } = this.props
    let { tvShowUrl, seasonUrl } = episodeBreadcrumbUrls(location)
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          className=""
          links={breadCrumbs.links(tvShowUrl, seasonUrl, tvShowId, seasonId)}
          typography={breadCrumbs.typography(match?.params?.episodeId ? "edit" : "create", journeyType)}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              data-test={`handleRoute`}
              onClick={() => this.handleRoute(`/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`)} >
              <AngleLeftArrow />
            </span>
            <strong>
              <span>
                {journeyType == '3' && constantText.single_landing_page_text}
                {journeyType == '2' && constantText.quick_filing_text}
                {journeyType == '1' && constantText.tv_show_episode_text.episode}
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
                <LeftTab className="leftTab-widget" orientation="vertical" variant="scrollable" options={leftTab}
                  selectedTab={selectedTab} showIcon={true}
                  Icon1={RadioButtonCheckedIcon} Icon2={CheckCircleIcon} Icon3={RadioButtonUncheckedIcon}
                  handleChange={this.handleTab}
                />
              </div>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-8 gutter-10 mid-section">
              {(journeyType == "3") ? this.getSingleLandingEpisodeComp() : (journeyType == "2") ?
                this.getQuickFilingEpisodeComp() : this.getEpisodeComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                showTips={(journeyType && ((journeyType == "2") || (journeyType == "3"))) ? true : false}
                options={this.getOptions()}
                clicked={this.linksClickHandler}
                customText={"You can convert this page to Main Episode Page on Editing."}  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEpisode;
