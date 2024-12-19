import React, { Fragment, useState } from "react";
import moment from 'moment';
import TimePickerComp from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

//icons
import ClockIcon from 'images/clock-icon.svg';

const TimePicker= ({ className, name, id, label, required, value, format, onChange, onBlur, disabled,
  error, errorMsg })=> {
  let [isOpen, setIsOpen]= useState(false);
  return (
    <Fragment>
      <div className={`time-input-wrap ${(value || isOpen)? 'f-focus': ''}`}>
      <ClockIcon />
      <TimePickerComp
        id={id}
        autoComplete={'off'}
        className={error? `${className} error-border`: className}
        name={name}
        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
        value={value? moment(value, 'HH:mm:ss'): value}
        onChange={onChange}
        onOpen={()=> setIsOpen(true)}
        disabled={disabled}
        onClose={()=> {
          setIsOpen(false);
          onBlur? onBlur(): ()=> {}
        }}
      />
      <label className="p-text"><span>{label} {format}{required? ' *':''}</span></label>
      {error && <span className="error-msg">{errorMsg}</span>}
      </div>
    </Fragment>
  )
}

export default TimePicker;
