import React, { Fragment } from "react";
import moment from "moment";

//Common files
import FormRender from "../FormHelper/FormRender";

//Helper files
import { removeTags } from "../CommonFunction/CommonFuntion";
import { constantText } from "../../../_helpers/constants.text";

const ViewSeason = ({ allData, onChange, handleAutoCreateInput, sectionMultipleBlock, isDisable, updateData,
  selectGroup, setSelectDataArr, callBack, serverCall = true, viewOnly = false }) => {
  return (
    <div className="col-12">
      {allData?.map((data, index) => {
        let { label, note, type, keyText, editable, value, inherited, multiple, validation, readOnly } = data || {};
        const { required } = validation || {};
        return (
          type == 'sectionMultiple' ? <Fragment key={index}>{sectionMultipleBlock}</Fragment> :
            <div className={`view-data-row flex f-${!!editable ? 'edit' : 'view'}-mode`} key={index}>
              <div className={`label ${(inherited == "false") ? 'l-vet-line' : ''}`}>{required ? `${label}*` : label}</div>
              <div className="val">
                {!!editable ?
                  <div className="row">
                    <FormRender form={[data]} serverCall={serverCall}
                      onChange={(event, dataIndex) => onChange(event, index)}
                      handleAutoCreateInput={(dataValue, dataIndex) => handleAutoCreateInput(dataValue, index)}
                      selectGroup={(event, group, groupIndex) => selectGroup(event, group, index)}
                      setSelectDataArr={(arrData, dataIndex) => setSelectDataArr(arrData, index)}
                      isDisable={isDisable}
                    />
                  </div> :
                  <div className="data" dangerouslySetInnerHTML={{
                    __html: (type === "dropdown" || type === "autocreate" || type === "dropdownAsync" ||
                      type === "SearchableWithCreate") ?
                        (multiple ? (value?.length ? value?.map(obj => keyText ? obj[keyText] : obj).join(', ') : "NA") :
                        (value?.[keyText] || "NA")) :
                        (type == "checkbox") ? (value ? constantText.yes_text : constantText.no_text) :
                        (type == "textEditor") ? (removeTags(value).length ? value : "NA"): (type == "date") ?
                        (value ? moment(value).format(constantText.date_format_placeholder) : "NA") :
                        (type == "datetime-local") ? (value ? moment(value).format(constantText.date_format_with_time) : "NA"):
                        (value || "NA")
                  }}>
                  </div>
                }
                {(!viewOnly && !readOnly) &&
                  <div className={`link-btn-wrap flex align-items-center`}>
                    {!!editable ?
                      <Fragment>
                        <span className={`cancel-b auto-cancel-b-${index}`} onClick={() => callBack(index)}>{constantText.cancel_text}</span>
                        <span className={`edit-save-b auto-edit-save-b-${index}`} onClick={() => updateData(index)}>{constantText.save_text}</span>
                      </Fragment> :
                      <span className={`edit-save-b auto-edit-save-b-${index}`} onClick={() => (!isDisable && callBack(index))}>{constantText.edit}</span>
                    }
                  </div>
                }
                {(!!note && !viewOnly) &&
                  <div className="data-note-info">{note}</div>
                }
              </div>
            </div>
        )
      })}
    </div>
  )
}

export default ViewSeason;
