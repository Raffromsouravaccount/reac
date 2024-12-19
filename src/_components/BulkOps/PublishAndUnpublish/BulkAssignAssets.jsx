import React, { Component } from 'react'
import MenuItem from "@material-ui/core/MenuItem";
import BottomScrollListener from 'react-bottom-scroll-listener';
import moment from "moment";
import Movie from '../../Common/Movie/Movie'
import Collection from '../../Common/Collection/Collection'
import Video from '../../Common/Video/Video'
import TvShow from '../../Common/TvShow/TvShow'
import Season from '../../Common/Season/Season'
import Episode from '../../Common/Episode/Episode'
import { history } from "../../../_helpers/history";
import ButtonField from "../../Common/ButtonField/ButtonField";
import SelectedItems from '../../Common/SelectedItems/SelectedItems'
import Header from '../../Common/HeaderSection/HeaderSection'
import DropDown from "../../Common/DropDown/DropDown";
import { dateDiffDayCount } from "../../../_helpers/util";
import { constantText } from '../../../_helpers/constants.text';
import { createQuery, removeAllDynamicAddfields } from '../../Common/CommonFunction/CommonFuntion';


import FilterIcon from "images/filter-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";

import { CircularProgress } from '@material-ui/core';
import Filter from '../../Common/Filter/Filter';
import { DEFAULT_JSON } from "../../Common/FormHelper/FormValidSetter";
import Config from '../../../Config/config';
import { apiCalls } from '../../../_services/common.service';
import { publishSection, unpublishSection, deleteSection } from './../Schema/PublishAndUnpublish/PublishAndUnpublish.json'

