import React, { useState } from "react";

import Checkbox from '../CheckBox/CheckBox'

import Delete from "images/delete.svg";
import List from "images/list.svg";
import MovieIcon from "images/movie-gray-icon.svg";
import Country from "images/world-icon.svg";
import TimeZone from "images/timetable-icon.svg";

import { getStageColour, processLicenceCountries } from "./../CommonFunction/CommonFuntion";
import { ImageLoad } from "../../Common/ImageLoad/ImageLoad";
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { LastModifiedBy } from "../LastModifiedBy/LastModifiedBy";
import { CommonModel } from "../Model/CommonModel";
import LicenseBadge from "../LicenseBadge/LicenseBadge";
import { history } from "../../../_helpers/history";

const movie = ({ 
  classes = 'relatedcontent-block', 
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
  isViewMode = false ,listView=true}) => {
  const stage = data?.contentState_populated?.title;
  const stageColour = getStageColour(stage);
  processLicenceCountries(data);
  const movieLicensesCountries = (data?.countries && typeof data?.countries == 'string') ? data?.countries?.split(",") : []
  const [licensesCountriesDialog, setCommonModel] = useState(false);
  const viewMovieHandler = () => {
    const route = `/movie/view/${data.movieId}`;
    history.push({ pathname: route });
  };
  return (
    <div className={classes}>
      <div className="whitebox list-profile-box flex justify-content-between pos-rel">
        {listView && <div className="related-m-tag">{constantText?.journeyType[data?.journeyType]}</div>}
        {listView && <LicenseBadge data={data} handleRouteExpiredLink={viewMovieHandler} />}
        <div className="left-wrap flex">
        {showCheckbox ?
          <div className="l-chkbox">
            <Checkbox
              className={`zee-checkbox-field auto-checkbox-${data?.movieId}`}
              checked={data?.isChecked ? data?.isChecked : false}
              handleCheckBox={(event) => { checkBoxHandler(event, data) }}
              disabled={isLocked}
            />
          </div>
          :
          <div className={`flex right-icon${isViewMode ? ' hide-draggable' : ''}`}>
            <span
              className="list"
              {...draggable?.dragHandleProps}>
              <List />
            </span>
          </div>
        }


        <div className="left-block flex">
          <div className="MuiPaper-root">
            <div className="MuiCardActionArea-root">
              <ImageLoad
                url={Config.movieDefaultListImage}
                externalId={data?.externalId}
                id={data?.movieId}
              />
            </div>
          </div>
          <div className="info-block global-status-button">
            <div className="flex list-top-text align-items-center">
              <strong>{data?.title || 'No title'}</strong>
              {data?.subtype_populated?.title && <div className="s-badge blue dot-badge">{data.subtype_populated.title}</div>}
              <div className={`s-badge ${stageColour}`} >{data?.contentState_populated?.title || 'NA'}</div>
            </div>
           {listView && <div className="timezone-block flex">
              <div className="flex align-items-center">
                <MovieIcon className="icon-width" />
                <span>{data?.duration || 'NA'}</span>
              </div>
              <div className="flex align-items-center">
                <Country />
                <span className="loc">
                  {movieLicensesCountries?.length > 0
                    ? movieLicensesCountries?.length > 2
                      ? movieLicensesCountries[0] +
                      ", " +
                      movieLicensesCountries[1]
                      : movieLicensesCountries.join(", ")
                    : "N/A"}
                  {movieLicensesCountries?.length > 2 ? (
                    <a onClick={() => setCommonModel(true)} >
                      {` +${movieLicensesCountries?.length - 2}`}
                    </a>
                  ) : null}
                </span>
              </div>
            </div>}
            {listView && <div className="note-list-title status-text flex">
              <span className="label">{constantText.note_text}</span>
              <span className="text">{data?.note || 'NA'}</span>
            </div>}
            <LastModifiedBy data={data || {}} />
          </div>
        </div>
      </div>
        <div className="right-block">
          <div className="flex">
            <div className="list-middle-text"><strong>{constantText.external_id_text}  &nbsp; {data?.externalId || 'NA'}</strong></div>
            {showDelete && !isViewMode ?
              <span className={`remove ${isLocked ? "disabled" : ""} auto-delete-${data?.movieId ?data?.movieId: "" }`} onClick={(event) => deleteHandler(event, data)}>
                <Delete />
              </span>
              : null}
            {showButton && !isLocked ?
              <div className="user-head">
                <div className="s-form flex justify-content-between col-md-12">
                  <div
                    className={`btn-create-user ${data?.isChecked || isLocked ? "disabled" : ""} auto-assign-${data?.movieId ?data?.movieId: "" }`}
                    onClick={() => { if (!data?.isChecked) { buttonHandler(data) } }}>
                    {buttonText}
                  </div>
                </div>
              </div>
              : null}
          </div>
          {movie?.licenceExpDays?.length > 0 ?
            <div className="license-btn flex">
              <div className="flex align-items-center">
                <TimeZone /> `License Expire in {Math.min.apply(null, data?.licenceExpDays)} days`
              </div>
            </div> : null}
        </div>
      </div>
      {licensesCountriesDialog &&
        <CommonModel
          className="popup-wrap status-popup"
          state={true}
          showTitle={true}
          title={constantText.license_country_text}
          showIcon={false}
          showDes={true}
          des={movieLicensesCountries.slice(2, movieLicensesCountries.length).join(", ")}
          showBtn1={false}
          showBtn2={false}
          handleClose={() => setCommonModel(false)}
        />
      }
    </div>
  );
};

export default React.memo(movie);
