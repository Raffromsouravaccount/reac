import React from "react";
import PropTypes from "prop-types";

//Common Components
import ButtonField from "../ButtonField/ButtonField";
import SelectWithSearch from "../SelectWithSearch/SelectWithSearch";

//Helper files
import { constantText } from "../../../_helpers/constants.text";

//Icons
import LightIcon from "images/light-icon.svg";

const RejectedContent = ({ className, limitTags, moreText, multiple, countryData, selectedReason, keyText,
  remainingCountryData, handleMultiSelect, canReject, needWorkAction }) => (
    <div className={`whitebox ${className}`}>
      <div className="cklist-content p-b-20">
        <div className="ccm-head flex align-items-center justify-content-between">
          <h4>{constantText.reject_content_text}</h4>
        </div>
        <div className="col-12">
          <div className="box-sec p-all-10">
            <div className="icon-w-text m-b-20">
              <LightIcon />
              {constantText.reject_desc_text}
            </div>
            <div className="pub-con-form">
              <div className="row">
                <div className="col-md-6">
                  <SelectWithSearch
                    className="zee-SelectWSearch-field"
                    label={constantText.contentConstants.reason}
                    name="reasonSelData"
                    disableCloseOnSelect={multiple ? true : false}
                    keyText={keyText}
                    limitTags={limitTags} moreText={moreText} multiple={multiple}
                    data={countryData} value={selectedReason}
                    onChange={handleMultiSelect}
                  />
                </div>
                {canReject &&
                  <div className="col-md-6">
                    <ButtonField
                      className="zee-btn-field zee-full"
                      variant="contained" color="primary"
                      buttonText={constantText.need_work_text}
                      disabled={!selectedReason? true: false}
                      onClick={needWorkAction}
                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

RejectedContent.defaultProps = {
  className: "",
  limitTags: 1,
  moreText: "more",
  multiple: true,
  keyText: null,
  remainingCountryData: []
}

RejectedContent.propTypes = {
  className: PropTypes.string,
  countryData: PropTypes.array.isRequired,
  limitTags: PropTypes.number,
  moreText: PropTypes.string,
  multiple: PropTypes.bool,
  keyText: PropTypes.string,
  canReject: PropTypes.bool.isRequired,
  remainingCountryData: PropTypes.array,
  handleMultiSelect: PropTypes.func.isRequired,
  needWorkAction: PropTypes.func.isRequired
};

export default RejectedContent;
