import React, { Component } from "react";

//Common
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

//Helper files
import { permissionObj } from "../../../_helpers/permission";
import { constantText } from '../../../_helpers/constants.text';
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";

// CSS
import '../../../../public/css/Common/CastNCrew.css';

class ViewCastAndCrew extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    let { actors, actorsData, others, globalProperties, globalPropertiesData } = jsonData
    this.state = {
      status: null,
      tabData: constantText.tvshow_cast_and_crew_header_arr,
      selectedTab: 0,
      actors, actorsData, others, globalProperties, globalPropertiesData,
      showActorFields: false
    }
  }

  componentDidMount = async () => {
    this.fetchContentData();
    let { tvShowId } = this.props;
    if (tvShowId) {
      let response = await apiCalls(`${Config.tvShowCastAndCrew}/${tvShowId}`, "GET", {}, `/tvshow/edit/${tvShowId}`);
      if (response) {
        this.updatedDataValue(response);
      }
    }
  }

  fetchContentData = async () => {
    let { tvShowId } = this.props;
    let response = await apiCalls(`${Config.tvShowProperties}/${tvShowId}`, "GET", {});
    if (response) {
      this.setState({status: response?.contentState?.title})
    }
  };

  updatedDataValue = response => {
    let { actors, actorsData, others, globalProperties, globalPropertiesData } = this.state;
    others = others ? others?.map(data => ({ ...data, value: response?.[data?.name] || data["value"] })) : others;

    let actorDta = response?.["3bb64421-f15f-4dda-adec-03c324c140a3"] || [];
    actors = (actorDta?.length > 0) ? actorDta?.map(dataObj => actorsData?.map(obj => (
      { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
    ))) : actors;

    globalProperties = (response?.globalProperties?.length > 0) ? response?.globalProperties?.map(dataObj =>
      (globalPropertiesData?.map(obj => (
        { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
      )))) : globalProperties;

    this.setState(prevState => ({
      actors, others, globalProperties,
      showActorFields: !!actorDta.length
    }))
  }

  handleTab = (event, selectedTab) => this.setState(prevState => ({ selectedTab }));

  render() {
    let { tabData, showActorFields, actors, others, globalProperties, selectedTab, status } = this.state;
    let { tvShowId, handleRoute } = this.props;
    let { canUpdate }= permissionObj?.tvShows?.castNCrewModule;
    return (
      <div className="create-movie">
        <div className="whitebox">
          <div className="ccm-head flex align-items-center justify-content-between m-b-0">
            <h4>{constantText.cast_crew_text}</h4>
            <div className="status-head flex align-items-center">
            {status && <BadgeBox className="create-movie-stage" status={status}  />}
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
            <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
              data-test="handle-tab-method" selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
          </div>
          <div className="movieForm-tab">
            <div className="movie-f-wrap col-12">
              {(selectedTab == 0) &&
                <div className="movieForm-tab">
                  <div className="movie-f-wrap col-12">
                    {showActorFields &&
                      <div className="actor-row">
                        {actors?.map((actorFields, actorIndex) => (
                          <ViewDetails key={actorIndex} allData={actorFields} />
                        ))}
                      </div>
                    }
                    <div className="row input-space-35">
                      <ViewDetails allData={others} />
                    </div>
                  </div>
                </div>
              }
              {(selectedTab == 1) &&
                <div className="movie-f-wrap col-12">
                  {globalProperties?.map((globalGroupFields, globalIndex) => (
                    <ViewDetails key={globalIndex} allData={globalGroupFields} />
                  ))}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewCastAndCrew;
