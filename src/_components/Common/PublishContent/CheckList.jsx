import React, { Fragment } from "react";
import PropTypes from "prop-types";

const CheckList = ({ className, checkListArr, markAsDoneText, partialltDoneText }) => (
  <Fragment>
    <ul className={className}>
      {checkListArr?.map((data, index) => (
        <li className={`${data.done ? "checklist-done" : ""}`} key={index}>
          <span className="tick-icon">
            <data.icon />
          </span>
          <h6>{data.label}</h6>
          <p>{data.done ? markAsDoneText : partialltDoneText}</p>
        </li>
      ))}
    </ul>
  </Fragment>
);

CheckList.defaultProps= {
  className: "",
  checkListArr: [],
  markAsDoneText: "",
  partialltDoneText: ""
};

CheckList.propTypes= {
  className: PropTypes.string,
  checkListArr: PropTypes.arrayOf(PropTypes.object),
  markAsDoneText: PropTypes.string,
  partialltDoneText: PropTypes.string
}

export default CheckList;
