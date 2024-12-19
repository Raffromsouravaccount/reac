import React, { Component, Fragment } from "react";
import moment from "moment";
import BottomScrollListener from "react-bottom-scroll-listener";
import MenuItem from "@material-ui/core/MenuItem";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";

//Helper files
import { permissionObj } from "../../../_helpers/permission";
import { history } from "../../../_helpers/history";
import { DEFAULT_JSON, makeStringObjectOption } from "../../../_helpers/util";
import Config from "../../../Config/config";
import EpisodeCard from "../../Common/EpisodeLicenseCard/EpisodeCard";
import { LeftTabListing } from "../../Common/LeftTab/LeftTabListing";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import AppliedFilter from "../../Common/LeftTab/AppliedFilter";
import { LastModifiedBy } from "../../Common/LastModifiedBy/LastModifiedBy";
import BreadcrumbsComp from "../../../_components/Common/BreadCrumbs/BreadCrumbs";
import DropDown from "../../../_components/Common/DropDown/DropDown";
import RadioButton from "../../../_components/Common/RadioButton/RadioButton";
import ListLanguage from "../../../_components/Common/ListLanguage/ListLanguage";
import DatePicker from "../../Common/DatePicker/DatePicker";
import ButtonField from "../../Common/ButtonField/ButtonField";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import { CommonModel } from "../../Common/Model/CommonModel";
import { completeImagePath } from "../../Common/CommonFunction/CommonFuntion";
import { dateDiffDayCount, getSelectedGroup } from "../../../_helpers/util";
import { constantText } from "../../../_helpers/constants.text";
import { tvShowConstants } from "../Constants/tvshow.constants";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";
import { apiCalls, commonService } from "../../../_services/common.service";
import { createQuery } from "../../Common/CommonFunction/CommonFuntion";
//Json
import sideFilterJson from "../Schema/SideFilter.json";

//Css
import "../../../../public/css/Common/TvShowAccordion.css";
import "../../../../public/css/Common/Listing.css";
//icon
import WorldIcon from "images/world-icon.svg";
import ViewIcon from "images/view-icon.svg";
import CopyIcon from "images/copy-icon.svg";
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
import TvshowIcon from "images/movie-icon.svg";
import MarkDone from "images/tick.svg";
import DownArrow from "images/down-arrow.svg";
import DownDisableArrow from "images/down-disable-arrow.svg";
import UpArrow from "images/up-arrow.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import SortIcon from "images/sort-icon.svg";
import FilterIcon from "images/filter-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import LightIcon from "images/light-icon.svg";
import { filterService } from "../../../_services/filterService";

