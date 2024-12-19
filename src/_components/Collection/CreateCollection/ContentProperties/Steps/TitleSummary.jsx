import React, { Component } from "react";
import { connect } from "react-redux";

//Common Components
import FormRender from "../../../../Common/FormHelper/FormRender";

//Helper files
import { constantText } from "../../../../../_helpers/constants.text";

//images
import AccordianNormal from "images/arrow-icon.svg";

class TitleSummary extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { title_summary, global, handleChange, selectGroup, onBlur, setSelectDataArr, selectedTab, handleSearchableInput,
      handleTab, disabled } = this.props;
    return (
      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            <div className="row input-space-35">
              <FormRender
                id="formRender-section"
                form={title_summary} serverCall={true}
                onChange={(event, index) => handleChange(event, index, 'title_summary')}
                handleBlur={onBlur} isDisable={disabled}
                setSelectDataArr={(value, index) => setSelectDataArr('title_summary', index, value)}
                handleAutoCreateInput={(value, index) => handleSearchableInput(value, null, index, 'title_summary')}
                selectGroup = {selectGroup}
                handleAutoCreateInput={(value, index) => handleSearchableInput(value, null, index, 'title_summary')}
              />
            </div>
          </div>
        </div>
        {(global && global.length > 0) &&
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between m-b-30">
              <h4>{constantText.global_text}</h4>
            </div>
            <div className="col-12">
              <div className="row input-space-35">
                <FormRender id="formRenderOnChange"
                  form={global} serverCall={true}
                  onChange={(event, index) => handleChange(event, index, 'global')}
                  handleBlur={onBlur} isDisable={disabled}
                  setSelectDataArr={(value, index) => setSelectDataArr('global', index, value)}
                />
              </div>
            </div>
          </div>
        }

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            <div className="next-step-btn" data-test="handleTab-btn" onClick={event => handleTab(event, selectedTab + 1)}>
              {constantText.next_text}<AccordianNormal />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default TitleSummary;
