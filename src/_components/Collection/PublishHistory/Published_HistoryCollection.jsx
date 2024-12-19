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

class PublishedHistoryCollection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentId: null,
      content_obj: {},
    };
  }

  handleRoute = (route) => {
    history.push(route);
  };
  handleBack = (state) => {
    const { contentId } = this.state;
    const path = (state === "view") ? `/collection/view/${contentId}` : `/collection/edit/${contentId}`;
    this.handleRoute(path);
  }
  componentDidMount() {
    let { match } = this.props;
    if (match?.params?.id) {
      this.setState({ contentId: match.params.id }, () => {
      this.getCollectionData();
      });
    }
  }

  getCollectionData = async() => {
    let {contentId} = this.state;
    let response = await apiCalls(`${Config.collectionPropertiesControlFields}/${contentId}`, 'GET', {});
    if (response) {
      this.setState({ content_obj: response })
    }
  }

  render() {
    let { content_obj, contentId } = this.state;
    const { state } = this.props;
    const { location } = this.props;
    const joinName = (obj) => {
      if (obj?.first_name || obj?.last_name) {
        return `${obj?.first_name} ${obj?.last_name}`;
      }
      else {
        return 'NA';
      }
    }
    return (
      <div>
        <div className="d-wrap c-n">
          <div className="bread-crumb top-minus-20">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link
                className = {`auto-breadCrum-Dashboard`}
                color="inherit"
                data-test="handleRoute"
                onClick={() => this.handleRoute("/dashboard")}
              >
                {constantText.dashBoard_text}
              </Link>
              <Link
                data-test="handle-route"
                className = {`auto-breadCrum-Collection`}
                color="inherit"
                onClick={() => this.handleRoute("/collections")}
              >
                {constantText.collection_text}
              </Link>
              {(state && state === "view") ? <Link
                data-test="view-handleRoute"
                color="inherit"
                className = {`auto-breadCrum-ViewCollection`}
                onClick={() => this.handleRoute(`/collection/view/${contentId}`)}
              >
                {constantText.view_collection}
              </Link> :
              <Link
              color="inherit"
              className = {`auto-breadCrum-EditCollection`}
              onClick={() => this.handleRoute(`/collection/edit/${contentId}`)}
            >
              {constantText.update_collections_text}
            </Link>}
              <Typography color="textPrimary">
                {constantText.published_history_breadcrum_text}
              </Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn">
              <span data-test="handleBack" onClick={() => this.handleBack(state)}>
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
                  {constantText.date_and_time_creation_text}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.createdAt
                    ? moment(content_obj?.createdAt).format(constantText.date_format_with_time)
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_of_release}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.publishedAt
                    ? moment(content_obj?.publishedAt).format(constantText.date_format_with_time)
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_last_published}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.publishedAt
                    ? moment(content_obj?.publishedAt).format(
                        constantText.date_format_with_time
                      )
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_last_unpublished}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.unpublishedAt
                    ? moment(content_obj?.unpublishedAt).format(
                        constantText.date_format_with_time
                      )
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_last_updated}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.lastModifiedOn
                    ? moment(content_obj?.lastModifiedOn).format(constantText.date_format_with_time)
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.date_and_time_of_need_work_comment_by_user}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.needWorkAt
                    ? moment(content_obj?.needWorkAt).format(constantText.date_format_with_time)
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.created_By_text}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.createdBy ? joinName(content_obj?.createdBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.last_updated_by_text}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.lastModifiedBy ? joinName(content_obj?.lastModifiedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.last_published_by_text}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.publishedBy ? joinName(content_obj?.publishedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.last_unpublished_by_text}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.unpublishedBy ? joinName(content_obj?.unpublishedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.archivedBy_text}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.archivedBy ? joinName(content_obj?.archivedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {constantText.status_text}
                </div>
                <div className="col-md-4 label-val">
                {location?.state?.title ? location?.state?.title : "NA"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PublishedHistoryCollection;
