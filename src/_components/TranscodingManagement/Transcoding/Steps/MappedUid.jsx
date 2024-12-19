import React, { Component } from "react";
import moment from "moment";
import BottomScrollListener from "react-bottom-scroll-listener";
import Divider from "@material-ui/core/Divider";
import Drawer from '@material-ui/core/Drawer';

//Common files
import InlineLoader from "../../../Common/InlineLoader/InlineLoader";
import ButtonField from "../../../Common/ButtonField/ButtonField";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import Checkbox from '../../../Common/CheckBox/CheckBox'
import DatePicker from "../../../Common/DatePicker/DatePicker";
import FormRender from "../../../Common/FormHelper/FormRender";
import { createQuery } from "../../../Common/CommonFunction/CommonFuntion";
import { CommonModel } from "../../../Common/Model/CommonModel";

//Helper files
import { showSuccessErrorMsg } from '../../../../_actions/alertMessages.action';
import { constantText } from "../../../../_helpers/constants.text";
import { apiCalls } from "../../../../_services/common.service";
import { DEFAULT_JSON } from "../../../../_helpers/util";
import Config from "../../../../Config/config";
import { history } from "../../../../_helpers/history";

//Json files
import HistoryFilter from "../../Schema/HistoryFilter.json";

//Icons
import LightIcon from "images/light-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
import FilterIcon from "images/filter-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";

