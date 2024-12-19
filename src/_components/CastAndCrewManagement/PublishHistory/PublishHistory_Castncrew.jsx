import React, { Component } from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { constantText } from "../../../_helpers/constants.text";

import AngleLeftArrow from "images/angle-left-arrow.svg";
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";

import { apiCalls } from "../../../_services/common.service";

import moment from "moment";

class PublishedHistoryCastCrew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      castProfileData: null,
      id: null,
      content_obj: {},
      status:""
    };
  }

  handleRoute = (route) => {
    history.push(route);
  };

  handleBack = (state) => {
    const { id } = this.state;
    const path = (state === "view") ? `/cast/view/${id}` : `/cast/edit/${id}`;
    this.handleRoute(path);
  }

  componentDidMount() {
    let { match } = this.props;
    if (match?.params?.id) {
      this.setState({ id: match.params.id }, () => {
        this.fetchContentData();
      });
    }
  }

  fetchContentData = async () => {
    let { id } = this.state;
    let url = `${Config.createProfileUrl}/${id}`;
    let response = await apiCalls(url, "GET", {});
    this.setState({
      castProfileData: response
    });
  };

  render() {
    let { id ,castProfileData} = this.state;
    const { state } = this.props;
    return (
      <div>
      <div className="d-wrap c-n">
          <div className="bread-crumb top-minus-20">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link
                color="inherit"
                data-test="publishhistory-handle-route"
                onClick={() => this.handleRoute("/dashboard")}
              >
                {constantText.dashBoard_text}
              </Link>
              <Link
                color="inherit"
                data-test="handRoute-cast"
                onClick={() => this.handleRoute("/cast")}
                data-test="publishHistory-cast-profile-list"
              >
                {constantText.cast_profile_list}
              </Link>
              {(state && state === "view") ? <Link
                color="inherit"
                onClick={() => this.handleRoute(`/cast/view/${id}`)}
              >
                {constantText.view_profile}
              </Link> :
              <Link
              color="inherit"
              onClick={() => this.handleRoute(`/cast/edit/${id}`)}
            >
              {constantText.edit_profile}
            </Link>}
              <Typography color="textPrimary">
                {constantText.published_history_breadcrum_text}
              </Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn">
              <span data-test="publishHistory-handle-back" onClick={() => this.handleBack(state)}>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{constantText.published_history_heading}</span>
              </strong>
            </div>
          </div>
          <div className="whitebox m-b-30">
            <div className="col-12">
              <div className="row con-field-wrap p-b-20 p-t-20">
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_creation_profile}
                </div>
                <div className="col-md-8 label-val">
                  {castProfileData?.createdOn ? moment(castProfileData?.createdOn).format("DD-MMM-YYYY LT"):"NA"}
                </div>

                <div className="col-md-4 label-text">
                  {constantText.date_and_time_last_published}
                </div>
                <div className="col-md-8 label-val">
                  {
                    (castProfileData?.contentState?.title === constantText.castProfile.published && castProfileData?.modifiedOn) ?
                    moment(castProfileData?.modifiedOn).format(
                      "DD-MMM-YYYY LT"
                    ): "NA"
                  }
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_last_unpublished}
                </div>
                <div className="col-md-8 label-val">
                  {
                    (castProfileData?.contentState?.title === constantText.castProfile.unpublished && castProfileData?.modifiedOn) ?
                    moment(castProfileData?.modifiedOn).format(
                      "DD-MMM-YYYY LT"
                    ): "NA"
                  }
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_last_updated}
                </div>
                <div className="col-md-8 label-val">
                  {
                    (castProfileData?.modifiedOn) ?
                    moment(castProfileData?.modifiedOn).format(
                      "DD-MMM-YYYY LT"
                    ): "NA"
                  }
                </div>
                <div className="col-md-4 label-text">
                  {constantText.created_By_text}
                </div>
                <div className="col-md-8 label-val">
                  {castProfileData?.created_by?.first_name ? castProfileData?.created_by?.first_name : null}
                  {castProfileData?.created_by?.last_name ? (" " + castProfileData?.created_by?.last_name ): null}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.last_updated_by_text}
                </div>
                <div className="col-md-8 label-val">
                  {castProfileData?.modified_by?.first_name ? castProfileData?.created_by?.first_name : null}
                  {castProfileData?.modified_by?.last_name ? castProfileData?.created_by?.last_name : null}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.last_published_by_text}
                </div>
                <div className="col-md-8 label-val">
                  {
                    (castProfileData?.contentState?.title === constantText.castProfile.published) ?
                    (castProfileData?.modified_by?.first_name + " " + castProfileData?.modified_by?.last_name)
                    : "NA"
                  }
                </div>
                <div className="col-md-4 label-text">
                  {constantText.last_unpublished_by_text}
                </div>
                <div className="col-md-8 label-val">
                  {
                    (castProfileData?.contentState?.title === constantText.castProfile.unpublished) ?
                    (castProfileData?.modified_by?.first_name + " " + castProfileData?.modified_by?.last_name)
                    : "NA"
                  }
                </div>
                <div className="col-md-4 label-text">
                  {constantText.archivedBy_text}
                </div>
                <div className="col-md-8 label-val">
                  {
                    (castProfileData?.contentState?.title === constantText.castProfile.archived) ?
                    (castProfileData?.modified_by?.first_name + " " + castProfileData?.modified_by?.last_name)
                    : "NA"
                  }
                </div>
                <div className="col-md-4 label-text">
                  {constantText.status_text}
                </div>
                <div className="col-md-8 label-val">
                  {castProfileData?.contentState?.title ? castProfileData?.contentState?.title : "NA"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PublishedHistoryCastCrew;
