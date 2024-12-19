import React, { Fragment } from "react";
import PropTypes from "prop-types";

//Common Components
import Button from "../ButtonField/ButtonField";
import SelectWithSearch from "../SelectWithSearch/SelectWithSearch";

//Helper files
import {constantText} from "../../../_helpers/constants.text";

//Icons
import LightIcon from "images/light-icon.svg";

const PublishContent = ({ className, countryData, selectedCountry, limitTags, moreText, multiple, keyText,
  remainingCountryData, handleMultiSelect, canPublish, publishAction, selectGroup, groupBy }) => (
  <Fragment>
    <div className={`icon-w-text m-b-20 ${className}`}>
      <LightIcon />
      {constantText.publish__desc_text} {canPublish}
    </div>
    <div className="pub-con-form">
      <div className="row">
        <div className="col-md-6">
          <SelectWithSearch
            className="zee-SelectWSearch-field auto-countryGroup"
            name="publishSelCountryData"
            id="auto-countryGroup"
            label={constantText.create_movie_images_gc_text}
            disableCloseOnSelect={multiple? true: false}
            limitTags={limitTags} moreText={moreText}
            groupBy={groupBy ? (option) => option[groupBy] : null}
            selectGroup={selectGroup ? selectGroup : () => {}}
            multiple={multiple} keyText={keyText}
            data={countryData} value={selectedCountry?.length > 0 ? selectedCountry : []}
            onChange={handleMultiSelect}
          />
        </div>
        <div className="col-md-6">
          <Button
            className="zee-btn-field zee-full"
            variant="contained" color="primary"
            buttonText={constantText.publish_content_text}
            disabled={(selectedCountry?.length > 0 && canPublish) ? false: true}
            onClick={publishAction}
          />
        </div>
      </div>
    </div>
    <div className="view-data-row flex w-200">
      <div className="label">{constantText.remaining_group_countries_text}</div>
      <div className="val">{remainingCountryData?.map(data=> data?.title).join(", ")}</div>
    </div>
  </Fragment>
);

PublishContent.defaultProps= {
  className: "",
  limitTags: 1,
  moreText: "more",
  multiple: true,
  keyText: null,
  remainingCountryData: []
}

PublishContent.propTypes= {
  className: PropTypes.string,
  countryData: PropTypes.array.isRequired,
  selectedCountry: PropTypes.array.isRequired,
  limitTags: PropTypes.number,
  moreText: PropTypes.string,
  multiple: PropTypes.bool,
  keyText: PropTypes.string,
  canPublish: PropTypes.bool.isRequired,
  remainingCountryData: PropTypes.array,
  handleMultiSelect: PropTypes.func.isRequired,
  publishAction: PropTypes.func.isRequired
};

export default PublishContent;
