import React, { Component } from "react";
import { connect } from "react-redux";

//Common Components
import LeftTab from "../../../Common/LeftTab/CommonLeftTab";
import ViewDetails from "../../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../../Common/ButtonField/ButtonField";

//Steps Components
import ControlFields from "./Steps/ControlFields";

//Services
import { apiCalls } from "../../../../_services/common.service";

//Helper files
import { constantText } from "../../../../_helpers/constants.text";
import Config from "../../../../Config/config";
import { permissionObj } from "../../../../_helpers/permission";
import { DEFAULT_JSON } from "../../../../_helpers/util";

//Json files
import PropertiesJson from "../../Schema/ContentProperties.json";

//Icons
import AccordianNormal from "images/arrow-icon.svg";

//Css files
import "./ContentProperties.css";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";

class ViewContentProperties extends Component {
  constructor(props) {
    super(props);
    let { title_summary } = PropertiesJson;
    this.state = {
      selectedTab: 0, collectionId: null,
      title_summary: DEFAULT_JSON(title_summary),
      headetTabs: constantText.collection_content_properties_header_arr,
      controlFieldsData: {},
    };
  }

  componentDidMount() {
    let { collectionId } = this.props;
    this.setState(prevState => ({ collectionId: collectionId || null }), () => {
      if (collectionId) {
        this.fetchContentData();
        this.getControlFieldData();
      }
    });
  }

  fetchContentData = async () => {
    let { collectionId } = this.state;
    let url = `${Config.collectionProperties}/${collectionId}`;
    let response = await apiCalls(url, "GET", {});
    if (response) {
      this.props.getExternalId(response?.externalId)
      this.updateValues(response || {});
    }
  };

  getControlFieldData = async () => {
    let { collectionId, language } = this.props;
    let controlFieldsData = {...this.state.controlFieldsData}
    let url = `${Config.collectionProperties}/controlFields/${collectionId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      controlFieldsData = {...controlFieldsData, ...response}
      this.setState({ controlFieldsData });
    }
  }

  updateValues = dataObj => {
    let { title_summary } = this.state;
    const { contentState }= dataObj;
    title_summary = this.updateArrValue(title_summary, dataObj);
    this.setState(prevState=> ({title_summary}), ()=> this.props?.setStage(contentState?.title));
  };

  updateArrValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map(data => {
      return {
        ...data,
        value: updatedObj[data["name"]] || data["value"],
      };
    });
    return updatedData;
  };

  handleTab = (event, selectedTab) => {
    const headetTabs = [...this.state.headetTabs]
    if(headetTabs[selectedTab].label === "Control Fields" && !headetTabs[selectedTab].fetched) {
      this.getControlFieldData();
      headetTabs[selectedTab].fetched = true;
    }
    this.setState({ selectedTab, headetTabs });
  }

  render() {
    let {collectionId, selectedTab, title_summary, headetTabs, controlFieldsData } = this.state;
    let { stage, language, handleRoute } = this.props;
    let {canUpdate}= permissionObj?.collections?.contentPropertiesModule;
    return (
      <div className="create-movie">
        <div className="whitebox remove-b-radius">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4>{constantText.content_properties_text}</h4>
            <div className="status-head flex align-items-center">
              {stage && <BadgeBox className="create-movie-stage" status={stage} />}
              <div className="edit-btn">
                <ButtonField
                  disabled={!canUpdate()}
                  className="zee-btn-field zee-full MuiButton-containedPrimary"
                  buttonText={constantText.edit_collection}
                  onClick={() => canUpdate()? handleRoute(`/collection/edit/${collectionId}`): {}}
                />
              </div>
            </div>
          </div>
          <div className="cr-mov-tab p-b-30">
            <LeftTab className="tabs" orientation="horizontal" variant="scrollable"
              options={headetTabs} selectedTab={selectedTab} showIcon={false}
              handleChange={this.handleTab}
            />
          </div>
        </div>

        <div className="movieForm-tab">
          <div className="view-data-wrap">
            {selectedTab == 0 && <div className="whitebox m-b-30">
              <ViewDetails allData={title_summary} />
            </div>
            }
            {selectedTab == 1 && (
              <ControlFields selectedTab={selectedTab} handleTab={this.handleTab}
                collectionId={collectionId} language={language} controlFieldsData= {controlFieldsData}
              />
            )}
          </div>
        </div>
        {selectedTab != 1 && (
          <div className="whitebox">
            <div className="prev-next-wrap flex align-items-center">
              {selectedTab > 0 && (
                <div
                  className="prev-step-btn"
                  data-test="btn-handleTab"
                  onClick={(event) => this.handleTab(event, selectedTab - 1)}
                >
                  <AccordianNormal /> {constantText.previous_text}
                </div>
              )}
              <div className="next-step-btn"
                data-test="handleTab-btn"
                onClick={(event) => this.handleTab(event, selectedTab + 1)} >
                {constantText.next_text} <AccordianNormal />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ViewContentProperties;
