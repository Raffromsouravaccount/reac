import React, { Component, Fragment } from "react";

//Common Components
import ViewSeason from "../../../Common/ViewDetail/ViewSeason";

//Helper files
import { constantText } from "../../../../_helpers/constants.text";

//images
import AccordianNormal from "images/arrow-icon.svg";

//css
import '../../../../../public/css/Common/GlobalField.css';

class Classification extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classification, awards, handleChange, selectedTab, setSelectDataArr, handleTab, disabled,
      handleSearchableInput, addRemoveMultipleFields, handleEditable, handleSave, viewOnly } = this.props;
    return (
      <div className="movie-f-wrap">
        {classification &&
          <div className="whitebox m-b-30">
            <div className="col-12">
              <div className="row input-space-35">
                <ViewSeason allData={classification}  id="formRenderComp"
                  onChange={(event, index) => handleChange(event, null, index, 'classification')}
                  handleAutoCreateInput={(value, index) => handleSearchableInput(value, null, index, "classification")}
                  updateData={index => handleSave(null, index, 'classification')}
                  setSelectDataArr={(value, index) => setSelectDataArr('classification', null, index, value)}
                  callBack={index => handleEditable(null, index, 'classification')}
                  viewOnly={viewOnly} isDisable={!!disabled}
                />
              </div>
            </div>
          </div>
        }
        {(awards && awards.length > 0) &&
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>{constantText.awards_recognition_text}</h4>
            </div>
            <div className="col-12">
              <div className="global-wrap">
              {awards?.map((awardsArr, awardsIndex) => (
                <div className="global-row" key={awardsIndex}>
                  <div className="add-plush-row top-title">
                      <div className="top-text">{`${constantText.awards_recognition_text_set} ${awardsIndex >= 0 ? ` - ${awardsIndex + 1}` : ''}`}</div>
                      <div className="add-another-f-btn create-btn">
                        <div className={`${awardsIndex > 0 ? `remove-btn auto-delete-${awardsIndex}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                          id="addRemoveMultipleFieldsBtn" onClick={disabled ? () => { } : () => addRemoveMultipleFields("awards", awardsIndex > 0 ? awardsIndex : null)}>
                          {!viewOnly && <span className="plush-icon-btn"></span>}
                        </div>
                      </div>
                    </div>
                  <div className="row input-space-35">
                    <ViewSeason allData={awardsArr} id="awardsFormRender"
                      onChange={(event, index) => handleChange(event, awardsIndex, index, 'awards')}
                      handleAutoCreateInput={(value, index) => handleSearchableInput(value, awardsIndex, index, "awards")}
                      updateData={index => handleSave(awardsIndex, index, 'awards')}
                      selectGroup={(event, group, index) => selectGroup(event, group, awardsIndex, index, 'awards')}
                      setSelectDataArr={(value, index) => setSelectDataArr('awards', awardsIndex, index, value)}
                      callBack={index => handleEditable(awardsIndex, index, 'awards')}
                      viewOnly={viewOnly} isDisable={!!disabled}
                    />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        }

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            <div className="prev-step-btn" onClick={event => handleTab(event, selectedTab - 1)}>
              <AccordianNormal /> {constantText.previous_text}
            </div>
            <div className={`next-step-btn auto-next-step-btn`} onClick={event => handleTab(event, selectedTab + 1)}>
              {constantText.next_text}<AccordianNormal />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Classification;
