import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Components
import ViewContentProperties from "../ContentProperties/ViewContentProperties";
import ViewCastNCrew from "../CastAndCrew/ViewCastAndCrew";
import ViewLicenceModule from "../LicenseModule/ViewLicenseModule";
import Images from "../Images/Images";
import ViewSeoDetails from "../SeoDetails/ViewSeoDetails";
import MapContent from "../MapContent/MapContent";
import CheckList from '../Checklist/Checklist';

//Common Component
import RadioButton from "../../Common/RadioButton/RadioButton";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";
import { CommonModel } from "../../Common/Model/CommonModel";
import { showSuccessErrorMsg } from '../../../../src/_actions/alertMessages.action';

//Helper Files
import { history } from "../../../_helpers/history";
import { getLocalData } from "../../../_helpers/util";
import { permissionObj } from "../../../_helpers/permission";
import Config from '../../../Config/config';
import { apiCalls } from "../../../_services/common.service";

//Constant files
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

class ViewTvShow extends Component {
  constructor(props) {
    super(props);
    const journeyType = props.location?.state?.journeyType || null;
    let filterKey= "main";
    if(journeyType) {
      filterKey= (journeyType== "3")? "singleLanding": (journeyType== "2")? "quickFiling": "main";
    }
    this.state = {
      tvShowState: filterKey,
      userData: getLocalData("userData"), language: "EN", externalId: null,
      selectedTab: 0, tvShowId: null, journeyType, selectJourney: null,
      stage: null, jsonData: {},
      leftTab: constantText.tvShow_left_tab_options_arr?.filter(data => (data[filterKey])),
      showAskedPopup: false,
      quickLinks: quickLinks?.map((data) => ({ ...data, permissionName: "canView" }))
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map(item => item.isDone = false);
    if (match?.params?.id) {
      this.setState(
        (prevState) => ({ tvShowId: match?.params?.id }),()=> this.handlePermission());
    } else {
      history.push("/tvshow");
    }
  };

  getJsonData = async () => {
    const type = 'tvShow_StandardJourney_Structure';
    const response = await apiCalls(`${Config.metaDataUrl}/${type}`, 'GET', {}, null, true, null, this.autoSaveError);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
    }
  }

