
import React, {useState} from "react";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import { constantText } from "../../../_helpers/constants.text";
import MomentUtils from '@date-io/moment'; // choose your lib
import { KeyboardDatePicker, DateTimePicker, MuiPickersUtilsProvider,KeyboardDateTimePicker } from '@material-ui/pickers';

function DatePicker({
  className,
  type,
  name,
  required,
  minDate,
  minDateValue = null,
  maxDateValue= null,
  checkOn,
  value,
  helperText = null,
  label,
  format = constantText.date_format_placeholder,
  placeholder,
  onBlur = () => {},
  onChange,
  disabled,
  error,
  errorMsg,
  withTime = false,
  id
}) {
  return (
    <div className="custom-date-picker">
      <TextField
        id={id}
        className={value ? `${className} fill-value` : className}
        name={name}
        variant="outlined"
        InputProps={{inputProps: { min: minDateValue, max: maxDateValue} }}
        minDate={minDateValue}
        label={label}
        value={value}
        type={type || "date"}
        required={required}
        InputLabelProps={{
          shrink: true,
        }}
        onBlur={onBlur}
        onChange={
          !minDate
            ? onChange
            : (event) => {

                let { value } = event?.target;
                const condition = checkOn ? checkOn : moment().format("YYYY-MM-DD");
                const Now = moment().format("YYYY-MM-DD");
                const sameOrAfter = checkOn ? (moment(value).isSameOrBefore(Now) && moment(value).isSameOrAfter(condition)) : moment(value).isSameOrAfter(condition);
                const sameOrBefore = checkOn ? (moment(value).isSameOrBefore(Now) && moment(value).isSameOrBefore(condition)) : moment(value).isSameOrBefore(condition);
                const After = checkOn ? (moment(value).isBefore(Now) && moment(value).isAfter(condition)) : moment(value).isAfter(condition);
                const Before = checkOn ? (moment(value).isBefore(Now) && moment(value).isBefore(condition)) : moment(value).isBefore(condition);

                if (
                  (minDate === "sameOrAfter" && sameOrAfter) ||
                  (minDate === "after" && After) ||
                  (minDate === "sameOrBefore" && sameOrBefore) ||
                  (minDate === "before" && Before)
                ) {
                  onChange(event);
                }
              }
        }
        disabled={disabled}
        error={error}
        helperText={errorMsg ? errorMsg :helperText?helperText:null}

      />
      <input
        className="custom-date-input"
        placeholder={ placeholder ? placeholder : constantText.date_format_placeholder}
        value={value ? (withTime ? moment(value).format(constantText.date_format_placeholder_with_time) : moment(value).format(format)): ""}
        disabled
      />
      {value && <span className="f-clear-datefield" id="onChangeBtn" onClick={
        ()=> onChange({ target: { value: "", triggerAutoSave: true } })
        }>x</span>}
    </div>
  );
}

function DatePickerNew({
  className,
  type,
  name,
  required,
  minDate,
  minDateValue = null,
  maxDateValue = null,
  checkOn,
  value,
  helperText = null,
  label,
  format = constantText.date_format_placeholder,
  placeholder,
  onBlur = () => {},
  onChange,
  disabled,
  error,
  errorMsg,
  minutesStep = 1,
  withTime = false,
  id
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDateChange = (arg) => {
    if(!arg) {
      return onChange({ target: { value: null, triggerAutoSave: true } });
    }
    if(type != 'datetime-local') {
      try {
        arg = new Date(moment(arg).format("YYYY-MM-DD"));
      } catch (error) { }
    }
    let event = { target: { value: arg } };
    if (minDate) {
      let { value: dateValue } = event.target;
      const condition = checkOn ? checkOn : moment().format("YYYY-MM-DD");
      const Now = moment().format("YYYY-MM-DD");
      const sameOrAfter = checkOn ? (moment(dateValue).isSameOrBefore(Now) && moment(dateValue).isSameOrAfter(condition)) : moment(dateValue).isSameOrAfter(condition);
      const sameOrBefore = checkOn ? (moment(dateValue).isSameOrBefore(Now) && moment(dateValue).isSameOrBefore(condition)) : moment(dateValue).isSameOrBefore(condition);
      const After = checkOn ? (moment(dateValue).isBefore(Now) && moment(dateValue).isAfter(condition)) : moment(dateValue).isAfter(condition);
      const Before = checkOn ? (moment(dateValue).isBefore(Now) && moment(dateValue).isBefore(condition)) : moment(dateValue).isBefore(condition);
      if (
        (minDate === "sameOrAfter" && sameOrAfter) ||
        (minDate === "after" && After) ||
        (minDate === "sameOrBefore" && sameOrBefore) ||
        (minDate === "before" && Before)
      ) {
        onChange(event);

      }
    } else {
      onChange(event);
    }
  }
  const handleBlur = () => {
    value && onBlur();
  }
  const minDateSelect = (mDate) => {
    if(mDate === 'sameOrAfter' || mDate === 'after') {
      return true
    }
  }
  const maxDateSelect = (mDate) => {
    if (mDate === 'sameOrBefore' || mDate === 'before') {
      return true;
    }
  }
  const getPicker = (PickerType, hideTab = false) => {
    return (
      <PickerType
        id={id}
        className={value ? `${className} fill-value` : className}
        name={name}
        label={label}
        variant="inline"
        inputVariant="outlined"
        minDate={minDateValue ? minDateValue : undefined}
        maxDate = {maxDateValue ? maxDateValue: undefined}
        disablePast = {minDateSelect(minDate)}
        disableFuture = {maxDateSelect(minDate)}
        error={error}
        helperText={errorMsg ? errorMsg : helperText ? helperText : null}
        emptyLabel={placeholder ? placeholder : constantText.date_format_placeholder}
        format={value ? (withTime ? constantText.date_format_placeholder_with_time : format) : ""}
        disabled={disabled}
        required={required}
        value={value || null}
        minutesStep={minutesStep}
        onClose={handleBlur}
        onChange={handleDateChange}
        hideTabs= {hideTab}
        open={isOpen}
        KeyboardButtonProps={{
          onFocus: e => {
            setIsOpen(true);
          }
        }}
        PopoverProps={{
          disableRestoreFocus: true,
          onClose: () => {
            setIsOpen(false);
            handleBlur();
          }
        }}
        InputProps={{
          onFocus: () => {
            setIsOpen(true);
          }
        }}
      />
    )
  }
  return (
    <div className="custom-date-picker-material">
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {
          type == 'datetime-local' ? getPicker(KeyboardDateTimePicker, true) : getPicker(KeyboardDatePicker)
        }
      </MuiPickersUtilsProvider>
      {value && <span className="f-clear-datefield" onClick={
        () => onChange({ target: { value: "", triggerAutoSave: true } })
      }>X</span>}
    </div>
  );
}


export default DatePickerNew;
