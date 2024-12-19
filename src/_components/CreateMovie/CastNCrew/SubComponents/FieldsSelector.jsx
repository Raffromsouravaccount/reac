import React, { Fragment } from 'react'

//Common Components
import InputField from "../../../Common/InputField/InputField";
import SelectWithSearch from "../../../Common/SelectWithSearch/SelectWithSearch";
import SearchableWithCreate from "../../../Common/SearchableWithCreate/SearchableWithCreate";

const fieldSelector = ({ 
  field,
  handleChange,
  handleMultiSelect,
  onBlur,
  onKeyPress,
  keyText,
  moreText,
  limitTags,
  name,
  groupIndex,
  disableCloseOnSelect, disabled,
  searchInput = () => {},
  index
  }) => (
    <Fragment >
      {field.type == "text" && (
        <div className="col-md-6 col-lg-6">
          <InputField data-test="inputField"
            {...field} id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
            className={field.multiline ? `zee-textarea-field auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}` : `zee-input-field auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        </div>
      )}
      {field.type == "dropDown" && (
        <div className="col-md-6 col-lg-6">
          <SelectWithSearch
            {...field}
            data-test ='SearchableWithCreatedropDown'
            id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
            className={`zee-SelectWSearch-field auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
            onChange={(event, id, name, value) => handleMultiSelect(event, value)}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            disableCloseOnSelect={disableCloseOnSelect}
            limitTags={2}
            moreText={moreText}
            keyText={keyText}
            disabled={disabled}
          />
        </div>
      )}
      {field.type == "SearchableWithCreate" && (
          <div key={index} className="col-md-6 col-lg-6">
          <SearchableWithCreate
            data-test ="SearchableWithCreateBtn"
            id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
            className={`zee-SelectWSearch-field auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
            {...field}
            searchInput={(value) => searchInput(value, index)}
            onChange={(event, id, name, value) => handleMultiSelect(event, value)}
            onBlur={onBlur}
            disableCloseOnSelect={field.multiple ? true : false}
            keyText={keyText}
            limitTags={2}
            moreText={moreText}
            value={field.value ? field.value : field.multiple ? [] : null}
            disabled={disabled}
          />
        </div>
      )}
    </Fragment>);

export default React.memo(fieldSelector)