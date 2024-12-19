import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { tvShowsActions } from "../../../_actions/tvShows.action";
import { completeImagePath } from '../../Common/CommonFunction/CommonFuntion';
import ListLanguage from "../../Common/ListLanguage/ListLanguage";
import { history } from "../../../_helpers/history";
import { permissionObj } from "../../../_helpers/permission";
import Config from "../../../Config/config";
import { CommonModel } from "../../Common/Model/CommonModel";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import { dateDiffDayCount } from "../../../_helpers/util";
import { tvShowConstants } from '../Constants/tvshow.constants';
import { constantText } from "../../../_helpers/constants.text";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { LastModifiedBy } from "../../Common/LastModifiedBy/LastModifiedBy";

//Service
import { apiCalls } from "../../../_services/common.service";
//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import WorldIcon from "images/world-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";
import DownDisableArrow from "images/down-disable-arrow.svg";
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
import DownArrow from "images/down-arrow.svg";
import UpArrow from "images/up-arrow.svg";
import TvshowIcon from "images/movie-icon.svg";


class LinkedShows extends Component {
  state = {
    tvshowList: [],
    LanguageArr: [],
    allStatus: [],
    showModelForClone: false,
    currentJourneyType: null,
    SelectedShowMoreCountries: [],
    showModelForMore: false,
    modelForCountry: true,
    model: {
      detail: "",
      open: false,
      desc: "",
      btn1: constantText.yes_text,
      btn2: constantText.no_text,
    },
    links: [
      {
        color: "inherit",
        text: constantText.dashBoard_text,
        route: "/dashboard",
      },
      {
        color: "inherit",
        text: tvShowConstants.tvShow_list_text,
        route: "/tvshow",
      },
    ],
    typography: [
      {
        color: "textPrimary",
        text: tvShowConstants.LinkedShows,
        label: "primary",
      },
    ],
  }

  componentDidMount() {
    if (!this.props?.match?.params?.id) {
      history.push(constantText.video_route);
    }
    this.getAllStatus();
    this.getShows();
    this.getAllLanguage();
  }

