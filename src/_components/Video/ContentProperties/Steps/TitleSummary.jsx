import React, { Component } from "react";
import { connect } from "react-redux";

//Common Components
import ButtonField from '../../../Common/ButtonField/ButtonField';
import FormRender from "../../../Common/FormHelper/FormRender";

//Helper files
import { constantText } from "../../../../_helpers/constants.text";

//images
import AccordianNormal from "images/arrow-icon.svg";

class TitleSummary extends Component {
  constructor(props) {
    super(props);
  }

  renderMultiSections = (headerName, headerData, label, addRemoveCallback, selectGroup) => {
    let { handleChange, onBlur, setSelectDataArr, disabled } = this.props;
    return (
        <div className="global-wrap">
          {headerData?.map((dataArr, dataArrIndex) => (
           <div className="global-row" key={dataArrIndex}>
             <div className="add-plush-row top-title">
                <div className="top-text">{`${constantText.special_category_text_set} ${dataArrIndex >= 0 ? ` - ${dataArrIndex + 1}` : ''}`}</div>
                <div className="add-another-f-btn create-btn">
                  <div className={`${dataArrIndex > 0 ? `remove-btn auto-delete-${dataArrIndex}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                    id="addRemoveMultipleFieldsBtn" onClick={() => addRemoveCallback(dataArrIndex)}>
                    <span className="plush-icon-btn"></span>
                  </div>
                </div>
              </div>
              <div className="row input-space-35">
                {<FormRender key={dataArrIndex}
                  id="title-handle-change"
                  groupIndex={dataArrIndex}
                  form={dataArr} serverCall={true}
                  onChange={(event, index) => handleChange(event, dataArrIndex, index, headerName)}
                  handleBlur={onBlur} isDisable={disabled}
                  setSelectDataArr={(value, index) => setSelectDataArr(headerName, dataArrIndex, index, value)}
                  selectGroup={(event, group, index) => {selectGroup(event, group, headerName, dataArrIndex, index)}}
                />}
              </div>
            </div>
          ))}
        </div>
    )
  }

  render() {
    let { title_summary, global, handleChange, groupWiseTitle, specialCategory, addRemoveGroupWise,
      addRemoveSpecialCategory, selectGroup, onBlur, setSelectDataArr, selectedTab,
      handleTab, disabled, error } = this.props;
      // console.log("specialCategory: ", specialCategory)
    return (
      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            <div className="row input-space-35">
              <FormRender
                id="handleChange"
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
              {this.renderMultiSections('specialCategory', specialCategory, null, addRemoveSpecialCategory, selectGroup)}
          </div>
        </div> }
        {(global && global.length > 0) &&
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between m-b-30">
              <h4>{constantText.global_text}</h4>
            </div>
            <div className="col-12">
              <div className="row input-space-35">
                <FormRender
                  id="global-form-render"
                  form={global} serverCall={true}
                  sectionMultipleBlock={this.renderMultiSections('groupWiseTitle', groupWiseTitle,
                    'Group Wise Title', addRemoveGroupWise)}
                  onChange={(event, index) => handleChange(event, null, index, 'global')}
                  handleBlur={onBlur} isDisable={disabled}
                  setSelectDataArr={(value, index) => setSelectDataArr('global', null, index, value)}
                />
              </div>
            </div>
          </div>
        }

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
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
