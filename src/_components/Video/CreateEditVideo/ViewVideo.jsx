import React, { Component } from 'react';
import { connect } from "react-redux";

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
    let { jsonData } = props;
    this.state = {
      contentId: null, language: "",status: null,
      JSONSchema: DEFAULT_JSON(jsonData),
      stage: {title: "Draft"},
    }
  }

 async componentDidMount() {
    let { contentId } = this.props;



    this.setState( async () => {
      const url = `${Config.video.video}/${contentId}`;
      let response = await apiCalls(url, 'GET', {});
      if (response)
        this.setJsonData(response[0]);
    });
  }

  setJsonData = apiData => {
    let { JSONSchema } = this.state;
    JSONSchema = JSONSchema.map(data => {
      data.value = data.name == 'subtitleManifest' ? (apiData[data.name] ? {'title': 'True'} :{ 'title': 'False'}) :  apiData[data.name] || data.value;
      data.label = data.placeHolder || data.label;
      if(data.name == 'subtitleManifest'){
        data.keyText = 'title' 
      }
      return data;
    });
    this.setState(prevState => ({ JSONSchema }));
  }

  getVideoDetails = async () => {
    let { contentId } = this.props;
    let url = `${Config.videoProperties}/${contentId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  render() {
    const { JSONSchema, status } = this.state;
    const { contentId, handleRoute, stage } = this.props;
    let { canUpdate }= permissionObj?.videos?.videosModule;

    return (
      <div className="video-page">
        <div className="whitebox-bg">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4>{constantText.video_information_text}</h4>
            <div className="status-head flex align-items-center">
              {stage?.title && <BadgeBox className="create-movie-stage" status={stage?.title} dot={true} />}
              <div className="edit-btn">
                <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                  buttonText={constantText.edit_video_text}
                  disabled={!canUpdate()}
                  onClick={() => canUpdate()? handleRoute(`${Config.videoEdit}${contentId}`): ""}
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

export default connect(null, {})(ViewVideo);
