import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { movieMgmtActions } from "./../../../_actions/movieMgmt.action";
import { apiCalls } from "../../../_services/common.service";
import { completeImagePath } from '../../Common/CommonFunction/CommonFuntion';
import { history } from "../../../_helpers/history";
import { permissionObj } from "../../../_helpers/permission";
import Config from "../../../Config/config";
import { CommonModel } from "../../Common/Model/CommonModel";
import BreadcrumbsComp from "../../../_components/Common/BreadCrumbs/BreadCrumbs";
import { dateDiffDayCount } from "../../../_helpers/util";

import AngleLeftArrow from "images/angle-left-arrow.svg";
import TimetableIcon from "images/timetable-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
import WorldIcon from "images/world-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";


import {movieConstants} from '../Constants/movie.constants';
import { constantText } from "../../../_helpers/constants.text";



class LinkedMovies extends Component {
  state = {
    moviesList: [],
    showModelForCountries: false,
    showModelForClone: false,
    currentMovie: null,
    currentJourneyType: null,
    SelectedMovieMoreCountries: [],
    links: [
      {
        color: "inherit",
        text: constantText.dashBoard_text,
        route: "/dashboard",
      },
      {
        color: "inherit",
        text: constantText.movie_list_text,
        route: "/movie",
      },
    ],
    typography: [
      {
        color: "textPrimary",
        text: constantText.movie_linked_text,
        label: "primary",
      },
    ],
  }

  componentDidMount() {
    if (!this.props?.match?.params?.id) {
      history.push('/movie');
    }
    this.getMovies();
  }

  componentWillReceiveProps(nextProps) {
    let { linkedMovieList } = nextProps;
    const newMovies = this.setMovieListData(linkedMovieList);
    this.setState({
      moviesList: newMovies?.data || [],
    });
  }

