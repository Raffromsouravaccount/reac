import React, { Component, Fragment } from "react";
import moment from "moment";
import BottomScrollListener from "react-bottom-scroll-listener";

//icon
import WorldIcon from "images/world-icon.svg";
import MovieGrayIcon from "images/movie-gray-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
import MovieIcon from "images/movie-icon.svg";
import LinkIcon from "images/link-icon.svg";

import { permissionObj } from "../../../_helpers/permission";
import { history } from "../../../_helpers/history";
import Config from "../../../Config/config";
import MenuItem from "@material-ui/core/MenuItem";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";

import BreadcrumbsComp from "../../../_components/Common/BreadCrumbs/BreadCrumbs";
import DropDown from "../../../_components/Common/DropDown/DropDown";
import RadioButton from "../../../_components/Common/RadioButton/RadioButton";

import DatePicker from "../../Common/DatePicker/DatePicker";
import ButtonField from "../../Common/ButtonField/ButtonField";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import { CommonModel } from "../../Common/Model/CommonModel";
import { ImageLoad } from "../../Common/ImageLoad/ImageLoad";
import {
  dateDiffDayCount,
  getSelectedGroup,
  makeStringObjectOption,
  getCopyObj,
} from "../../../_helpers/util";
import { constantText } from "../../../_helpers/constants.text";
import { movieConstants } from "../Constants/movie.constants";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";
//Service
import { apiCalls, commonService } from "../../../_services/common.service";
//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import SortIcon from "images/sort-icon.svg";
import FilterIcon from "images/filter-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import LightIcon from "images/light-icon.svg";
import MarkDone from "images/tick.svg";

import { createQuery } from "../../Common/CommonFunction/CommonFuntion";

import sideFilterJson from "../Schema/SideFilter.json";
import { filterService } from "../../../_services/filterService";

import "../../../../public/css/Common/Listing.css";

import { LeftTabListing } from "../../Common/LeftTab/LeftTabListing";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import AppliedFilter from "../../Common/LeftTab/AppliedFilter";
import { LastModifiedBy } from "../../Common/LastModifiedBy/LastModifiedBy";

export const filterValidityCheck = (jsonform) => {
  let formIsValid = jsonform?.some(e => e?.value?.length);
  return { formValidity: formIsValid };
};
export const statusValidityCheck = (defaultStatus, jsonform) => {
  let formIsValid = false;
  jsonform?.forEach(e => {
    if(e?.active && e?.label !== defaultStatus){
      formIsValid = true;
    }
  });
  return { statusValidity: formIsValid };
};

const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : item.type === "dropdownAsync" ||
            item.type === "dropdown" ||
            item.type === "conditionalDropdown" ||
            item.type === "SearchableWithCreate"
            ? item.multiple
              ? []
              : null
            : ""),
        (item.touched = 0);
      item.valid = true;
      return item;
    });
  }
};
const statusText = {
  All: "Last Modified By",
  Draft: "Last Modified By",
  Changed: "Last Modified By",
  Published: "Published By",
  Unpublished: "Unpublished By",
  "Need Work": "Reviewed by",
  Scheduled: "Scheduled by",
  "Submitted To Review": "Submitted by",
  Archived: "Archived By",
  "Publishing Queue": "Published by",
};
class MovieList extends Component {

  constructor(props) {
    super(props);

    const savedFilterData = filterService.getSavedFilterData({
      page: filterService.pages.movieListing,
      sortingFilters: sideFilterJson.sortingFilters,
      statusTypes: sideFilterJson.StatusTypes,
      filterByDate: sideFilterJson.filterByDate,
      selectFilters: DEFAULT_JSON(JSON.parse(JSON.stringify(sideFilterJson.sideSelectFilters)))
    })

  this.state = {
    movieFilterQuery: {},
    movieCount: 0,
    blankDate: savedFilterData.blankDate,
    defaultFilter: {
      status: savedFilterData.statusTypes,
      startDate: savedFilterData.defaultStart,
      endDate: savedFilterData.defaultEnd,
    },
    appliedFilters: savedFilterData.appliedFilters ||
      this.getAppliedFilter(savedFilterData.selectFilters, savedFilterData.filterByDate, savedFilterData.statusTypes),
    isDefaultApplied: true,
    isFilterUpdate: false,
    isRequestIntiate: null,
    changingTab: false,
    maxPage: null,
    moviesList: [],
    searchMode: false,
    contentStateName: savedFilterData.contentStateName || "All",
    currentSortkey: savedFilterData.currentSortkey || 'lastModifiedOn',
    currentSortValue: savedFilterData.currentSortValue || 'desc',
    isQueue: false,
    quickFellingValue: "",
    showScheduledDrawer: false,
    openQuickDropdown: false,
    openBulkDropdown: false,
    selectedTab: 0,
    showFilterDrawer: false,
    openSortDrawer: false,
    queryData: {
      limit: constantText.search_limit,
      searchString: savedFilterData.searchString || "",
      page: 1,
      lastEvaluatedKey: "",
      contentState: savedFilterData.contentState == "All" ? "" : savedFilterData.contentState,
    },
    isUnpublished: false,
    isArchived: false,
    tabOptions: [],
    dropdownOptions: [],
    allStatus: [],
    movieHistoryData: null,
    sort: {
      sortingFilters: JSON.parse(JSON.stringify(savedFilterData.sortingFilters)),
      movieReleaseDate: movieConstants.movieReleaseDateVal,
      movieUnpublished: movieConstants.movieUnpublishedVal,
      movieCreated: movieConstants.movieCreatedVal,
      movieSubmitedToWork: movieConstants.movieSubmitedToWorkVal,
    },
    filters: {
      formValidity: savedFilterData.formValidity || false,
      filterByStatus: JSON.parse(JSON.stringify(savedFilterData.statusTypes)),
      filterByDate: JSON.parse(JSON.stringify(savedFilterData.filterByDate)),
      selectFilters: JSON.parse(JSON.stringify(savedFilterData.selectFilters)) || [],
      querys: "",
      byDate: "",
      startDate: "",
      endDate: "",
    },
    links: [
      {
        color: "inherit",
        text: constantText.dashBoard_text,
        route: "/dashboard",
      },
    ],
    typography: [
      {
        color: "textPrimary",
        text: constantText.movie_list_text,
        label: "primary",
      },
    ],
    language: "EN",
    published_history_arr: [],
    scheduled_history_arr: [],
    unpublishedHistory_arr: [],
    remainingCountry_arr: [],
    currentMovie: null,
    currentJourneyType: null,
    SelectedMovieMoreCountries: [],
    showModelForCountries: false,
    showModelForArchive: false,
    showModelForRestore: false,
    showModelForClone: false,
    filterDatakey: savedFilterData.filterDatakey,
    sortDatakey: savedFilterData.sortDatakey,
    model: {
      detail: "",
      open: false,
      desc: "",
      btn1: constantText.yes_text,
      btn2: constantText.no_text,
    },
    showMapContentModal: false,
    addContentData: {
      "updateType": 0,
      "transcodingUid": "",
      "externalId": "",
      "contentType": ""
    },
    showMapContentConfirmation: false,
    updateType: null
  };
  }

