import React, { Component } from "react";

//Common Components
import FormRender from "../../../Common/FormHelper/FormRender";

//Helper files
import { constantText } from "../../../../_helpers/constants.text";

//images
import AccordianNormal from "images/arrow-icon.svg";

//css
import '../../../../../public/css/Common/GlobalField.css';

class TitleSummary extends Component {
  constructor(props) {
    super(props);
  }

  getMultipleSectionUI = (headerName, headerData, label, addRemoveCallback,selectGroup) => {
    let { handleChange, onBlur, setSelectDataArr, disabled } = this.props;
    return (
        <div className="global-wrap">
          {headerData?.map((dataArr, dataArrIndex) => (
            <div className="global-row" key={dataArrIndex}>
              <div className="add-plush-row top-title">
                <div className="top-text">{`${constantText.special_category_text_set} ${dataArrIndex >= 0 ? ` - ${dataArrIndex + 1}` : ''}`}</div>
                <div className="add-another-f-btn create-btn">
                  <div className={`${dataArrIndex > 0 ? `remove-btn auto-delete-${dataArrIndex}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                    id="addRemoveMultipleFieldsBtn" onClick={() => addRemoveCallback("specialCategory", dataArrIndex > 0 ? dataArrIndex : null)}>
                    <span className="plush-icon-btn"></span>
                  </div>
                </div>
              </div>

              <div className="row input-space-35">
                {<FormRender key={dataArrIndex}
                  form={dataArr} serverCall={true}
                  onChange={(event, index) => handleChange(event, dataArrIndex, index, headerName)}
                  handleBlur={onBlur} isDisable={disabled}
                  selectGroup={(event, group, index) => selectGroup(event, group, dataArrIndex, index, headerName)}
                  setSelectDataArr={(value, index) => setSelectDataArr(headerName, dataArrIndex, index, value)}
                />}
              </div>
            </div>
          ))}
        </div>
    )
  }

  render() {
    let { title_summary, handleChange, specialCategory, onBlur, setSelectDataArr, selectedTab, addRemoveMultipleFields,
      handleTab, disabled,selectGroup } = this.props;
    return (
      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            <div className="row input-space-35">
              <FormRender
                id="formRenderOnChange"
                form={title_summary} serverCall={true}
                onChange={(event, index) => handleChange(event, null, index, 'title_summary')}
                handleBlur={onBlur} isDisable={disabled}
                setSelectDataArr={(value, index) => setSelectDataArr('title_summary', null, index, value)}
                selectGroup = {selectGroup}
              />
            </div>
          </div>
        </div>

        {(specialCategory && specialCategory.length > 0) &&
            <div className="whitebox m-b-30">                      
              <div className="ccm-head flex align-items-center justify-content-between">
                <h4>{constantText.special_category_text}</h4>
              </div>
              <div className="col-12">
                 {this.getMultipleSectionUI('specialCategory', specialCategory, null, addRemoveMultipleFields, selectGroup)}
              </div>
            </div> }

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center auto-prev-next-wrap">
            <div className="next-step-btn" onClick={event => handleTab(event, selectedTab + 1)}>
              {constantText.next_text}<AccordianNormal />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default TitleSummary;