  setMovieListData = (moviesList) => {
    moviesList?.data?.map((item) => {
      item["licenceExpDays"] = [];
      item.showDetails = false;
      if (item?.MovieLicenses?.length > 0) {
        item?.MovieLicenses.map((licenceItem) => {
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
    return moviesList;
  };

  getMovies = async() => {
    const query = this.props?.match?.params?.id;
    await this.props?.getAllLinkedMovies(query);
  }

  handleRoute = (route) => {
    history.push(route);
  };

  viewMovieHandler = (movie) => {
    const { movieId, journeyType } = movie;
    this.props?.history?.push({
      pathname: `${constantText.movie_view_route}/${movieId}`,
      state: { journeyType: journeyType },
    });
  };
  toggleCountryPopup = (countryArr) => {
    const newArr = countryArr?.slice(2, countryArr.length);
    this.setState({
      SelectedMovieMoreCountries : newArr,
      showModelForCountries : true
    })
  };
  cloneContent = async () => {
    const { currentMovie, currentJourneyType, showModelForClone } = this.state;
    const url = `${Config.movieClone}/${currentMovie}`;
    const res = await apiCalls(url, "POST", {}, constantText.movie_route, true);
    if (res) {
      const clonedVideo = res;
      let route =
        currentJourneyType == "3"
          ? "/single/movie"
          : currentJourneyType == "2"
          ? "/quick/movie"
          : "/movie";
      this.props.history.push({
        pathname: `${route}/edit/${clonedVideo}`,
      });
    } else {
      this.setState({ showModelForClone: !showModelForClone });
    }
  };
  showHideCountriesPopup = () =>{
    const { showModelForCountries } = this.state;
    this.setState({
      showModelForCountries : !showModelForCountries
    })
  }
  showHideClonePopup = (currentMovie, currentJourneyType) => {
    const { showModelForClone } = this.state;
    this.setState({
      currentMovie,
      currentJourneyType,
      showModelForClone: !showModelForClone,
    });
  };
  handleRouteExpiredLink = (movie) => {
    const { movieId, journeyType } = movie;
    this.props?.history?.push({
      pathname: `${constantText?.movie_view_route}/${movieId}`,
      state: { journeyType: journeyType, selectedTab: (journeyType == "1" ? 3 : (journeyType == "2" ? 2 : 1)) },
    });
  };
  render() {
    let { links, typography, showModelForClone, moviesList, SelectedMovieMoreCountries, showModelForCountries} = this.state;
    let { canCreate, canView } = permissionObj?.movies;
    let canClone = permissionObj?.movies?.clone?.canUpdate;
    const movies = moviesList?.length ? moviesList?.map((movie, i) => {
      const MovieLicensesCountries = movie?.countries
      ? movie?.countries?.split(",")
      : [];
      return (
        <div className="mov-l-box whitebox" key={i}>
           {movie?.journeyType && (
            <div className="m-tag">
              {constantText?.journeyType[movie?.journeyType]}
            </div>
          )}
           {movie?.licenceExpDays?.length > 0 && (
                <div className="license-badge" onClick={() => canCreate() ? this.handleRouteExpiredLink(movie) : () => {}} >
               {Math.min.apply(null, movie?.licenceExpDays) === 0
                ? constantText.license_expires_today
                : `${constantText.license_expires_in}  ${Math.min.apply(
                    null,
                    movie?.licenceExpDays
                  )}  ${constantText.day_s_text}`}
                </div>
            )}
          <div className="mov-info-box flex justify-content-between">
            <div className="left-area flex">
              <div className="movie-img">
              <img src={movie?.MovieImages?.[0]?.imageDetails?.url
                 ? completeImagePath(movie?.externalId, "list", movie?.MovieImages?.[0]?.imageDetails.url, movie?.MovieImages?.[0]?.imageDetails.resolution)
                 : "images/no-image.svg"
              }
                 alt={movie?.MovieImageSets?.setName ? movie?.MovieImageSets?.setName : "no image"} />
              </div>
              <div className="info">
                <div className="mov-detail flex align-items-center">
                  <h4>{movie?.title ? movie?.title : 'NA'}</h4>
                    {
                      movie?.subtype_populated?.title ?
                      <span className="s-badge dot-badge blue">{movie?.subtype_populated?.title}</span>
                      : ''
                    }
                    {
                      movie?.contentState_populated?.title ?
                      <span className="s-badge orange">{movie?.contentState_populated?.title}</span>
                      : ''
                    }
                  {/* <span className="s-badge red invalid-text">
                    *Invalid Licensing
                  </span> */}
                </div>
                <div className="time-loc-row flex align-items-center">
                  <span className="time">
                    <MovieGrayIcon /> { movie?.duration ?  movie?.duration : 'NA'}
                  </span>
                  <span className="loc">
                    <WorldIcon />{" "}
                    {MovieLicensesCountries?.length > 0
                      ? MovieLicensesCountries?.length > 2
                        ? MovieLicensesCountries[0] +
                          ", " +
                          MovieLicensesCountries[1]
                        : MovieLicensesCountries.join(", ")
                      : "N/A"}
                    {MovieLicensesCountries?.length > 2 ? (
                      <a
                        onClick={() =>
                          this.toggleCountryPopup(MovieLicensesCountries)
                        }
                      >
                        {` +${MovieLicensesCountries.length - 2}`}
                      </a>
                    ) : null}
                  </span>
                </div>
                <div className="status-text flex">
                  <span className="label">Last Modified by</span>
                  <span className="text">
                    <span>
                    {movie?.modifiedBy_populated
                        ? `${movie?.modifiedBy_populated?.first_name} ${movie?.modifiedBy_populated?.last_name}`
                        : "N/A"}
                    </span>
                    <span>
                    {movie?.modifiedOn
                        ? moment(
                            movie?.modifiedOn
                          ).format(constantText.date_format_without_time)
                        : "N/A"}
                    </span>
                    <span>
                    {movie?.modifiedOn
                        ? moment(
                          movie?.modifiedOn
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
                  <span className="num-id">{movie?.externalId ? movie?.externalId : 'N/A'}</span>
                </div>
                <div onClick={() => this.viewMovieHandler(movie)} className="mov-icon mov-view tooltip-sec">
                  <ViewIcon />
                  <div className="tooltip-box">{movieConstants.viewMovie}</div>
                </div>
                {(movie?.contentState_populated?.title.toLowerCase() !==
                    "publishing queue" &&
                    movie?.contentState_populated?.title.toLowerCase() !==
                    "archived") ? <div
                  disabled={canCreate() ? true : false}
                  onClick={() =>
                    canClone()
                      ? this.showHideClonePopup(
                        movie?.movieId,
                        movie?.journeyType
                        )
                      : constantText.no_permission
                  }
                  className="mov-icon mov-copy tooltip-sec"
                >
                  <CopyIcon />
                  <div className="tooltip-box">{movieConstants.copyMovie}</div>
                </div> : null}
              </div>
            </div>
          </div>
        </div>
      );
    }) : null;
    
    const MoreCountriesBlock = (<ul className="mov-con-list flex">{SelectedMovieMoreCountries?.map((item, index) => (
      <li className="col-6 col-md-4" key={index}>{item}</li>
    ))}</ul>);
    return(
      <div className="d-wrap c-n">
        <div className="movie-list-sec">
          <BreadcrumbsComp className="" links={links} typography={typography} />
          <div className="user-head profile-head flex justify-content-between align-items-center">
            <div
              className="back-user-btn flex align-items-center"
              onClick={() => this.handleRoute("/movie")}
            >
              <div className="text">
              <span>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{constantText.movie_linked_text}</span>
              </strong>
              </div>
            </div>
          </div>
          <div className="movies">
            { movies }
          </div>
          {
            !movies ?
            <div className="movies">
              <p>No Movie Found</p>
            </div>
            :
            ''
          }
        </div>
        <CommonModel
          className="popup-wrap status-popup" id="common-model-clone"
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
        <CommonModel
            className="popup-wrap status-popup" id="license-model"
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let { linkedMovieList } = state.movieMgmt_reducer;
  return {
    linkedMovieList
  };
};

const actionCreators = (dispatch) => {
  return {
    getAllLinkedMovies: (query) =>
      dispatch(movieMgmtActions.list_linked_movie_action(query)),
  };
};

export default connect(mapStateToProps, actionCreators)(LinkedMovies);