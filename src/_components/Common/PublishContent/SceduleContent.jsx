import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";

//Common Components
import Button from "../ButtonField/ButtonField";
import SelectWithSearch from "../SelectWithSearch/SelectWithSearch";
import DatePicker from "../DatePicker/DatePicker";

//Helper files
import { constantText } from "../../../_helpers/constants.text";

//Icons
import ClockIcon from "images/clock-icon.svg";
import TimetableIcon from "images/timetable-icon.svg";

const getSchIndex = (scheduleArr, i, totalSchedule) => {
  let updateSchObj = scheduleArr.find(item => (item.scheduleIndex || item.scheduleIndex == 0));
  return updateSchObj ? true : false;
}

const ScheduleContent = ({ className, scheduleData, removeSchedule, multiple, limitTags, moreText, keyText,
  handleScheduleData, scheduleContentAction, checkListDone, groupBy, selectGroup, updateSchedule, update, canPublish, totalSchedule, changedToSchedule }) => (
    <Fragment>
      {scheduleData?.map((data, index) => {
        const minutes = data.scheduledPublicationTime ? new Date(data.scheduledPublicationTime).getMinutes() : 0
        const dateError = (minutes % 5) ? constantText.schedule_validation_msg : ""
        return (
        <div className={`Schedule-box m-b-20 ${className}`} key={index}>
          <div className="ccm-head">
            <div className="repeat-box schedule-w-rem-btn">
              <h4>{`${constantText.schedule_text} ${(data.scheduleIndex || data.scheduleIndex == 0) ? (data.scheduleIndex + 1) : (getSchIndex(scheduleData, index, totalSchedule) ? totalSchedule + (index) : totalSchedule + (index + 1)) }`}</h4>
              <div className="remove-btn create-btn">
                <Button className="remove-schedule-btn" buttonText="-" onClick={event => removeSchedule(event, index)} />
              </div>
            </div>
          </div>
          <div className="col-12 pub-con-form p-b-20">
            <div className="row">
              <div className="col-md-6">
                <DatePicker className={`zee-input-field auto-secheduleDate-${index}`} value={data.scheduledPublicationTime} withTime={true} minDate={"sameOrAfter"}
                  name="scheduledPublicationTime" minDateValue={data.minDateValue} type="datetime-local" minutesStep={5}
                  onChange={event => handleScheduleData(event, index, "scheduledPublicationTime", event?.target?.value)} error={!!dateError} errorMsg={dateError}
                  />
              </div>
              <div className="col-md-6">
                <SelectWithSearch
                  className={`zee-SelectWSearch-field auto-countryGroup-${index}`}
                  label={constantText.create_movie_images_gc_text}
                  disableCloseOnSelect={multiple ? true : false}
                  limitTags={limitTags} moreText={moreText} keyText={keyText}
                  groupBy={groupBy ? (option) => option[groupBy] : null}
                  selectGroup={selectGroup ? (event, g) => selectGroup(event, g, index) : () => {}}
                  multiple={multiple} name="selectedCountry"
                  data={data.countryData?.length > 0 ? data.countryData : []} value={data.selectedCountry}
                  onChange={(event, id, name, value) => handleScheduleData(event, index, name, value)}
                />
              </div>
            </div>
            <div className="icon-w-text icon-w-14 m-b-10">
              <ClockIcon />{`${constantText.current_device_time_text} ${moment().format('hh:mm A')} IST`}
            </div>
            <div className="icon-w-text icon-w-14 m-b-10">
              <TimetableIcon className="gray" />{constantText.time_zone_ist_text}
            </div>
            <div className="row">
              <div className="col-md-6">
                  <Button className="zee-btn-field zee-full"
                    autoId={`${index}`}
                    variant="contained" color="primary"
                    buttonText={update ? constantText.contentConstants.updateScheduled : constantText.schedule_content_text}
                    disabled={(data?.scheduledPublicationTime && data?.selectedCountry?.length > 0 && canPublish && !dateError) ? false : true}
                    onClick={() => update ? updateSchedule(index, scheduleData) : scheduleContentAction(index, scheduleData)}
                  />
              </div>
            </div>
          </div>
        </div>
      )})}
    </Fragment>
  );

ScheduleContent.defaultProps = {
  className: "",
  limitTags: 1,
  moreText: "more",
  multiple: true,
  keyText: null,
  checkListDone: false
}

ScheduleContent.propTypes = {
  className: PropTypes.string,
  limitTags: PropTypes.number,
  moreText: PropTypes.string,
  multiple: PropTypes.bool,
  checkListDone: PropTypes.bool,
  keyText: PropTypes.string,
  removeSchedule: PropTypes.func.isRequired,
  handleScheduleData: PropTypes.func.isRequired,
  scheduleContentAction: PropTypes.func.isRequired
};

export default ScheduleContent;
