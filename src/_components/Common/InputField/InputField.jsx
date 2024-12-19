import React from "react";
import TextField from "@material-ui/core/TextField";

const InputField = ({
  name, label, value, required, onChange, onBlur, id, className, multiline, disabled, error, errorMsg, helperText,
  charCountLimit, maxLength
}) => {
  return (
    <div className={(charCountLimit && maxLength) ? `pos-rel char-count-limit ${multiline? 'char-textarea': 'char-input'}
      ${error ? 'char-limit-error' : (value.length > charCountLimit) ? 'char-limit-warning' : ''}`: ''}>
      <TextField
        className={(value && value.length > 0) ? `${className} fill-value` : className}
        multiline={multiline}
        variant="outlined"
        autoComplete="off"
        label={label} name={name} value={value}
        onChange={event=> ((event.target.value== "" || event.target.value.trim()!= "") && onChange(event))}
        disabled={disabled}
        onBlur={onBlur ? onBlur : () => { }}
        id={id}
        required={required}
        error={error}
        helperText={error ? errorMsg : helperText ? helperText : null}
      />
      {charCountLimit && maxLength &&
        <div className={`char-count ${value.length > maxLength? 'num-error': (value.length > charCountLimit)?
          'num-warning': ''}`} >
          <span>{value?.length}</span>/<span>{maxLength}</span>
        </div>
      }
    </div>
  );
};

export default InputField;
