import React from "react";
import PropTypes from "prop-types";

//Common Components
import Button from "../ButtonField/ButtonField";

//Helper files
import {constantText} from "../../../_helpers/constants.text";

//Icons
import MovieSquarIcon from "images/movie-squar-icon.svg";

const AddSchedule = ({ className, addSchedule }) => (
  <div className={`Schedule-box p-all-10 m-b-20 ${className}`}>
    <div className="repeat-box">
      <div className="icon-w-text">
        <MovieSquarIcon />
        <strong>{constantText.schedule_content_text}</strong>
      </div>
      <div className="add-btn create-btn">
        <Button buttonText="+" onClick={addSchedule} />
      </div>
    </div>
  </div>
);

AddSchedule.defaultProps= {
  className: ""
}

AddSchedule.propTypes= {
  className: PropTypes.string,
  addSchedule: PropTypes.func.isRequired
};

export default AddSchedule;
