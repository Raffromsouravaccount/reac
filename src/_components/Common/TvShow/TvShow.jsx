import React, { useState } from "react";

import Checkbox from '../CheckBox/CheckBox';
import { LastModifiedBy } from "../LastModifiedBy/LastModifiedBy";

import List from "images/list.svg";
import Delete from "images/delete.svg";
import WorldIcon from "images/world-icon.svg";

import { completeImagePath, getStageColour, processLicenceCountries } from "../CommonFunction/CommonFuntion";
import { CommonModel } from "../Model/CommonModel";
import { constantText } from "../../../_helpers/constants.text";
import ListLanguage from "../ListLanguage/ListLanguage";
import LicenseBadge from "../LicenseBadge/LicenseBadge";
import { history } from "../../../_helpers/history";

const tvShow = ({
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
  isViewMode = false,
  languageArr, listView=true}) => {
  const stage = data?.contentState_populated?.title || data?.contentState?.title;
  const stageColour = getStageColour(stage);
  processLicenceCountries(data);
  const tvShowLicensesCountries = (data?.countries && typeof data?.countries == 'string') ? data?.countries?.split(",") : [];
  const [countriesDialog, setCountryModel] = useState(false);
  const [audioLanguages, setAudioLanguagesModel] = useState([]);
  const moreItemsBlock = () => {
    const itemsArray = countriesDialog ? tvShowLicensesCountries.slice(2, tvShowLicensesCountries.length) : audioLanguages.slice(2, audioLanguages.length)
    return (
      <ul className="mov-con-list flex">
        {itemsArray.map((item, index) => (
          <li className="col-6 col-md-4" key={index}>
            {item}
          </li>
        ))}
      </ul>
    )
  };
  const viewTvShowHandler = () => {
    const route = `/tvshow/view/${data.tvShowId}`;
    history.push({ pathname: route });
  }
  return (
    <div className={classes} >
    <div className="whitebox episode-relcon pos-rel">
     {listView && <div className="related-m-tag">{constantText?.journeyType[data?.journeyType]}</div>}
      {listView && <LicenseBadge data={data} handleRouteExpiredLink={viewTvShowHandler} />}
      <div className="list-profile-box flex justify-content-between">
        <div className="left-wrap flex">
          {showCheckbox ?
            <div className="l-chkbox">
              <Checkbox id="MuiCardActionArea-root"
                className={`zee-checkbox-field auto-checkbox-${data?.tvShowId}`}
                checked={data.isChecked ? data.isChecked : false}
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
            <div className="movie-img">
              <img src={data?.TvShowImages?.[0]?.imageDetails?.url ?
                completeImagePath(data?.externalId, 'list', data?.TvShowImages?.[0]?.imageDetails?.url, data?.TvShowImages?.[0]?.imageDetails?.resolution) : "images/no-image.svg"} alt={data?.TvShowImages?.setName ? data?.TvShowImages?.setName : "no image"} />
            </div>
            <div className="info-block global-status-button">
              <div className="flex list-top-text align-items-center">
                <strong>{data?.title || 'No title'}</strong>
                {data?.subtype_populated?.title && <div className="s-badge blue dot-badge">{data.subtype_populated.title}</div>}
                <div className={`s-badge ${stageColour}`} >{stage || 'NA'}</div>
              </div>
              {/* <div className="global-title status-text flex">
                <span className="label">Global Title</span>
                <span className="text">
                  {data?.title ? data?.title : "NA"}
                </span>
              </div> */}
             {listView && <div className="time-loc-row flex align-items-center">
                <span className="loc">
                  <WorldIcon />{" "}
                    {tvShowLicensesCountries?.length > 0
                      ? tvShowLicensesCountries?.length > 2
                        ? tvShowLicensesCountries[0] +
                        ", " +
                        tvShowLicensesCountries[1]
                        : tvShowLicensesCountries.join(", ")
                      : "N/A"}
                    {tvShowLicensesCountries?.length > 2 ? (
                      <a onClick={() => setCountryModel(true)} >
                        {` +${tvShowLicensesCountries.length - 2}`}
                      </a>
                    ) : null}
                </span>
                {languageArr?.length ? (
                  <ListLanguage
                    togglePopup={(lng) => setAudioLanguagesModel(lng)}
                    audioLanguages={languageArr}
                    languageIds={data?.audioLanguages ? data?.audioLanguages : []
                    }
                  />
                ) : null}
              </div>}

             { listView && <div className="note-list-title status-text flex">
                <span className="label">
                  {constantText.note_text}
                </span>
                <span className="text">{data?.note || 'NA'}</span>
              </div>}
              <LastModifiedBy data={data || {}} />
            </div>
          </div>
        </div>
        <div className="right-block">
          <div className="flex">
            <div className="list-middle-text"><strong>{constantText.external_id_text}  &nbsp; {data?.externalId || 'NA'}</strong></div>
            {showDelete ?
              <span id="deleteHandlerBtn" className={`remove ${isLocked ? "disabled" : ""} auto-delete-${data?.tvShowId ? data?.tvShowId : ""}`} onClick={(event) => deleteHandler(event, data)}>
                <Delete />
              </span>
              : null}
            {showButton && !isLocked ?
              <div className="user-head">
                <div className="s-form flex justify-content-between col-md-12">
                  <div id="buttonHanlder"
                    className={`btn-create-user ${data?.isChecked || isLocked ? "disabled" : ""} auto-assignTvShow-${data?.tvShowId ? data?.tvShowId : ""}`}
                    onClick={() => { if (!data?.isChecked) { buttonHandler(data) } }}>
                    {buttonText}
                  </div>
                </div>
              </div>
              : null}
          </div>
        </div>
      </div>
      </div>
      {(countriesDialog || !!audioLanguages.length) &&
        <CommonModel
          className="popup-wrap status-popup"
          state={true}
          showTitle={true}
          title={countriesDialog ? constantText.license_country_text : constantText.more_languages_text}
          showIcon={false}
          showDes={true}
          des={moreItemsBlock()}
          desWithoutDialogText={true}
          showBtn1={false}
          showBtn2={true}
          btn2Text={constantText.close_text}
          btn2Action={() => countriesDialog ? setCountryModel(false) : setAudioLanguagesModel([])}
          handleClose={() => countriesDialog ? setCountryModel(false) : setAudioLanguagesModel([])}
        />
      }
    </div>);
};

export default React.memo(tvShow);