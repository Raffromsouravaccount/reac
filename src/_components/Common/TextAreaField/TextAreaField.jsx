import React from "react";
import TextField from '@material-ui/core/TextField';

function TextAreaField(props) {
  const { name, label, id, value, rowsMax, className, onChange, multiline } = props;

  return (
    <TextField className={(value && value.length>0)? `${className} fill-value`: className}
      variant="outlined"
      multiline={multiline}
      label={label}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      rowsMax={rowsMax}
    />
  );
}

export default TextAreaField;