class BulkAssignAssets extends Component {
  constructor(props) {
    super(props)

    this.state = {
      assetsList: [],
      newAssets: [],
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
      openDropdown: false,
      sectionValue: "",
      action: "",
    }
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    const { collectionList, meta, action } = props;
    const { name } = meta;
    let assetsList = {},
      count = 0;
    const limit = constantText.search_limit;
    if (this.props.meta.name!==props.meta.name ) {   
      const page = count ? (Math.ceil(count / limit)) : 1;
      const queryData = { ...this.state.queryData };
      let assetsList = [...this.state.assetsList];
      let newAssets = [...this.state.newAssets];
      assetsList.forEach(assets => {
        assets.isChecked = false
      })
        this.setState({
          assetsList: [],
          newAssets: [],
          searchText: '',
          toggleFilterDrawer: false,
          meta: this.props.meta,
          isRequestIntiate: true,
          contentId: this.props.contentId,
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
          }
        }, () => {
          this.getFilterJson()
        })
      
    }else if(this.props.action!==props.action){
     const page = count ? (Math.ceil(count / limit)) : 1;
     this.setState({
       maxPage: page,
       queryData: {
        limit: constantText.search_limit,
        subSortType: 'desc',
        subSortKey: 'lastModifiedOn',
        searchString: "",
        subType: "",
        page: 1,
        contentState: ""},
       newAssets:[],
       assetsList:[],
       sectionValue: ""
     },()=>{
      this.getFilterJson()
     });
    }else if(this.props?.selectedSubTypes !== props?.selectedSubTypes && this.props.subTypeTab !==props.subTypeTab){
      this.setState({
        assetsList: [],
        newAssets: [],
        searchText: '',
        toggleFilterDrawer: false,
        meta: this.props.meta,
        isRequestIntiate: true,
        contentId: this.props.contentId,
        maxPage: null,
        sectionValue: "",
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
        }
      }, () => {
        this.getFilterJson()
      })
    }


  }

  componentDidMount = async () => {
    if (this.props.filtersJson) { await this.getFilterJson() }
    this.processContentList()
  }

  getFilterJson = async () => {
    let { filters } = this.state;
    let { action } = this.props
    let { filterByDate, sideSelectFilters } = this.props.filtersJson;
    let conentSection = action === 'delete' ? deleteSection : action === 'unpublish' ? unpublishSection : publishSection;
    let statusJson = await this.getStatusTypesCount(JSON.parse(JSON.stringify(conentSection)) || [])
    if (statusJson.length) { statusJson[0]['active'] = true }
    filters.filterByStatus = statusJson;
    filters.filterByDate = JSON.parse(JSON.stringify(filterByDate)) || [];
    filters.selectFilters = DEFAULT_JSON(sideSelectFilters) || [];
    this.setState({ filters }, () => {
      this.getContentList()
    });
  }

  getStatusTypesCount = async (statusJson) => {
    let response = "";
    switch (this.props.meta.name) {
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
    const filterQuery = await this.getQueryData()
    const query = createQuery(filterQuery)
    let urls;
    const getDefaultLastModifiedOnUrl = () => {
      const defaultStart = moment().subtract(constantText.filterDateRangeMonthCount, 'months');
      const defaultEnd = moment();
    }
    const getContentURLs = (urls) => {
      if (!query.includes('startDate=')) {
        const defaultLastModifiedOnUrl = getDefaultLastModifiedOnUrl();
        urls[0] = urls[0] 
        if (urls[1]) { urls[1] = urls[1] }
      }
      return urls;
    };
    const isFirstPage = filterQuery.paramQuery.page == 1;
    switch (this.props.meta.name) {
      case 'movies':
        urls = [`${Config.movie}${query ? query : ""}`]
        if (isFirstPage) {
          urls.push(`${Config.movieListTotal}${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, isFirstPage)))
        break
      case 'collections':
        urls = [`${Config.collection}${query ? query : ""}`]
        if (isFirstPage) {
          urls.push(`${Config.collectionListTotal}${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, isFirstPage)))
        break
      case 'videos':
        urls = [`${Config.videoList}${query ? query : ""}`]
        if (isFirstPage) {
          urls.push(`${Config.videoListTotal}${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, isFirstPage)))
        break
      case 'tvShows':
        urls = [`${Config.tvshowList}/tvshow${query ? query : ""}`]
        if (isFirstPage) {
          urls.push(`${Config.tvshowListTotal}/tvshow${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, isFirstPage)))
        break
      case 'seasons':
        urls = [`/season/${query ? query : ""}`]
        if (isFirstPage) {
          urls.push(`/season/count${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, isFirstPage)))
        break
      case 'episodes':
        urls = [`/episode${query ? query : ""}`]
        if (isFirstPage) {
          urls.push(`/episode/count${query ? query : ""}`)
        }
        urls = getContentURLs(urls);
        this.getListingData(urls.map(url => apiCalls(url, "GET", null, false, isFirstPage)))
        break
    }
  }
  setListingData = (response, list, assetsList, maxPage, queryData) => {
    //set data
    const {newAssets}=this.state;
    if (response.length == 2) {
      if(newAssets && newAssets.length>0){
       newAssets.forEach(assetItem=>{
        list.forEach((listItem)=>{
            if(listItem.externalId===assetItem.externalId){
              listItem.isChecked=true
            }else{
              listItem
            }
        })
       })
      }
      const count = response[1]?.count
      const limit = constantText.search_limit
      maxPage = count ? Math.ceil(count / limit) : 1
      assetsList = list?.length ? list : []
    } else {
      assetsList = [...assetsList, ...(list?.length ? list : [])]
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
  resetAssestList = () => {
    let assetsList = [...this.state.assetsList];
    assetsList.forEach(assets => {
      assets.isChecked = false
    })
    this.setState({ assetsList: assetsList, newAssets:[] })
  }
  getListingData = async (urls) => {
    let { queryData, maxPage, assetsList, meta } = this.state

    const response = await Promise.all(urls);
      let list = response[0]?.length ? response[0] : [];
      this.setListingData(response, list, assetsList, maxPage, queryData);

  }

  getQueryData = async () => {
    const { filters, queryData, sectionValue } = this.state;
    const { action,selectedSubTypes } = this.props
    let contentValue = sectionValue ?  sectionValue :  action === 'delete'  ?  deleteSection[0].label  :  action === "unpublish"  ?  unpublishSection[0].label  :  publishSection[0].label;
    let shallowQueryData = JSON.parse(JSON.stringify(queryData))
    const selectedContent = filters?.filterByStatus && filters?.filterByStatus.length > 0 && JSON.parse(JSON.stringify(filters?.filterByStatus?.filter(item => item.label === contentValue)));
    shallowQueryData.contentState =selectedContent?.length>0 ? selectedContent[0]?.id:'';
    shallowQueryData.subType=selectedSubTypes.length>0 ?selectedSubTypes :''
    return {
      filters: filters.selectFilters,
      filterByDate: filters.filterByDate,
      paramQuery: shallowQueryData
    }

  };

  nextCall = () => {
    const { maxPage, isRequestIntiate, assetsList, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getContentList()
      if (assetsList && assetsList.length > 0) {
        this.setState({
          isRequestIntiate: false
        })
      }
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
    this.setState({ filters: shallowFilters, queryData: queryData });
  }

  searchAssets = (event) => {
    let { value } = event.target;
    let { queryData } = this.state;
    this.setState({ queryData: { ...queryData, searchString: value, page: 1 } });
  }

  handleKeyPress = (e) => {
    clearTimeout(this.timer);
    
  }

  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = setTimeout(() => {
      if (searchString.length >= 3 || searchString.length === 0) {
        this.setState({
          assetsList: [], queryData: {
            ...queryData,
            page: 1
          }
        })
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
    const { contentIdKey, meta, languageArr, action } = this.props;
    const existingIds = assignedData?.map(function (item) {
      return item[contentIdKey];
    });
    existingIds.push(this.state.contentId)
    let itemList = assetsList?.length > 0 && assetsList?.map((item, index) => {
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
                buttonText={action === 'publish' ? ` Publish ${meta.itemButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.itemButtonText}` : ` Delete ${meta.itemButtonText}` || constantText.assign_movie_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked}
                listView={false} />)
          case 'collections':
            return (
              <Collection
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={action === 'publish' ? ` Publish ${meta.itemButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.itemButtonText}` : ` Delete ${meta.itemButtonText}` || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked}
                listView={false} />)
          case 'videos':
            return (
              <Video
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={action === 'publish' ? ` Publish ${meta.itemButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.itemButtonText}` : ` Delete ${meta.itemButtonText}` || constantText.assign_movie_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked}
                listView={false} />)
          case 'tvShows':
            return (
              <TvShow
                languageArr={languageArr}
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={action === 'publish' ? ` Publish ${meta.itemButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.itemButtonText}` : ` Delete ${meta.itemButtonText}` || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked}
                listView={false} />)
          case 'seasons':
            return (
              <Season
                languageArr={languageArr}
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={action === 'publish' ? ` Publish ${meta.itemButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.itemButtonText}` : ` Delete ${meta.itemButtonText}` || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked}
                listView={false} />)
          case 'episodes':
            return (
              <Episode
                languageArr={languageArr}
                key={item[contentIdKey] + '_' + index}
                data={item}
                showCheckbox
                checkBoxHandler={(event, itemObj) => this.toggleCheckbox(event, itemObj)}
                showButton
                buttonText={action === 'publish' ? ` Publish ${meta.itemButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.itemButtonText}` : ` Delete ${meta.itemButtonText}` || constantText.assign_collection_text}
                buttonHandler={this.assignAssetHandler}
                isLocked={this.state.isLocked}
                listView={false} />)
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
  handleOpenCloseDropDown = () => {
    let { openDropdown } = this.state;
    this.setState({ openDropdown: !openDropdown });
  };

  handleCloseDropdown = () => {
    this.setState({ openDropdown: false });
  };
  selectSectionFilling = (value) => {
    let { openDropdown } = this.state;
    this.setState({
      sectionValue: value,
      openDropdown: !openDropdown,
      assetsList: [],
      newAssets: [],
      queryData: {
        limit: constantText.search_limit,
        subSortType: 'desc',
        subSortKey: 'lastModifiedOn',
        searchString: "",
        subType: "",
        page: 1,
        contentState: ""
      }
    }, () => {
      this.getContentList()
    });
  };

  render() {

    const { closeAddAsset, assignedData, quickLinksPage, pageClass, isRelatedContent = true, meta, action } = this.props;
    const { assetsList, newAssets, isRequestIntiate, toggleFilterDrawer, filters, queryData, openDropdown, sectionValue } = this.state
    const itemList = this.renderItemList(meta, assignedData, assetsList);
    const { page, searchString } = queryData;
    if (assetsList.length && !itemList.length && isRequestIntiate) {
      this.nextCall()
    }
    if (newAssets.length && meta.name == 'episodes') {
      newAssets.forEach(item => item.title = item.episodeTitle)
    }
    const sectionList = action === 'delete' ? deleteSection : action === "unpublish" ? unpublishSection : publishSection;
    return (
      <div className={pageClass || 'whitebox assign-assets-block addassets-block'}>
        {(page !== 1) &&
          <BottomScrollListener onBottom={() => { this.nextCall() }} debounce={10000} />
        }
        {!quickLinksPage ?
          <div>
            {isRelatedContent && <div className="ccm-head flex align-items-center justify-content-between">
              <div className="back-user-btn auto-back-btn flex align-items-center">
                <span onClick={closeAddAsset}><AngleLeftArrow /></span>
                <strong><span>{meta.addPageTitle}</span></strong>
              </div>
              <div className="status-head flex align-items-center">
                {this.props?.stage?.title &&
                  <div className="cm-draft">{this.props.stage.title}</div>
                }
              </div>

            </div>}
            <div className="user-head optional-user-head">
              <div className="s-form flex  col-md-12">
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
                <div className="filter-btn outline-drop-btn btn-h-40">

                  <DropDown
                    className="dropdown-btn auto-bulk-filling-movie"
                    buttonText={sectionValue ? sectionValue : sectionList[0].label}
                    open={openDropdown}
                    handleOpenClose={this.handleOpenCloseDropDown}
                    handleClose={this.handleCloseDropdown}
                  >
                    {sectionList.map((item) => {
                      return (
                        <MenuItem
                          key={item.id}
                          onClick={() => this.selectSectionFilling(item.name)}
                        >
                          {item.label}
                        </MenuItem>
                      )
                    })
                    }
                  </DropDown>
                </div>
                {isRelatedContent && <div className="filter-w">
                  <ButtonField
                    color="secondary"
                    className={`filter-btn${filters.active ? ' current-active-filter' : ''}`}
                    Icon={FilterIcon}
                    buttonText={constantText.filter_button_text}
                    onClick={this.toggleFilterDrawer}
                  />
                </div>}
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
            buttonText={action === 'publish' ? ` Publish ${meta.selectedItemsButtonText}` : action === 'unpublish' ? ` Unpublish ${meta.selectedItemsButtonText}` : ` Delete ${meta.selectedItemsButtonText}`}
           title ={`Count: ${newAssets.length>0 ? newAssets.length :0 }`}
            isRelatedContent={this.props.isRelatedContent} />
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
        {toggleFilterDrawer &&
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

export default BulkAssignAssets;