import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import Button from "../ButtonField/ButtonField";

//Helper files
import { constantText } from "../../../_helpers/constants.text";

//Icons
import EditIcon from "images/edit.svg";
import DeleteIcon from "images/delete.svg";

//css
import "./PublishContent.css";

const ScheduleHistory = ({ className, canPublish, scheduleHistory, publishScheduledContent, updateScheduleAction, deleteScheduleAction }) => (
  <div className={`box-sec history-box p-all-10 ${className}`}>
    <div className="main-title p-b-10">{constantText.sheduled_history_text}</div>
    {scheduleHistory?.map((data, index) => (
      <Fragment key={index}>
        <div className="schedule-row">
          <div className="action-row flex justify-content-between">
            {<div className="main-title">{`${constantText.schedule_text} ${index+1}`}</div>}
            <div className="action-div flex">
              <Button className="publish-btn schedule-publish-btn m-r-20" buttonText={constantText.publish_text} disabled={canPublish ? false : true} onClick={event=> publishScheduledContent(event, scheduleHistory[index])} />

              <Button className="schedule-publish-btn schedule-edit-btn m-r-20" buttonText={<EditIcon />} onClick={event=> updateScheduleAction(event, index, scheduleHistory[index])} />

              <Button className="delete-bg-btn flex m-r-20" buttonText={<DeleteIcon />} onClick={event=> deleteScheduleAction(event, scheduleHistory[index])} />

            </div>
          </div>
          <div className="view-data-row flex">
            <div className="label">{constantText.create_movie_images_gc_text}</div>
            <div className="val">{data?.country?.map(countryData=> countryData.title).join(", ")}</div>
          </div>
          <div className="view-data-row flex">
            <div className="label">{constantText.date_and_time_text}</div>
          <div className="val">
          {moment(data?.scheduledTime).format(constantText.date_format_without_time)}  {moment(data?.scheduledTime).format("hh:mm A")}
          </div>
        </div>
        </div>
      </Fragment>
    ))}
  </div>
);

ScheduleHistory.defaultProps = {
  className: ""
}

ScheduleHistory.propTypes = {
  className: PropTypes.string,
  scheduleHistory: PropTypes.array.isRequired,
  publishScheduledContent: PropTypes.func.isRequired,
  updateScheduleAction: PropTypes.func.isRequired,
  deleteScheduleAction: PropTypes.func.isRequired
};

export default ScheduleHistory;
