import React, { Component } from 'react'
import BottomScrollListener from 'react-bottom-scroll-listener';
// SubComponents
import Movie from '../../../Common/Movie/Movie'
import SelectedItems from './../../../Common/SelectedItems/SelectedItems'
import ButtonField from "../../../Common/ButtonField/ButtonField";
//Helpers
import { constantText } from './../../../../_helpers/constants.text';
import { createQuery, removeAllDynamicAddfields } from './../../../Common/CommonFunction/CommonFuntion';
//Images
import FilterIcon from "images/filter-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";

import {
  movieStatusTypes,
  sideSelectFilters,
  filterByDate
} from "../../Schema/MapContent/SideFilter.json";
import { apiCalls } from '../../../../_services/common.service';
import Config from '../../../../Config/config';

import "./AddContent.css";
import Filter from '../../../Common/Filter/Filter';
import { CircularProgress } from '@material-ui/core';
import BadgeBox from '../../../Common/BadgeBox/BadgeBox';

const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      item.value = item.type === "checkbox" ? false : item.type === "dropdown" ? null : "";
      item.touched = 0;
      item.valid = true;
      return item;
    });
  }
};

class AddContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movieId: this.props.movieId,
      contentList: [],
      newContents: [],
      toggleFilterDrawer: false,
      meta: this.props.meta,
      movieCount: 0,
      isRequestIntiate: true,
      maxPage: null,
      movieFilterQuery: {},
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
        subType: "",
        page: 1,
        contentState: ""
      },
      movieSubTypes: [],
      status: null,
    }
  }

  componentWillReceiveProps(props, state) {
    let { moviesList, linkList } = props;
    if ((moviesList && moviesList?.data) || (linkList && linkList?.data)) {
      const moviesData = moviesList || linkList;
      const limit = constantText.search_limit;
      const count = moviesData?.count || 0;
      const page = count ? (Math.ceil(count / limit)) : 1;
      const queryData = { ...this.state.queryData };
      //If has movieData increase page
      if (moviesData?.data?.length && moviesData.isRequestIntiate) {
        queryData.page = queryData.page + 1;
      }
      this.setState({
        contentList: moviesData?.data || [],
        movieCount: count,
        isRequestIntiate: moviesData?.isRequestIntiate,
        maxPage: page,
        queryData
      });
    }
  }

  componentDidMount = async () => {
    this.getMovieDetails();
    await Promise.all([
      this.getMovieSubType(),
      this.getFilterJson()
    ])
    if (this.state.contentList.length <= 0) {
      this.getContents()
    } else {
      this.processContentList();
    }
  }

  getMovieDetails = async () => {
    let { movieId } = this.props;
    let url = `${Config.movieProperties}/${movieId}`;
    let response = await apiCalls(url, 'GET', {}, false, false);
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }



  // It does some cleaning when component unmounts to free some RAM
  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  getMovieSubType = async () => {
    let response = await apiCalls(`${Config.masterUrl}/MovieSubtype`, "GET", {}, "", false);
    if (response) {
      this.setState({ movieSubTypes: response })
    }
  }

  getFilterJson = async () => {
    let { filters } = this.state;
    this.setState({ isRequestIntiate: false });
    let movieStatusJson = JSON.parse(JSON.stringify(movieStatusTypes)) || []
    let url = `${Config.movieCount}`;
    let response = await apiCalls(url, "GET", null, "", false);
    if (response && response?.length) {
      movieStatusJson.forEach(item => {
        const index = response.findIndex(findItem => String(item.label).toLowerCase() == String(findItem.title).toLowerCase())
        item['id'] = index >= 0 ? (response[index].id || "") : "";
      })
    }
    if (movieStatusJson.length) { movieStatusJson[0]['active'] = true }
    filters.filterByStatus = movieStatusJson;
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
      movieFilterQuery: await {
        filters: filters.selectFilters,
        filterByDate: filters.filterByDate,
        paramQuery: shallowQueryData
      },
    });
  };

  getContents = async () => {
    this.setState({ isRequestIntiate: false });
    await this.setQueryData();
    const { movieFilterQuery, movieSubTypes, filters } = this.state;
    const clearData = movieFilterQuery.paramQuery.page == 1 ? true : false;
    switch (this.state.meta?.name) {
      case 'mainContent':
        if (movieFilterQuery.paramQuery.subTypeNotMovie) {
          delete movieFilterQuery.paramQuery.subTypeNotMovie;
        }
        let subType = movieSubTypes.filter(item => item.title == "Movie");
        subType = subType.map(item => item.id);
        movieFilterQuery.paramQuery.subType = subType.join(", ");
        break;
      case 'linkContent':
        if (movieFilterQuery.paramQuery.subType) {
          delete movieFilterQuery.paramQuery.subType;
        }
        let subTypes = movieSubTypes.filter(item => item.title != "Movie");
        const shallowFilters = JSON.parse(JSON.stringify(filters))
        const subTypeIndex = shallowFilters.selectFilters.findIndex(item => item.name == 'subType');
        if (subTypeIndex >= 0) {
          shallowFilters.selectFilters[subTypeIndex].display = true;
          shallowFilters.selectFilters[subTypeIndex].data = subTypes;
        }
        this.setState({ filters: shallowFilters });
        movieFilterQuery.paramQuery.subTypeNotMovie = true;
        break;
    }
    const query = createQuery(movieFilterQuery)
    let urls = [`${Config.movie}${query ? query : ""}`]
    if (clearData) {
      urls.push(`${Config.movieListTotal}${query ? query : ""}`)
    }
    this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
  }

  getListingData = async (urls) => {
    let { maxPage, contentList, movieCount, queryData } = this.state
    const response = await Promise.all(urls)
    if (response[0]?.length) {
      const limit = constantText.search_limit
      if (response[1]) {
        movieCount = response[1].count || 0
        maxPage = movieCount ? Math.ceil(movieCount / limit) : 1
        contentList = response[0].length ? response[0] : []
      } else {
        contentList = [...contentList, ...(response[0].length ? response[0] : [])]
      }
      if (contentList.length) {
        queryData.page = queryData.page + 1;
      }
      this.setState({
        contentList,
        movieCount,
        isRequestIntiate: true,
        maxPage,
        queryData
      })
    } else {
      this.setState({
        contentList: [],
        movieCount: 0,
        isRequestIntiate: true,
        maxPage: 0
      })
    }
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
    const { status } = this.state;
    if (status === constantText.contentConstants.published) {
      this.setState({ status: constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview) {
      this.setState({ status: constantText.contentConstants.draft })
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
    const { movieId } = item;
    let contents = [...this.state.contentList]
    let newContents = [...this.state.newContents]
    contents.forEach(content => {
      if (movieId === content.movieId) {
        if (content.isChecked) {
          // pop item
          content.isChecked = false
          newContents = newContents.filter((element) => element.movieId !== movieId)
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
    if (seletedStatus >= 0) {
      queryData.contentState = shallowFilters.filterByStatus[seletedStatus].id || "";
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
      return item.movieId;
    });
    existingIds?.push(this.state.movieId)
    let itemList = contentList?.map((item, index) => {
      if (!(existingIds?.includes(item.movieId) || item?.movieId == this.props?.movieId)) {
        return (
          <Movie
            key={item.movieId + "_" + index}
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

            <div className="back-user-btn auto-back-btn flex align-items-center">
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
                className="auto-search"
                autoComplete="off"
                name="searchVal"
                placeholder={meta?.placeholder || ""}
                value={queryData.searchString}
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
              title={constantText.assign_movie_text} />
            : null}
          {itemList && itemList.length ?
            itemList
            :
            isRequestIntiate &&
            <div className="mov-l-box no-recode p-l-15">
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