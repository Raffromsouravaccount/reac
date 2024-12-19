import React, { Component } from "react";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

//Steps Component
import CreateProfile from "./CreateProfile/CreateProfile";
import DragDropImage from "./DragDropImage/DragDropImage";
import CreateFaqs from "./CreateFaqs/CreateFaqs";
import CheckList from "./CheckList/CheckList";

//Common Components
import LeftTab from "../../_components/Common/LeftTab/CommonLeftTab";
import QuickLinks from "../Common/QuickLinks/QuickLinks";
import BreadcrumbsComp from "../../_components/Common/BreadCrumbs/BreadCrumbs";

//helperFiles
import { apiCalls } from "../../_services/common.service";
import { constantText } from "../../_helpers/constants.text";
import { history } from "../../_helpers/history";
import { getLocalData } from "../../_helpers/util";
import { breadCrumbs, quickLinks } from './breadCrum';
import Config from "../../Config/config";
import { showSuccessErrorMsg } from "../../_actions/alertMessages.action";
import { permissionObj } from '../../_helpers/permission';

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

//Css
import "./CastAndCrewManagement.css";

class CastAndCrewManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: getLocalData("userData"),
      castProfileId: null, languange: 'EN', selectedTab: 0,
      leftTab: constantText.castncrew_leftTab_arr,
      jsonData: {},
      externalId: null,
      stage: {title:"Draft"},
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    const defaultTab = {...this.props.location?.state}
    leftTab.map(item => {
      if (item.sectionName !== 'faq'){
        item.isDone = false
      }
    });
    if (match?.params?.id) {
      this.setState(prevState => ({ castProfileId: match.params.id,defaultTab }), () =>{
        this.getJsonData(match.params.id)
        this.handlePermission();
      });
    }
    else {
      this.getContentId();
    }
  }

  getContentId = async () => {
    let response = await apiCalls(Config.createProfileUrl, 'POST', {});
    if (response) {
      let { id } = response;
      this.getJsonData(id);
    }
  }

  getJsonData = async id => {
    const response = await apiCalls(`${Config.metaDataUrl}/cast_frontend_structure`, "GET", {}, `/cast/edit/${id}`);
    if (response) {
      this.setState(prevState => ({ castProfileId: id, jsonData: response?.data }), () => this.handlePermission());
      history.push(`/cast/edit/${id}`);
    }
  }

  getCastStatus = async () => {
    let { userData, leftTab, castProfileId } = this.state;
    const response = await apiCalls(`${Config.castActionUrl}/${castProfileId}`, "GET", null, null, false);
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
      const checkIsDone = shallowArr.find(item => (item.name !== 'profile_checklist' && item.isDone === false));
      if (!checkIsDone) {
        shallowArr.forEach(item => {
          if(item.name === 'profile_checklist'){
            item.isDone = true;
          }
        })
      }
      this.setState((prevState) => ({ leftTab: shallowArr }), () => {
        this.setChecklistCheck();
      });
    } else {
      this.setChecklistCheck();
    }
  }

  setChecklistCheck = () => {
    let {leftTab} = this.state;
    let shallowArr = [...leftTab];
    const checkIsDone = shallowArr.find(
      (item) =>
        item.permissionSubKey !== "checklistModule" && item.isDone === false
    );
    if (!checkIsDone) {
      this.setCheckListIsDone(true);
    } else {
      this.setCheckListIsDone(false);
    }
  }

  setCheckListIsDone = (flag) => {
    let {leftTab} = this.state;
    let shallowArr = [...leftTab];
    shallowArr.forEach((item) => {
      if (item.permissionSubKey === "checklistModule") {
        item.isDone = flag;
      }
    });
    this.setState({leftTab: shallowArr})
  }

  handlePermission = () => {
    let { leftTab } = this.state;
    let selectedTab = leftTab?.findIndex(data => (!data?.permissionKey || (
      data?.permissionSubKey ?
        permissionObj?.[data?.permissionKey]?.[data.permissionSubKey]?.[data.permissionName]() :
        permissionObj?.[data?.permissionKey]?.[data.permissionName]()
    )));
    this.setState(prevState=> ({ selectedTab }), ()=> this.getCastStatus());
  }

  markAsDone = async (index, isDone) => {
    let { castProfileId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    if (isDone) {
      let data = {
        castProfileId, isDone,
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
    let { castProfileId, leftTab } = this.state;
    let shallowArr = [...leftTab];
    let data = {
      castProfileId, isLocked: true,
      sectionName: shallowArr[index]?.sectionName
    };
    const response = await this.markAsDoneNLockedAction(data);
    if (response) {
      shallowArr[index] = { ...shallowArr[index], isLocked: false };
      this.setState(prevState => ({ leftTab: shallowArr }));
    }
  }

  markAsDoneNLockedAction = async data => {
    const response = await apiCalls(Config.castActionUrl, "POST", data, null, true, null, this.autoSaveError);
    return response;
  }

  handleTab = (event, selectedTab) => this.setState({ selectedTab }, () => this.getCastStatus());

  handleRoute = (route) => {
    history.push(route);
  };

  linksClickHandler = (data) => {
    const path = this.props.match;
    if (path) {
      history.push(path?.url + data?.path);
    }
  }

  autoSaveError = error => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getCastStatus);
    }
  }

  getExternalId = externalId => {
    this.setState({ externalId })
  }

  setStage = (stage) => {
    stage = stage || {...this.state.stage}
    const defaultTab = {...this.state.defaultTab}
    let selectedTab = this.state.selectedTab
    if(defaultTab && defaultTab.selectedTab !== undefined && !defaultTab.redirected) {
      selectedTab = defaultTab.selectedTab
      defaultTab.redirected = true
    }
    this.setState({ stage, selectedTab, defaultTab });
  };

  render() {
    const { castProfileId, language, selectedTab, leftTab, jsonData, externalId } = this.state;
    const { Profile, PhotoDetails, Faq } = jsonData;
    return (
      <div className="d-wrap c-n">
        <div className="bread-crumb top-minus-20">
          <BreadcrumbsComp className="" links={breadCrumbs.links} typography={breadCrumbs.typography("edit")} />
        </div>
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn" data-test="cast-handle-route" onClick={() => this.handleRoute("/cast")}>
            <span><AngleLeftArrow /></span>
            <strong><span data-test="cast-header">{constantText.profile_details_text}</span></strong>
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
                  options={leftTab} selectedTab={selectedTab}
                  showIcon={true} Icon1={RadioButtonCheckedIcon} Icon2={CheckCircleIcon} Icon3={RadioButtonUncheckedIcon}
                  handleChange={this.handleTab} />
              </div>
            </div>
            <div className="col-md-8 col-lg-6 col-xl-8 gutter-10 mid-section">
              <div className="mid-area">
                {(selectedTab == 0 && castProfileId && Profile?.profile) &&
                  <CreateProfile {...this.props} language={language} castProfileId={castProfileId} selectedTab={selectedTab}
                    markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                    Profile={Profile} autoSaveError={this.autoSaveError} getExternalId={this.getExternalId}  setStage={this.setStage}  />
                }
                {(selectedTab == 1 && castProfileId && PhotoDetails?.length > 0 ) &&
                  <DragDropImage {...this.props} language={language} castProfileId={castProfileId} selectedTab={selectedTab}
                    markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                    CastProfileJSON={PhotoDetails} autoSaveError={this.autoSaveError} externalId={externalId} />
                }
                {(selectedTab == 2 && castProfileId && Faq?.length > 0) &&
                  <CreateFaqs {...this.props} language={language} castProfileId={castProfileId} selectedTab={selectedTab}
                    markAsDone={this.markAsDone} unLockedSession={this.unLockedSession} currentTabData={leftTab[selectedTab]}
                    Faq={Faq} autoSaveError={this.autoSaveError} />
                }
                {(selectedTab == 3 && castProfileId) &&
                  <CheckList contentId={castProfileId} language={language} selectedTab={selectedTab} autoSaveError={this.autoSaveError} />
                }
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                options={quickLinks} data-test="cast-quicklinks" clicked={this.linksClickHandler}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CastAndCrewManagement;
