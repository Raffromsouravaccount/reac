import React, { Component } from "react";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Components
import ViewContentProperties from "./ContentProperties/ViewContentProperties";
import ViewCastNCrew from "./CastNCrew/ViewCastNCrew";
import ViewVideo from "./../CreateMovie/CreateEditVideo/ViewVideo";
import ViewLicenceModule from "./LicenseModule/ViewLicenceModule";
import ViewSeoDetails from "./SeoDetails/ViewSeoDetails";
import Images from "./Images/Images";
import MapContent from "./MapContent/MapContent";
import CheckList from "./CheckList/CheckList";

//Common Component
import RadioButton from "../Common/RadioButton/RadioButton";
import LeftTab from "../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../Common/BreadCrumbs/BreadCrumbs";
import QuickLinks from "../Common/QuickLinks/QuickLinks";
import { CommonModel } from "../Common/Model/CommonModel";

//Helper Files
import { history } from "../../_helpers/history";
import { getLocalData } from "../../_helpers/util";
import { permissionObj } from "../../_helpers/permission";
import Config from '../../Config/config';
import { apiCalls } from "../../_services/common.service";

//Constant files
import { breadCrumbs, quickLinks, quickLinksForQuickFiling } from "./breadCrumbs";
import { constantText } from "../../_helpers/constants.text";
import { showSuccessErrorMsg } from "../../_actions/alertMessages.action";

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";

//css
import "../../../public/css/Common/CreateTabHead.css";

