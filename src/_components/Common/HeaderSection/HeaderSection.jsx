import React from 'react'

import ButtonField from './../../Common/ButtonField/ButtonField'
//HelperFiles
import { constantText } from './../../../_helpers/constants.text'
//Images
import MarkDone from "images/tick.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import FilterIcon from "images/filter-icon.svg";

const headerSection = ({
  goBack = () => { },
  title = '',
  showInputField = false,
  inputPlaceholder = '',
  inputString= '',
  inputChanged = () => {},
  showFilterButton = false,
  filterButtonText = constantText.filter_button_text,
  filterClicked = () => { },
  filterDisabled = false,
  showMarkDone = false,
  markDoneClicked = () => { },
  markDoneClasses = '',
  markDoneText = constantText.mark_as_done_text,
  markDoneDisabled = false,
  showAddButton = false,
  addButtonText = constantText.add,
  addButtonClicked = () => { },
  addButtonDisabled = false,
  filterActive = false,
  searchKeyPress = () => {},
  searchKeyUp = () => {}
}) => {
  return (
    <div className="user-head profile-head flex justify-content-between align-items-center">
      <div
        className="back-user-btn flex align-items-center auto-back-btn"
        onClick={goBack}
      >
        <div className="text">
          <span>
            <AngleLeftArrow />
          </span>
          <strong>          
              {title}
          </strong>
        </div>
      </div>
      <div className="s-form flex related-top-head">
        {/* <div className="status-head flex align-items-center"> */}
        {showInputField ? <input
          type="text"
          autoComplete="off"
          className="auto-search"
          name="searchVal"
          className="auto-search"
          placeholder={inputPlaceholder}
          value={inputString}
          onChange={inputChanged}
          onKeyPress={searchKeyPress}
          onKeyUp={searchKeyUp}
        /> : null }
          {showFilterButton ?
            <ButtonField
              color="secondary"
              className={`filter-btn${filterActive ? ' current-active-filter' : ''}`}
              Icon={FilterIcon}
              buttonText={filterButtonText}
              onClick={filterClicked}
            /> : null}
          {showMarkDone ?
            <div className="status-head">
              <div 
              data-test="markIsDoneButton"
              onClick={markDoneClicked}
              disabled={markDoneDisabled}
              className={markDoneClasses}>
              <span>
                <MarkDone />
              </span>
              {markDoneText}
            </div></div> : null}
          {showAddButton ?
            <div
              className={`btn-create-user ${addButtonDisabled ? "disabled" : ""} auto-add-content`}
              onClick={addButtonClicked}>
              {addButtonText}
            </div> : null}
        {/* </div> */}
      </div>
    </div>
  )
}

export default headerSection