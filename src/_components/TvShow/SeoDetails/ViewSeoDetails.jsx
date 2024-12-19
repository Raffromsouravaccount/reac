import React, { Component } from "react";

///Common Components
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";


//Services
import { apiCalls } from "../../../_services/common.service";

//Helper Files
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";

//Icons
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { DEFAULT_JSON } from "../../../_helpers/util";
class ViewSeoDetails extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    this.state = {
      status: null,
      contentId: null,
      language: "",
      JSONSchema: DEFAULT_JSON(jsonData.SeoJson),
      JSONSchemaGlobal: DEFAULT_JSON(jsonData.globalProperties),
      allGlobalData: [],
      stage: { title: "Draft" },
      tabData: constantText.tvshow_seo_header_arr,
      selectedTab: 0,
      updateId: [],
    };
  }

  async componentDidMount() {
    this.fetchContentData();
    let { contentId } = this.props;
    let shallowArr = []
    await shallowArr.push(JSON.parse(JSON.stringify([...this.state.JSONSchemaGlobal])))
    this.setState({ allGlobalData: shallowArr, tvShowId: contentId }, async () => {
      const url = `${Config.tvShow.seo}/${contentId}`;
      let response = await apiCalls(url, "GET", {});
      if (response) this.setJsonData(response);
    });
  }

  fetchContentData = async () => {
    let { contentId } = this.props;
    let response = await apiCalls(`${Config.tvShowProperties}/${contentId}`, "GET", {});
    if (response) {
      this.setState({status: response?.contentState?.title})
    }
  };

  setJsonData = (apiData) => {
    let { JSONSchema } = this.state;
    let CopyJSONSchema = JSONSchema.map((data) => {
      if (data.name === "redirectionType") {
        data.value = apiData["RedirectionType"] || data.value;
        data.label = data.placeHolder || data.label;
      } else {
        data.value = apiData[data.name] || data.value;
        data.label = data.placeHolder || data.label;
      }
      return data;
    });
    this.setState((prevState) => ({ JSONSchema: CopyJSONSchema }));
    this.setSeoDetailsGlobal();
  };

  setSeoDetailsGlobal = async () => {
    let { tvShowId, allGlobalData, JSONSchemaGlobal, updateId } = this.state;
    const url = `${Config.tvShow.global}/${tvShowId}?langCode=en&type=seo`;
    const responseAll = await apiCalls(url, "GET", {});

    let allGlobalDataCopy = (responseAll?.length > 0) ? responseAll?.map((dataObj) => JSONSchemaGlobal?.map(obj => (
      { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
      ))) : allGlobalData;
     let updateIdCopy = (responseAll?.length > 0) ? responseAll?.map((data, indexItem)=> updateId[indexItem] = data.id): updateId
    this.setState({allGlobalData: allGlobalDataCopy, updateId: updateIdCopy})
  };

  handleTab = (event, selectedTab) => {
    const tabData = [...this.state.tabData]
    this.setState({ selectedTab, tabData })
  };

  render() {
    let { tabData, selectedTab,  JSONSchema, allGlobalData, status } = this.state;
    const { contentId, handleRoute, stage } = this.props;
    let { canUpdate } = permissionObj?.tvShows?.seoModule;
    return (
      <div>
        <div className="whitebox">
          <div className="drag-drop-wrap">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.seo_details_text}</h4>
              <div className="status-head flex align-items-center">
                {status && (
                  <BadgeBox
                    className="create-movie-stage"
                    status={status}
                  />
                )}
                <div className="edit-btn">
                  <ButtonField
                    className="zee-btn-field zee-full MuiButton-containedPrimary"
                    buttonText={constantText.tv_show_text.edit}
                    disabled={!canUpdate()}
                    onClick={() =>
                      canUpdate()
                        ? handleRoute(`/tvshow/edit/${contentId}`)
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
                data-test="handle-tab-method" selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
            </div>
            {(selectedTab == 0) &&
              JSONSchema && <ViewDetails allData={JSONSchema} />
            }
            {(selectedTab == 1) &&
              allGlobalData?.map((globalGroupFields, globalIndex) => (
                <ViewDetails allData={allGlobalData[globalIndex]} key={globalIndex}/>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ViewSeoDetails;
