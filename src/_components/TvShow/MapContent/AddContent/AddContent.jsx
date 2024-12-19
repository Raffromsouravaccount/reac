import React, { Component } from 'react'
import BottomScrollListener from 'react-bottom-scroll-listener';
// SubComponents
import TvShow from '../../../Common/TvShow/TvShow'

import SelectedItems from './../../../Common/SelectedItems/SelectedItems'
import ButtonField from "../../../Common/ButtonField/ButtonField";
//Helpers
import { constantText } from './../../../../_helpers/constants.text';
import { createQuery, removeAllDynamicAddfields } from './../../../Common/CommonFunction/CommonFuntion';
//Images
import FilterIcon from "images/filter-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";

import {
  tvShowStatusTypes,
  sideSelectFilters,
  filterByDate
} from "../../Schema/MapContent/SideFilter.json";
import { apiCalls } from '../../../../_services/common.service';
import Config from '../../../../Config/config';

import "./AddContent.css";
import Filter from '../../../Common/Filter/Filter';
import { CircularProgress } from '@material-ui/core';
import BadgeBox from '../../../Common/BadgeBox/BadgeBox';
import { DEFAULT_JSON } from "../../../../_helpers/util";

class AddContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentList: [],
      newContents: [],
      toggleFilterDrawer: false,
      meta: this.props.meta,
      tvShowCount: 0,
      isRequestIntiate: true,
      maxPage: null,
      tvShowFilterQuery: {},
      showFilterDrawer: false,
      filters: {
        active: false,
        formValidity: false,
        filterByStatus: [],
        filterByDate: [],
        selectFilters: [],
        querys: "",
        byDate: "",
        startDate: "",
        endDate: "",
      },
      queryData: {
        limit: constantText.search_limit,
        subSortType: 'desc',
        subSortKey: 'lastModifiedOn',
        searchString: "",
        page: 1,
        contentState: ""
      },
      status: null,
    }
  }

  componentDidMount = async () => {
    this.setState({ status: this.props.stage });
      await this.getFilterJson()
    if (this.state.contentList.length <= 0) {
      this.getContents()
    } else {
      this.processContentList();
    }
  }

  // It does some cleaning when component unmounts to free some RAM
  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  getFilterJson = async () => {
    let { filters } = this.state;
    this.setState({ isRequestIntiate: false });
    let tvShowStatusJson = JSON.parse(JSON.stringify(tvShowStatusTypes)) || []
    let url = `${Config.tvShow.count}${Config.tvshowList}`;
    let response = await apiCalls(url, "GET", null, false, false);
    if (response && response?.length) {
      tvShowStatusJson.forEach(item => {
        const index = response.findIndex(findItem => String(item.label).toLowerCase() == String(findItem.title).toLowerCase())
        item['id'] = index>=0 ? (response[index].id || "") : "";
      })
    }
    if(tvShowStatusJson.length) tvShowStatusJson[0]['active'] = true;
    filters.filterByStatus = tvShowStatusJson;
    filters.filterByDate = JSON.parse(JSON.stringify(filterByDate)) || [];
    filters.selectFilters = DEFAULT_JSON(sideSelectFilters) || [];
    this.setState({ filters: filters, isRequestIntiate: true });
  }

  setQueryData = async () => {
    const { filters, queryData } = this.state;
    let shallowQueryData = JSON.parse(JSON.stringify(queryData))
    if (shallowQueryData.contentState == "All") {
      shallowQueryData.contentState = "";
    }
    this.setState({
      tvShowFilterQuery: await {
        filters: filters.selectFilters,
        filterByDate: filters.filterByDate,
        paramQuery: shallowQueryData
      },
    });
  };

  getContents = async () => {
    this.setState({ isRequestIntiate: false });
    await this.setQueryData();
    const { tvShowFilterQuery } = this.state;
    const query = createQuery(tvShowFilterQuery)
    let urls = [`${Config.tvshowList}${Config.tvshowList}${query ? query : ""}`]
    if (tvShowFilterQuery.paramQuery?.page == 1) {
      urls.push(`${Config.tvshowListTotal}${Config.tvshowList}${query ? query : ""}`)
    }
    this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
  }

  getListingData = async (urls) => {
    let { maxPage, contentList, tvShowCount, queryData } = this.state
    const response = await Promise.all(urls)
    if (response?.length == 2) {
      tvShowCount = response[1]?.count || 0
      const limit = constantText.search_limit
      maxPage = tvShowCount ? Math.ceil(tvShowCount / limit) : 1
      contentList = response[0]?.length ? response[0] : []
    } else {
      contentList = [...contentList, ...(response[0]?.length ? response[0] : [])]
    }
    if (contentList.length) {
      queryData.page = queryData.page + 1;
    }
    this.setState({
      contentList,
      tvShowCount,
      isRequestIntiate: true,
      maxPage,
      queryData
    })
  }

  processContentList = () => {
    const contentList = [...this.state.contentList]
    contentList.forEach(content => {
      content.isChecked = false
    })
    this.setState({ contentList })
  }

  assignContentHandler = (data) => {
    this.props.added(data);
    this.props.closeAddContent()
    // this.setState({newContents: []})
  }

  addContentHandler = (data) => {
    this.props.added(Array(data));
    this.props.closeAddContent()
  }

  searchHandleChange = (event) => {
    const {status} = this.state;
    if (status === constantText.contentConstants.published){
      this.setState({ status:constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview){
      this.setState({ status:constantText.contentConstants.draft })
    }
    if (status ===  constantText.contentConstants.unpublished) {
      this.setState({ status:constantText.contentConstants.draft })
    }
    let { value } = event.target;
    let { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        searchString: value,
        page: 1
      }
    });
  };

  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  }

  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      if (searchString.length >= 3 || searchString.length === 0) {
        this.getContents();
      }
    }, 1000);
  }

  checkBoxHandler = (event, item) => {
    const { tvShowId } = item;
    let contents = [...this.state.contentList]
    let newContents = [...this.state.newContents]
    contents.forEach(content => {
      if (tvShowId === content.tvShowId) {
        if (content.isChecked) {
          // pop item
          content.isChecked = false
          newContents = newContents.filter((element) => element.tvShowId !== tvShowId)
        } else {
          // push item
          content.isChecked = true
          newContents.push(content)
        }
      }
    })
    this.setState({ contentList: contents, newContents })
  }

  showHideFilterDrawer = () => {
    this.setState({ showFilterDrawer: !this.state.showFilterDrawer });
  };

  applyFilter = (filtersData, clear) => {
    const { filters, queryData } = this.state;
    let shallowFilters = JSON.parse(JSON.stringify(filters));
    shallowFilters.formValidity = filtersData?.formValidity;
    shallowFilters.filterByStatus = filtersData?.filterByStatus;
    shallowFilters.filterByDate = filtersData?.filterByDate;
    shallowFilters.selectFilters = filtersData?.selectFilters;
    shallowFilters.active = clear ? false : true;
    const seletedStatus = shallowFilters?.filterByStatus?.findIndex(item => item.active);
    if(seletedStatus >= 0) {
      queryData.contentState = shallowFilters?.filterByStatus[seletedStatus].id || "";
    } else {
      queryData.contentState = "";
    }
    queryData.page = 1;
    this.showHideFilterDrawer();
    this.setState({ filters: shallowFilters, queryData: queryData }, () => {
      this.getContents();
    });
  }

  nextCall = () => {
    const { maxPage, isRequestIntiate, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getContents()
    }
  };

  render() {
    const { closeAddContent, assignedData } = this.props;
    const { contentList, newContents, showFilterDrawer, filters, queryData, isRequestIntiate, status, meta } = this.state;
    let { page } = queryData;

    const existingIds = assignedData?.map(function (item) {
      return item.tvShowId;
    });
    existingIds?.push(this.state.tvShowId)
    let itemList = contentList?.map((item, index) => {
      if (!(existingIds?.includes(item.tvShowId) || item.tvShowId == this.props.tvShowId)) {
        return (
          <TvShow
            key={item.tvShowId + "_" + index}
            classes='mapcontent-grid'
            data={item}
            showCheckbox
            checkBoxHandler={(event, itemObj) => this.checkBoxHandler(event, itemObj)}
            showButton
            buttonText={constantText.assign_content_text}
            buttonHandler={this.addContentHandler} />
        )
      }
    })
    if (itemList.length) { itemList = itemList.filter(item => item) }
    if (contentList.length && !itemList.length && isRequestIntiate) {
      this.nextCall()
    }
    return (
      <div className="whitebox mapcontent-block addcontent-block">
        {(page !== 1) && (
          <BottomScrollListener
            onBottom={() => {
              this.nextCall();
            }}
          debounce={10000} offset={5}
          />
        )}
        <div className="drag-drop-wrap">
          <div className="ccm-head flex align-items-center justify-content-between">
            {/* <h4>{constantText.add_content_text}</h4> */}

            <div className="back-user-btn flex align-items-center">
              <span onClick={closeAddContent}><AngleLeftArrow /></span>
              <strong><span>{constantText.add_content_text}</span></strong>
            </div>
            <div className="status-head flex align-items-center">
              {status && <BadgeBox className="create-movie-stage" status={status} />}
            </div>

          </div>
          <div className="user-head optional-user-head">
            <div className="s-form flex justify-content-between col-md-12">
              <input
                type="text"
                autoComplete="off"
                name="searchVal"
                className="auto-search"
                placeholder={meta?.placeholder || ""}
                value={queryData?.searchString}
                onChange={this.searchHandleChange}
                onKeyPress={this.handleKeyPress}
                onKeyUp={this.handleKeyUp}
              />
              <div className="filter-w">
                <ButtonField
                  color="secondary"
                  className={`filter-btn${filters.active ? ' current-active-filter' : ''}`}
                  Icon={FilterIcon}
                  buttonText={constantText.filter_button_text}
                  onClick={this.showHideFilterDrawer}
                />
              </div>
            </div>
          </div>
          {newContents.length > 0 ?
            <SelectedItems
              list={newContents}
              changed={this.optionClickedHandler}
              removed={this.checkBoxHandler}
              assignContent={this.assignContentHandler}
              buttonText={constantText.assign_content_text}
              title={constantText.assign_tvshow_text} />
            : null}
          {itemList && itemList.length ?
            itemList
            :
            isRequestIntiate &&
            <div className="mov-l-box no-recode">
              <p>{queryData.searchString && queryData.searchString.length ?
                (constantText.no_result_text)
                :
                (filters.active ?
                  <span>
                    <b>{constantText.no_result_filter}</b>{" "}
                    {constantText.no_result_filter_text}
                  </span>
                  :
                  constantText.no_result_only_text)}
              </p>
            </div>
          }
          {!isRequestIntiate &&
            <div className="text-center">
              <CircularProgress classes={{ root: 'loader-circle' }} color="inherit" size={25} />
            </div>
          }
        </div>
        {
          showFilterDrawer &&
          <Filter
            formValidity={filters.formValidity}
            filterByStatus={filters.filterByStatus}
            filterByDate={filters.filterByDate}
            selectFilters={filters.selectFilters}
            applyFilter={(items) => this.applyFilter(items, false)}
            clearFilter={(items) => this.applyFilter(items, true)}
            closeFilter={this.showHideFilterDrawer}
          />
        }
      </div>
    )
  }

}

export default AddContent