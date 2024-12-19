import React, { Component, Fragment } from "react";

//Common Components
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

//Steps Components
import ControlFields from "./Steps/ControlFields";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper files
import { permissionObj } from "../../../_helpers/permission";
import { constantText } from '../../../_helpers/constants.text';
import Config from '../../../Config/config';

//Icons
import AccordianNormal from "images/arrow-icon.svg";

//Css files
import "../../../../public/css/Common/ContentProperties.css";
import "../../../../public/css/Common/GlobalField.css";

class ViewContentProperties extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    let { title_summary, specialCategory, specialCategoryArr, classification, awards, awardFieldArr, globalFields,
      globalFieldsArr } = jsonData;
    this.state = {
      tabData: constantText.tvshow_content_properties_header_arr?.filter(data => data["main"]) || [],
      selectedTab: 0, tvShowId: null, stage: "",
      title_summary, specialCategory, specialCategoryArr, classification, awards, awardFieldArr,
      globalFields, globalFieldsArr, tvShowData: {},
      showLockedPopup: false, canMarkAsDone: false, error: false,
    };
  }

  componentDidMount() {
    let { tvShowId } = this.props;
    this.setState(prevState => ({ tvShowId: tvShowId || null }), () => {
      if (tvShowId) {
        this.fetchGlobalFieldsData();
        this.fetchContentData();
      }
    });
  }

  fetchGlobalFieldsData = async () => {
    let { tvShowId } = this.state;
    let url = `${Config.tvShowGlobalFiels}/${tvShowId}?type=${`property`}`;
    let response = await apiCalls(url, "GET", {});
    if (response) {
      this.updatedDataValue(response);
    }
  }

  fetchContentData = async () => {
    let { tvShowId } = this.state;
    let response = await apiCalls(`${Config.tvShowProperties}/${tvShowId}`, "GET", {});
    if (response) {
      this.props.getExternalId(response?.externalId);
      this.props?.setStage(response?.contentState?.title, response?.journeyType);
      this.updateValues(response);
    }
  };

  updatedDataValue = response => {
    let { globalFields, globalFieldsArr } = this.state;
    globalFields = (response?.length > 0) ? response?.map(dataObj =>
    (globalFieldsArr?.map(obj => (
      { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
    )))) : globalFields;

    this.setState({
      globalFields
    })
  }

  updateValues = dataObj => {

    let { title_summary, specialCategory, specialCategoryArr, classification, awards,
      awardFieldArr } = this.state;

    title_summary = title_summary ? this.updateArrValue(title_summary, dataObj) : title_summary;
    specialCategory = (specialCategory && dataObj?.specialCategory && dataObj?.specialCategory?.length) ?
      dataObj?.specialCategory?.map(specialCategoryObj => this.updateArrValue(specialCategoryArr, specialCategoryObj)) :
      specialCategory;
    classification = classification ? this.updateArrValue(classification, dataObj) : classification;
    awards = (awards && dataObj?.awards && dataObj?.awards?.length) ?
      dataObj?.awards?.map(awardsObj => this.updateArrValue(awardFieldArr, awardsObj)) :
      awards;

    this.setState({
      title_summary, specialCategory, classification, awards, tvShowData: dataObj
    });
  }

  updateArrValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map(data => {
      if (data["name"] == 'audioLanguages') {
        return {
          ...data,
          multiple: updatedObj.isMultiAudio,
          value: updatedObj.isMultiAudio ? updatedObj[data["name"]] : updatedObj[data["name"]] ? updatedObj[data["name"]][0] : data["value"],
        };
      }
      else {
        return {
          ...data,
          value: updatedObj[data["name"]] || data["value"],
        };
      }
    });
    return updatedData;
  };

  handleTab = (event, selectedTab) => {
    window.scrollTo(0,0);
    this.setState({ selectedTab });
  }

  render() {
    let { tvShowId, tvShowData, selectedTab, title_summary, specialCategory, classification, awards, globalFields,
      tabData } = this.state;
    let { stage, language, handleRoute } = this.props;
    let { canUpdate } = permissionObj?.tvShows?.contentPropertiesModule;
    return (
      <div className="create-movie">
        <div className="whitebox remove-b-radius">
          <div className="ccm-head flex align-items-center justify-content-between m-b-0">
            <h4>{constantText.content_properties_text} </h4>
            <div className="status-head flex align-items-center">
              <BadgeBox className="create-movie-stage" status={stage || constantText.draft_text} />
              <div className="edit-btn">
                <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                  buttonText={constantText.tv_show_text.edit}
                  disabled={!canUpdate()}
                  onClick={() => handleRoute(`/tvshow/edit/${tvShowId}`)}
                />
              </div>
            </div>
          </div>
          <div className="cr-mov-tab p-b-30">
            <LeftTab
              className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
              selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab}
            />
          </div>
        </div>

        <div className="movieForm-tab">
          <div className="view-data-wrap">

            {(selectedTab == 0) && (
              <div className="whitebox m-b-30">
                <Fragment>
                  <ViewDetails allData={title_summary} />
                  {tvShowData?.specialCategory?.length > 0 &&
                    <Fragment>
                      <div className="ccm-head flex align-items-center justify-content-between m-b-30">
                        <h4>{constantText.special_category_text}</h4>
                      </div>
                      <div className="col-12">
                        <div className="global-wrap">
                          {specialCategory?.map((data, index) => (
                            <div className="global-row" key={index}>
                              <div className="add-plush-row top-title">
                                <div className="top-text">{`${constantText.special_category_text_set} ${index >= 0 ? ` - ${index + 1}` : ''}`}</div>
                              </div>
                              <div className="row input-space-35">
                                <ViewDetails allData={data} key={index} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  }
                </Fragment>
              </div>
            )}
            {(selectedTab == 1) && (
              <div className="whitebox m-b-30">
                <Fragment>
                  <ViewDetails allData={classification} />
                  {tvShowData.awards &&
                    <Fragment>
                      <div className="ccm-head flex align-items-center justify-content-between m-b-30">
                        <h4>{constantText.awards_recognition_text}</h4>
                      </div>
                      <div className="col-12">
                        <div className="global-wrap">
                          {awards?.map((data, index) => (
                            <div className="global-row" key={index}>
                              <div className="add-plush-row top-title">
                                <div className="top-text">{`${constantText.awards_recognition_text_set} ${index >= 0 ? ` - ${index + 1}` : ''}`}</div>
                              </div>
                              <div className="row input-space-35">
                                <ViewDetails allData={data} key={index} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  }
                </Fragment>
              </div>
            )}
            {/* {(selectedTab == 2) && (
              <div className="whitebox m-b-30">
                <Fragment>
                  <div className="ccm-head flex align-items-center justify-content-between p-t-0 m-b-20">
                    <h4>{constantText.global_fields}</h4>
                  </div>
                  <div className="col-12">
                    <div className="global-wrap">
                      {globalFields?.map((data, index) => (
                        <div className="global-row" key={index}>
                          <div className="add-plush-row top-title">
                            <div className="top-text">{`${constantText.global_fields_set} ${index >= 0 ? ` - ${index + 1}` : ''}`}</div>
                          </div>
                          <div className="row input-space-35">
                            <ViewDetails allData={data} key={index} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Fragment>
              </div>
            )} */}
            {selectedTab == 2 && (
              <ControlFields selectedTab={selectedTab} handleTab={this.handleTab}
                tvShowId={tvShowId} language={language} />
            )}

            {/* </div> */}
          </div>
        </div>
        {(selectedTab != 2) &&
          <div className="whitebox">
            <div className="prev-next-wrap flex align-items-center">
              {(selectedTab > 0) &&
                <div className="prev-step-btn" onClick={event => this.handleTab(event, selectedTab - 1)}>
                  <AccordianNormal /> {constantText.previous_text}
                </div>
              }
              <div className="next-step-btn" data-test="handleTabNext" onClick={event => this.handleTab(event, selectedTab + 1)}>
                {constantText.next_text} <AccordianNormal />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default ViewContentProperties;
