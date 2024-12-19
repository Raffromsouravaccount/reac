import React, { Component, Fragment } from 'react';
import moment from "moment";

import BottomScrollListener from "react-bottom-scroll-listener";
import BreadCrumbs from '../../Common/BreadCrumbs/BreadCrumbs';
import ButtonField from '../../Common/ButtonField/ButtonField';
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import { constantText } from '../../../_helpers/constants.text';
import { history } from "../../../_helpers/history";
import { breadCrumbs } from './breadCrumbs';
import { createQuery } from "../../Common/CommonFunction/CommonFuntion"
import { apiCalls, commonService } from "../../../_services/common.service";
import Config from "../../../Config/config";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";
import { completeImagePath } from "../../Common/CommonFunction/CommonFuntion";
import { LastModifiedBy } from "../../Common/LastModifiedBy/LastModifiedBy";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { CommonModel } from '../../Common/Model/CommonModel';
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import DatePicker from "../../Common/DatePicker/DatePicker";
import FormRender from "../../Common/FormHelper/FormRender";
import { transcodingConstants } from "../Constants/movie.constants";
import { getCopyObj } from "../../../_helpers/util";
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';
import checkValidity from "../../Common/FormHelper/FieldValidator";
import AppliedFilter from "../../Common/LeftTab/AppliedFilter";
import EpisodeCard from "./EpisodeCard";

//Icon
import AngleLeftArrow from 'images/angle-left-arrow.svg';
import FilterIcon from "images/filter-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import headerTabs from '../Jsons/HeaderTabs.json';
import WorldIcon from "images/world-icon.svg";
//Json
import {
  sideSelectFilters,
  filterByDate,
  StatusTypes,
} from "../Schema/SideFilter.json";
//css
import "../../../../public/css/Common/MapContent.css";
import "./TsMapContent.css";

