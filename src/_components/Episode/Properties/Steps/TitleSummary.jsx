import React, { Component } from "react";

//Common Components
import ViewSeason from "../../../Common/ViewDetail/ViewSeason";

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

  render() {
    let { title_summary, handleChange, specialCategory, setSelectDataArr, selectedTab, addRemoveMultipleFields,
      handleTab, selectGroup, handleEditable, handleSave, viewOnly, disabled, handleSearchableInput } = this.props;
    return (
      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            <div className="row input-space-35">
              <ViewSeason allData={title_summary} id="formRenderOnChange"
                handleAutoCreateInput={(value, index) => handleSearchableInput(value, null, index, "title_summary")}
                onChange={(event, index) => handleChange(event, null, index, 'title_summary')}
                updateData={index => handleSave(null, index, 'title_summary')}
                setSelectDataArr={(value, index) => setSelectDataArr('title_summary', null, index, value)}
                callBack={index => handleEditable(null, index, 'title_summary')}
                viewOnly={viewOnly} isDisable={!!disabled}
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
            <div className="global-wrap">
              {specialCategory?.map((dataArr, dataArrIndex) => (
                <div className="global-row" key={dataArrIndex}>
                  <div className="add-plush-row top-title">
                    <div className="top-text">{`${constantText.special_category_text_set} ${dataArrIndex >= 0 ? ` - ${dataArrIndex + 1}` : ''}`}</div>
                    <div className="add-another-f-btn create-btn">
                      <div className={`${dataArrIndex > 0 ? `remove-btn auto-delete-${dataArrIndex}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                        id="addRemoveMultipleFieldsBtn" onClick={disabled ? () => { } : () => addRemoveMultipleFields("specialCategory", dataArrIndex > 0 ? dataArrIndex : null)}>
                        {!viewOnly && <span className="plush-icon-btn"></span>}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <ViewSeason allData={dataArr} id="globalFormRender"
                      onChange={(event, index) => handleChange(event, dataArrIndex, index, 'specialCategory')}
                      handleAutoCreateInput={(value, index) => handleSearchableInput(value, dataArrIndex, index, "specialCategory")}
                      updateData={index => handleSave(dataArrIndex, index, 'specialCategory')}
                      selectGroup={(event, group, index) => selectGroup(event, group, dataArrIndex, index, 'specialCategory')}
                      setSelectDataArr={(value, index) => setSelectDataArr('specialCategory', dataArrIndex, index, value)}
                      callBack={index => handleEditable(dataArrIndex, index, 'specialCategory')}
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