  componentDidMount() {
    // this.resetDefaultFilter();
    this.getAllStatus();
    this.fetchLeftTabData();
    this.getAllMovies(true);
    commonService.getLeftSideBarListing("movie").then((res) => {
      let dropDownData = res?.dropdowns || [];
      dropDownData = dropDownData?.map((data) => {
        const { permissionKey, permissionSubKey, permissionName } = data;
        return {
          ...data,
          disabled: !permissionObj?.[permissionKey]?.[permissionSubKey]?.[
            permissionName
          ](),
        };
      });
      const { selectedTab, contentStateName } = this.state;
      const selectedTabIndex = (res?.menuItems || []).findIndex(item => item.displayName == contentStateName);
      this.setState({
        dropdownOptions: dropDownData,
        tabOptions: res?.menuItems,
        selectedTab: selectedTabIndex >= 0 ? selectedTabIndex : selectedTab
      });
    });
  }
  resetDefaultFilter = () => {
    const { filters, contentStateName, queryData } = this.state;
    const { filterByDate, filterByStatus, selectFilters } = filters;
    const defaultStart = moment().subtract(3, 'months').format(constantText?.placeholder_date_Format);
    const defaultEnd = moment().format(constantText?.placeholder_date_Format);
    //Clear Status
    filterByStatus.forEach((e) => {
      e.active = e.label === "All" ? true : false;
    });
    //Clear Date
    filterByDate.forEach((item) => {
      if (item?.display) {
        item.date.endDate = defaultEnd;
        item.date.startDate = defaultStart;
      }
    });
    //Clear Select
      selectFilters.map((filter) => {
        filter.value =
          filter?.type === "text" ? "" : filter?.multiple ? [] : null;
      });

        return new Promise(async (resolve, reject) => {
          this.setState(
            {
              blankDate: false,
              appliedFilters: await this.getAppliedFilter(
                filters.selectFilters,
                filterByDate,
                filters.filterByStatus
              ),
              defaultFilter: {
                status: "All",
                startDate: defaultStart,
                endDate: defaultEnd
              },
              isDefaultApplied: true,
              filterDatakey: true,
              moviesList: [],
              filters: {
                ...filters,
                formValidity: false,
                selectFilters,
                filterByDate,
                filterByStatus,
              },
              queryData: {
                ...queryData,
                page: 1,
                contentState:
                  contentStateName === "All" ? "" : queryData?.contentState,
              },
            },
            () => {
              resolve(true);
            }
          );
        });
  }
 
