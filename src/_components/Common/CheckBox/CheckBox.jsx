import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

const CheckBox = ({ className, color, id, name, value, onBlur, disabled, label, required, error, errorMsg,
  labelPlacement, checked, handleCheckBox, helperText }) => (
    <FormControl required={required} error={error} component="fieldset">
      <FormControlLabel
        className={className || ""}
        disabled={disabled}
        control={<Checkbox className="zee-checkbox-field" color={color} id={id} name={name} value={value}
          checked={checked} onChange={handleCheckBox} onBlur={onBlur ? onBlur : () => { }} />}
        label={label}
        labelPlacement={labelPlacement}
      />
      <FormHelperText>{error ? errorMsg : helperText ? helperText : null}</FormHelperText>
    </FormControl>
  );

export default CheckBox;
