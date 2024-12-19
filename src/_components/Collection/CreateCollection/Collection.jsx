import React, { Component } from "react";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

//Components
import ContentProperties from "./ContentProperties/ContentProperties";
import CollectionAssignAssets from "./AssignAssets/AssignAssets"
import LicenseModule from "./LicenseModule/LicenseModule";
import Images from "./Images/Images";
import SEO from "./Seo/Seo";
import CreateEditLicense from './LicenseModule/SubComponent/CreateEditLicense';
import CheckList from "./CheckList/CheckList";

//Common Component
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import QuickLinks from "../../Common/QuickLinks/QuickLinks";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper Files
import { getLocalData } from "../../../_helpers/util";
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import { permissionObj } from "../../../_helpers/permission";
import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";

//Constant files
import { breadCrumbs, quickLinks } from "./breadCrumbs";
import { constantText } from "../../../_helpers/constants.text";

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";
 
//css
import "../../../../public/css/Common/CreateTabHead.css";

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: getLocalData("userData"),
      selectedTab: 0, collectionId: null,
      stage: null, language: "EN",
      leftTab: constantText.collection_left_tab_options_arr,
      createLicenseForm: false,
      editLicenseForm: '',
      licenceData: [],
      externalId: null,
    };
  }

  componentDidMount = () => {
    let { match, location } = this.props;
    const defaultTab = { ...this.props?.location?.state }
    if (location?.state?.selectedTab) {
      this.setState((prevState) => ({ selectedTab: location.state.selectedTab }), () => this.handlePermission());
    }
    if (match?.params?.id) {
      this.setState((prevState) => ({ collectionId: match.params.id, defaultTab }), () => this.handlePermission());
    } else {
      this.getCollectionId();
    }
  };

  getCollectionId = async () => {
    let response = await apiCalls(Config.collectionProperties, "POST", {});
    let { id, contentState } = response;
    let { title } = contentState || {};
    this.setState({ stage: title });
    this.setCollectionId(id);
  };

  setCollectionId = (collectionId) => {
    this.setState(prevState => ({ collectionId }), () => {
      this.handlePermission();
    });
    history.push(`/collection/edit/${collectionId}`);
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
    let selectedTab = leftTab?.findIndex(data => (!data?.permissionKey || (
      data?.permissionSubKey ?
        permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
        permissionObj?.[data?.permissionKey]?.[data.permissionName]()
    )));
    this.setState(prevState => ({ selectedTab }), () => this.getCollectionStatus());
  }

  markAsDone = async (index, isDone) => {
    let { collectionId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = {
        collectionId, isDone,
        sectionName: shallowArr[index]?.sectionName
      };
      const response = await this.markAsDoneNLockedAction(data);
      if (response) {
        shallowArr[index] = { ...shallowArr[index], isDone };
      }
    }
    else {
      shallowArr[index] = { ...shallowArr[index], isDone };
    }
    this.setState(prevState => ({ leftTab: shallowArr }));

  }

  unLockedSession = async index => {
    let { collectionId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      collectionId, isLocked: true,
      sectionName: shallowArr[index]?.sectionName
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState(prevState => ({ leftTab: shallowArr }));
    }
  }

  markAsDoneNLockedAction = async data => {
    const response = await apiCalls(Config.collectionAction, "POST", data, null, true, null, this.autoSaveError);
    return response;
  }

  lockedSession = (index) => {
    let { leftTab } = this.state;
    leftTab[index].isLocked = true;
    this.setState((prevState) => ({ leftTab }));
  };

  handleTab = (event, selectedTab) => this.setState({ selectedTab }, () => this.getCollectionStatus());

  handleRoute = (route) => {
    history.push(route);
  };

  linksClickHandler = (data) => {
    history.push(this.props?.match?.url + data?.path);
  }
  createLicense = () => {
    this.setState(prevState => ({
      createLicenseForm: !this.state.createLicenseForm,
      editLicenseForm: '',
      licenceData: ''
    }))
  }

  openEditForm = (data) => {
    this.setState(prevState => ({
      editLicenseForm: 1,
      createLicenseForm: !this.state.createLicenseForm,
      licenceData: data
    }));
  }

  setStage = (stage) => {
    stage = stage || { ...this.state.stage }
    const defaultTab = { ...this.state.defaultTab }
    let selectedTab = this.state.selectedTab
    if (defaultTab && defaultTab.selectedTab !== undefined && !defaultTab.redirected) {
      selectedTab = defaultTab.selectedTab
      defaultTab.redirected = true
    }
    this.setState({ stage, selectedTab, defaultTab });
  };

  autoSaveError = error => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getCollectionStatus);
    }
    else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, null);
    }
  }
  getExternalId = (externalId) => {
    this.setState({ externalId })
  }
  render() {
    let { stage, leftTab, selectedTab, language, collectionId, createLicenseForm, editLicenseForm,
      licenceData, externalId } = this.state;
    let { match } = this.props;
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs className="" links={breadCrumbs.links}
          typography={breadCrumbs.typography(match?.params?.id ? "edit" : "create")}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <div className="text">
              <span onClick={() => this.handleRoute("/collections")}>
                <AngleLeftArrow />
              </span>
              <strong>
                {match?.params?.id ? constantText.update_collections_text : constantText.create_collections_text}
              </strong>
            </div>
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
              <div className="mid-area">
                {(selectedTab == 0 && collectionId) &&
                  <ContentProperties {...this.props} language={language} collectionId={collectionId}
                    selectedTab={selectedTab} stage={stage}
                    setStage={this.setStage} autoSaveError={this.autoSaveError}
                    markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
                    currentTabData={leftTab[selectedTab]} getCollectionStatus={this.getCollectionStatus} getExternalId={this.getExternalId} />
                }
                {(selectedTab === 1) &&
                  (createLicenseForm == true) ?
                  <CreateEditLicense
                    {...this.props} openLicenseForm={this.createLicense} stage={stage} collectionId={collectionId} editTab={editLicenseForm}
                    licenseData={licenceData} openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone}
                    unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]} getCollectionStatus={this.getCollectionStatus}
                  />
                  :
                  (selectedTab === 1 && collectionId) &&
                  <LicenseModule
                    {...this.props} openLicenseForm={this.createLicense} stage={stage} collectionId={collectionId} editTab={editLicenseForm}
                    openLicenseEditForm={this.openEditForm} markAsDone={this.markAsDone} unLockedSession={this.unLockedSession}
                    currentTabData={leftTab[selectedTab]} getCollectionStatus={this.getCollectionStatus} selectedTab={selectedTab}
                  />}
                {selectedTab === 2 && collectionId &&
                  <Images
                    collectionId={collectionId}
                    externalId={externalId}
                    stage={stage}
                    page={'collection'}
                    isView={false}
                    language={language}
                    selectedTab={selectedTab}
                    markAsDone={this.markAsDone}
                    autoSaveError={this.autoSaveError}
                    unLockedSession={this.unLockedSession}
                    currentTabData={leftTab[selectedTab]}
                    getCollectionStatus={this.getCollectionStatus}
                  />
                }
                {(selectedTab === 3 && collectionId) &&
                  <SEO
                    stage={stage}
                    selectedTab={selectedTab}
                    language={language}
                    collectionId={collectionId}
                    stage={stage}
                    autoSaveError={this.autoSaveError}
                    unLockedSession={this.unLockedSession}
                    markAsDone={this.markAsDone}
                    currentTabData={leftTab[selectedTab]}
                    getCollectionStatus={this.getCollectionStatus}
                  />}

                {selectedTab === 4 &&
                  <CollectionAssignAssets
                    collectionId={collectionId}
                    stage={stage}
                    language={language}
                    selectedTab={selectedTab}
                    markAsDone={this.markAsDone}
                    autoSaveError={this.autoSaveError}
                    unLockedSession={this.unLockedSession}
                    currentTabData={leftTab[selectedTab]}
                  />
                }
                {(selectedTab === 5) &&
                  <CheckList contentId={collectionId} stage={stage} language={language} selectedTab={selectedTab} />
                }
              </div>
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
      </div>
    );
  }
}

export default Collection;
