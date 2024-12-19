import React, { Component } from 'react'
import BottomScrollListener from 'react-bottom-scroll-listener';
import moment from "moment";
import Movie from '../Movie/Movie'
import Collection from '../Collection/Collection'
import Video from '../Video/Video'
import TvShow from '../TvShow/TvShow'
import Season from '../Season/Season'
import Episode from '../Episode/Episode'
import { history } from "../../../_helpers/history";
import ButtonField from "../ButtonField/ButtonField";
import SelectedItems from '../SelectedItems/SelectedItems'
import Header from '../HeaderSection/HeaderSection'
import { dateDiffDayCount } from "../../../_helpers/util";
import { constantText } from '../../../_helpers/constants.text';
import { createQuery, removeAllDynamicAddfields } from '../CommonFunction/CommonFuntion';

import FilterIcon from "images/filter-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";

import { CircularProgress } from '@material-ui/core';
import Filter from '../Filter/Filter';
import { DEFAULT_JSON } from "../FormHelper/FormValidSetter";
import Config from '../../../Config/config';
import { apiCalls } from '../../../_services/common.service';

class AssignAssets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetsList: [],
      newAssets: [],
      searchMode: false,
      searchText: '',
      toggleFilterDrawer: false,
      meta: this.props.meta,

      isRequestIntiate: true,
      contentId: props.contentId,
      maxPage: null,
      filters: {
        active: false,
        filterByStatus: [],
        filterByDate: [],
        selectFilters: [],
        startDate: "",
        endDate: ""
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
    }
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    const { collectionList } = props;
    let assetsList = {},
      count = 0;
    const limit = constantText.search_limit;
    if (props.meta.name == "collections" && collectionList && collectionList?.data) {
      assetsList = collectionList
      count = collectionList?.count || 0
    }
    const page = count ? (Math.ceil(count / limit)) : 1;
    const queryData = { ...this.state.queryData };
    //If has movieData increase page
    if (assetsList?.data?.length && assetsList.isRequestIntiate) {
      queryData.page = queryData.page + 1;
    }
    this.setState({
      assetsList: assetsList?.data || [],
      isRequestIntiate: assetsList?.isRequestIntiate,
      maxPage: page,
      queryData
    });
  }

  componentDidMount = async () => {
    if (this.props.filtersJson) { await this.getFilterJson() }
    if (this.state.assetsList.length <= 0) {
      this.getContentList()
    }
    this.processContentList()
  }

  getFilterJson = async () => {
    let { filters } = this.state;
    let { statusTypes, filterByDate, sideSelectFilters } = this.props.filtersJson;
    let statusJson = await this.getStatusTypesCount(JSON.parse(JSON.stringify(statusTypes)) || [])
    if (statusJson.length) { statusJson[0]['active'] = true }
    filters.filterByStatus = statusJson;
    filters.filterByDate = JSON.parse(JSON.stringify(filterByDate)) || [];
    filters.selectFilters = DEFAULT_JSON(sideSelectFilters) || [];
    this.setState({ filters });
  }

  getStatusTypesCount = async (statusJson) => {
    let response = "";
    switch (this.state.meta.name) {
      case 'movies':
        response = await apiCalls(`${Config.movieCount}`, "GET", null, false, false);
        break;
      case 'collections':
        response = await apiCalls(`${Config.collectionCount}`, "GET", null, false, false);
        break;
      case 'tvShows':
        response = await apiCalls(`${Config.tvShow.count}/tvshow`, "GET", null);
        break;
      case 'videos':
        response = await apiCalls(`${Config.video.count}`, "GET", null, false, false);
        break;
      case 'seasons':
        response = await apiCalls(`${Config.tvShow.count}/season`, "GET", null, false, false);
        break;
      case 'episodes':
        response = await apiCalls(`${Config.tvShow.count}/episode`, "GET", null, false, false);
        break;

    }
    if (response && response?.length) {
      statusJson.forEach(item => {
        const index = response.findIndex(findItem => String(item.label).toLowerCase() == String(findItem.title).toLowerCase())
        item['id'] = index >= 0 ? (response[index].id || "") : "";
      })
    }
    return statusJson;
  }

  getContentList = async () => {
    this.setState({ isRequestIntiate: false })
    const filterQuery = await this.getQueryData()
    const query = createQuery(filterQuery)
    let urls;
    const getDefaultLastModifiedOnUrl = () =>  {
      const defaultStart = moment().subtract(constantText.filterDateRangeMonthCount, 'months');
      const defaultEnd = moment();
      return `date=lastModifiedOn&startDate=${defaultStart}&endDate=${defaultEnd}`;
    }
    const getContentURLs = (urls) => {
      const { searchMode } = this.state;
      if (!query.includes('startDate=') && searchMode !== true) {
        const defaultLastModifiedOnUrl = getDefaultLastModifiedOnUrl();
        urls[0] = urls[0] + defaultLastModifiedOnUrl
        if (urls[1]) { urls[1] = urls[1] + defaultLastModifiedOnUrl }
      }
      return urls;
    };
    switch (this.state.meta.name) {
      case 'movies':
        urls = [`${Config.movie}${query ? query : ""}`]
        if (filterQuery.paramQuery.page == 1) {
          urls.push(`${Config.movieListTotal}${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
        break
      case 'collections':
        const clearData = filterQuery.paramQuery.page == 1 ? true : false;
        this.props.getCollectionList(filterQuery, clearData)
        break
      case 'videos':
        urls = [`${Config.videoList}${query ? query : ""}`]
        if (filterQuery.paramQuery.page == 1) {
          urls.push(`${Config.videoListTotal}${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
        break
      case 'tvShows':
        urls = [`${Config.tvshowList}/tvshow${query ? query : ""}`]
        if (filterQuery.paramQuery.page == 1) {
          urls.push(`${Config.tvshowListTotal}/tvshow${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
        break
      case 'seasons':
        urls = [`/season/${query ? query : ""}`]
        if (filterQuery.paramQuery.page == 1) {
          urls.push(`/season/count${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
        break
      case 'episodes':
        urls = [`/episode${query ? query : ""}`]
        if (filterQuery.paramQuery.page == 1) {
          urls.push(`/episode/count${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, false)))
        break
    }
  }
  setListingData = (response, episodeList, assetsList, maxPage, queryData) =>{
          //set data
          if (response.length == 2) {
            const count = response[1]?.count
            const limit = constantText.search_limit
            maxPage = count ? Math.ceil(count / limit) : 1
            assetsList = episodeList?.length ? episodeList : []
          } else {
            assetsList = [...assetsList, ...(episodeList?.length ? episodeList : [])]
          }
          if (assetsList.length) {
            queryData.page = queryData.page + 1
          }
          this.setState({
            isRequestIntiate: true,
            assetsList,
            maxPage,
            queryData
          });
  }
  getListingData = async (urls) => {
    let { queryData, maxPage, assetsList, meta } = this.state

    const response = await Promise.all(urls);
    //set episode license data
    if(meta?.name === "episodes" && response[0]?.length){
      //make comma seprated string of episodeId
        let episodeList = response[0]?.length ? response[0] : [];
        let episodesId = episodeList.map((item) => item?.episodeId);
        episodesId = episodesId.join(",");
        //licenseDetailsCall
        let promise = new Promise((resolve, reject) => {
            let res = apiCalls(
              `${Config?.episode?.licenseDetails}?episodeId=${episodesId}`,
              "GET",
              {},
              `/tvshow`,
              false
            );
            if (res) {
              resolve(res);
            } else {
              reject([]);
            }
        });
        promise.then((res) => {
          episodeList?.forEach((row, index) => {
            const find = res?.findIndex((e) => e?.episodeId === row?.episodeId);
            row.countries = res[find]?.countries;
            if (res[find]?.validUntil) {
              row.episodeLicenses = [
                {
                  valid_from: res[find]?.validFrom,
                  valid_until: res[find]?.validUntil,
                },
              ];
            }
          });
          //set data
            this.setListingData(response, episodeList, assetsList, maxPage, queryData);
        });
    }
    else{
         //set data
         this.setListingData(response, response[0], assetsList, maxPage, queryData);
    }

  }

  getQueryData = async () => {
    const { filters, queryData } = this.state;
    let shallowQueryData = JSON.parse(JSON.stringify(queryData))
    if (shallowQueryData.contentState == "All") {
      shallowQueryData.contentState = "";
    }
    return {
      filters: filters.selectFilters,
      filterByDate: filters.filterByDate,
      paramQuery: shallowQueryData
    }
  };

  nextCall = () => {
    const { maxPage, isRequestIntiate, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getContentList()
    }
  };

  processContentList = () => {
    const assetsList = [...this.state.assetsList]
    assetsList.forEach(assets => {
      assets.isChecked = false
    })
    this.setState({ assetsList })
  }

  toggleFilterDrawer = () => {
    this.setState({ toggleFilterDrawer: !this.state.toggleFilterDrawer });
  }

  applyFilter = (filtersData, clear) => {
    const { filters, queryData } = this.state;
    let shallowFilters = JSON.parse(JSON.stringify(filters));
    shallowFilters.formValidity = filtersData.formValidity;
    shallowFilters.filterByStatus = filtersData.filterByStatus;
    shallowFilters.filterByDate = filtersData.filterByDate;
    shallowFilters.selectFilters = filtersData.selectFilters;
    shallowFilters.active = clear ? false : true;
    const seletedStatus = shallowFilters.filterByStatus.findIndex(item => item.active);
    if (seletedStatus >= 0) {
      queryData.contentState = shallowFilters.filterByStatus[seletedStatus].id || "";
    } else {
      queryData.contentState = "";
    }
    queryData.page = 1;
    this.toggleFilterDrawer();
    this.setState({ filters: shallowFilters, queryData: queryData }, () => {
      this.getContentList();
    });
  }

  searchAssets = (event) => {
    let { value } = event.target;
    let { queryData } = this.state;
    this.setState({ queryData: { ...queryData, searchString: value, page: 1 } });
  }

  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  }

  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      let searchMode = searchString.length === 0 ? false : true;
      if (searchString.length >= 3 || searchString.length === 0) {
        this.setState({
          searchMode,
          assetsList : [], queryData: {
          ...queryData,
          page: 1
        }})
        this.getContentList();
      }
    }, 1000);
  }

  assignAssetHandler = (data) => {
    if (!Array.isArray(data)) {
      data = Array(data)
    }
    this.props.added(data);
    this.props.closeAddAsset()
  }

  toggleCheckbox = (event, item) => {
    let assetsList = [...this.state.assetsList];
    let newAssets = [...this.state.newAssets];
    const contentId = item[this.props.contentIdKey];
    assetsList.forEach(assets => {
      if (contentId === assets[this.props.contentIdKey]) {
        if (assets.isChecked) {
          // pop item
          assets.isChecked = false
          newAssets = newAssets.filter((element) => element[this.props.contentIdKey] !== contentId)
        } else {
          // push item
          assets.isChecked = true
          newAssets.push(assets)
        }
      }
    })
    this.setState({ assetsList: assetsList, newAssets })
  }

  renderItemList = (option, assignedData, assetsList) => {
    const { contentIdKey, meta, languageArr } = this.props;
    const existingIds = assignedData?.map(function (item) {
      return item[contentIdKey];
    });
    existingIds.push(this.state.contentId)
    let itemList = assetsList?.map((item, index) => {
      if (!(existingIds.includes(item[contentIdKey]) || item[contentIdKey] == this.props[contentIdKey])) {
        switch (option.name) {
          case 'movies':
            return (
              <Movie
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={meta.itemButtonText || constantText.assign_movie_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked} />)
          case 'collections':
            return (
              <Collection
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={meta.itemButtonText || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked} />)
          case 'videos':
            return (
              <Video
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={meta.itemButtonText || constantText.assign_movie_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked} />)
          case 'tvShows':
            return (
              <TvShow
                languageArr={languageArr}
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={meta.itemButtonText || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked} />)
          case 'seasons':
            return (
              <Season
                languageArr={languageArr}
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={meta.itemButtonText || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked} />)
          case 'episodes':
            return (
              <Episode
                languageArr={languageArr}
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={meta.itemButtonText || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked} />)    
          default:
            return null
        }
      }
    })
    if (itemList.length) { itemList = itemList.filter(item => item) }
    return itemList
  }

  // It does some cleaning when component unmounts to free some RAM
  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    const { closeAddAsset, assignedData, quickLinksPage, pageClass } = this.props;
    const { assetsList, newAssets, meta, isRequestIntiate, toggleFilterDrawer, filters, queryData } = this.state
    const itemList = this.renderItemList(meta, assignedData, assetsList);
    const { page, searchString } = queryData;
    if (assetsList.length && !itemList.length && isRequestIntiate) {
      this.nextCall()
    }
    if(newAssets.length && meta.name == 'episodes') {
      newAssets.forEach(item => item.title = item.episodeTitle)
    }
    return (
      <div className={pageClass || 'whitebox assign-assets-block addassets-block'}>
        {(page !== 1) &&
          <BottomScrollListener onBottom={() => { this.nextCall() }} debounce={10000} />
        }
        { !quickLinksPage ?
          <div>
            <div className="ccm-head flex align-items-center justify-content-between">
              <div className="back-user-btn auto-back-btn flex align-items-center">
                <span onClick={closeAddAsset}><AngleLeftArrow /></span>
                <strong><span>{meta.addPageTitle}</span></strong>
              </div>
              <div className="status-head flex align-items-center">
                {this.props?.stage?.title &&
                  <div className="cm-draft">{this.props.stage.title}</div>
                }
              </div>

            </div>
            <div className="user-head optional-user-head">
              <div className="s-form flex justify-content-between col-md-12">
                <input
                  type="text"
                  autoComplete="off"
                  className="auto-search"
                  id="searchVal"
                  placeholder={meta.searchPlaceholder}
                  value={searchString}
                  onKeyUp={this.handleKeyUp}
                  onKeyPress={this.handleKeyPress}
                  onChange={this.searchAssets}
                />
                <div className="filter-w">
                  <ButtonField
                    color="secondary"
                    className={`filter-btn${filters.active ? ' current-active-filter' : ''}`}
                    Icon={FilterIcon}
                    buttonText={constantText.filter_button_text}
                    onClick={this.toggleFilterDrawer}
                  />
                </div>
              </div>
            </div>
          </div>
          :
          <div>
            <Header
              filterActive={filters.active}
              goBack={closeAddAsset}
              title={meta.addPageTitle}
              showFilterButton={meta.showFilterButton}
              filterClicked={this.toggleFilterDrawer}
              showInputField={meta.showInputField}
              inputPlaceholder={meta.searchPlaceholder}
              inputString={searchString}
              searchKeyPress={this.handleKeyPress}
              searchKeyUp={this.handleKeyUp}
              inputChanged={this.searchAssets} />
            <div className="collection-heading">
              <strong>{meta.availableText}</strong>
            </div>
          </div>
        }
        {newAssets.length > 0 ?
          <SelectedItems
            contentIdKey={this.props.contentIdKey}
            list={newAssets}
            changed={this.optionClickedHandler}
            removed={this.toggleCheckbox}
            assignContent={this.assignAssetHandler}
            buttonText={meta.selectedItemsButtonText}
            title={meta.selectedItemsTitle} />
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
        { toggleFilterDrawer &&
          <Filter
            formValidity={true}
            filterByStatus={filters.filterByStatus}
            filterByDate={filters.filterByDate}
            selectFilters={filters.selectFilters}
            startDate={filters.startDate}
            endDate={filters.endDate}
            contentType={filters.type}
            applyFilter={(items) => this.applyFilter(items, false)}
            clearFilter={(items) => this.applyFilter(items, true)}
            closeFilter={this.toggleFilterDrawer}
            meta={meta}
          />
        }
      </div>
    )
  }

}

export default AssignAssets;