import React, { Component, Fragment } from "react";
import { tvShowConstants } from "../../TvShow/Constants/tvshow.constants";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import { history  } from "../../../_helpers/history";
import { constantText } from "../../../_helpers/constants.text";
import Config from "../../../Config/config";
import { apiCalls } from "../../../_services/common.service";
import BreadCrumbs from "../../Common/BreadCrumbs/BreadCrumbs";
import { breadCrumbs } from "./breadCrumbs";
import { CommonModel } from "../../Common/Model/CommonModel";
import { episodeBreadcrumbUrls } from "../../../_helpers/history";

import BottomScrollListener from "react-bottom-scroll-listener";

import moment from "moment";
//css
import "../../TvShow/PublishedHistory/PublishedHistoryTv.css";


class PublishedHistoryEpisode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentId: null,
      content_obj: null,
      language: "EN",
      license_History_arr: [],
      showModelForCountries: false,
      SelectedVideoMoreCountries:[],
      page :1,
      maxPage:null,
      count:null  ,
      isRequestIntiate:null,
      limit:10
    };
  }

  static getDerivedStateFromProps(props, state) {
    state.episodeId = props?.match?.params?.episodeId
    return state
  }

  handlePublishHistoryRoute = () => {
    const contentId = this.props?.match?.params?.id;
    const state = this.props.state;
    if (state === "view") {
      history.push("/tvshow/view/" + contentId);
    } else if (state === "quick-filing") {
      history.push("/tvshow/quick/edit/" + contentId);
    } else if (state === "single-landing-page") {
      history.push("/tvshow/single/edit/" + contentId);
    } else {
      history.push("/tvshow/edit/" + contentId);
    }
  };
  componentDidMount() {
    this.fetchContentData();
    this.fetchLicenseData();
  }

  fetchContentData = async () => {
    let contentId = this.props.match.params.episodeId;
    let url = `${Config.episode.episodeControlFields}/${contentId}`;
    let response = await apiCalls(url, "GET", {});
    if (response) {
      this.setState({
        content_obj: response,
      });
    }
  };

  fetchLicenseData = async () => {
    let {id, seasonId, episodeId} = this.props.match.params;
    const { isRequestIntiate ,limit,page} = this.state;
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false});
      let url = `${Config.episodeList}${Config.video.videoLicenseAudit}/${episodeId}?limit=${limit}&page=${page}`;
      let response = await apiCalls(url, "GET", {});
      if(response){
      this.generateLicenseArray (response)
      }else{
     this.setState({
          isRequestIntiate: true,
          totalCount: 0,
          license_History_arr: [],
        });
      }
    }
  };
  generateLicenseArray =  async (licenseArr)=>{
    const {limit , page ,license_History_arr } =this.state
    let license_arr =[];
    for( let licenseList of licenseArr?.licenceList){
    let license ={}
    license.countriesId = await this.countryMap(licenseList.countries)
    license.setName= licenseList?.setName
    license.status = licenseList?.status
    license.createdBy= licenseList?.createdBy
    license.createdOn = licenseList?.createdOn
    license.activatedBy =licenseList?.activatedBy
    license.activatedOn=  licenseList?.activatedOn
    license.expiredOn=licenseList?.validUntil
    license.expiredBy=licenseList?.createdBy
    license.inActivatedBy =  licenseList?.inActivatedBy
    license.inActivatedOn= licenseList?.inActivatedOn
    license_arr.push(license)  
    }
    const Count = licenseArr?.count ? licenseArr?.count: 0;
    const Page = Count ? Math.ceil(Count / limit) : 1;
    const nextPage = page + 1;  
    this.setState({
      license_History_arr: [...license_History_arr, ...license_arr] ,
      maxPage:Page , 
      page:nextPage,
      totalCount :licenseArr?.count,
      isRequestIntiate:true
    })
    }
    countryMap = async(countries)=>{
      let countryList = []
      countries?.forEach((item,index)=>{countryList.push(item[0]?.title)})
      return countryList
      }
      toggleCountryPopup = (countryArr) => {
        const newArr = countryArr?.slice(2, countryArr.length);
        this.setState({
          SelectedVideoMoreCountries: newArr,
          showModelForCountries: true,
        });
      };
      showHideCountriesPopup = () => {
        const { showModelForCountries } = this.state;
        this.setState({
          showModelForCountries: !showModelForCountries,
        });
      };

  checkCurrentStatus = (currentStatus) => {
    return currentStatus;
  };
  goBack = () => {
    this.props.history?.goBack();
  }

  nextCall = () => {
    const {maxPage, isRequestIntiate, page } = this.state;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.fetchLicenseData();
    }
  };
  render() {
    let { content_obj, page, license_History_arr ,showModelForCountries ,SelectedVideoMoreCountries } = this.state;
    let contentId = this.props.match?.params?.id;
    let licenseCount = license_History_arr.length
    let state = this.props.state;
    const { location } = this.props;
    const joinName = (obj) => {
      if (obj?.first_name || obj?.last_name) {
        return `${obj?.first_name} ${obj?.last_name}`;
      }
      else {
        return 'NA';
      }
    }
    const MoreCountriesBlock = (
      <ul className="mov-con-list flex">
        {SelectedVideoMoreCountries?.map((item, index) => (
          <li className="col-6 col-md-4" key={index}>
            {item}
          </li>
        ))}
      </ul>
    );
    const { match } = this.props;
    let { tvShowUrl, seasonUrl, episodeUrl } = episodeBreadcrumbUrls(location)
    return (
      <Fragment>
        <div className="d-wrap c-n">
          {/* <BreadcrumbsComp
            className=""
            links={breadCrumbs.links(url, match?.params?.id)}
            typography={breadCrumbs.typography} journeyType={location?.state?.journeyType}
          /> */}
          <BreadCrumbs className="" links={breadCrumbs.links(tvShowUrl, seasonUrl, episodeUrl, match?.params?.id, match?.params?.seasonId, match?.params?.episodeId)}
            typography={breadCrumbs.typography} />
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn">
              <span 
              data-test={"go-back"}
              onClick={() => this.props.history?.goBack()} >
                <AngleLeftArrow />
              </span>
              <strong>
                <span> {tvShowConstants.published_history_heading} </span>
              </strong>
            </div>
          </div>
          <div className="whitebox m-b-30">
            <div className="col-12">
              <div className="row con-field-wrap p-b-20 p-t-20">
                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_creation_text}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.createdAt
                    ? moment(content_obj?.createdAt).format(constantText.date_format_with_time)
                    : "NA"}
                </div>

                <div className="col-md-4 label-text">
                  {tvShowConstants.scheduled_published_date_n_time}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.scheduledAt
                    ? moment(content_obj?.scheduledAt).format(
                      constantText.date_format_with_time
                    )
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_first_published}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.firstPublishedAt
                    ? moment(content_obj?.firstPublishedAt).format(
                      constantText.date_format_with_time
                    )
                    : "NA"}
                </div>

                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_last_published}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.publishedAt
                    ? moment(content_obj?.publishedAt).format(
                      constantText.date_format_with_time
                    )
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_last_unpublished}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.unpublishedAt
                    ? moment(content_obj?.unpublishedAt).format(
                      constantText.date_format_with_time
                    )
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_last_updated}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.lastModifiedOn
                    ? moment(content_obj?.lastModifiedOn).format(constantText.date_format_with_time)
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_of_need_work_comment_by_user}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.needWorkAt
                    ? moment(content_obj?.needWorkAt).format(constantText.date_format_with_time)
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.date_and_time_of_archived}
                </div>
                <div className="col-md-8 label-val">
                {content_obj?.archivedAt
                    ? moment(content_obj?.archivedAt).format(
                      constantText.date_format_with_time
                    )
                    : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.created_By_text}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.createdBy ? joinName(content_obj?.createdBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.last_updated_by_text}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.lastModifiedBy ? joinName(content_obj?.lastModifiedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.last_published_by_text}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.publishedBy ? joinName(content_obj?.publishedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.last_unpublished_by_text}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.unpublishedBy ? joinName(content_obj?.unpublishedBy) : "NA"}
                </div>
                <div className="col-md-4 label-text">
                  {tvShowConstants.archivedBy_text}
                </div>
                <div className="col-md-8 label-val">
                  {content_obj?.archivedBy ? joinName(content_obj?.archivedBy) : "NA"}
                </div>
              </div>
              {license_History_arr && license_History_arr?.length>0&&(
              <div className="status-table p-b-20">
                <table>
                    <thead>
                      <tr>
                      <th className="ph-license-setName">SetName</th>
                          <th className=" ph-license-s">License Status</th>
                          <th className="ph-country-name">Group / Country</th>
                          <th className="ph-user-name">User Name</th>
                          <th className="ph-date-time">Date and Time</th>
                      </tr>
                    </thead>
                    <tbody>   
                    {
                    license_History_arr.map((licenseList,index)=>(
                      <tr>
                          <td className="license-s"> {licenseList?.setName ?licenseList?.setName : "NA"}</td>
                         <td className="country-name">{licenseList?.status ?licenseList?.status : "NA"}</td>
                        <td className="country-name">
                        {licenseList?.countriesId?.length > 0
                      ? licenseList?.countriesId?.length > 4
                        ? licenseList?.countriesId[0] +
                          ", " +
                          licenseList?.countriesId[1]
                        : licenseList?.countriesId.join(", ")
                      : "N/A"}
                    {licenseList?.countriesId?.length > 4 ? (
                      <a
                        data-test="toggle-country-popUp"
                        onClick={() =>
                          this.toggleCountryPopup(licenseList?.countriesId)
                        }
                      >
                        {` +${licenseList?.countriesId.length - 2}`}
                      </a>
                    ) : null}
                          </td>
                          <td className="user-name"> {licenseList?.createdBy ? joinName(licenseList?.createdBy) : "NA"}</td>
                      <td className="date-time"><span className="p-r-20">
                       {licenseList
                            ? moment(licenseList.createdOn).format(
                                constantText.date_format_with_time
                              )
                            : "NA"}
                        </span> </td>
                      </tr>
                      ))}
                    {page !== 1 && (
                  <BottomScrollListener
                    onBottom={() => {
                      this.nextCall();
                    }}
                  debounce={10000} offset={5}
                  />
                )}
                    </tbody>
                </table>
              </div>
              )}

          </div>
          </div>
          <CommonModel
          className="popup-wrap status-popup"
          id="common-model"
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
      </Fragment>
    );
  }
}

export default PublishedHistoryEpisode;
