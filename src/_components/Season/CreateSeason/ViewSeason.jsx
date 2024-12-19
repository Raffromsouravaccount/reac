import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Sub Components
import SeasonProperties from "../SeasonProperties/SeasonProperties";
import SeoDetails from "../SeoDetails/SeoDetails";
import CastAndCrew from "../CastAndCrew/CastAndCrew";
import LicenseModule from "../LicenseModule/licenseModule";
import CreateLicense from "../LicenseModule/subModule/createLicense";
import Images from "../Images/Images";
import CheckList from '../Checklist/Checklist';

//Common files
import { CommonModel } from "../../Common/Model/CommonModel";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import RadioButton from "../../Common/RadioButton/RadioButton";

//Services
import { apiCalls } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../../src/_actions/alertMessages.action';

//Helper Files
import { constantText } from "../../../_helpers/constants.text";
import { tvShowConstants } from "../../TvShow/Constants/tvshow.constants";
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { breadCrumbs, quickLinks, quickLinksForQuickFiling } from "./breadCrumbs";
import { permissionObj } from "../../../_helpers/permission";

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

class ViewSeason extends Component {
  constructor(props) {
    super(props);
    let { journeyType } = props.location?.state || { journeyType: "1" };
    let { stateMode } = props.location?.state || {};
    let filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    this.state = {
      propertiesData: null,
      stateMode: stateMode || null,
      seasonState: filterKey, jsonData: {},
      selectedTab: 0, tvShowId: null, seasonId: null, externalId: null, journeyType, selectJourney: null,
      leftTab: constantText.season_left_tab_options_arr || [],
      createLicenseForm: false, editLicenseForm: 0, licenceData: "",
      stage: 'Draft', showAskedPopup: false
    };
  }

  componentDidMount = async () => {
    let { match } = this.props;
    let leftTabCopy = [...this.state.leftTab];
    let checklistObj = leftTabCopy[leftTabCopy.length - 1];
    checklistObj.isDone = false;
    this.setState({ leftTab: leftTabCopy })
    if (match?.params?.id && match?.params?.seasonId) {
      this.setState(
        (prevState) => ({ tvShowId: match?.params?.id, seasonId: match.params.seasonId }),
        () => this.handlePermission()
      );
    } else {
      let previousRoute = this.props.match.url;
      previousRoute = previousRoute.replace("/view", '');
      history.replace(`${previousRoute}/season`);
    }
  };

