import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

//Common Components
import InputField from "../../Common/InputField/InputField";
import Editor from '../../Common/Editor/Editor';

//Helper files
import { requiredValidate } from "../../../_helpers/validation";
import { apiCalls } from './../../../_services/common.service';
import SelectWithSearch from "../../Common/SelectWithSearch/SelectWithSearch";

class TranslationFormFields extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
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
      if (url === '/castLists') {
        response = response.items.map((cast) => {
          return {
            castName: cast.contentData.castName || "N/A",
            contentId: cast.contentId,
          };
        });
      }
      setSelectDataArr(response.length>0 ? response : []);
    }
  };

  
  render() {
    let { fieldsData, handleChange, onEditorValueChange, handleMultiSelect, onBlur, error , isLocked, language} = this.props;
    let { type, label, data, value, required, multiline, multiple, errorMsg, charCountLimit, maxTextLength} = fieldsData;
    return (
      <Fragment>
        { type == "text" && (
          <div className="lang-f-half">
            <div className="field-half">
              <InputField
                {...fieldsData}
                id={`auto-${label}`}
                className={multiline ? `zee-textarea-field auto-zee-textarea-field` : `zee-input-field auto-zee-input-field`}
                onBlur={onBlur}
                onChange={handleChange}
                error={!!(error && requiredValidate(!!value)) || !!errorMsg}
                errorMsg={(error && requiredValidate(!!value)) || errorMsg}
                disabled={isLocked || fieldsData?.isDisabled}
                charCountLimit= {charCountLimit}
                maxLength= {maxTextLength}
              />
            </div>
            <div className="lang-translate-link">Translate</div>
          </div>
        )}
        {
          type == "texteditor" && (
            <div className="lang-f-full">
              <div className="label-w flex justify-content-between">
                <div className="editor-label">{required ? `${label} *` : label}</div>
                <div className="lang-translate-link">Translate</div>
              </div>
              <Editor
                {...fieldsData}
                id={`auto-${label}`}
                className="zee-texteditor-field auto-zee-texteditor-field"
                place
                onBlur={onBlur}
                onEditorValueChange={onEditorValueChange}
                error={!!(error && requiredValidate(!!value)) || !!errorMsg}
                errorMsg={(error && requiredValidate(!!value)) || errorMsg}
                disabled={isLocked || fieldsData?.isDisabled}
                charCountLimit= {charCountLimit}
                maxLength= {maxTextLength}
              />
            </div>
          )
        }
        {
          (type == "dropDown") && (
            <div className="lang-f-half">
              <div className="field-half">
                <SelectWithSearch
                  {...fieldsData}
                  id={`auto-${label}`}
                  limitTags={1}
                  moreText={"more"}
                  checkDeep={true}
                  className="zee-SelectWSearch-field auto-zee-SelectWSearch-field"
                  onChange={handleMultiSelect}
                  onBlur={onBlur}
                  data={data || []}
                  disableCloseOnSelect={multiple ? true : false}
                  error={!!(error && requiredValidate(multiple? !!value.length: value)) || !!errorMsg}
                  errorMsg={!!(error && requiredValidate(multiple? !!value.length: value)) || !!errorMsg}
                  disabled={isLocked}
                  language = {language}
                />
              </div>
            </div>
          )
        }
      </Fragment >
    );
  }
}

export default connect(null, {})(TranslationFormFields);