export const filterValidityCheck = (jsonform) => {
  let formIsValid = jsonform?.some(e => (e?.multiple ? e?.value?.length : e?.value));
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
class TvShowList extends Component {
  constructor(props) {
    super(props);
    const { selectedContentType, searchBtnText, searchPlaceholderText } =
      props.location?.state || {};
    const savedFilterData = filterService.getSavedFilterData({
      page: filterService.pages.tvShowListing, 
      sortingFilters: sideFilterJson.sortingFilters,
      statusTypes: sideFilterJson.StatusTypes,
      filterByDate: sideFilterJson.filterByDate,
      selectFilters: DEFAULT_JSON(JSON.parse(JSON.stringify(sideFilterJson.sideSelectFilters))),
      selectedContentType
    })
    this.state = {
      showsFilterQuery: {},
      showsCount: 0,
      blankDate: savedFilterData.blankDate,
      defaultFilter: {
        status: savedFilterData.statusTypes,
        startDate: savedFilterData.defaultStart,
        endDate: savedFilterData.defaultEnd,
      },
      appliedFilters: savedFilterData.appliedFilters ||
        this.getAppliedFilter(savedFilterData.selectFilters, savedFilterData.filterByDate, savedFilterData.statusTypes),
      isDefaultApplied: true,
      LanguageArr: [],
      isRequestIntiate: null,
      changingTab: false,
      maxPage: null,
      currentSortkey: savedFilterData.currentSortkey || 'lastModifiedOn',
      currentSortValue: savedFilterData.currentSortValue || 'desc',
      currentCloneId: null,
      currentShow: null,
      currentShowType: null,
      currentJourneyType: null,
      tvshowList: [],
      searchMode: false,
      contentStateName: savedFilterData.contentStateName || "All",
      searchBtnText: searchBtnText
        ? searchBtnText
        : constantText.tvShowsConstant.tvShow,
      searchPlaceholderText: searchPlaceholderText
        ? searchPlaceholderText
        : constantText.tvShowsConstant.searchPlaceholderTvShow,
      isQueue: false,
      quickFellingValue: "",
      modelForCountry: true,
      showScheduledDrawer: false,
      openSearchDropdown: false,
      openQuickDropdown: false,
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
      showHistoryData: null,
      sort: {
        sortingFilters: JSON.parse(JSON.stringify(savedFilterData.sortingFilters)),
        showReleaseDate: tvShowConstants.tvShowsReleaseDateVal,
        showUnpublished: tvShowConstants.tvShowsUnpublishedVal,
        showCreated: tvShowConstants.tvShowsCreatedVal,
        showSubmitedToWork: tvShowConstants.tvShowsSubmitedToWorkVal,
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
          text: constantText.tv_show_text.title,
          label: "primary",
        },
      ],
      language: "EN",
      published_history_arr: [],
      scheduled_history_arr: [],
      unpublishedHistory_arr: [],
      remainingCountry_arr: [],
      selectedContentType: savedFilterData.selectedContentType || tvShowConstants.tvshowType,
      SelectedMoreCountries: [],
      showModelForMore: false,
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
        updateType: 0,
        transcodingUid: "",
        externalId: "",
        contentType: "",
      },
      showMapContentConfirmation: false,
      updateType: null,
      transcodingUid: "",
      externalId: "",
    };
  }
  componentDidMount() {
    // this.resetDefaultFilter();
    this.getAllStatus();
    this.getAllLanguage();
    this.fetchLeftTabData();
    this.getAllShows(true);
    commonService.getLeftSideBarListing("tvShow").then((res) => {
      let dropDownData = res?.dropdowns || [];
      dropDownData = dropDownData?.map((data) => {
        const { permissionKey, permissionSubKey, permissionName } = data;
        return {
          ...data,
          disabled:
            !permissionObj?.[permissionKey]?.[permissionSubKey]?.[
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
    let defaultEnd = moment().add(10, 'days').format(constantText?.placeholder_date_Format);
    let defaultStart = moment(defaultEnd)
    .subtract(3, "months")
    .format(constantText?.placeholder_date_Format);
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
            endDate: defaultEnd,
          },
          isDefaultApplied: true,
          filterDatakey: true,
          tvshowList: [],
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
  };
  getAllStatus = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/ContentState`,
      "GET",
      {},
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ allStatus: response });
    }
  };
  getAllLanguage = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/Language`,
      "GET",
      {},
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ LanguageArr: response });
    }
  };
  setQueryData = async () => {
    const { filters, sort, queryData } = this.state;
    this.setState({
      showsFilterQuery: await {
        filters: filters.selectFilters,
        filterByDate: filters.filterByDate,
        sort: sort.sortingFilters,
        paramQuery: queryData,
      },
    });
  };
  fetchLeftTabData = async () => {
    const { selectedContentType } = this.state;
    let url = `${Config.tvshowCount}/${selectedContentType}`;
    let response = await apiCalls(url, "GET", null, `/tvshow`, false);
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
  setShowListData = (tvshowList) => {
    const { selectedContentType } = this.state;
    const licenseKey = {
      [tvShowConstants.seasonType]: "seasonLicenses",
      [tvShowConstants.episodeType]: "episodeLicenses",
      [tvShowConstants.tvshowType]: "tvShowLicenses",
    };
    const validUntil = {
      [tvShowConstants.seasonType]: "valid_until",
      [tvShowConstants.episodeType]: "validUntil",
      [tvShowConstants.tvshowType]: "validUntil",
    };
    tvshowList?.map((item) => {
      item["licenceExpDays"] = [];
      item.showDetails = false;
      if (item?.[licenseKey[selectedContentType]]?.length > 0) {
        item?.[licenseKey[selectedContentType]].map((licenceItem) => {
          if (licenceItem?.[validUntil[selectedContentType]]) {
            let days = dateDiffDayCount(
              licenceItem?.[validUntil[selectedContentType]]
            );
            let signDays = Math.sign(days);
            let expDays =
              dateDiffDayCount(
                licenceItem?.[validUntil[selectedContentType]]
              ) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      }
    });
    return tvshowList;
  };
  setNestedListData = (list, tvshow) => {
    list?.map((item) => {
      item["licenceExpDays"] = [];
      item.showDetails = false;
      if (item?.seasonLicenses?.length > 0) {
        item?.seasonLicenses.map((licenceItem) => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      } else if (tvshow?.tvShowLicenses?.length > 0) {
        tvshow?.tvShowLicenses.map((licenceItem) => {
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
    return list;
  };
  saveFilter = () => {
    const { selectedContentType, queryData, sort, filters, contentStateName, currentSortkey, currentSortValue, blankDate, filterDatakey, sortDatakey, appliedFilters } = this.state
    filterService.saveFilterData({
      page: filterService.pages.tvShowListing,
      contentState: queryData.contentState,
      contentStateName: contentStateName,
      searchString: queryData.searchString,
      sortingFilters: sort.sortingFilters,
      statusTypes: filters.filterByStatus,
      filterByDate: filters.filterByDate,
      selectFilters: filters.selectFilters,
      selectedContentType,
      currentSortkey,
      currentSortValue,
      blankDate,
      filterDatakey,
      sortDatakey,
      appliedFilters,
      formValidity: filters.formValidity
    });
  }
  getAllShows = async (count = false) => {
    this.saveFilter();
    await this.setQueryData();
    const { showsFilterQuery } = this.state;
    let { paramQuery } = showsFilterQuery;
    let { searchString } = paramQuery;
    paramQuery = searchString
      ? { ...paramQuery, searchString: searchString.trim() }
      : paramQuery;
    showsFilterQuery.paramQuery = paramQuery;
    if (count) {
      await this.fetchListTotal(showsFilterQuery);
    } else {
      await this.fetchShows(showsFilterQuery);
    }
  };
  fetchListTotal = async (params) => {
    const { selectedContentType, isRequestIntiate } = this.state;
    const query = createQuery(params);
    let listUrl =
      selectedContentType === "season"
        ? `/season${query ? query : ""}`
        : selectedContentType === "episode"
        ? `/episode${query ? query : ""}`
        : `${Config.tvshowList}/${selectedContentType}${query ? query : ""}`;
    let totalUrl =
      selectedContentType === "season"
        ? `/season/count${query ? query : ""}`
        : selectedContentType === "episode"
        ? `/episode/count${query ? query : ""}`
        : `${Config.tvshowListTotal}/${selectedContentType}${
            query ? query : ""
          }`;
    let urls = [totalUrl, listUrl];
    // map every url to the promise of the fetch
    let requests = urls.map((url) =>
      apiCalls(url, "GET", null, constantText.tvshow_list_route, false)
    );

    // Promise.all waits until all jobs are resolved
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      Promise.all(requests)
        .then((responses) => {
          if (responses[0] && responses[1]) {
            const count =
              selectedContentType === "season"
                ? responses[0]?.count
                : selectedContentType === "episode"
                ? responses[0]?.count
                : responses[0]?.count || null;
            const limit = constantText.search_limit;
            const Count = count ? count : 0;
            const Page = Count ? Math.ceil(Count / limit) : 1;
            this.setState(
              {
                showsCount: Count || 0,
                maxPage: Page || 0,
              },
              () => {
                this.setListResponse(responses[1]);
              }
            );
          } else {
            this.setState({
              showsCount: 0,
              maxPage: null,
              isRequestIntiate: true,
              changingTab: false,
              tvshowList: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  setEpisodeLicense = async (response) => {
    const { tvshowList, queryData } = this.state;
    // map every url to the promise of the fetch

    let episodesId = response.map((item) => item?.episodeId);
    episodesId = episodesId.join(",");

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
      response?.forEach((row, index) => {
        const find = res?.findIndex((e) => e?.episodeId === row?.episodeId);
        row["licenceExpDays"] = [];
        row.countries = res[find]?.countries;
        if (res[find]?.validUntil) {
          row.episodeLicenses = [
            {
              validFrom: res[find]?.validFrom,
              validUntil: res[find]?.validUntil,
            },
          ];
          let days = dateDiffDayCount(res[find]?.validUntil);
          let signDays = Math.sign(days);
          let expDays = dateDiffDayCount(res[find]?.validUntil) <= 5;
          if (signDays >= 0 && expDays) {
            row["licenceExpDays"].push(days);
          }
        }
      });
      const copyQueryData = { ...queryData };
      let newShowList = [];
      //If has showData increase page
      copyQueryData.page = copyQueryData.page + 1;
      newShowList = [...tvshowList, ...(response || [])];
      let stateObj = {
        isRequestIntiate: true,
        changingTab: false,
        tvshowList: newShowList,
        queryData: copyQueryData,
      };
      this.setState(stateObj);
    });
  };
  setListResponse = (response) => {
    const { tvshowList, queryData } = this.state;

    if (response) {
      const copyQueryData = { ...queryData };
      let newShowList = [];
      //If has showData increase page
      copyQueryData.page = copyQueryData.page + 1;
      newShowList = [...tvshowList, ...(response || [])];
      let stateObj = {
        isRequestIntiate: true,
        changingTab: false,
        tvshowList: this.setShowListData(newShowList),
        queryData: copyQueryData,
      };
      this.setState(stateObj);
    } else {
      this.setState({
        isRequestIntiate: true,
        changingTab: false,
        showsCount: 0,
        tvshowList: [],
      });
    }
  };
  fetchShows = async (params) => {
    const { isRequestIntiate, selectedContentType } = this.state;
    const query = createQuery(params);
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      let url = `${Config.tvshowList}/${selectedContentType}${
        query ? query : ""
      }`;
      if (selectedContentType === "season") {
        url = `/season${query ? query : ""}`;
      }
      if (selectedContentType === "episode") {
        url = `/episode${query ? query : ""}`;
      }
      //ListCall
      let response = await apiCalls(
        url,
        "GET",
        null,
        constantText.tvshow_list_route,
        false
      );
      this.setListResponse(response);
    }
  };
  nextCall = () => {
    const { maxPage, isRequestIntiate, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getAllShows();
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
      if (item?.active) {
        let obj = {};
        obj.label = "Status";
        obj.value = item?.label;
        Arr.push(obj);
      }
    });
    JSON.forEach((item) => {
      if (
        (item?.type === "dropdownAsync" ||
          item?.type === "SearchableWithCreate") &&
        item?.value
      ) {
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
    const { queryData, appliedFilters, sort, currentSortValue } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
      if (sortItem?.for?.toLowerCase() === tab?.displayName?.toLowerCase()) {
        sortItem.value = currentSortValue;
      } else {
        sortItem.value = "";
      }
    });
    const copyappliedFilters = appliedFilters.filter(
      (e) => e?.label !== "Status"
    );
    this.setState(
      {
        tvshowList: [],
        appliedFilters: copyappliedFilters,
        filterDatakey: copyappliedFilters?.length ? true : false,
        changingTab: true,
        contentStateName: tab.displayName,
        isQueue: tab.displayName === "Publishing Queue" ? true : false,
        isUnpublished: tab.displayName === "Unpublished" ? true : false,
        isArchived: tab.displayName === "Archived" ? true : false,
        selectedTab: index,
        sort: {
          ...sort,
          sortingFilters: sortingFilters,
        },
        queryData: await {
          ...queryData,
          page: 1,
          contentState: tab.id,
        },
      },
      () => {
        this.getAllShows(true);
      }
    );
  };
  showHideStatePopup = (currentShow) => {
    const { showModelForArchive } = this.state;
    this.setState({
      currentShow,
      showModelForArchive: !showModelForArchive,
    });
  };
  showHideRestorePopup = (currentShow) => {
    const { showModelForRestore } = this.state;
    this.setState({
      currentShow,
      showModelForRestore: !showModelForRestore,
    });
  };
  showHideClonePopup = (currentShow, type = "tvshow", journey) => {
    const { showModelForClone } = this.state;
    const ID = {
      tvshow: "tvShowId",
      season: "seasonId",
      episode: "episodeId",
    };
    if (currentShow) {
      this.setState({
        currentShow,
        currentCloneId: currentShow[ID[type]],
        currentShowType: type,
        currentJourneyType: journey,
        showModelForClone: !showModelForClone,
      });
    } else {
      this.setState({
        currentShow: null,
        currentShowType: null,
        currentJourneyType: null,
        currentCloneId: null,
        showModelForClone: !showModelForClone,
      });
    }
  };
  cloneContent = async () => {
    const { match } = this.props;
    const {
      currentShow,
      currentCloneId,
      currentShowType,
      currentJourneyType,
      showModelForClone,
    } = this.state;
    const cloneUrl = {
      tvshow: `${Config?.tvshowClone}/${currentCloneId}`,
      season: `${Config?.seasonClone}/${currentCloneId}`,
      episode: Config?.episodeClone,
    };
    const url = `${cloneUrl[currentShowType]}`;
    const res = await apiCalls(url, "POST", {}, match?.url, true);
    if (res) {
      const clonedVideo = res;
      let tvShowroute =
        currentJourneyType == "3"
          ? "/tvshow/single/edit"
          : currentJourneyType == "2"
          ? "/tvshow/quick/edit"
          : "/tvshow/edit";
      let seasonRoute =
        currentJourneyType == "3"
          ? `/tvshow/view/${currentShow?.tvShowId}/season/single/edit`
          : currentJourneyType == "2"
          ? `/tvshow/view/${currentShow?.tvShowId}/season/quick/edit`
          : `/tvshow/view/${currentShow?.tvShowId}/season`;

      this.props.history.push({
        pathname: `${
          currentShowType === "tvshow" ? tvShowroute : seasonRoute
        }/${clonedVideo}`,
      });
    } else {
      this.setState({ showModelForClone: !showModelForClone });
    }
  };
  restoreinDraft = async () => {
    const { tabOptions, currentShow } = this.state;
    let contentId = currentShow.contentId;
    const archiveTabIndex = tabOptions.findIndex(
      (tab) => tab.label === "Draft"
    );
    let url = `${Config.restore}/${contentId}`;
    let response = await apiCalls(url, "PUT", {});
    if (response) {
      this.changeTab(tabOptions[archiveTabIndex], archiveTabIndex);
    }
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
        tvshowList: [],
        showsCount: 0,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.checkIsDefaultApplied();
        this.getAllShows(true);
      }
    );
  };
  showHideSortDrawer = () => {
    let { openSortDrawer } = this.state;
    this.setState({ openSortDrawer: !openSortDrawer });
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
    if (
      checkFilter !== -1 &&
      currentSortkey === sortingFilters[checkFilter]?.sortValue &&
      currentSortValue === sortingFilters[checkFilter]?.value
    ) {
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
    this.selectQuickFilling(`/tvshow/${option.title}/create`);
  };
  selectQuickFilling = (route) => {
    history.push(route);
  };

  searchHandleChange = async (event) => {
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
        this.getAllShows(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  clearSortFilter = () => {
    let { sort, queryData } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
      if (sortItem?.display && sortItem?.sortValue !== "dateZee5Published") {
        sortItem.value = "desc";
      } else {
        sortItem.value = "";
      }
    });
    this.setState(
      {
        tvshowList: [],
        currentSortValue: "desc",
        currentSortkey: "lastModifiedOn",
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
        this.getAllShows();
      }
    );
  };

  applySortFilter = () => {
    let { queryData, sort } = this.state;
    let { sortingFilters } = sort;
    let index = sortingFilters.findIndex((sortItem) => sortItem?.value);
    this.setState(
      {
        currentSortkey: sortingFilters[index]?.sortValue,
        currentSortValue: sortingFilters[index]?.value,
        tvshowList: [],
        sortDatakey: true,
        searchMode: false,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllShows();
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
  goToLinkedShows = (id) => {
    history.push(`/tvshow/linked-shows/${id}`);
  };
  checkDefaultDate = (start, end, data) => {
    const { date } = data;
    const { startDate, endDate } = date;
    if (startDate === start && endDate === end) {
      return true;
    } else {
      return false;
    }
  };

  showHideScheduledDrawer = () => {};
  viewShowHandler = (show) => {
    const { tvShowId, journeyType } = show;
    this.props.history.push({
      pathname: `/tvshow/view/${tvShowId}`,
      state: { journeyType: journeyType },
    });
  };
  viewSeasonHandler = (show, isNested = false) => {
    const { match } = this.props;
    const { id } = match?.params;
    let stateMode = "list";
    if (isNested) {
      stateMode = "nestedlist";
    }
    const { seasonId, journeyType, tvShowId } = show;
    this.props.history.push({
      pathname: `/tvshow/view/${tvShowId}/season/view/${seasonId}`,
      state: { journeyType: journeyType, stateMode },
    });
  };
  viewEpisodeHandler = (show) => {
    const { seasonId, episodeJourney, tvShowId, episodeId } = show;
    this.props.history.push({
      pathname: `/tvshow/view/${tvShowId}/season/view/${seasonId}/episode/view/${episodeId}`,
      state: { journeyType: episodeJourney, stateMode: "list" },
    });
  };
  openSeheduledHistory = async (tvshow, type) => {
    let { showScheduledDrawer, selectedContentType } = this.state;
    const TYPE = { tvshow: "tvShow", season: "season", episode: "episode" };
    const ID = { tvshow: "tvShowId", season: "seasonId", episode: "episodeId" };
    this.setState({
      showScheduledDrawer: !showScheduledDrawer,
      scheduledDrawerLoading: true,
    });

    let url = `${Config.workflowHistory}/${TYPE[selectedContentType]}/${
      tvshow[ID[selectedContentType]]
    }`;
    let remainingUrl = `${TYPE[selectedContentType]}/licenseCountries/${
      tvshow[ID[selectedContentType]]
    }`;

    if (selectedContentType === tvShowConstants.episodeType) {
      remainingUrl = `${TYPE[selectedContentType]}/licenseCountries/${
        tvshow[ID[selectedContentType]]
      }/${tvshow["seasonId"]}/${tvshow["tvShowId"]}`;
    }

    if (selectedContentType === tvShowConstants.seasonType) {
      remainingUrl = `${TYPE[selectedContentType]}/licenseCountries/${
        tvshow[ID[selectedContentType]]
      }/${tvshow?.tvShowId}`;
    }

    if (
      selectedContentType === tvShowConstants.tvshowType &&
      type === tvShowConstants.seasonType
    ) {
      url = `${Config.workflowHistory}/${TYPE[tvShowConstants.seasonType]}/${
        tvshow["id"]
      }`;
      remainingUrl = `${TYPE[tvShowConstants.seasonType]}/licenseCountries/${
        tvshow["id"]
      }/${tvshow?.tvShowId}`;
    }

    let response = await apiCalls(url, "GET", {}, "/tvshow", false);
    let responseRemaining = await apiCalls(
      remainingUrl,
      "GET",
      {},
      "/tvshow",
      false
    );
    let obj = {};
    if (response) {
      obj = {
        ...obj,
        showHistoryData: response,
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
      showHistoryData: {},
      showScheduledDrawer: false,
    });
  };
  handleConditionRoute = (view, id) => {
    let canArchive = permissionObj?.tvShows?.archive?.canUpdate();
    let canPublish = permissionObj?.tvShows?.publish?.canCreate();

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
    const { selectedContentType } = this.state;
    const TYPE = { tvshow: "tvShow", season: "season", episode: "episode" };
    // Archive to Draft
    if (
      action &&
      (shallowModel.detail?.view === "archive" ||
        shallowModel.detail?.view === "restore")
    ) {
      let { language, allStatus } = this.state;
      const cStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.unpublished
          : constantText.tvShowsConstants.archived;
      const nStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.archived
          : constantText.tvShowsConstants.draft;
      const currentStatus = allStatus.find((item) => item?.title === cStatus);
      const nextState = allStatus.find((item) => item?.title === nStatus);
      let data = {
        fromState: currentStatus?.id,
        toState: nextState?.id,
        contentType: TYPE[selectedContentType],
        contentData: {},
      };
      let tabName =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.archived
          : constantText.tvShowsConstants.draft;
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
      `/tvshow`,
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
    const { showHistoryData, remainingCountry_arr, scheduledDrawerLoading } =
      this.state;

    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">
            {tvShowConstants.publishedScheduledHistory}
          </div>
          <div className="side-close-btn" onClick={this.closeSeheduledHistory}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="history-data scrollBar scroll-Y">
          <div className="box">
            <h6 className="title">{tvShowConstants.unpublishedHistory}</h6>
            {!scheduledDrawerLoading && (
              <div className="text-row flex">
                <div className="label">{tvShowConstants.groupCountryLabel}</div>
                {showHistoryData?.unpublish &&
                showHistoryData?.unpublish?.country?.length > 0
                  ? showHistoryData?.unpublish?.country
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
            <h6 className="title">{tvShowConstants.publishedHistoy_text}</h6>
            {!scheduledDrawerLoading && (
              <div className="text-row flex">
                <div className="label">{tvShowConstants.groupCountryLabel}</div>
                {showHistoryData?.publish &&
                showHistoryData?.publish?.country?.length > 0
                  ? showHistoryData?.publish?.country
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
            <h6 className="title">{tvShowConstants.scheduledHistory_text}</h6>
            {!scheduledDrawerLoading && showHistoryData?.schedule?.length > 0
              ? showHistoryData?.schedule?.map((schedule, index) => (
                  <div key={index}>
                    <h6 className="title">{`${tvShowConstants.schedule_text} ${
                      index + 1
                    }`}</h6>
                    <div className="text-row flex">
                      <div className="label">
                        {tvShowConstants.groupCountryLabel}
                      </div>
                      {schedule?.country && schedule?.country?.length > 0
                        ? schedule?.country
                            ?.map((data) => data?.title)
                            .join(", ")
                        : "NA"}
                    </div>
                    <div className="text-row flex">
                      <div className="label">{tvShowConstants.date_text}</div>
                      <div className="text">
                        {schedule?.scheduledTime
                          ? moment(schedule?.scheduledTime).format(
                              constantText.date_format_without_time
                            )
                          : "NA"}
                      </div>
                    </div>
                    <div className="text-row flex">
                      <div className="label">{tvShowConstants.time_text}</div>
                      <div className="text">
                        {schedule?.scheduledTime
                          ? moment(schedule?.scheduledTime).format(
                              constantText.time_format_lt
                            )
                          : "NA"}
                      </div>
                    </div>
                  </div>
                ))
              : !scheduledDrawerLoading && (
                  <div className="text-row flex">
                    <div className="label">
                      {tvShowConstants.scheduled_text}
                    </div>
                    <div className="text">{"NA"}</div>
                  </div>
                )}
            {scheduledDrawerLoading && (
              <InlineLoader show={scheduledDrawerLoading} />
            )}
          </div>

          <div className="box">
            <h6 className="title">{tvShowConstants.remaining_country_text}</h6>
            {!scheduledDrawerLoading && (
              <div className="text-row flex">
                <div className="label">{tvShowConstants.groupCountryLabel}</div>
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
  handleSearchableInput = async (value, index) => {
    let { filters } = this.state;
    let { selectFilters } = filters;
    let url =
      selectFilters[index].name == "tags"
        ? `${Config.masterTags}?title=${value}`
        : `${Config.castnamesUrl}?castName=${value}`;
    let response = (await apiCalls(url, "GET", {}, `/tvshow`, false)) || [];
    selectFilters[index]["data"] = response;
    this.setState((prevState) => ({
      filters: {
        ...filters,
        selectFilters,
      },
    }));
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
          className={`bystatus-f-cta flex align-items-center justify-content-center${
            status.active ? " s-active" : ""
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
                  data-test="tvshows-handleDateChange"
                  minDateValue={
                    (filterDate.date.endDate &&
                      moment(filterDate.date.endDate).subtract(
                        constantText.filterDateRangeMonthCount,
                        "months"
                      )) ||
                    undefined
                  }
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
                  maxDateValue={
                    (filterDate.date.startDate &&
                      moment(filterDate.date.startDate).add(constantText.filterDateRangeMonthCount, "months")) ||
                    undefined
                  }
                  onChange={(e) =>
                    this.handleDateChange("endDate", i, e)
                  }
                  className="zee-input-field filter-drower-custom"
                />
              </div>
            </div>
            <div className="date-info-msg">
              {constantText?.max_3_months_date}
            </div>
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
          <div className="title">{constantText.filters_header_text}</div>
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
                setSelectDataArr={this.setSelectDataArr}
                handleAutoCreateInput={this.handleSearchableInput}
                selectGroup={this.selectCountryGroup}
                onChange={this.filterChange}
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
            buttonText={constantText.clear_text}
            data-test="tvshows-clearFilter"
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
          name="showReleaseDate"
          areaLabel="showReleaseDate"
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
          <div className="title">{tvShowConstants.sort_text}</div>
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
              data-test="tvshows-applySortFilter"
              onClick={() => {
                this.showHideSortDrawer();
                this.applySortFilter();
              }}
            />
            <ButtonField
              color="secondary"
              className="cancle-btn"
              disabled={this.checkvalidation()}
              buttonText={constantText.clear_text}
              data-test="tvshows-clearSortFilter"
              onClick={this.clearSortFilter}
            />
          </div>
        </div>
      </div>
    );
  };
  fetchAssignedAssets = async (tvshowId) => {
    const url = `${Config.tvshowSeason}/${tvshowId}`;
    //ListCall
    let response = await apiCalls(
      url,
      "GET",
      null,
      constantText.tvshow_list_route,
      false
    );
    return response;
  };
  viewFirstChild = async (index, TvshowAsset, tvshow) => {
    const { tvshowList } = this.state;
    const copyTvshowList = [...tvshowList];
    const copyTvshow = copyTvshowList[index];
    const isOpen = !!copyTvshow?.isOpened;
    if (isOpen === false && !!!copyTvshow?.childAssets?.length) {
      copyTvshow.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(TvshowAsset);
      if (res) {
        copyTvshow.childAssets = this.setNestedListData(res, tvshow);
        this.setState({
          tvshowList: copyTvshowList,
        });
      }
    } else {
      copyTvshow.isOpened = !isOpen;
      this.setState({
        tvshowList: copyTvshowList,
      });
    }
  };
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  };
  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      let searchMode = searchString.length === 0 ? false : true;
      if (searchString.trim().length >= 3 || searchString.length === 0) {
        this.setState(
          {
            tvshowList: [],
            searchMode,
            queryData: {
              ...queryData,
              page: 1,
            },
          },
          () => {
            this.getAllShows(true);
          }
        );
      }
    }, 1000);
  };
  toggleMorePopup = (countryArr, forCountry = true) => {
    const newArr = countryArr.slice(2, countryArr.length);
    this.setState({
      SelectedMoreCountries: newArr,
      showModelForMore: true,
      modelForCountry: forCountry,
    });
  };
  showHideMorePopup = () => {
    const { showModelForMore } = this.state;
    this.setState({
      showModelForMore: !showModelForMore,
    });
  };
  handleOpenSearchDropDown = () => {
    let { openSearchDropdown } = this.state;
    this.setState({ openSearchDropdown: !openSearchDropdown });
  };
  handleSearchRoute = async (searchBtnText, type) => {
    let {
      openSearchDropdown,
      queryData,
      appliedFilters,
      filters,
      sort
    } = this.state;

    let updateObj = {};
    if (appliedFilters?.length) {
      const subTypeIndex = appliedFilters.findIndex(
        (e) =>
          (type === constantText.tvShowsConstant.episodes &&
            e.label === "TvShow Broadcasted") ||
          e.label === "TvShow Sub Type" ||
          e.label === "Episode Sub Type"
      );
      if (subTypeIndex >= 0) {
        appliedFilters.splice(subTypeIndex, 1);
      }
      updateObj.appliedFilters = appliedFilters;
      updateObj.filterDatakey = !!appliedFilters.length;
    }

    const { selectFilters,filterByDate } = filters;
    const { sortingFilters } = sort;

    const episodeSubtype = selectFilters.findIndex(
      (e) => e.path === "/master/EpisodeSubType"
    );
    const showSubtype = selectFilters.findIndex(
      (e) => e.path === "/master/TvShowSubType"
    );
    const broadcastIndex = selectFilters.findIndex(
      (e) => e.name === "broadcastState"
    );
    updateObj.openSearchDropdown = !openSearchDropdown;
    if (searchBtnText !== type) {
      this.setState({ changingTab: true });
      //Reset List Data Start
      const copyQueryData = { ...queryData };
      copyQueryData.page = 1;
      updateObj.showsCount = 0;
      updateObj.maxPage = 0;
      updateObj.queryData = copyQueryData;
      updateObj.tvshowList = [];
      updateObj.searchBtnText = type;
      //Reset List Data End
      if (type === constantText.tvShowsConstant.tvShow) {
        //Change sortValue -> telecastDate
        sortingFilters?.forEach(sortItem => {
          if(sortItem?.for === ""){
            sortItem.sortValue = "dateZee5Published";
            sortItem.label = "Main Release Date";
          }
        })
        //Change sortValue -> telecastDate
        updateObj.searchPlaceholderText =
          constantText.tvShowsConstant.searchPlaceholderTvShow;
        updateObj.selectedContentType = tvShowConstants.tvshowType;
        selectFilters[episodeSubtype].display = false;
        selectFilters[episodeSubtype].value = null;
        selectFilters[broadcastIndex].label = "TV Show Broadcast State";
        selectFilters[broadcastIndex].display = true;
        selectFilters[showSubtype].display = true;
      }
      if (type === constantText.tvShowsConstant.seasons) {
          //Change sortValue -> telecastDate
          sortingFilters?.forEach(sortItem => {
            if(sortItem?.for === ""){
              sortItem.sortValue = "dateZee5Published";
              sortItem.label = "Main Release Date";
            }
          })
          //Change sortValue -> telecastDate
        updateObj.searchPlaceholderText =
          constantText.tvShowsConstant.searchPlaceholderSeasons;
        updateObj.selectedContentType = tvShowConstants.seasonType;
        selectFilters[episodeSubtype].display = false;
        selectFilters[showSubtype].display = false;
        selectFilters[broadcastIndex].label = "Season Broadcast State";
        selectFilters[broadcastIndex].display = true;
        selectFilters[episodeSubtype].value = null;
        selectFilters[showSubtype].value = null;
      }
      if (type === constantText.tvShowsConstant.episodes) {
        //Change sortValue -> telecastDate
        sortingFilters?.forEach(sortItem => {
          if(sortItem?.for === ""){
            sortItem.sortValue = "telecastDate";
            sortItem.label = "Original Telecast Date"
          }
        })
        //Change sortValue -> telecastDate

        updateObj.searchPlaceholderText =
        constantText.tvShowsConstant.searchPlaceholderEpisodes;
        updateObj.selectedContentType = tvShowConstants.episodeType;
        selectFilters[episodeSubtype].display = true;
        selectFilters[showSubtype].display = false;
        selectFilters[broadcastIndex].display = false;
        selectFilters[broadcastIndex].value = null;
        selectFilters[showSubtype].value = null;
      }
      updateObj.filters = {
        ...filters,
        filterByDate,
        selectFilters,
      };
      updateObj.sort = {
        ...sort,
        sortingFilters
      }
      this.setState(updateObj, () => {
        this.fetchLeftTabData();
        this.getAllShows(true);
      });
    }
  };
  handleRouteExpiredLink = (show, isNested = false) => {
    const { selectedContentType } = this.state;
    const { journeyType } = show;
    let route;
    let tab;
    let stateMode = "list";
    if (selectedContentType === tvShowConstants.seasonType) {
      const { seasonId, tvShowId } = show;
      route = `/tvshow/view/${tvShowId}/season/view/${seasonId}`;
      tab = journeyType == "2" ? 1 : 2;
    } else if (selectedContentType === tvShowConstants.tvshowType) {
      const { tvShowId } = show;
      route = `${constantText?.tvshow_view_route}/${tvShowId}`;
      tab = journeyType == "2" ? 1 : 2;
    } else if (selectedContentType === tvShowConstants.episodeType) {
      const { seasonId, episodeId, episodeJourney, tvShowId } = show;
      route = `/tvshow/view/${tvShowId}/season/view/${seasonId}/episode/view/${episodeId}`;
      tab = episodeJourney == "1" ? 3 : 2;
    }
    if (isNested) {
      const { id, tvShowId } = show;
      route = `/tvshow/view/${tvShowId}/season/view/${id}`;
      tab = journeyType == "2" ? 1 : 2;
      stateMode = "nestedlist";
    }
    history.push({
      pathname: route,
      state: {
        journeyType: journeyType,
        selectedTab: tab,
        stateMode,
      },
    });
  };
  viewEpisodeList = (tvshowId, seasonId) => {
    const route = `/tvshow/view/${tvshowId}/season/view/${seasonId}/episode`;
    history.push({ pathname: route });
  };
  refreshQueue = () => {
    const { queryData } = this.state;
    this.setState(
      {
        tvshowList: [],
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllShows(true);
      }
    );
  };

  addContent = (externalId, contentType, transcodingUid) => {
    this.setState({
      addContentData: {
        ...this.state.addContentData,
        externalId: externalId,
        contentType: contentType,
        transcodingUid: transcodingUid,
        updateType: 1,
      },
      showMapContentModal: !this.state.showMapContentModal,
      transcodingUid: transcodingUid,
      externalId: externalId,
    });
  };

  mapTranscodingContent = async (value) => {
    const url = `${Config.transcoding}`;
    let data = { ...this.state.addContentData };
    //ListCall
    let response = await apiCalls(url, "PUT", data);
    if (response && value) {
      this.refreshQueue();
      this.setState({
        showMapContentModal: !this.state.showMapContentModal,
      });
    } else {
      this.setState({
        showMapContentModal: !this.state.showMapContentModal,
      });
    }
  };

  closeContentModal = () => {
    this.setState({
      showMapContentModal: !this.state.showMapContentModal,
    });
  };

  render() {
    let {
      isQueue,
      isRequestIntiate,
      SelectedMoreCountries,
      selectedContentType,
      showModelForMore,
      changingTab,
      searchMode,
      tvshowList,
      showsCount,
      LanguageArr,
      modelForCountry,
      isUnpublished,
      isArchived,
      links,
      typography,
      openQuickDropdown,
      openSortDrawer,
      showFilterDrawer,
      tabOptions,
      dropdownOptions,
      selectedTab,
      queryData,
      showScheduledDrawer,
      searchPlaceholderText,
      searchBtnText,
      openSearchDropdown,
      showModelForArchive,
      showModelForRestore,
      showModelForClone,
      filterDatakey,
      appliedFilters,
      sortDatakey,
      model,
      showMapContentModal
    } = this.state;
    let { searchString, page } = queryData;
    let { canCreate } = permissionObj?.tvShows?.createShow;
    let canPublish = permissionObj?.tvShows?.publish?.canCreate();
    let canArchive = permissionObj?.tvShows?.archive?.canUpdate;
    let canClone = permissionObj?.tvShows?.clone?.canUpdate;
    let canCloneSeason = permissionObj?.season?.clone?.canUpdate;
    let canViewLicense = permissionObj?.tvShows?.licenceModule?.canView();

    const tvshows = tvshowList.map((tvshow, i) => {
      const ShowLicensesCountries = tvshow?.countries
        ? tvshow?.countries?.split(",")
        : [];
      return (
        <div className="mov-l-box whitebox" key={i}>
          {selectedContentType === tvShowConstants.tvshowType && (
            <div className="nested-view">
              <div className="parent">
                {tvshow?.season && tvshow?.season?.length ? (
                  <div
                    data-test="tvshow-child-arrow"
                    className={`icon auto-down-arrow-${i}`}
                    onClick={() =>
                      this.viewFirstChild(i, tvshow?.tvShowId, tvshow)
                    }
                  >
                    {tvshow?.isOpened ? <UpArrow /> : <DownArrow />}
                  </div>
                ) : (
                  <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">
                      {constantText.collection_no_child_text}
                    </div>
                  </div>
                )}
                <div className="pos-rel">
                  {tvshow?.journeyType && (
                    <div className="m-tag">
                      {constantText?.journeyType[tvshow?.journeyType]}
                    </div>
                  )}
                  {tvshow?.licenceExpDays?.length > 0 && (
                    <div
                      className={
                        canViewLicense
                          ? "license-badge"
                          : "license-badge tooltip-sec nopermission"
                      }
                      onClick={() =>
                        canViewLicense
                          ? this.handleRouteExpiredLink(tvshow)
                          : () => {}
                      }
                    >
                      {Math.min.apply(null, tvshow?.licenceExpDays) === 0
                        ? constantText.license_expires_today
                        : `${constantText.license_expires_in}  ${Math.min.apply(
                            null,
                            tvshow?.licenceExpDays
                          )}  ${constantText.day_s_text}`}
                      {!canViewLicense ? (
                        <div className="tooltip-box">
                          {constantText?.tool_tip_noPermission}
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="mov-info-box flex justify-content-between">
                    <div className="left-area flex">
                      <div className="movie-img">
                        <img
                          src={
                            tvshow?.TvShowImages?.[
                              tvshow?.TvShowImages?.length - 1
                            ]?.imageDetails?.url
                              ? completeImagePath(
                                  tvshow?.externalId,
                                  "list",
                                  tvshow?.TvShowImages?.[
                                    tvshow?.TvShowImages?.length - 1
                                  ]?.imageDetails?.url,
                                  tvshow?.TvShowImages?.[
                                    tvshow?.TvShowImages?.length - 1
                                  ]?.imageDetails?.resolution
                                )
                              : "images/no-image.svg"
                          }
                          alt={
                            tvshow?.externalId ? tvshow?.externalId : "no image"
                          }
                        />
                      </div>
                      <div className="info">
                        <div className="mov-detail flex align-items-center">
                          <h4>{tvshow?.title ? tvshow?.title : "NA"}</h4>
                          <BadgeBox
                            status={tvshow?.subtype_populated?.title}
                            dot={true}
                            color={"blue"}
                          />
                          {selectedTab == 0 && (
                            <BadgeBox
                              status={tvshow?.contentState_populated?.title}
                            />
                          )}
                          {/* <span className="s-badge red invalid-text">
                            *Invalid Licensing
                          </span> */}
                        </div>
                        {/* <div className="global-title status-text flex">
                          <span className="label">Global Title</span>
                          <span className="text">
                            {tvshow?.gloaltitle ? tvshow?.gloaltitle : "NA"}
                          </span>
                        </div> */}
                        <div className="time-loc-row flex align-items-center">
                          <span className="loc">
                            <WorldIcon />{" "}
                            {ShowLicensesCountries?.length > 0
                              ? ShowLicensesCountries?.length > 2
                                ? ShowLicensesCountries[0] +
                                  ", " +
                                  ShowLicensesCountries[1]
                                : ShowLicensesCountries.join(", ")
                              : "NA"}
                            {ShowLicensesCountries?.length > 2 ? (
                              <a
                                onClick={() =>
                                  this.toggleMorePopup(ShowLicensesCountries)
                                }
                              >
                                {` +${ShowLicensesCountries.length - 2}`}
                              </a>
                            ) : null}
                          </span>
                          {LanguageArr.length ? (
                            <ListLanguage
                              togglePopup={this.toggleMorePopup}
                              audioLanguages={LanguageArr}
                              languageIds={
                                tvshow?.audioLanguages
                                  ? tvshow?.audioLanguages
                                  : []
                              }
                            />
                          ) : null}

                          {selectedTab == 0 ||
                          selectedTab == 9 ||
                          selectedTab == 2 ||
                          selectedTab == 3 ||
                          selectedTab == 6 ||
                          selectedTab == 4
                            ? tvshow?.contentState_populated?.title.toLowerCase() !==
                                "submitted to review" &&
                              tvshow?.contentState_populated?.title.toLowerCase() !==
                                "all" &&
                              tvshow?.contentState_populated?.title.toLowerCase() !==
                                "draft" &&
                              tvshow?.contentState_populated?.title.toLowerCase() !==
                                "need work" &&
                              tvshow?.contentState_populated?.title.toLowerCase() !==
                                "archived" && (
                                <span
                                  className="pub-history"
                                  data-test="tvshows-openSeheduledHistory"
                                  onClick={() =>
                                    this.openSeheduledHistory(tvshow, i)
                                  }
                                >
                                  {tvshow?.contentState_populated?.title.toLowerCase() ===
                                  "unpublished"
                                    ? "Unpublished History"
                                    : "Published and Scheduled History"}
                                </span>
                              )
                            : ""}
                        </div>
                        <div className="note-list-title status-text flex">
                          <span className="label">
                            {constantText.note_text}
                          </span>
                          <span className="text">{tvshow?.note || "NA"}</span>
                        </div>
                        <LastModifiedBy
                          data={tvshow || {}}
                          statusText={tabOptions[selectedTab]?.statusText || ""}
                        />
                        {tvshow?.transcodingUpdate && (
                          <div className="flex align-items-center tra-update">
                            <span className="mark-green flex align-items-center justify-content-center">
                              <MarkDone />
                            </span>{" "}
                            Transcoding Update
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="right-area">
                      <div className="mov-icon-sec flex align-items-center  justify-content-between">
                        <div className="mov-id">
                          <span className="text-id">
                            {constantText.external_id_text}
                          </span>
                          <span className="num-id">
                            {tvshow?.externalId ? tvshow?.externalId : "NA"}
                          </span>
                        </div>
                        <div className="mov-cta-wrap flex">
                          <div
                            onClick={() => this.viewShowHandler(tvshow)}
                            className={`mov-icon mov-view tooltip-sec auto-view-${i}`}
                          >
                            <ViewIcon />
                            <div className="tooltip-box">
                              {tvShowConstants.viewTvshows}
                            </div>
                          </div>
                          {tvshow?.contentState_populated?.title !==
                            tvShowConstants.archived && (
                            <div
                              onClick={() =>
                                canClone()
                                  ? this.showHideClonePopup(
                                      tvshow,
                                      "tvshow",
                                      tvshow?.journeyType
                                    )
                                  : constantText.no_permission
                              }
                              className={`mov-icon mov-view tooltip-sec auto-clone-${i}`}
                            >
                              <CopyIcon />
                              <div className="tooltip-box">
                                {tvShowConstants.copyTvshows}
                              </div>
                            </div>
                          )}
                          {tvshow?.contentState_populated?.title ==
                            tvShowConstants.unpublished && (
                            <span
                              className="edit tooltip-sec hand-cursor"
                              disabled={!canPublish}
                              onClick={() =>
                                this.handleConditionRoute(
                                  "archive",
                                  tvshow?.tvShowId
                                )
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
                          {tvshow?.contentState_populated?.title ==
                            tvShowConstants.archived && (
                            <span
                              className="edit tooltip-sec hand-cursor"
                              disabled={!canPublish}
                              onClick={() =>
                                this.handleConditionRoute(
                                  "restore",
                                  tvshow?.tvShowId
                                )
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
                      {tvshow?.TvShowMapContents?.length > 0 &&
                      tvshow?.TvShowMapContents[0]?.assignedContentId
                        ?.length ? (
                        <div className="mov-link flex justify-content-end">
                          <div
                            onClick={() =>
                              this.goToLinkedShows(tvshow?.tvShowId)
                            }
                            className={`mov-link-btn auto-mov-link-btn`}
                          >
                            <TvshowIcon />{" "}
                            <span>
                              {tvShowConstants.LinkShow} +
                              {
                                tvshow?.TvShowMapContents[0]?.assignedContentId
                                  ?.length
                              }
                            </span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Child start */}
              {tvshow?.isOpened && tvshow?.childAssets?.length
                ? tvshow?.childAssets.map((firstChild, firstIndex) => {
                    const ShowLicensesChildCountries = firstChild?.countries
                      ? firstChild?.countries?.split(",")
                      : tvshow?.countries
                      ? tvshow?.countries?.split(",")
                      : [];
                    return (
                      <div key={firstIndex} className="child pos-rel">
                        {firstChild?.journeyType && (
                          <div className="m-tag">
                            {constantText?.journeyType[firstChild?.journeyType]}
                          </div>
                        )}

                        {firstChild?.licenceExpDays?.length > 0 && (
                          <div
                            className={
                              canViewLicense
                                ? "license-badge"
                                : "license-badge tooltip-sec nopermission"
                            }
                            onClick={() =>
                              canViewLicense
                                ? this.handleRouteExpiredLink(firstChild, true)
                                : () => {}
                            }
                          >
                            {Math.min.apply(
                              null,
                              firstChild?.licenceExpDays
                            ) === 0
                              ? constantText.license_expires_today
                              : `${
                                  constantText.license_expires_in
                                }  ${Math.min.apply(
                                  null,
                                  firstChild?.licenceExpDays
                                )}  ${constantText.day_s_text}`}
                            {!canViewLicense ? (
                              <div className="tooltip-box">
                                {constantText?.tool_tip_noPermission}
                              </div>
                            ) : null}
                          </div>
                        )}

                        <div className="mov-info-box flex justify-content-between">
                          <div className="left-area flex">
                            <div className="movie-img">
                              <img
                                src={
                                  firstChild?.SeasonImages?.[
                                    firstChild?.SeasonImages?.length - 1
                                  ]?.imageDetails?.url
                                    ? completeImagePath(
                                        firstChild?.externalId,
                                        "list",
                                        firstChild?.SeasonImages?.[
                                          firstChild?.SeasonImages?.length - 1
                                        ]?.imageDetails.url,
                                        firstChild?.SeasonImages?.[
                                          firstChild?.SeasonImages?.length - 1
                                        ]?.imageDetails.resolution
                                      )
                                    : tvshow?.TvShowImages?.[
                                        tvshow?.TvShowImages?.length - 1
                                      ]?.imageDetails?.url
                                    ? completeImagePath(
                                        tvshow?.externalId,
                                        "list",
                                        tvshow?.TvShowImages?.[
                                          tvshow?.TvShowImages?.length - 1
                                        ]?.imageDetails.url,
                                        tvshow?.TvShowImages?.[
                                          tvshow?.TvShowImages?.length - 1
                                        ]?.imageDetails.resolution
                                      )
                                    : "images/no-image.svg"
                                }
                                alt={
                                  firstChild?.externalId
                                    ? firstChild?.externalId
                                    : "no image"
                                }
                              />
                            </div>
                            <div className="info">
                              <div className="mov-detail flex align-items-center">
                                <h4>
                                  {firstChild?.title ? firstChild?.title : "NA"}
                                </h4>
                                <BadgeBox
                                  status={
                                    firstChild?.contentState_populated?.title
                                  }
                                />
                              </div>
                              {/* <div className="global-title status-text flex">
                                <span className="label">Global Title</span>
                                <span className="text">
                                  {firstChild?.globaltitle
                                    ? firstChild?.globaltitle
                                    : "NA"}
                                </span>
                              </div> */}
                              <div className="time-loc-row flex align-items-center">
                                <span className="loc">
                                  <WorldIcon />{" "}
                                  {ShowLicensesChildCountries?.length > 0
                                    ? ShowLicensesChildCountries?.length > 2
                                      ? ShowLicensesChildCountries[0] +
                                        ", " +
                                        ShowLicensesChildCountries[1]
                                      : ShowLicensesChildCountries.join(", ")
                                    : "NA"}
                                  {ShowLicensesChildCountries?.length > 2 ? (
                                    <a
                                      onClick={() =>
                                        this.toggleMorePopup(
                                          ShowLicensesChildCountries
                                        )
                                      }
                                    >
                                      {` +${
                                        ShowLicensesChildCountries.length - 2
                                      }`}
                                    </a>
                                  ) : null}
                                </span>
                                {LanguageArr.length ? (
                                  <ListLanguage
                                    togglePopup={this.toggleMorePopup}
                                    audioLanguages={LanguageArr}
                                    languageIds={
                                      firstChild?.audioLanguages
                                        ? firstChild?.audioLanguages
                                        : tvshow?.audioLanguages
                                        ? tvshow?.audioLanguages
                                        : []
                                    }
                                  />
                                ) : null}

                                {firstChild?.contentState_populated?.title.toLowerCase() !==
                                  "submitted to review" &&
                                  firstChild?.contentState_populated?.title.toLowerCase() !==
                                    "all" &&
                                  firstChild?.contentState_populated?.title.toLowerCase() !==
                                    "draft" &&
                                  firstChild?.contentState_populated?.title.toLowerCase() !==
                                    "need work" &&
                                  firstChild?.contentState_populated?.title.toLowerCase() !==
                                    "archived" && (
                                    <span
                                      className="pub-history"
                                      data-test="tvshows-openSeheduledHistory"
                                      onClick={() =>
                                        this.openSeheduledHistory(
                                          firstChild,
                                          tvShowConstants.seasonType
                                        )
                                      }
                                    >
                                      {firstChild?.contentState_populated?.title.toLowerCase() ===
                                      "unpublished"
                                        ? "Unpublished History"
                                        : "Published and Scheduled History"}
                                    </span>
                                  )}
                              </div>
                              <div className="note-list-title status-text flex">
                                <span className="label">
                                  {constantText.note_text}
                                </span>
                                <span className="text">
                                  {firstChild?.note
                                    ? firstChild?.note
                                    : tvshow?.note
                                    ? tvshow?.note
                                    : "NA"}
                                </span>
                              </div>
                              <LastModifiedBy
                                data={firstChild || {}}
                                statusText={
                                  tabOptions[selectedTab]?.statusText || ""
                                }
                              />
                              {firstChild?.transcodingUpdate && (
                                <div className="flex align-items-center tra-update">
                                  <span className="mark-green flex align-items-center justify-content-center">
                                    <MarkDone />
                                  </span>{" "}
                                  Transcoding Update
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="right-area">
                            <div className="mov-icon-sec flex align-items-center  justify-content-between">
                              <div className="mov-id">
                                <span className="text-id">
                                  {constantText.external_id_text}
                                </span>
                                <span className="num-id">
                                  {firstChild?.externalId
                                    ? firstChild?.externalId
                                    : "NA"}
                                </span>
                              </div>
                              <div className="mov-cta-wrap flex">
                                <div
                                  onClick={() =>
                                    this.viewSeasonHandler(
                                      {
                                        seasonId: firstChild?.id,
                                        tvShowId: firstChild?.tvShowId,
                                        journeyType: firstChild?.journeyType,
                                      },
                                      true
                                    )
                                  }
                                  className="mov-icon mov-view tooltip-sec"
                                >
                                  <ViewIcon />
                                  <div className="tooltip-box">
                                    {tvShowConstants.viewSeason}
                                  </div>
                                </div>
                                {firstChild?.contentState_populated?.title !==
                                  tvShowConstants.archived && (
                                  <div
                                    onClick={() =>
                                      canClone()
                                        ? this.showHideClonePopup(
                                            {
                                              tvShowId: firstChild?.tvShowId,
                                              seasonId: firstChild?.id,
                                            },
                                            "season",
                                            firstChild?.journeyType
                                          )
                                        : constantText.no_permission
                                    }
                                    className={`mov-icon mov-view tooltip-sec auto-clone-${i}`}
                                  >
                                    <CopyIcon />
                                    <div className="tooltip-box">
                                      {tvShowConstants.copySeason}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {firstChild?.episodeCount ? (
                              <div className="mov-link flex justify-content-end">
                                <div
                                  onClick={() =>
                                    this.viewEpisodeList(
                                      firstChild?.tvShowId,
                                      firstChild?.id
                                    )
                                  }
                                  className={`mov-link-btn auto-mov-link-btn`}
                                >
                                  <TvshowIcon />{" "}
                                  <span>
                                    {"Episodes"} +{firstChild?.episodeCount}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
              {/* Child end */}
            </div>
          )}
          {selectedContentType === tvShowConstants.seasonType && (
            <Fragment>
              <div className="m-tag">
                {constantText?.journeyType[tvshow?.journeyType]}
              </div>
              {tvshow?.licenceExpDays?.length > 0 && (
                <div
                  className={
                    canViewLicense
                      ? "license-badge"
                      : "license-badge tooltip-sec nopermission"
                  }
                  onClick={() =>
                    canViewLicense
                      ? this.handleRouteExpiredLink({
                          seasonId: tvshow?.seasonId,
                          tvShowId: tvshow?.tvShowId,
                          journeyType: tvshow?.journeyType,
                        })
                      : () => {}
                  }
                >
                  {Math.min.apply(null, tvshow?.licenceExpDays) === 0
                    ? constantText.license_expires_today
                    : `${constantText.license_expires_in}  ${Math.min.apply(
                        null,
                        tvshow?.licenceExpDays
                      )}  ${constantText.day_s_text}`}
                  {!canViewLicense ? (
                    <div className="tooltip-box">
                      {constantText?.tool_tip_noPermission}
                    </div>
                  ) : null}
                </div>
              )}
              <div className="mov-info-box flex justify-content-between">
                <div className="left-area flex">
                  <div className="movie-img">
                    <img
                      src={
                        tvshow?.seasonImages?.url
                          ? completeImagePath(
                              tvshow?.externalId,
                              "list",
                              tvshow?.seasonImages?.url,
                              tvshow?.seasonImages?.resolution
                            )
                          : tvshow?.tvShowImages?.url
                          ? completeImagePath(
                              tvshow?.tvShowExternalId,
                              "list",
                              tvshow?.tvShowImages?.url,
                              tvshow?.tvShowImages?.resolution
                            )
                          : "images/no-image.svg"
                      }
                      alt={tvshow?.externalId ? tvshow?.externalId : "no image"}
                    />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{tvshow?.title ? tvshow?.title : "NA"}</h4>
                      {selectedTab == 0 && (
                        <BadgeBox status={tvshow?.contentStatePopulated} />
                      )}
                    </div>
                    {/* <div className="global-title status-text flex">
                      <span className="label">Global Title</span>
                      <span className="text">{"NA"}</span>
                    </div> */}
                    <div className="time-loc-row flex align-items-center">
                      <span className="loc">
                        <WorldIcon />{" "}
                        {ShowLicensesCountries?.length > 0
                          ? ShowLicensesCountries?.length > 2
                            ? ShowLicensesCountries[0] +
                              ", " +
                              ShowLicensesCountries[1]
                            : ShowLicensesCountries.join(", ")
                          : "NA"}
                        {ShowLicensesCountries?.length > 2 ? (
                          <a
                            onClick={() =>
                              this.toggleMorePopup(ShowLicensesCountries)
                            }
                          >
                            {` +${ShowLicensesCountries.length - 2}`}
                          </a>
                        ) : null}
                      </span>
                      {LanguageArr.length ? (
                        <ListLanguage
                          togglePopup={this.toggleMorePopup}
                          audioLanguages={LanguageArr}
                          languageIds={
                            tvshow?.audioLanguages ? tvshow?.audioLanguages : []
                          }
                        />
                      ) : null}
                      {selectedTab == 0 ||
                      selectedTab == 9 ||
                      selectedTab == 2 ||
                      selectedTab == 3 ||
                      selectedTab == 6 ||
                      selectedTab == 4
                        ? tvshow?.contentStatePopulated?.toLowerCase() !==
                            "submitted to review" &&
                          tvshow?.contentStatePopulated?.toLowerCase() !==
                            "all" &&
                          tvshow?.contentStatePopulated?.toLowerCase() !==
                            "draft" &&
                          tvshow?.contentStatePopulated?.toLowerCase() !==
                            "need work" &&
                          tvshow?.contentStatePopulated?.toLowerCase() !==
                            "archived" && (
                            <span
                              className="pub-history"
                              data-test="tvshows-openSeheduledHistory"
                              onClick={() =>
                                this.openSeheduledHistory(tvshow, i)
                              }
                            >
                              {tvshow?.contentStatePopulated?.toLowerCase() ===
                              "unpublished"
                                ? "Unpublished History"
                                : "Published and Scheduled History"}
                            </span>
                          )
                        : ""}
                    </div>
                    <div className="note-list-title status-text flex">
                      <span className="label">{constantText.note_text}</span>
                      <span className="text">{tvshow?.note || "NA"}</span>
                    </div>
                    <LastModifiedBy
                      data={
                        {
                          lastModifiedBy_populated:
                            tvshow?.lastModifiedByPopulated,
                          lastModifiedOn: tvshow?.lastModifiedOn,
                        } || {}
                      }
                      statusText={tabOptions[selectedTab]?.statusText || ""}
                    />
                    {tvshow?.transcodingUpdate && (
                      <div className="flex align-items-center tra-update">
                        <span className="mark-green flex align-items-center justify-content-center">
                          <MarkDone />
                        </span>{" "}
                        Transcoding Update
                      </div>
                    )}
                  </div>
                </div>
                <div className="right-area">
                  <div className="mov-icon-sec flex align-items-center  justify-content-between">
                    <div className="mov-id">
                      <span className="text-id">
                        {constantText.external_id_text}
                      </span>
                      <span className="num-id">
                        {" "}
                        {tvshow?.externalId ? tvshow?.externalId : "NA"}
                      </span>
                    </div>
                    <div className="mov-cta-wrap flex">
                      <div
                        onClick={() =>
                          this.viewSeasonHandler({
                            seasonId: tvshow?.seasonId,
                            tvShowId: tvshow?.tvShowId,
                            journeyType: tvshow?.journeyType,
                          })
                        }
                        className={`mov-icon mov-view tooltip-sec auto-view-${i}`}
                      >
                        <ViewIcon />
                        <div className="tooltip-box">
                          {tvShowConstants.viewSeason}
                        </div>
                      </div>
                      {tvshow?.contentStatePopulated !==
                        tvShowConstants.archived && (
                        <div
                          onClick={() =>
                            canCloneSeason()
                              ? this.showHideClonePopup(
                                  { ...tvshow, tvShowId: tvshow?.tvShowId },
                                  "season",
                                  tvshow?.journeyType
                                )
                              : constantText.no_permission
                          }
                          className={`mov-icon mov-view tooltip-sec auto-clone-${i}`}
                        >
                          <CopyIcon />
                          <div className="tooltip-box">
                            {tvShowConstants.copySeason}
                          </div>
                        </div>
                      )}
                      {tvshow?.contentStatePopulated ==
                        tvShowConstants.unpublished && (
                        <span
                          className="edit tooltip-sec hand-cursor"
                          disabled={!canPublish}
                          onClick={() =>
                            this.handleConditionRoute(
                              "archive",
                              tvshow?.seasonId
                            )
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
                      {tvshow?.contentStatePopulated ==
                        tvShowConstants.archived && (
                        <span
                          className="edit tooltip-sec hand-cursor"
                          disabled={!canPublish}
                          onClick={() =>
                            this.handleConditionRoute(
                              "restore",
                              tvshow?.seasonId
                            )
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
                </div>
              </div>
              <div className="seasons-row flex">
                <div className="tvshow-name flex align-items-center">
                  <span className="label">
                    {tvShowConstants?.tvShow_view_text}
                  </span>
                  <span
                    className="val"
                    onClick={
                      tvshow?.tvShowTitle
                        ? () => {
                            this.viewShowHandler({
                              tvShowId: tvshow?.tvShowId,
                              journeyType: null,
                            });
                          }
                        : () => {}
                    }
                  >
                    {tvshow?.tvShowTitle ? tvshow?.tvShowTitle : "NA"}
                  </span>
                </div>
                <div className="tvshow-seasons flex align-items-center">
                  <span className="label">{tvShowConstants?.episodesText}</span>
                  <span
                    className="val"
                    onClick={() =>
                      tvshow?.episodeCount
                        ? this.viewEpisodeList(
                            tvshow?.tvShowId,
                            tvshow?.seasonId
                          )
                        : () => {}
                    }
                  >
                    {tvshow?.episodeCount ? tvshow?.episodeCount : 0}
                  </span>
                </div>
              </div>
            </Fragment>
          )}
          {selectedContentType === tvShowConstants.episodeType && (
            <EpisodeCard
              LanguageArr={LanguageArr}
              tabOptions={tabOptions}
              toggleMorePopup={this.toggleMorePopup}
              viewSeasonHandler={this.viewSeasonHandler}
              viewShowHandler={this.viewShowHandler}
              addContent={this.addContent}
              handleConditionRoute={this.handleConditionRoute}
              handleRouteExpiredLink={this.handleRouteExpiredLink}
              viewEpisodeHandler={this.viewEpisodeHandler}
              openSeheduledHistory={this.openSeheduledHistory}
              selectedTab={selectedTab}
              tvshow={tvshow}
              id={tvshow?.episodeId}
            />
          )}
        </div>
      );
    });
    const MoreCountriesBlock = (
      <ul className="mov-con-list flex">
        {SelectedMoreCountries.map((item, index) => (
          <li className="col-6 col-md-4" key={index}>
            {item}
          </li>
        ))}
      </ul>
    );
    switch (selectedContentType) {
      case constantText.seasonConstant.contentType:
        searchBtnText = constantText.seasonConstant.seasons
        searchPlaceholderText = constantText.tvShowsConstant.searchPlaceholderSeasons;
        break;
      case constantText.episodeConstant.contentType:
        searchBtnText = constantText.episodeConstant.episodes
        searchPlaceholderText = constantText.tvShowsConstant.searchPlaceholderEpisodes;
        break;
    }
    return (
      <div className="d-wrap c-n">
        <div className="movie-list-sec">
          <BreadcrumbsComp className="" links={links} typography={typography} />
          <div className="user-head profile-head flex justify-content-between align-items-center mov-list-head">
            <div
              className="back-user-btn flex align-items-center"
              data-test="tvshows-handleRoute"
              onClick={() => this.handleRoute("/dashboard")}
            >
              <div className="text">
                <span>
                  <AngleLeftArrow />
                </span>
                <strong data-test="tvshow-heading-text">
                  <span>{constantText.tv_show_text?.title}</span>
                </strong>
              </div>
            </div>
            <div className="s-form flex">
              <div className="search-with-select">
                <input
                  type="text"
                  name="searchString"
                  autoComplete="off"
                  className={
                    isQueue ? "disable-f-btn auto-search" : "auto-search"
                  }
                  disabled={isQueue}
                  data-test="tvshows-handleChange"
                  placeholder={`${searchPlaceholderText}${constantText.tvShowsConstant.searchExternalIdText}`}
                  value={searchString || ""}
                  onChange={this.searchHandleChange}
                  onKeyPress={this.handleKeyPress}
                  onKeyUp={this.handleKeyUp}
                />
                <DropDown
                  className="dropdown-btn"
                  buttonText={searchBtnText}
                  loaderVisible={true}
                  isLoading={!isRequestIntiate}
                  open={openSearchDropdown}
                  handleOpenClose={isRequestIntiate ? this.handleOpenSearchDropDown : () => {}}
                  handleClose={this.handleOpenSearchDropDown}
                >
                  <MenuItem onClick={() => this.handleSearchRoute(searchBtnText, "TV Shows")}>
                    TV Shows
                  </MenuItem>
                  <MenuItem onClick={() => this.handleSearchRoute(searchBtnText, "Seasons")}>
                    Seasons
                  </MenuItem>
                  <MenuItem onClick={() => this.handleSearchRoute(searchBtnText, "Episodes")}>
                    Episodes
                  </MenuItem>
                </DropDown>
              </div>
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
                      ? "disable-f-btn filter-btn"
                      : filterDatakey
                      ? "filter-btn current-active-filter"
                      : "filter-btn"
                  }
                  disabled={isQueue}
                  Icon={FilterIcon}
                  buttonText={"Filters"}
                  data-test="tvshows-showfilterdrawer"
                  onClick={this.showHideFilterDrawer}
                />
                <div
                  className={
                    canCreate()
                      ? "btn-create-user auto-tvShow"
                      : "btn-create-user disable-f-btn"
                  }
                  onClick={() =>
                    canCreate() ? this.handleRoute("/tvshow/create") : {}
                  }
                >
                  {tvShowConstants.createShow}
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
                  data-test="tvshows-changeTab"
                  onChange={this.changeTab}
                  selectedTab={selectedTab}
                />
              </div>
              <div className="col-md-8 col-lg-9">
                {appliedFilters?.length > 0 && (
                  <AppliedFilter
                    className="tabs lang-tab filter-scroll"
                    options={appliedFilters}
                    listCount={showsCount}
                  />
                )}
                {page !== 1 && (
                  <BottomScrollListener
                    onBottom={() => {
                      this.nextCall();
                    }}
                    debounce={10000}
                    offset={5}
                  />
                )}
                {isQueue ? (
                  <div
                    onClick={this.getAllShows}
                    className="refresh-queue flex align-items-center"
                  >
                    <LightIcon />
                    {constantText.please_refresh_text}{" "}
                    <span className="ref-link">
                      {constantText.refresh_pqueue_text}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {tvshows}

                <InlineLoader
                  show={tvshowList.length !== 0 && !isRequestIntiate}
                />
                {tvshowList.length === 0 ? (
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
                        show={!isRequestIntiate || tvshowList.length === 0}
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
          state={showModelForMore}
          showTitle={true}
          title={
            modelForCountry
              ? constantText.license_country_text
              : constantText.more_languages_text
          }
          showIcon={false}
          showDes={true}
          des={MoreCountriesBlock}
          desWithoutDialogText={true}
          showBtn1={false}
          showBtn2={true}
          btn2Text={constantText.close_text}
          btn2Action={() => this.showHideMorePopup()}
          handleClose={() => this.showHideMorePopup()}
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

        <CommonModel
          className="popup-wrap status-popup"
          state={showMapContentModal}
          showTitle={true}
          title={`Confirmation`}
          showIcon={false}
          showDes={false}
          des={`Do you want to map the UID ${this.state?.transcodingUid} with this assest (${this.state.externalId})?`}
          btn1Action={() => this.mapTranscodingContent(true)}
          btn2Action={() => this.closeContentModal()}
          handleClose={() => this.closeContentModal()}
        />
      </div>
    );
  }
}

export default TvShowList;
