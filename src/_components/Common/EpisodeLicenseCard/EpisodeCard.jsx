import React, { useState, useEffect } from 'react';
import moment from "moment";
import { apiCalls } from "../../../_services/common.service";
import { constantText } from "../../../_helpers/constants.text";
import Config from "../../../Config/config";
import { completeImagePath } from "../CommonFunction/CommonFuntion";
import BadgeBox from "../BadgeBox/BadgeBox";
import ListLanguage from "../ListLanguage/ListLanguage";
import { LastModifiedBy } from "../LastModifiedBy/LastModifiedBy";
import { tvShowConstants } from "../../TvShow/Constants/tvshow.constants";
import { permissionObj } from "../../../_helpers/permission";
import InlineLoader from "../InlineLoader/InlineLoader";
import { dateDiffDayCount } from "../../../_helpers/util";

//Icons
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
import WorldIcon from "images/world-icon.svg";
import MarkDone from "images/tick.svg";
import ViewIcon from "images/view-icon.svg";

const EpisodeCard = ({ 
  tvshow,
   id, 
   selectedTab,
   addContent,
   toggleMorePopup,
   tabOptions,
   viewShowHandler,
   viewSeasonHandler,
   handleConditionRoute,
   viewEpisodeHandler, 
   handleRouteExpiredLink,
   openSeheduledHistory,
   LanguageArr }) => {

    let canPublish = permissionObj?.tvShows?.publish?.canCreate();
    let canArchive = permissionObj?.tvShows?.archive?.canUpdate;
    let canViewLicense = permissionObj?.tvShows?.licenceModule?.canView();
    
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const [licenceExpDays, setlicenceExpDays] = useState([]);
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
      <div className="m-tag">
        {constantText?.journeyType[tvshow?.episodeJourney]}
      </div>
      {licenceExpDays?.length > 0 && (
        <div
          className={
            canViewLicense
              ? "license-badge"
              : "license-badge tooltip-sec nopermission"
          }
          onClick={() =>
            canViewLicense ? handleRouteExpiredLink(tvshow) : () => {}
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
      <div className="mov-info-box flex justify-content-between">
        <div className="left-area flex">
          <div className="movie-img">
            <img
              src={
                tvshow?.episodeImages?.url
                  ? completeImagePath(
                      tvshow?.episodeExternalId,
                      "list",
                      tvshow?.episodeImages?.url,
                      tvshow?.episodeImages?.resolution
                    )
                  : "images/no-image.svg"
              }
              alt={
                tvshow?.episodeExternalId
                  ? tvshow?.episodeExternalId
                  : "no image"
              }
            />
          </div>
          <div className="info">
            <div className="mov-detail flex align-items-center">
              <h4>{tvshow?.episodeTitle ? tvshow?.episodeTitle : "NA"}</h4>
              <BadgeBox
                status={tvshow?.subtypePopulated}
                dot={true}
                color={"blue"}
              />
              {selectedTab == 0 && (
                <BadgeBox status={tvshow?.contentStatePopulated} />
              )}
            </div>
            {/* <div className="global-title status-text flex">
            <span className="label">Global Title</span>
            <span className="text">{"NA"}</span>
          </div> */}
            <div className="time-loc-row flex align-items-center">
              <span className="time">
                <MovieGrayIcon />
                {tvshow?.videoDuration ? tvshow?.videoDuration : "NA"}
              </span>
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
                    tvshow?.audioLanguages ? tvshow?.audioLanguages : []
                  }
                />
              ) : null}
              {selectedTab == 0 ||
              selectedTab == 9 ||
              selectedTab == 2 ||
              selectedTab == 3 ||
              selectedTab == 6 ||
              selectedTab == 4
                ? tvshow?.contentStatePopulated.toLowerCase() !==
                    "submitted to review" &&
                  tvshow?.contentStatePopulated.toLowerCase() !== "all" &&
                  tvshow?.contentStatePopulated.toLowerCase() !== "draft" &&
                  tvshow?.contentStatePopulated.toLowerCase() !== "need work" &&
                  tvshow?.contentStatePopulated.toLowerCase() !==
                    "archived" && (
                    <span
                      className="pub-history"
                      data-test="tvshows-openSeheduledHistory"
                      onClick={() =>
                        openSeheduledHistory(
                          tvshow,
                          tvShowConstants.episodeType
                        )
                      }
                    >
                      {tvshow?.contentStatePopulated.toLowerCase() ===
                      "unpublished"
                        ? "Unpublished History"
                        : "Published and Scheduled History"}
                    </span>
                  )
                : ""}
            </div>
            <div className="note-list-title status-text flex">
              <span className="label">{constantText.note_text}</span>
              <span className="text">{tvshow?.episodeNote || "NA"}</span>
            </div>
            <LastModifiedBy
              data={
                {
                  lastModifiedBy_populated: tvshow?.lastModifiedByPopulated,
                  lastModifiedOn: tvshow?.lastModifiedOn,
                } || {}
              }
              statusText={tabOptions[selectedTab]?.statusText || ""}
            />
            {tvshow?.transcoding && (
              <div className="flex align-items-center tra-update">
                <span className="flex p-r-10">
                  <span className="mark-green flex align-items-center justify-content-center">
                    <MarkDone />{" "}
                  </span>{" "}
                  Transcoding Update
                </span>
                <span
                  className="update-con"
                  onClick={() =>
                    addContent(
                      tvshow?.episode_external_id
                        ? tvshow?.episode_external_id
                        : "",
                      selectedTab === 2
                        ? constantText.tvshowList
                        : selectedTab === 1
                        ? constantText.videoCount
                        : "episode",
                      tvshow?.transcoding?.transcodingUid
                        ? tvshow?.transcoding?.transcodingUid
                        : ""
                    )
                  }
                >
                  Update Content
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="right-area">
          <div className="mov-icon-sec flex align-items-center  justify-content-between">
            <div className="mov-id">
              <span className="text-id">{constantText.external_id_text}</span>
              <span className="num-id">
                {" "}
                {tvshow?.episodeExternalId ? tvshow?.episodeExternalId : "NA"}
              </span>
            </div>
            <div className="mov-cta-wrap flex">
              <div
                onClick={() => viewEpisodeHandler(tvshow)}
                className={`mov-icon mov-view tooltip-sec auto-view-${id}`}
              >
                <ViewIcon />
                <div className="tooltip-box">{tvShowConstants.viewEpisode}</div>
              </div>
              {tvshow?.contentStatePopulated == tvShowConstants.unpublished && (
                <span
                  className="edit tooltip-sec hand-cursor"
                  disabled={!canPublish}
                  onClick={() =>
                    handleConditionRoute("archive", tvshow?.episodeId)
                  }
                >
                  <ArchiveIcon />
                  <div className="tooltip-box">
                    {canArchive()
                      ? constantText?.tool_tip_archive
                      : constantText?.tool_tip_noPermission}{" "}
                  </div>
                </span>
              )}
              {tvshow?.contentStatePopulated == tvShowConstants.archived && (
                <span
                  className="edit tooltip-sec hand-cursor"
                  disabled={!canPublish}
                  onClick={() =>
                    handleConditionRoute("restore", tvshow?.episodeId)
                  }
                >
                  <RestoreIcon />
                  <div className="tooltip-box">
                    {canArchive()
                      ? constantText?.tool_tip_restore
                      : constantText?.tool_tip_noPermission}{" "}
                  </div>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="seasons-row flex">
        <div className="tvshow-name flex align-items-center">
          <span className="label">{tvShowConstants?.tvShow_view_text}</span>
          <span
            className="val"
            onClick={
              tvshow?.tvShowTitle
                ? () => {
                    viewShowHandler({
                      tvShowId: tvshow?.tvShowId,
                      journeyType: null,
                    });
                  }
                : () => {}
            }
          >
            {tvshow?.tvShowTitle ? tvshow?.tvShowTitle : "NA"}
          </span>
        </div>
        <div className="tvshow-seasons flex align-items-center">
          <span className="label">{tvShowConstants?.seasonText}</span>
          <span
            className="val"
            onClick={
              tvshow?.seasonTitle
                ? () => {
                    viewSeasonHandler({
                      seasonId: tvshow?.seasonId,
                      tvShowId: tvshow?.tvShowId,
                      journeyType: null,
                    });
                  }
                : () => {}
            }
          >
            {tvshow?.seasonTitle ? tvshow?.seasonTitle : "NA"}
          </span>
        </div>
        <div className="tvshow-release flex align-items-center">
          <span className="label">
            {tvShowConstants?.EpisodeTelecastHeading}
          </span>
          <span className="val">
            {tvshow?.telecastDate
              ? moment(tvshow?.telecastDate).format(
                  constantText.date_format_without_time
                )
              : "NA"}
          </span>
        </div>
      </div>
    </>
  );
}
export default EpisodeCard;