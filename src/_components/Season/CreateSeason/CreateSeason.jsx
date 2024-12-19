import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Sub Components
import SeasonProperties from "../SeasonProperties/SeasonProperties";
import CastAndCrew from "../CastAndCrew/CastAndCrew";
import SeoDetails from "../SeoDetails/SeoDetails";
import LicenseModule from "../LicenseModule/licenseModule";
import CreateLicense from "../LicenseModule/subModule/createLicense";
import Images from "../Images/Images";
import CheckList from '../Checklist/Checklist';

//Services
import { apiCalls } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../../src/_actions/alertMessages.action';

//Helper Files
import { constantText } from "../../../_helpers/constants.text";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { breadCrumbs, quickLinks, quickLinksForQuickFiling } from "./breadCrumbs";
import { getLocalData } from "../../../_helpers/util";
import { permissionObj } from "../../../_helpers/permission";

import AngleLeftArrow from "images/angle-left-arrow.svg";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";


class CreateSeason extends Component {
  constructor(props) {
    super(props);
    let { journeyType } = props;
    let filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    this.state = {
      propertiesData: null,
      seasonState: filterKey, jsonData: {},
      userData: getLocalData("userData"),
      selectedTab: 0, tvShowId: null, seasonId: null, externalId: null,
      leftTab: constantText.season_left_tab_options_arr?.filter(data => data[filterKey]) || [],
      createLicenseForm: false,
      editLicenseForm: 0,
      licenceData: "", stage: 'Draft',
    };
  }

  componentDidMount = async () => {
    let { match } = this.props;
    let leftTabCopy = [...this.state.leftTab];
    let checklistObj = leftTabCopy[leftTabCopy.length - 1];
    checklistObj.isDone = false;
    const defaultTab = { ...this.props?.location?.state }
    this.setState({ leftTab: leftTabCopy })
    if (match?.params?.id && match?.params?.seasonId) {
      this.setState(
        (prevState) => ({ tvShowId: match?.params?.id, seasonId: match.params.seasonId, defaultTab }),
        () => this.handlePermission()
      );
    } else {
      this.getSeasonId();
    }
  };

  getSeasonId = async () => {
    let { journeyType, match } = this.props;
    let response = await apiCalls(Config.season.seasonProperties, "POST", {
      season: { journeyType, tvShowId: match.params?.id }
    }, null, true, null, this.autoSaveError);
    let { seasonId } = response;
    this.setSeasonId(seasonId, match.params.id);
  };

  setSeasonId = (seasonId, tvShowId) => {
    const { journeyType } = this.props;
    this.setState(prevState => ({ seasonId, tvShowId }), () => this.handlePermission());
    let previousRoute = this.props.match.url;
    previousRoute = previousRoute?.replace("/create", '');
    let route = (journeyType == '3') ? `${previousRoute}/edit/${seasonId}` : (journeyType == '2') ?
      `${previousRoute}/edit/${seasonId}` : `${previousRoute}/${seasonId}`;
    history.replace(route);
  };

