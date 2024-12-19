import React, { Component } from "react";

///Common Components
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper Files
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";

//Icons
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : item.type === "dropdown"
          ? null
          : ""),
        (item.touched = 0);
      item.valid = true;
      return item;
    });
  }
};

class ViewSeoDetails extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    this.state = {
      videoId: this.props.videoId,
      language: "",
      JSONSchema: DEFAULT_JSON(jsonData),

      stage: { title: "Draft" },
    };
  }

  async componentDidMount() {
    let { videoId } = this.props;

    this.setState(async () => {
      const url = `${Config.video.videoSeo}/${videoId}`;
      let response = await apiCalls(url, "GET", {});
      if (response) this.setJsonData(response);
    });
  }

  setJsonData = (apiData) => {
    let { JSONSchema } = this.state;
    JSONSchema = JSONSchema.map((data) => {
      if (data.name === "redirectionType") {
        data.value = apiData["RedirectionType"] || data.value;
        data.label = data.placeHolder || data.label;
      } else {
        data.value = apiData[data.name] || data.value;
        data.label = data.placeHolder || data.label;
      }
      return data;
    });
    this.setState((prevState) => ({ JSONSchema }));
  };

  render() {
    const { JSONSchema } = this.state;
    const { videoId, handleRoute, stage } = this.props;
    let { canUpdate } = permissionObj?.videos.seoModule;

    return (
      <div>
        <div className="whitebox">
          <div className="drag-drop-wrap">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>{constantText.seo_details_text}</h4>
              <div className="status-head flex align-items-center">
                {stage?.title && (
                  <BadgeBox
                    className="create-video-stage"
                    status={stage?.title}
                  />
                )}
                <div className="edit-btn">
                  <ButtonField
                    className="zee-btn-field zee-full MuiButton-containedPrimary"
                    buttonText={constantText.edit_video_text}
                    disabled={!canUpdate()}
                    onClick={() =>
                      canUpdate()
                        ? handleRoute(
                            `${constantText.video_edit_route}/${this.state.videoId}`
                          )
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
            {JSONSchema && <ViewDetails allData={JSONSchema} />}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewSeoDetails;
