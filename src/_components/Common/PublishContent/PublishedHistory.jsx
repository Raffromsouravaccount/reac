import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "../ButtonField/ButtonField";


//Helper files
import { constantText } from "../../../_helpers/constants.text";

const PublishedHistory = ({ className, canPublish, canUnPublish, publishHistory, publishContent, rescheduleContent, status }) => (
  <Fragment>
    <div className={`flex justify-content-between ${className}`}>
      <div className="main-title">{constantText.contentConstants.publishedHistory}</div>
      {(status === constantText.contentConstants.changed) ?
        <span>
          <Button
            className="transparent-republish-btn"
            variant="contained"
            disabled={canPublish ? false : true}
            buttonText={constantText.contentConstants.republishContent}
            onClick={event=> publishContent(event, publishHistory)} />
            &nbsp;&nbsp; | &nbsp;&nbsp;
          <Button
            className="transparent-republish-btn"
            variant="contained"
            disabled={canPublish ? false : true}
            buttonText={constantText.contentConstants.rescheduleContent}
            onClick={event=> rescheduleContent(event, publishHistory)} />
          </span>
        : null
      }
    </div>
    <div className="view-data-row flex">
      <div className="label">{constantText.create_movie_images_gc_text}</div>
      <div className="val">{publishHistory?.map(countryObj=> countryObj.title).join(", ")}</div>
    </div>
  </Fragment>
);

PublishedHistory.defaultProps = {
  className: "",
  publishHistory: []
}

PublishedHistory.propTypes = {
  className: PropTypes.string,
  canUnPublish: PropTypes.bool,
  publishHistory: PropTypes.array
};

export default PublishedHistory;
