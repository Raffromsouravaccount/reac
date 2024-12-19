import React, { Component } from "react";

//Common
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { permissionObj } from '../../../_helpers/permission';

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";

// CSS
import './CastAndCrew.css';

class ViewCastAndCrew extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    let { actors, actorsData, others } = jsonData;
    this.state = {
      videoId: null,
      status: null,
      actors, actorsData, others,
      showActorFields: false
    }
  }

  componentDidMount = async () => {
    let { videoId } = this.props;
    if (videoId) {
      let response = await apiCalls(`${Config.videoCastAndCrew}/${videoId}`, "GET", {}, `/video/edit/${videoId}`);
      if (response) {
        this.updatedDataValue(response);
      }
    }
  }

  updatedDataValue = response => {
    let { actors, actorsData, others } = this.state;
    others = others ? others?.map(data => ({ ...data, value: response?.[data?.name] || data["value"] })) : others;

    let actorDta = response?.["3bb64421-f15f-4dda-adec-03c324c140a3"] || [];
    actors = (actorDta?.length > 0) ? actorDta?.map(dataObj => actorsData?.map(obj => (
      { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
    ))) : actors;
    this.setState(prevState => ({
      actors, others,
      showActorFields: !!actorDta.length
    }))
  }



  render() {
    let {  showActorFields, videoId, actors, others } = this.state;
    let { handleRoute,stage } = this.props;
    let { canUpdate }= permissionObj?.videos?.castNCrewModule;

    return (
      <div className="create-movie">
        <div className="whitebox">
          <div className="ccm-head flex align-items-center justify-content-between m-b-0">
            <h4>{constantText.cast_crew_text}</h4>
            <div className="status-head flex align-items-center">
              <BadgeBox className="create-movie-stage" status={stage?.title} />
              <div className="edit-btn">
                <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                  disabled={!canUpdate()}
                  buttonText={constantText.edit_video_text}
                  onClick={()=> canUpdate()? handleRoute(`/video/edit/${this.props.videoId}`): ""}
                />
              </div>
            </div>
          </div>
          <div className="cr-mov-tab p-b-30">
          </div>
          <div className="movieForm-tab">
            <div className="movie-f-wrap col-12">
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewCastAndCrew;