class MappedUid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checklistData: null,
      assestBeforeTvPopup: false,
      redirectChecklist: false,
      transcodingList: [],
      isRequestIntiate: false, showFilterDrawer: false, maxPage: null, filterApplied: false,
      paramQuery: {
        limit: constantText.search_limit, externalId: "",
        page: 0, contentState: ""
      },
      filterByDate: HistoryFilter.filterByDate, formValidity: true,
      filters: DEFAULT_JSON(HistoryFilter.filters),
      newAssets: []
    };
  }

  componentDidMount() {
    let { paramQuery } = this.state;
    this.setState({
      isRequestIntiate: true,
      paramQuery: {
        ...paramQuery,
        externalId: ""
      }
    }, () => this.getAllTranscodings());
  }

  componentWillUnmount = () => {
    this.clearFilter();
  }

  nextCall = () => {
    const { maxPage, isRequestIntiate, paramQuery } = this.state;
    const { page } = paramQuery;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getAllTranscodings();
    }
  };

  getAllTranscodings = async () => {
    let { transcodingList, paramQuery, filterByDate, filters } = this.state;
    let { limit, page } = paramQuery;
    const query = createQuery({ paramQuery: { ...paramQuery }, filterByDate, filters });
    const url = query ? `${Config.transcodingHistoryList}${query}` : Config.transcodingHistoryList;
    const response = await apiCalls(url, 'GET', {}, '/transcoding', true);
    if (response) {
      const { count, rows } = response;
      const maxPage = count ? Math.floor(count / limit) : 0;
      rows.forEach(row => {
        row.isChecked = false
      })
      this.setState({
        transcodingList: [...transcodingList, ...rows], maxPage,
        paramQuery: {
          ...paramQuery,
          page: page + 1
        }
      });
    }
  }

  handleChange = event => {
    let { paramQuery } = this.state;
    const { value } = event.target;
    this.setState({
      paramQuery: {
        ...paramQuery,
        externalId: value
      }
    });
  }

  handleDateChange = (type, index, event) => {
    let { value } = event.target;
    const { filterByDate } = this.state;
    let startDate = filterByDate[index].date.startDate;
    let endDate = filterByDate[index].date.endDate;

    filterByDate[index].date.startDate = ((type === "startDate") &&
      (moment(value).isSameOrBefore(endDate) || !endDate || value === "")) ? value : startDate;
    filterByDate[index].date.endDate = ((type === "endDate") &&
      (moment(value).isSameOrAfter(startDate) || !startDate || value === "")) ? value : endDate;

    const isDateValid = [filterByDate[0]].findIndex(
      item => ((item.date.startDate && item.date.endDate) || (!item.date.startDate && !item.date.endDate))
    );
    const isTelecastDateValid = [filterByDate[1]].findIndex(
      item => ((item.date.startDate && item.date.endDate) || (!item.date.startDate && !item.date.endDate))
    );
    this.setState({
      formValidity: (isDateValid > -1 && isTelecastDateValid > -1) ? true : false,
      filterByDate
    });
  };

  setSelectDataArr = (data, index) => {
    const shallowArr = [...this.state.filters];
    const { name } = shallowArr[index];
    data = (name == 'status') ? data.filter(obj =>
      (obj.title != 'Published' && obj.title != 'Publishing Queue' && obj.title != 'Archived')) : data
    shallowArr[index].data = data;
    this.setState({ filters: shallowArr });
  };

  handleFilter = (event, index) => {
    let { filters } = this.state;
    const { value } = event.target;
    let shallowArr = [...filters];
    shallowArr[index]['value'] = value;
    if (shallowArr[index]['name'] == "isBeforetvApplicable") {
      const showAirTimeIndex = shallowArr.findIndex(item => item.name == 'showAirTime');
      shallowArr[showAirTimeIndex] = { ...shallowArr[showAirTimeIndex], value: null, display: (value === "1" ? false : true) };
    }
    this.setState(prevState => ({
      filters: shallowArr,
    }));
  };

  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };

  clearFilter = () => {
    let { filterByDate, paramQuery } = this.state;
    filterByDate.map(data => ((data.date.startDate = ""), (data.date.endDate = "")))
    this.setState({
      filters: DEFAULT_JSON(HistoryFilter.filters),
      filterByDate, filterApplied: false,
      paramQuery: {
        ...paramQuery,
        page: 0
      }
    }, () => this.getAllTranscodings());
  }

  applyFilter = () => {
    let { paramQuery } = this.state;
    this.showHideFilterDrawer();
    this.setState({
      transcodingList: [], filterApplied: true,
      paramQuery: {
        ...paramQuery,
        page: 0
      }
    }, () => this.getAllTranscodings());
  }

  getDateFilterUi = () => {
    const { filterByDate } = this.state;
    return filterByDate.map((filterDate, index) => (
      <div key={index} className="dateFilterBox">
        <h5 className="sidebar-s-title">{filterDate.label}</h5>
        <div className="row">
          <div className="col-sm-6">
            <DatePicker
              type="date"
              placeholder={filterDate.date.startPlaceholder}
              value={filterDate.date.startDate}
              data-test="tvshows-handleDateChange"
              onChange={event =>
                this.handleDateChange("startDate", index, event)
              }
              className="zee-input-field"
            />
          </div>
          <div className="col-sm-6">
            <DatePicker
              type="date"
              placeholder={filterDate.date.endPlaceholder}
              value={filterDate.date.endDate}
              onChange={event =>
                this.handleDateChange("endDate", index, event)
              }
              className="zee-input-field"
            />
          </div>
        </div>
      </div>
    ));
  }

  getFilterDrawerUI = () => {
    let { filters, formValidity } = this.state;
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{constantText.filters_header_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="f-filter">
              <div className="bydate-filter">{this.getDateFilterUi()}</div>
              <FormRender
                form={filters.filter(item => item.display != false)}
                setSelectDataArr={this.setSelectDataArr}
                onChange={this.handleFilter}
              />
            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField
            color="secondary"
            className="apply-btn"
            disabled={!formValidity}
            buttonText={constantText.apply_filter_text}
            data-test="tvshows-applyFilter"
            onClick={this.applyFilter}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            buttonText={constantText.clear_text}
            data-test="tvshows-clearFilter"
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };

  handleKeyPress = event => {
    window.clearTimeout(this.timer);
  };

  handleKeyUp = event => {
    const { paramQuery } = this.state;
    const { externalId } = paramQuery;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      if (externalId.trim().length >= 3 || externalId.length === 0) {
        this.setState({
          transcodingList: [],
          paramQuery: {
            ...paramQuery,
            page: 0,
          },
        }, () => this.getAllTranscodings());
      }
    }, 1000);
  };

  refresh = () => {
    let { paramQuery } = this.state;
    this.setState({
      transcodingList: [],
      newAssets: [],
      isRequestIntiate: true,
      paramQuery: {
        ...paramQuery,
        page: 0,
      },
    }, () => this.getAllTranscodings());
  }

  goToCheckList = data => {
    const { Episode, transcodingChange } = data;
    const { tvShowId, seasonId, episodeId } = transcodingChange;
    const episodeJourneyType = Episode.EpisodeJourneyType;
    let route = `/tvshow/view/${tvShowId}/season/view/${seasonId}/episode/view/${episodeId}`;
    const params = { selectedTab: (episodeJourneyType == "1") ? 6 : 5 }
    this.goToRoute(route, params);
  }

  goToRoute = (route, params) => {
    history.push(route, params);
  }

  handleCheckBox = (event, item) => {
    const { transcodingList } = this.state
    let newAssets = [...this.state.newAssets];
    const id = item?.externalId;
    transcodingList.forEach(assets => {
      if (id === assets?.externalId) {
        if (assets.isChecked) {
          // pop item
          assets.isChecked = false
          newAssets = newAssets.filter((element) => element.externalId !== id)
        } else {
          // push item
          assets.isChecked = true
          newAssets.push(assets)
        }
      }
    })
    this.setState({ transcodingList: transcodingList, newAssets })
  }

  checkAssestBeforeTvPopup = () => {
    const { newAssets } = this.state;
    const isBeforeTvSelected = newAssets.filter((item) => item.Episode?.isBeforetvApplicable)
    if (isBeforeTvSelected && isBeforeTvSelected.length) {
      this.setState({
        assestBeforeTvPopup: !this.state.assestBeforeTvPopup
      })
    } else {
      this.bulkPublish()
    }
  }

  checkRedirectChecklist = (data) => {
    this.setState({ checklistData: data })
    if (data?.Episode?.isBeforetvApplicable) {
      this.setState({
        redirectChecklist: !this.state.redirectChecklist
      })
    } else {
      this.goToCheckList(data)
    }
  }

  bulkPublish = () => {
    const { newAssets } = this.state;
    let externalIds = [], contentTypes = [];
    newAssets.forEach((assest) => {
      if (assest.externalId && assest.contentType) {
        if (!externalIds.some(id => id == assest.externalId)) {
          externalIds.push(assest.externalId)
          if (!contentTypes.some(contentType => contentType === assest.contentType)) {
            contentTypes.push(assest.contentType)
          }
        }
      }
    })
    this.publishAPICall(externalIds, contentTypes)
    this.setState({
      assestBeforeTvPopup: false
    })
  }

  closeAssestBeforeTvPopup = () => {
    this.setState({
      assestBeforeTvPopup: !this.state.assestBeforeTvPopup
    })
  };
  closeRedirectChecklist = () => {
    this.setState({
      redirectChecklist: !this.state.redirectChecklist
    })
  };

  publishAPICall = async (externalIds, contentTypes) => {
    let data = {}
    data.externalId = externalIds;
    data.contentType = contentTypes.toString()
    data.actionType = constantText.bulksOpsConstant.bulkPublishAPICode;
    let res = await apiCalls(Config.bulkUpdate.bulkOperations, "POST", data, null, true, false, this.props.autoSaveError, null);
    if (res?.jobId) {
      showSuccessErrorMsg(constantText.bulksOpsConstant.bulkPublishSucessMessage, { type: constantText.bulksOpsConstant?.successRoutePathKey, jobId: res?.jobId }, "Success", true, this.editRoute, true)
    }
  }

  editRoute = (path) => {
    history.push(path);
  }

  render() {
    const { transcodingList, paramQuery, isRequestIntiate, showFilterDrawer, filterApplied, newAssets } = this.state;
    let { externalId, page } = paramQuery;

    return (
      <div>
        {page !== 0 && <BottomScrollListener onBottom={() => this.nextCall()} debounce={10000} />}
        <div className="user-head uid-head flex justify-content-between">
          <div className="whitebox refresh-list-box p-all-10 m-b-10">
            <div className="icon-w-text">
              <LightIcon /> {constantText.please_refresh_text} &nbsp;{" "}
              <a className="ref-link" data-test="refBtn" onClick={this.refresh} >
                {constantText.refresh_list_text}
              </a>
            </div>
          </div>
          <div className="s-form flex search-form">

            <input
              type="text" autoComplete="off" name="externalId"
              placeholder={constantText.transcoding_history_search_placeholder_text}
              value={externalId} onChange={this.handleChange}
              onKeyPress={this.handleKeyPress} onKeyUp={this.handleKeyUp}
            />
            <div className="filter-w">
              <div
                className={`btn-create-user ${!newAssets.length > 0 ? "disabled" : ""}`}
                onClick={() => { this.checkAssestBeforeTvPopup() }}>
                {'Publish'}
              </div>
              <ButtonField
                color="secondary" className={`filter-btn auto-filter-movie ${filterApplied ? 'current-active-filter' : ''}`}
                Icon={FilterIcon} buttonText={"Filters"}
                onClick={this.showHideFilterDrawer}
              />
            </div>
          </div>
        </div>
        <div className="uid-lists">
          {transcodingList.map((data, index) => {
            return (
              <div className="uid-item mov-l-box whitebox" key={index}>
                <div className="mov-info-box flex justify-content-between">
                  <div className="left-area flex">
                    <div className="l-chkbox">
                      <Checkbox
                        className={`zee-checkbox-field auto-checkbox-${data.id}`}
                        checked={data?.isChecked}
                        handleCheckBox={(event) => { this.handleCheckBox(event, data) }}
                        disabled={false}
                      />
                    </div>
                    <div className="info">
                      <div className="mov-detail flex align-items-center">
                        <h4>{data?.Episode?.title || "NA"}</h4>
                        <BadgeBox status={data?.Episode?.subtype_populated?.title || "NA"} dot={true} color={"blue"} />
                        <BadgeBox status={data?.Episode?.contentState_populated?.title || "NA"} dot={false} color={data?.Episode?.contentState_populated?.title === constantText.publishContentState ? "green" : "orange"} />
                        <BadgeBox status={(data?.status == "1" ? "Success" : "Failure") || "NA"} dot={false} color={"green"} />
                      </div>
                      <div className="global-title status-text flex">
                        <span className="label">{constantText.show_name_text}</span>
                        <span className="text">{data?.Episode?.Season?.TvShow?.showName || "NA"}</span>
                      </div>
                      <div className="time-loc-row flex align-items-center">
                        <span className="time">
                          <MovieGrayIcon />{data?.transcodingChange?.contentProperties?.videoDuration || "NA"}
                        </span>
                        <span className="loc status-text">
                          <span className="label">{constantText.video_uid_text}</span>
                          <span className="text">{data?.transcodingUid || "NA"}</span>
                        </span>
                        <span className="loc status-text">
                          <span className="label">{constantText.audio_language_text}</span>
                          <span className="text">
                            {data?.transcodingChange?.contentProperties?.audioLanguages?.map(obj => obj?.title).join(', ') || "NA"}
                          </span>
                        </span>
                      </div>
                      <div className="status-text flex">
                        <span className="label">{`${constantText.change_date_time_text}:`}</span>
                        <span className="text list-capitalize">
                          <span className="mov-time">{data.modifiedOn ? moment(data.modifiedOn).format(
                            constantText.date_format_with_time
                          ) : "NA"}</span>
                        </span>
                      </div>
                      <div className="status-text flex">
                        <span className="label">{`${constantText.telecast_date_text}:`}</span>
                        <span className="text list-capitalize">
                          <span className="mov-time">{data?.Episode?.telecastDate
                            ? moment(data.Episode.telecastDate).format(constantText.date_format_without_time)
                            : "NA"}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="right-area">
                    <div className="mov-icon-sec flex align-items-center  justify-content-between">
                      <div className="mov-id">
                        <span className="text-id">{constantText.tvShowsConstant.tvShowExternalIdText}</span>
                        <span className="num-id">{data?.transcodingChange?.tvShowExternalId || "NA"}</span>
                      </div>
                      <div className="mov-cta-wrap flex">
                        <div className={`mov-icon mov-view tooltip-sec auto-view`}
                          onClick={() => this.goToRoute(`/transcoding/view/${data.id}`)}>
                          <ViewIcon />
                          <div className="tooltip-box">{constantText.tool_tip_view}</div>
                        </div>
                        <div className="uid-checklist" onClick={() => this.checkRedirectChecklist(data)}>{constantText.checkList_text}</div>
                      </div>
                    </div>
                    <div className="mov-link ex-id-w-index flex align-items-center justify-content-end">
                      <div className="mov-id">
                        <span className="text-id">{`${data.contentType.charAt(0).toUpperCase()}${data.contentType.slice(1)} ${constantText.external_id_text}`}</span>
                        <span className="num-id">{data.externalId || "NA"}</span>
                      </div>
                      <div className="mov-link-btn">
                        {`${constantText.index_no_text} - ${data?.Episode?.indexNumber || ""}`}</div>
                    </div>

                    <div className="mov-map-st">{`${constantText.before_tv_text.before_tv} - ${data?.Episode?.isBeforetvApplicable ? 'Yes' : 'No'}`}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <InlineLoader
          show={transcodingList.length !== 0 && !isRequestIntiate}
        />

        {transcodingList.length === 0 ? (
          <div className="mov-l-box whitebox no-recode">
            <b>{constantText.no_record_found}</b>
          </div>
        ) : (
          ""
        )}
        <Drawer open={showFilterDrawer} anchor="right" onClose={this.showHideFilterDrawer}>
          {this.getFilterDrawerUI()}
        </Drawer>
        <CommonModel className='popup-wrap status-popup-large status-popup' state={this.state.assestBeforeTvPopup}
          showTitle={false}
          showIcon={false}
          showDes={true} des={`${constantText.assetsBeforeTvPublishingMessage}`}
          showBtn1={true}
          btn1Text={constantText.yes_text}
          btn1Action={() => this.bulkPublish()}
          showBtn2={true}
          btn2Text={constantText.no_text}
          btn2Action={() => this.closeAssestBeforeTvPopup()}
          handleClose={() => this.closeAssestBeforeTvPopup()}
        />
        <CommonModel className='popup-wrap status-popup-large status-popup' state={this.state.redirectChecklist}
          showTitle={false}
          showIcon={false}
          showDes={true} des={`${constantText.assetsBeforeTvPublishingMessage}`}
          showBtn1={true}
          btn1Text={constantText.yes_text}
          btn1Action={() => this.goToCheckList(this.state.checklistData)}
          showBtn2={true}
          btn2Text={constantText.no_text}
          btn2Action={() => this.closeRedirectChecklist()}
          handleClose={() => this.closeRedirectChecklist()}
        />
      </div>
    );
  }
}

export default MappedUid;