  componentWillReceiveProps(nextProps) {
    let { linkedTvShowList } = nextProps;
    const newShows = this.setShowsData(linkedTvShowList);
    this.setState({
      tvshowList: newShows || [],
    });
  }
  getAllStatus = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/ContentState`,
      "GET",
      {},
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ allStatus: response });
    }
  };
  getAllLanguage = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/Language`,
      "GET",
      {},
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ LanguageArr: response });
    }
  };
  handleConditionRoute = (view, id) => {
    let canArchive = permissionObj?.tvShows?.archive?.canUpdate();
    let canPublish = permissionObj?.tvShows?.publish?.canCreate();

    if (!canPublish) return;
    let detail = {};
    detail.contentId = id;
    detail.view = view;
    if (view === "archive" || view === "restore") {
      if (canArchive) {
        const { model } = this.state;
        let shallowModel = { ...model };
        shallowModel.detail = detail;
        shallowModel.open = true;
        shallowModel.title =
          view === "archive"
            ? constantText.archived_content
            : constantText.restore_content;
        shallowModel.desc =
          view === "archive"
            ? constantText.archived_content_desc
            : constantText.restore_content_desc;
        this.setState({ model: shallowModel });
      }
    }
  };
  setShowsData = (tvshowList) => {
    tvshowList?.map(item => {
      item['licenceExpDays'] = [];
      item.showDetails = false;
      if (item?.tvShowLicenses?.length > 0) {
        item?.tvShowLicenses?.map(licenceItem => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays == 1 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        })
      }
    })
    return tvshowList;
  }

  getShows = async() => {
    const query = this.props.match.params.id;
    await this.props.getAllLinkedShows(query);
  }

  handleRoute = (route) => {
    history.push(route);
  };

  viewShowHandler = (show) => {
    const { tvShowId, journeyType } = show;
    this.props.history?.push({
      pathname: `${constantText.tvshow_view_route}/${tvShowId}`,
      state: { journeyType: journeyType },
    });
  };
  cloneContent = async () => {
    const { match } = this.props;
    const { currentShow, showModelForClone, currentJourneyType } = this.state;

    const cloneUrl = `${Config?.tvshowClone}/${currentShow?.tvShowId}`;
    const res = await apiCalls(cloneUrl, "POST", {}, match?.url, true);
    if (res) {
      const clonedVideo = res;
      let tvShowroute =
        currentJourneyType == "3"
          ? "/tvshow/single/edit"
          : currentJourneyType == "2"
          ? "/tvshow/quick/edit"
          : "/tvshow/edit";
      this.props.history.push({
        pathname: `${tvShowroute}/${clonedVideo}`,
      });
    } else {
      this.setState({ showModelForClone: !showModelForClone });
    }
  };

  showHideClonePopup = (currentShow, journeyType) => {
    const { showModelForClone } = this.state;
    this.setState({
      currentShow,
      currentJourneyType: journeyType,
      showModelForClone: !showModelForClone,
    });
  };
  showHideCountriesPopup = () =>{
    const { showModelForMore } = this.state;
    this.setState({
      showModelForMore : !showModelForMore
    })
  }
  toggleMorePopup = (countryArr, forCountry = true) => {
    const newArr = countryArr?.slice(2, countryArr.length);
    this.setState({
      SelectedShowMoreCountries: newArr,
      showModelForMore: true,
      modelForCountry: forCountry,
    });
  };
  handleModel = async (action, model) => {
    let shallowModel = { ...model };
    // Archive to Draft
    if (
      action &&
      (shallowModel.detail?.view === "archive" ||
        shallowModel.detail?.view === "restore")
    ) {
      let { allStatus } = this.state;
      const cStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.unpublished
          : constantText.tvShowsConstants.archived;
      const nStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.archived
          : constantText.tvShowsConstants.draft;
      const currentStatus = allStatus.find((item) => item?.title === cStatus);
      const nextState = allStatus.find((item) => item?.title === nStatus);
      let data = {
        fromState: currentStatus?.id,
        toState: nextState?.id,
        contentType: 'tvShow',
        contentData: {},
      };
      let tabName =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.archived
          : constantText.tvShowsConstants.draft;
      this.archiveServerCalls(model?.detail?.contentId, data, tabName);
    }
    shallowModel.for = "";
    shallowModel.open = false;
    shallowModel.title = "";
    shallowModel.desc = "";
    this.setState({ model: shallowModel });
  };
  archiveServerCalls = async (id, data, tabName) => {
    let response = await apiCalls(
      `${Config.workflowAPI}/${id}`,
      "PUT",
      data,
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ tvshowList : []}, () => {
        this.getShows();
      })
    }
  };
  viewSeasonHandler = (show, isNested = false) => {
    const { match } = this.props;
    const { id } = match?.params;
    let stateMode = "list";
    if (isNested) {
      stateMode = "nestedlist";
    }
    const { seasonId, journeyType, tvShowId } = show;
    this.props.history.push({
      pathname: `/tvshow/view/${tvShowId}/season/view/${seasonId}`,
      state: { journeyType: journeyType, stateMode },
    });
  };
  viewFirstChild = async (index, TvshowAsset, tvshow) => {
    const { tvshowList } = this.state;
    const copyTvshowList = [...tvshowList];
    const copyTvshow = copyTvshowList[index];
    const isOpen = !!copyTvshow?.isOpened;
    if (isOpen === false && !!!copyTvshow?.childAssets?.length) {
      copyTvshow.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(TvshowAsset);
      if (res) {
        copyTvshow.childAssets = this.setNestedListData(res, tvshow);
        this.setState({
          tvshowList: copyTvshowList,
        });
      }
    } else {
      copyTvshow.isOpened = !isOpen;
      this.setState({
        tvshowList: copyTvshowList,
      });
    }
  };
  fetchAssignedAssets = async (tvshowId) => {
    const url = `${Config.tvshowSeason}/${tvshowId}`;
    //ListCall
    let response = await apiCalls(
      url,
      "GET",
      null,
      constantText.tvshow_list_route,
      false
    );
    return response;
  };
  setNestedListData = (list, tvshow) => {
    list?.map((item) => {
      item["licenceExpDays"] = [];
      item.showDetails = false;
      if (item?.seasonLicenses?.length > 0) {
        item?.seasonLicenses.map((licenceItem) => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      }
    else if(tvshow?.tvShowLicenses?.length > 0){
      tvshow?.tvShowLicenses.map((licenceItem) => {
        if (licenceItem?.validUntil) {
          let days = dateDiffDayCount(licenceItem?.validUntil);
          let signDays = Math.sign(days);
          let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
          if (signDays >= 0 && expDays) {
            item["licenceExpDays"].push(days);
          }
        }
      });
    }
    });
    return list;
  };
  viewEpisodeList = (tvshowId, seasonId) => {
    const route = `/tvshow/view/${tvshowId}/season/view/${seasonId}/episode`;
    history.push({pathname: route});
  }
  handleRouteExpiredLink = (show) => {
    const { tvShowId, journeyType } = show;
    this.props.history?.push({
      pathname: `${constantText.tvshow_view_route}/${tvShowId}`,
      state: { journeyType: journeyType, selectedTab: (journeyType == "2" ? 1 : 2) },
    });
  };
  render() {
    let { links, typography, model, LanguageArr, tvshowList,  showModelForClone, SelectedShowMoreCountries, showModelForMore} = this.state;
    let { canCreate, canView } = permissionObj?.tvShows;
    let canClone = permissionObj?.tvShows?.clone?.canUpdate;
    let canPublish = permissionObj?.tvShows?.publish?.canCreate();
    let canArchive = permissionObj?.tvShows?.archive?.canUpdate;
    let canCloneSeason = permissionObj?.season?.clone?.canUpdate;
    let canViewLicense = permissionObj?.tvShows?.licenceModule?.canView();
    const tvshows = tvshowList?.length ? tvshowList?.map((tvshow, i) => {
      const ShowLicensesCountries = tvshow?.countries
      ? tvshow?.countries?.split(",")
      : [];
      return (
        <div className="mov-l-box whitebox" key={i}>
            <div className="nested-view">
              <div className="parent">
                {tvshow?.season && tvshow?.season?.length ? (
                  <div
                    data-test="tvshow-child-arrow"
                    className={`icon auto-down-arrow-${i}`}
                    onClick={() =>
                      this.viewFirstChild(i, tvshow?.tvShowId, tvshow)
                    }
                  >
                    {tvshow?.isOpened ? <UpArrow /> : <DownArrow />}
                  </div>
                ) : (
                  <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">
                      {constantText.collection_no_child_text}
                    </div>
                  </div>
                )}
                <div className="pos-rel">
                  {tvshow?.journeyType && (
                    <div className="m-tag">
                      {constantText?.journeyType[tvshow?.journeyType]}
                    </div>
                  )}
                  {tvshow?.licenceExpDays?.length > 0 && (
                    <div
                      className={
                        canViewLicense
                          ? "license-badge"
                          : "license-badge tooltip-sec nopermission"
                      }
                      onClick={() =>
                        canViewLicense
                          ? this.handleRouteExpiredLink(tvshow)
                          : () => {}
                      }
                    >
                      {Math.min.apply(null, tvshow?.licenceExpDays) === 0
                        ? constantText.license_expires_today
                        : `${constantText.license_expires_in}  ${Math.min.apply(
                            null,
                            tvshow?.licenceExpDays
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
                            tvshow?.TvShowImages?.[tvshow?.TvShowImages?.length - 1]?.imageDetails?.url
                              ? completeImagePath(
                                  tvshow?.externalId,
                                  "list",
                                  tvshow?.TvShowImages?.[tvshow?.TvShowImages?.length - 1]?.imageDetails?.url,
                                  tvshow?.TvShowImages?.[tvshow?.TvShowImages?.length - 1]?.imageDetails
                                    ?.resolution
                                )
                              : "images/no-image.svg"
                          }
                          alt={
                            tvshow?.externalId ? tvshow?.externalId : "no image"
                          }
                        />
                      </div>
                      <div className="info">
                        <div className="mov-detail flex align-items-center">
                          <h4>{tvshow?.title ? tvshow?.title : "NA"}</h4>
                          <BadgeBox
                            status={tvshow?.subtype_populated?.title}
                            dot={true}
                            color={"blue"}
                          />
                          <BadgeBox
                            status={tvshow?.contentState_populated?.title}
                          />
                          {/* <span className="s-badge red invalid-text">
                            *Invalid Licensing
                          </span> */}
                        </div>
                        {/* <div className="global-title status-text flex">
                          <span className="label">Global Title</span>
                          <span className="text">
                            {tvshow?.gloaltitle ? tvshow?.gloaltitle : "NA"}
                          </span>
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
                              <a
                                onClick={() =>
                                  this.toggleMorePopup(ShowLicensesCountries)
                                }
                              >
                                {` +${ShowLicensesCountries.length - 2}`}
                              </a>
                            ) : null}
                          </span>
                          {LanguageArr.length ? (
                            <ListLanguage
                              togglePopup={this.toggleMorePopup}
                              audioLanguages={LanguageArr}
                              languageIds={
                                tvshow?.audioLanguages
                                  ? tvshow?.audioLanguages
                                  : []
                              }
                            />
                          ) : null}
                        </div>
                        <div className="note-list-title status-text flex">
                          <span className="label">
                            {constantText.note_text}
                          </span>
                          <span className="text">{tvshow?.note || "NA"}</span>
                        </div>
                        <LastModifiedBy
                          data={tvshow || {}}
                          statusText={'Last Modified by' || ""}
                        />
                        {tvshow?.transcodingUpdate && (
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
                            {tvshow?.externalId ? tvshow?.externalId : "NA"}
                          </span>
                        </div>
                        <div className="mov-cta-wrap flex">
                          <div
                            onClick={() => this.viewShowHandler(tvshow)}
                            className={`mov-icon mov-view tooltip-sec auto-view-${i}`}
                          >
                            <ViewIcon />
                            <div className="tooltip-box">
                              {tvShowConstants.viewTvshows}
                            </div>
                          </div>
                          {tvshow?.contentState_populated?.title !==
                            tvShowConstants.archived && (
                            <div
                              onClick={() =>
                                canClone()
                                  ? this.showHideClonePopup(
                                      tvshow,
                                      "tvshow",
                                      tvshow?.journeyType
                                    )
                                  : constantText.no_permission
                              }
                              className={`mov-icon mov-view tooltip-sec auto-clone-${i}`}
                            >
                              <CopyIcon />
                              <div className="tooltip-box">
                                {tvShowConstants.copyTvshows}
                              </div>
                            </div>
                          )}
                          {tvshow?.contentState_populated?.title ==
                            tvShowConstants.unpublished && (
                            <span
                              className="edit tooltip-sec hand-cursor"
                              disabled={!canPublish}
                              onClick={() =>
                                this.handleConditionRoute(
                                  "archive",
                                  tvshow?.tvShowId
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
                          {tvshow?.contentState_populated?.title ==
                            tvShowConstants.archived && (
                            <span
                              className="edit tooltip-sec hand-cursor"
                              disabled={!canPublish}
                              onClick={() =>
                                this.handleConditionRoute(
                                  "restore",
                                  tvshow?.tvShowId
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
                    </div>
                  </div>
                </div>
              </div>
              {/* Child start */}
              {tvshow?.isOpened && tvshow?.childAssets?.length
                ? tvshow?.childAssets.map((firstChild, firstIndex) => {
                    const ShowLicensesChildCountries = firstChild?.countries
                      ? firstChild?.countries?.split(",")
                      : tvshow?.countries
                      ? tvshow?.countries?.split(",")
                      : [];
                    return (
                      <div key={firstIndex} className="child pos-rel">
                        {firstChild?.journeyType && (
                          <div className="m-tag">
                            {constantText?.journeyType[firstChild?.journeyType]}
                          </div>
                        )}

                        {firstChild?.licenceExpDays?.length > 0 && (
                          <div
                            className={
                              canViewLicense
                                ? "license-badge"
                                : "license-badge tooltip-sec nopermission"
                            }
                            onClick={() =>
                              canViewLicense
                                ? this.handleRouteExpiredLink(firstChild, true)
                                : () => {}
                            }
                          >
                            {Math.min.apply(
                              null,
                              firstChild?.licenceExpDays
                            ) === 0
                              ? constantText.license_expires_today
                              : `${
                                  constantText.license_expires_in
                                }  ${Math.min.apply(
                                  null,
                                  firstChild?.licenceExpDays
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
                                  firstChild?.SeasonImages?.[firstChild?.SeasonImages?.length - 1]?.imageDetails
                                    ?.url
                                    ? completeImagePath(
                                        firstChild?.externalId,
                                        "list",
                                        firstChild?.SeasonImages?.[firstChild?.SeasonImages?.length - 1]
                                          ?.imageDetails.url,
                                        firstChild?.SeasonImages?.[firstChild?.SeasonImages?.length - 1]
                                          ?.imageDetails.resolution
                                      )
                                    : tvshow?.TvShowImages?.[tvshow?.TvShowImages?.length -1]?.imageDetails
                                        ?.url
                                    ? completeImagePath(
                                        tvshow?.externalId,
                                        "list",
                                        tvshow?.TvShowImages?.[tvshow?.TvShowImages?.length -1]?.imageDetails
                                          .url,
                                        tvshow?.TvShowImages?.[tvshow?.TvShowImages?.length -1]?.imageDetails
                                          .resolution
                                      )
                                    : "images/no-image.svg"
                                }
                                alt={
                                  firstChild?.externalId
                                    ? firstChild?.externalId
                                    : "no image"
                                }
                              />
                            </div>
                            <div className="info">
                              <div className="mov-detail flex align-items-center">
                                <h4>
                                  {firstChild?.title ? firstChild?.title : "NA"}
                                </h4>
                                <BadgeBox
                                  status={
                                    firstChild?.contentState_populated?.title
                                  }
                                />
                              </div>
                              {/* <div className="global-title status-text flex">
                                <span className="label">Global Title</span>
                                <span className="text">
                                  {firstChild?.globaltitle
                                    ? firstChild?.globaltitle
                                    : "NA"}
                                </span>
                              </div> */}
                              <div className="time-loc-row flex align-items-center">
                                <span className="loc">
                                  <WorldIcon />{" "}
                                  {ShowLicensesChildCountries?.length > 0
                                    ? ShowLicensesChildCountries?.length > 2
                                      ? ShowLicensesChildCountries[0] +
                                        ", " +
                                        ShowLicensesChildCountries[1]
                                      : ShowLicensesChildCountries.join(", ")
                                    : "NA"}
                                  {ShowLicensesChildCountries?.length > 2 ? (
                                    <a
                                      onClick={() =>
                                        this.toggleMorePopup(
                                          ShowLicensesChildCountries
                                        )
                                      }
                                    >
                                      {` +${
                                        ShowLicensesChildCountries.length - 2
                                      }`}
                                    </a>
                                  ) : null}
                                </span>
                                {LanguageArr.length ? (
                                  <ListLanguage
                                    togglePopup={this.toggleMorePopup}
                                    audioLanguages={LanguageArr}
                                    languageIds={
                                      firstChild?.audioLanguages
                                        ? firstChild?.audioLanguages
                                        : tvshow?.audioLanguages
                                        ? tvshow?.audioLanguages
                                        : []
                                    }
                                  />
                                ) : null}
                              </div>
                              <div className="note-list-title status-text flex">
                                <span className="label">
                                  {constantText.note_text}
                                </span>
                                <span className="text">
                                  {firstChild?.note
                                    ? firstChild?.note
                                    : tvshow?.note
                                    ? tvshow?.note
                                    : "NA"}
                                </span>
                              </div>
                              <LastModifiedBy
                                data={firstChild || {}}
                                statusText={'Last Modified by' || ""}
                              />
                              {firstChild?.transcodingUpdate && (
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
                                  {firstChild?.externalId
                                    ? firstChild?.externalId
                                    : "NA"}
                                </span>
                              </div>
                              <div className="mov-cta-wrap flex">
                                <div
                                  onClick={() =>
                                    this.viewSeasonHandler(
                                      {
                                        seasonId: firstChild?.id,
                                        tvShowId: firstChild?.tvShowId,
                                        journeyType: firstChild?.journeyType,
                                      },
                                      true
                                    )
                                  }
                                  className="mov-icon mov-view tooltip-sec"
                                >
                                  <ViewIcon />
                                  <div className="tooltip-box">
                                    {tvShowConstants.viewSeason}
                                  </div>
                                </div>
                                {firstChild?.contentState_populated?.title !==
                                  tvShowConstants.archived && (
                                  <div
                                    onClick={() =>
                                      canClone()
                                        ? this.showHideClonePopup(
                                            {
                                              tvshowid: firstChild?.tvShowId,
                                              seasonid: firstChild?.id,
                                            },
                                            "season",
                                            firstChild?.journeyType
                                          )
                                        : constantText.no_permission
                                    }
                                    className={`mov-icon mov-view tooltip-sec auto-clone-${i}`}
                                  >
                                    <CopyIcon />
                                    <div className="tooltip-box">
                                      {tvShowConstants.copySeason}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {firstChild?.episodeCount ? (
                              <div className="mov-link flex justify-content-end">
                                <div
                                  onClick={() =>
                                    this.viewEpisodeList(
                                      firstChild?.tvShowId,
                                      firstChild?.id
                                    )
                                  }
                                  className={`mov-link-btn auto-mov-link-btn`}
                                >
                                  <TvshowIcon />{" "}
                                  <span>
                                    {"Episodes"} +{firstChild?.episodeCount}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
              {/* Child end */}
            </div>

        </div>
      );
    }) : null;
    
    const MoreCountriesBlock = (<ul className="mov-con-list flex">{SelectedShowMoreCountries?.map((item, index) => (
      <li className="col-6 col-md-4" key={index}>{item}</li>
    ))}</ul>);
    return(
      <div className="d-wrap c-n">
        <div className="movie-list-sec">
          <BreadcrumbsComp className="" links={links} typography={typography} />
          <div className="user-head profile-head flex justify-content-between align-items-center">
            <div
              data-test = "handle-route"
              className="back-user-btn flex align-items-center auto-back-btn"
              onClick={() => this.handleRoute(constantText.tvshow_list_route)}
            >
              <div className="text">
              <span>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{tvShowConstants.LinkedShows}</span>
              </strong>
              </div>
            </div>
          </div>
          <div className="movies">
            { tvshows }
          </div>
          {
            !tvshows ?
            <div className="movies">
              <p>{tvShowConstants.videoNotFound}</p>
            </div>
            :
            ''
          }
        </div>
        <CommonModel
          className="popup-wrap status-popup"
          state={model.open}
          showIcon={false}
          showTitle={true}
          title={model.title}
          showDes={true}
          des={model.desc}
          showBtn1={true}
          btn1Text={model.btn1}
          btn1Action={() => this.handleModel(true, model)}
          showBtn2={true}
          btn2Text={model.btn2}
          btn2Action={() => this.handleModel(false, model)}
        />
        <CommonModel
            className="popup-wrap status-popup"
            id="common-model"
            state={showModelForMore}
            showTitle={true}
            title={constantText.license_country_text}
            showIcon={false}
            showDes={true}
            des={MoreCountriesBlock}
            desWithoutDialogText={true}
            showBtn1={false}
            showBtn2={true}
            btn2Text={constantText.close_text}
            btn2Action={() => this.showHideCountriesPopup()}
            handleClose={() => this.showHideCountriesPopup()}
          />
         <CommonModel
          className="popup-wrap status-popup"
          id="common-model-2nd"
          state={showModelForClone}
          showTitle={true}
          title={constantText.Clone_content}
          showIcon={false}
          showDes={true}
          des={constantText.clone_popup_message}
          showBtn1={true}
          btn1Text={constantText.yes_text}
          btn1Action={this.cloneContent}
          showBtn2={true}
          btn2Text={constantText.no_text}
          btn2Action={() => this.showHideClonePopup(null)}
          handleClose={() => this.showHideClonePopup(null)}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let { linkedTvShowList } = state.tvShows_reducer;
  return {
    linkedTvShowList
  };
};

const actionCreators = (dispatch) => {
  return {
    getAllLinkedShows: (query) =>
      dispatch(tvShowsActions.list_linked_show_action(query)),
  };
};

export default connect(mapStateToProps, actionCreators)(LinkedShows);