class ViewMovie extends Component {
  constructor(props) {
    super(props);
    const journeyType = props.location?.state?.journeyType || null;
    let filterKey= (journeyType== "3")? "singleLanding": (journeyType== "2")? "quickFiling": "properties";
    this.state = {
      movieState: filterKey,
      userData: getLocalData("userData"),
      selectedTab: 0, movieId: null, journeyType, selectJourney: null,
      language: "EN", jsonData: {},
      stage: { title: null },
      leftTab: constantText.movie_left_tab_options_arr?.filter(data => (data[filterKey])),
      showAskedPopup: false, externalId:null,
      quickLinks: quickLinks?.map((data) => ({ ...data, permissionName: "canView" }))
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let {leftTab} = this.state;
    leftTab.map(item => item.isDone = false);
    if (match?.params?.id) {
      this.setState(
        (prevState) => ({ movieId: match.params.id }),()=> this.handlePermission());
    } else {
      history.push("/movies");
    }
  };

  getJsonData = async () => {
    const response = await apiCalls(`${Config.metaDataUrl}/movie_frontend_structure`, 'GET', {}, this.props.match.path, true);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getMovieStatus = async () => {
    let { userData, leftTab, movieId } = this.state;
    const response = await apiCalls(`${Config.movieAction}/${movieId}`, "GET", null, null, false);
    if (response && response.length > 0) {
      let shallowArr = [...leftTab];
      response?.map(data => {
        const { sectionName, isDone, isLocked, lockedByUser } = data;
        const { id, firstName, lastName } = lockedByUser || {};
        const index = shallowArr?.findIndex(obj => (obj?.permissionSubKey == sectionName));
        shallowArr[index] = {
          ...shallowArr[index],
          isDone,
          isLocked: (isLocked && (id != userData?.userID)) ? true : false,
          lockedBy: isLocked ? `${firstName} ${lastName}` : ""
        }
      });
      const checkIsDone = shallowArr.find(item => (item.permissionSubKey !== 'checklistModule' && item.isDone === false));
      if (!checkIsDone) {
        shallowArr.forEach(item => {
          if(item.permissionSubKey === 'checklistModule'){
            item.isDone = true;
          }
        })
      }
      this.setState(prevState => ({ leftTab: shallowArr }));
    }
  }

  handlePermission = () => {
    let { leftTab } = this.state;
    let shallowArr= [...leftTab];
    shallowArr = shallowArr?.map((data) => ({ ...data, permissionName: "canView" }));
    let selectedTab = shallowArr?.findIndex(
      (data) => !data?.permissionKey || (data?.permissionSubKey?
        permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]():
        permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    let newState = {};
    newState.leftTab = shallowArr;
    if(this.props?.location?.state?.selectedTab){
      newState.selectedTab = this.props?.location?.state?.selectedTab;
    }
    else {
      newState.selectedTab = selectedTab;
    }
    this.setState(prevState => (newState), ()=> {
      this.getJsonData();
      this.getMovieStatus();
    });
  };

  handleTab = (event, selectedTab) => this.setState({ selectedTab });

  handleRoute = (route) => {
    let { journeyType, selectedTab } = this.state;
    const {label} = this.state.leftTab[selectedTab]
    if (journeyType == "1") {
      this.props?.history?.push({
        pathname: route,
        state: {
          selectedTab: selectedTab,
          tabLabel: label  }
      });
    }
    else {
      this.showHideAskedPopup();
    }
  };

  showHideAskedPopup = () => {
    let { showAskedPopup } = this.state;
    this.setState(prevState => ({ showAskedPopup: !showAskedPopup, selectJourney: null }));
  }

  goToEditMovie = async () => {
    const { selectJourney, movieId, selectedTab } = this.state;
    const {label} = this.state.leftTab[selectedTab]
    if (selectJourney) {
      let updatedData = { "journeyType": selectJourney };
      let url = `${Config.movieJourneyType}/${movieId}`;
      let response = await apiCalls(url, "PATCH", updatedData, null, false);
      if (response) {
        let route = (selectJourney == "3") ? "/single/movie" : (selectJourney == "2") ? "/quick/movie" : "/movie"
        this.props.history.push({
          pathname: `${route}/edit/${movieId}`,
          state: {
            selectedTab: selectedTab,
            tabLabel: label
          }
        });
      }
    }
    this.showHideAskedPopup();
  }

  linksClickHandler = (data) => {
    const { stage, journeyType } = this.state;
    this.props?.history?.push({ pathname: this.props.match.url + data.path,  state : {stage, journeyType} });
  };

  setStage = (stage, journeyType) => {
    this.setState({ stage, journeyType });
  };

  getExternalId=(externalId)=>{
    this.setState({externalId})
  }

  autoSaveError = error => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getMovieStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  }

  getMovieTabsComp = () => {
    let { jsonData, leftTab, selectedTab, movieId, language, stage,externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && movieId && jsonData.ContentProperties) && (
          <ViewContentProperties {...this.props} language={language} movieId={movieId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} jsonData={jsonData.ContentProperties || {}} getExternalId={this.getExternalId}
          />
        )}
        {(selectedTab == 1 && movieId && jsonData.CastNCrew) && (
          <ViewCastNCrew movieId={movieId} language={language} stage={stage} selectedTab={selectedTab}
            handleRoute={this.handleRoute} jsonData={jsonData.CastNCrew || {}}
          />
        )}
        {(selectedTab == 2 && movieId && jsonData.Video) && (
          <ViewVideo {...this.props} language={language} stage={stage} contentId={movieId}
            handleRoute={this.handleRoute} jsonData={jsonData.Video || []}
          />
        )}
        {(selectedTab == 3 && movieId && jsonData.License) && (
          <ViewLicenceModule {...this.props} language={language} stage={stage} contentId={movieId}
            handleRoute={this.handleRoute} jsonData={jsonData.License || []}
          />
        )}
        {(selectedTab == 4 && externalId && movieId && jsonData.Images) && (
          <Images isViewMode={true} contentId={movieId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images || {}} />
        )}
        {(selectedTab == 5 && movieId && jsonData.Seo) && (
          <ViewSeoDetails contentId={movieId} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.Seo || []}
          />
        )}
        {(selectedTab == 6 && movieId && jsonData.MapContent) && (
          <MapContent isViewMode={true} contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.MapContent || []}
          />
        )}
        {selectedTab == 7 && (
          <CheckList contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  getQuickFilingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, movieId, language, stage,externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && movieId && jsonData.ContentProperties) && (
          <ViewContentProperties {...this.props} language={language} movieId={movieId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties || {}}
          />
        )}
        {(selectedTab == 1 && movieId && jsonData.Video) && (
          <ViewVideo {...this.props} language={language} stage={stage} contentId={movieId}
            handleRoute={this.handleRoute} jsonData={jsonData.Video || []}
          />
        )}
        {(selectedTab == 2 && movieId && jsonData.License) && (
          <ViewLicenceModule {...this.props} language={language} stage={stage} contentId={movieId}
            handleRoute={this.handleRoute} jsonData={jsonData.License || []}
          />
        )}
        {(selectedTab == 3 && externalId && movieId && jsonData.Images) && (
          <Images isViewMode={true} contentId={movieId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images || {}} />
        )}
        {(selectedTab == 4 && movieId && jsonData.Seo) && (
          <ViewSeoDetails contentId={movieId} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.Seo || []}
          />
        )}
        {(selectedTab == 5 && movieId && jsonData.MapContent) && (
          <MapContent isViewMode={true} contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.MapContent || []}
          />
        )}
        {selectedTab == 6 && (
          <CheckList state="quick-filing" contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  getSinglePageLandingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, movieId, language, stage,externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && movieId && jsonData.ContentProperties) && (
          <ViewContentProperties {...this.props} language={language} movieId={movieId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties || {}}
          />
        )}
        {(selectedTab == 1 && movieId && jsonData.License) && (
          <ViewLicenceModule {...this.props} language={language} stage={stage} contentId={movieId}
            handleRoute={this.handleRoute} jsonData={jsonData.License || []}
          />
        )}
        {(selectedTab == 2 && externalId && movieId && jsonData.Images) && (
          <Images isViewMode={true} contentId={movieId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images || {}} />
        )}
        {(selectedTab == 3 && movieId && jsonData.Seo) && (
          <ViewSeoDetails contentId={movieId} selectedTab={selectedTab} stage={stage} handleRoute={this.handleRoute}
            jsonData={jsonData.Seo || []} />
        )}
        {(selectedTab == 4 && movieId && jsonData.MapContent) && (
          <MapContent isViewMode={true} contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.MapContent || []}
          />
        )}
        {selectedTab == 5 && (
          <CheckList state="singleLanding" contentId={movieId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  handleRadioButton = event => {
    let { name, value } = event.target;
    this.setState(prevState => ({ [name]: value }));
  }

  getAskedEditUI = () => {
    const { journeyType, selectJourney } = this.state;
    const { continue_editing_single_landing_obj, continue_editing_quick_filing_obj,
      single_landing_to_quick_filing_obj, single_landing_to_main_movie_obj,
      quick_filing_to_main_movie_obj } = constantText;

    const data = (journeyType == 2) ? [continue_editing_quick_filing_obj, quick_filing_to_main_movie_obj] :
      [continue_editing_single_landing_obj, single_landing_to_quick_filing_obj, single_landing_to_main_movie_obj];
    return (
      <RadioButton name={"selectJourney"} value={selectJourney} labelText=""
        labelPlacement="end" data={data} onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    )
  }

  goToMovie= route=> {
    history.push(route);
  }

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (item.key && permissionObj?.['movies'] && permissionObj?.['movies']?.[item.key] && permissionObj?.['movies']?.[item.key]) ? permissionObj?.['movies']?.[item.key]?.canUpdate() : true)
    return links;
  }

  getOptions = () => {
    let {movieState} = this.state;
    switch(movieState) {
      case 'quickFiling':
        return quickLinksForQuickFiling;
      case 'singleLanding':
       return this.quickLinksEnable(quickLinksForQuickFiling);
      case 'properties':
       return this.quickLinksEnable(quickLinks);
      default:
       return this.quickLinksEnable(quickLinks);
    }
  }

  render() {
    let { leftTab, selectedTab, showAskedPopup, journeyType, movieState, externalId } = this.state;
    let tabsRenderer = null
    if(journeyType === '3') {
      tabsRenderer = this.getSinglePageLandingTabsComp()
    } else if (journeyType == '2') {
      tabsRenderer = this.getQuickFilingTabsComp()
    } else {
      tabsRenderer = this.getMovieTabsComp()
    }
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links}
          typography={breadCrumbs.typography("view")}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span data-test="goToMovieBtn" onClick={() => this.goToMovie("/movie")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.movie_view_text}</span>
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
              {tabsRenderer}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
            <QuickLinks className="" header_text={constantText.quick_links_text}
                showTips={(movieState && ((movieState == "quickFiling") || (movieState == "singleLanding"))) ? true : false }
                options={this.getOptions()}
                clicked={this.linksClickHandler} />
            </div>
          </div>
        </div>
        <CommonModel state={showAskedPopup} handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={"Update Content"} showIcon={false} showDes={false} Form={this.getAskedEditUI()}
          btn1Text={constantText.yes_text} btn1Action={this.goToEditMovie}
          btn2Text={constantText.no_text} btn2Action={this.showHideAskedPopup}
        />
      </div>
    );
  }
}

export default ViewMovie;
