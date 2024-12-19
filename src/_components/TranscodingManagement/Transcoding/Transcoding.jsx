import React, { Component } from "react";

//Steps
import UnMappedUid from "./Steps/UnMappedUid";
import MappedUid from "./Steps/MappedUid";

//Helper files
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import { constantText } from "../../../_helpers/constants.text";
import { history } from "../../../_helpers/history";
import { breadCrumbs } from "../breadCrumbs";
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';

//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

import "./Transcoding.css";
import "../../../../public/css/Common/Uid.css";

class Transcoding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props?.location?.state?.selectedTab || 0,
      tabData: constantText.transcodingTabData,
    };
  }

  handleRoute = (route) => {
    history.push(route);
  };

  handleTab = (event, activeTab) => {
    this.setState({ activeTab });
  };
  
  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, true);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  render() {
    const { activeTab, tabData } = this.state;

    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links}
          typography={breadCrumbs.typography()}
        />
        <div className="user-head profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <div className="text">
              <span
                data-test="handleRouteBtn"
                onClick={() => this.handleRoute("/dashboard")}
              >
                <AngleLeftArrow />
              </span>
              <strong>{constantText.uid_mapping_text}</strong>
            </div>
          </div>
        </div>
        <div className="cr-mov-tab p-b-30">
          <LeftTab
            className="tabs"
            orientation="horizontal"
            variant="scrollable"
            options={tabData}
            selectedTab={activeTab}
            showIcon={false}
            handleChange={this.handleTab}
          />
        </div>
        {activeTab == 0 && <UnMappedUid {...this.props} />}
        {activeTab == 1 && <MappedUid {...this.props}  autoSaveError={this.autoSaveError}/>}
      </div>
    );
  }
}

export default Transcoding;