  getJsonData = async () => {
    let { journeyType } = this.props;
    const type = (journeyType == "3") ? "season_SingleLanding_Structure" : (journeyType == "2") ?
      "season_QuickFilling_Structure" : "season_StandardJourney_Structure";
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getSeasonStage = async (response = null) => {
    let { tvShowId, seasonId, selectedTab } = this.state;
    if(!response && selectedTab != 0){
      let url = `${Config?.season?.seasonProperties}/${seasonId}?tvShowId=${tvShowId}`;
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

  getSeasonStatus = async () => {
    let { userData, leftTab, seasonId } = this.state;
    const response = await apiCalls(`${Config.season.action}/${seasonId}`, "GET", null, null,);
    if (response && response.length > 0) {
      let shallowArr = [...leftTab];
      let resData = response.filter((elem) => leftTab.find(( {sectionName} ) => elem.sectionName === sectionName));
      resData?.map((data) => {
        const { sectionName, isDone, isLocked, lockedByUser } = data;
        const { id, firstName, lastName } = lockedByUser || {};
        const index = shallowArr?.findIndex(obj => obj?.sectionName == sectionName);
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
      this.setState((prevState) => ({ leftTab: shallowArr }), ()=> this.getSeasonStage());
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
      this.getSeasonStatus();
      this.getJsonData();
    });
  };

  markAsDone = async (index, isDone) => {
    let { seasonId, leftTab, stage } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = { seasonId, isDone, sectionName: shallowArr[index]?.sectionName };
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

  unLockedSession = async (index) => {
    let { seasonId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      seasonId, isLocked: true,
      sectionName: shallowArr[index]?.sectionName,
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState((prevState) => ({ leftTab: shallowArr }));
    }
  };

  markAsDoneNLockedAction = async (data) => {
    const response = await apiCalls(Config.season?.action, "POST", data, null, true, null, this.autoSaveError);
    return response;
  };

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getSeasonStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  handleTab = (event, selectedTab) => {
    this.setState({ selectedTab, createLicenseForm: false }, () => this.getSeasonStatus());
  };

  linksClickHandler = (data) => {
    history.push(this.props.match.url + data.path);
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

  getSeasonComp = () => {
    const { jsonData, selectedTab, leftTab, tvShowId, seasonId, createLicenseForm, editLicenseForm, licenceData, stage,
      externalId, seasonState, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && jsonData.ContentProperties && (
          <SeasonProperties {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab} stage={stage}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} getExternalId={this.getExternalId}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} jsonData={jsonData.ContentProperties} setSeasonStage={this.getSeasonStage}/>
        )}
        {selectedTab == 1 && tvShowId && seasonId && jsonData.CastNCrew && (
          <CastAndCrew {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab} stage={stage}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            jsonData={jsonData.CastNCrew} />
        )}
        {(selectedTab === 2 && tvShowId && seasonId && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData} stage={stage}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} jsonData={jsonData.License} />
        ) : (
            selectedTab === 2 && tvShowId && seasonId && jsonData.License&& (
              <LicenseModule {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                seasonId={seasonId} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} jsonData={jsonData.License} />
            )
          )}
        {selectedTab === 3 && tvShowId && seasonId && jsonData.Images &&
          <Images {...this.props} tvShowId={tvShowId} seasonId={seasonId} markAsDone={this.markAsDone}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} externalId={externalId} unLockedSession={this.unLockedSession} jsonData={jsonData.Images}
          />
        }
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} unLockedSession={this.unLockedSession} jsonData={jsonData.Seo} propertiesData={propertiesData}
          />
        )}
        {selectedTab === 5 && (
          <CheckList state={seasonState} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} setSeasonStage={this.getSeasonStage}
          />
        )}
      </div>
    );
  };

  getQuickFilingSeasonComp = () => {
    const { jsonData, selectedTab, leftTab, tvShowId, stage, seasonId, createLicenseForm, editLicenseForm,
      licenceData, externalId, seasonState, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && jsonData.ContentProperties && (
          <SeasonProperties {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} getExternalId={this.getExternalId}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} stage={stage}
            jsonData={jsonData.ContentProperties} setSeasonStage={this.getSeasonStage} />
        )}
        {(selectedTab === 1 && tvShowId && seasonId && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData} stage={stage}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone}
            unLockedSession={this.unLockedSession} jsonData={jsonData.License} />
        ) : (
            selectedTab === 1 && tvShowId && seasonId && jsonData.License&& (
              <LicenseModule {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                seasonId={seasonId} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} jsonData={jsonData.License} />
            )
          )
        }
        { selectedTab === 2 && tvShowId && seasonId && jsonData.Images &&
          <Images {...this.props} tvShowId={tvShowId} seasonId={seasonId} markAsDone={this.markAsDone}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            externalId={externalId} stage={stage} unLockedSession={this.unLockedSession} jsonData={jsonData.Images}
          />
        }
        {selectedTab === 3 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} unLockedSession={this.unLockedSession} jsonData={jsonData.Seo} propertiesData={propertiesData}
          />
        )}
        {selectedTab === 4 && (
          <CheckList state={seasonState} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} setSeasonStage={this.getSeasonStage}
          />
        )}
      </div>
    );
  };

  getSingleLandingSeasonComp = () => {
    const {jsonData, selectedTab, leftTab, tvShowId, seasonId, createLicenseForm, editLicenseForm, licenceData,
      externalId, stage, seasonState, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && jsonData.ContentProperties && (
          <SeasonProperties {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} getExternalId={this.getExternalId}
            unLockedSession={this.unLockedSession} autoSaveError={this.autoSaveError} stage={stage}
            jsonData={jsonData.ContentProperties} setSeasonStage={this.getSeasonStage} />
        )}
        {selectedTab == 1 && tvShowId && seasonId && jsonData.CastNCrew && (
          <CastAndCrew {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab} stage={stage}
            currentTabData={leftTab[selectedTab]} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
            jsonData={jsonData.CastNCrew} />
        )}
        {(selectedTab === 2 && tvShowId && seasonId && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone}
            jsonData={jsonData.License} />
        ) : (
            selectedTab === 2 && tvShowId && seasonId && jsonData.License&& (
              <LicenseModule {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                seasonId={seasonId} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                jsonData={jsonData.License} openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} />
            )
          )
        }
        {selectedTab === 3 && jsonData.Images &&
          <Images {...this.props} tvShowId={tvShowId} seasonId={seasonId} markAsDone={this.markAsDone}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            externalId={externalId} stage={stage} unLockedSession={this.unLockedSession} jsonData={jsonData.Images}
          />
        }
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} unLockedSession={this.unLockedSession} jsonData={jsonData.Seo} propertiesData={propertiesData}
          />
        )}
        {selectedTab === 5 && (
          <CheckList state={seasonState} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            markAsDone={this.markAsDone} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage} setSeasonStage={this.getSeasonStage}
          />
        )}
      </div>
    );
  };

  getExternalId = externalId => {
    this.setState(prevState => ({ externalId }));
  }

  handleRoute = (route) => {
    const { selectedTab } = this.state
    history.push(route, { selectedTab: selectedTab });
  }

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (item.key && permissionObj?.['season'] && permissionObj?.['season']?.[item.key] && permissionObj?.['season']?.[item.key]) ? permissionObj?.['season']?.[item.key]?.canUpdate() : true)
    return links;
  }

  getOptions = () => {
    let { seasonState } = this.state;
    if (seasonState === 'quickFiling') {
      return quickLinksForQuickFiling
    };
    if (seasonState === 'singleLanding') {
      return this.quickLinksEnable(quickLinksForQuickFiling)
    } else {
      return this.quickLinksEnable(quickLinks)
    }
  }

  render() {
    const { leftTab, selectedTab, seasonState, externalId } = this.state;
    const { match, path, journeyType } = this.props;
    let url = "/edit";
    url = path?.includes("/tvshow/view") ? "/view" : path?.includes("/tvshow/quick/edit") ? "/quick/edit" :
      path?.includes("/tvshow/single/edit/") ? "/single/edit" : url;
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          className=""
          links={breadCrumbs.links(url, match?.params?.id)}
          typography={breadCrumbs.typography(match?.params?.seasonId ? "edit" : "create", seasonState)}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              data-test={"handleRoute"}
              onClick={() => this.handleRoute(`/tvshow${url}/${match?.params?.id}/season`)} >
              <AngleLeftArrow />
            </span>
            <strong>
              <span>
                {seasonState == "quickFiling" && constantText.quick_filing_text}
                {seasonState == "singleLanding" && constantText.single_landing_page_text}
                {(seasonState != "singleLanding" && seasonState != "quickFiling") && constantText.tv_show_season_text.season}
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
              {(journeyType == "3") ? this.getSingleLandingSeasonComp() : (journeyType == "2") ?
                this.getQuickFilingSeasonComp() : this.getSeasonComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                showTips={(seasonState && ((seasonState == "quickFiling") || (seasonState == "singleLanding"))) ? true : false}
                options={this.getOptions()}
                clicked={this.linksClickHandler}
                customText={"You can convert this page to Main Season Page on Editing."} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateSeason;
