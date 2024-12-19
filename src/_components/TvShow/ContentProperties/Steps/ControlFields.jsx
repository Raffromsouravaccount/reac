import React, { Component } from "react";
import moment from "moment";

//Helper files
import { constantText } from '../../../../_helpers/constants.text';
import Config from '../../../../Config/config';

//Services
import { apiCalls } from "../../../../_services/common.service";

//images
import AccordianNormal from "images/arrow-icon.svg";

class ControlFields extends Component {
  constructor(props) {
    super(props);
    this.state= {
      controlFieldsData: {}
    }
  }

  componentDidMount = async () => {
    let { tvShowId } = this.props;
    let url = `${Config.tvShowControlFields}/${tvShowId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      this.setState(prevState => ({ controlFieldsData: response }));
    }
  }

  getFullName = (propName) => {
    let { controlFieldsData } = this.state;
    return controlFieldsData?.[propName]?.first_name + ' ' + controlFieldsData?.[propName]?.last_name;
  }

  getControlFieldsByPropName = (propName, subPropName, keyText, label) => {
    let { controlFieldsData } = this.state;
    let { control_fields_obj } = constantText;
    if (controlFieldsData?.[propName]?.length > 0) {
      return <div className="row">
        <div className="col-md-5 label-text">{control_fields_obj[label]}</div>
        {controlFieldsData?.[propName]?.map((data, index) => {
          const itemIndex = propName === "scheduleHistory" ? 0 : controlFieldsData?.[propName]?.length - 1;
          return (index === itemIndex) && <div className="col-md-7 label-val" key={index}>
            {`${moment(data?.[keyText]).format("DD MMMM, YYYY LT")}`}
          </div>
        })}
      </div>
    } else if (controlFieldsData?.[propName]?.length === 0 && controlFieldsData?.[subPropName]) {
      return <div className="row">
        <div className="col-md-5 label-text">{control_fields_obj[label]}</div>
        {<div className="col-md-7 label-val">
          {`${moment(controlFieldsData?.[subPropName]).format("DD MMMM, YYYY LT")}`}
        </div>}
      </div>
    }
  }

  render() {
    const { controlFieldsData }= this.state;
    let { selectedTab, handleTab } = this.props;
    let { control_fields_obj } = constantText;
    return (
      <div className="con-field-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            {controlFieldsData?.["createdAt"] &&
              <div className="row">
                <div className="col-md-5 label-text">{control_fields_obj.asset_create_date_time}</div>
                <div className="col-md-7 label-val">
                  {moment(controlFieldsData["createdAt"]).format("DD MMMM, YYYY LT")}
                </div>
              </div>
            }

            {this.getControlFieldsByPropName("scheduleHistory", "scheduledAt", "scheduledPublishOn", "schedule_publish_date_time")}

            {this.getControlFieldsByPropName("publishHistory", "publishedAt", "publishedOn", "last_published_date_time")}

            {this.getControlFieldsByPropName("unpublishHistory", "unpublishedAt", "publishedOn", "last_un_published_date_time")}

            {controlFieldsData?.["lastModifiedOn"] &&
              <div className="row">
                <div className="col-md-5 label-text">{control_fields_obj.last_updated_date_time}</div>
                <div className="col-md-7 label-val">{moment(controlFieldsData?.["lastModifiedOn"]).format("DD MMMM, YYYY LT")}</div>
              </div>
            }
            {controlFieldsData?.["dateNeedWork"] &&
              <div className="row">
                <div className="col-md-5 label-text">{control_fields_obj.need_work_date_time}</div>
                <div className="col-md-7 label-val">{moment(controlFieldsData?.["dateNeedWork"]).format("DD MMMM, YYYY LT")}</div>
              </div>
            }
            {controlFieldsData?.["archivedAt"] &&
              <div className="row">
                <div className="col-md-5 label-text">{control_fields_obj.archived_date_time}</div>
                <div className="col-md-7 label-val">{moment(controlFieldsData?.["archivedAt"]).format("DD MMMM, YYYY LT")}</div>
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
            <div className="prev-step-btn" onClick={event => handleTab(event, selectedTab - 1)}>
              <AccordianNormal /> {constantText.previous_text}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlFields;
