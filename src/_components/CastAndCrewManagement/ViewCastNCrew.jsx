import React, { Component } from "react";
import { connect } from "react-redux";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

//Steps Component
import ViewProfile from "../CastAndCrewManagement/ViewProfile/ViewProfile";
import ViewFaqs from "../CastAndCrewManagement/ViewFaqs/ViewFaqs";
import DragDropImage from "./DragDropImage/DragDropImage";
import CheckList from "./CheckList/CheckList";

//Common Components
import LeftTab from "../../_components/Common/LeftTab/CommonLeftTab";
import QuickLinks from "../Common/QuickLinks/QuickLinks";
import BreadcrumbsComp from "../../_components/Common/BreadCrumbs/BreadCrumbs";

//helperFiles
import { apiCalls } from "../../_services/common.service";
import { constantText } from "../../_helpers/constants.text";
import { history } from "../../_helpers/history";
import { breadCrumbs, quickLinks } from './breadCrum';
import Config from "../../Config/config";
import CastProfileJSON from "./Schema/CastProfile_FE_Structure.json";
import { permissionObj } from '../../_helpers/permission';

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

//Css
import "./CastAndCrewManagement.css";

class ViewCastNCrew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      castProfileId: "", languange: 'EN', selectedTab: 0,
      leftTab: constantText.castncrew_leftTab_arr,
      quickLinks: quickLinks?.map((data) => ({ ...data, permissionName: "canView" })),
      externalId: null
    };
  }

  componentDidMount = () => {
    let { match } = this.props;
    let { leftTab } = this.state;
    leftTab.map(item => {
      if (item.sectionName !== 'faq') {
        item.isDone = false
      }
    });
    if (match?.params?.id) {
      this.setState(prevState => ({ castProfileId: match.params.id }), () => this.handlePermission());
    }
  }

  getCastStatus = async () => {
    let { userData, leftTab, castProfileId } = this.state;
    const response = await apiCalls(`${Config.castActionUrl}/${castProfileId}`, "GET");
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
          if (item.name === 'profile_checklist') {
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
    this.setState(prevState => ({ leftTab: shallowArr, selectedTab }), () => this.getCastStatus());
  };

  markAsDone = (index, value) => {
    let { leftTab } = this.state;
    let shallowArr = [...leftTab];
    shallowArr[index] = { ...shallowArr[index], done: value };
    this.setState(prevState => ({ leftTab: shallowArr }));
  }

  lockedSession = index => {
    let { leftTab } = this.state;
    if (index) {
      leftTab[index].isLocked = true;
    }
    this.setState(prevState => ({ leftTab }));
  }

  handleTab = (event, selectedTab) => this.setState({ selectedTab }, () => this.getCastStatus());

  handleCastListRoute = (route) => {
    history.push(route);
  };

  linksClickHandler = (data) => {
    if (this.props.match) {
      history.push(this.props?.match?.url + data?.path);
    }
  }

  getExternalId = externalId => {
    this.setState({ externalId })
  }

  handleRoute = (route) => {
    let { selectedTab } = this.state;
    this.props?.history?.push({
      pathname: route,
      state: { selectedTab: selectedTab }
    });
  }

  render() {
    const { castProfileId, language, selectedTab, leftTab, quickLinks, externalId } = this.state;
    return (
      <div className="d-wrap c-n">
        <div className="bread-crumb top-minus-20">
          <BreadcrumbsComp className="" links={breadCrumbs.links} typography={breadCrumbs.typography("view")} />
        </div>
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn" data-test="view-cast-handle-route" onClick={() => this.handleCastListRoute("/cast")}>
            <span><AngleLeftArrow /></span>
            <strong><span data-test="cast-view-castNcrew">{constantText.profile_details_text}</span></strong>
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
                {(selectedTab == 0 && castProfileId) &&
                  <ViewProfile viewMode={true} {...this.props} language={language} castProfileId={castProfileId} selectedTab={selectedTab}
                    currentTabData={leftTab[selectedTab]} getExternalId={this.getExternalId} handleRoute={this.handleRoute} />
                }
                {(selectedTab == 1 && castProfileId && externalId) &&
                  <DragDropImage viewMode={true}  {...this.props} language={language} castProfileId={castProfileId} selectedTab={selectedTab}
                    markAsDone={this.markAsDone} lockedSession={this.lockedSession} currentTabData={leftTab[selectedTab]} mode={'view'} CastProfileJSON={CastProfileJSON} externalId={externalId} handleRoute={this.handleRoute} />
                }
                {(selectedTab == 2 && castProfileId) &&
                  <ViewFaqs viewMode={true}  {...this.props} language={language} castProfileId={castProfileId} selectedTab={selectedTab}
                    markAsDone={this.markAsDone} lockedSession={this.lockedSession} currentTabData={leftTab[selectedTab]} handleRoute={this.handleRoute} />
                }
                {(selectedTab == 3 && castProfileId) &&
                  <CheckList viewMode={true} contentId={castProfileId} language={language} selectedTab={selectedTab} />
                }
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-2 gutter-10 right-section">
              <QuickLinks className="" header_text={constantText.quick_links_text}
                options={quickLinks} clicked={this.linksClickHandler}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewCastNCrew;
