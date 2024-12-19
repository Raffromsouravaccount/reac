import React, { Component } from "react";
import moment from "moment";
import BottomScrollListener from "react-bottom-scroll-listener";

import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";

import BreadcrumbsComp from "../../../_components/Common/BreadCrumbs/BreadCrumbs";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";
import { getLocalData, getSelectedGroup, getCopyObj } from "../../../_helpers/util";
import Config from "../../../Config/config";

import ButtonField from "../../../_components/Common/ButtonField/ButtonField";
import RadioButton from "../../../_components/Common/RadioButton/RadioButton";
import DropDown from "../../Common/DropDown/DropDown";
import { CommonModel } from "../../Common/Model/CommonModel";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";

import FilterIcon from "images/filter-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";

import { collectionConstants } from "./Constants/collection.constants";
import { userConstants } from "../../User/user.constants";
import { history } from "../../../_helpers/history";
import { createQuery } from "../../Common/CommonFunction/CommonFuntion";

import { collectionActions } from "./../../../_actions/collection.actions";
import FormRender from "../../Common/FormHelper/FormRender";
import DatePicker from "../../Common/DatePicker/DatePicker";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import { apiCalls, commonService } from "../../../_services/common.service";
import {completeImagePath} from "../../Common/CommonFunction/CommonFuntion";

//icon
import ViewIcon from "images/view-icon.svg";
// import CopyIcon from "images/copy-icon.svg";
import SortIcon from "images/sort-icon.svg";
import DownArrow from "images/down-arrow.svg";
import DownDisableArrow from "images/down-disable-arrow.svg";
import UpArrow from "images/up-arrow.svg";
import CollectionIcon from "images/video-file.svg";
import NoImage from "images/no-image.svg";


import "./ListCollection.css";
import CollectionCardComponent from "./CollectionCard/CollectionCard";

