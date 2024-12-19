import React from "react";
import moment from "moment";

//Helper files
import { removeTags } from "../../Common/CommonFunction/CommonFuntion";
import { constantText } from "../../../_helpers/constants.text";

const dropdownValue = (multiple, value, keyText) => {
  if (multiple) {
    return ((value && value.length) ? value?.map(obj => {
      return obj ? (keyText ? obj[keyText] : obj) : 'NA'
    }).join(', ') || 'NA' : "NA")
  } else {
    return value?.[keyText] || 'NA'
  }
}

const ViewDetails = ({ allData }) => {
  return (<div className="col-12">
    {allData?.map((data, index) => {
      if (data && data.type !== 'sectionMultiple') {
        let { label, placeHolder, type, keyText, value, multiple } = data;
        return (
          <div className="view-data-row flex" key={index}>
            <div className="label">{label || placeHolder}</div>
            <div className="val" dangerouslySetInnerHTML={{
              __html: (type.toLowerCase() == 'dropdown' || type.toLowerCase() == 'searchablewithcreate' ||
                type.toLowerCase() == 'dropdownasync') ? dropdownValue(multiple, value, keyText) :
                (type == "checkbox") ? (value ? constantText.yes_text : constantText.no_text) :
                (type == "textEditor") ? (removeTags(value).length ? value : "NA"): (type == "date") ?
                (value ? moment(value).format(constantText.date_format_placeholder) : "NA") :
                (type == "datetime-local") ? (value ? moment(value).format(constantText.date_format_with_time) : "NA"):
                (value || "NA")
            }}>
            </div>
          </div>
        )

      }
    })}
  </div>)
}

export default ViewDetails;