export const filterValidityCheck = (jsonform) => {
  let formIsValid = true;
  let elementValid = true;
  let elementLength = false;
  let form = jsonform;

  form.forEach((element) => {
    if (element?.display !== false) {
      let { isValid } = checkValidity(element.value, element.validation);
      elementValid = isValid;
      formIsValid = elementValid && formIsValid;
      if (element?.value?.length) {
        elementLength = true;
      }
      if ((element?.name === "actor" || element?.name === "tags") && element?.value) {
        elementLength = true;
      }
    }
  });
  return { formValidity: formIsValid && elementLength };
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
class MapContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listFilterQuery: {},
      options: JSON.parse(JSON.stringify(headerTabs)),
      selectedTab: 0,
      list: [],
      appliedFilters: [],
      modelForCountry: true,
      SelectedMoreCountries: [],
      showModelForMore: false,
      filterDatakey: false,
      searchText: '',
      searchMode: false,
      Loader: false,
      queryData: {
        limit: constantText.search_limit,
        searchString: "",
        page: 1,
        contentState: "",
        lastEvaluatedKey: "",
        transcodingList: true
      },
      count: 0,
      maxPage: null,
      subPath: "movie",
      showMapContentModal: false,
      addContentData: {
        "updateType": 0,
        "transcodingUid": this.props?.match?.params?.uuid,
        "externalId": "",
        "contentType": ""
      },
      showFilterDrawer: false,
      contentStateName: "All",
      filters: {
        formValidity: true,
        filterByStatus: JSON.parse(JSON.stringify(StatusTypes)),
        filterByDate: JSON.parse(JSON.stringify(filterByDate)),
        selectFilters: DEFAULT_JSON(sideSelectFilters) || [],
        querys: "",
        byDate: "",
        startDate: "",
        endDate: "",
      },
      LanguageArr: [],
      tabOptions: [],
      isFilterUpdate: false,
      showMapContentConfirmation: false,
      updateType: null,
      showModalEpisode: false,
      transcodingUid: props?.match?.params?.uuid,
      externalId: ''
    }
  }

  handleRoute = (route) => {
    history.push(route);
  };

  searchContent = (event) => {
    const { value } = event.target;
    this.setState({
      searchText: value
    })
  }

  componentDidMount() {
    this.fetchLeftTabData()
    this.getAllLanguage();
    this.getAllLists(true);
    commonService.getLeftSideBarListing("movie").then((res) => {
      this.setState({
        tabOptions: res?.menuItems
      });
    });
  }
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
  getAllLists = async (count = false) => { 
    await this.setQueryData();
    const { listFilterQuery } = this.state;
    let { paramQuery } = listFilterQuery;
    let { searchString } = paramQuery;
    paramQuery = searchString
      ? { ...paramQuery, searchString: searchString.trim() }
      : paramQuery;
    listFilterQuery.paramQuery = paramQuery;
    if (count) {
      await this.fetchListTotal(listFilterQuery);
    } else {
      await this.fetchList(listFilterQuery);
    }
  };

  fetchListTotal = async (params) => {
    const { selectedTab } = this.state;
    const query = createQuery(params);
    const listUrl = selectedTab === 0 ? `/movie${query ? query : ""}` : selectedTab == 1 ? `/video${query ? query : ""}` : `/episode${query ? query : ""}`;
    const totalUrl = selectedTab === 0 ? `/movie/listTotal${query ? query : ""}`: selectedTab == 1 ? `/video/listTotal${query ? query : ""}`  :  `/episode/count${query ? query : ""}`;
    let urls = [
      totalUrl,
      listUrl,
    ];
    // map every url to the promise of the fetch
    let requests = urls.map((url) =>
      apiCalls(url, "GET", null, constantText.tvshow_list_route, false)
    );

    // Promise.all waits until all jobs are resolved
    Promise.all(requests)
      .then((responses) => {
        if (responses[0] && responses[1]) {
          const localCount = selectedTab == 0 ? responses[0]?.count :  responses[0]?.count || null;
          const limit = constantText.search_limit;
          const Count = localCount ? localCount : 0;
          
          const Page = Count ? Math.ceil(Count / limit) : 1;
          this.setState(
            {
              count: Count || 0,
              maxPage: Page || 0,
            },
            () => {
              this.setListResponse(responses[1]);
            }
          );
        } else {
          this.setState({
            count: 0,
            maxPage: null,
            isRequestIntiate: true,
            changingTab: false,
            list: [],
            Loader:false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  setListResponse = (response) => {
    const { queryData, list } = this.state;
    if (response) {
      const copyQueryData = { ...queryData };
      let newlist = [];
      //If has showData increase page
      copyQueryData.page = copyQueryData.page + 1;
      newlist = [...list, ...(response || [])];
      let stateObj = {
        list: newlist,
        isRequestIntiate: true,
        queryData: copyQueryData,
        Loader: !this.state.Loader
      };
      this.setState(stateObj);
    } else {
      this.setState({
        isRequestIntiate: true,
        changingTab: false,
        count: 0,
        list: [],
        Loader: false
      });
    }
  };

  fetchList = async (params) => {
    this.setState({ Loader: true })
    const { Loader, list, queryData, subPath } = this.state;
    const query = createQuery(params);
    if (Loader) {
      const url = `${subPath}${query ? query : ""}`;
      //ListCall
      let response = await apiCalls(url, "GET", null, `/transcoding`, false);
      if (response) {
        const limit = constantText.search_limit;
        const copyQueryData = { ...queryData };
        let newlist = [];
        //If has movieData increase page
        copyQueryData.page = copyQueryData.page + 1;
        newlist = [...list, ...(response || [])];
        let stateObj = {
          list: newlist,
          queryData: copyQueryData,
          Loader: !this.state.Loader
        };
        this.setState(stateObj);
      } else {
        this.setState({ count: 0, list: [], Loader: !this.state.Loader });
      }
    }
  };

  setQueryData = async () => {
    const { filters, queryData, isFilterUpdate, listFilterQuery } = this.state;
    let updateObj = {
      paramQuery: getCopyObj(queryData),
    };
    if (isFilterUpdate) {
      updateObj = {
        filters: getCopyObj(filters.selectFilters),
        filterByDate: getCopyObj(filters.filterByDate),
        paramQuery: getCopyObj(queryData),
      };
    }
    this.setState({
      listFilterQuery: {
        ...listFilterQuery,
        ...updateObj
      }
    });
  };

  nextCall = (page) => {
    this.setState({ Loader: true })
    const { maxPage, Loader } = this.state;
    if (Loader && maxPage && page <= maxPage) {
      this.getAllLists();
    }
  };

  searchHandleChange = async (event) => {
    let { name, value } = event.target;
    let { queryData } = this.state;
    this.setState({
      list: [],
      queryData: {
        ...queryData,
        page: 1,
        [name]: value,
      },
    });
  };

  fetchLeftTabData = async () => {
    const {selectedTab } = this.state;
    let url = selectedTab ==0 ? `${Config.movieCount}`  : selectedTab ==1 ? `${Config.videoCount}` : `${Config.tvshowCount}/'episode'`;
    let response = await apiCalls(url, "GET", null, {}, false);
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
            list:[],
            translationList: [],
            searchMode: true,
            queryData: {
              ...queryData,
              page: 1,
            },
          },
          () => {
            this.getAllLists(true);
          }
        );
      }
    }, 1000);
  };

  tabSwitched = (event, selectedTab) => {
    if (selectedTab === this.state.selectedTab) {
      return;
    }
    let subPath;
    subPath = this.state.options[selectedTab].apipath;
    this.setState({
      list: [],
      selectedTab: selectedTab,
      translationList: [],
      searchMode: false,
      subPath: subPath,
      queryData: {
        ...this.state.queryData,
        page: 1
      }
    }, () => {
      this.fetchLeftTabData()
      this.getAllLists(true);
    }
    );
  }

  addContent = (externalId, contentType, episodeId) => {
    this.setState({
      addContentData: {
        ...this.state.addContentData,
        "externalId": externalId,
        "contentType": contentType
      },
      externalId: externalId
    })
    if(episodeId) {
      this.setState({
        showModalEpisode: !this.state.showModalEpisode
      })
    } else {
      this.setState({
        showMapContentModal: !this.state.showMapContentModal
      })
    }
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
        showMapContentModal: !this.state.showMapContentModal,
        updateType: updateType
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
      if (updateType === 1 || updateType === 2) {
        this.props.history.push({
          pathname: `/transcoding`
        });
        showSuccessErrorMsg(constantText.transcodingMappedSuccessMessage, '', constantText.transcodingMappedSuccessTitle);
      } else {
        this.setState({
          showMapContentConfirmation: !this.state.showMapContentConfirmation
        })
      }
    } else {
      this.setState({
        showMapContentConfirmation: !this.state.showMapContentConfirmation
      })
      showSuccessErrorMsg(constantText.transcodingMappedFailureMessage, '', constantText.transcodingMappedFailureTitle);
    }
  }

  mapTranscodingContentEpisode = async (value) => {
    const { updateType } = this.state;
    const url = `${Config.transcoding}`;
    let data = { ...this.state.addContentData, "updateType": 1 }
    //ListCall
    let response = await apiCalls(url, "PUT", data);
    if (response) {
      showSuccessErrorMsg(constantText.transcodingMappedSuccessMessage, '', constantText.transcodingMappedSuccessTitle);
        this.props.history.push({
          pathname: `/transcoding`
        });
    } else {
      showSuccessErrorMsg(constantText.transcodingMappedFailureMessage, '', constantText.transcodingMappedFailureTitle);
      this.setState({
        showModalEpisode: !this.state.showModalEpisode
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

  closeContentModalEpisode = () => {
    this.setState({
      showModalEpisode: !this.state.showModalEpisode
    })
  };

  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };

  getFiltersUi = () => {
    let { filters, contentStateName } = this.state;
    let { filterByDate, filterByStatus, selectFilters, formValidity } = filters;
    let allStatusFilters = filterByStatus?.map((status, index) => (
      <div className="bystatus-col" key={"status_" + index}>
        <div
          className={`bystatus-f-cta flex align-items-center justify-content-center${status.active ? " s-active" : ""
            }`}
          onClick={(e) => this.handleFilterStatusSelection(e, index)}
        >
          {status.displayName}
        </div>
      </div>
    ));
    let allDateFilters = null;
    if (filterByDate && filterByDate.length) {
      allDateFilters = filterByDate?.map((filterDate, i) => {
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
                  onChange={(e) =>
                    this.handleDateChange("startDate", filterDate, i, e)
                  }
                  className="zee-input-field"
                />
              </div>
              <div className="col-sm-6">
                <DatePicker
                  type="date"
                  placeholder={filterDate.date.endPlaceholder}
                  value={filterDate.date.endDate}
                  onChange={(e) =>
                    this.handleDateChange("endDate", filterDate, i, e)
                  }
                  className="zee-input-field"
                />
              </div>
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
          <div className="title">{transcodingConstants.filter_text}</div>
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
                handleAutoCreateInput={this.handleSearchableInput}
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
            buttonText={transcodingConstants.filter_apply}
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData();
            }}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            buttonText={transcodingConstants.clear_text}
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };

  handleFilterStatusSelection = (event, selectedTab) => {
    let { filters, queryData, tabOptions } = this.state;
    let shallowFilters = JSON.parse(JSON.stringify(filters));
    const findContentIndex = tabOptions.findIndex((e) =>
      e?.displayName.toLowerCase() ===
      shallowFilters.filterByStatus[selectedTab]?.label.toLowerCase()
    );
    shallowFilters.filterByStatus.forEach((item, index) => {
      item["active"] = index == selectedTab ? true : false;
    });
    let contentState = tabOptions[findContentIndex]?.id;
    this.setState({
      filters: shallowFilters,
      queryData: {
        ...queryData,
        contentState,
      },
    });
  };
  handleDateChange = (type, dateItem, index, event) => {
    let { value } = event.target;
    const { filters } = this.state;
    const { filterByDate, selectFilters } = filters;
    filterByDate.map((fDItem, i) => {
      if (index !== i) {
        fDItem.date.startDate = "";
        fDItem.date.endDate = "";
      }
    });
    let startDate = filterByDate[index].date.startDate;
    let endDate = filterByDate[index].date.endDate;
    //Date Validation
    if (type === "startDate") {
      if (endDate) {
        if (moment(value).isSameOrBefore(endDate)) {
          filterByDate[index].date.startDate = value;
        }
      } else {
        filterByDate[index].date.startDate = value;
      }
      startDate = value;
    } else {
      if (startDate) {
        if (moment(value).isSameOrAfter(startDate)) {
          filterByDate[index].date.endDate = value;
        }
      } else {
        filterByDate[index].date.endDate = value;
      }
      endDate = value;
    }
    //Date Validation end
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck([...selectFilters]);
    this.setState({
      filters: {
        ...filters,
        formValidity: formValidity
          ? startDate === "" && endDate === ""
            ? formValidity
            : checkDate && formValidity
          : checkDate,
        filterByDate: filterByDate,
      },
    });
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
    if (event.target.checked) {
      const filterOptions = options.filter((item) => item.group === group);
      copyElement.value = copyElement.value
        ? [...copyElement.value, ...filterOptions]
        : filterOptions;
    } else {
      const copyValues = [...copyElement.value];
      const filterValues = copyValues.filter((item) => item.group !== group);
      copyElement.value = filterValues;
    }
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
  filterChange = (event, elemIndex) => {
    let { filters } = this.state;
    let { selectFilters, filterByDate } = filters;
    const copyJSON = [...this.state.filters.selectFilters];
    const updatedElement = copyJSON[elemIndex];
    updatedElement.value = event.target.value;

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

    const { formValidity } = filterValidityCheck(copyJSON);
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    this.setState({
      filters: {
        ...filters,
        formValidity: checkDate ? checkDate : formValidity,
        selectFilters: copyJSON,
      },
    });
  };
  showStatusField = (selectFilters, flag) => {
    selectFilters.map((item) => {
      if (item.name === "translationStatus") {
        if (flag) {
          item.display = flag;
          item.data = constantText.translationStatus;
        } else {
          item.display = flag;
          item.value = [];
        }
      }
    });
  };
  handleAutoCreateInput = async (value, index) => {
    let { filters } = this.state;
    let { selectFilters } = filters;
    let url = (selectFilters[index].name == "tags") ? `${Config.masterTags}?title=${value}` :
      `${Config.castnamesUrl}?castName=${value}`
    let response = await apiCalls(url, "GET", {}, null, false) || [];
    selectFilters[index]["data"] = response
    this.setState(prevState => ({
      filters: {
        ...filters,
        selectFilters
      }
    }));
  }
  clearFilter = () => {
    this.clearFilterData()
      .then(() => {
        this.showHideFilterDrawer();
        this.getAllLists(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  clearFilterData = () => {
    const { filters, queryData, contentStateName } = this.state;
    const { filterByDate, filterByStatus } = filters;
    //Clear Status
    filterByStatus.forEach((e) => {
      e.active = e.label === "All" ? true : false;
    });
    filterByDate.map((item) => {
      if (item.for === contentStateName) {
        item.date.endDate = "";
        item.date.startDate = "";
      }
    });
    const selectFilters = [...this.state.filters.selectFilters];
    selectFilters.map((filter) => {
      filter.value = filter?.type === "text" ? "" : null;
    });
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    return new Promise((resolve, reject) => {
      this.setState(
        {
          filterDatakey: false,
          appliedFilters: [],
          moviesList: [],
          filters: {
            ...filters,
            formValidity: checkDate ? true : (contentStateName === "All" ? true : false),
            selectFilters: selectFilters,
            filterByStatus: filterByStatus,
          },
          queryData: {
            ...queryData,
            page: 1,
            contentState: contentStateName === "All" ? "" : queryData?.contentState,
          },
          listFilterQuery: {
            filters: getCopyObj(selectFilters),
            filterByDate: getCopyObj(filterByDate),
            paramQuery: {
              ...queryData,
              page: 1,
              contentState: contentStateName === "All" ? "" : queryData?.contentState,
            },
          }
        },
        () => {
          resolve(true);
        }
      );
    });
  };
  filterData = async () => {
    let { listFilterQuery, queryData, filters } = this.state;
    const copyJSON = [...filters.selectFilters];
    this.setState(
      {
        appliedFilters: await this.getAppliedFilter(
          copyJSON,
          filters.filterByDate,
          filters.filterByStatus
        ),
        isFilterUpdate: true,
        filterDatakey: true,
        searchMode: false,
        list: [],
        count: 0,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllLists(true);
      }
    );
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
  viewShowHandler = (show) => {
    const { tvShowId, journeyType } = show;
    this.props.history.push({
      pathname: `/tvshow/view/${tvShowId}`,
      state: { journeyType: journeyType },
    });
  };
  handleRouteExpiredLink = (show, mode = null) => {
    let journeyType;
    let route;
    let tab;
    let stateMode = "list";
    if (mode === "episode") {
      const { seasonId, episodeId, episodeJourney, tvShowId } = show;
      journeyType = episodeJourney;
      route = `/tvshow/view/${tvShowId}/season/view/${seasonId}/episode/view/${episodeId}`;
      tab = episodeJourney == "1" ? 3 : 2;
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
  viewSeasonHandler = (show) => {
    const { history } = this.props;
    let stateMode = "list";
    const { seasonId, journeyType, tvShowId } = show;
    history.push({
      pathname: `/tvshow/view/${tvShowId}/season/view/${seasonId}`,
      state: { journeyType: journeyType, stateMode },
    });
  };
  getModalUi = () => {
    return (
      <div className="popup-m-area">
        <div className="pop-dis">Are you sure you want to map this UID to this content. </div>
        <div className="pop-meta">Update Video and Metadata</div>
        <div className="pop-video-only">Update Video Only</div>
      </div>
    )
  }
  render() {
    const { list, queryData, SelectedMoreCountries, showModelForMore, modelForCountry, appliedFilters, LanguageArr, count, tabOptions, Loader, showMapContentModal, showFilterDrawer, selectedTab, showMapContentConfirmation, filterDatakey, showModalEpisode } = this.state;
    let { searchString, page } = queryData;
    const movies = list.map((movie, i) => {
      const MovieLicensesCountries = movie?.countries
        ? movie?.countries?.split(",")
        : [];
      return (
        <div className="whitebox episode-relcon pos-rel" key={i}>
          {selectedTab !== 2 && (
            <Fragment>
              <div className="related-m-tag">
                {constantText?.journeyType[movie?.journeyType]}
              </div>
              <div className="list-profile-box flex justify-content-between">
                <div className="left-wrap flex">
                  <div className="left-block flex">
                    <div className="movie-img">
                      <img
                        src={
                          movie?.MovieImages?.[0]?.imageDetails?.url
                            ? completeImagePath(
                                movie?.externalId,
                                "list",
                                movie?.MovieImages?.[0]?.imageDetails.url,
                                movie?.MovieImages?.[0]?.imageDetails.resolution
                              )
                            : "images/no-image.svg"
                        }
                        alt={
                          movie?.MovieImageSets?.setName
                            ? movie?.MovieImageSets?.setName
                            : "no image"
                        }
                      />
                    </div>
                    <div className="info-block global-status-button">
                      <div className="flex list-top-text align-items-center">
                        <strong>{movie?.title || "No title"}</strong>
                        <BadgeBox
                          status={movie?.subtype_populated?.title}
                          dot={true}
                          color={"blue"}
                        />
                      </div>
                      {/* <div className="global-title status-text flex">
                               <span className="label">Global Title</span>
                               <span className="text">
                                 {movie?.title ? movie?.title : "NA"}
                               </span>
                             </div> */}
                      <div className="time-loc-row flex align-items-center">
                        <span className="loc">
                          <WorldIcon />{" "}
                          <span className="loc">
                            {MovieLicensesCountries?.length > 0
                              ? MovieLicensesCountries?.length > 2
                                ? MovieLicensesCountries[0] +
                                  ", " +
                                  MovieLicensesCountries[1]
                                : MovieLicensesCountries.join(", ")
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                      <div className="note-list-title status-text flex">
                        <span className="label">{constantText.note_text}</span>
                        <span className="text">{movie?.note || "NA"}</span>
                      </div>
                      <LastModifiedBy data={movie || {}} />
                    </div>
                  </div>
                </div>
                <div className="right-block">
                  <div className="flex">
                    <div className="list-middle-text">
                      <strong>
                        {constantText.external_id_text} &nbsp;{" "}
                        {movie?.externalId || "NA"}
                      </strong>
                    </div>
                    <div className="user-head">
                      <div className="s-form">
                        <div
                          className="btn-create-user"
                          onClick={() =>
                            this.addContent(
                              movie.externalId ? movie.externalId : "",
                              selectedTab === 2
                                ? constantText.transcoding_episode
                                : selectedTab === 1
                                ? constantText.transcoding_video
                                : "movie",
                              movie.episodeId
                            )
                          }
                        >
                          {constantText.add_content_text}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
          {selectedTab === 2 && (
            <EpisodeCard
              LanguageArr={LanguageArr}
              handleRouteExpiredLink={this.handleRouteExpiredLink}
              toggleMorePopup={this.toggleMorePopup}
              viewSeasonHandler={this.viewSeasonHandler}
              viewShowHandler={this.viewShowHandler}
              addContent={this.addContent}
              list={movie}
              id={movie?.episodeId}
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
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs className="" links={breadCrumbs.mapcontentLinks}
          typography={breadCrumbs.typography()} />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span data-test="handleRouteBtn" onClick={() => this.handleRoute('/transcoding')}><AngleLeftArrow /></span>
            <strong><span>{constantText.map_content}</span></strong>
          </div>

          <div className="user-head optional-user-head">
            <div className="s-form flex justify-content-between col-md-12">
              <input
                type="text"
                autoComplete="off"
                name="searchString"
                placeholder={constantText.transcoding_search_placeholder_mapcontent}
                value={searchString || ""}
                onChange={this.searchHandleChange}
                onKeyPress={this.handleKeyPress}
                onKeyUp={this.handleKeyUp}
              />
              <ButtonField
                color="secondary"
                className={
                  filterDatakey
                  ? "filter-btn current-active-filter"
                  : "filter-btn"}
                Icon={FilterIcon}
                buttonText={"Filters"}
                onClick={this.showHideFilterDrawer}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="cr-mov-tab ralated-tabs">
            <LeftTab
              className="tabs"
              orientation="horizontal"
              variant="scrollable"
              options={[...this.state.options]}
              selectedTab={this.state.selectedTab}
              showIcon={false}
              handleChange={this.tabSwitched} />
          </div>
          {appliedFilters?.length > 0 && (
                  <AppliedFilter
                    className="tabs lang-tab filter-scroll"
                    options={appliedFilters}
                    listCount={count}
                  />
            )}
          {page !== 1 && (
            <BottomScrollListener
              onBottom={() => {
                this.nextCall(page);
              }}
            debounce={10000} offset={5}
            />
          )}
          <div className="mapcontent-block tsco-mapcontent">
            {movies}
          </div>
          <InlineLoader
            show={list.length !== 1 && Loader}
          />

          {!list?.length &&
            <div className="mov-l-box whitebox no-recode">
              <b>{constantText.no_record_found}</b>
            </div>}
        </div>
        <div className="sidebarBox">
          <Drawer
            open={showFilterDrawer}
            anchor="right"
            onClose={this.showHideFilterDrawer}
          >
            {this.getFiltersUi()}
          </Drawer>

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
        <CommonModel className='ts-map-popup status-popup' state={showMapContentModal}
          showTitle={true} title={`Map Content`}
          showIcon={false}
          showDes={false} des={`${constantText.transcoding_popup_message} `}
          Form={
            <div className="popup-m-area">
              <div className="pop-meta" onClick={() => this.updatemapcontent(1)}>
                {constantText.transcoding_update_video_and_metadata}
              </div>
              <div className="pop-video-only" onClick={() => this.updatemapcontent(2)}>
                {constantText.transcoding_update_video_only}
              </div>
            </div>
          }
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
        <CommonModel className='popup-wrap status-popup' state={showModalEpisode}
          showTitle={true} title={`Confirmation`}
          showIcon={false}
          showDes={false} des={`Do you want to map the UID ${this.state?.transcodingUid} with this assest (${this.state.externalId})?`}
          btn1Action={() => this.mapTranscodingContentEpisode(true)}
          btn2Action={() => this.closeContentModalEpisode()}
          handleClose={() => this.closeContentModalEpisode()}
        />
      </div>

    )
  }
}

export default MapContent;
