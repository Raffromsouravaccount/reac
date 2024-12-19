import React from 'react'
import PropTypes from "prop-types";

import LockIcon from 'images/lock-icon.svg';


const locked = (props) => (
  props.lock ?
    <div className="lock-screen">
      <div className="lock-dot-top"></div>
      <div className="lock-dot-bottom"></div>
      <div className="lock-dot-left"></div>
      <div className="lock-dot-right"></div>
      <div className="lock-user-info" onClick = {props.clicked}>
        <div className="loc-icon"><LockIcon /></div>
        <div className="user-name">{props.lockedBy}</div>
      </div>
      {props.children}
    </div>
    : props.children
);

locked.propTypes = {
  lock: PropTypes.bool,
  lockedBy: PropTypes.string,
  clicked: PropTypes.func
};

export default locked