  getAllStatus = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/ContentState`,
      "GET",
      {},
      constantText.movie_route,
      false
    );
    if (response) {
      this.setState({ allStatus: response });
    }
  };
  setQueryData = async () => {
    const {
      filters,
      sort,
      queryData,
      movieFilterQuery,
    } = this.state;
    let updateObj = {
        filters: getCopyObj(filters.selectFilters),
        filterByDate: getCopyObj(filters.filterByDate),
        sort: getCopyObj(sort.sortingFilters),
        paramQuery: getCopyObj(queryData),
      };
    this.setState({
      movieFilterQuery: {
        ...movieFilterQuery,
        ...updateObj,
      },
    });
  };
  fetchLeftTabData = async () => {
    let url = `${Config.movieCount}`;
    let response = await apiCalls(
      url,
      "GET",
      null,
      constantText.movie_route,
      false
    );
    if (response && response?.length) {
      const data = response.map((item) => {
        const obj = {};
        obj.displayName = item?.title || "";
        obj.count = item?.count || 0;
        obj.id = item?.id || "";
        obj.status = item?.status || "";
        obj.statusText = statusText[item?.title] || "Last Modified By";
        return obj;
      });
      this.setState({ tabOptions: data });
    }
  };
  setMovieListData = (moviesList) => {
    moviesList?.map((item) => {
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
  saveFilter = () => {
    const { queryData, sort, filters, contentStateName, currentSortkey, currentSortValue, blankDate, filterDatakey, sortDatakey, appliedFilters } = this.state
    filterService.saveFilterData({
      page: filterService.pages.movieListing,
      contentState: queryData.contentState,
      contentStateName: contentStateName,
      searchString: queryData.searchString,
      sortingFilters: sort.sortingFilters,
      statusTypes: filters.filterByStatus,
      filterByDate: filters.filterByDate,
      selectFilters: filters.selectFilters,
      currentSortkey,
      currentSortValue,
      blankDate,
      filterDatakey,
      sortDatakey,
      appliedFilters,
      formValidity: filters.formValidity
    });
  }
  getAllMovies = async (count = false) => {
    this.saveFilter();
    await this.setQueryData();
    const { movieFilterQuery } = this.state;
    let { paramQuery } = movieFilterQuery;
    let { searchString } = paramQuery;
    paramQuery = searchString
      ? { ...paramQuery, searchString: searchString.trim() }
      : paramQuery;
    movieFilterQuery.paramQuery = paramQuery;
    if (count) {
      await this.fetchListTotal(movieFilterQuery);
    } else {
      await this.fetchMovies(movieFilterQuery);
    }
  };
  fetchListTotal = async (params) => {
    const { isRequestIntiate } = this.state;
    const query = createQuery(params);
    let listUrl = `${Config.movie}${query ? query : ""}` 
    let totalUrl = `${Config.movieListTotal}${query ? query : ""}`;
    let urls = [
      totalUrl,
      listUrl,
    ];
    // map every url to the promise of the fetch
    let requests = urls.map((url) =>
      apiCalls(url, "GET", null, constantText.movie_route, false)
    );
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      // Promise.all waits until all jobs are resolved
      Promise.all(requests)
        .then((responses) => {
          const { count } = responses[0] || {};
          if (responses[0] && responses[1]) {
            const limit = constantText.search_limit;
            const Count = count ? count : 0;
            const Page = Count ? Math.ceil(Count / limit) : 1;
            this.setState(
              {
                movieCount: Count || 0,
                maxPage: Page || 0,
              },
              () => {
                this.setListResponse(responses[1]);
              }
            );
          } else {
            this.setState({
              movieCount: 0,
              maxPage: null,
              isRequestIntiate: true,
              changingTab: false,
              moviesList: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  setListResponse = (response) => {
    const { moviesList, queryData } = this.state;
    if (response) {
      const copyQueryData = { ...queryData };
      let newMovieList = [];
      //If has movieData increase page
      copyQueryData.page = copyQueryData.page + 1;
      newMovieList = [...moviesList, ...(response || [])];
      let stateObj = {
        isRequestIntiate: true,
        changingTab: false,
        moviesList: this.setMovieListData(newMovieList),
        queryData: copyQueryData,
      };
      this.setState(stateObj);
    } else {
      this.setState({
        isRequestIntiate: true,
        changingTab: false,
        movieCount: 0,
        moviesList: [],
      });
    }
  };
  fetchMovies = async (params) => {
    const { isRequestIntiate } = this.state;
    const query = createQuery(params);
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      const url = `${Config.movie}${query ? query : ""}`;
      //ListCall
      let response = await apiCalls(
        url,
        "GET",
        null,
        constantText.movie_route,
        false
      );
      this.setListResponse(response);
    }
  };
  nextCall = () => {
    const { maxPage, isRequestIntiate, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getAllMovies();
    }
  };

  getAppliedFilter = (JSON, filterByDate, filterByStatus) => {
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    let Arr = [];
    if (checkDate) {
      let obj1 = {};
      let obj2 = {};
      obj1.label = checkDate?.date?.startPlaceholder;
      obj1.value = moment(checkDate?.date?.startDate).format(
        constantText.date_format_placeholder
      );
      obj2.label = checkDate?.date?.endPlaceholder;
      obj2.value = moment(checkDate?.date?.endDate).format(
        constantText.date_format_placeholder
      );
      Arr.push(obj1);
      Arr.push(obj2);
    }
    filterByStatus.forEach((item) => {
      if(item?.active){
        let obj = {};
        obj.label = 'Status';
        obj.value = item?.label;
        Arr.push(obj);
      }
    });
    JSON.forEach((item) => {
      if (item?.type === "dropdownAsync" && item?.value?.length) {
        let obj = {};
        if (item?.multiple) {
          item?.value.forEach((selected) => {
            let obj = {};
            obj.label = item?.label;
            obj.value = selected[item?.keyText];
            Arr.push(obj);
          });
        }
        else {
          obj.label = item?.label;
          obj.value = item?.value[item?.keyText];
          Arr.push(obj);
        }
      } else if (item?.type === "text" && item?.value) {
        let obj = {};
        obj.label = item?.label;
        obj.value = item?.value;
        Arr.push(obj);
      } else if (item?.type === "SearchableWithCreate" && item?.value) {
        let obj = {};
        if (item?.multiple) {
          item?.value.forEach((selected) => {
            let obj = {};
            obj.label = item?.label;
            obj.value = selected[item?.keyText];
            Arr.push(obj);
          });
        } else {
          obj.label = item?.label;
          obj.value = item?.value[item?.keyText];
          Arr.push(obj);
        }
      }
    });
    return Arr;
  };
  changeTab = async (tab, index) => {
    const { queryData } = this.state;
    this.setState(
      {
        moviesList: [],
        changingTab: true,
        contentStateName: tab.displayName,
        isQueue: tab.displayName === "Publishing Queue" ? true : false,
        isUnpublished: tab.displayName === "Unpublished" ? true : false,
        isArchived: tab.displayName === "Archived" ? true : false,
        selectedTab: index,
        queryData: await {
          ...queryData,
          page: 1,
          contentState: tab.id,
        },
      },
      () => {
        this.getAllMovies(true);
      }
    );
  };
  showHideStatePopup = (currentMovie) => {
    const { showModelForArchive } = this.state;
    this.setState({
      currentMovie,
      showModelForArchive: !showModelForArchive,
    });
  };
  showHideRestorePopup = (currentMovie) => {
    const { showModelForRestore } = this.state;
    this.setState({
      currentMovie,
      showModelForRestore: !showModelForRestore,
    });
  };
  showHideClonePopup = (currentMovie, currentJourneyType) => {
    const { showModelForClone } = this.state;
    this.setState({
      currentMovie,
      currentJourneyType,
      showModelForClone: !showModelForClone,
    });
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
  restoreinDraft = async () => {
    const { tabOptions, currentMovie } = this.state;
    let contentId = currentMovie.contentId;
    const archiveTabIndex = tabOptions.findIndex(
      (tab) => tab.label === "Draft"
    );
    let url = `${Config.restore}/${contentId}`;
    let response = await apiCalls(url, "PUT", {});
    if (response) {
      this.changeTab(tabOptions[archiveTabIndex], archiveTabIndex);
    }
  };
  checkDefaultDate = (start, end, data) => {
    const { date } = data;
    const { startDate, endDate } = date;
    if(startDate === start && endDate === end){
      return true;
    }
    else {
      return false;
    }
  }
  handleDateChange = (type, index, event) => {
    let { value } = event.target;
    const { filters, isDefaultApplied } = this.state;
    const { filterByDate, selectFilters } = filters;

    //Reset Other status start
    filterByDate.map((fDItem, i) => {
      if (index !== i) {
        fDItem.date.startDate = "";
        fDItem.date.endDate = "";
      }
    });
    // Reset Other status end
    if (type === "startDate") {
      filterByDate[index].date.startDate = value
        ? moment(value).format(constantText?.placeholder_date_Format)
        : value;
    } else if (type === "endDate") {
      filterByDate[index].date.endDate = value
        ? moment(value).format(constantText?.placeholder_date_Format)
        : value;
    }
    let startDate = filterByDate[index].date.startDate;
    let endDate = filterByDate[index].date.endDate;
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck([...selectFilters]);
    this.setState(
      {
        blankDate: startDate === "" && endDate === "",
        filters: {
          ...filters,
          formValidity: formValidity
            ? startDate === "" && endDate === ""
              ? formValidity
              : checkDate && formValidity
            : !!(checkDate || (startDate === "" && endDate === "")),
          filterByDate: filterByDate,
        },
      },
      () => {
        if (isDefaultApplied) {
          this.checkIsDefaultApplied();
        }
      }
    );
  };

  showHideSortDrawer = () => {
    let { openSortDrawer } = this.state;
    this.setState({ openSortDrawer: !openSortDrawer });
  };
  getDateAndStatus = () => {
    const { defaultFilter, filters } = this.state;
    const { selectFilters, filterByStatus, filterByDate } = filters;
    let status;
    //Set Status
    filterByStatus?.forEach((e) => {
      if (e?.active) {
        status = e?.label;
      }
    });
    //Check date
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const selectFilterValidity = filterValidityCheck(selectFilters)?.formValidity;
    let isDate = null;
    if (checkDate) {
      isDate = this.checkDefaultDate(
        defaultFilter?.startDate,
        defaultFilter?.endDate,
        checkDate
      );
    }
    return { isDate, status, selectFilterValidity };
  };
  checkIsDefaultApplied = () => {
    const { filters } = this.state;
    const { isDate, status, selectFilterValidity } = this.getDateAndStatus();
    if (isDate !== null) {
      this.setState({
        filters: {
          ...filters,
          formValidity: selectFilterValidity
            ? true
            : isDate && status === "All"
            ? false
            : filters?.formValidity,
        },
      });
    }
  };
  filterData = async () => {
    let { queryData, filters } = this.state;
    const { selectFilters, filterByStatus, filterByDate } = filters;
    const copyJSON = [...selectFilters];
    const { isDate, status, selectFilterValidity } = this.getDateAndStatus();
    this.setState(
      {
        appliedFilters: await this.getAppliedFilter(
          copyJSON,
          filterByDate,
          filterByStatus
        ),
        isDefaultApplied: selectFilterValidity ? false : isDate && status === "All" ? true : false,
        filterDatakey: true,
        searchMode: false,
        moviesList: [],
        movieCount: 0,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.checkIsDefaultApplied();
        this.getAllMovies(true);
      }
    );
  };

  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };

  handleSortFilter = (item, index, event) => {
    let { value } = event.target;
    let { sort } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
      sortItem.value = "";
    });
    sortingFilters[index].value = value;
    this.setState(
      {
        sort: {
          sortingFilters: sortingFilters,
        },
      },
      () => {
        this.checkvalidation();
      }
    );
  };

  checkvalidation = () => {
    const { currentSortkey, currentSortValue } = this.state;
    const { sortingFilters } = this.state.sort;
    const checkFilter = sortingFilters.findIndex((item) => item.value);
    if (checkFilter !== -1 && currentSortkey === sortingFilters[checkFilter]?.sortValue && currentSortValue === sortingFilters[checkFilter]?.value) {
      return true;
    } else {
      return false;
    }
  };

  handleOpenCloseQuickDropDown = () => {
    let { openQuickDropdown } = this.state;
    this.setState({ openQuickDropdown: !openQuickDropdown });
  };

  handleCloseQuickDropdown = () => {
    this.setState({ openQuickDropdown: false });
  };

  handleDropDownItem = (option) => {
    this.selectQuickFilling(`/${option.title}/movie/create`);
  };

  handleOpenCloseBulkDropDown = () => {
    let { openBulkDropdown } = this.state;
    this.setState({ openBulkDropdown: !openBulkDropdown });
  };

  handleCloseBulkDropdown = () => {
    this.setState({ openBulkDropdown: false });
  };

  selectQuickFilling = (route) => {
    history.push(route);
  };

  selectBulkFilling = (value) => {
    let { openBulkDropdown } = this.state;
    this.setState({
      quickFellingValue: value,
      openBulkDropdown: !openBulkDropdown,
    });
  };

  searchHandleChange = (event) => {
    let { name, value } = event.target;
    let { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        page: 1,
        [name]: value,
      },
    });
  };

  clearFilter = () => {
    this.resetDefaultFilter()
      .then(() => {
        this.showHideFilterDrawer();
        this.getAllMovies(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  clearSortFilter = () => {
    let { sort, queryData } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
      sortItem.value = "";
    });
    this.setState(
      {
        moviesList: [],
        sortDatakey: false,
        sort: {
          ...sort,
          sortingFilters: sortingFilters,
        },
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.showHideSortDrawer();
        this.getAllMovies();
      }
    );
  };

  applySortFilter = () => {
    let { queryData, sort } = this.state;
    let { sortingFilters } = sort;
    let index  = sortingFilters.findIndex((sortItem) => sortItem?.value);
    this.setState(
      {
        currentSortkey: sortingFilters[index]?.sortValue,
        currentSortValue: sortingFilters[index]?.value,
        moviesList: [],
        sortDatakey: true,
        searchMode: false,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllMovies();
      }
    );
  };

  showStatusField = (selectFilters, flag) => {
    selectFilters.map((item) => {
      if (item.name === "translationStatus") {
        if (flag) {
          item.display = flag;
          item.value = null;
          item.data = constantText.translationStatus;
        } else {
          item.display = flag;
          item.value = null;
        }
      }
    });
  };

  handleRoute = (route) => {
    history.push(route);
  };
  goToLinkedMovie = (movieId) => {
    history.push(`movie/linked-movie/${movieId}`);
  };
  filterChange = (event, elemIndex) => {
    let { filters, blankDate, isDefaultApplied } = this.state;
    let { selectFilters, filterByDate } = filters;
    const copyJSON = [...selectFilters];
    const updatedElement = copyJSON[elemIndex];
    updatedElement.value = event.target.value;

    if (
      updatedElement?.type === "SearchableWithCreate" &&
      event?.target?.value?.length
    ) {
      updatedElement.value = makeStringObjectOption(
        event?.target?.value,
        updatedElement?.keyText
      );
    }
    if (
      updatedElement.name === "translationLanguage" &&
      updatedElement.value.length
    ) {
      this.showStatusField(selectFilters, true);
    }
    if (
      updatedElement.name === "translationLanguage" &&
      updatedElement.value.length === 0
    ) {
      this.showStatusField(selectFilters, false);
    }

    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    updatedElement.touched = 1;

    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck(copyJSON);

    this.setState(
      {
        filters: {
          ...filters,
          formValidity: formValidity
            ? blankDate
              ? formValidity
              : checkDate && formValidity
            : !!checkDate || blankDate,
          selectFilters: copyJSON,
        },
      },
      () => {
        if (isDefaultApplied) {
          this.checkIsDefaultApplied();
        }
      }
    );
  };
  showHideScheduledDrawer = () => { };
  viewMovieHandler = (movie) => {
    const { movieId, journeyType } = movie;
    this.props.history.push({
      pathname: `${constantText.movie_view_route}/${movieId}`,
      state: { journeyType: journeyType },
    });
  };
  openSeheduledHistory = async (movie, index) => {
    let { showScheduledDrawer } = this.state;
    this.setState({
      showScheduledDrawer: !showScheduledDrawer,
      scheduledDrawerLoading: true,
    });
    let url = `${Config.workflowHistory}/movie/${movie.movieId}`;
    let remainingUrl = `${Config.licenseCountries}/${movie.movieId}`;
    let response = await apiCalls(url, "GET", {}, "/movie", false);
    let responseRemaining = await apiCalls(
      remainingUrl,
      "GET",
      {},
      "/movie",
      false
    );
    let obj = {};
    if (response) {
      obj = {
        ...obj,
        movieHistoryData: response,
        scheduledDrawerLoading: false,
      };
    }
    if (responseRemaining) {
      obj = {
        ...obj,
        remainingCountry_arr: responseRemaining,
        scheduledDrawerLoading: false,
      };
    } else {
      obj = {
        ...obj,
        scheduledDrawerLoading: false,
      };
    }
    this.setState(obj);
  };
  closeSeheduledHistory = () => {
    this.setState({
      movieHistoryData: {},
      showScheduledDrawer: false,
    });
  };
  showHideDetails = async (movieId, movie, index, type) => {
    let moviesList = [...this.state.moviesList];
    moviesList[index]["showDetails"] = !movie.showDetails;
    this.setState({ moviesList: moviesList });
    if (type === "show") {
      let url = `${Config.mapContent}/${movieId}/link`;
      let response = await apiCalls(url, "GET", {}, "/movie", false);
      if (response && response.length) {
        moviesList[index]["movieDetails"] = response;
      }
    }
    this.setState({
      moviesList: moviesList,
    });
  };
  handleConditionRoute = (view, id) => {
    let canArchive = permissionObj?.movies?.archive?.canUpdate();
    let canPublish = permissionObj?.movies?.publish?.canCreate();
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
  handleModel = async (action, model) => {
    let shallowModel = { ...model };
    // Archive to Draft
    if (
      action &&
      (shallowModel.detail?.view === "archive" ||
        shallowModel.detail?.view === "restore")
    ) {
      let { language, allStatus } = this.state;
      const cStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.contentConstants.unpublished
          : constantText.contentConstants.archived;
      const nStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.contentConstants.archived
          : constantText.contentConstants.draft;
      const currentStatus = allStatus.find((item) => item?.title === cStatus);
      const nextState = allStatus.find((item) => item?.title === nStatus);
      let data = {
        fromState: currentStatus?.id,
        toState: nextState?.id,
        contentType: "movie",
        contentData: {},
      };
      let tabName =
        shallowModel.detail?.view === "archive"
          ? constantText.contentConstants.archived
          : constantText.contentConstants.draft;
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
      constantText.movie_route,
      false
    );
    if (response) {
      let { tabOptions } = this.state;
      let tabIndex = tabOptions.findIndex(
        (option) => option.displayName === tabName
      );
      const tabOption = tabOptions.find((item) => item.displayName === tabName);
      this.changeTab(tabOption, tabIndex);
      this.fetchLeftTabData();
    }
  };
  getScheduledUi = () => {
    const {
      movieHistoryData,
      remainingCountry_arr,
      scheduledDrawerLoading,
    } = this.state;

    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">
            {movieConstants.publishedScheduledHistory}
          </div>
          <div className="side-close-btn" onClick={this.closeSeheduledHistory}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="history-data scrollBar scroll-Y">
          <div className="box">
            <h6 className="title">{movieConstants.unpublishedHistory}</h6>
            {!scheduledDrawerLoading && (
              <div className="text-row flex">
                <div className="label">{movieConstants.groupCountryLabel}</div>
                {movieHistoryData?.unpublish &&
                  movieHistoryData?.unpublish?.country?.length > 0
                  ? movieHistoryData?.unpublish?.country
                    ?.map((data, index) => data?.title)
                    .join(", ")
                  : "NA"}
              </div>
            )}
            {scheduledDrawerLoading && (
              <InlineLoader show={scheduledDrawerLoading} />
            )}
          </div>

          <div className="box">
            <h6 className="title">{movieConstants.publishedHistoy_text}</h6>
            {!scheduledDrawerLoading && (
              <div className="text-row flex">
                <div className="label">{movieConstants.groupCountryLabel}</div>
                {movieHistoryData?.publish &&
                  movieHistoryData?.publish?.country?.length > 0
                  ? movieHistoryData?.publish?.country
                    ?.map((data, index) => data?.title)
                    .join(", ")
                  : "NA"}
              </div>
            )}
            {scheduledDrawerLoading && (
              <InlineLoader show={scheduledDrawerLoading} />
            )}
          </div>

          <div className="box">
            <h6 className="title">{movieConstants.scheduledHistory_text}</h6>
            {!scheduledDrawerLoading && movieHistoryData?.schedule?.length > 0
              ? movieHistoryData?.schedule?.map((schedule, index) => (
                <div key={index}>
                  <h6 className="title">{`${movieConstants.schedule_text} ${index + 1}`}</h6>
                  <div className="text-row flex">
                    <div className="label">
                      {movieConstants.groupCountryLabel}
                    </div>
                    {schedule?.country && schedule?.country?.length > 0
                      ? schedule?.country
                          ?.map((data) => data?.title)
                          .join(", ")
                      : "NA"}
                  </div>
                  <div className="text-row flex">
                    <div className="label">{movieConstants.date_text}</div>
                    <div className="text">
                      {schedule?.scheduledTime
                        ? moment(schedule?.scheduledTime).format(constantText.date_format_without_time)
                        : "NA"}
                    </div>
                  </div>
                  <div className="text-row flex">
                      <div className="label">{movieConstants.time_text}</div>
                      <div className="text">
                        {schedule?.scheduledTime
                          ? moment(schedule?.scheduledTime).format(constantText.time_format_lt)
                          : "NA"}
                      </div>
                    </div>
                  <div className="text-row flex">
                    <div className="label">{movieConstants.time_text}</div>
                    <div className="text">
                      {schedule?.scheduledTime
                        ? moment(schedule?.scheduledTime).format(constantText.time_format_lt)
                        : "NA"}
                    </div>
                  </div>
                </div>
              ))
              : !scheduledDrawerLoading && (
                <div className="text-row flex">
                  <div className="label">{movieConstants.schedule_text}</div>
                  <div className="text">{"NA"}</div>
                </div>
              )}
            {scheduledDrawerLoading && (
              <InlineLoader show={scheduledDrawerLoading} />
            )}
          </div>

          <div className="box">
            <h6 className="title">{movieConstants.remaining_country_text}</h6>
            {!scheduledDrawerLoading && (
              <div className="text-row flex">
                <div className="label">{movieConstants.groupCountryLabel}</div>
                {remainingCountry_arr && remainingCountry_arr.length > 0
                  ? remainingCountry_arr
                    .map((data, index) => data?.title)
                    .join(", ")
                  : "NA"}
              </div>
            )}
            {scheduledDrawerLoading && (
              <InlineLoader show={scheduledDrawerLoading} />
            )}
          </div>
        </div>
      </div>
    );
  };
  setSelectDataArr = (res, index) => {
    const { filters } = this.state;
    const copyFilters = { ...filters };
    const copySelect = [...copyFilters?.selectFilters];
    if (copySelect[index]?.name === "licenseGroupCountries") {
      const GroupName = [];
      res.forEach((group) => {
        group?.countries.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      copySelect[index].data = GroupName;
    } else {
      copySelect[index].data = res;
    }
    this.setState({ filters: copyFilters });
  };

  handleAutoCreateInput = async (value, index) => {
    let { filters } = this.state;
    let { selectFilters } = filters;
    let url =
      selectFilters[index].name == "tags"
        ? `${Config.masterTags}?title=${value}`
        : `${Config.castnamesUrl}?castName=${value}`;
    let response = (await apiCalls(url, "GET", {}, null, false)) || [];
    selectFilters[index]["data"] = response;
    this.setState((prevState) => ({
      filters: {
        ...filters,
        selectFilters,
      },
    }));
  };

  selectCountryGroup = (event, group) => {
    const { filters } = this.state;
    const { filterByDate, selectFilters } = filters;
    const copyFilters = { ...filters };
    const copySelect = [...copyFilters?.selectFilters];
    const findIndex = copySelect.findIndex(
      (e) => e.name === "licenseGroupCountries"
    );
    const copyElement = copySelect[findIndex];
    const options = [...copyElement.data];
    copyElement.value = getSelectedGroup(
      event,
      group,
      options,
      copyElement.value
    );

    const { formValidity } = filterValidityCheck([...selectFilters]);
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    this.setState({
      filters: {
        ...copyFilters,
        formValidity: checkDate ? checkDate : formValidity,
      },
    });
  };
  handleFilterStatusSelection = (selectedTab) => {
    let { filters, queryData, tabOptions, blankDate, isDefaultApplied } =
      this.state;
    const { filterByDate, selectFilters } = filters;
    let shallowFilters = JSON.parse(JSON.stringify(filters));
    const findContentIndex = tabOptions.findIndex(
      (e) =>
        e?.displayName.toLowerCase() ===
        shallowFilters.filterByStatus[selectedTab]?.label.toLowerCase()
    );
    shallowFilters.filterByStatus.forEach((item, index) => {
      item["active"] = index == selectedTab ? true : false;
    });
    let contentState = tabOptions[findContentIndex]?.id;

    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck([...selectFilters]);

    this.setState(
      {
        filters: {
          ...shallowFilters,
          formValidity: formValidity
            ? blankDate
              ? formValidity
              : checkDate && formValidity
            : !!checkDate || blankDate,
          filterByDate: filterByDate,
        },
        queryData: {
          ...queryData,
          contentState,
        },
      },
      () => {
        if (isDefaultApplied) {
          this.checkIsDefaultApplied();
        }
      }
    );
  };
  getFiltersUi = () => {
    let { filters, contentStateName } = this.state;
    let { filterByDate, filterByStatus, selectFilters, formValidity } = filters;
    let allStatusFilters = filterByStatus.map((status, index) => (
      <div className="bystatus-col" key={"status_" + index}>
        <div
          className={`bystatus-f-cta flex align-items-center justify-content-center${status.active ? " s-active" : ""
            }`}
          onClick={(e) => this.handleFilterStatusSelection(index)}
        >
          {status.displayName}
        </div>
      </div>
    ));
    let allDateFilters = null;
    if (filterByDate && filterByDate.length) {
      allDateFilters = filterByDate.map((filterDate, i) => {
        if (contentStateName.toLowerCase() === filterDate.for.toLowerCase()) {
          filterDate.display = true;
        } else {
          filterDate.display = false;
        }
        let sortFilter = filterDate.display ? (
          <div key={i} className="dateFilterBox">
            <h5 className="sidebar-s-title">{filterDate.label}</h5>
            <div className="row">
              <div className="col-sm-6">
                <DatePicker
                  type="date"
                  placeholder={filterDate.date.startPlaceholder}
                  value={filterDate.date.startDate}
                  minDateValue={filterDate.date.endDate && moment(filterDate.date.endDate).subtract(constantText.filterDateRangeMonthCount,'months')}
                  onChange={(e) =>
                    this.handleDateChange("startDate", i, e)
                  }
                  className="zee-input-field filter-drower-custom"
                />
              </div>
              <div className="col-sm-6">
                <DatePicker
                  type="date"
                  placeholder={filterDate.date.endPlaceholder}
                  value={filterDate.date.endDate}
                  maxDateValue={filterDate.date.startDate && moment(filterDate.date.startDate).add(constantText.filterDateRangeMonthCount,'months')}
                  onChange={(e) =>
                    this.handleDateChange("endDate", i, e)
                  }
                  className="zee-input-field filter-drower-custom"
                />
              </div>
            </div>
            <div className="date-info-msg">{constantText?.max_3_months_date}</div>
          </div>
        ) : (
          ""
        );
        return sortFilter;
      });
    }

    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{movieConstants.filter_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="f-filter">
              {allStatusFilters && contentStateName === "All" && (
                <span>
                  <h5 className="sidebar-s-title">Select Status</h5>
                  <div className="bystatus-filter flex">{allStatusFilters}</div>
                </span>
              )}
              <div className="bydate-filter">{allDateFilters}</div>
              <Divider className="date-divider" />

              <FormRender
                form={selectFilters}
                handleFocus={this.setmultyData}
                setSelectDataArr={this.setSelectDataArr}
                selectGroup={this.selectCountryGroup}
                handleAutoCreateInput={this.handleAutoCreateInput}
                onChange={this.filterChange}
              />
            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField
            color="secondary"
            className="apply-btn auto-filter-movie"
            disabled={!formValidity}
            buttonText={movieConstants.filter_apply}
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData();
            }}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            // disabled={!formValidity}
            disabled={!this.state.isRequestIntiate}
            buttonText={movieConstants.clear_text}
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };
  getSortUi = () => {
    const { sort, contentStateName } = this.state;
    const { sortingFilters } = sort;
    const allSort = sortingFilters.map((sortItem, i) => {
      if (
        contentStateName.toLowerCase() === sortItem.for.toLowerCase() ||
        sortItem.for === ""
      ) {
        sortItem.display = true;
      } else {
        sortItem.display = false;
      }
      let sortFilter = sortItem.display ? (
        <RadioButton
          key={i}
          labelText={sortItem.label}
          className="zee-radio-field status-field align-items-center"
          name="movieReleaseDate"
          areaLabel="movieReleaseDate"
          value={sortItem.value}
          onChange={(e) => this.handleSortFilter(sortItem, i, e)}
          labelPlacement="end"
          data={sortItem.data}
        />
      ) : (
        ""
      );
      return sortFilter;
    });
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{movieConstants.sort_text}</div>
          <div className="side-close-btn" onClick={this.showHideSortDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="status-s inlineGrid">{allSort}</div>
          </div>
          <div className="bottom-w filter-btn">
            <ButtonField
              color="secondary"
              className="apply-btn"
              buttonText={constantText.apply_sort_text}
              disabled={this.checkvalidation()}
              onClick={() => {
                this.showHideSortDrawer();
                this.applySortFilter();
              }}
            />
            <ButtonField
              color="secondary"
              className="cancle-btn"
              buttonText={constantText.clear_text}
              disabled={this.checkvalidation()}
              onClick={this.clearSortFilter}
            />
          </div>
        </div>
      </div>
    );
  };
  getMovieDetails = (movieDetails) => {
    let canClone = permissionObj?.movies?.clone?.canUpdate;
    const allDetails = movieDetails.map((movieDetailsItem, index) => {
      return (
        <div key={index} className="mov-link-row flex justify-content-between">
          <div className="left-area">
            <div className="mov-detail flex align-items-center">
              <h4>
                {movieDetailsItem?.title ? movieDetailsItem?.title : "NA"}
              </h4>
              {movieDetailsItem?.subtype_populated?.title ? (
                <span className="s-badge dot-badge blue">
                  {movieDetailsItem?.subtype_populated?.title}
                </span>
              ) : (
                ""
              )}
              {/* <span className="s-badge green">Published</span> */}
              {movieDetailsItem?.contentState_populated?.title ? (
                <BadgeBox className="s-badge orange"
                  status={movieDetailsItem?.contentState_populated?.title}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="right-area">
            <div className="mov-icon-sec flex align-items-center">
              <div className="mov-id">
                <span className="text-id">{constantText.external_id_text}</span>
                <span className="num-id">
                  {movieDetailsItem?.externalId
                    ? movieDetailsItem?.externalId
                    : "N/A"}
                </span>
              </div>
              <div class="mov-cta-wrap flex">
              <div
                onClick={() => this.viewMovieHandler(movieDetailsItem)}
                className={`mov-icon mov-view auto-view-${index}`}
              >
                <ViewIcon />
              </div>
              {(movieDetailsItem?.contentState_populated?.title.toLowerCase() !==
                "publishing queue" &&
                movieDetailsItem?.contentState_populated?.title.toLowerCase() !==
                "archived") ? (
                <div
                  onClick={() =>
                    canClone()
                      ? this.showHideClonePopup(
                        movieDetailsItem?.movieId,
                        movieDetailsItem?.journeyType
                      )
                      : constantText.no_permission
                  }
                  className="mov-icon mov-view tooltip-sec"
                >
                  <CopyIcon />
                  <div className="tooltip-box">
                    {movieConstants.copyMovie}
                  </div>
                </div>
              ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return allDetails;
  };
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  };
  handleKeyUp = (e) => {
    const { queryData, movieFilterQuery } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      if (searchString.trim().length >= 3 || searchString.length === 0) {
        this.setState(
          {
            moviesList: [],
            searchMode: true,
            queryData: {
              ...queryData,
              page: 1,
            },
          },
          () => {
            this.getAllMovies(true);
          }
        );
      }
    }, 1000);
  };
  toggleCountryPopup = (countryArr) => {
    const newArr = countryArr.slice(2, countryArr.length);
    this.setState({
      SelectedMovieMoreCountries: newArr,
      showModelForCountries: true,
    });
  };
  showHideCountriesPopup = () => {
    const { showModelForCountries } = this.state;
    this.setState({
      showModelForCountries: !showModelForCountries,
    });
  };
  refreshQueue = () => {
    const { queryData } = this.state;
    this.setState({
      moviesList: [],
      queryData: {
        ...queryData,
        page: 1
      }
    }, () => {
      this.getAllMovies(true);
    });
  }
  handleRouteExpiredLink = (movie) => {
    const { movieId, journeyType } = movie;
    this.props.history.push({
      pathname: `${constantText?.movie_view_route}/${movieId}`,
      state: {
        journeyType: journeyType,
        selectedTab: journeyType == "1" ? 3 : journeyType == "2" ? 2 : 1,
      },
    });
  };

  addContent = (externalId, contentType, transcodingUid) => {
    this.setState({
      addContentData: {
        ...this.state.addContentData,
        "externalId": externalId,
        "contentType": contentType,
        "transcodingUid": transcodingUid
      },
      showMapContentModal: !this.state.showMapContentModal
    })
  }

  updatemapcontent = async (updateType) => {
    if (updateType === 1 || updateType === 2) {
      this.setState({
        showMapContentModal: !this.state.showMapContentModal,
        showMapContentConfirmation: !this.state.showMapContentConfirmation,
        updateType: updateType
      })
    } else {
      const url = `${Config.transcoding}`;
      let data = { ...this.state.addContentData, "updateType": updateType }
      //ListCall
      let response = await apiCalls(url, "PUT", data);
      this.setState({
        showMapContentModal: !this.state.showMapContentModal
      })
    }
  }

  mapTranscodingContent = async (value) => {
    const { updateType } = this.state;
    const url = `${Config.transcoding}`;
    let data = { ...this.state.addContentData, "updateType": updateType }
    //ListCall
    let response = await apiCalls(url, "PUT", data);
    if (response && value) {
      this.refreshQueue();
      this.setState({
        showMapContentConfirmation: !this.state.showMapContentConfirmation
      })
    } else {
      this.setState({
        showMapContentConfirmation: !this.state.showMapContentConfirmation
      })
    }
  }

  closeContentTranscodingModal = () => {
    this.setState({
      showMapContentConfirmation: !this.state.showMapContentConfirmation
    })
  }

  closeContentModal = () => {
    this.setState({
      showMapContentModal: !this.state.showMapContentModal
    })
  };

  render() {
    let {
      isQueue,
      isRequestIntiate,
      SelectedMovieMoreCountries,
      showModelForCountries,
      changingTab,
      searchMode,
      moviesList,
      movieCount,
      isUnpublished,
      isArchived,
      links,
      typography,
      openQuickDropdown,
      openBulkDropdown,
      openSortDrawer,
      showFilterDrawer,
      tabOptions,
      dropdownOptions,
      selectedTab,
      queryData,
      showScheduledDrawer,
      showModelForArchive,
      showModelForRestore,
      showModelForClone,
      filterDatakey,
      appliedFilters,
      sortDatakey,
      model,
      showMapContentModal,
      showMapContentConfirmation
    } = this.state;
    let { searchString, page } = queryData;
    let { canCreate, canView } = permissionObj?.movies?.createMovie || {};
    let canClone = permissionObj?.movies?.clone?.canUpdate;
    let canPublish = permissionObj?.movies?.publish?.canCreate();
    let canArchive = permissionObj?.movies?.archive?.canUpdate;
    let canViewLicense = permissionObj?.movies?.licenceModule?.canView();
    const movies = moviesList.map((movie, i) => {
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
            <div
              className={
                canViewLicense
                  ? "license-badge"
                  : "license-badge tooltip-sec nopermission"
              }
              onClick={() =>
                canViewLicense ? this.handleRouteExpiredLink(movie) : () => { }
              }
            >
              {Math.min.apply(null, movie?.licenceExpDays) === 0
                ? constantText.license_expires_today
                : `${constantText.license_expires_in}  ${Math.min.apply(
                  null,
                  movie?.licenceExpDays
                )}  ${constantText.day_s_text}`}
              {!canViewLicense ? (
                <div className="tooltip-box">
                  {constantText?.tool_tip_noPermission}{" "}
                </div>
              ) : null}
            </div>
          )}

          <div className="mov-info-box flex justify-content-between">
            <div className="left-area flex">
              <div className="movie-img">
                <ImageLoad
                  url={Config.movieDefaultListImage}
                  externalId={movie?.externalId}
                  id={movie?.movieId}
                />
              </div>
              <div className="info">
                <div className="mov-detail flex align-items-center">
                  <h4>{movie?.title ? movie?.title : "NA"}</h4>
                  <BadgeBox
                    status={movie?.subtype_populated?.title}
                    dot={true}
                    color={"blue"}
                  />
                  {selectedTab == 0 && (
                    <BadgeBox
                      status={movie?.contentState_populated?.title}
                    />
                  )}
                  {/* <span className="s-badge red invalid-text">
                    *Invalid Licensing
                  </span> */}
                </div>
                {/* <div className="global-title status-text flex">
                  <span className="label">Global Title</span>
                  <span className="text">{movie?.properties?.contentData?.title ? movie?.properties?.contentData?.title : 'NA'}</span>
                </div> */}
                <div className="time-loc-row flex align-items-center">
                  <span className="time">
                    <MovieGrayIcon />
                    {movie?.duration ? movie?.duration : "N/A"}
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
                  {selectedTab == 0 ||
                    selectedTab == 9 ||
                    selectedTab == 2 ||
                    selectedTab == 3 ||
                    selectedTab == 6 ||
                    selectedTab == 4
                    ? movie?.contentState_populated?.title.toLowerCase() !==
                    "submitted to review" &&
                    movie?.contentState_populated?.title.toLowerCase() !==
                    "all" &&
                    movie?.contentState_populated?.title.toLowerCase() !==
                    "draft" &&
                    movie?.contentState_populated?.title.toLowerCase() !==
                    "need work" &&
                    movie?.contentState_populated?.title.toLowerCase() !==
                    "archived" && (
                      <span
                        className="pub-history"
                        onClick={() => this.openSeheduledHistory(movie, i)}
                      >
                        {movie?.contentState_populated?.title.toLowerCase() ===
                          "unpublished"
                          ? "Unpublished History"
                          : "Published and Scheduled History"}
                      </span>
                    )
                    : ""}
                </div>
                <div className="note-list-title status-text flex">
                  <span className="label">{constantText.note_list_text}</span>
                  <span className="text">{movie?.note || "NA"}</span>
                </div>
                <LastModifiedBy
                  data={movie || {}}
                  statusText={tabOptions[selectedTab]?.statusText || ""}
                />
                {
                  moviesList.length > 0 && movie?.transcoding ?
                    <div className="flex align-items-center tra-update">
                      <span className="flex p-r-10">
                        <span className="mark-green flex align-items-center justify-content-center"><MarkDone /> </span> Transcoding Update
                  </span>
                      <span className="update-con" onClick={() => this.addContent(movie.externalId ? movie.externalId : "",
                        selectedTab === 2 ? constantText?.tvshowList : selectedTab === 1 ? constantText?.videoCount : 'movie',
                        movie?.transcoding?.transcodingUid ? movie?.transcoding?.transcodingUid : "")}>
                        Update Content
                    </span>
                    </div>
                    : ''
                }
              </div>
            </div>
            <div className="right-area">
              <div className="mov-icon-sec flex align-items-center  justify-content-between">
                <div className="mov-id">
                  <span className="text-id">{constantText.external_id_text}</span>
                  <span className="num-id">
                    {movie?.externalId ? movie?.externalId : "N/A"}
                  </span>
                </div>
                <div className="mov-cta-wrap flex">
                  <div
                    onClick={() => canView() ? this.viewMovieHandler(movie) : null}
                    className={`mov-icon mov-view tooltip-sec auto-view-${i}`}
                  >
                    <ViewIcon />
                    <div className="tooltip-box">
                      {canView()
                        ? movieConstants.viewMovie
                        : constantText.no_permission}
                    </div>
                  </div>
                  {(movie?.contentState_populated?.title.toLowerCase() !==
                    "publishing queue" &&
                    movie?.contentState_populated?.title.toLowerCase() !==
                    "archived") ? (
                    <div
                      onClick={() =>
                        canClone()
                          ? this.showHideClonePopup(
                            movie?.movieId,
                            movie?.journeyType
                          )
                          : constantText.no_permission
                      }
                      className="mov-icon mov-view tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">
                        {movieConstants.copyMovie}
                      </div>
                    </div>
                  ) : null}
                  {movie?.contentState_populated?.title ==
                    constantText.contentConstants.unpublished && (
                      <span
                        className="edit tooltip-sec hand-cursor"
                        disabled={!canPublish}
                        onClick={() =>
                          this.handleConditionRoute("archive", movie?.movieId)
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
                  {movie?.contentState_populated?.title ==
                    constantText.contentConstants.archived && (
                      <span
                        className="edit tooltip-sec hand-cursor"
                        disabled={!canPublish}
                        onClick={() =>
                          this.handleConditionRoute("restore", movie?.movieId)
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
              {(movie?.MovieMapContents?.length > 0) && movie?.MovieMapContents[0]?.assignedContentId?.length ?
                <div
                  className="mov-link flex justify-content-end"
                >
                  <div
                    onClick={() => this.goToLinkedMovie(movie?.movieId)}
                    className="mov-link-btn"
                  >
                    <MovieIcon />{" "}
                    <span>
                      Link Movies +{movie?.MovieMapContents[0]?.assignedContentId?.length}
                    </span>
                  </div>
                </div>
                : ""}
            </div>
          </div>
          <div
            className={
              !movie?.showDetails ? "mov-link-info" : "mov-link-info show-info"
            }
          >
            <div className="mov-link-wrap">
              <div className="link-text flex align-items-center">
                <LinkIcon /> Link Content
              </div>
              <InlineLoader
                show={!(movie?.movieDetails && movie?.movieDetails?.length)}
              />
              {movie?.movieDetails && movie?.movieDetails?.length
                ? this.getMovieDetails(movie?.movieDetails)
                : ""}
            </div>
          </div>
          {movie?.MovieMapContents?.length > 0
            ? movie?.MovieMapContents.map((item, index) => {
              if (item?.type === "link" && item?.assignedContentId?.length) {
                return (
                  <div
                    key={index}
                    className="mov-btn-wrap flex justify-content-center"
                  >
                    {!movie?.showDetails ? (
                      <div
                        onClick={() =>
                          this.showHideDetails(
                            movie?.movieId,
                            movie,
                            i,
                            "show"
                          )
                        }
                        className="view-det-btn"
                      >
                        <span className={"view-t"}>View Details</span>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          this.showHideDetails(
                            movie?.movieId,
                            movie,
                            i,
                            "hide"
                          )
                        }
                        className="view-det-btn act-btn"
                      >
                        <span className={"hide-t"}>Hide Details</span>
                      </div>
                    )}
                  </div>
                );
              }
            })
            : null}
        </div>
      );
    });
    const MoreCountriesBlock = (
      <ul className="mov-con-list flex">
        {SelectedMovieMoreCountries.map((item, index) => (
          <li className="col-6 col-md-4" key={index}>
            {item}
          </li>
        ))}
      </ul>
    );

    return (
      <div className="d-wrap c-n">
        <div className="movie-list-sec">
          <BreadcrumbsComp className="" links={links} typography={typography} />
          <div className="user-head profile-head flex justify-content-between align-items-center mov-list-head">
            <div
              className="back-user-btn flex align-items-center auto-back-btn"
              onClick={() => this.handleRoute("/dashboard")}
            >
              <div className="text">
                <span>
                  <AngleLeftArrow />
                </span>
                <strong data-test="movie-heading-text">
                  <span>{constantText.movie_list_text}</span>
                </strong>
              </div>
            </div>
            <div className="s-form flex">
              <input
                type="text"
                autoComplete="off"
                name="searchString"
                className={isQueue ? "disable-f-btn auto-search" : "auto-search"}
                disabled={isQueue}
                placeholder={movieConstants.searchPlaceHolderText}
                value={searchString || ""}
                onChange={this.searchHandleChange}
                onKeyPress={this.handleKeyPress}
                onKeyUp={this.handleKeyUp}
              />
              <div className="filter-w">
                <ButtonField
                  color="secondary"
                  className={
                    isQueue
                      ? "disable-f-btn short-btn"
                      : sortDatakey
                        ? "short-btn current-active-filter"
                        : "short-btn"
                  }
                  disabled={isQueue}
                  Icon={SortIcon}
                  buttonText={"Sort"}
                  onClick={this.showHideSortDrawer}
                />
                <ButtonField
                  color="secondary"
                  className={
                    isQueue
                      ? "disable-f-btn filter-btn auto-filter-movie"
                      : filterDatakey
                        ? "filter-btn current-active-filter auto-filter-movie"
                        : "filter-btn auto-filter-movie"
                  }
                  disabled={isQueue}
                  Icon={FilterIcon}
                  buttonText={"Filters"}
                  onClick={this.showHideFilterDrawer}
                />
                <div className="filter-btn outline-drop-btn">
                  <DropDown
                    className="dropdown-btn auto-bulk-filling-movie"
                    buttonText={"Bulk Filling"}
                    open={openBulkDropdown}
                    handleOpenClose={this.handleOpenCloseBulkDropDown}
                    handleClose={this.handleCloseBulkDropdown}
                  >
                    <MenuItem
                      onClick={() => this.selectBulkFilling("Option 1")}
                    >
                      Bulk Option 1
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.selectBulkFilling("Option 2")}
                    >
                      Bulk Option 2
                    </MenuItem>
                  </DropDown>
                </div>
                <div
                  className={
                    canCreate()
                      ? "btn-create-user auto-create-movie"
                      : "btn-create-user disable-f-btn auto-create-movie"
                  }
                  onClick={() =>
                    canCreate()
                      ? this.handleRoute(constantText.movie_create_route)
                      : null
                  }
                >
                  {movieConstants.createMovieText}
                </div>
              </div>
            </div>
          </div>

          <div className="movies-list-wrap">
            <div className="row">
              <div className="col-md-4 col-lg-3">
                <LeftTabListing
                  disableTabs={changingTab}
                  openDropDown={openQuickDropdown}
                  handleOpenClose={this.handleOpenCloseQuickDropDown}
                  handleClose={this.handleCloseQuickDropdown}
                  handleDropDownItem={this.handleDropDownItem}
                  dropdownOptions={dropdownOptions}
                  options={tabOptions}
                  onChange={this.changeTab}
                  selectedTab={selectedTab}
                />
              </div>
              <div className="col-md-8 col-lg-9">
                {appliedFilters?.length > 0 && (
                  <AppliedFilter
                    className="tabs lang-tab filter-scroll"
                    options={appliedFilters}
                    listCount={movieCount}
                  />
                )}
                {page !== 1 && (
                  <BottomScrollListener
                    onBottom={() => {
                      this.nextCall();
                    }}
                  debounce={10000} offset={5}
                  />
                )}
                {isQueue ? (
                  <div
                    onClick={this.refreshQueue}
                    className="refresh-queue flex align-items-center"
                  >
                    <LightIcon />
                    {constantText.please_refresh_text}{" "}
                    <span className="ref-link">{constantText.refresh_pqueue_text}</span>
                  </div>
                ) : (
                  ""
                )}
                {movies}
                <InlineLoader
                  show={moviesList.length !== 0 && !isRequestIntiate}
                />
                {moviesList.length === 0 ? (
                  <div className="mov-l-box whitebox no-recode">
                    {isRequestIntiate && !changingTab ? (
                      searchMode ? (
                        searchString ? (
                          constantText.no_result_text
                        ) : (
                          <b>{constantText.no_record_found}</b>
                        )
                      ) : filterDatakey ? (
                        <span>
                          <b>{constantText.no_result_filter}</b>{" "}
                          {constantText.no_result_filter_text}
                        </span>
                      ) : (
                        <b>{constantText.no_record_found}</b>
                      )
                    ) : (
                      <InlineLoader
                        show={!isRequestIntiate || moviesList.length === 0}
                      />
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="sidebarBox">
            <Drawer
              anchor="right"
              open={openSortDrawer}
              onClose={this.showHideSortDrawer}
            >
              {this.getSortUi()}
            </Drawer>
            <Drawer
              open={showFilterDrawer}
              anchor="right"
              onClose={this.showHideFilterDrawer}
            >
              {this.getFiltersUi()}
            </Drawer>
            <Drawer
              open={showScheduledDrawer}
              anchor="right"
              onClose={this.showHideScheduledDrawer}
            >
              {this.getScheduledUi()}
            </Drawer>
          </div>
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
        <CommonModel className='ts-map-popup status-popup' state={showMapContentModal}
          showTitle={true} title={`Map Content`}
          showIcon={false}
          showDes={false} des={`${constantText.transcoding_popup_message} `}
          Form={<div className="popup-m-area">
            <div className="pop-meta" onClick={() => this.updatemapcontent(1)}>{constantText.transcoding_update_video_and_metadata}</div>
            <div className="pop-video-only" onClick={() => this.updatemapcontent(2)}>{constantText.transcoding_update_video_only}</div>
          </div>}
          showBtn1={true} btn1Text={'Ignore'} btn1Action={() => this.updatemapcontent(3)}
          showBtn2={false}
          handleClose={() => this.closeContentModal()}
        />
        <CommonModel className='popup-wrap status-popup' state={showMapContentConfirmation}
          showTitle={true} title={`Confirmation`}
          showIcon={false}
          showDes={false} des={constantText.transcoding_confirmation_popup}
          btn1Action={() => this.mapTranscodingContent(true)}
          btn2Action={() => this.closeContentTranscodingModal()}
          handleClose={() => this.closeContentTranscodingModal()}
        />
      </div>
    );
  }
}

export default MovieList;