import {
  sideSelectFilters,
  filterByDate,
  sortingFilters,
} from "./Schema/SideFilter.json";
import { LeftTabListing } from "../../Common/LeftTab/LeftTabListing";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import AppliedFilter from "../../Common/LeftTab/AppliedFilter";
import { LastModifiedBy } from "../../Common/LastModifiedBy/LastModifiedBy";

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
      if (element?.name === "tags" && element?.value) {
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
  Archived: "Archived By",
};
const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : ((
            item.type === "dropdownAsync" ||
            item.type === "dropdown" ||
            item.type === "conditionalDropdown" ||
            item.type === "SearchableWithCreate" 
            )? item.multiple? []: null: ""),
        (item.touched = 0));
      item.valid = true;
      return item;
    });
  }
};
class ListCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabOptions: [],
      selectedLeftTab: 0,
      listCount: 0,
      isRequestIntiate: null,
      changingTab: false,
      maxPage: null,
      appliedFilters: [],
      isFilterUpdate: false,
      collectionList: [],
      allStatus: [],
      searchMode: false,
      contentStateName: "All",
      collectionFilterQuery: {},
      showFilterDrawer: false,
      openSortDrawer: false,
      openBulkDropdown: false,
      queryData: {
        limit: constantText.search_limit,
        page: 1,
        contentState: "",
        searchString: "",
        lastEvaluatedKey: "",
      },
      sort: {
        sortingFilters: JSON.parse(JSON.stringify(sortingFilters)),
        collectionReleaseDate: collectionConstants.collectionReleaseDateVal,
        collectionUnpublished: collectionConstants.collectionUnpublishedVal,
        collectionCreated: collectionConstants.collectionCreatedVal,
        collectionSubmitedToWork:
          collectionConstants.collectionSubmitedToWorkVal,
      },
      filters: {
        formValidity: false,
        filterByDate: JSON.parse(JSON.stringify(filterByDate)),
        selectFilters: DEFAULT_JSON(sideSelectFilters) || [],
        querys: "",
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
          text: constantText.collection_list,
        },
      ],
      currentCollection: null,
      showFilterDrawer: false,
      openSortDrawer: false,
      isUnpublished: false,
      isArchived: false,
      showModelForArchive: false,
      filterDatakey: false,
      sortDatakey: true,
      model: {
        detail: "",
        open: false,
        desc: "",
        btn1: constantText.yes_text,
        btn2: constantText.no_text
      },
    };
  }

  componentDidMount() {
    this.getAllStatus();
    this.fetchLeftTabData();
    this.getAllCollection();
    commonService.getLeftSideBarListing("collection").then((res) => {
      this.setState({ tabOptions: res.menuItems });
    });
  }

  getAllStatus = async() => {
    let response = await apiCalls(`${Config.masterUrl}/ContentState`, 'GET', {}, `/collections`, false);
    if (response) {
      this.setState({allStatus: response});
    }
  }
  fetchLeftTabData = async () => {
      let url = `${Config.collectionCount}`;
      let response = await apiCalls(url, "GET", null, `/collections`, false);
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
  fetchCollection = async (params) => {
    const { isRequestIntiate, collectionList, queryData } = this.state;
    const query = createQuery(params);
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      const url = `${Config.collection}${query ? query : ""}`;
      //ListCall
      let response = await apiCalls(url, "GET", null, `/collections`, false);
      this.setState({ isRequestIntiate: true, changingTab: false });
      if (response) {
        const limit = constantText.search_limit;
        const Count = response?.count ? response?.count : 0;
        const Page = Count ? Math.ceil(Count / limit) : 1;
        const copyQueryData = { ...queryData };
        let newCollectionList = [];
        //If has movieData increase page
        copyQueryData.page = copyQueryData.page + 1;
        newCollectionList = [...collectionList, ...(response?.rows || [])];
        let stateObj = {
          collectionList: newCollectionList,
          listCount: Count || 0,
          queryData: copyQueryData,
          maxPage: Page || 0,
        };
        this.setState(stateObj);
      } else {
        this.setState({ listCount : 0, collectionList: [] });
      }
    }
  };
  getAllCollection = async () => {
    await this.setQueryData();
    const { collectionFilterQuery } = this.state;
    await this.fetchCollection(collectionFilterQuery);
  };
  getAppliedFilter = (JSON, filterByDate) => {
    const checkDate = filterByDate?.find(
      (item) => item.date.startDate && item.date.endDate
    );
    let Arr = [];
    if (checkDate) {
      let obj1 = {};
      let obj2 = {};
      obj1.label = checkDate?.date?.startPlaceholder;
      obj1.value = moment(checkDate?.date?.startDate).format(constantText.date_format_placeholder);
      obj2.label = checkDate?.date?.endPlaceholder;
      obj2.value = moment(checkDate?.date?.endDate).format(constantText.date_format_placeholder);
      Arr.push(obj1);
      Arr.push(obj2);
    }
    JSON?.forEach((item) => {
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
      }
    });
    return Arr;
  };
  setCollectionListData = (collectionList) => {
    collectionList?.data?.map((item) => {
      item["licenceExpDays"] = [];
      item["collectionCountry"] = [];
      item.showDetails = false;
      if (item?.licence?.contentData?.licence?.length > 0) {
        item.licence.contentData.licence.map((licenceItem) => {
          if (licenceItem?.template?.length > 0) {
            licenceItem?.template.map((tempItem) => {
              if (tempItem.CurrentStatus === "Active") {
                let days = Math.sign(
                  moment(tempItem.toDate).diff(Date(), "days")
                );
                let expDays = moment(tempItem.toDate).diff(Date(), "days") <= 5;
                if (days == 1 && expDays) {
                  item["licenceExpDays"].push(expDays);
                }
                if (tempItem?.Country?.length > 0) {
                  tempItem?.Country.map((countryItem) => {
                    let index = countryItem["DisplayName"].indexOf();
                    if (index === -1) {
                      item["collectionCountry"].push(
                        countryItem["DisplayName"]
                      );
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
    return collectionList;
  };
  handleOpenCloseBulkDropDown = () => {
    let { openBulkDropdown } = this.state;
    this.setState({ openBulkDropdown: !openBulkDropdown });
  };
  handleCloseBulkDropdown = () => {
    this.setState({ openBulkDropdown: false });
  };

  showHideStatePopup = (currentCollection) => {
    const { showModelForArchive } = this.state;
    this.setState({
      currentCollection,
      showModelForArchive: !showModelForArchive,
    });
  };

  archiveServerCalls = async (id, data, tabName) => {
    let response = await apiCalls(`${Config.workflowAPI}/${id}`, "PUT", data,`/collections`, false );
    if(response) {
      let {tabOptions} = this.state;
      let tabIndex = tabOptions.findIndex(option => option.displayName === tabName);
      const tabOption = tabOptions.find(item => item.displayName === tabName);
      this.changeTab(tabOption, tabIndex);
      this.fetchLeftTabData();
    }
  }

  setQueryData = async () => {
    const { filters, sort, queryData, isFilterUpdate, collectionFilterQuery } = this.state;
    let updateObj = {
      sort: getCopyObj(sort.sortingFilters),
      paramQuery: getCopyObj(queryData),
    };
    if(isFilterUpdate){
      updateObj = {
        filters: getCopyObj(filters.selectFilters),
        filterByDate: getCopyObj(filters.filterByDate),
        sort: getCopyObj(sort.sortingFilters),
        paramQuery: getCopyObj(queryData),
      };
    }
    this.setState({
      collectionFilterQuery: {
        ...collectionFilterQuery,
        ...updateObj
      }
    });
  };

  showHideFilterDrawer = () => {
    let { showFilterDrawer, limit, filter, searchString } = this.state;
    if (this.checkvalidation()) {
      filter.searchString = searchString ? searchString : "";
      (filter.castTag = ""), (filter.castType = ""), (filter.castBirthday = "");
    }
    this.setState({ showFilterDrawer: !showFilterDrawer, filter: filter });
  };
  goToLinkedCollection = (collection) => {
    history.push(`/collection/link-collections/${collection?.contentId}`);
  };
  showHideSortDrawer = () => {
    let { openSortDrawer } = this.state;
    this.setState({ openSortDrawer: !openSortDrawer });
  };
  handleRoute = (route, contentId) => {
    let { currentUser } = this.props;
    history.push(route, contentId);
  };
  handleConditionRoute = (mode, id = null) => {
    let {archive } = permissionObj?.collections;
    let detail = {};
    detail.contentId = id;
    detail.view = mode;
    if (mode === "create") {
      history.push("/collection/create");
    } else if (mode === "edit" && id) {
      history.push("/collection/edit/" + id);
    }
    else if (mode === 'archive' || mode === 'restore' ) {
      if(archive?.canCreate() || archive?.canUpdate()){
      const { model } = this.state;
      let shallowModel = { ...model };
      shallowModel.detail = detail;
      shallowModel.open = true;
      shallowModel.title = mode === 'archive' ? constantText.archived_content : constantText.restore_content;
      shallowModel.desc = mode === 'archive' ? constantText.archived_content_desc : constantText.restore_content_desc;
      this.setState({ model: shallowModel });
      }
    }
  };
  changeTab = async (tab, index) => {
    const { queryData, collectionFilterQuery } = this.state;
    this.setState({
      collectionList: [],
      changingTab: true,
      selectedLeftTab: index,
      contentStateName: tab.displayName,
      isUnpublished: tab.displayName === "Unpublished" ? true : false,
      isArchived: tab.displayName === "Archived" ? true : false,
      queryData: await {
        ...queryData,
        page: 1,
        contentState: tab.id,
      },
    });
    this.getAllCollection(collectionFilterQuery);
  };

  nextCall = () => {
    const {
      collectionFilterQuery,
      queryData,
      isRequestIntiate,
      maxPage,
    } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getAllCollection(collectionFilterQuery);
    }
  };

  handleDateChange = (type, dateItem, index, event) => {
    let { value } = event?.target;
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
        } else if (value === "") {
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
        } else if (value === "") {
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

  filterData = async () => {
    let { collectionFilterQuery, filters, queryData } = this.state;
    const copyJSON = [...filters.selectFilters];
    this.setState(
      {
        appliedFilters: await this.getAppliedFilter(
          copyJSON,
          filters.filterByDate
        ),
        isFilterUpdate: true,
        filterDatakey: true,
        searchMode: false,
        collectionList: [],
        listCount: 0,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllCollection(collectionFilterQuery);
      }
    );
  };

  checkvalidation = () => {
    const { sortingFilters } = this.state.sort;
    const checkFilter = sortingFilters.find((item) => item.value);
    if (checkFilter) {
      return false;
    } else {
      return true;
    }
  };

  searchHandleChange = (event) => {
    let { name, value } = event?.target;
    let { queryData, collectionFilterQuery } = this.state;
    this.setState(
      {
        queryData: {
          ...queryData,
          page: 1,
          [name]: value,
        },
      },
      () => {
        if (name == "searchVal") {
          this.getAllCollection(collectionFilterQuery);
        }
      }
    );
  };

  clearFilterData = () => {
    const { filters, queryData, sort, contentStateName } = this.state;
    const { filterByDate, selectFilters } = filters;
  
    filterByDate.map((item) => {
      if (item.for === contentStateName) {
        item.date.endDate = "";
        item.date.startDate = "";
      }
    });
    selectFilters.map((filter) => {
      filter.value = filter?.type === "text" ? "" : (filter?.multiple ? [] : null);
    });
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    return new Promise((resolve, reject) => {
      this.setState(
        {
          appliedFilters: [],
          filterDatakey: false,
          collectionList: [],
          filters: {
            ...filters,
            formValidity: checkDate ? true : false,
            selectFilters: selectFilters,
          },
          queryData: {
            ...queryData,
            page: 1,
            contentState: contentStateName === "All" ? "" : queryData?.contentState,
          },
          collectionFilterQuery: {
            filters: getCopyObj(selectFilters),
            filterByDate: getCopyObj(filterByDate),
            sort: getCopyObj(sort.sortingFilters),
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
  clearFilter = () => {
    this.clearFilterData()
      .then(() => {
        this.showHideFilterDrawer();
        this.getAllCollection();
      })
      .catch((err) => {
        console.log(err);
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
    const findIndex = copySelect.findIndex((e) => e.name === "licenseGroupCountries");
    const copyElement = copySelect[findIndex];
    const options = [...copyElement.data];
    copyElement.value = getSelectedGroup(event, group, options, copyElement.value);

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
    let {selectFilters}= filters;
    let response = await apiCalls(`${Config.masterTags}?title=${value}`, "GET", {}, null, false) || [];
    selectFilters[index]["data"] = response
    this.setState(prevState => ({
      filters: {
        ...filters,
        selectFilters
      }
    }));
  }

  clearSortFilter = () => {
    let { sort, queryData } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.map((sortItem) => {
      sortItem.value = "";
    });
    this.setState(
      {
        appliedFilters: [],
        sortDatakey: false,
        collectionList: [],
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
        this.getAllCollection();
      }
    );
  };

  applySortFilter = () => {
    let { queryData } = this.state;
    this.setState(
      {
        sortDatakey: true,
        collectionList: [],
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.showHideSortDrawer();
        this.getAllCollection();
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

  handleSearchableInput = async (value, index) => {
    let { filters } = this.state;
    let {selectFilters}= filters;
    let response = await apiCalls(`/master/Tags?title=${value}`, "GET", {}, null, false) || [];
    selectFilters[index]["data"] = response
    this.setState(prevState => ({
      filters: {
        ...filters,
        selectFilters
      }
    }));
  }


  getFiltersUi = () => {
    let { filters, contentStateName } = this.state;
    let { filterByDate, selectFilters, formValidity } = filters;

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
          <div className="title">{collectionConstants.filter_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="f-filter">
              <div className="bydate-filter">{allDateFilters}</div>
              <Divider className="date-divider" />

              <FormRender
                form={selectFilters}
                handleFocus={this.setmultyData}
                setSelectDataArr={this.setSelectDataArr}
                selectGroup={this.selectCountryGroup}
                onChange={this.filterChange}
                handleAutoCreateInput={this.handleSearchableInput}
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
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData();
            }}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            buttonText={constantText.clear_text}
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
          <div className="title">{collectionConstants.sort_text}</div>
          <div className="side-close-btn" onClick={this.showHideSortDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="status-s">{allSort}</div>
          </div>
          <div className="bottom-w filter-btn">
            <ButtonField
              color="secondary"
              className="apply-btn"
              buttonText={constantText.apply_sort_text}
              disabled={this.checkvalidation()}
              onClick={() => {
                this.applySortFilter();
              }}
            />
            <ButtonField
              color="secondary"
              className="cancle-btn"
              buttonText={constantText.clear_text}
              onClick={this.clearSortFilter}
            />
          </div>
        </div>
      </div>
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

  viewCollectionHandler = (id) => {
    history.push(`/collection/view/${id}`);
  };

  filterChange = (event, elemIndex) => {
    let { filters } = this.state;
    let { selectFilters } = filters;
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

  handleSortFilter = (item, index, event) => {
    let { value } = event?.target;
    let { sort } = this.state;
    let { sortingFilters } = sort;
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
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  };
  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      if (searchString.trim().length >= 3 || searchString.length === 0) {
        this.setState({ collectionList: [],
           searchMode: true,
           queryData: {
            ...queryData,
            page: 1,
          }},()=>{
            this.getAllCollection();
          });

      }
    }, 1000);
  };
  viewFirstChild = async (index, CollectionAsset) =>{
    const { collectionList } = this.state;
    const copyCollectionList = [...collectionList];
    const copyCollection = copyCollectionList[index];
    const isOpen = (!!(copyCollection.isOpened));
    if(isOpen === false && !(!!copyCollection?.childAssets?.length)){
      copyCollection.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(CollectionAsset);
      if(res){
        copyCollection.childAssets = res;
        this.setState({
          collectionList : copyCollectionList
        });
      }
    }
    else {
      copyCollection.isOpened = !isOpen;
      this.setState({
        collectionList : copyCollectionList
      });
    }

  }
  viewSecondChild = async (index, firstIndex, CollectionAsset) =>{
    const { collectionList } = this.state;
    const copyCollectionList = [...collectionList]; 
    const copyCollection = copyCollectionList[index];
    const copyFirstChild = copyCollection?.childAssets[firstIndex];
    const isOpen = (!!(copyFirstChild.isOpened));

    if(isOpen === false && !(!!copyFirstChild?.childAssets?.length)){
      copyFirstChild.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(CollectionAsset);
      if(res){
        copyFirstChild.childAssets = res;
        this.setState({
          collectionList : copyCollectionList
        });
      }
    }
    else{
      copyFirstChild.isOpened = !isOpen;
      this.setState({
        collectionList : copyCollectionList
      });
    }
  }
  viewThirdChild = async (index, firstIndex, secondIndex, CollectionAsset) =>{
    const { collectionList } = this.state;
    const copyCollectionList = [...collectionList];
    const copyCollection = copyCollectionList[index];
    const copyFirstChild = copyCollection?.childAssets[firstIndex];
    const copySecondChild = copyFirstChild?.childAssets[secondIndex];
    const isOpen = (!!(copySecondChild.isOpened));

    if(isOpen === false && !(!!copySecondChild?.childAssets?.length)){
      copySecondChild.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(CollectionAsset);
      if(res){
        copySecondChild.childAssets = res;
        this.setState({
          collectionList : copyCollectionList
        });
      }
    }
    else{
      copySecondChild.isOpened = !isOpen;
      this.setState({
        collectionList : copyCollectionList
      });
    }
  }
  viewFourthChild = async (index, firstIndex, secondIndex, thirdIndex, CollectionAsset) =>{
    const { collectionList } = this.state;
    const copyCollectionList = [...collectionList];
    const copyCollection = copyCollectionList[index];
    const copyFirstChild = copyCollection?.childAssets[firstIndex];
    const copySecondChild = copyFirstChild?.childAssets[secondIndex];
    const copyThirdChild = copySecondChild?.childAssets[thirdIndex];
    const isOpen = (!!(copyThirdChild.isOpened));

    if(isOpen === false && !(!!copyThirdChild?.childAssets?.length)){
      copyThirdChild.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(CollectionAsset);
      if(res){
        copyThirdChild.childAssets = res;
        this.setState({
          collectionList : copyCollectionList
        });
      }
    }
    else{
      copyThirdChild.isOpened = !isOpen;
      this.setState({
        collectionList : copyCollectionList
      });
    }
  }
  viewFifthChild = async (index, firstIndex, secondIndex, thirdIndex, fourthIndex, CollectionAsset) =>{
    const { collectionList } = this.state;
    const copyCollectionList = [...collectionList];
    const copyCollection = copyCollectionList[index];
    const copyFirstChild = copyCollection?.childAssets[firstIndex];
    const copySecondChild = copyFirstChild?.childAssets[secondIndex];
    const copyThirdChild = copySecondChild?.childAssets[thirdIndex];
    const copyFourthChild = copyThirdChild?.childAssets[fourthIndex];
    const isOpen = (!!(copyFourthChild.isOpened));

    if(isOpen === false && !(!!copyFourthChild?.childAssets?.length)){
      copyFourthChild.isOpened = !isOpen;
      const res = await this.fetchAssignedAssets(CollectionAsset);
      if(res){
        copyFourthChild.childAssets = res;
        this.setState({
          collectionList : copyCollectionList
        });
      }
    }
    else{
      copyFourthChild.isOpened = !isOpen;
      this.setState({
        collectionList : copyCollectionList
      });
    }
  }
  fetchAssignedAssets = async (collectionId) => {
      const url = `${Config.assignAssets}/${collectionId}`;
      //ListCall
      let response = await apiCalls(url, "GET", null, `/collections`, false);
      return response;
  }

  handleModel = async (action, model) => {
    let shallowModel = { ...model };
    // Unpublish to Archive
    // Archive to Draft
    if (action && (shallowModel.detail?.view === 'archive' || shallowModel.detail?.view === 'restore')) {
      let { language, allStatus } = this.state;
      const cStatus = shallowModel.detail?.view === 'archive' ? constantText.collectionConstants.unpublished : constantText.collectionConstants.archived;
      const nStatus = shallowModel.detail?.view === 'archive' ? constantText.collectionConstants.archived : constantText.collectionConstants.draft;
      const currentStatus = allStatus.find(item => item?.title === cStatus);
      const nextState = allStatus.find(item => item?.title === nStatus);
      let data = {
        fromState: currentStatus?.id,
        toState: nextState?.id,
        contentType: "collection",
        language,
        contentData: { }
      };
      let tabName = shallowModel.detail?.view === 'archive' ? constantText.collectionConstants.archived : constantText.collectionConstants.draft
      this.archiveServerCalls(model?.detail?.contentId, data, tabName);
    }
    shallowModel.for = "";
    shallowModel.open = false;
    shallowModel.title = "";
    shallowModel.desc = "";
    this.setState({ model: shallowModel });
  }

  render() {
    const {
      links,
      isRequestIntiate,
      changingTab,
      listCount,
      searchMode,
      tabOptions,
      selectedLeftTab,
      typography,
      showFilterDrawer,
      appliedFilters,
      openSortDrawer,
      openBulkDropdown,
      collectionList,
      isUnpublished,
      isArchived,
      sortDatakey,
      filterDatakey,
      queryData,
      model,
      showModelForArchive,
    } = this.state;
    let { searchString, page } = queryData;

    let { canCreate }= permissionObj?.collections?.createCollection;
    let { canView, archive } = permissionObj?.collections;
    const collections = collectionList.map((collection, index) => {
      return (
          <div key={index} className="mov-l-box whitebox colc-listing">
            <div className="colc-parent">
              <div className="mov-info-box flex justify-content-between">
                {(collection?.CollectionAsset && collection?.CollectionAsset?.assetId) ?
                    <div className="icon" data-test="viewFirstChild" onClick={() => this.viewFirstChild(index, collection?.id)}>
                      {collection?.isOpened ? <UpArrow /> : <DownArrow />}
                    </div> :
                    <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">{constantText.collection_no_child_text}</div>
                  </div>
                }
                <div className="left-area flex">
                  <div className="movie-img">
                    {/* */}
                  <img src={collection?.CollectionImages?.[0]?.imageDetails?.url ?
                    completeImagePath(collection?.externalId, "list", collection?.CollectionImages?.[0]?.imageDetails?.url, collection?.CollectionImages?.[0]?.imageDetails?.resolution):
                    "images/no-image.svg"} alt={collection?.CollectionImages?.setName ? collection?.CollectionImages?.setName : "no image"} />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{collection?.title ? collection?.title : "NA"}</h4>
                      {selectedLeftTab == 0 && (
                        <BadgeBox
                          status={collection?.contentState?.title}
                        />
                      )}
                    </div>
                    <LastModifiedBy data={collection || {}} statusText={tabOptions[selectedLeftTab]?.statusText || ""} />
                    <div className="status-text flex">
                      <span className="label">Note</span>
                      <span className="text">
                        {collection?.note ? collection?.note : "NA"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                      <span className="text-id">{constantText.external_id_text}</span>
                      <span className="num-id">{collection?.externalId}</span>
                    </div>
                    <div onClick={() => canView()? this.viewCollectionHandler(collection?.id): {}}
                      className={`mov-icon mov-view tooltip-sec auto-view-${collection?.id}`}>
                      <ViewIcon />
                      <div className="tooltip-box">{constantText.viewCollection}</div>
                    </div>
                    {/* <div
                      className={canCreate()? "mov-icon mov-copy tooltip-sec":
                        "mov-icon mov-copy tooltip-sec disable-f-btn"
                      }
                      className="mov-icon mov-copy tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">{constantText.copyCollection}</div>
                    </div> */}
                    {isUnpublished ? (
                      <div className={`mov-icon mov-archive tooltip-sec auto-archive-${collection?.id}`}>
                        <ArchiveIcon
                          onClick={() => this.handleConditionRoute("archive", collection?.id)}
                        />
                        <div className="tooltip-box">Archive</div>
                      </div>
                    ) : (
                      ""
                    )}
                    {collection?.contentState?.title == constantText.collectionConstants.archived &&
                    <span className="edit tooltip-sec" onClick={() => this.handleConditionRoute("restore", collection?.id)} >
                      <RestoreIcon />
                      <div className="tooltip-box">{archive?.canCreate() ? constantText.tool_tip_restore : constantText.tool_tip_noPermission} </div>
                    </span>
                    }
                  </div>
                </div>
              </div>
              {(collection?.isOpened && collection?.childAssets?.length) ?
              collection?.childAssets.map((firstChild, firstIndex) =>
              (<div key={firstIndex} className="colc-child">
              <div className="mov-info-box flex justify-content-between">
              {(firstChild?.CollectionAsset && firstChild?.CollectionAsset?.assetId) ?
                    <div className="icon" onClick={() => this.viewSecondChild(index, firstIndex, firstChild?.id)}>
                      {firstChild?.isOpened ? <UpArrow /> : <DownArrow />}
                    </div> :
                    <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">{constantText.collection_no_child_text}</div>
                  </div>
                }
                <div className="left-area flex">
                  <div className="movie-img">
                  <img src={firstChild?.CollectionImages?.[0]?.imageDetails?.url?
                    completeImagePath(firstChild?.externalId, "list", firstChild?.CollectionImages?.[0]?.imageDetails?.url, firstChild?.CollectionImages?.[0]?.imageDetails?.resolution):
                    "images/no-image.svg"} alt={firstChild?.CollectionImages?.setName ? firstChild?.CollectionImages?.setName : "no image"} />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{firstChild?.title ? firstChild?.title : "NA"}</h4>
                      {firstChild?.contentState?.title ? <BadgeBox  status={firstChild?.contentState?.title} /> : null }
                    </div>
                    <div className="status-text flex p-b-10">
                      <span className="label">{tabOptions[selectedLeftTab]?.statusText}</span>
                      <span className="text">
                        <span>
                          {firstChild?.lastModifiedByUser
                            ? `${firstChild?.lastModifiedByUser?.first_name} ${firstChild?.lastModifiedByUser?.last_name}`
                            : "NA"}
                        </span>
                        <span>
                          {firstChild?.lastModifiedOn
                            ? moment(firstChild?.lastModifiedOn).format(constantText.date_format_without_time)
                            : "NA"}
                        </span>
                        <span className="mov-time">
                          {firstChild?.lastModifiedOn
                            ? moment(firstChild?.lastModifiedOn).format(
                                "hh:mm A"
                              )
                            : "N/A"}
                        </span>
                      </span>
                    </div>
                    <div className="status-text flex">
                      <span className="label">Note</span>
                      <span className="text">{firstChild?.note ? firstChild?.note : "NA"}</span>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                      <span className="text-id">{constantText.external_id_text}</span>
                      <span className="num-id">{firstChild?.externalId}</span>
                    </div>
                    <div onClick={() => this.viewCollectionHandler(firstChild?.id)} 
                    className={`mov-icon mov-view tooltip-sec auto-view-${firstChild?.id}`}>
                      <ViewIcon />
                      <div className="tooltip-box">{constantText.viewCollection}</div>
                    </div>
                    {/* <div
                      className={canCreate()? "mov-icon mov-copy tooltip-sec":
                        "mov-icon mov-copy tooltip-sec disable-f-btn"
                      }
                      className="mov-icon mov-copy tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">{constantText.copyCollection}</div>
                    </div> */}
                  </div>
                </div>
              </div>
              {(firstChild?.isOpened && firstChild?.childAssets?.length) ?
              firstChild?.childAssets.map((secondChild, secondIndex) =>
              (<div key={secondIndex} className="colc-child">
              <div className="mov-info-box flex justify-content-between">
              {(secondChild?.CollectionAsset && secondChild?.CollectionAsset?.assetId) ?
                    <div className="icon" onClick={() => this.viewThirdChild(index, firstIndex, secondIndex, secondChild?.id)}>
                      {secondChild?.isOpened ? <UpArrow /> : <DownArrow />}
                    </div> :
                    <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">{constantText.collection_no_child_text}</div>
                  </div>
                }
                <div className="left-area flex">
                  <div className="movie-img">
                  <img src={secondChild?.CollectionImages?.[0]?.imageDetails?.url?
                    completeImagePath(secondChild?.externalId, "list", secondChild?.CollectionImages?.[0]?.imageDetails?.url, secondChild?.CollectionImages?.[0]?.imageDetails?.resolution):
                    "images/no-image.svg"} alt={secondChild?.CollectionImages?.setName ? secondChild?.CollectionImages?.setName : "no image"} />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{secondChild?.title ? secondChild?.title : "NA"}</h4>
                      {secondChild?.contentState?.title ? <BadgeBox status={secondChild?.contentState?.title} /> : null }
                    </div>
                    <div className="status-text flex p-b-10">
                    <span className="label">{tabOptions[selectedLeftTab]?.statusText}</span>
                      <span className="text">
                        <span>
                          {secondChild?.lastModifiedByUser
                            ? `${secondChild?.lastModifiedByUser?.first_name} ${secondChild?.lastModifiedByUser?.last_name}`
                            : "NA"}
                        </span>
                        <span>
                          {secondChild?.lastModifiedOn
                            ? moment(secondChild?.lastModifiedOn).format(constantText.date_format_without_time)
                            : "NA"}
                        </span>
                        <span className="mov-time">
                          {secondChild?.lastModifiedOn
                            ? moment(secondChild?.lastModifiedOn).format(
                                "hh:mm A"
                              )
                            : "N/A"}
                        </span>
                      </span>
                    </div>
                    <div className="status-text flex">
                      <span className="label">Note</span>
                      <span className="text">{secondChild?.note ? secondChild?.note : "NA"}</span>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                      <span className="text-id">{constantText.external_id_text}</span>
                      <span className="num-id">{secondChild?.externalId}</span>
                    </div>
                    <div onClick={() => this.viewCollectionHandler(secondChild?.id)}
                     className={`mov-icon mov-view tooltip-sec auto-view-${secondChild?.id}`}>
                      <ViewIcon />
                      <div className="tooltip-box">{constantText.viewCollection}</div>
                    </div>
                    {/* <div
                      className={canCreate()? "mov-icon mov-copy tooltip-sec":
                        "mov-icon mov-copy tooltip-sec disable-f-btn"
                      }
                      className="mov-icon mov-copy tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">{constantText.copyCollection}</div>
                    </div> */}
                  </div>
                </div>
              </div>
              {(secondChild?.isOpened && secondChild?.childAssets?.length) ?
              secondChild?.childAssets.map((thirdChild, thirdIndex) =>
              (<div key={thirdIndex} className="colc-child">
              <div className="mov-info-box flex justify-content-between">
              {(thirdChild?.CollectionAsset && thirdChild?.CollectionAsset?.assetId) ?
                    <div className="icon" onClick={() => this.viewFourthChild(index, firstIndex, secondIndex, thirdIndex, thirdChild?.id)}>
                      {thirdChild?.isOpened ? <UpArrow /> : <DownArrow />}
                    </div> :
                    <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">{constantText.collection_no_child_text}</div>
                  </div>
                }
                <div className="left-area flex">
                  <div className="movie-img">
                  <img src={thirdChild?.CollectionImages?.[0]?.imageDetails?.url?
                    completeImagePath(thirdChild?.externalId, "list", thirdChild?.CollectionImages?.[0]?.imageDetails?.url, thirdChild?.CollectionImages?.[0]?.imageDetails?.resolution):
                    "images/no-image.svg"} alt={thirdChild?.CollectionImages?.setName ? thirdChild?.CollectionImages?.setName : "no image"} />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{thirdChild?.title ? thirdChild?.title : "NA"}</h4>
                      {thirdChild?.contentState?.title ? <BadgeBox status={thirdChild?.contentState?.title} /> : null }
                    </div>
                    <div className="status-text flex p-b-10">
                    <span className="label">{tabOptions[selectedLeftTab]?.statusText}</span>
                      <span className="text">
                        <span>
                          {thirdChild?.lastModifiedByUser
                            ? `${thirdChild?.lastModifiedByUser?.first_name} ${thirdChild?.lastModifiedByUser?.last_name}`
                            : "NA"}
                        </span>
                        <span>
                          {thirdChild?.lastModifiedOn
                            ? moment(thirdChild?.lastModifiedOn).format(constantText.date_format_without_time)
                            : "NA"}
                        </span>
                        <span className="mov-time">
                          {thirdChild?.lastModifiedOn
                            ? moment(thirdChild?.lastModifiedOn).format(
                                "hh:mm A"
                              )
                            : "N/A"}
                        </span>
                      </span>
                    </div>
                    <div className="status-text flex">
                      <span className="label">Note</span>
                      <span className="text">{thirdChild?.note ? thirdChild?.note : "NA"}</span>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                      <span className="text-id">{constantText.external_id_text}</span>
                      <span className="num-id">{thirdChild?.externalId}</span>
                    </div>
                    <div onClick={() => this.viewCollectionHandler(thirdChild?.id)} 
                    className={`mov-icon mov-view tooltip-sec auto-view-${thirdChild?.id}`}>
                      <ViewIcon />
                      <div className="tooltip-box">{constantText.viewCollection}</div>
                    </div>
                    {/* <div
                      className={canCreate()? "mov-icon mov-copy tooltip-sec":
                        "mov-icon mov-copy tooltip-sec disable-f-btn"
                      }
                      className="mov-icon mov-copy tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">{constantText.copyCollection}</div>
                    </div> */}
                  </div>
                </div>
              </div>
              {(thirdChild?.isOpened && thirdChild?.childAssets?.length) ?
              thirdChild?.childAssets.map((fourthChild, fourthIndex) =>
              (<div key={fourthIndex} className="colc-child">
              <div className="mov-info-box flex justify-content-between">
              {(fourthChild?.CollectionAsset && fourthChild?.CollectionAsset?.assetId) ?
                    <div className="icon" onClick={() => this.viewFifthChild(index, firstIndex, secondIndex, thirdIndex, fourthIndex, fourthChild?.id)}>
                      {fourthChild?.isOpened ? <UpArrow /> : <DownArrow />}
                    </div> :
                    <div className="icon tooltip-sec">
                    <DownDisableArrow />
                    <div className="tooltip-box">{constantText.collection_no_child_text}</div>
                  </div>
                }
                <div className="left-area flex">
                  <div className="movie-img">
                  <img src={fourthChild?.CollectionImages?.[0]?.imageDetails?.url?
                    completeImagePath(fourthChild?.externalId, "list", fourthChild?.CollectionImages?.[0]?.imageDetails?.url, fourthChild?.CollectionImages?.[0]?.imageDetails?.resolution):
                    "images/no-image.svg"} alt={fourthChild?.CollectionImages?.setName ? fourthChild?.CollectionImages?.setName : "no image"} />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{fourthChild?.title ? fourthChild?.title : "NA"}</h4>
                      {fourthChild?.contentState?.title ? <BadgeBox status={fourthChild?.contentState?.title} /> : null }
                    </div>
                    <div className="status-text flex p-b-10">
                    <span className="label">{tabOptions[selectedLeftTab]?.statusText}</span>
                      <span className="text">
                        <span>
                          {fourthChild?.lastModifiedByUser
                            ? `${fourthChild?.lastModifiedByUser?.first_name} ${fourthChild?.lastModifiedByUser?.last_name}`
                            : "NA"}
                        </span>
                        <span>
                          {fourthChild?.lastModifiedOn
                            ? moment(fourthChild?.lastModifiedOn).format(constantText.date_format_without_time)
                            : "NA"}
                        </span>
                        <span className="mov-time">
                          {fourthChild?.lastModifiedOn
                            ? moment(fourthChild?.lastModifiedOn).format(
                                "hh:mm A"
                              )
                            : "N/A"}
                        </span>
                      </span>
                    </div>
                    <div className="status-text flex">
                      <span className="label">Note</span>
                      <span className="text">{fourthChild?.note ? fourthChild?.note : "NA"}</span>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                      <span className="text-id">{constantText.external_id_text}</span>
                      <span className="num-id">{fourthChild?.externalId}</span>
                    </div>
                    <div onClick={() => this.viewCollectionHandler(fourthChild?.id)} 
                    className={`mov-icon mov-view tooltip-sec auto-view-${fourthChild?.id}`}>
                      <ViewIcon />
                      <div className="tooltip-box">{constantText.viewCollection}</div>
                    </div>
                    {/* <div
                      className={canCreate()? "mov-icon mov-copy tooltip-sec":
                        "mov-icon mov-copy tooltip-sec disable-f-btn"
                      }
                      className="mov-icon mov-copy tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">{constantText.copyCollection}</div>
                    </div> */}
                  </div>
                </div>
              </div>
              {(fourthChild?.isOpened && fourthChild?.childAssets?.length) ?
              fourthChild?.childAssets.map((fifthChild, fifthIndex) =>
              (<div key={fifthIndex} className="colc-child">
              <div className="mov-info-box flex justify-content-between">
                <div className="icon tooltip-sec">
                      <DownDisableArrow />
                      <div className="tooltip-box">{constantText.collection_no_child_text}</div>
                  </div>
                <div className="left-area flex">
                  <div className="movie-img">
                  <img src={fifthChild?.CollectionImages?.[0]?.imageDetails?.url?
                    completeImagePath(fifthChild?.externalId, "list", fifthChild?.CollectionImages?.[0]?.imageDetails?.url, fifthChild?.CollectionImages?.[0]?.imageDetails?.resolution):
                    "images/no-image.svg"} alt={fifthChild?.CollectionImages?.setName ? fifthChild?.CollectionImages?.setName : "no image"} />
                  </div>
                  <div className="info">
                    <div className="mov-detail flex align-items-center">
                      <h4>{fifthChild?.title ? fifthChild?.title : "NA"}</h4>
                      {fifthChild?.contentState?.title ? <BadgeBox status={fifthChild?.contentState?.title} /> : null }
                    </div>
                    <div className="status-text flex p-b-10">
                    <span className="label">{tabOptions[selectedLeftTab]?.statusText}</span>
                      <span className="text">
                        <span>
                          {fifthChild?.lastModifiedByUser
                            ? `${fifthChild?.lastModifiedByUser?.first_name} ${fifthChild?.lastModifiedByUser?.last_name}`
                            : "NA"}
                        </span>
                        <span>
                          {fifthChild?.lastModifiedOn
                            ? moment(fifthChild?.lastModifiedOn).format(constantText.date_format_without_time)
                            : "NA"}
                        </span>
                        <span className="mov-time">
                          {fifthChild?.lastModifiedOn
                            ? moment(fifthChild?.lastModifiedOn).format(
                                "hh:mm A"
                              )
                            : "N/A"}
                        </span>
                      </span>
                    </div>
                    <div className="status-text flex">
                      <span className="label">Note</span>
                      <span className="text">{fifthChild?.note ? fifthChild?.note : "NA"}</span>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                      <span className="text-id">{constantText.external_id_text}</span>
                      <span className="num-id">{fifthChild?.externalId}</span>
                    </div>
                    <div data-test="viewCollectionHandler" onClick={() => this.viewCollectionHandler(fifthChild?.id)} 
                    className={`mov-icon mov-view tooltip-sec auto-view-${fifthChild?.id}`}>
                      <ViewIcon />
                      <div className="tooltip-box">{constantText.viewCollection}</div>
                    </div>
                    {/* <div
                      className={canCreate()? "mov-icon mov-copy tooltip-sec":
                        "mov-icon mov-copy tooltip-sec disable-f-btn"
                      }
                      className="mov-icon mov-copy tooltip-sec"
                    >
                      <CopyIcon />
                      <div className="tooltip-box">{constantText.copyCollection}</div>
                    </div> */}
                  </div>
                  {(fifthChild?.CollectionAsset && fifthChild?.CollectionAsset?.assetId?.length) ? <div className="mov-link flex justify-content-end">
                        <div className="mov-link-btn">
                          <CollectionIcon />
                          <span>
                          Link Collections +
                          {fifthChild?.CollectionAsset?.assetId?.length}
                          </span>
                        </div>
                    </div> : null}
                </div>
              </div>
              </div>)) : null}
              </div>)) : null}
              </div>)) : null}
              </div>)) : null}
              </div>)) : null}
              </div>
            </div>
      );
    });

    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp className="" links={links} typography={typography} />
        <div className="user-head profile-head flex justify-content-between align-items-center mov-list-head">
          <div
            className="back-user-btn flex align-items-center auto-back-btn"
            data-test="handleRoute"
            onClick={() => this.handleRoute("/dashboard")}
          >
            <div className="text">
              <span>
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{collectionConstants.collection}</span>
              </strong>
            </div>
          </div>
          <div className="s-form flex">
            <input
              type="text"
              className="auto-search"
              name="searchString"
              autoComplete="off"
              placeholder={collectionConstants.searchPlaceHolderText}
              value={searchString || ""}
              onChange={this.searchHandleChange}
              onKeyPress={this.handleKeyPress}
              onKeyUp={this.handleKeyUp}
            />
            <div className="filter-w">
              <ButtonField
                color="secondary"
                className={
                  sortDatakey ? "short-btn current-active-filter" : "short-btn"
                }
                Icon={SortIcon}
                buttonText={"Sort"}
                onClick={this.showHideSortDrawer}
              />
              <ButtonField
                color="secondary"
                className={
                  filterDatakey
                    ? "filter-btn current-active-filter"
                    : "filter-btn"
                }
                Icon={FilterIcon}
                buttonText={"Filters"}
                onClick={this.showHideFilterDrawer}
              />
              <div className="filter-btn outline-drop-btn">
                <DropDown
                  className="dropdown-btn"
                  buttonText={"Bulk Filling"}
                  open={openBulkDropdown}
                  handleOpenClose={this.handleOpenCloseBulkDropDown}
                  handleClose={this.handleCloseBulkDropdown}
                >
                  <MenuItem onClick={() => this.selectBulkFilling("Option 1")}>
                    Bulk Option 1
                  </MenuItem>
                  <MenuItem onClick={() => this.selectBulkFilling("Option 2")}>
                    Bulk Option 2
                  </MenuItem>
                </DropDown>
              </div>
              <div
                disabled={canCreate() ? true : false}
                className={
                  canCreate()
                    ? "btn-create-user auto-createCollection"
                    : "btn-create-user disable-f-btn auto-createCollection"
                }
                onClick={() => this.handleRoute("/collection/create")}
              >
                Create Collection
              </div>
            </div>
          </div>
        </div>

        <div className="list-profile">
          <div className="row gutter-minus-10">
            <div className="col-md-4 col-lg-3 gutter-10">
              <LeftTabListing
                options={tabOptions}
                disableTabs={changingTab}
                selectedTab={selectedLeftTab}
                onChange={this.changeTab}
              />
            </div>

            <div className="col-md-8 col-lg-9 gutter-10">
              {appliedFilters?.length > 0 && (
                <AppliedFilter
                  className="tabs lang-tab filter-scroll"
                  options={appliedFilters}
                  listCount={listCount}
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
              {collections}
              <InlineLoader
                show={collectionList.length !== 0 && !isRequestIntiate}
              />
              {collectionList.length === 0 ? (
                <div className="mov-l-box whitebox no-recode">
                  {isRequestIntiate && !changingTab ? (
                    searchMode ? (
                      searchString ?
                      constantText.no_result_text : 
                      <b>{constantText.no_record_found}</b>
                    ) : (
                      filterDatakey ?
                      <span>
                        <b>{constantText.no_result_filter}</b>{" "}
                        {constantText.no_result_filter_text}
                      </span>
                      :
                      <b>{constantText.no_record_found}</b>
                    )
                  ) : (
                    <InlineLoader
                      show={!isRequestIntiate || collectionList.length === 0}
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
        </div>
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
      </div>
    );
  }
}
export default ListCollection;
