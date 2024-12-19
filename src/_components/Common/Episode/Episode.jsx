import React, { useState } from "react";
import moment from "moment";

import Checkbox from '../CheckBox/CheckBox';
import { LastModifiedBy } from "../LastModifiedBy/LastModifiedBy";

import List from "images/list.svg";
import Delete from "images/delete.svg";
import WorldIcon from "images/world-icon.svg";
import MovieIcon from "images/movie-gray-icon.svg";

import { completeImagePath, getStageColour, processLicenceCountries } from "../CommonFunction/CommonFuntion";
import { CommonModel } from "../Model/CommonModel";
import { constantText } from "../../../_helpers/constants.text";
import ListLanguage from "../ListLanguage/ListLanguage";
import { history } from "../../../_helpers/history";

//CSS
import "../../../../public/css/Common/RelatedContent.css";
import "../../../../public/css/Common/TvShowAccordion.css";
import LicenseBadge from "../LicenseBadge/LicenseBadge";

const episode = ({
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
  const viewSeasonHandler = (tvShowId, seasonId) => {
    const route = `/tvshow/view/${tvShowId}/season/view/${seasonId}`;
    history.push({ pathname: route });
  }
  const viewEpisodeHandler = () => {
    const route = `/tvshow/view/${data.tvShowId}/season/view/${data.seasonId}/episode/view/${data.episodeId}`;
    history.push({ pathname: route });
  }
  let imageObj = {}
  if(data?.episodeImages) {
    imageObj = data?.episodeImages
    imageObj.externalId = data?.episodeExternalId
  } else if(data?.seasonImages) {
    imageObj = data?.seasonImages
    imageObj.externalId = data?.seasonExternalId
  } else if(data?.tvShowImages) {
    imageObj = data?.tvShowImages
    imageObj.externalId = data?.tvShowExternalId
  }
  return (
    <div className={classes} >
      <div className="whitebox episode-relcon pos-rel">
        {listView && <div className="related-m-tag">{constantText?.journeyType[data?.episodeJourney]}</div>}
        { listView && <LicenseBadge data={data} handleRouteExpiredLink={viewEpisodeHandler} />}
        <div className="list-profile-box flex justify-content-between">
          <div className="left-wrap flex">
            {showCheckbox ?
              <div className="l-chkbox">
              
                <Checkbox
                  className={`zee-checkbox-field auto-checkbox-${data?.episodeId}`}
                  checked={data?.isChecked ? data?.isChecked : false}
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
                    imageObj?.url ?
                      completeImagePath(imageObj?.externalId, "list", imageObj?.url, imageObj?.resolution)
                      :
                      "images/no-image.svg"
                  }
                  alt={imageObj?.externalId ? imageObj?.externalId : "no image"}
                />
              </div>
              <div className="info-block global-status-button">
                <div className="flex list-top-text align-items-center">
                  <strong>{data?.episodeTitle || 'No title'}</strong>
                  {data?.subtypePopulated && <div className="s-badge blue dot-badge">{data.subtypePopulated}</div>}
                  <div className={`s-badge ${getStageColour(data?.contentStatePopulated)}`} >{data?.contentStatePopulated || 'NA'}</div>
                </div>
                {/* <div className="global-title status-text flex">
                  <span className="label">Global Title</span>
                  <span className="text">
                    {data?.title ? data?.title : "NA"}
                  </span>
                </div> */}
                {listView && <div className="time-loc-row flex align-items-center">
                  <span className="time">
                    <MovieIcon className="icon-width" />
                    {data?.videoDuration || 'NA'}
                  </span>
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
                        <a 
                        data-test="set-country-mode"
                        onClick={() => setCountryModel(true)} >
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
                {listView && <div className="note-list-title status-text flex">
                  <span className="label">{constantText.note_text}</span>
                  <span className="text">{data?.episodeNote || 'NA'}</span>
                </div>}
                <LastModifiedBy data={data || {}} />
              </div>
            </div>
          </div>
          <div className="right-block">
            <div className="flex">
              <div className="list-middle-text"><strong>{constantText.external_id_text}  &nbsp; {data?.episodeExternalId || 'NA'}</strong></div>
              {showDelete ?
                <span id="deleteHandlerBtn" className={`remove ${isLocked ? "disabled" : ""} auto-delete-${data?.episodeId ? data?.episodeId : ""}`} onClick={(event) => deleteHandler(event, data)}>
                  <Delete />
                </span>
                : null}
              {showButton && !isLocked ?
                <div className="user-head">
                  <div className="s-form flex justify-content-between col-md-12">
                    <div id="buttonHanlder"
                      className={`btn-create-user ${data?.isChecked || isLocked ? "disabled" : ""} auto-assignepisode-${data?.episodeId ? data?.episodeId : ""}`}
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
            <span className="label">{constantText.tv_show_season_text.season}</span>
            <span className="val" onClick={data?.tvShowId ? () => { viewSeasonHandler(data?.tvShowId, data?.seasonId) } : () => { }}>
              {data?.seasonTitle}
            </span>
          </div>
          <div className="tvshow-release flex align-items-center">
            <span className="label">{constantText.tv_show_episode_text.releaseDate}</span>
            <span className="val">{data?.dateZee5Published?.length ? moment(data?.dateZee5Published).format(constantText.date_format_without_time) : "NA"}</span>
          </div>
        </div>
      </div>
      {(countriesDialog || !!audioLanguages.length) &&
        <CommonModel
          className="popup-wrap status-popup"
          id="common-model"
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

export default React.memo(episode);
