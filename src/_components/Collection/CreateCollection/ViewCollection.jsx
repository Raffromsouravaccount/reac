import React, { Component } from "react";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Steps Components
import ViewContentProperties from "./ContentProperties/ViewContentProperties";
import CollectionAssignAssets from './AssignAssets/AssignAssets';
import ViewSeo from './Seo/ViewSeo';
import ViewLicenceModule from './LicenseModule/ViewLicenseModule';
import Images from './Images/Images';
import CheckList from "./CheckList/CheckList";

//Services
import { apiCalls } from "../../../_services/common.service";

//Common Component
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";

//Helper Files
import Config from "../../../Config/config";
import { history } from "../../../_helpers/history";
import { getLocalData } from "../../../_helpers/util";
import { permissionObj } from "../../../_helpers/permission";

//Constant files
import { breadCrumbs, quickLinks } from "./breadCrumbs";
import { constantText } from "../../../_helpers/constants.text";

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";
 
//css
import "../../../../public/css/Common/CreateTabHead.css";

class ViewMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: getLocalData("userData"),
      selectedTab: 0, collectionId: null, externalId: null,
      language: "EN", stage: null,
      leftTab: constantText.collection_left_tab_options_arr,
      quickLinks: quickLinks?.map((data) => ({ ...data, permissionName: "canView" }))
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    if (match?.params?.id) {
      this.setState((prevState) => ({ collectionId: match.params.id }), () => this.handlePermission());
    } else {
      history.push("/collections");
    }
  };

  getCollectionStatus = async () => {
    let { userData, leftTab, collectionId } = this.state;
    const response = await apiCalls(`${Config.collectionAction}/${collectionId}`, "GET", null, null, false);
    if (response && response.length > 0) {
      let shallowArr = [...leftTab];
      response?.map(data => {
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
    let shallowArr = [...leftTab];
    shallowArr = shallowArr?.map((data) => ({ ...data, permissionName: "canView" }));
    let selectedTab = shallowArr?.findIndex(
      (data) => !data?.permissionKey || (data?.permissionSubKey ?
        permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
        permissionObj?.[data?.permissionKey]?.[data.permissionName]())
    );
    this.setState(prevState => ({ leftTab: shallowArr, selectedTab }), () => this.getCollectionStatus());
  };

  setStage = stage => {
    this.setState(prevState => ({ stage }));
  }

  handleTab = (event, selectedTab) => this.setState({ selectedTab });

  handleCollectionRoute = (route) => {
    history.push(route);
  };

  linksClickHandler = (data) => {
    this.props?.history?.push({ pathname: this.props.match.url + data.path });
  };

  getExternalId = (externalId) => {
    this.setState({ externalId })
  }

  handleRoute = (route) => {
    let { selectedTab } = this.state;
    this.props?.history?.push({
      pathname: route,
      state: { selectedTab: selectedTab }
    });
  }

  getCollectionTabsComp = () => {
    let { leftTab, selectedTab, collectionId, language, stage, externalId } = this.state;
    return (
      <div className="mid-area">
        {selectedTab == 0 && collectionId && (
          <ViewContentProperties {...this.props} language={language} collectionId={collectionId} stage={stage}
            selectedTab={selectedTab} currentTabData={leftTab[selectedTab]} setStage={this.setStage}
            handleRoute={this.handleRoute}
            getExternalId={this.getExternalId}
          />
        )}
        {selectedTab == 1 && (
          <ViewLicenceModule isViewMode={true}
            collectionId={collectionId}
            stage={stage}
            language={language}
            selectedTab={selectedTab}
            handleRoute={this.handleRoute}
          />
        )}
        {selectedTab === 3 &&
          <ViewSeo
            isViewMode={true}
            collectionId={collectionId}
            stage={stage}
            language={language}
            selectedTab={selectedTab}
            handleRoute={this.handleRoute}
          />
        }
        {selectedTab == 2 && externalId && (
          <Images isViewMode={true} page={"collection"} collectionId={collectionId} stage={stage} handleRoute={this.handleRoute} externalId={externalId} />
        )}
        {selectedTab === 4 &&
          <CollectionAssignAssets
            isViewMode={true}
            collectionId={collectionId}
            stage={stage}
            language={language}
            selectedTab={selectedTab}
            currentTabData={leftTab[selectedTab]}
            handleRoute={this.handleRoute}
          />
        }
        {(selectedTab === 5) &&
          <CheckList viewMode={true} contentId={collectionId} stage={stage} language={language} selectedTab={selectedTab} />
        }
      </div>
    );
  };

  render() {
    let { leftTab, selectedTab, quickLinks, externalId } = this.state;
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs className="" links={breadCrumbs.links} typography={breadCrumbs.typography("view")} />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span data-test="handleCollectionRoute" onClick={() => this.handleCollectionRoute("/collections")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.view_collection_text}</span>
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
                <LeftTab className="leftTab-widget" orientation="vertical" variant="scrollable"
                  options={leftTab} selectedTab={selectedTab} showIcon={true}
                  Icon1={RadioButtonCheckedIcon} Icon2={CheckCircleIcon} Icon3={RadioButtonUncheckedIcon}
                  handleChange={this.handleTab}
                />
              </div>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-8 gutter-10 mid-section">
              {this.getCollectionTabsComp()}
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className=""
                header_text={constantText.quick_links_text}
                options={quickLinks}
                clicked={this.linksClickHandler}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewMovie;
