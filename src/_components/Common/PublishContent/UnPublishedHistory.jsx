import React from "react";
import PropTypes from "prop-types";

//Helper files
import { constantText } from "../../../_helpers/constants.text";

const UnpublishedHistory = ({ className, unPublishedHistory }) => (
  <div className={`box-sec history-box p-all-10 ${className}`}>
    <div className="main-title">{constantText.un_published_history_text}</div>
    <div className="view-data-row flex">
      <div className="label">{constantText.create_movie_images_gc_text}</div>
      <div className="val">{unPublishedHistory?.country?.map(countryObj=> countryObj.title).join(", ")}</div>
    </div>
  </div>
);

UnpublishedHistory.defaultProps = {
  className: ""
}

UnpublishedHistory.propTypes = {
  className: PropTypes.string,
  unPublishedHistory: PropTypes.object.isRequired
};

export default UnpublishedHistory;
