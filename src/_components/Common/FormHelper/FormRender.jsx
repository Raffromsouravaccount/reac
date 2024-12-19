import React, { Component, Fragment } from "react";

//Common Components
import InputField from "../InputField/InputField";
import CheckBox from "../CheckBox/CheckBox";
import SelectWithSearch from "../SelectWithSearch/SelectWithSearch";
import SelectWithAsync from "../SelectWithAsync/SelectWithAsync";
import AutoCreate from "../../Common/AutoCreate/AutoCreate";
import SearchableWithCreate from "../../Common/SearchableWithCreate/SearchableWithCreate";
import Editor from "../Editor/Editor";
import DatePicker from "../DatePicker/DatePicker";
import TimePicker from "../TimePicker/TimePicker";
import RadioButton from "../RadioButton/RadioButton";

//Services
import { apiCalls } from "../../../_services/common.service";

class FormRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopLoading: false,
    };
  }

  componentDidMount = () => {
    let { form, serverCall = false } = this.props || [];
    if (serverCall) {
      form?.forEach((fieldsData, index) => {
        let { path, data, type } = fieldsData || {};
        if (path && data.length == 0) {
          if(type !== 'dropdownAsync' && type !== 'SearchableWithCreate') {
            this.serverCalls(index, path);
          }
        }
      });
    }
  };

  serverCalls = async (index, url, loader = true) => {
    let { setSelectDataArr, form } = this.props || {};
    let response = await apiCalls(url, "GET", {}, "", loader);
    if (response && setSelectDataArr) {
      setSelectDataArr(response?.length > 0 ? response : [], index);
    }
    else if(setSelectDataArr){
      setSelectDataArr([], index);
      this.setState({stopLoading: true});
    }
  };

  InputBuilder = (form, onChange, handleAutoCreate, handleAutoCreateInput, handleBlur, isDisable = false,
    selectGroup, index, isSkipAvailable, groupIndex) => {
    const { type, value, label, name, col = "col-md-12 col-lg-12",
      placeholder, data, validation = {}, minDate, minDateValue, maxDateValue, checkOn, withoutCreate, createPrefix = "Create", format, touched, multiple = false,
      groupBy, valid, errorText,helperText, path, display = true, disabled = false, withTime = false, ...rest } = form;
    let inputElement = null;
    const { stopLoading } = this.state;
    switch (type) {
      case "sectionMultiple":
        const { sectionMultipleBlock } = this.props || {};
        inputElement = <Fragment key={index}>{sectionMultipleBlock}</Fragment>;
        break;
      case "text":
        inputElement = (
          <div key={index} className={col}>
            <InputField
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              data-test="component-inputField"
              className={`zee-input-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              name={name}
              label={label}
              disabled={isDisable || disabled}
              onChange={(e) => onChange(e, index)}
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              value={value}
              required={!!validation?.required}
              charCountLimit= {validation?.charCountLimit}
              maxLength= {validation?.maxLength}
              error={!!errorText}
              errorMsg={errorText}
              helperText={helperText}
            />
          </div>
        );

        break;
      case "textarea":
        inputElement = (
          <div key={index} className={col}>
            <InputField
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              data-test="component-inputField"
              multiline
              className={`zee-textarea-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              onChange={(e) => onChange(e, index)}
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              disabled={isDisable  || disabled}
              name={name}
              value={value}
              label={label}
              required={!!validation?.required}
              charCountLimit= {validation?.charCountLimit}
              maxLength= {validation?.maxLength}
              error={!!errorText}
              errorMsg={errorText}
              helperText={helperText}
            />
          </div>
        );
        break;
      case "dropdown":
        inputElement = display ? (
          <div key={index} className={col}>
            <SelectWithSearch
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-SelectWSearch-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              label={label}
              name={name}
              limitTags={2}
              multiple={multiple}
              onChange={(e, id, name, value) =>
                onChange({ target: { value: value } }, index)
              }
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              placeholder={placeholder}
              disabled={isDisable  || disabled}
              disableCloseOnSelect={multiple ? true : false}
              keyText={form?.keyText}
              groupBy={groupBy ? (option) => option[groupBy] : null}
              selectGroup={(event, group) => selectGroup(event, group, index)}
              value={value ? value : multiple ? [] : null}
              required={!!validation?.required}
              helperText={helperText}
              error={!!errorText}
              errorMsg={errorText}
              data={data}
            />
          </div>
        ) : null;
        break;
      case "dropdownAsync":
        inputElement = display ? (
          <div key={index} className={col}>
            <SelectWithAsync
              className={`zee-SelectWSearch-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              id={groupIndex? `${name}_${groupIndex}`: name}
              label={label}
              name={name}
              limitTags={2}
              stopLoading={stopLoading}
              multiple={multiple}
              onChange={(e, id, name, value) =>
                onChange({ target: { value: value } }, index, value)
              }
              serverCalls={() =>
                path ? this.serverCalls(index, path, false) : () => {}
              }
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              placeholder={placeholder}
              disabled={isDisable  || disabled}
              disableCloseOnSelect={multiple ? true : false}
              keyText={form?.keyText}
              groupBy={groupBy ? (option) => option[groupBy] : null}
              selectGroup={(event, group) => selectGroup(event, group, index)}
              value={value ? value : multiple ? [] : null}
              required={!!validation?.required}
              error={!!errorText}
              errorMsg={errorText}
              data={data}
            />
          </div>
        ) : null;
        break;
      case "conditionalDropdown":
        inputElement = display ? (
          <div key={index} className={col}>
            <SelectWithSearch
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-SelectWSearch-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              label={label}
              name={name}
              multiple={multiple}
              onChange={(e, id, name, value) =>
                onChange({ target: { value: value } }, index)
              }
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              placeholder={placeholder}
              disabled={isDisable  || disabled}
              keyText={form?.keyText}
              groupBy={groupBy ? (option) => option[groupBy] : null}
              disableCloseOnSelect={multiple ? true : false}
              value={value ? value : multiple ? [] : null}
              required={!!validation?.required}
              error={!!errorText}
              errorMsg={errorText}
              data={data}
            />
          </div>
        ) : null;
        break;
      case "autocreate":
        inputElement = display ? (
          <div key={index} className={col}>
            <AutoCreate
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-SelectWSearch-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              name={name}
              multiple={multiple}
              label={label}
              placeholder={""}
              disabled={isDisable  || disabled}
              disableCloseOnSelect={multiple ? true : false}
              keyText={form?.keyText}
              handleInputChange={
                handleAutoCreateInput
                  ? (event) => handleAutoCreateInput(event, index)
                  : () => {}
              }
              onChange={(e, id, name, value) =>
                handleAutoCreate({ target: { value } }, index)
              }
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              groupBy={groupBy ? (option) => option[groupBy] : null}
              selectGroup={selectGroup ? selectGroup : () => {}}
              data={data}
              value={value ? value : multiple ? [] : null}
              required={!!validation?.required}
              error={!!errorText}
              errorMsg={errorText}
            />
          </div>
        ) : null;
        break;
      case "textEditor":
        inputElement = (
          <div key={index} className={col}>
            <div className="editor-label">
              {!!validation?.required ? `${label} *` : label}
            </div>
            <Editor
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              {...rest}
              className={`zee-texteditor-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              place
              disabled={isDisable  || disabled}
              onEditorValueChange={inputVal =>
                onChange({ target: { value: inputVal } }, index)
              }
              value={value || ""}
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              charCountLimit= {validation?.charCountLimit}
              maxLength= {validation?.maxLength}
              error={!!errorText}
              errorMsg={errorText}
            />
          </div>
        );
        break;
      case "time":
        inputElement = (
          <div key={index} className={col}>
            <TimePicker
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-time-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              name={name}
              label={label}
              disabled={isDisable || !isSkipAvailable  || disabled}
              onChange={(e) =>
                onChange({ target: { value: e && e.format(format ? format : 'HH:mm:ss') } }, index)
              }
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              value={value}
              required={!!validation?.required}
              error={!!errorText}
              errorMsg={errorText}
            />
          </div>
        );
        break;
      case "date":
        inputElement = (
          <div key={index} className={col}>
            <DatePicker
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-input-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              type={type}
              name={name}
              format={format}
              placeholder={placeholder}
              minDateValue={minDateValue}
              maxDateValue={maxDateValue}
              minDate={minDate}
              checkOn={checkOn ? checkOn : null}
              label={label}
              disabled={isDisable  || disabled}
              onChange={(e) => {
                onChange(e, index)
              }}
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              value={value}
              required={!!validation?.required}
              error={!!errorText}
              helperText={helperText}
              errorMsg={errorText}
            />
          </div>
        );
        break;
      case "datetime-local":
        inputElement = (
          <div key={index} className={col}>
            <DatePicker
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-input-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              type={type}
              name={name}
              format={format}
              placeholder={placeholder}
              minDate={minDate}
              withTime={withTime}
              checkOn={checkOn ? checkOn : null}
              label={label}
              disabled={isDisable  || disabled}
              onChange={(e) => {
                onChange(e, index)
              }}
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              value={value}
              required={!!validation?.required}
              error={!!errorText}
              errorMsg={errorText}
            />
          </div>
        );
        break;
      case "checkbox":
        inputElement = (
          <div key={index} className={col}>
            <div className="m-b-30">
              <CheckBox
                id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
                className={`zee-checkbox-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
                label={!!validation?.required ? `${label} *` : label}
                name={name}
                handleCheckBox={(e, value) => {
                  onChange({ target: { value } }, index)
                }}
                disabled={isDisable  || disabled}
                labelPlacement={form?.labelPlacement}
                checked={value || false}
                required={!!validation?.required}
                error={!!errorText}
                errorMsg={errorText}
                helperText={helperText}
              />
            </div>
          </div>
        );
        break;
      case "SearchableWithCreate":
        inputElement = (
          <div key={index} className={col}>
            <SearchableWithCreate
              id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
              className={`zee-SelectWSearch-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
              label={label}
              name={name}
              limitTags={2}
              multiple={multiple}
              searchInput={(value) => handleAutoCreateInput(value, index)}
              onChange={(e, id, name, value) => {
                onChange({ target: { value: value } }, index);
              }}
              withoutCreate={withoutCreate || null}
              createPrefix={createPrefix ? createPrefix : null}
              onBlur={handleBlur ? () => handleBlur(index) : () => {}}
              placeholder={placeholder}
              disabled={isDisable  || disabled}
              disableCloseOnSelect={multiple ? true : false}
              keyText={form?.keyText}
              groupBy={groupBy ? (option) => option[groupBy] : null}
              selectGroup={selectGroup ? selectGroup : () => {}}
              value={value ? value : multiple ? [] : null}
              required={!!validation?.required}
              error={!!errorText}
              errorMsg={errorText}
              data={data}
            />
          </div>
        );
        break;
      case "radio":
        inputElement = display ? (
          <div key={index} className={col}>
            <div className="m-b-30 status-s">
              <RadioButton
                id={`auto-${name}-${ groupIndex ? groupIndex : 0 }-${index}`}
                className={`zee-radio-field auto-${label ? label.split(' ').join(''): label}-${ groupIndex ? groupIndex : 0 }-${index}`}
                areaLabel={form?.areaLabel}
                labelText={!!validation?.required ? `${label} *` : label}
                name={name}
                value={value}
                onChange={(event) => onChange(event, index)}
                labelPlacement={form?.labelPlacement}
                data={data}
              />
            </div>
          </div>
        ) : null;
        break;
      default:
        break;
    }
    return inputElement;
  };
  render() {
    const { form, onChange, handleAutoCreate, handleAutoCreateInput, handleBlur, selectGroup = () => {},
      isDisable, isSkipAvailable = true, groupIndex } = this.props;
    const renderedForm = form?.map((item, index) =>
      this.InputBuilder(item, onChange, handleAutoCreate, handleAutoCreateInput, handleBlur, isDisable,
        selectGroup, index, isSkipAvailable, groupIndex)
    );
    return renderedForm;
  }
}
export default FormRender;
