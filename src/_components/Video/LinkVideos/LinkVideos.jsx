import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { videoMgmtActions } from "../../../_actions/videoMgmt.action";
import { completeImagePath } from '../../Common/CommonFunction/CommonFuntion';
import { history } from "../../../_helpers/history";
import { permissionObj } from "../../../_helpers/permission";
import Config from "../../../Config/config";
import { CommonModel } from "../../Common/Model/CommonModel";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import { dateDiffDayCount } from "../../../_helpers/util";
import {videoConstants} from '../Constants/video.constants';
import { constantText } from "../../../_helpers/constants.text";

//Service
import { apiCalls } from "../../../_services/common.service";
//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import TimetableIcon from "images/timetable-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
import WorldIcon from "images/world-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";




class LinkedVideos extends Component {
  state = {
    videoList: [],
    showModelForClone: false,
    currentJourneyType: null,
    showModelForCountries: false,
    SelectedVideoMoreCountries: [],
    links: [
      {
        color: "inherit",
        text: constantText.dashBoard_text,
        route: "/dashboard",
      },
      {
        color: "inherit",
        text: videoConstants.videoListText,
        route: "/video",
      },
    ],
    typography: [
      {
        color: "textPrimary",
        text: videoConstants.linkedVideos,
        label: "primary",
      },
    ],
  }

  componentDidMount() {
    if (!this.props?.match?.params?.id) {
      history.push(constantText.video_route);
    }
    this.getVideos();
  }

  componentWillReceiveProps(nextProps) {
    let { linkedVideoList } = nextProps;
    const newVideos = this.setVideoListData(linkedVideoList);
    this.setState({
      videoList: newVideos?.data || [],
    });
  }

