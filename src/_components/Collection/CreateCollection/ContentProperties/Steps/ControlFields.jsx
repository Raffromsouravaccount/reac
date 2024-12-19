import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

//Helper files
import { constantText } from "../../../../../_helpers/constants.text";

//images
import AccordianNormal from "images/arrow-icon.svg";

class ControlFields extends Component {
  constructor(props) {
    super(props);
  }

  getFullName = (propName) => {
    let { controlFieldsData } = this.props;
    return controlFieldsData?.[propName]?.first_name + ' ' + controlFieldsData?.[propName]?.last_name;
  }

  render() {
    let { selectedTab, handleTab, controlFieldsData } = this.props;
    let { control_fields_obj } = constantText;
    return (
      <div className="con-field-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            {controlFieldsData?.["createdAt"] &&
              <div className="row">
                <div className="col-md-5 label-text">{constantText.date_of_creation}</div>
                <div className="col-md-7 label-val">{moment(controlFieldsData["createdAt"]).format("DD MMMM, YYYY LT")}</div>
              </div>
            }

            {controlFieldsData?.["createdBy"] &&
              <div className="row">
                <div className="col-md-5 label-text">{constantText.created_By_text}</div>
                <div className="col-md-7 label-val">{this.getFullName("createdBy")}</div>
              </div>
            }

            {controlFieldsData?.["lastModifiedBy"] &&
              <div className="row">
                <div className="col-md-5 label-text">{constantText.last_updated_by_text}</div>
                <div className="col-md-7 label-val">{this.getFullName("lastModifiedBy")}</div>
              </div>
            }

            {controlFieldsData?.["publishedBy"] &&
              <div className="row">
                <div className="col-md-5 label-text">{control_fields_obj.last_published_by}</div>
                <div className="col-md-7 label-val">{this.getFullName("publishedBy")}</div>
              </div>
            }

            {controlFieldsData?.["unpublishedBy"] &&
              <div className="row">
                <div className="col-md-5 label-text">{control_fields_obj.last_un_published_by}</div>
                <div className="col-md-7 label-val">{this.getFullName("unpublishedBy")}</div>
              </div>
            }

            {controlFieldsData?.["archivedBy"] &&
              <div className="row">
                <div className="col-md-5 label-text">{constantText.archivedBy_text}</div>
                <div className="col-md-7 label-val">{this.getFullName("archivedBy")}</div>
              </div>
            }

          </div>
        </div>

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            <div className="prev-step-btn" data-test="handle-tab-button" onClick={event => handleTab(event, selectedTab - 1)}>
              <AccordianNormal /> {constantText.previous_text}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlFields;