  getJsonData = async () => {
    const type = "season_StandardJourney_Structure";
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getSeasonStage = async (response = null) => {
    let { tvShowId, seasonId, leftTab, selectedTab } = this.state;
    if(!response && selectedTab != 0){
      let url = `${Config?.season?.seasonProperties}/${seasonId}?tvShowId=${tvShowId}`;
      response = await apiCalls(url, "GET", {}, this.props.match.path);
    }
    if (response) {
      const { journeyType, externalId, contentState } = response;
      let filterKey = (journeyType?.value == "3") ? "singleLanding" : (journeyType?.value == "2") ? "quickFiling" : "main";
      leftTab = leftTab?.filter(data => !!data[filterKey])
      this.setState(prevState => ({
        propertiesData: response,
        seasonState: filterKey,
        externalId: externalId?.value,
        stage: contentState?.value?.title,
        leftTab
      }));
    }
  }

  getSeasonStatus = async () => {
    let { leftTab, seasonId } = this.state;
    const response = await apiCalls(`${Config.season.action}/${seasonId}`, "GET", null, null,);
    if (response && response.length > 0) {
      let shallowArr = [...leftTab];
      let resData = response.filter((elem) => leftTab.find(( {sectionName} ) => elem.sectionName === sectionName));
      resData?.map((data) => {
        const { sectionName, isDone } = data;
        const index = shallowArr?.findIndex(
          (obj) => obj?.sectionName == sectionName
        );
        shallowArr[index] = {
          ...shallowArr[index],
          isDone
        };
      });
      const notDone = resData?.filter((data) => !data.isDone);
      const checklistObj = shallowArr.find(item => item.permissionSubKey === 'checklistModule');
      checklistObj.isDone = (notDone?.length === 0 && (resData.length >= (shallowArr.length - 1))) ? true : false;
      this.setState((prevState) => ({ leftTab: shallowArr }), () => this.getSeasonStage());
    }
  };

  handlePermission = () => {
    let { leftTab } = this.state;
    let shallowArr = [...leftTab];
    shallowArr = shallowArr?.map((data) => ({ ...data, permissionName: "canView" }));
    let selectedTab = shallowArr?.findIndex(data => !data?.permissionKey || (data?.permissionSubKey ?
      permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
      permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    if (this.props?.location?.state?.selectedTab) {
      selectedTab = this.props?.location?.state?.selectedTab;
    }
    this.setState(prevState => ({ leftTab: shallowArr, selectedTab }), () => {
      this.getSeasonStatus();
      this.getJsonData();
    });
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
    history.push(this.props.match?.url + data.path);
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

  setStage = stage => {
    this.setState(prevState => ({ stage }));
  };


  getSeasonComp = () => {
    const { jsonData, selectedTab, propertiesData, leftTab, tvShowId, seasonId, createLicenseForm, editLicenseForm, licenceData,
      stage, externalId, journeyType } = this.state;
    let seasonState = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && jsonData.ContentProperties && (
          <SeasonProperties {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} getExternalId={this.getExternalId} viewOnly={true}
            stage={stage} setStage={this.setStage} handleRoute={this.handleRoute} jsonData={jsonData.ContentProperties} setSeasonStage={this.getSeasonStage} />
        )}
        {selectedTab == 1 && tvShowId && seasonId && jsonData.CastNCrew && (
          <CastAndCrew {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            stage={stage} currentTabData={leftTab[selectedTab]} viewOnly={true} handleRoute={this.handleRoute}
            jsonData={jsonData.CastNCrew} />
        )}
        {(selectedTab === 2 && tvShowId && seasonId && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.License} />
        ) : (
            selectedTab === 2 && tvShowId && seasonId && jsonData.License&& (
              <LicenseModule {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                seasonId={seasonId} currentTabData={leftTab[selectedTab]} openLicenseEditForm={this.openEditForm}
                viewOnly={true} handleRoute={this.handleRoute} jsonData={jsonData.License} />
            )
          )
        }
        {selectedTab === 3 && jsonData.Images &&
          <Images {...this.props} propertiesData={propertiesData} isViewMode={true} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            autoSaveError={this.autoSaveError} stage={stage} externalId={externalId} handleRoute={this.handleRoute}
            jsonData={jsonData.Images} />
        }
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails  {...this.props} propertiesData={propertiesData} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage}
            handleRoute={this.handleRoute} viewOnly={true} jsonData={jsonData.Seo} />
        )}
        {selectedTab === 5 && (
          <CheckList state={seasonState} tvShowId={tvShowId} viewMode={true} seasonId={seasonId}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage}
          />
        )}
      </div>
    );
  };

  getQuickFilingSeasonComp = () => {
    const { jsonData, selectedTab, propertiesData, journeyType, leftTab, tvShowId, seasonId, createLicenseForm, editLicenseForm,
      licenceData, externalId, stage } = this.state;
    let seasonState = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && jsonData.ContentProperties && (
          <SeasonProperties {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} getExternalId={this.getExternalId} viewOnly={true}
            stage={stage} setStage={this.setStage} handleRoute={this.handleRoute} jsonData={jsonData.ContentProperties} setSeasonStage={this.getSeasonStage}/>
        )}
        {(selectedTab === 1 && tvShowId && seasonId && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.License} />
        ) : (
            selectedTab === 1 && tvShowId && seasonId && jsonData.License&& (
              <LicenseModule {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                seasonId={seasonId} currentTabData={leftTab[selectedTab]} openLicenseEditForm={this.openEditForm}
                viewOnly={true} handleRoute={this.handleRoute} jsonData={jsonData.License} />
            )
          )
        }
        {selectedTab === 2 && jsonData.Images &&
          <Images {...this.props} propertiesData={propertiesData} isViewMode={true} tvShowId={tvShowId} seasonId={seasonId} stage={stage}
            selectedTab={selectedTab} autoSaveError={this.autoSaveError} externalId={externalId}
            handleRoute={this.handleRoute} jsonData={jsonData.Images}
          />
        }
        {selectedTab === 3 && jsonData.Seo && (
          <SeoDetails  {...this.props} propertiesData={propertiesData} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage}
            handleRoute={this.handleRoute} viewOnly={true} jsonData={jsonData.Seo} />
        )}
        {selectedTab === 4 && (
          <CheckList state={seasonState} tvShowId={tvShowId} seasonId={seasonId} viewMode={true} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  getSingleLandingSeasonComp = () => {
    const { jsonData, selectedTab, propertiesData, leftTab, tvShowId, seasonId, createLicenseForm, editLicenseForm, licenceData,
      externalId, stage, journeyType } = this.state;
    let seasonState = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && seasonId && jsonData.ContentProperties && (
          <SeasonProperties {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} getExternalId={this.getExternalId} viewOnly={true}
            stage={stage} setStage={this.setStage} handleRoute={this.handleRoute} jsonData={jsonData.ContentProperties} setSeasonStage={this.getSeasonStage}/>
        )}
        {selectedTab == 1 && tvShowId && seasonId && jsonData.CastNCrew && (
          <CastAndCrew {...this.props} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            stage={stage} currentTabData={leftTab[selectedTab]} viewOnly={true} handleRoute={this.handleRoute}
            jsonData={jsonData.CastNCrew} />
        )}
        {(selectedTab === 2 && tvShowId && seasonId && jsonData.License) && createLicenseForm == true ? (
          <CreateLicense {...this.props} openLicenseForm={this.openCreateLicenseForm} tvShowId={tvShowId} seasonId={seasonId}
            currentTabData={leftTab[selectedTab]} editTab={editLicenseForm} licenseData={licenceData}
            selectedTab={selectedTab} openLicenseEditForm={this.openEditForm} viewOnly={true}
            handleRoute={this.handleRoute} jsonData={jsonData.License} />
        ) : (
            selectedTab === 2 && tvShowId && seasonId && jsonData.License&& (
              <LicenseModule {...this.props} stage={stage} openLicenseForm={this.openCreateLicenseForm} selectedTab={selectedTab} tvShowId={tvShowId}
                seasonId={seasonId} currentTabData={leftTab[selectedTab]} openLicenseEditForm={this.openEditForm}
                viewOnly={true} handleRoute={this.handleRoute} jsonData={jsonData.License} />
            )
          )
        }
        {selectedTab === 3 && jsonData.Images &&
          <Images {...this.props} propertiesData={propertiesData} isViewMode={true} tvShowId={tvShowId} seasonId={seasonId} stage={stage}
            selectedTab={selectedTab} autoSaveError={this.autoSaveError} externalId={externalId}
            handleRoute={this.handleRoute} jsonData={jsonData.Images}
          />
        }
        {selectedTab === 4 && jsonData.Seo && (
          <SeoDetails  {...this.props} propertiesData={propertiesData} tvShowId={tvShowId} seasonId={seasonId} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError} stage={stage}
            handleRoute={this.handleRoute} viewOnly={true} jsonData={jsonData.Seo} />
        )}
        {selectedTab === 5 && (
          <CheckList state={seasonState} tvShowId={tvShowId} seasonId={seasonId} viewMode={true}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} autoSaveError={this.autoSaveError}
            stage={stage}
          />
        )}
      </div>
    );
  };

  getExternalId = (externalId, journeyType) => {
    let { leftTab } = this.state;
    let filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    leftTab = leftTab?.filter(data => data[filterKey])
    this.setState(prevState => ({ externalId, journeyType, leftTab }));
  }

  showHideAskedPopup = () => {
    let { showAskedPopup } = this.state;
    this.setState(prevState => ({ showAskedPopup: !showAskedPopup, selectJourney: null }));
  }

  goToEditSeason = async () => {
    const { selectJourney, journeyType, seasonId, selectedTab } = this.state;
    const { label } = this.state.leftTab[selectedTab];
    let seasonRoute = this.props.match.url;
    seasonRoute = seasonRoute.replace(`/view/${seasonId}`, '');
    let route = (selectJourney == "3") ? `${seasonRoute}/single/edit/${seasonId}` : (selectJourney == "2") ?
      `${seasonRoute}/quick/edit/${seasonId}` : `${seasonRoute}/${seasonId}`
    if (selectJourney && (selectJourney != journeyType)) {
      let url = `${Config.season.seasonProperties}/${seasonId}`;
      let response = await apiCalls(url, "PATCH", { season: { journeyType: selectJourney } }, this.props.match.url);
      if (response) {
        this.props.history.push({
          pathname: route,
          state: {
            selectedTab: selectedTab,
            tabLabel: label
          }
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
    const { continue_editing_single_landing_season_obj, continue_editing_quick_filing_season_obj,
      single_landing_to_quick_filing_season_obj, single_landing_to_main_movie_season_obj,
      quick_filing_to_main_movie_season_obj } = constantText;

    const data = (journeyType == 2) ? [continue_editing_quick_filing_season_obj, quick_filing_to_main_movie_season_obj] :
      [continue_editing_single_landing_season_obj, single_landing_to_quick_filing_season_obj,
        single_landing_to_main_movie_season_obj];
    return (
      <RadioButton name={"selectJourney"} value={selectJourney} labelText=""
        labelPlacement="end" data={data} onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    )
  }

  handleRoute = () => {
    let { journeyType, selectedTab, seasonId } = this.state;
    const { label } = this.state.leftTab[selectedTab];
    if (journeyType == "1") {
      let seasonRoute = this.props.match?.url;
      seasonRoute = seasonRoute?.replace(`view/${seasonId}`, seasonId);
      this.props.history?.push({
        pathname: seasonRoute,
        state: { selectedTab, tabLabel: label }
      });
    }
    else {
      this.showHideAskedPopup();
    }
  };

  goToSeason = route => {
    const { stateMode } = this.state;
    if (stateMode === 'list') {
      history.push({
        pathname: constantText.tvshow_list_route,
        state: {
          selectedContentType: tvShowConstants.seasonType,
          searchBtnText: constantText.tvShowsConstant.seasons,
          searchPlaceholderText: constantText.tvShowsConstant.searchPlaceholderSeasons,
        }
      })
    }
    else if (stateMode === 'nestedlist') {
      history.push({
        pathname: constantText.tvshow_list_route,
        state: {
          selectedContentType: tvShowConstants.tvshowType,
          searchBtnText: constantText.tvShowsConstant.tvShow,
          searchPlaceholderText: constantText.tvShowsConstant.searchPlaceholderTvShow,
        }
      })
    }
    else {
      history.push(route);
    }
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
    const { leftTab, selectedTab, showAskedPopup, journeyType, seasonState, externalId } = this.state;
    const { match, path } = this.props;
    let url = "/edit";
    url = path?.includes("/tvshow/view") ? "/view" : path?.includes("/tvshow/quick/edit") ? "/quick/edit" :
      path?.includes("/tvshow/single/edit/") ? "/single/edit" : url;

    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          className=""
          links={breadCrumbs.links(url, match?.params?.id)}
          typography={breadCrumbs.typography('view')}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              data-test={"goToSeason"}
              onClick={() => this.goToSeason(`/tvshow${url}/${match?.params?.id}/season`)} >
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.tv_show_season_text.view}</span>
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
        <CommonModel state={showAskedPopup} handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={"Update Content"} showIcon={false} showDes={false} Form={this.getAskedEditUI()}
          btn1Text={constantText.yes_text} btn1Action={this.goToEditSeason}
          btn2Text={constantText.no_text} btn2Action={this.showHideAskedPopup}
        />
      </div>
    );
  }
}

export default ViewSeason;
