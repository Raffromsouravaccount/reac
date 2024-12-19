import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import moment from "moment";

//Common Components
import { PaginationComp } from "../../../Common/Pagination/Pagination";
import { constantText } from "../../../../_helpers/constants.text";
import ButtonField from "../../../Common/ButtonField/ButtonField";
import LimitDropDown from "../../../Common/LimitDropdown/LimitDropDown";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import RadioButton from "../../../Common/RadioButton/RadioButton";
import ViewJobTable from "./ViewJobTable";
//Helper Files
import Config from "../../../../Config/config";
import { apiCalls } from "../../../../_services/common.service";
import { history } from "../../../../_helpers/history";
import { ViewJobConstant } from "./ViewJob.constant";
import { showSuccessErrorMsg } from '../../../../_actions/alertMessages.action';
//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
import SortIcon from "images/sort-icon.svg";
import LightIcon from "images/light-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import FilterIcon from "images/filter-icon.svg";
//Json
import {
  sortingFilters,
  radioFilters
} from "./Schema/SideFilter.json";
//CSS
import "./BulkUpload.css";

class ViewJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listLoading: true,
      searchVal: "",
      filterDatakey: false,
      sortDatakey: false,
      pendingCount: null,
      successCount: null,
      processingCount: null,
      openSortDrawer: false,
      openFilterDrawer: false,
      thData: ViewJobConstant.tableHeadArr,
      filteredRows: [],
      filteredData: [],
      allJobs: [],
      allRows: [],
      totalRecords: 0,
      sort: {
        sortValidity: false,
        sortingFilters: JSON.parse(JSON.stringify(sortingFilters)),
      },
      filters: {
        formValidity: false,
        radioFilters: JSON.parse(JSON.stringify(radioFilters)),
      },
      page: 1,
      limit: 10,
    };
  }

  componentDidMount() {
    this.fetchJobList();
  }

  refreshJobList = () => {
    this.setState(
      {
        listLoading: true,
        filteredRows: [],
        filteredData: [],
        totalRecords: 0,
        allJobs: [],
        allRows: [],
      },
      () => {
        this.fetchJobList();
      }
    );
  };


  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      const refreshData = () => {
        this.componentDidMount();
      }
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, null);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  reGenerateJobList=async()=>{
    const { match } = this.props;
    const { params } = match;
    let url = `${Config.episodePlaceholderList}`;
    let response = await apiCalls(url, 'POST', {jobId:params.viewId}, null, true, false, this.autoSaveError, Config.BackendPlaceholderApiURL);
    this.fetchJobList()
  }
  fetchJobList = async () => {
    const { limit, filterDatakey } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { viewId } = params;
    let url = `${Config.episodePlaceholderList}?jobId=${viewId}`;
    let response = await apiCalls(url, 'GET', null, null, true, false, this.autoSaveError, Config.BackendPlaceholderApiURL);
    if (response && response.length) {
      const Count = response?.length;
      const data = this.formatListData(response);
      this.setState(
        {
          listLoading: false,
          allRows: data,
          allJobs: data,
          totalRecords: Count,
          pendingCount: response.filter(item=>item.status==="1")?.length > 0 ? response.filter(item=>item.status==="1")?.length : 0,
          successCount:response.filter(item=>item.status==="3")?.length > 0 ? response.filter(item=>item.status==="3")?.length :0,
          processingCount: response?.filter(item=>item.status==="2")?.length>0 ? response?.filter(item=>item.status==="2")?.length :0 ,
        },
        () => {
          if(filterDatakey){
            this.applyFilter();
          }
          else {
            this.filterData();
          }
        }
      );
    } else {
      this.setState({
        listLoading: false,
        allRows: [],
        totalRecords: 0,
        page: 1,
      });
    }
  };
  filterData = () => {
    let { allRows, searchVal } = this.state;
    const filteredData = allRows.filter((item) => {
      let searchItem = `${item?.seasonExternalId} ${item?.tvShowTitle}`;
      return searchItem
        .toLowerCase()
        .includes(searchVal.toString().trim().toLowerCase());
    });
    this.setState(
      (prevState) => ({
        filteredData,
        totalRecords: filteredData.length,
        page: 1,
      }),
      () => this.handlePagination()
    );
  };
  formatListData = (res) => {
    return res?.map((item) => {
      const obj = {};
      ViewJobConstant?.rowKeys?.forEach((key, i) => {
        if (key === "remarks") {
          obj[key] = item[key] ? item[key] : "- - - -";
        } else if (key === "status") {
          const Status = ["NA","Pending","Processing","Success"];
          obj[key] = item[key] ? Status[item[key]] : "NA";
        } else if (key === "modifiedOn") {
          obj[key] = item[key]
            ? moment(item[key]).format(constantText?.datetime_with_second_lt)
            : "NA";
        } else {
          obj[key] = item[key] ? item[key] : "NA";
        }
      });
      return obj;
    });
  };
  handleRoute = (route) => {
    history.push(route);
  };

  handleBack = (route) => {
    history.push({
      pathname: route,
        state: {tab : 2}})
  }

  handlePagination = () => {
    let { filteredData, page, limit } = this.state;
    let skip = limit * (page - 1);
    let length =
      skip + limit < filteredData.length ? skip + limit : filteredData.length;
    let filteredRows = filteredData.slice(skip, length);
    this.setState({ filteredRows });
  };
  handlePage = (event, page) => {
    this.setState({ page }, () => this.handlePagination());
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
    this.setState({
      sort: {
        sortValidity: true,
        sortingFilters: sortingFilters,
      },
    });
  };
  sortData = (order) => {
  const compareLogic = ((a, b) => {
      let fa = a?.lastModifiedOn?.toLowerCase(),
          fb = b?.lastModifiedOn?.toLowerCase();
  
      if (fa < fb) {
          return order === "asc" ? -1 : 1;
      }
      if (fa > fb) {
          return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    let { allRows } = this.state;
    let sort = allRows?.sort(compareLogic);
    this.setState({ sortDatakey: true, allRows: sort },() => this.filterData());
  };
  applySortFilter = () => {
    let { sort } = this.state;
    let { sortingFilters } = sort;
    let index = sortingFilters.findIndex((sortItem) => sortItem?.value);
    this.sortData(sortingFilters[index]?.value);
  };
  clearSortFilter = () => {
    let { sort, queryData } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
      sortItem.value = "";
    });
    this.setState(
      {
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
        this.fetchJobList();
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
        {/* <div className="middle-w">
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
        </div> */}
      </div>
    );
  };
  showHideFilterDrawer = () => {
    let { openFilterDrawer } = this.state;
    this.setState({ openFilterDrawer: !openFilterDrawer });
  };
  handleFilter = (item, index, event) => {
    let { value } = event.target;
    let { filters } = this.state;
    let { radioFilters } = filters;
    radioFilters.forEach((sortItem) => {
      sortItem.value = "";
    });
    radioFilters[index].value = value;
    this.setState({
      filters: {
        formValidity: true,
        radioFilters: radioFilters,
      },
    });
  };
  filter = (value) => {
    const compareLogic = (item => item?.status?.toLowerCase() === value?.toLowerCase());
    let { allJobs, sortDatakey } = this.state;
    let filteredData = allJobs?.filter(compareLogic);
    this.setState(
      (prevState) => ({
        filterDatakey: true, 
        allRows : filteredData,
        totalRecords: filteredData.length,
        page: 1,
      }),
      () => {
        if(sortDatakey){
          this.applySortFilter();
        }
        else {
          this.filterData();
        }
      }
    );
  };
  applyFilter = () => {
    let { filters } = this.state;
    let { radioFilters } = filters;
    let index = radioFilters.findIndex((Item) => Item?.value);
    this.filter(radioFilters[index]?.value);
  };
  clearFilter = () => {
    let { filters, queryData } = this.state;
    let { radioFilters } = filters;
    radioFilters.forEach((Item) => {
      Item.value = "";
    });
    this.setState(
      {
        filterDatakey: false,
        filters: {
          ...filters,
          formValidity: false,
          radioFilters: radioFilters,
        },
        queryData: {
          ...queryData,
          offset: 1,
        },
      },
      () => {
        this.showHideFilterDrawer();
        this.fetchJobList();
      }
    );
  };
  getFilterUi = () => {
    const { filters } = this.state;
    const { radioFilters, formValidity } = filters;
    const allFilter = radioFilters.map((Item, i) => {
      let Filter = Item.display ? (
        <RadioButton
          key={i}
          labelText={Item.label}
          className="zee-radio-field status-field align-items-center"
          name="movieReleaseDate"
          areaLabel="movieReleaseDate"
          value={Item.value}
          onChange={(e) => this.handleFilter(Item, i, e)}
          labelPlacement="end"
          data={Item.data}
        />
      ) : (
        ""
      );
      return Filter;
    });
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
            <div className="status-s inlineGrid">{allFilter}</div>
          </div>
          <div className="bottom-w filter-btn">
            <ButtonField
              color="secondary"
              className="apply-btn"
              disabled={!formValidity}
              buttonText={constantText.apply_filter_text}
              onClick={() => {
                this.showHideFilterDrawer();
                this.applyFilter();
              }}
            />
            <ButtonField
              color="secondary"
              className="cancle-btn"
              disabled={!formValidity}
              buttonText={constantText.clear_text}
              onClick={this.clearFilter}
            />
          </div>
        </div>
      </div>
    );
  };
  searchHandleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.filterData();
    });
  };

  render() {
    const {
      thData,
      searchVal,
      filteredRows,
      totalRecords,
      allRows,
      sortDatakey,
      filterDatakey,
      limit,
      pendingCount,
      successCount,
      processingCount,
      openSortDrawer,
      openFilterDrawer,
      page,
      listLoading,
    } = this.state;

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
              {constantText.bulksOpsConstant.bulk_upload_text}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="user-head profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              onClick={() =>
                this.handleBack(constantText.bulk_update_route)
              }
            >
              <AngleLeftArrow />
            </span>
            <span data-test="ingestion-heading-text">
              {constantText.bulksOpsConstant.bulk_title}
            </span>
          </div>
          <div className="master-form s-form flex align-items-center">
            {allRows?.length ? (
              <div className="flex">
                <BadgeBox status={`${totalRecords} Total`} color={"blue"} />
                <BadgeBox status={`${successCount} Success`} color={"green"} />
                <BadgeBox status={`${pendingCount} Pending`} color={"orange"} />
                <BadgeBox status={`${processingCount} Processing`} color={"darkRed"} />
              </div>
            ) : null}
            <input
              type="text"
              autoComplete="off"
              name="searchVal"
              placeholder={ViewJobConstant.searchText}
              value={searchVal || ""}
              onChange={this.searchHandleChange}
            />
            <div className="filter-w">
              {/* <ButtonField
                color="secondary"
                className={
                  sortDatakey ? "short-btn current-active-filter" : "short-btn"
                }
                Icon={SortIcon}
                buttonText={"Sort"}
                onClick={this.showHideSortDrawer}
              /> */}
              {/* <ButtonField
                color="secondary"
                className={
                  filterDatakey ? "short-btn current-active-filter" : "short-btn"
                }
                Icon={FilterIcon}
                buttonText={"Filter"}
                onClick={this.showHideFilterDrawer}
              /> */}
              <div
                  className={
                     (Number(pendingCount)>0 || Number(processingCount)>0 ) ? "btn-create-user auto-create-movie" : "btn-create-user auto-create-movie disabled"
                      
                  }
                  onClick={() =>
                   {this.reGenerateJobList()}
                  }
                >
                 {constantText.bulksOpsConstant.reGenerate}
                </div>
            </div>
          </div>
        </div>
        <div
          onClick={this.refreshJobList}
          className="refresh-queue flex align-items-center"
        >
          <LightIcon />
          {constantText.please_refresh_text}{" "}
          <span className="ref-link auto-ref-link">
            {constantText.refresh_list_text}
          </span>
        </div>
        <div className="master-table-block">
          <ViewJobTable
            HCell={thData}
            rowData={filteredRows}
            loadingRecords={listLoading}
            rowKeys={ViewJobConstant?.rowKeys}
          />

          <div className="page-nav bor-top p-l-20 p-r-20 flex align-items-center justify-content-between">
            {allRows.length > 0 && (
              <div className="page-dropdown flex align-items-center">
                <LimitDropDown
                  name="limit"
                  value={limit}
                  data={ViewJobConstant?.limitArr}
                  onChange={(event) => {
                    let { name, value } = event.target;
                    this.setState({ [name]: Number(value), page: 1 }, () =>
                      this.handlePagination()
                    );
                  }}
                />
                <div className="page-info">{`Showing ${
                  filteredRows.length > limit ? limit : filteredRows.length
                }
                    of ${totalRecords} records`}</div>
              </div>
            )}
            {totalRecords > limit && (
              <PaginationComp
                count={Math.ceil(totalRecords / limit)}
                page={page}
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
            anchor="right"
            open={openFilterDrawer}
            onClose={this.showHideFilterDrawer}
          >
            {this.getFilterUi()}
          </Drawer>
        </div>
      </div>
    );
  }
}

export default ViewJob;
