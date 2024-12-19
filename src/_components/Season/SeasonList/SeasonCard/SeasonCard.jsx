import React, { useState } from "react";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import { constantText } from "../../../../_helpers/constants.text";
import { LastModifiedBy } from "../../../Common/LastModifiedBy/LastModifiedBy";
import { CommonModel } from "../../../Common/Model/CommonModel";
import { tvShowConstants } from "../../../TvShow/Constants/tvshow.constants";
import {completeImagePath} from '../../../Common/CommonFunction/CommonFuntion';
import { history } from "../../../../_helpers/history";
import ListLanguage from "../../../Common/ListLanguage/ListLanguage";
import { permissionObj } from "../../../../_helpers/permission";
//ICON
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";
import WorldIcon from "images/world-icon.svg";
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
import List from "images/list.svg";

const season = ({ classes = "season-box", showHideClonePopup, matchParams, tvShow, data, draggable, LanguageArr, handleConditionRoute }) => {
  const ShowLicensesCountries = data?.countries ? data?.countries?.split(",") :  tvShow?.countries ? tvShow?.countries?.split(",") : [];
  const ShowAudioLanguage = data?.audioLanguages ? data?.audioLanguages : tvShow?.audioLanguages ? tvShow?.audioLanguages : [];
  const handleModel = (mode, ShowAudioLanguage = null) => {
    const data = {};
    if (mode === "audioLanguages") {
      data.desc = ShowAudioLanguage.slice(2, ShowAudioLanguage.length);
      data.title = constantText.more_languages_text;
    } else {
      data.desc = ShowLicensesCountries.slice(2,ShowLicensesCountries.length);
      data.title = constantText.license_country_text;
    }
    setModelData(data);
    setCommonModel(true);
  };
  const viewSeasonHandler = (data) => {
    const { seasonId } = data;
    const { pathname } = history?.location;
    history.push({
      pathname: `${pathname}/view/${seasonId}`
    });
  }
  const viewShowHandler = (show) => {
    const { tvShowId, journeyType } = show;
    history.push({
      pathname: `/tvshow/view/${tvShowId}`,
      state: { journeyType: journeyType },
    });
  };
  const viewEpisodeList = (tvshowId, seasonId) => {
    const route = `/tvshow/view/${tvshowId}/season/view/${seasonId}/episode`;
    history.push({pathname: route});
  }
  const handleRouteExpiredLink = (show) => {
    const { journeyType } = show;
    const { id } = matchParams;
    let route;
    let tab;
      const { seasonId } = show;
      route = `/tvshow/view/${id}/season/view/${seasonId}`;
      tab = journeyType == "2" ? 1 : 2;
    history.push({
      pathname: route,
      state: {
        journeyType: journeyType,
        selectedTab: tab,
      },
    });
  };
  const [modelData, setModelData] = useState(null);
  const [moreViewDialog, setCommonModel] = useState(false);
  const canViewLicense = permissionObj?.season?.licenceModule?.canView();
  let canPublish = permissionObj?.season?.publish?.canCreate();
  let canArchive = permissionObj?.season?.archive?.canUpdate;
  const MoreDataBlock = (
    <ul className="mov-con-list flex">
      {modelData?.desc.map((item, index) => (
        <li className="col-6 col-md-4" key={index}>
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={classes}>
      <div className="mov-l-box whitebox">
      {data?.journeyType && (
            <div className="m-tag">
              {constantText?.journeyType[data?.journeyType]}
            </div>
          )}
        {data?.licenceExpDays?.length > 0 && (
          <div
            className={
              canViewLicense
                ? "license-badge"
                : "license-badge tooltip-sec nopermission"
            }
            onClick={() =>
              canViewLicense
                ? handleRouteExpiredLink(data)
                : () => {}
            }
          >
            {Math.min.apply(null, data?.licenceExpDays) === 0
              ? constantText.license_expires_today
              : `${constantText.license_expires_in}  ${Math.min.apply(
                  null,
                  data?.licenceExpDays
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
            <div className={`drop-icon flex align-items-center justify-content-center auto-drop-icon`} {...draggable?.dragHandleProps}>
              <span className="list">
                <List />
              </span>
            </div>
            <div className="movie-img">
              <img
                src={
                  data?.SeasonImages?.[0]?.imageDetails?.url
                    ? completeImagePath(
                        data?.externalId,
                        "list",
                        data?.SeasonImages?.[0]?.imageDetails.url,
                        data?.SeasonImages?.[0]?.imageDetails.resolution
                      )
                    : tvShow?.TvShowImages?.[0]?.imageDetails?.url
                    ? completeImagePath(
                      tvShow?.externalId,
                        "list",
                        tvShow?.TvShowImages?.[0]?.imageDetails.url,
                        tvShow?.TvShowImages?.[0]?.imageDetails.resolution
                      ) : "images/no-image.svg"
                }
                alt={
                  data?.externalId
                    ? data?.externalId
                    : "no image"
                }
              />
            </div>
            <div className="info">
              <div className="mov-detail flex align-items-center">
                <h4>{data?.title ? data?.title : "NA"}</h4>
                <BadgeBox
                  status={data?.contentState_populated?.title}
                />
              </div>
              {/* <div className="global-title status-text flex">
                <span className="label">Global Title</span>
                <span className="text">{"NA"}</span>
              </div> */}
              <div className="time-loc-row flex align-items-center">
                <span className="loc">
                  <WorldIcon />{" "}
                  {ShowLicensesCountries?.length > 0
                    ? ShowLicensesCountries?.length > 2
                      ? ShowLicensesCountries[0] +
                        ", " +
                        ShowLicensesCountries[1]
                      : ShowLicensesCountries.join(", ")
                    : "NA"}
                  {ShowLicensesCountries?.length > 2 ? (
                    <a id={"handlelicenseCountry"} onClick={() => handleModel("licenseCountry")}>
                      {` +${ShowLicensesCountries.length - 2}`}
                    </a>
                  ) : null}
                </span>
                {LanguageArr?.length ? (
                            <ListLanguage
                            togglePopup={(ShowAudioLanguage) =>
                              handleModel("audioLanguages", ShowAudioLanguage)
                            }
                              audioLanguages={LanguageArr}
                              languageIds={ShowAudioLanguage}
                            />
                          ) : null}
              </div>
              <div className="note-list-title status-text flex">
                <span className="label">{constantText.note_text}</span>
                <span className="text">{data?.note ? data?.note : tvShow?.note ? tvShow?.note : "NA"}</span>
              </div>
              <LastModifiedBy data={data || {}} />
              {data?.transcodingUpdate && (
                <div className="flex align-items-center tra-update">
                  <span className="mark-green flex align-items-center justify-content-center">
                    <MarkDone />
                  </span>{" "}
                  Transcoding Update
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
                  {data?.externalId ? data?.externalId : "NA"}
                </span>
              </div>
              <div className="mov-cta-wrap flex">
                <div
                  onClick={() => viewSeasonHandler(data)}
                  className={`mov-icon mov-view tooltip-sec auto-view-${data?.externalId}`}
                >
                  <ViewIcon />
                  <div className="tooltip-box">
                    {tvShowConstants.viewSeason}
                  </div>
                </div>
              {data?.contentState_populated?.title  !==
                tvShowConstants.archived && (<div
                  onClick={() => showHideClonePopup(data, data?.seasonId, data?.journeyType)}
                  className={`mov-icon mov-copy tooltip-sec auto-copy-${data?.externalId}`}
                >
                  <CopyIcon />
                  <div className="tooltip-box">
                    {tvShowConstants.copySeason}
                  </div>
                </div>)}
                {data?.contentState_populated?.title ==
                            tvShowConstants.unpublished && (
                            <span
                              className="edit tooltip-sec hand-cursor"
                              disabled={!canPublish}
                              onClick={() =>
                                handleConditionRoute(
                                  "archive",
                                  data?.seasonId
                                )
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
                  {data?.contentState_populated?.title ==
                            tvShowConstants.archived && (
                            <span
                              className="edit tooltip-sec hand-cursor"
                              disabled={!canPublish}
                              onClick={() =>
                                handleConditionRoute(
                                  "restore",
                                  data?.seasonId
                                )
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
            <div className="mov-link flex justify-content-end">
              <div className="mov-link-btn">Index No - {data?.index}</div>
            </div>
          </div>
        </div>
        <div className="seasons-row flex">
                <div className="tvshow-name flex align-items-center">
                  <span className="label">
                    {tvShowConstants?.tvShow_view_text}
                  </span>
                  <span
                    className="val"
                    onClick={
                      tvShow?.title
                        ? () => {
                            viewShowHandler({
                              tvShowId: tvShow?.tvShowId,
                              journeyType: data?.journeyType,
                            });
                          }
                        : () => {}
                    }
                  >
                    {tvShow?.title ? tvShow?.title : "NA"}
                  </span>
                </div>
                <div className="tvshow-seasons flex align-items-center">
                  <span className="label">{tvShowConstants?.episodesText}</span>
                  <span
                    className="val"
                    onClick={() =>
                      data?.episodeCount
                        ? viewEpisodeList(
                            tvShow?.tvShowId,
                            data?.seasonId
                          )
                        : () => {}
                    }
                  >
                    { data?.episodeCount ?  data?.episodeCount : 0}
                  </span>
                </div>
              </div>
      </div>

      {moreViewDialog && (
        <CommonModel
          className="popup-wrap status-popup"
          state={true}
          showTitle={true}
          title={modelData?.title}
          showIcon={false}
          showDes={true}
          des={MoreDataBlock}
          desWithoutDialogText={true}
          showBtn1={false}
          showBtn2={true}
          btn2Text={constantText.close_text}
          btn2Action={() => setCommonModel(false)}
          handleClose={() => setCommonModel(false)}
        />
      )}
    </div>
  );
};

export default React.memo(season);
