import React, { Component } from 'react';
import moment from "moment";
import BottomScrollListener from "react-bottom-scroll-listener";

import { constantText } from '../../../../_helpers/constants.text';
import { history } from "../../../../_helpers/history";
import { apiCalls } from "../../../../_services/common.service";
import Config from "../../../../Config/config";
import InlineLoader from "../../../Common/InlineLoader/InlineLoader";

//Icons
import LightIcon from "images/light-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
class UnMappedUid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcodingList: [],
      isRequestIntiate: false,
      searchText: '',
      queryData: {
        limit: constantText.search_limit,
        searchString: "",
        page: 0,
      },
      count: 0,
      maxPage: null
    }
  }

  gotoMapContent = (uuid) => {
    this.props?.history?.push({
      pathname: `/map-content/${uuid}`,
      state: { uuid: uuid },
    });

  }

  handleRoute = (route) => {
    history.push(route);
  };

  searchContent = (event) => {
    const { value } = event?.target;
    this.setState({
      searchText: value
    })
  }

  componentDidMount() {
    this.setState({ isRequestIntiate: true }, () => this.getAllTranscodings())
  }
  getAllTranscodings = async () => {
    let param = await this.setQueryData();
    await this.fetchTranscoding(param)
  };
  fetchTranscoding = async (params) => {
    const { isRequestIntiate, transcodingList, queryData } = this.state;
    if (isRequestIntiate) {
      this.setState({ isRequestIntiate: false });
      const url = `${Config.transcodingList}${params ? params : ""}`;
      //ListCall
      let response = await apiCalls(url, "GET", null, `/transcoding`, false);
      this.setState({ isRequestIntiate: true });
      if (response) {
        const limit = constantText.search_limit;
        const Count = response?.count ? response?.count : 0;
        const Page = Count ? Math.ceil(Count / limit) : 0;
        const copyQueryData = { ...queryData };
        let newtranscodingList = [];
        //If has movieData increase page
        copyQueryData.page = copyQueryData.page + 1;
        newtranscodingList = [...transcodingList, ...(response?.rows || [])];
        let stateObj = {
          transcodingList: newtranscodingList,
          Count: Count || 0,
          queryData: copyQueryData,
          maxPage: Page || 0,

        };
        this.setState(stateObj);
      } else {
        this.setState({ Count: 0, transcodingList: [] });
      }
    }


  };

  nextCall = () => {
    const { maxPage, isRequestIntiate, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getAllTranscodings();
    }
  };

  setQueryData = async () => {
    const { queryData } = this.state;
    let queryparam
    if (queryData.searchString != "") {
      queryparam = "?page=" + queryData.page + "&limit=" + queryData.limit + "&transcodingUid=" + queryData.searchString
    }
    else {
      queryparam = "?page=" + queryData.page + "&limit=" + queryData.limit
    }

    return queryparam
  };
  searchHandleChange = async (event) => {
    let { name, value } = event?.target;
    let { queryData } = this.state;
    this.setState({
      transcodingList: [],
      queryData: await {
        ...queryData,
        page: 0,
        [name]: value,
      },
    });
  };
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  };
  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      if (searchString.trim().length >= 3 || searchString.length === 0) {
        this.setState(
          {
            transcodingList: [],
            queryData: {
              ...queryData,
              page: 0,
            },
          },
          () => {
            this.getAllTranscodings();
          }
        );
      }
    }, 1000);
  };

  refresh = () => {
    let queryData = this.state.queryData
    this.setState(
      {
        transcodingList: [],
        isRequestIntiate: true,
        queryData: {
          ...queryData,
          page: 0,
        },
      },
      () => {
        this.getAllTranscodings();
      }
    );
  }


  render() {
    const { transcodingList, queryData, isRequestIntiate } = this.state;
    let { searchString, page } = queryData;

    return (
      <div>
        {page !== 0 && (
          <BottomScrollListener
            onBottom={() => {
              this.nextCall();
            }}
          debounce={10000} offset={5}
          />
        )}
        <div className="user-head uid-head flex justify-content-between">
          <div className="whitebox refresh-list-box p-all-10 m-b-10">
            <div className="icon-w-text">
              <LightIcon />
              Please refresh the link to update the list below. &nbsp;{" "}
              <a
                className="ref-link"
                data-test="refBtn"
                onClick={() => this.refresh()}
              >
                Refresh List
              </a>
            </div>
          </div>
          <div className="s-form flex search-form">
            <input
              type="text"
              autoComplete="off"
              name="searchString"
              placeholder={constantText.transcoding_search_placeholder}
              value={searchString || ""}
              onChange={this.searchHandleChange}
              onKeyPress={this.handleKeyPress}
              onKeyUp={this.handleKeyUp}
            />
          </div>
        </div>
        <div className="relatedcontent-block tsco-list">
          {transcodingList && transcodingList.map((item, index) => (
            <div className="whitebox list-profile-box flex justify-content-between p-12" key={index}>
              <div className="left-wrap flex">
                <div className="left-block flex">
                  <div className="info-block global-status-button">
                    <div className="flex list-top-text align-items-center"><strong>{item.transcodingUid}</strong>
                    </div>
                    <div className="timezone-block flex">
                      <div className="flex align-items-center">
                        <MovieGrayIcon className="icon-width" />
                        <span>{item.transcodingDetail ? item.transcodingDetail.content_duration ? new Date(item.transcodingDetail.content_duration * 1000).toISOString().substr(11, 8) : "" : ""}</span>
                      </div>
                    </div>

                    <div className="status-text flex">
                      <span className="label">Transcoding Completion On </span>
                      <span className="text list-capitalize">
                        <span className="mov-date"> {item.modifiedOn
                          ? moment(item.modifiedOn).format(
                            constantText.date_format_without_time
                          )
                          : "NA"}
                        </span>
                        <span className="mov-time">
                          {item.modifiedOn
                            ? moment(item.modifiedOn).format(
                              constantText.time_format_lt
                            )
                            : "NA"}
                        </span>
                      </span>

                    </div>
                  </div>
                </div>
              </div>
              <div className="right-block">
                <div className="flex">
                  <div className="user-head">
                    <div className="s-form flex justify-content-between col-md-12">
                      <div className="btn-create-user" onClick={() => this.gotoMapContent(item.transcodingUid)}>{constantText.map_content_text}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
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
      </div>
    )
  }
}

export default UnMappedUid;