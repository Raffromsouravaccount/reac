import React, { useState, useEffect } from "react";
import moment from "moment";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import { apiCalls } from "../../../../_services/common.service";
import { constantText } from "../../../../_helpers/constants.text";
import Config from "../../../../Config/config";
import { LastModifiedBy } from "../../../Common/LastModifiedBy/LastModifiedBy";
import { CommonModel } from "../../../Common/Model/CommonModel";
import { tvShowConstants } from "../../../TvShow/Constants/tvshow.constants";
import { completeImagePath } from "../../../Common/CommonFunction/CommonFuntion";
import { history } from "../../../../_helpers/history";
import { dateDiffDayCount } from "../../../../_helpers/util";
import ListLanguage from "../../../Common/ListLanguage/ListLanguage";
import { permissionObj } from "../../../../_helpers/permission";
import CheckBox from "../../../Common/CheckBox/CheckBox";
import InlineLoader from "../../../Common/InlineLoader/InlineLoader";

//ICON
import ViewIcon from "images/view-icon.svg";
import WorldIcon from "images/world-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
import ArchiveIcon from "images/archive-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";

const EpisodeCard = ({
  classes = "episode-box",
  selectHandler,
  dataIndex,
  data,
  id,
  tvshowData,
  matchParams,
  handleConditionRoute,
  LanguageArr,
}) => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [licenceExpDays, setlicenceExpDays] = useState([]);
  useEffect(() => {
    async function fetchData() {
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


  const ShowAudioLanguage = data?.audioLanguages ? data?.audioLanguages : [];
  const handleModel = (mode, ShowAudioLanguage = null) => {
    const data = {};
    if (mode === "audioLanguages" && ShowAudioLanguage) {
      data.desc = ShowAudioLanguage.slice(2, ShowAudioLanguage.length).join(
        ", "
      );
      data.title = constantText.more_languages_text;
    }
    else if(mode === "missingFields" && ShowAudioLanguage){
      data.desc = ShowAudioLanguage.slice(1, ShowAudioLanguage.length).join(
        ", "
      );
      data.title = constantText.more_missing_text;
    }
    else {
      data.desc = countries.slice(
        2,
        countries.length
      ).join(", ");
      data.title = constantText.license_country_text;
    }
    setModelData(data);
    setCommonModel(true);
  };
  const viewEpisodeHandler = (data) => {
    const { episodeId } = data;
    const { pathname } = history?.location;
    history.push({
      pathname: `${pathname}/view/${episodeId}`,
    });
  };
  const viewSeasonHandler = (data) => {
    const { seasonId, tvShowId } = data;
    const { viewEdit } = matchParams;
    history.push({
      pathname: `/tvshow/${viewEdit}/${tvShowId}/season/view/${seasonId}`,
    });
  };
  const viewShowHandler = (show) => {
    const { tvShowId, journeyType } = show;
    history.push({
      pathname: `/tvshow/view/${tvShowId}`,
      state: { journeyType: journeyType },
    });
  };
  const handleRouteExpiredLink = (show) => {
    const { episodeJourney } = show;
    let route;
    let tab;
      const { seasonId, episodeId, tvShowId } = show;
      route = `/tvshow/view/${tvShowId}/season/view/${seasonId}/episode/view/${episodeId}`;
      tab = episodeJourney == "1" ? 3 : 2;
    history.push({
      pathname: route,
      state: {
        journeyType: episodeJourney,
        selectedTab: tab,
      },
    });
  };
  const [modelData, setModelData] = useState(null);
  const [moreViewDialog, setCommonModel] = useState(false);
  const canViewLicense = permissionObj?.episode?.licenceModule?.canView();
  let canPublish = permissionObj?.episode?.publish?.canCreate();
  let canArchive = permissionObj?.episode?.archive?.canUpdate;
  const { subtype, channel, audioLanguages, xmlTitle } = tvshowData;
  let MissingArr = [];
  let xmlFieldMissingText = false;
  if(!(subtype && subtype?.title?.toLowerCase() === constantText.xml_tvshow_subtype)){
    MissingArr.push(subtype?.title ? `TV Show Subtype is ${subtype?.title}` : 'Sub Type');
    xmlFieldMissingText = true;
  } else {
    if(!channel){
      MissingArr.push("Channel");
    }
    if(!audioLanguages?.length){
      MissingArr.push("Audio Language");
    }
    if(!data?.telecastDate){
      MissingArr.push("Telecast Date");
    } 
    if(!xmlTitle){
      MissingArr.push("TV Show XML Title");
    }
  }
  xmlFieldMissingText = xmlFieldMissingText ? `${MissingArr[0]}` : `${constantText?.xml_field_missing} - ${MissingArr[0]}`;
  return (
    <div className={classes}>
      <div className="mov-l-box whitebox">
        {data?.episodeJourney && (
          <div className="m-tag">
            {constantText?.journeyType[data?.episodeJourney]}
          </div>
        )}
        {licenceExpDays?.length > 0 && (
          <div
            className={
              canViewLicense
                ? "license-badge"
                : "license-badge tooltip-sec nopermission"
            }
            onClick={() =>
              canViewLicense ? handleRouteExpiredLink(data) : () => {}
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
            <div className="checkbox-div">
              <CheckBox
                checked={data?.isChecked || false}
                handleCheckBox={(e) => selectHandler(e, dataIndex)}
              />
            </div>
            <div className="movie-img">
              <img
                src={
                  data?.episodeImages?.url
                    ? completeImagePath(
                        data?.episodeExternalId,
                        "list",
                        data?.episodeImages?.url,
                        data?.episodeImages?.resolution
                      )
                    : "images/no-image.svg"
                }
                alt={
                  data?.episodeExternalId ? data?.episodeExternalId : "no image"
                }
              />
            </div>
            <div className="info">
              <div className="mov-detail flex align-items-center">
                <h4>{data?.episodeTitle ? data?.episodeTitle : "NA"}</h4>
                <BadgeBox
                  status={data?.subtypePopulated}
                  dot={true}
                  color={"blue"}
                />
                <BadgeBox status={data?.contentStatePopulated} />
              </div>
              {/* <div className="global-title status-text flex">
                <span className="label">Global Title</span>
                <span className="text">{"NA"}</span>
              </div> */}
              <div className="time-loc-row flex align-items-center">
                <span className="time">
                  <MovieGrayIcon />
                  {data?.videoDuration ? data?.videoDuration : "NA"}
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
                      <a
                        id={"handlelicenseCountry"}
                        onClick={() => handleModel("licenseCountry")}
                      >
                        {` +${countries.length - 2}`}
                      </a>
                    ) : null}
                  </span>
                )}

                {LanguageArr.length ? (
                  <ListLanguage
                    togglePopup={(ShowAudioLanguage) =>
                      handleModel("audioLanguages", ShowAudioLanguage)
                    }
                    audioLanguages={LanguageArr}
                    languageIds={
                      data?.audioLanguages ? data?.audioLanguages : []
                    }
                  />
                ) : null}
              </div>
              <div className="note-list-title status-text flex">
                <span className="label">{constantText.note_text}</span>
                <span className="text">{data?.episodeNote || "NA"}</span>
              </div>
              <LastModifiedBy
                data={
                  {
                    lastModifiedBy_populated: data?.lastModifiedByPopulated,
                    lastModifiedOn: data?.lastModifiedOn,
                  } || {}
                }
              />
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
                  {data?.episodeExternalId ? data?.episodeExternalId : "NA"}
                </span>
              </div>
              <div className="mov-cta-wrap flex">
                <div
                  onClick={() => viewEpisodeHandler(data)}
                  className={`mov-icon mov-view tooltip-sec auto-view-${data?.episodeExternalId}`}
                >
                  <ViewIcon />
                  <div className="tooltip-box">
                    {tvShowConstants.viewEpisode}
                  </div>
                </div>
                {data?.contentStatePopulated == tvShowConstants.unpublished && (
                  <span
                    className="edit tooltip-sec hand-cursor"
                    disabled={!canPublish}
                    onClick={() =>
                      handleConditionRoute("archive", data?.episodeId)
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
                {data?.contentStatePopulated == tvShowConstants.archived && (
                  <span
                    className="edit tooltip-sec hand-cursor"
                    disabled={!canPublish}
                    onClick={() =>
                      handleConditionRoute("restore", data?.episodeId)
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
              <div className="mov-link-btn">Index No - {data?.indexNumber}</div>
            </div>
            {data?.xmlPrefix && <div className="mov-map-st">Prefix - {data?.xmlPrefix}</div>}
          </div>
        </div>
        <div className="seasons-row flex justify-content-between">
          <div className="flex p-r-10">
            <div className="tvshow-name flex align-items-center">
              <span className="label">{tvShowConstants?.tvShow_view_text}</span>
              <span
                className="val"
                onClick={
                  data?.seasonTitle
                    ? () => {
                        viewShowHandler({
                          tvShowId: data?.tvShowId,
                          journeyType: data?.episodeJourney,
                        });
                      }
                    : () => {}
                }
              >
                {data?.tvShowId ? data?.tvShowTitle : "NA"}
              </span>
            </div>
            <div className="tvshow-seasons flex align-items-center">
              <span className="label">{tvShowConstants?.seasonText}</span>
              <span className="val" onClick={() => viewSeasonHandler(data)}>
                {data?.seasonTitle ? data?.seasonTitle : "NA"}
              </span>
            </div>
            <div className="tvshow-release flex align-items-center">
              <span className="label">
                {tvShowConstants?.EpisodeTelecastHeading}
              </span>
              <span className="val">
                {data?.telecastDate
                  ? moment(data?.telecastDate).format(
                      constantText.date_format_without_time
                    )
                  : "NA"}
              </span>
            </div>
          </div>
          <div
            className={
                data?.xmlGenerateStatus === "0" ? (MissingArr?.length ? `episode-xml-message redText`: `episode-xml-message greenText`)
                : 
                data?.xmlGenerateStatus === "1"? `episode-xml-message orangeText`
                : 
                data?.xmlGenerateStatus === "2" ? `episode-xml-message redText` 
                :
                data?.xmlGenerateStatus === "3" ? MissingArr?.length ? `episode-xml-message redText` : `episode-xml-message blueText`
                : null}
          >
            {data?.xmlGenerateStatus === "0" ? (MissingArr?.length ? `${xmlFieldMissingText}`: constantText?.xml_ready_to)
              : 
              data?.xmlGenerateStatus === "1" ? constantText?.xml_is_generating
              : 
              data?.xmlGenerateStatus === "2" ? constantText?.xml_generation_failed 
              :
              data?.xmlGenerateStatus === "3" ? (MissingArr?.length ? `${xmlFieldMissingText}` : constantText?.xml_already_generated)
              : null}
            {MissingArr?.length > 1 ? (
              <a
                id={"handleMissingMore"}
                onClick={() => handleModel("missingFields", MissingArr)}
              >
                {` +${MissingArr?.length - 1}`}
              </a>
            ) : null}
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
          des={modelData?.desc}
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

export default EpisodeCard;
