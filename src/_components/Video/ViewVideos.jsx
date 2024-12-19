import React, { Component } from "react";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Components
import ViewContentProperties from './ContentProperties/ViewContentProperties';
import ViewCastAndCrew from "./CastAndCrew/ViewCastAndCrew";
import ViewLicense from "./LicenseModule/ViewLicenseModule";
import ViewVideo from "./CreateEditVideo/ViewVideo";
import Images from "./Images/Images";
import ViewSeo from "./SeoComponent/viewSeoDetails";
import MapContent from "./MapContent/MapContent";
import Checklist from "./CheckList/CheckList";

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
import Config from "../../Config/config";
import { apiCalls } from "../../_services/common.service";

//Constant files
import { breadCrumbs, quickLinks } from "./breadCrumbs";
import { constantText } from "../../_helpers/constants.text";

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";

//css
import '../../../public/css/Common/CreateTabHead.css';

class ViewVideos extends Component {
  constructor(props) {
    super(props);
    const journeyType = props.location?.state?.journeyType || null;
    let filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "properties";
    this.state = {
      videoState: filterKey,
      userData: getLocalData("userData"),
      selectedTab: 0, videoId: null, jsonData: {},
      journeyType, selectJourney: null, language: "EN",
      stage: { title: "Draft" },
      leftTab: constantText.video_left_tab_options_arr?.filter(
        (data) => data[filterKey]
      ),
      showAskedPopup: false,
      externalId: null,
      quickLinks: quickLinks?.map((data) => ({
        ...data,
        permissionName: "canView",
      })),
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map(item => item.isDone = false);
    if (match?.params?.id) {
      this.setState(
        (prevState) => ({ videoId: match.params.id }),
        () => this.handlePermission()
      );
    } else {
      history.push("/video");
    }
  };

  getJsonData = async () => {
    const response = await apiCalls(`${Config.metaDataUrl}/video_frontend_structure`, 'GET', {}, this.props.match.path, true);
    if (response) {
      const { data } = response;
      this.setState(prevState => ({ jsonData: data || {} }));
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
      const checkIsDone = shallowArr.find(
        (item) =>
          item.permissionSubKey !== "checklistModule" && item.isDone === false
      );
      if (!checkIsDone) {
        shallowArr.forEach((item) => {
          if (item.permissionSubKey === "checklistModule") {
            item.isDone = true;
          }
        });
      }
      this.setState((prevState) => ({ leftTab: shallowArr }));
    }
  };

  handlePermission = () => {
    let { leftTab } = this.state;
    let shallowArr = [...leftTab];
    shallowArr = shallowArr?.map((data) => ({
      ...data,
      permissionName: "canView",
    }));
    let selectedTab = shallowArr?.findIndex(
      (data) =>
        !data?.permissionKey ||
        (data?.permissionSubKey
          ? permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[
            data.permissionName
          ]()
          : permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    let newState = {};
    newState.leftTab = shallowArr;
    if (this.props?.location?.state?.selectedTab) {
      newState.selectedTab = this.props?.location?.state?.selectedTab;
    } else {
      newState.selectedTab = selectedTab;
    }
    this.setState(prevState => newState, () => {
      this.getJsonData();
      this.getVideoStatus();
    });
  };

  handleTab = (event, selectedTab) => this.setState({ selectedTab });

  handleRoute = (route) => {
    let { journeyType, selectedTab } = this.state;
    const { label } = this.state.leftTab[selectedTab];
    if (journeyType == "1") {
      this.props.history.push({
        pathname: route,
        state: {
          selectedTab: selectedTab,
          tabLabel: label,
        },
      });
    } else {
      this.showHideAskedPopup();
    }
  };

  showHideAskedPopup = () => {
    let { showAskedPopup } = this.state;
    this.setState((prevState) => ({
      showAskedPopup: !showAskedPopup,
      selectJourney: null,
    }));
  };

  goToEditVideo = async () => {
    const { selectJourney, videoId, selectedTab } = this.state;
    const { label } = this.state.leftTab[selectedTab];
    if (selectJourney) {
      let response;
      if (selectJourney == '1') {
        let updatedData = { video: { journeyType: selectJourney } };
        response = await apiCalls(`${Config.videoProperties}/${videoId}`, "PATCH", updatedData, null, false);
      } else {
        response = true;
      }
      if (response) {
        let route = selectJourney == "2" ? "/video/quick" : "/video";
        this.props.history.push({
          pathname: `${route}/edit/${videoId}`,
          state: {
            selectedTab: selectedTab,
            tabLabel: label,
          },
        });
      }
    }
    this.showHideAskedPopup();
  };

  linksClickHandler = (data) => {
    const { stage, journeyType } = this.state;
    this.props.history?.push({
      pathname: this.props.match.url + data.path,
      state: { stage, journeyType },
    });
  };

  setStage = (stage, journeyType) => {
    this.setState({ stage, journeyType });
  };

  getExternalId = (externalId) => {
    this.setState({ externalId });
  };

  getVideoTabsComp = () => {
    let { jsonData, leftTab, selectedTab, videoId, language, stage, externalId } = this.state;
    return (
      <div className="mid-area">
        {(selectedTab == 0 && videoId && jsonData.ContentProperties) && (
          <ViewContentProperties {...this.props} language={language} videoId={videoId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties || {}}
          />
        )}
        {(selectedTab == 1 && videoId && jsonData.CastNCrew) && (
          <ViewCastAndCrew videoId={videoId} language={language} stage={stage} selectedTab={selectedTab}
            handleRoute={this.handleRoute} jsonData={jsonData.CastNCrew || {}}
          />
        )}
        {(selectedTab == 2 && videoId && jsonData.Video) && (
          <ViewVideo {...this.props} language={language} stage={stage} contentId={videoId} handleRoute={this.handleRoute}
            jsonData={jsonData.Video || []} />
        )}
        {(selectedTab == 3 && videoId && jsonData.License) && (
          <ViewLicense isViewMode={true} videoId={videoId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.License || []}
          />
        )}
        {(selectedTab == 4 && videoId && jsonData.Images) && (
          <Images isViewMode={true} videoId={videoId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images || {}}
          />
        )}
        {(selectedTab == 5 && videoId && jsonData.Seo) && (
          <ViewSeo isViewMode={true} videoId={videoId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Seo || []}
          />
        )}
        {(selectedTab == 6 && videoId && jsonData.MapContent) && (
          <MapContent isViewMode={true} contentId={videoId} language={language} selectedTab={selectedTab}
            stage={stage} handleRoute={this.handleRoute} jsonData={jsonData.MapContent || []}
          />
        )}
        {(selectedTab == 7 && videoId) && (
          <Checklist contentId={videoId} language={language} selectedTab={selectedTab} unLockedSession={this.unLockedSession}
            currentTabData={leftTab[selectedTab]}
          />
        )}
      </div>
    );
  };

  getQuickFilingTabsComp = () => {
    let { jsonData, leftTab, selectedTab, videoId, language, stage, externalId } = this.state;

    return (
      <div className="mid-area">
        {(selectedTab == 0 && videoId && jsonData.ContentProperties) && (
          <ViewContentProperties {...this.props} language={language} videoId={videoId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute} getExternalId={this.getExternalId} jsonData={jsonData.ContentProperties || {}}
          />
        )}
        {(selectedTab == 1 && videoId && jsonData.Video) && (
          <ViewVideo {...this.props} language={language} stage={stage} contentId={videoId}
            handleRoute={this.handleRoute} jsonData={jsonData.Video || []}
          />
        )}
        {(selectedTab == 2 && videoId && jsonData.License) && (
          <ViewLicense isViewMode={true} videoId={videoId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.License || []}
          />
        )}
        {(selectedTab == 3 && videoId && jsonData.Images) && (
          <Images isViewMode={true} videoId={videoId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Images || {}}
          />
        )}
        {(selectedTab == 4 && videoId && jsonData.Seo) && (
          <ViewSeo isViewMode={true} videoId={videoId} stage={stage} handleRoute={this.handleRoute}
            externalId={externalId} jsonData={jsonData.Seo || []}
          />
        )}
        {(selectedTab == 5 && videoId && jsonData.MapContent) && (
          <MapContent isViewMode={true} contentId={videoId} language={language} selectedTab={selectedTab}
            stage={stage} handleRoute={this.handleRoute} jsonData={jsonData.MapContent || []}
          />
        )}
        {(selectedTab == 6 && videoId) && (
          <Checklist contentId={videoId} language={language} state="quick-filing" selectedTab={selectedTab}
            unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
          />
        )}
      </div>
    );
  };

  handleRadioButton = (event) => {
    let { name, value } = event.target;
    this.setState((prevState) => ({ [name]: value }));
  };

  getAskedEditUI = () => {
    const { selectJourney } = this.state;
    const {
      continue_editing_quick_filing_video_obj,
      quick_filing_to_main_video_obj,
    } = constantText;

    const data = [
      continue_editing_quick_filing_video_obj,
      quick_filing_to_main_video_obj,
    ];

    return (
      <RadioButton
        name={"selectJourney"}
        value={selectJourney}
        labelText=""
        labelPlacement="end"
        data={data}
        onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    );
  };

  goToMovie = (route) => {
    history.push(route);
  };

  render() {
    let {
      leftTab,
      selectedTab,
      quickLinks,
      showAskedPopup,
      journeyType, externalId
    } = this.state;
    let tabsRenderer = null;
    if (journeyType == "2") {
      tabsRenderer = this.getQuickFilingTabsComp();
    } else {
      tabsRenderer = this.getVideoTabsComp();
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
            <span onClick={() => this.goToMovie("/video")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.video_view_text}</span>
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
              <QuickLinks
                className=""
                header_text={constantText.quick_links_text}
                options={quickLinks}
                clicked={this.linksClickHandler}
              />
            </div>
          </div>
        </div>
        <CommonModel
          state={showAskedPopup}
          handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={"Update Content"}
          showIcon={false}
          showDes={false}
          Form={this.getAskedEditUI()}
          btn1Text={constantText.yes_text}
          btn1Action={this.goToEditVideo}
          btn2Text={constantText.no_text}
          btn2Action={this.showHideAskedPopup}
        />
      </div>
    );
  }
}

export default ViewVideos;