  getTvShowStatus = async () => {
    let { userData, leftTab, tvShowId } = this.state;
    const response = await apiCalls(`${Config.tvShow.action}/${tvShowId}`, "GET", null, null, false);
    if (response && response.length > 0) {
      let resData = response.filter((elem) => leftTab.find(( {sectionName} ) => elem.sectionName === sectionName));
      let shallowArr = [...leftTab];
      resData?.map(data => {
        const { sectionName, isDone, isLocked, lockedByUser } = data;
        const { id, firstName, lastName } = lockedByUser || {};
        const index = shallowArr?.findIndex(obj => (obj?.sectionName == sectionName));
        shallowArr[index] = {
          ...shallowArr[index],
          isDone,
          isLocked: (isLocked && (id != userData?.userID)) ? true : false,
          lockedBy: isLocked ? `${firstName} ${lastName}` : ""
        }
      });
      const notDone = resData?.filter((data) => !data.isDone);
      const checklistObj = shallowArr.find(item => item.permissionSubKey === 'checklistModule');
      checklistObj.isDone = (notDone?.length === 0 && (resData.length >= (shallowArr.length - 1))) ? true : false;
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
    if(this.props?.location?.state?.selectedTab){
      selectedTab = this.props?.location?.state?.selectedTab;
    }
    this.setState(prevState => ({ leftTab: shallowArr, selectedTab }), () => {
      this.getTvShowStatus();
      this.getJsonData();
    });
  };

  handleTab = (event, selectedTab) => this.setState({ selectedTab }, ()=> this.getTvShowStatus());

  handleRoute = (route) => {
    let { journeyType, selectedTab } = this.state;
    const {label} = this.state.leftTab[selectedTab];
    if (journeyType == "1") {
      this.props.history.push({
        pathname: route,
        state: {
          selectedTab: selectedTab,
          tabLabel: label }
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

  goToEditTvShow = async () => {
    const { selectJourney, tvShowId, selectedTab } = this.state;
    const {label} = this.state.leftTab[selectedTab]
    if (selectJourney) {
      let updatedData = { "journeyType": selectJourney };
      let url = `${Config.tvShow.journeyType}/${tvShowId}`;
      let response = await apiCalls(url, "PATCH", updatedData, `/tvshow/view/${tvShowId}`, false);
      if (response) {
        let route = (selectJourney == "3") ? "/tvshow/single" : (selectJourney == "2") ? "/tvshow/quick" : "/tvshow"
        this.props.history.push({
          pathname: `${route}/edit/${tvShowId}`,
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
    this.props.history?.push({ pathname: this.props.match?.url + data.path, state : {stage, journeyType}});
  };

  setStage = (stage, journeyTypeFromProperties) => {
    let { journeyType, leftTab } = this.state;
    if (!journeyType && journeyTypeFromProperties) {
      journeyType = journeyTypeFromProperties.toString();
      const filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
      leftTab = leftTab?.filter(data => (data[filterKey]));
    }
    this.setState({ stage, journeyType, leftTab });
  };

  getExternalId=(externalId)=>{
    this.setState({externalId})
  }

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getTvShowStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  getTvShowTabsComp = () => {
    let {jsonData, leftTab, selectedTab, tvShowId, language, stage, externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && jsonData.ContentProperties && (
          <ViewContentProperties {...this.props} language={language} tvShowId={tvShowId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties}
          />
        )}
        {(selectedTab == 1 && tvShowId && jsonData.CastNCrew) && (
          <ViewCastNCrew tvShowId={tvShowId} language={language} stage={stage} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} handleRoute={this.handleRoute} jsonData={jsonData.CastNCrew}
          />
        )}
        {selectedTab == 2 && jsonData.License && (
          <ViewLicenceModule {...this.props} language={language} stage={stage} contentId={tvShowId}
            handleRoute={this.handleRoute} currentTabData={leftTab[selectedTab]} selectedTab={selectedTab}
            setStage={this.setStage} jsonData={jsonData.License}
          />
        )}
        {selectedTab == 3 && jsonData.Images && (
          <Images {...this.props} isViewMode={true} tvShowId={tvShowId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images} />
        )}
        {selectedTab == 4 && jsonData.Seo && (
          <ViewSeoDetails contentId={tvShowId} selectedTab={selectedTab} stage={stage} handleRoute={this.handleRoute}
            currentTabData={leftTab[selectedTab]} selectedTab={selectedTab} jsonData={jsonData.Seo}
          />
        )}
        {selectedTab == 5 && jsonData.MapContent && (
          <MapContent isViewMode={true} contentId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.MapContent}
          />
        )}
        {selectedTab == 6 && (
          <CheckList tvShowId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  getQuickFilingTabsComp = () => {
    let {jsonData, leftTab, selectedTab, tvShowId, language, stage,externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && jsonData.ContentProperties && (
          <ViewContentProperties {...this.props} language={language} tvShowId={tvShowId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties}
          />
        )}
        {selectedTab == 1 && (
          <ViewLicenceModule {...this.props} language={language} stage={stage} contentId={tvShowId}
            handleRoute={this.handleRoute} currentTabData={leftTab[selectedTab]} selectedTab={selectedTab}
            setStage={this.setStage} jsonData={jsonData.License}
          />
        )}
        {selectedTab == 2 && jsonData.Images && (
          <Images isViewMode={true} tvShowId={tvShowId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images} />
        )}
        {selectedTab == 3 && jsonData.Seo && (
          <ViewSeoDetails contentId={tvShowId} selectedTab={selectedTab} stage={stage} handleRoute={this.handleRoute}
            currentTabData={leftTab[selectedTab]} selectedTab={selectedTab} jsonData={jsonData.Seo}
          />
        )}
        {selectedTab == 4 && jsonData.MapContent && (
          <MapContent isViewMode={true} contentId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.MapContent}
          />
        )}
        {selectedTab == 5 && (
          <CheckList state="quick-filing" tvShowId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute}
            autoSaveError={this.autoSaveError}
          />
        )}
      </div>
    );
  };

  getSinglePageLandingTabsComp = () => {
    let {jsonData, leftTab, selectedTab, tvShowId, language, stage,externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && tvShowId && jsonData.ContentProperties && (
          <ViewContentProperties {...this.props} language={language} tvShowId={tvShowId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties}
          />
        )}
        {(selectedTab == 1 && tvShowId && jsonData.CastNCrew) && (
          <ViewCastNCrew tvShowId={tvShowId} language={language} stage={stage} selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]} handleRoute={this.handleRoute} jsonData={jsonData.CastNCrew}
          />
        )}
        {selectedTab == 2 && jsonData.License && (
          <ViewLicenceModule {...this.props} language={language} stage={stage} contentId={tvShowId}
            handleRoute={this.handleRoute } setStage={this.setStage} jsonData={jsonData.License}
          />
        )}
        {selectedTab == 3 && jsonData.Images && (
          <Images isViewMode={true} tvShowId={tvShowId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images} />
        )}
        {selectedTab == 4 && jsonData.Seo && (
          <ViewSeoDetails contentId={tvShowId} selectedTab={selectedTab} stage={stage} handleRoute={this.handleRoute}
            currentTabData={leftTab[selectedTab]} selectedTab={selectedTab} jsonData={jsonData.Seo}
          />
        )}
        {selectedTab == 5 && jsonData.MapContent && (
          <MapContent isViewMode={true} contentId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
            handleRoute={this.handleRoute} jsonData={jsonData.MapContent}
          />
        )}
        {selectedTab == 6 && (
          <CheckList state="singleLanding" tvShowId={tvShowId} language={language} selectedTab={selectedTab} stage={stage}
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
    const { continue_editing_single_landing_show_obj, continue_editing_quick_filing_show_obj,
      single_landing_to_quick_filing_show_obj, single_landing_to_main_movie_show_obj,
      quick_filing_to_main_movie_show_obj } = constantText;

    const data = (journeyType == 2) ? [continue_editing_quick_filing_show_obj, quick_filing_to_main_movie_show_obj] :
      [continue_editing_single_landing_show_obj, single_landing_to_quick_filing_show_obj,
        single_landing_to_main_movie_show_obj];
    return (
      <RadioButton name={"selectJourney"} value={selectJourney} labelText=""
        labelPlacement="end" data={data} onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    )
  }

  goToTvShow= route=> {
    history.push(route);
  }

  quickLinksEnable = (links) => {
    links.map(item => item.enable = (item.key && permissionObj?.['tvShows'] && permissionObj?.['tvShows']?.[item.key] && permissionObj?.['tvShows']?.[item.key]) ? permissionObj?.['tvShows']?.[item.key]?.canUpdate() : true)
    return links;
  }

  getOptions = () => {
    let {tvShowState} = this.state;
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
    let { leftTab, selectedTab, showAskedPopup, journeyType, tvShowState, externalId } = this.state;
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links}
          typography={breadCrumbs.typography("view")}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
            data-test={'goToTvShow'}
            onClick={() => this.goToTvShow("/tvshow")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.tv_show_text.view}</span>
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
              {(journeyType === '3')? this.getSinglePageLandingTabsComp(): (journeyType == '2')?
                this.getQuickFilingTabsComp(): this.getTvShowTabsComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                showTips={(tvShowState && ((tvShowState == "quickFiling") || (tvShowState == "singleLanding"))) ? true : false}
                options={this.getOptions()}
                clicked={this.linksClickHandler}
                customText={"You can convert this page to Main TV Show Page on Editing."} />
            </div>
          </div>
        </div>
        <CommonModel state={showAskedPopup} handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={"Update Content"} showIcon={false} showDes={false} Form={this.getAskedEditUI()}
          btn1Text={constantText.yes_text} btn1Action={this.goToEditTvShow}
          btn2Text={constantText.no_text} btn2Action={this.showHideAskedPopup}
        />
      </div>
    );
  }
}

export default ViewTvShow;
