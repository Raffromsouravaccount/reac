import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import moment from "moment";

//Common Components
import { constantText } from "../../_helpers/constants.text";
import ButtonField from "../Common/ButtonField/ButtonField";
import BulkDashboardTable from "./BulkDashboardTable";
import { PaginationComp } from "../Common/Pagination/Pagination";
import LimitDropDown from "../Common/LimitDropdown/LimitDropDown";
import RadioButton from "../Common/RadioButton/RadioButton";

//Helper Files
import Config from "../../Config/config";
import { apiCalls } from "../../_services/common.service";
import { history } from "../../_helpers/history";
import { BulkDashboardConstant } from "./BulkDashboard.constant";
import { createQuery } from "../Common/CommonFunction/CommonFuntion";
import { DEFAULT_JSON } from "../../_helpers/util";
import DatePicker from "../Common/DatePicker/DatePicker";
import FormRender from "../Common/FormHelper/FormRender";
import checkValidity from "../Common/FormHelper/FieldValidator";

//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
import LightIcon from "images/light-icon.svg";
import SortIcon from "images/sort-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import FilterIcon from "images/filter-icon.svg";
//jSON
import {
  sideSelectFilters,
  filterByDate,
  sortingFilters,
} from "./Schema/SideFilter.json";
//CSS
import "./BulkDashboard.css";

export const filterValidityCheck = (jsonform) => {
  let formIsValid = false;
  let form = jsonform;
  form.forEach((element) => {
    if (element?.display !== false && element.value) {
      formIsValid = true;
    }
  });
  return { formValidity: formIsValid };
};

class BulkDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listLoading: true,
      blankDate: true,
      showsFilterQuery: {},
      isRequestIntiate: null,
      filterDatakey: false,
      sortDatakey: false,
      showFilterDrawer: false,
      openSortDrawer: false,
      maxPage: null,
      thData: BulkDashboardConstant.tableHeadArr,
      filteredRows: [],
      totalRecords: 0,
      queryData: {
        limit: constantText.search_limit,
        offset: 1,
      },
      sort: {
        sortValidity: false,
        sortingFilters: JSON.parse(JSON.stringify(sortingFilters)),
      },
      filters: {
        formValidity: false,
        filterByDate: JSON.parse(JSON.stringify(filterByDate)),
        selectFilters: DEFAULT_JSON(JSON.parse(JSON.stringify(sideSelectFilters))) || [],
      },
    };
  }

  componentDidMount() {
    this.getAllShows();
  }
  refreshBulkList = () => {
    const { queryData } = this.state;
    const copyQueryData = { ...queryData };
    copyQueryData.offset = 1;
    this.setState(
      {
        listLoading: true,
        filteredRows: [],
        queryData: copyQueryData
      },
      () => {
        this.getAllShows();
      }
    );
  };
  formatListData = (res) => {
    return res?.map((item) => {
      const obj = {};
      BulkDashboardConstant?.rowKeys?.forEach((key, i) => {
       if (key === "createdOn") {
          obj[key] = item[key]
            ? moment(item[key]).format(constantText.date_format_placeholder)
            : "NA";
        }else {
          obj[key] = item[key] ? item[key] : "NA";
        }
      });
      obj["createdTime"] = item["createdOn"]
      ? moment(item["createdOn"]).format(constantText.time_with_second_lt)
      : "NA";
      return obj;
    });
  };
  handleRoute = (route) => {
    history.push(route);
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
  getAllShows = async () => {
    await this.setQueryData();
    const { showsFilterQuery } = this.state;
    await this.fetchShows(showsFilterQuery);
  };
  fetchShows = async (params) => {
    const { isRequestIntiate, queryData, filteredRows } = this.state;
    const query = createQuery(params);
    const limit = constantText.search_limit;
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      const url = `${Config.bulkPublishStatus}${query ? query : ""}`;
      //ListCall
      let response = await apiCalls(url, "GET", null, constantText.bulk_dashboard_route, false);

      if (response?.rows?.length) {
        const Count = response?.count;
        const maxPage = Count ? Math.ceil(Count / limit) : 1;
        const data = this.formatListData(response?.rows);
        let newStatusList = [...(data || [])];
        this.setState({
          isRequestIntiate: true,
          listLoading: false,
          filteredRows: newStatusList,
          totalRecords: Count,
          maxPage,
        });
      } else {
        this.setState({
          isRequestIntiate: true,
          listLoading: false,
          filteredRows: [],
          maxPage: null,
        });
      }
    }
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
          filterByDate[index].date.startDate = moment(value).format(constantText?.placeholder_date_Format);
        } else if (value === "") {
          filterByDate[index].date.startDate = moment(value).format(constantText?.placeholder_date_Format);
        }
      } else {
        filterByDate[index].date.startDate = moment(value).format(constantText?.placeholder_date_Format);
      }
      startDate = value;
    } else {
      if (startDate) {
        if (moment(value).isSameOrAfter(startDate)) {
          filterByDate[index].date.endDate = moment(value).format(constantText?.placeholder_date_Format);
        } else if (value === "") {
          filterByDate[index].date.endDate = moment(value).format(constantText?.placeholder_date_Format);
        }
      } else {
        filterByDate[index].date.endDate = moment(value).format(constantText?.placeholder_date_Format);
      }
      endDate = value;
    }
    //Date Validation end
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck([...selectFilters]);
    this.setState({
      blankDate: startDate === "" && endDate === "",
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
  filterChange = (event, elemIndex) => {
    let { filters, blankDate } = this.state;
    let { selectFilters, filterByDate } = filters;
    const copyJSON = [...selectFilters];
    const updatedElement = copyJSON[elemIndex];
    updatedElement.value = event.target.value;

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
    this.setState({
      filters: {
        ...filters,
        formValidity: formValidity
          ? blankDate
            ? formValidity
            : checkDate && formValidity
          : checkDate,
        selectFilters: copyJSON,
      },
    });
  };
  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };
  showHideSortDrawer = () => {
    let { openSortDrawer } = this.state;
    this.setState({ openSortDrawer: !openSortDrawer });
  };
  handleSortFilter = (item, index, event) => {
    let { value } = event.target;
    let { sort } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
        sortItem.value = "";
    });
    sortingFilters[index].value = value;
    const { formValidity } = filterValidityCheck(sortingFilters);
    this.setState(
      {
        sort: {
          sortValidity: formValidity,
          sortingFilters: sortingFilters,
        },
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
        filteredRows: [],
        sortDatakey: true,
        searchMode: false,
        queryData: {
          ...queryData,
          offset: 1,
        },
      },
      () => {
        this.getAllShows();
      }
    );
  };
  clearSortFilter = () => {
    let { sort, queryData } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
      sortItem.value = "";
    });
    this.setState(
      {
        filteredRows: [],
        sortDatakey: false,
        sort: {
          ...sort,
          sortValidity: false,
          sortingFilters: sortingFilters,
        },
        queryData: {
          ...queryData,
          offset: 1,
        },
      },
      () => {
        this.showHideSortDrawer();
        this.getAllShows();
      }
    );
  };
  clearFilterData = () => {
    const { filters, queryData } = this.state;
    const { filterByDate } = filters;

    filterByDate.map((item) => {
        item.date.endDate = "";
        item.date.startDate = "";
    });
    const selectFilters = [...this.state.filters.selectFilters];
    selectFilters.map((filter) => {
      filter.value =
        filter?.type === "text" ? "" : filter?.multiple ? [] : null;
    });
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    return new Promise((resolve, reject) => {
      this.setState(
        {
          filterDatakey: false,
          blankDate: true,
          filteredRows: [],
          filters: {
            ...filters,
            formValidity: checkDate
              ? true
              : false,
            selectFilters: selectFilters,
          },
          queryData: {
            ...queryData,
            offset: 1
          },
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
        this.getAllShows();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  filterData = async () => {
    let { queryData } = this.state;
    this.setState(
      {
        filterDatakey: true,
        searchMode: false,
        filteredRows: [],
        queryData: {
          ...queryData,
          offset: 1,
        },
      },
      () => {
        this.getAllShows();
      }
    );
  };
  getSortUi = () => {
    const { sort } = this.state;
    const { sortingFilters, sortValidity } = sort;
    const allSort = sortingFilters.map((sortItem, i) => {
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
          <div className="title">{constantText.sort_text}</div>
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
              disabled={!sortValidity}
              buttonText={constantText.apply_sort_text}
              onClick={() => {
                this.showHideSortDrawer();
                this.applySortFilter();
              }}
            />
            <ButtonField
              color="secondary"
              className="cancle-btn"
              disabled={!sortValidity}
              buttonText={constantText.clear_text}
              onClick={this.clearSortFilter}
            />
          </div>
        </div>
      </div>
    );
  };
  getFiltersUi = () => {
    let { filters } = this.state;
    let { filterByDate, selectFilters, formValidity } = filters;

    let allDateFilters = null;
    if (filterByDate && filterByDate.length) {
      allDateFilters = filterByDate.map((filterDate, i) => {
          filterDate.display = true;

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
                  minDateValue={filterDate.date.endDate && moment(filterDate.date.endDate).subtract(constantText.filterDateRangeMonthCount,'months') || undefined}
                  onChange={(e) =>
                    this.handleDateChange("startDate", filterDate, i, e)
                  }
                  className="zee-input-field filter-drower-custom"
                />
              </div>
              <div className="col-sm-6">
                <DatePicker
                  type="date"
                  placeholder={filterDate.date.endPlaceholder}
                  value={filterDate.date.endDate}
                  maxDateValue={filterDate.date.startDate && moment(filterDate.date.startDate).add(constantText.filterDateRangeMonthCount,'months') || undefined}
                  onChange={(e) =>
                    this.handleDateChange("endDate", filterDate, i, e)
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
          <div className="title">{constantText.filters_header_text}</div>
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
            buttonText={constantText.clear_text}
            data-test="tvshows-clearFilter"
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };
  handlePage = (event, offset) => {
    const { queryData } = this.state;
    this.setState({ queryData: {
       ...queryData,
       offset
      } }, () => {
      this.getAllShows();
    });
  };

  render() {
    const {
      thData,
      filteredRows,
      showFilterDrawer,
      filterDatakey,
      openSortDrawer,
      sortDatakey,
      queryData,
      totalRecords,
      listLoading,
    } = this.state;
    const { limit, offset } = queryData;

    return (
      <div className="d-wrap c-n">
        <div className="bread-crumb top-minus-20">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link
              color="inherit"
              onClick={() => this.handleRoute(constantText.dashboard_route)}
            >
              {constantText.dashBoard_text}
            </Link>
            <Link
              color="inherit"
              onClick={() => this.handleRoute(constantText.bulk_update_route)}
            >
              {constantText?.bulksOpsConstant?.bulk_title}
            </Link>
            <Typography color="textPrimary">
              {constantText.bulk_dashboard_text}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="user-head profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              onClick={() => this.handleRoute(constantText.bulk_update_route)}
            >
              <AngleLeftArrow />
            </span>
            <span data-test="ingestion-heading-text">{constantText.bulk_dashboard_text}</span>
          </div>
          <div className="s-form flex">
              <div className="filter-w">
                <ButtonField
                  color="secondary"
                  className={sortDatakey
                        ? "short-btn current-active-filter"
                        : "short-btn"
                  }
                  Icon={SortIcon}
                  buttonText={"Sort"}
                  onClick={this.showHideSortDrawer}
                />
                <ButtonField
                  color="secondary"
                  className={filterDatakey
                        ? "filter-btn current-active-filter auto-filter-movie"
                        : "filter-btn auto-filter-movie"
                  }
                  Icon={FilterIcon}
                  buttonText={"Filters"}
                  onClick={this.showHideFilterDrawer}
                />
            
              </div>

          </div>
        </div>
        <div
          className="refresh-queue flex align-items-center"
        >
          <LightIcon />
          {constantText.please_refresh_text}{" "}
          <span onClick={this.refreshBulkList} className="ref-link auto-ref-link">
            {constantText.refresh_list_text}
          </span>
        </div>
        <div className="master-table-block">
          <BulkDashboardTable
            HCell={thData}
            downloadJSON={this.downloadJSON}
            rowData={filteredRows}
            loadingRecords={listLoading}
            rowKeys={BulkDashboardConstant?.rowKeys}
          />

          <div className="page-nav bor-top p-l-20 p-r-20 flex align-items-center justify-content-between">
            {filteredRows.length > 0 && (
              <div className="page-dropdown flex align-items-center">
                <LimitDropDown
                  name="limit"
                  value={limit}
                  data={BulkDashboardConstant?.limitArr}
                  onChange={(event) => {
                    let { name, value } = event.target;
                    this.setState({ queryData: { ...queryData, offset: 1, [name]: Number(value) } }, () =>
                      this.getAllShows()
                    );
                  }}
                />
                <div className="page-info">{`Showing ${
                  filteredRows?.length > limit ? limit : filteredRows?.length
                }
                    of ${totalRecords} records`}</div>
              </div>
            )}
            {totalRecords > limit && (
              <PaginationComp
                count={Math.ceil(totalRecords / limit)}
                page={offset}
                showFirstButton={true}
                showLastButton={true}
                onChange={this.handlePage}
              />
            )}
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
      </div>
    );
  }
}

export default BulkDashboard;
