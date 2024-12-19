import React, { Component } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

// components
import ExportFile from './ExportFile/ExportFile';
import ImportFile from './ImportFile/ImportFile';
import ImportHistory from './ImportHistory/ImportHistory';
import ExportHistory from './ExportHistory/ExportHistory';
import PublishAndUnpublish from './PublishAndUnpublish/PublishAndUnpublish';

//Common Component
import LeftTab from "../../_components/Common/LeftTab/CommonLeftTab";
import BreadcrumbsComp from "../../_components/Common/BreadCrumbs/BreadCrumbs";
//helper
import { history } from "../../_helpers/history";
import { showSuccessErrorMsg } from '../../_actions/alertMessages.action';

//constant files
import {
  breadCrumbs
} from "./breadCrumbs";
import { constantText } from "../../_helpers/constants.text";
//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";

import "../../../public/css/Common/BulkOps.css";
import Images from "./Images/Images";

class BulkOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      leftTab: constantText.bulkOps_left_tab_options_arr
    }

  }


  handleTab = (event, selectedTab) => this.setState({ selectedTab },()=>{});

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, true);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  getBulksOpsTabComp = () => {
    let { selectedTab } = this.state
    return (
      <div className="mid-area">
        {selectedTab == 0 && (
          <ExportFile {...this.props} autoSaveError={this.autoSaveError} />
        )}
        {selectedTab == 1 && (
          <ImportFile {...this.props} autoSaveError={this.autoSaveError} />
        )}
        {selectedTab == 2 &&   (
          <ImportHistory {...this.props} downloadFile={this.getDownLoad}  />
        )}
        {selectedTab == 3 && (
          <ExportHistory {...this.props} downloadFile={this.getDownLoad} />)}
        {selectedTab==4 && (
          <PublishAndUnpublish {...this.props} autoSaveError={this.autoSaveError}/>
        )}
        {selectedTab == 5 && (
          <Images {...this.props}  />
        )}

      </div>
    )
  }
 
   componentDidMount(){
        const  {location}=this.props;
        this.setState({
          selectedTab:location?.state?.tab  ?  location?.state?.tab : 0
        })
   }

  getDownLoad(param) {
    if (param?.url?.length > 0) {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

      fetch(`${param?.url}`, requestOptions)
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.setAttribute('download', param?.name);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          return Promise.reject({ Error: 'Something Went Wrong', err });
        })
    } else {
      showSuccessErrorMsg(constantText?.bulksOpsConstant?.fileNotAvailable, null, "Error", true, null, true);
    }
  }
  handleRoute = (route) => {
    history.push(route);
  }

  render() {
    const { leftTab, selectedTab } = this.state
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          links={breadCrumbs.links}
          typography={breadCrumbs.typography}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn flex align-items-center auto-back-btn">
            <span
              data-test={'handleRoute'}
              onClick={() => this.handleRoute("/dashboard")}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.bulksOpsConstant.bulk_title}
              </span>
            </strong>
          </div>
          <div className="bulk-dashboard-link s-form flex">
            <span onClick={() =>  history.push(constantText?.bulk_dashboard_route)} className="ref-link auto-ref-link">
              {constantText.bulk_dashboard_text}
            </span>
          </div>
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
            <div className="col-md-8 col-lg-9 col-xl-10 gutter-10 mid-section">
              {this.getBulksOpsTabComp()}
            </div>
          </div>
        </div>
      </div>
    )
  }

}
export default BulkOps;