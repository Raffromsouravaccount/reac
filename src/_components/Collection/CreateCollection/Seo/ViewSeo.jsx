import React, { Component } from "react";
import { connect } from "react-redux";

//Services
import { apiCalls } from "../../../../_services/common.service";

//Helper Files
import Config from "../../../../Config/config";
import ButtonField from "../../../Common/ButtonField/ButtonField";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import { constantText } from "../../../../_helpers/constants.text";
import { history } from '../../../../_helpers/history';
import { permissionObj } from "../../../../_helpers/permission";
//Images
import PublishIcon from "images/publish-icon.svg";

//Json
import SeoJson from "../../Schema/Seo.json";
import ViewDetails from "../../../Common/ViewDetail/ViewDetails";

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

class ViewSeo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      JSONSchema: DEFAULT_JSON(SeoJson) || [],
      contentId: null,
      action: 'Draft',
      status: null,
    };
  }

  componentDidMount() {
    let { collectionId } = this.props;
    this.setState({ contentId: collectionId || null }, this.fillSeo);
    this.getCollectionData(collectionId);
  }

  getCollectionData = async contentId => {
    let response = await apiCalls(`${Config.collectionProperties}/${contentId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  fillSeo = async () => {
    const { contentId, JSONSchema } = this.state;
    const url = `${Config.collectionSeo}/${contentId}`;
    const response = await apiCalls(url, "GET");
    if (response && response[0]) {
      const contentData = response[0];
      const copyJSON = [...JSONSchema];
      copyJSON.forEach((item) => {
        const value = contentData[item?.name] || "";
        item.value = item.type === "dropdown" ? (value === "" ? null : value) : value;
        item.touched = 0;
      });
      //checking form validity
      let updateObj = {
        JSONSchema: copyJSON,
        action: response?.action
      };
      
      this.setState(updateObj);
    }
  };
  handleRoute = route => {
    const { selectedTab } = this.props;
    history.push(route,{selectedTab : selectedTab});
  }
  handleMarkAsDone = (mode) => {
    const { selectedTab, markAsDone } = this.props;
    //markAsDone(selectedTab, mode);
  };
  

  render() {
    const {contentId, JSONSchema, status} = this.state;
    const { canCreate } = permissionObj?.collections;
    const { canUpdate } = permissionObj?.collections?.seoModule;

    return (
      <div>
        <div className="whitebox">
          <div className="drag-drop-wrap">
            <div className="ccm-head flex align-items-center justify-content-between">
               <h4>{constantText.seo_details_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div className="edit-btn">
                  <ButtonField
                    buttonText={constantText.edit_collection}
                    disabled={!canUpdate()}
                    className="zee-btn-field zee-full MuiButton-containedPrimary"
                    onClick={() => canUpdate()? this.handleRoute(`/collection/edit/${contentId}`): {}}
                  />
                </div>
              </div>
            </div>
            {JSONSchema && <ViewDetails allData={JSONSchema }  />}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewSeo;
