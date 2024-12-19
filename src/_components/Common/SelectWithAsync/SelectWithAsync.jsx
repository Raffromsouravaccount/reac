import React, { Fragment } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { constantText } from "../../../_helpers/constants.text";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CircularProgress from "@material-ui/core/CircularProgress";

export function isEquivalent(a, b) {
  var aProps = Object.getOwnPropertyNames(a?a:{});
  var bProps = Object.getOwnPropertyNames(b?b:{});
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}
export function checkStatus(group, value, children) {
  if(value?.length > 0){
    let filteredGroup = value.filter(item => item.group === group);
    return filteredGroup.length > 0 && filteredGroup.every(item => item.group === group && children.length === filteredGroup.length);
  }
  else {
    return false;
  }
}
export function getLanguageBasedValue(value, lang) {
  if (value) {
    let valArr = Array.isArray(value) ? [...value] : { ...value };
    let n =
      valArr?.translations &&
      valArr.translations?.filter((v) => {
        if (v?.code === lang?.code) {
          return v;
        }
      });
    if (n && n.length) {
      valArr["title"] = n[0]["title"];
    }
    return Array.isArray(value) ? [...valArr] : { ...value, ...valArr };
  } else {
    return value;
  }
}
export function getLanguageBasedOption(data, lang) {
  if (data) {
    const dataArr = [...data];
    let mappedData =
      dataArr.length &&
      dataArr?.map((m) => {
        const filteredName =
          m?.translation && m.translation.filter((t) => t?.code === lang?.code);
        if (filteredName && filteredName.length) {
          m["title"] = filteredName[0]["title"];
        }
        return m;
      });
    return [...mappedData];
  } else {
    return data;
  }
}

const SelectWithAsync = ({
  className,
  name,
  id ,
  label,
  placeholder,
  onBlur,
  onFocus,
  required,
  multiple,
  disabled,
  limitTags,
  moreText,
  disableCloseOnSelect,
  data,
  keyText,
  serverCalls,
  value,
  onChange,
  error,
  errorMsg,
  stopLoading,
  onKeyPress,
  checkDeep = false,
  groupBy,
  selectAllText = constantText.selectAllDropdownText,
  disableOptionKey = "disabled",
  selectGroup,
  language,
}) => {
  const [open, setOpen] = React.useState(false);
  const loading = open && stopLoading ? false : open && data?.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      if (active && serverCalls) {
        serverCalls();
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  const filterOptionsGroup = (options,{ inputValue }) => {
    const filtered = options.filter(e => keyText ? e[keyText].toLowerCase().includes(inputValue.toLowerCase()) : e.toLowerCase().includes(inputValue.toLowerCase()));
    if(inputValue){
      return filtered;
    }
    return [{ title: selectAllText, group: selectAllText}, ...filtered];
  }
  const filterOptions = (options,{ inputValue }) => {
    const filtered = options.filter(e => keyText ? e[keyText].toLowerCase().includes(inputValue.toLowerCase()) : e.toLowerCase().includes(inputValue.toLowerCase()));
    return filtered;
  }

  return (
    <Autocomplete
      className={
        value && (value.length > 0 || value[keyText])
          ? `${className} fill-value`
          : className
      }
      id={id}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      multiple={multiple}
      disabled={disabled}
      limitTags={limitTags}
      options={
        language
          ? data.length
            ? getLanguageBasedOption(data, language)
            : data
          : data
      }
      filterOptions={(data?.length && groupBy && !data?.every(e => e.group === data[0]?.group)) ? filterOptionsGroup : filterOptions}
      value={language ? getLanguageBasedValue(value, language) : value}
      groupBy={groupBy ? groupBy : () => {}}
      getOptionSelected={(option, value) => {
        if (checkDeep) {
          return keyText ? isEquivalent(option, value) : option == value;
        } else {
          return keyText ? option[keyText] == value[keyText] : option == value;
        }
      }}
      getOptionDisabled={(option) => {
        if (option[disableOptionKey] !== undefined) {
          return option[disableOptionKey] === true;
        }
      }}
      disableCloseOnSelect={disableCloseOnSelect}
      onFocus={onFocus ? onFocus : () => {}}
      onBlur={onBlur ? onBlur : () => {}}
      onChange={(event, value) => onChange(event, id, name, value)}
      onKeyPress={
        onKeyPress ? (event, index) => onKeyPress(event, id, name, index) : () => {}
      }
      getLimitTagsText={(more) => `(+${more})`}
      getOptionLabel={(option) => {
        return keyText && option[keyText] ? option[keyText] : option;
      }}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            key={index}
            onDelete={() => {
              getTagProps({ index }).onDelete();
              if (id) {
                document.getElementById(id).focus();
              }
            }}
            variant="outlined"
            label={keyText && option[keyText] ? option[keyText] : option}
          />
        ));
      }}
      renderOption={(option, { selected }) => (
        <Fragment>
          {multiple && (
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          )}
          {keyText ? option[keyText] : option}
        </Fragment>
      )}
      renderGroup={ groupBy ? ({key, group, children}) => {
        if(group === selectAllText){
          return (
            <div key={key}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginLeft: 8, marginRight: 8 }}
                onChange={(e) => selectGroup(e, group)}
                checked={data?.length === value?.length}
              />
              {group}
          </div>
          );
        }
        else {
          return (
            <Fragment key={key}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginLeft: 8, marginRight: 8 }}
              onChange={(e) => selectGroup(e, group)}
              checked={checkStatus(group, value, children)}
            />
            {group}
            {children}
          </Fragment>
          );
        }

      } : null}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={error ? errorMsg : null}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default SelectWithAsync;
