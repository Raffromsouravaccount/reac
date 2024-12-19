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
import { history } from "../../../_helpers/history";
import LicenseBadge from "../LicenseBadge/LicenseBadge";

const season = ({
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
  languageArr,
  listView=true
 }) => {
  processLicenceCountries(data);
  let licensesCountries = (data?.countries && typeof data?.countries == 'string') ? data?.countries?.split(",") : [];
  const [countriesDialog, setCountryModel] = useState(false);
  const [audioLanguages, setAudioLanguagesModel] = useState([]);
  const moreItemsBlock = () => {
    const itemsArray = countriesDialog ? licensesCountries.slice(2, licensesCountries.length) : audioLanguages.slice(2, audioLanguages.length)
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
  const viewShowHandler = (tvShowId) => {
    history.push({ pathname: `/tvshow/view/${tvShowId}` });
  }
  const viewEpisodeList = (tvShowId, seasonId) => {
    const route = `/tvshow/view/${tvShowId}/season/view/${seasonId}/episode`;
    history.push({pathname: route});
  }
  const viewSeasonHandler = () => {
    const route = `/tvshow/view/${data.tvShowId}/season/view/${data.seasonId}`;
    history.push({ pathname: route });
  }
  return (
    <div className={classes} >
    <div className="whitebox episode-relcon pos-rel">
      {listView &&<div className="related-m-tag">{constantText?.journeyType[data?.journeyType]}</div>}
     {listView && <LicenseBadge data={data} handleRouteExpiredLink={viewSeasonHandler} />}
      <div className="list-profile-box flex justify-content-between">
        <div className="left-wrap flex">
          {showCheckbox ?
            <div className="l-chkbox">
              <Checkbox
                className={`zee-checkbox-field auto-checkbox-${data?.seasonId}`}
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
              <img
                src={
                  data?.seasonImages?.url
                    ? completeImagePath(
                      data?.externalId,
                      "list",
                      data?.seasonImages?.url,
                      data?.seasonImages?.resolution
                    )
                    : data?.tvShowImages?.url
                      ? completeImagePath(
                        data?.tvShowExternalId,
                        "list",
                        data?.tvShowImages?.url,
                        data?.tvShowImages?.resolution
                      )
                      : "images/no-image.svg"
                }
                alt={data?.seasonImages?.url ? "Invalid" : "no image"}
              />
            </div>
            <div className="info-block global-status-button">
              <div className="flex list-top-text align-items-center">
                <strong>{data?.title || 'No title'}</strong>
                <div className={`s-badge ${getStageColour(data?.contentStatePopulated)}`} >{data?.contentStatePopulated || 'NA'}</div>
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
                    {licensesCountries?.length > 0
                      ? licensesCountries?.length > 2
                        ? licensesCountries[0] +
                        ", " +
                        licensesCountries[1]
                        : licensesCountries.join(", ")
                      : "N/A"}
                    {licensesCountries?.length > 2 ? (
                      <a onClick={() => setCountryModel(true)} >
                        {` +${licensesCountries.length - 2}`}
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
              <span id="deleteHandlerBtn" className={`remove ${isLocked ? "disabled" : ""} auto-delete-${data?.seasonId ? data?.seasonId : ""}`} onClick={(event) => deleteHandler(event, data)}>
                <Delete />
              </span>
              : null}
            {showButton && !isLocked ?
              <div className="user-head">
                <div className="s-form flex justify-content-between col-md-12">
                  <div id="buttonHanlder"
                    className={`btn-create-user ${data?.isChecked || isLocked ? "disabled" : ""} auto-assignSeason-${data?.seasonId ? data?.seasonId : ""}`}
                    onClick={() => { if (!data?.isChecked) { buttonHandler(data) } }}>
                    {buttonText}
                  </div>
                </div>
              </div>
              : null}
          </div>
        </div>
      </div>
      <div className="seasons-row flex">
        <div className="tvshow-name flex align-items-center">
          <span className="label">{constantText.tv_show_text.title}</span>
          <span className="val" onClick={data?.tvShowTitle ? () => { viewShowHandler(data?.tvShowId) } : () => { }}>
            {data?.tvShowTitle ? data?.tvShowTitle : "NA"}
          </span>
        </div>
        <div className="tvshow-seasons flex align-items-center">
          <span className="label">{constantText.tv_show_episode_text.episodes}</span>
          <span className="val" onClick={() => data?.episodeCount ? viewEpisodeList(data?.tvShowId, data?.seasonId) : () => { }}>
            {data?.episodeCount ? data?.episodeCount : 0}
          </span>
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
          showBtn1={false}
          showBtn2={true}
          btn2Text={constantText.close_text}
          btn2Action={() => countriesDialog ? setCountryModel(false) : setAudioLanguagesModel([])}
          handleClose={() => countriesDialog ? setCountryModel(false) : setAudioLanguagesModel([])}
        />
      }
    </div>);
};

export default React.memo(season);
