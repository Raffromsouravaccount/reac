import React, { Component, Fragment } from 'react';

//Common Components
import ViewSeason from "../../../Common/ViewDetail/ViewSeason";

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

  getMultipleSectionUI = label => {
    return (
      <div className="row">
        <div className="w-100 p-b-20">        
          <div className="section-head section-border-top flex align-items-center justify-content-between m-b-0">
            <h4>{label} </h4>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let { globalFields, handleChange, selectedTab, setSelectDataArr, handleTab, disabled, addRemoveMultipleFields,
      handleEditable, handleSave, viewOnly } = this.props;
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
                      <div className={`${globalIndex > 0 ? `remove-btn auto-delete-${globalIndex}` : 'auto-button-add'} add-btn-field flex align-items-center `}
                        id = "addRemoveMultipleFieldsBtn" onClick={disabled ? () => { } : () => addRemoveMultipleFields("globalFields", globalIndex > 0 ? globalIndex : null)}>
                        {!viewOnly && <span className="plush-icon-btn"></span>}                        
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <ViewSeason allData={globalArr} id="viewSeason"
                      sectionMultipleBlock={this.getMultipleSectionUI('Global Field Classification')}
                      onChange={(event, index) => handleChange(event, globalIndex, index, 'globalFields')}
                      updateData={index => handleSave(globalIndex, index, 'globalFields')}
                      setSelectDataArr={(value, index) => setSelectDataArr('globalFields', globalIndex, index, value)}
                      callBack={index => handleEditable(globalIndex, index, 'globalFields')}
                      viewOnly={viewOnly} isDisable={!!disabled}
                    />
                  </div>

                </div>
              ))
              }
            </div>
          </div>
        </div>

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            {(selectedTab > 0) &&
              <div className="prev-step-btn" onClick={event => handleTab(event, selectedTab - 1)}>
                <AccordianNormal /> {constantText.previous_text}
              </div>
            }
            <div className="next-step-btn" onClick={event => handleTab(event, selectedTab + 1)}>
              {constantText.next_text} <AccordianNormal />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GlobalFields;
 