import React from "react";
// Components
import Checkbox from '../CheckBox/CheckBox'
// Images
import Delete from "images/delete.svg";
import List from "images/list.svg";

import { completeImagePath, getStageColour } from "./../CommonFunction/CommonFuntion";
import { LastModifiedBy } from "../LastModifiedBy/LastModifiedBy";
import { constantText } from "../../../_helpers/constants.text";
import { history } from "../../../_helpers/history";
import LicenseBadge from "../LicenseBadge/LicenseBadge";

const collection = ({ 
  classes = 'relatedcontent-block', 
  hideDraggable = false, 
  data, 
  showCheckbox, 
  checkBoxHandler, 
  showDelete, 
  showButton, 
  buttonText, 
  deleteHandler, 
  draggable, 
  buttonHandler, 
  isLocked, 
  isViewMode = false }) => {
  const stage = data?.contentState_populated?.title || data?.contentState?.title;
  const stageColour = getStageColour(stage);
  const viewCollectionHandler = () => {
    const route = `/collection/view/${data.id}`;
    history.push({ pathname: route });
  };
  return (
    <div className={classes} >
      <div className="whitebox list-profile-box flex justify-content-between p-12">
        <LicenseBadge data={data} handleRouteExpiredLink={viewCollectionHandler} />
        <div className="left-wrap flex">
        {showCheckbox ?
          <div className="l-chkbox">
            <Checkbox
              className={`zee-checkbox-field auto-checkbox-${data?.id}`}
              checked={data?.isChecked ? data.isChecked : false}
              handleCheckBox={(event) => { checkBoxHandler(event, data) }}
              disabled={isLocked}
            />
          </div>
          : <div className={`flex right-icon${(isViewMode || hideDraggable) ? ' hide-draggable' : ''}`}>
            <span
              className="list"
              {...draggable?.dragHandleProps}>
              <List />
            </span>
          </div>}
        <div className="left-block flex">
          <div className="MuiPaper-root">
            <div className="MuiCardActionArea-root">
              <img src={data?.CollectionImages?.[0]?.imageDetails?.url ?
                completeImagePath(data?.externalId, 'list', data?.CollectionImages?.[0]?.imageDetails?.url, data?.CollectionImages?.[0]?.imageDetails?.resolution) : "images/no-image.svg"} alt={data?.CollectionImages?.setName ? data?.CollectionImages?.setName : "no image"} />
            </div>
          </div>
          <div className="info-block global-status-button">
            <div className="flex list-top-text align-items-center">
              <strong>{data?.title || 'No title'}</strong>
              {/* <div className="show-status">Draft</div> */}
              <div className={`s-badge ${stageColour}`} >{stage || 'NA'}</div>
            </div>
            <div className="note-list-title status-text flex">
              <span className="label">{constantText.note_text}</span>
              <span className="text">{data?.note || 'NA'}</span>
            </div>
            <LastModifiedBy data={data || {}} />
          </div>
        </div>
      </div>
        <div className="right-block">
          <div className="flex">
            <div className="list-middle-text"><strong>{constantText.external_id_text}  &nbsp; {data?.externalId || 'NA'}</strong></div>
            {showDelete ?
              <span id="deleteHandlerBtn" className={`remove ${isLocked ? "disabled" : ""} auto-delete-${data?.id ?data?.id: "" }`} onClick={(event) => deleteHandler(event, data)}>
                <Delete />
              </span>
              : null}
            {showButton && !isLocked ?
              <div className="user-head">
                <div className="s-form flex justify-content-between col-md-12">
                  <div
                    id="buttonHanlder"
                    className={`btn-create-user ${data.isChecked || isLocked ? "disabled" : ""} auto-assign-${data?.id ?data?.id : "" } `}
                    onClick={() => { if (!data.isChecked) { buttonHandler(data) } }}>
                    {buttonText}
                  </div>
                </div>
              </div>
              : null}
          </div>
          {/* <div className="license-btn flex">
            <div className="flex align-items-center">
              <TimeZone /> License Expire in 5 days
          </div>
          </div> */}
        </div>
      </div>
    </div>

  );
};

export default React.memo(collection);
