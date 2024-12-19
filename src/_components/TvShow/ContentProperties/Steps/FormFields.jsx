import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

//Common Components
import InputField from "../../../Common/InputField/InputField";
import SelectWithSearch from "../../../Common/SelectWithSearch/SelectWithSearch";
import CheckBox from "../../../Common/CheckBox/CheckBox";
import DatePicker from "../../../Common/DatePicker/DatePicker";
import TimePicker from '../../../Common/TimePicker/TimePicker';
import Editor from '../../../Common/Editor/Editor';

//Services
import { apiCalls } from '../../../../_services/common.service';

//Helper files
import { requiredValidate } from "../../../../_helpers/validation";

class FormFields extends Component {
  constructor(props) {
    super(props);
    this.state= {}
  }

  componentDidMount= ()=> {
    let {fieldsData}= this.props;
    let {path, data}= fieldsData;
    if(path && data.length== 0) {
      this.serverCalls(name, path);
    }
  }

  serverCalls = async (name, url) => {
    let {setSelectDataArr}= this.props;
    let response= await apiCalls(url, 'GET', {});
    if (response) {
      setSelectDataArr(response.length>0 ? response : []);
    }
  };

  render() {
    let {error, fieldsData, handleChange, onEditorValueChange, handleMultiSelect, handleCheckBox, onBlur,
      handleDate, handleTime, disabled } = this.props;
    let { type, label, data, value, required, multiline, multiple, errorMsg} = fieldsData;

    return (
      <Fragment>
        {type == "text" && (
          <div className="col-md-6 col-lg-6">
            <InputField
              {...fieldsData}
              className={multiline ? `zee-textarea-field` : `zee-input-field`}
              onBlur={onBlur}
              onChange={handleChange}
              disabled={disabled}
              error={!!(error && requiredValidate(!!value)) || !!errorMsg}
              errorMsg={(error && requiredValidate(!!value)) || errorMsg}
            />
          </div>
        )}
        {type == "texteditor" && (
          <div className="col-12">
            <div className="editor-label">{required? `${label} *`: label}</div>
            <Editor
              {...fieldsData}
              className="zee-texteditor-field"
              place
              disabled={disabled}
              onBlur={onBlur}
              onEditorValueChange={onEditorValueChange}
              error={!!(error && requiredValidate(!!value)) || !!errorMsg}
              errorMsg={(error && requiredValidate(!!value)) || errorMsg}
            />
          </div>
        )}
        {(type == "dropDown") && (
          <div className="col-md-6 col-lg-6">
            <SelectWithSearch
              {...fieldsData}
              className="zee-SelectWSearch-field"
              onBlur={onBlur}
              onChange={handleMultiSelect}
              data={data || []}
              disabled={disabled}
              disableCloseOnSelect={multiple? true: false}
              error={!!(error && requiredValidate(multiple? !!value.length: value)) || !!errorMsg}
              errorMsg={!!(error && requiredValidate(multiple? !!value.length: value)) || !!errorMsg}
            />
          </div>
        )}
        {type == "checkbox" && (
          <div className="col-md-6 col-lg-6">
            <div className="m-b-30">
              <CheckBox
                {...fieldsData}
                checked={value}
                disabled={disabled}
                className="zee-checkbox-field"
                handleCheckBox={handleCheckBox}
              />
            </div>
          </div>
        )}
        {type == "date" && (
          <div className="col-md-6 col-lg-6">
            <DatePicker
              {...fieldsData}
              className="zee-input-field"
              disabled={disabled}
              onBlur={onBlur}
              onChange={handleDate}
              error={!!(error && requiredValidate(!!value)) || !!errorMsg}
              errorMsg={(error && requiredValidate(!!value)) || errorMsg}
            />
          </div>
        )}
        {type == "time" && (
          <div className="col-md-6 col-lg-6">
              <TimePicker
                {...fieldsData}
                className="zee-time-field"
                onBlur={onBlur}
                onChange={handleTime}
                disabled={disabled}
                error={!!(error && requiredValidate(!!value)) || !!errorMsg}
                errorMsg={(error && requiredValidate(!!value)) || errorMsg}
              />
          </div>
        )}
      </Fragment>
    );
  }
}

export default FormFields;
