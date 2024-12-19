/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const filter = createFilterOptions();

const AutoCreate = ({
  className, id, name, label, placeholder, required, disabled, disableCloseOnSelect, data,
  keyText, value, onChange, handleInputChange, onBlur, error, errorMsg, multiple
}) => {
  return (
    <Autocomplete
    className={(value && (value.length > 0 || value[keyText])) ? `${className} fill-value` : className}
      id={id}
      name={name}
      disabled={disabled}
      disableCloseOnSelect={disableCloseOnSelect}
      options={data}
      value={value}
      onBlur={onBlur ? onBlur : () => {}}
      onChange={(event, newValue) => onChange(event, id, name, newValue)}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            DisplayName: `Create "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      getOptionLabel={(option) => {
        return (keyText && option[keyText]) ? option[keyText] : option.inputValue||"" 
      }}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          {multiple &&
            <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
         }
          { (keyText && option[keyText]) ? option[keyText] : option.DisplayName }
        </React.Fragment>
      )}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} 
        label={label}
         variant="outlined"
         required={required}
         placeholder={placeholder}
         onChange={handleInputChange ? handleInputChange : () => {}}
         error={error}
         helperText={error ? errorMsg : null}
          />
      )}
    />
  );
}
export default AutoCreate;