  setVideoListData = (videoList) => {
    videoList?.data?.map(item => {
      item['licenceExpDays'] = [];
      item.showDetails = false;
      if (item?.VideoLicenses?.length > 0) {
        item?.VideoLicenses?.map(licenceItem => {
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
    return videoList;
  }

  getVideos = async() => {
    const query = this.props.match.params.id;
    await this.props.getAllLinkedVideos(query);
  }

  handleRoute = (route) => {
    history.push(route);
  };

  viewVideoHandler = (video) => {
    const { videoId, journeyType } = video;
    this.props.history.push({
      pathname: `${constantText.video_view_route}/${videoId}`,
      state: { journeyType: journeyType },
    });
  };
  toggleCountryPopup = (countryArr) => {
    const newArr = countryArr.slice(2, countryArr.length);
    this.setState({
      SelectedVideoMoreCountries : newArr,
      showModelForCountries : true
    })
  };
  cloneContent = async () => {
    const { currentVideo, currentJourneyType, showModelForClone } = this.state;
    const url = `${Config.videoClone}/${currentVideo}`;
    const res  = await apiCalls(url, "POST", {}, constantText.video_route, true);
    if(res){
      const clonedVideo = res;
      let route = currentJourneyType == "2" ? "/video/quick" : "/video";
      this.props.history.push({
        pathname: `${route}/edit/${clonedVideo}`
      });
    }
    else {
      this.setState({ showModelForClone: !showModelForClone});
    }
  };
  showHideClonePopup = (currentVideo, journeyType) => {
    const { showModelForClone } = this.state;
    this.setState({
      currentVideo,
      currentJourneyType: journeyType,
      showModelForClone: !showModelForClone,
    });
  };
  showHideCountriesPopup = () =>{
    const { showModelForCountries } = this.state;
    this.setState({
      showModelForCountries : !showModelForCountries
    })
  }
  handleRouteExpiredLink = (video) => {
    const { videoId, journeyType } = video;
    this.props.history.push({
      pathname: `${constantText.video_view_route}/${videoId}`,
      state: { journeyType: journeyType, selectedTab: (journeyType == "2" ? 2 : 3) },
    });
  };
  render() {
    let { links, typography, videoList,  showModelForClone, SelectedVideoMoreCountries, showModelForCountries} = this.state;
    let { canCreate, canView } = permissionObj?.videos;
    let canClone = permissionObj?.videos?.clone?.canUpdate;
    const videos = videoList?.length ? videoList?.map((video, i) => {
      const VideoLicensesCountries = video?.countries
      ? video?.countries?.split(",")
      : [];
      return (
        <div className="mov-l-box whitebox" key={i}>
           {video?.journeyType && (
            <div className="m-tag">
              {constantText?.journeyType[video?.journeyType]}
            </div>
          )}
           {video?.licenceExpDays?.length > 0 && (
                <div className="license-badge" onClick={() => canCreate() ? this.handleRouteExpiredLink(video) : () => {}} >
                {`License Expire in ${Math.min.apply(null, video?.licenceExpDays)} day(s)`}
                </div>
            )}
          <div className="mov-info-box flex justify-content-between">
            <div className="left-area flex">
              <div className="movie-img">
              <img src={video?.VideoImages?.[0]?.imageDetails?.url
                 ? completeImagePath(video?.externalId, "list", video?.VideoImages?.[0]?.imageDetails.url, video?.VideoImages?.[0]?.imageDetails.resolution)
                 : "images/no-image.svg"
              }
                 alt={video?.VideoImageSets?.setName ? video?.VideoImageSets?.setName : "no image"} />
              </div>
              <div className="info">
                <div className="mov-detail flex align-items-center">
                  <h4>{video?.title ? video?.title : 'NA'}</h4>
                    {
                      video?.subtype_populated?.title ?
                      <span className="s-badge dot-badge blue">{video?.subtype_populated?.title}</span>
                      : ''
                    }
                    {
                      video?.contentState_populated?.title ?
                      <span className="s-badge orange">{video?.contentState_populated?.title}</span>
                      : ''
                    }
                  {/* <span className="s-badge red invalid-text">
                    *Invalid Licensing
                  </span> */}
                </div>
                <div className="time-loc-row flex align-items-center">
                  <span className="time">
                    <MovieGrayIcon /> { video?.duration ?  video?.duration : 'NA'}
                  </span>
                  <span className="loc">
                    <WorldIcon />
                    {VideoLicensesCountries?.length > 0
                      ? VideoLicensesCountries?.length > 2
                        ? VideoLicensesCountries[0] +
                          ", " +
                          VideoLicensesCountries[1]
                        : VideoLicensesCountries.join(", ")
                      : "N/A"}
                    {VideoLicensesCountries?.length > 2 ? (
                      <a
                        onClick={() =>
                          this.toggleCountryPopup(VideoLicensesCountries)
                        }
                      >
                        {` +${VideoLicensesCountries.length - 2}`}
                      </a>
                    ) : null}
                  </span>
                </div>
                <div className="status-text flex">
                  <span className="label">Last Modified by</span>
                  <span className="text">
                    <span>
                    {video?.lastModifiedBy_populated
                        ? `${video?.lastModifiedBy_populated?.first_name} ${video?.lastModifiedBy_populated?.last_name}`
                        : "N/A"}
                    </span>
                    <span>
                    {video?.modifiedOn
                        ? moment(
                            video?.modifiedOn
                          ).format(constantText.date_format_without_time)
                        : "N/A"}
                    </span>
                    <span>
                    {video?.modifiedOn
                        ? moment(
                          video?.modifiedOn
                          ).format(constantText.time_formate)
                        : "N/A"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="right-area">
              <div className="mov-icon-sec flex align-items-center">
                <div className="mov-id">
                  <span className="text-id">{constantText.external_id_text}</span>
                  <span className="num-id">{video?.externalId ? video?.externalId : 'N/A'}</span>
                </div>
                <div class="mov-cta-wrap flex">
                <div onClick={() => this.viewVideoHandler(video)} className="mov-icon mov-view tooltip-sec">
                  <ViewIcon />
                  <div className="tooltip-box">{videoConstants.viewVideo}</div>
                </div>
               {(video?.contentState_populated?.title.toLowerCase() !==
                    "publishing queue" &&
                    video?.contentState_populated?.title.toLowerCase() !==
                    "archived") ? 
                  <div
                    onClick={() =>
                      canClone()
                        ? this.showHideClonePopup(video?.videoId, video?.journeyType)
                        : null
                    }
                      className="mov-icon mov-view tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">
                        {videoConstants.copyVideo}
                      </div>
                    </div> : null}
                    </div>
              </div>
            </div>
          </div>
        </div>
      );
    }) : null;
    
    const MoreCountriesBlock = (<ul className="mov-con-list flex">{SelectedVideoMoreCountries.map((item, index) => (
      <li className="col-6 col-md-4" key={index}>{item}</li>
    ))}</ul>);
    return(
      <div className="d-wrap c-n">
        <div className="movie-list-sec">
          <BreadcrumbsComp className="" links={links} typography={typography} />
          <div className="user-head profile-head flex justify-content-between align-items-center">
            <div
              className="back-user-btn flex align-items-center auto-back-btn"
              onClick={() => this.handleRoute(constantText.video_route)}
            >
              <div className="text">
              <span>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{videoConstants.linkedVideos}</span>
              </strong>
              </div>
            </div>
          </div>
          <div className="movies">
            { videos }
          </div>
          {
            !videos ?
            <div className="movies">
              <p>{videoConstants.videoNotFound}</p>
            </div>
            :
            ''
          }
        </div>
        <CommonModel
            className="popup-wrap status-popup"
            state={showModelForCountries}
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
  let { linkedVideoList } = state.videoMgmt_reducer;
  return {
    linkedVideoList
  };
};

const actionCreators = (dispatch) => {
  return {
    getAllLinkedVideos: (query) =>
      dispatch(videoMgmtActions.list_linked_video_action(query)),
  };
};

export default connect(mapStateToProps, actionCreators)(LinkedVideos);