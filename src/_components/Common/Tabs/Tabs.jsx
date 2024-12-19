import React, { Component } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

//Helper files
import { history } from "../../../_helpers/history";
import { permissionObj } from "../../../_helpers/permission";
import { constantText } from "../../../_helpers/constants.text";

//Css files
import "./Tabs.css";

class TabsComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: constantText.header_tabs,
      activeTab: 0,
    };
  }

  componentDidMount = () => {
    let { activeTab } = this.props;
    this.setState((prevState) => ({ activeTab: activeTab || 0 }));
  };

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab });
  };

  onClick = (tabData) => {
    history.push(tabData?.route);
  };

  render() {
    let { tabs, activeTab } = this.state;

    return (
      <div className="container tabs">
        <Paper>
          <Tabs
            value={activeTab}
            onChange={this.handleTabChange}
            textColor="secondary"
          >
            {tabs?.map((data, index) => {
              let { canView } = permissionObj?.[data?.permission] || {canView: ()=> false};
              return (
                <Tab
                  key={index}
                  className={canView() ? `auto-tab-${tabs[index].label.split(" ").join("")}` : 'disable-f-btn'}
                  label={data.label}
                  onClick={canView() ? () => this.onClick(data) : () => {}}
                  icon={<data.icon />}
                />
              );
            })}
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default TabsComp;
