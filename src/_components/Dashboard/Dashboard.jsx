import React, { Component } from "react";
import { connect } from "react-redux";

//Helper files
import { history } from '../../_helpers/history';
import { constantText } from '../../_helpers/constants.text';
import { permissionObj } from '../../_helpers/permission';
import Config from "../../Config/config";
import InlineLoader from "../Common/InlineLoader/InlineLoader";
//Service
import { apiCalls } from "../../_services/common.service";
//Css files
import "./Dashboard.css";


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardData: [],
      isRequestInitiate: true
    }
  }

  componentDidMount() {
    this.fetchDashboardConfig();
  }

  fetchDashboardConfig = async () => {
    this.setState({ isRequestInitiate: false });
    let url = `${Config.metadata}/dashboard_content_type`;
    let response = await apiCalls(url, 'GET', {}, null, false);
    if (response && response?.data) {
      this.setState(prevState => ({ dashboardData: response?.data, isRequestInitiate: true }));
    }
  }

  handleRoute = route => {
    history.push(route);
  }

  render() {
    const { dashboardData, isRequestInitiate } = this.state;
    return (
      <div className="d-wrap c-n">
        <div className="dashboard-list">
          <div className="user-head flex justify-content-between align-items-center">
            <div className="text">{constantText.dashBoard_text}</div>
          </div>
          <div className="row">
            {dashboardData?.map((module, index) => {
              let { canView } = permissionObj?.[module?.permission] || {};
              let displayModuleName = module?.displayModuleName;
              return (
                module?.GridVisible ?
                  <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2" key={index}>
                    <div className={canView() ? `listBox auto-${displayModuleName ? displayModuleName.split(" ").join(""):""}` : 'listBox disable-f-btn'}
                      data-test="moduleRoute"
                      onClick={canView() ? () => this.handleRoute(module?.route) : () => { }}>
                      <img src={module?.icon} className="icon" />
                      <div className="text" >{module?.displayModuleName}</div>
                    </div>
                  </div> : null
              )
            })}
          </div>
          <InlineLoader size={30} show={!isRequestInitiate} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
