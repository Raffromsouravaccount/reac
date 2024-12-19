import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

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
import { constantText } from "../../../_helpers/constants.text";
import Config from "../../../Config/config";
import { permissionObj } from '../../../_helpers/permission';

//Icons
import AccordianNormal from "images/arrow-icon.svg";


//Css files
import "../../../../public/css/Common/ContentProperties.css";
import '../../../../public/css/Common/GlobalField.css';
class ViewContentProperties extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    let {
      title_summary,
      specialCategory,
      specialCategoryArr,
      global,
      classification,
      awards,
      awardFieldArr,
      player,
      skip_song,
      skipFieldArr,
    } = jsonData;
    this.state = {
      selectedTab: 0,
      movieId: null,
      contentData: {},
      stage: { title: null },
      controlFieldsData: {},
      headetTabs: JSON.parse(JSON.stringify(constantText.movie_content_properties_header_arr)),
      title_summary,
      specialCategory,
      specialCategoryArr,
      global,
      classification,
      awards,
      awardFieldArr,
      player,
      skip_song,
      skipFieldArr,
    };
  }

  componentDidMount() {
    let { movieId, stage } = this.props;
    this.setState({ movieId, stage }, () => {
      if (movieId) {
        this.fetchContentData();
      }
    });
  }

  fetchContentData = async () => {
    let { movieId } = this.state;
    let { language } = this.props;
    let url = `${Config.movieProperties}/${movieId}`;

    let response = await apiCalls(url, "GET", {});
    if (response) {
      this.props.getExternalId(response?.externalId)
      this.setState(
        {
          contentData: response,
          stage: response.contentState
        },
        () => {
          this.updateValues(response || {})
          this.props.setStage(response.contentState, response.journeyType);
        }
      );
    }
  };

  getControlFieldData = async () => {
    let { movieId, language } = this.props;
    let controlFieldsData = { ...this.state.controlFieldsData }
    let url = `${Config.movieProperties}/controlFields/${movieId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      controlFieldsData = { ...controlFieldsData, ...response }
      this.setState({ controlFieldsData });
    }
  }

  updateValues = (dataObj) => {
    let {
      title_summary,
      specialCategory,
      specialCategoryArr,
      global,
      classification,
      awards,
      awardFieldArr,
      player,
      skip_song,
      skipFieldArr,
    } = this.state;
    title_summary = this.updateArrValue(title_summary, dataObj);
    classification = this.updateArrValue(classification, dataObj);
    player = this.updateArrValue(player, dataObj);
    global = dataObj?.globalProperties
      ? this.updateArrValue(global, dataObj.globalProperties)
      : global;
    awards = dataObj?.awards
      ? dataObj?.awards?.map((awardsObj) =>
        this.updateArrValue(awardFieldArr, awardsObj)
      )
      : awards;
    specialCategory = dataObj?.specialCategory
      ? dataObj?.specialCategory?.map((specialCategoryObj) =>
        this.updateArrValue(specialCategoryArr, specialCategoryObj)
      )
      : specialCategory;
    skip_song = dataObj?.skipSong
      ? dataObj?.skipSong?.map((skipSongObj) =>
        this.updateArrValue(skipFieldArr, skipSongObj)
      )
      : skip_song;
    delete title_summary.specialCategory

    this.setState({
      title_summary,
      specialCategory,
      global,
      classification,
      awards,
      player,
      skip_song,
    });
  };

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
    const headetTabs = [...this.state.headetTabs]
    if (headetTabs[selectedTab]?.label === "Control Fields" && !headetTabs[selectedTab].fetched) {
      this.getControlFieldData();
      headetTabs[selectedTab].fetched = true;
    }
    this.setState({ selectedTab, headetTabs });
  }

  render() {
    let {
      movieId,
      contentData,
      selectedTab,
      title_summary,
      global,
      classification,
      awards,
      player,
      skip_song,
      headetTabs,
      specialCategory,
      controlFieldsData,
      stage
    } = this.state;
    let { language, handleRoute } = this.props;
    let { canUpdate } = permissionObj?.movies?.contentPropertiesModule;
    return (
      <div className="create-movie">
        <div className="whitebox remove-b-radius">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4>{constantText.content_properties_text}</h4>
            <div className="status-head flex align-items-center">
              {stage?.title && <BadgeBox className="create-movie-stage" status={stage?.title} />}
              <div className="edit-btn">
                <ButtonField
                  disabled={!canUpdate()}
                  className="zee-btn-field zee-full MuiButton-containedPrimary"
                  buttonText={constantText.edit_movie_text}
                  onClick={() => canUpdate() ? handleRoute(`/movie/edit/${movieId}`) : ""}
                />
              </div>
            </div>
          </div>
          <div className="cr-mov-tab p-b-30">
            <LeftTab
              data-test="handleTab-btn"
              className="tabs"
              orientation="horizontal"
              variant="scrollable"
              options={headetTabs}
              selectedTab={selectedTab}
              showIcon={false}
              handleChange={this.handleTab}
            />
          </div>
        </div>

        <div className="movieForm-tab">
          <div className="view-data-wrap">
            {selectedTab == 0 && (
              <div className="whitebox m-b-30">
                <ViewDetails allData={title_summary} />
                {contentData.globalProperties && (
                  <Fragment>
                    <div className="ccm-head flex align-items-center justify-content-between m-b-30">
                      <h4>{constantText.global_text}</h4>
                    </div>
                    <ViewDetails allData={global} />
                  </Fragment>
                )}
                {contentData.specialCategory && (
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
                              <ViewDetails allData={data} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
            {selectedTab == 1 && (
              <div className="whitebox m-b-30">
                <ViewDetails allData={classification} />
                {contentData.awards && (
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
                              <ViewDetails allData={data} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
            {selectedTab == 2 && (
              <div className="whitebox m-b-30">
                <ViewDetails allData={player} />
                {contentData.skipSong && (
                  <Fragment>
                    <div className="ccm-head flex align-items-center justify-content-between m-b-30">
                      <h4>{constantText.skip_song_text}</h4>
                    </div>
                    <div className="col-12">
                      <div className="global-wrap">
                        {skip_song?.map((data, index) => (
                          <div className="global-row" key={index}>
                            <div className="add-plush-row top-title">
                              <div className="top-text">{`${constantText.skip_song_text_set} ${index >= 0 ? ` - ${index + 1}` : ''}`}</div>
                            </div>
                            <div className="row input-space-35">
                              <ViewDetails allData={data} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
            {selectedTab == 3 && (
              <ControlFields
                selectedTab={selectedTab}
                handleTab={this.handleTab}
                movieId={movieId}
                language={language}
                controlFieldsData={controlFieldsData}
              />
            )}
          </div>
        </div>
        {selectedTab != 3 && (
          <div className="whitebox">
            <div className="prev-next-wrap flex align-items-center">
              {selectedTab > 0 && (
                <div
                  className="prev-step-btn"
                  onClick={(event) => this.handleTab(event, selectedTab - 1)}
                >
                  <AccordianNormal /> {constantText.previous_text}
                </div>
              )}
              <div
                className="next-step-btn"
                onClick={(event) => this.handleTab(event, selectedTab + 1)}
              >
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
