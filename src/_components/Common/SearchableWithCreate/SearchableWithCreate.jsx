import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import useDebounce from "./../../Common/UseDebounce/UseDebounce"

function isEquivalent(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
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
function checkStatus(group, value) {
  if (value.length > 0) {
    return value.some((item) => item.group === group);
  } else {
    return false;
  }
}
function getLanguageBasedValue(value, lang) {
  if (value) {
    let valArr = Array.isArray(value) ? [...value] : { ...value };
    let n =
      valArr?.translation &&
      valArr.translation?.filter((v) => {
        if (v.Code === lang?.Code) {
          return v;
        }
      });
    if (n && n.length) {
      valArr["DisplayName"] = n[0]["DisplayName"];
    }
    return Array.isArray(value) ? [...valArr] : { ...value, ...valArr };
  } else {
    return value;
  }
}
function getLanguageBasedOption(data, lang) {
  if (data) {
    const dataArr = [...data];
    let mappedData =
      dataArr.length &&
      dataArr?.map((m) => {
        const filteredName =
          m?.translation && m.translation.filter((t) => t.Code === lang?.Code);
        if (filteredName && filteredName.length) {
          m["DisplayName"] = filteredName[0]["DisplayName"];
        }
        return m;
      });
    return [...mappedData];
  } else {
    return data;
  }
}

const filter = createFilterOptions();

const processValues = (value, keyText, multiple) => {
  if(multiple) {
    value.forEach((item) => {
      if (item.inputValue) {
        item[keyText] = item.inputValue;
        delete item.inputValue;
      }
    });
  } else if(value) {
    if (value.inputValue) {
        value[keyText] = value.inputValue;
        delete value.inputValue;
      }
  }
}; 

const SearchableWithCreate = ({
  className,
  withoutCreate,
  name,
  id,
  label,
  placeholder,
  onBlur = () => {},
  onFocus,
  required,
  multiple,
  disabled,
  limitTags,
  moreText,
  disableCloseOnSelect = false,
  data,
  keyText,
  value,
  onChange,
  searchInput = () => {},
  error,
  errorMsg,
  onKeyPress,
  checkDeep = false,
  groupBy,
  disableOptionKey = "disabled",
  createPrefix= "Create",
  selectGroup,
  language
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
      () => {
        if (debouncedSearchTerm) {
          setIsSearching(true);
          searchInput(debouncedSearchTerm)
          .then(results => {
            setIsSearching(false);
          })
          .catch(err => {
            setIsSearching(false)
          });
        }
      },
      [debouncedSearchTerm]
    );


  return (
    <Autocomplete
      className={
        value && (value.length > 0 || value[keyText])
          ? `${className} fill-value`
          : className
      }
      id={id}
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
      value={language ? getLanguageBasedValue(value, language) : value}
      groupBy={groupBy ? groupBy : () => {}}
      getOptionSelected={(option, value) => {
        if (checkDeep) {
          return keyText ? isEquivalent(option, value) : option == value;
        } else {
          return keyText ? option[keyText] == value[keyText] : option == value;
        }
      }}
      freeSolo
      clearOnBlur
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (params.inputValue !== "" && withoutCreate !== true) {
          filtered.push({
            inputValue: params.inputValue,
            [keyText]: `${createPrefix} "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      getOptionDisabled={(option) => {
        if (option[disableOptionKey] !== undefined) {
          return option[disableOptionKey] === true;
        }
      }}
      disableCloseOnSelect={disableCloseOnSelect}
      onFocus={onFocus ? onFocus : () => {}}
      onBlur={
        onBlur 
      }
      onChange={(event, value) => {
        processValues(value, keyText, multiple);
        onChange(event, id, name, value);
      }}
      getLimitTagsText={(more) => `(+${more})`}
      getOptionLabel={(option) => {
        return keyText && option[keyText] ? option[keyText] : "";
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
        <React.Fragment>
          {multiple && (
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          )}
          {keyText ? option[keyText] : option}
        </React.Fragment>
      )}
      renderGroup={
        groupBy
          ? ({ key, group, children }) => (
              <React.Fragment key={key}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  style={{ marginRight: 8 }}
                  onChange={(e) => selectGroup(e, group)}
                  checked={checkStatus(group, value)}
                />
                {group}
                {children}
              </React.Fragment>
            )
          : null
      }
      loading={isSearching}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          onChange={(event) => {
            setSearchTerm(event.target.value)
          }}
          helperText={error ? errorMsg : null}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isSearching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchableWithCreate;
