import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

//Common Components
import FormRender from "../../../Common/FormHelper/FormRender";

//Helper files
import { constantText } from '../../../../_helpers/constants.text';

//images
import AccordianNormal from "images/arrow-icon.svg";

//css
import '../../../../../public/css/Common/GlobalField.css'; 
class GlobalFields extends Component {
  constructor(props) {
    super(props);
  }

  getMultipleSectionUI = (label,headerData,onBlur,disabled) => {
    return (
      <div className="section">
        <div className="section-head section-border-top flex align-items-center justify-content-between m-b-0">
          <h4>{label} </h4>
        </div>
      </div>
    )
  }

  render() {
    let { globalFields, selectedTab, handleTab, disabled } = this.props;
    return (

      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            <div className="global-wrap">
              {globalFields?.map((globalArr, globalIndex) => (
                <div className="global-row" key={globalIndex}>
                  <div className="add-plush-row top-title">
                    <div className="top-text">{`${constantText.global_fields_title_summary} ${globalIndex >= 0 ? ` - ${globalIndex + 1}` : ''}`}</div>
                    <div className="add-another-f-btn create-btn">
                      <div className={`${globalIndex > 0 ? `remove-btn auto-delete-${globalIndex}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                        id="addRemoveMultipleFieldsBtn" onClick={disabled ? () => { } : () => {return} }>
                        <span className="plush-icon-btn"></span>
                      </div>
                    </div>
                  </div>

                  <div className="row input-space-35">
                    <FormRender
                      id="formRenderComp"
                      form={globalArr} serverCall={true}
                      sectionMultipleBlock={this.getMultipleSectionUI('Global Field Classification')}
                      onChange={(event, index) => {return}}
                      handleBlur={index => {return}} isDisable={disabled}
                      selectGroup={(event, group, index) => {return}}
                      setSelectDataArr={(value, index) => {return}}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            <div className="prev-step-btn" onClick={event => handleTab(event, selectedTab - 1)}>
              <AccordianNormal /> {constantText.previous_text}
            </div>
          </div>
        </div>

      </div>


    );
  }
}

export default GlobalFields;
