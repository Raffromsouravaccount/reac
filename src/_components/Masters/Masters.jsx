import React, { Component } from "react";
import { history } from "../../_helpers/history";
import { setLocalData } from "../../_helpers/util";
import Config from "../../Config/config";
import InlineLoader from "../Common/InlineLoader/InlineLoader";

//Service
import { apiCalls } from "../../_services/common.service";

//Helper files
import { permissionObj } from "../../_helpers/permission";

//Css files
import "./ManageMasters.css";

class Masters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterModules: null,
      isRequestInitiate: true
    };
  }

  componentDidMount() {
    this.fetchMasterConfigs();
  }
  fetchMasterConfigs = async () => {
    this.setState({isRequestInitiate: false});
    let url = `${Config.metadata}/master_list`;
    let response = await apiCalls(url, 'GET', {}, "/masters", false);
    if(response && response?.data){
      this.setState({masterModules : response?.data, isRequestInitiate: true});
      setLocalData("masterModules", response?.data)
    }
  }
  handleSearch = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: [value] });
  };

  handleRoute = (route) => {
    const { masterModules } = this.state;
    history.push(route, masterModules);
  };

  render() {
    const { masterModules, isRequestInitiate } = this.state;
    const ModuleList = masterModules ? Object.keys(masterModules) : null;
    let { canView }= permissionObj?.masters;
    return (
      <div className="d-wrap c-n">
        <div className="user-head flex justify-content-between align-items-center">
          <div className="text"  data-test="master-title">{"Master Management"}</div>
        </div>
        <div className="row">
          {ModuleList &&
            ModuleList.map((module, index) => (
              masterModules[module]?.GridVisible ? <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                <div className={`listBox auto-master-${module}`}
                  onClick={() => canView()? this.handleRoute(`/manage-masters?module=${module}`): null}>
                  <div className="icon" data-test="master-icon">
                    <img src={masterModules[module]?.icon || "images/cast-n-crew.svg"} />
                  </div>
                  <div className="text">
                    {masterModules[module]?.displayModuleName}
                  </div>
                </div>
              </div> : null
            ))}
        </div>
        <InlineLoader size={30} show={!isRequestInitiate} />
      </div>
    );
  }
}

export default Masters;
