import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Sub Components
import Properties from "../Properties/Properties";
import CastNCrew from '../CastNCrew/CastNCrew';
import ViewVideo from "../Video/ViewVideo";
import Images from "../Images/Images";
import SeoDetails from "../SeoDetails/SeoDetails";
import LicenseComponent from "../License/LicenseComponent";
import Checklist from '../Checklist/Checklist';

//Common files
import { CommonModel } from "../../Common/Model/CommonModel";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import RadioButton from "../../Common/RadioButton/RadioButton";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper Files
import { constantText } from "../../../_helpers/constants.text";
import { tvShowConstants } from "../../TvShow/Constants/tvshow.constants";
import { episodeBreadcrumbUrls, history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { breadCrumbs, quickLinks, quickLinksForQuickFiling } from "./breadCrumbs";
import { permissionObj } from "../../../_helpers/permission";

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

class ViewEpisode extends Component {
  constructor(props) {
    super(props);
    let { stateMode } = props.location?.state || {};
    this.state = {
      propertiesData: null,
      stateMode: stateMode || null,
      selectedTab: 0, jsonData: {},
      tvShowId: null, seasonId: null, externalId: null, episodeId: null, journeyType: null, selectJourney: null,
      leftTab: constantText.episode_left_tab_options_arr,
      createLicenseForm: false, editLicenseForm: 0, licenceData: "",
      stage: null, showAskedPopup: false
    };
  }

  componentDidMount = async () => {
    let { match, location } = this.props;
    let { leftTab, selectedTab } = this.state;
    leftTab.map(item => item.isDone = false);
    if (match?.params?.id && match?.params?.seasonId && match?.params?.episodeId) {
      this.setState(
        (prevState) => ({
          tvShowId: match?.params?.id, seasonId: match.params.seasonId, episodeId: match?.params?.episodeId,
          selectedTab: location?.state?.selectedTab || selectedTab
        }),
        () => this.handlePermission());
    } else {
      let previousRoute = this.props.match.url;
      previousRoute = previousRoute.replace("/view", '');
      history.replace(`${previousRoute}/episode`);
    }
  };

  getJsonData = async () => {
    const type = "episode_Manual_StandardJourney_Structure";
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getEpisodeStage = async (response = null) => {
    let { leftTab, selectedTab } = this.state;
    if (!response && selectedTab != 0) {
      let { match } = this.props;
      let episodeId = match?.params?.episodeId
      let url = `${Config?.episode?.episodeProperties}/${episodeId}`;
      response = await apiCalls(url, "GET", {}, this.props.match.path);
    }
    if (response) {
      const { journeyType, externalId, contentState } = response;
      let filterKey = (journeyType?.value == "3") ? "singleLanding" : (journeyType?.value == "2") ? "quickFiling" : "main";
      leftTab = leftTab?.filter(data => !!data[filterKey])
      this.setState(prevState => ({
        propertiesData: response,
        journeyType: journeyType?.value,
        externalId: externalId?.value,
        stage: contentState?.value?.title,
        leftTab
      }));
    }
  }

  getEpisodeStatus = async () => {
    let { stage, leftTab, episodeId } = this.state;
    const response = await apiCalls(`${Config.episode.action}/${episodeId}`, "GET", null, null);
    let resData = response.filter((elem) => leftTab.find(( {sectionName} ) => elem.sectionName === sectionName));

    if (response) {
      let shallowArr = [...leftTab];
      response?.map(data => {
        const { sectionName, isDone } = data;
        const index = shallowArr?.findIndex(obj => obj?.sectionName == sectionName);
        shallowArr[index] = { ...shallowArr[index], isDone };
      });
      const checkIsDone = shallowArr.find(item => (item.permissionSubKey !== 'checklistModule' && item.isDone === false));
      if (!checkIsDone) {
        shallowArr.forEach(item => {
          if (item.permissionSubKey === 'checklistModule') {
            item.isDone = true;
          }
        })
      }
      this.setState((prevState) => ({ leftTab: shallowArr }), () => this.getEpisodeStage());
    }
  };

  handlePermission = () => {
    let { leftTab } = this.state;
    let shallowArr= [...leftTab];
    shallowArr = shallowArr?.map((data) => ({ ...data, permissionName: "canView" }));
    let selectedTab = shallowArr?.findIndex(data => !data?.permissionKey || (data?.permissionSubKey ?
      permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
      permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    if (this.props?.location?.state?.selectedTab) {
      selectedTab = this.props?.location?.state?.selectedTab;
    }
    this.setState(prevState => ({ leftTab: shallowArr, selectedTab: (selectedTab > -1) ? selectedTab : 0 }), () => {
      this.getEpisodeStatus();
      this.getJsonData();
    });
  };

  handleTab = (event, selectedTab) => {
    this.setState({ selectedTab, createLicenseForm: false }, () => this.getEpisodeStatus());
  };

  linksClickHandler = (data) => {
    history.push(this.props.match.url + data.path);
  };

  getEpisodeComp = () => {
    const {jsonData, selectedTab, leftTab, tvShowId, seasonId, episodeId, stage, externalId, journeyType, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab === 0 && tvShowId && seasonId && episodeId && jsonData.ContentProperties &&
          <Properties {...this.props} viewOnly={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} currentTabData={leftTab[selectedTab]}
            handleRoute={this.handleRoute} jsonData={jsonData.ContentProperties} journeyType={journeyType} setEpisodeStage={this.getEpisodeStage}
          />
        }
        {selectedTab === 1 && jsonData.CastNCrew &&
          <CastNCrew {...this.props} viewOnly={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.CastNCrew} />
        }
        {selectedTab === 2 && jsonData.Video && (
          <ViewVideo {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage}
            viewOnly={true} handleRoute={this.handleRoute} jsonData={jsonData.Video} />
        )}
        {selectedTab === 3 && jsonData.License &&
          <LicenseComponent
            {...this.props} viewOnly={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.License} />
        }
        {selectedTab === 4 && jsonData.Images &&
          <Images {...this.props} isViewMode={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.Images} />
        }
        {selectedTab === 5 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.Seo} propertiesData={propertiesData}/>
        )}
        {selectedTab === 6 &&
          <Checklist {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} stage={stage}
            selectedTab={selectedTab} journeyType={journeyType} currentTabData={leftTab[selectedTab]} setEpisodeStage={this.getEpisodeStage}
          />
        }
      </div>
    );
  };

  getQuickFilingEpisodeComp = () => {
    const {jsonData, selectedTab, leftTab, tvShowId, seasonId, episodeId, externalId, stage, journeyType, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && episodeId && jsonData.ContentProperties && (
          <Properties {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            isViewMode={true} selectedTab={selectedTab} stage={stage} currentTabData={leftTab[selectedTab]}
            handleRoute={this.handleRoute} viewOnly={true} jsonData={jsonData.ContentProperties}
            journeyType={journeyType} setEpisodeStage={this.getEpisodeStage} />
        )}
        {selectedTab === 1 && jsonData.Video && (
          <ViewVideo {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.Video} />
        )}
        {selectedTab === 2 && jsonData.License &&
          <LicenseComponent
            {...this.props} viewOnly={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.License} />
        }
        {selectedTab === 3 && jsonData.Images &&
          <Images {...this.props} isViewMode={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.Images} />
        }
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.Seo} propertiesData={propertiesData}/>
        )}
        {selectedTab === 5 &&
          <Checklist {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} stage={stage}
            selectedTab={selectedTab} journeyType={journeyType} currentTabData={leftTab[selectedTab]} setEpisodeStage={this.getEpisodeStage}
          />
        }
      </div >
    );
  };

  getSingleLandingEpisodeComp = () => {
    const {jsonData, selectedTab, leftTab, tvShowId, seasonId, episodeId, externalId, stage, journeyType, propertiesData } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && episodeId && jsonData.ContentProperties &&
          <Properties {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            stage={stage} currentTabData={leftTab[selectedTab]} handleRoute={this.handleRoute} viewOnly={true}
            jsonData={jsonData.ContentProperties} journeyType={journeyType} setEpisodeStage={this.getEpisodeStage} />
        }
        {selectedTab === 1 && tvShowId && seasonId && episodeId && stage && jsonData.CastNCrew &&
          <CastNCrew {...this.props} viewOnly={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.CastNCrew}
          />
        }
        {selectedTab === 2 && jsonData.License &&
          <LicenseComponent
            {...this.props} viewOnly={true} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.License} />
        }
        {selectedTab === 3 && jsonData.Images &&
          <Images {...this.props} episodeId={episodeId} isViewMode={true} tvShowId={tvShowId} seasonId={seasonId}
            selectedTab={selectedTab} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.Images} />
        }
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.Seo} propertiesData={propertiesData}/>
        )}
        {selectedTab === 5 &&
          <Checklist {...this.props} tvShowId={tvShowId} seasonId={seasonId} episodeId={episodeId} stage={stage}
            selectedTab={selectedTab} journeyType={journeyType} currentTabData={leftTab[selectedTab]} setEpisodeStage={this.getEpisodeStage}
          />
        }
      </div >
    );
  };

  showHideAskedPopup = () => {
    let { showAskedPopup } = this.state;
    this.setState(prevState => ({ showAskedPopup: !showAskedPopup, selectJourney: null }));
  }

  goToEditEpisode = async () => {
    let { selectJourney, journeyType, selectedTab, episodeId } = this.state;
    const { label } = this.state.leftTab[selectedTab];
    let episodeRoute = this.props.match.url;
    episodeRoute = episodeRoute.replace(`/view/${episodeId}`, '');
    let route = (selectJourney == "3") ? `${episodeRoute}/single/${episodeId}` : (selectJourney == "2") ?
      `${episodeRoute}/quick/${episodeId}` : `${episodeRoute}/${episodeId}`
    if (selectJourney && (selectJourney != journeyType)) {
      let url = `${Config.episode.episodeProperties}/${episodeId}`;
      let response = await apiCalls(url, "PATCH", { episode: { journeyType: selectJourney } }, this.props.match.url);
      if (response) {
        selectedTab= (selectJourney== '1' && selectedTab>= 2)? selectedTab+ 1: selectedTab;
        this.props.history.push({
          pathname: route,
          state: { selectedTab, tabLabel: label }
        });
      }
    }
    if (selectJourney == journeyType) {
      this.props.history.push({
        pathname: route,
        state: {
          selectedTab: selectedTab,
          tabLabel: label
        }
      });
    }
    this.showHideAskedPopup();
  }

  handleRadioButton = event => {
    let { name, value } = event.target;
    this.setState(prevState => ({ [name]: value }));
  }

  getAskedEditUI = () => {
    const { journeyType, selectJourney } = this.state;
    const { continue_editing_single_landing_episode_obj, continue_editing_quick_filing_episode_obj,
      single_landing_to_quick_filing_episode_obj, single_landing_to_main_episode_obj,
      quick_filing_to_main_episode_obj } = constantText;

    const data = (journeyType == 2) ? [continue_editing_quick_filing_episode_obj, quick_filing_to_main_episode_obj] :
      [continue_editing_single_landing_episode_obj, single_landing_to_quick_filing_episode_obj,
        single_landing_to_main_episode_obj];
    return (
      <RadioButton name={"selectJourney"} value={selectJourney} labelText=""
        labelPlacement="end" data={data} onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    )
  }

  handleRoute = () => {
    const { journeyType, selectedTab, episodeId, leftTab } = this.state;
    const { label } = leftTab[selectedTab];
    if (journeyType == "1") {
      let episodeRoute = this.props.match.url
      episodeRoute = episodeRoute?.replace(`view/${episodeId}`, episodeId)
      this.props?.history?.push({
        pathname: episodeRoute,
        state: { selectedTab, tabLabel: label }
      })
    } else {
      this.showHideAskedPopup();
    }
  }

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (item.key && permissionObj?.['episode'] && permissionObj?.['episode']?.[item.key] && permissionObj?.['episode']?.[item.key]) ? permissionObj?.['episode']?.[item.key]?.canUpdate() : true)
    return links;
  }
  goToEpisode = route => {
    const { stateMode } = this.state;
    if(stateMode){
      history.push({
        pathname: constantText.tvshow_list_route,
        state: {
          selectedContentType: tvShowConstants.episodeType,
          searchBtnText: constantText.tvShowsConstant.episodes,
          searchPlaceholderText: constantText.tvShowsConstant.searchPlaceholderEpisodes,
        }
      })
    }
    else{
      history.push(route);
    }
  }
  getOptions = () => {
    let { journeyType } = this.state;
    if (journeyType === '2') {
      return quickLinksForQuickFiling
    };
    if (journeyType === '3') {
      return this.quickLinksEnable(quickLinksForQuickFiling)
    } else {
      return this.quickLinksEnable(quickLinks)
    }
  }

  render() {
    const { leftTab, selectedTab, externalId, journeyType, tvShowId, seasonId, showAskedPopup } = this.state
    const { location } = this.props
    let { tvShowUrl, seasonUrl } = episodeBreadcrumbUrls(location);
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          className=""
          links={breadCrumbs.links(tvShowUrl, seasonUrl, tvShowId, seasonId)}
          typography={breadCrumbs.typography('view')}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span onClick={() => this.goToEpisode(`/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`)} >
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.tv_show_episode_text.view}</span>
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
                customText={"You can convert this page to Main Episode Page on Editing."} />
            </div>
          </div>
        </div>
        <CommonModel state={showAskedPopup} handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={"Update Content"} showIcon={false} showDes={false} Form={this.getAskedEditUI()}
          btn1Text={constantText.yes_text} btn1Action={this.goToEditEpisode}
          btn2Text={constantText.no_text} btn2Action={this.showHideAskedPopup}
        />
      </div>
    );
  }
}

export default ViewEpisode;
