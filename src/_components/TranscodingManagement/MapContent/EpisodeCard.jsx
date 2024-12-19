import React, { useState, useEffect } from 'react';
import moment from "moment";
import { apiCalls } from "../../../_services/common.service";
import { constantText } from "../../../_helpers/constants.text";
import Config from "../../../Config/config";
import { completeImagePath } from "../../Common/CommonFunction/CommonFuntion";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import ListLanguage from "../../Common/ListLanguage/ListLanguage";
import { LastModifiedBy } from "../../Common/LastModifiedBy/LastModifiedBy";
import { tvShowConstants } from "../../TvShow/Constants/tvshow.constants";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";
import { permissionObj } from "../../../_helpers/permission";
import { dateDiffDayCount } from "../../../_helpers/util";

//Icons
import WorldIcon from "images/world-icon.svg";

const EpisodeCard = ({ 
   id, 
   list,
   addContent,
   toggleMorePopup,
   viewShowHandler,
   viewSeasonHandler,
   handleRouteExpiredLink,
   LanguageArr
   }) => {
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const [licenceExpDays, setlicenceExpDays] = useState([]);
    let canViewLicense = permissionObj?.tvShows?.licenceModule?.canView();

  useEffect(() => {
  async function fetchData() {
    // wait for load image
    let res;
    if(id){
     res =  await apiCalls(`${Config?.episode?.licenseDetails}?episodeId=${id}`,'GET',{},'',false);
    }
    setLoading(false);
    if(res){
      setCountries(res[0]?.countries
      ? res[0]?.countries?.split(",")
      : []);
      let row = [];
      if (res[0]?.validUntil) {
        let days = dateDiffDayCount(res[0]?.validUntil);
        let signDays = Math.sign(days);
        let expDays = dateDiffDayCount(res[0]?.validUntil) <= 5;
        if (signDays >= 0 && expDays) {
          row.push(days);
          setlicenceExpDays(row);
        }
      }
    }
  }
  fetchData();

  },[id]);

  return (
    <>
      <div className="related-m-tag">{constantText?.journeyType[list?.episodeJourney]}</div>
          {licenceExpDays?.length > 0 && (
            <div
              className={
                canViewLicense
                  ? "license-badge"
                  : "license-badge tooltip-sec nopermission"
              }
              onClick={() =>
                canViewLicense ? handleRouteExpiredLink(list, "episode") : () => {}
              }
            >
              {Math.min.apply(null, licenceExpDays) === 0
                ? constantText.license_expires_today
                : `${constantText.license_expires_in}  ${Math.min.apply(
                    null,
                    licenceExpDays
                  )}  ${constantText.day_s_text}`}
              {!canViewLicense ? (
                <div className="tooltip-box">
                  {constantText?.tool_tip_noPermission}
                </div>
              ) : null}
            </div>
          )}
          <div className="list-profile-box flex justify-content-between">
            <div className="left-wrap flex">
              <div className="left-block flex">
                <div className="movie-img">
                <img
                    src={
                      list?.episodeImages?.url
                        ? completeImagePath(
                            list?.episodeExternalId,
                            "list",
                            list?.episodeImages?.url,
                            list?.episodeImages?.resolution
                          )
                        : "images/no-image.svg"
                    }
                    alt={
                      list?.episodeExternalId
                        ? list?.episodeExternalId
                        : "no image"
                    }
                  />
                </div>
                <div className="info-block global-status-button">
                  <div className="flex list-top-text align-items-center">
                    <strong>{list?.episodeTitle || 'No title'}</strong>
                    <BadgeBox
                      status={list?.subtypePopulated}
                      dot={true}
                      color={"blue"}
                    />
                    <BadgeBox status={list?.contentStatePopulated} />
                  </div>
                  {/* <div className="global-title status-text flex">
                    <span className="label">Global Title</span>
                    <span className="text">
                      {list?.title ? list?.title : "NA"}
                    </span>
                  </div> */}
                  <div className="time-loc-row flex align-items-center">
                  {loading ? (
                        <span className="loc flex align-items-center">
                          <WorldIcon />
                          <InlineLoader
                            className={"loader-country"}
                            size={13}
                            show={loading}
                          />
                        </span>
                      ) : (
                        <span className="loc">
                          <WorldIcon />{" "}
                          {countries?.length > 0
                            ? countries?.length > 2
                              ? countries[0] + ", " + countries[1]
                              : countries.join(", ")
                            : "NA"}
                          {countries?.length > 2 ? (
                            <a onClick={() => toggleMorePopup(countries)}>
                              {` +${countries.length - 2}`}
                            </a>
                          ) : null}
                        </span>
                      )}
                      {LanguageArr.length ? (
                          <ListLanguage
                            togglePopup={toggleMorePopup}
                            audioLanguages={LanguageArr}
                            languageIds={
                              list?.audioLanguages ? list?.audioLanguages : []
                            }
                          />
                      ) : null}
                  </div>
                  <div className="note-list-title status-text flex">
                    <span className="label">{constantText.note_text}</span>
                    <span className="text">{list?.episodeNote || 'NA'}</span>
                  </div>
                  <LastModifiedBy  
                  data={{
                        lastModifiedBy_populated: list?.lastModifiedByPopulated,
                        lastModifiedOn: list?.lastModifiedOn,
                      } || {}} />
                </div>
              </div>
            </div>
            <div className="right-block">
              <div className="flex">
                <div className="list-middle-text"><strong>{constantText.external_id_text}  &nbsp; {list?.episodeExternalId || 'NA'}</strong></div>
                <div className="user-head">
                  <div className="s-form">
                    <div className="btn-create-user"
                        onClick={() => addContent(list.episodeExternalId ? list.episodeExternalId : "", constantText.transcoding_episode, list?.episodeId)}
                    >
                      {constantText.add_content_text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="seasons-row flex">
            <div className="tvshow-name flex align-items-center">
              <span className="label">{constantText.tv_show_text.title}</span>
              <span 
              className="val"
              onClick={
                list?.tvShowTitle
                  ? () => {
                      viewShowHandler({
                        tvShowId: list?.tvShowId,
                        journeyType: null,
                      });
                    }
                  : () => {}
              }
              >{list?.tvShowTitle}</span>
            </div>
            <div className="tvshow-seasons flex align-items-center">
              <span className="label">{constantText.tv_show_season_text.season}</span>
              <span 
              className="val"
              onClick={
                list?.seasonTitle
                  ? () => {
                      viewSeasonHandler({
                        seasonId: list?.seasonId,
                        tvShowId: list?.tvShowId,
                        journeyType: null,
                      });
                    }
                  : () => {}
              }
              >{list?.seasonTitle}</span>
            </div>
            <div className="tvshow-release flex align-items-center">
              <span className="label">{tvShowConstants?.EpisodeTelecastHeading}</span>
              <span className="val">{list?.telecastDate ? moment(list?.telecastDate).format(constantText.date_format_without_time) : "NA"}</span>
            </div>
          </div>
    </>
  );
}
export default EpisodeCard;