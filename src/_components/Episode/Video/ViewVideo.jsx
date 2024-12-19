import React, { Component } from 'react';

//Common Components
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";

//Services
import { apiCalls } from '../../../_services/common.service';

//Helper Files
import Config from '../../../Config/config';
import { permissionObj } from '../../../_helpers/permission';

//Constant files
import { constantText } from '../../../_helpers/constants.text';
import { DEFAULT_JSON } from "../../../_helpers/util"

//Icons

//css
import "../../../../public/css/Common/CreateEditVideo.css";
import BadgeBox from '../../Common/BadgeBox/BadgeBox';


class ViewVideo extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    this.state = {
      episodeId: null, language: "",
      JSONSchema: DEFAULT_JSON(jsonData)
    }
  }

 async componentDidMount() {
    let { episodeId } = this.props;



    this.setState( async () => {
      const url = `${Config.episode.video}/${episodeId}`;
      let response = await apiCalls(url, 'GET', {});
      if (response)
        this.setJsonData(response[0]);
    });
  }

  setJsonData = apiData => {
    let { JSONSchema } = this.state;
    JSONSchema = JSONSchema?.map(data => {
      data.value =
        apiData[data.name] === true
          ? { title: "True" }
          : apiData[data.name] === false
          ? { title: "False" }
          : apiData[data.name] || data.value;
      data.label = data.placeHolder || data.label;
      if (data.name === "subtitleManifest") {
        data.keyText = "title";
      }
      return data;
    });
    this.setState(prevState => ({ JSONSchema }));
  }

  render() {
    const { JSONSchema } = this.state;
    const { handleRoute, stage } = this.props;
    let { canUpdate }= permissionObj?.movies?.videosModule;

    return (
      <div className="video-page">
        <div className="whitebox-bg">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4>{constantText.video_information_text}</h4>
            <div className="status-head flex align-items-center">
              {stage && <BadgeBox className="create-movie-stage" status={stage} />}
              <div className="edit-btn">
                <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                  buttonText={constantText.tv_show_episode_text.edit}
                  disabled={!canUpdate()}
                  onClick={handleRoute}
                />
              </div>
            </div>
          </div>
          {JSONSchema && <ViewDetails  allData={JSONSchema }  />}

        </div>
      </div>
    )
  }
}

export default ViewVideo;
