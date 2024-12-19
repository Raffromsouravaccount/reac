import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";

//Common Components
import { PaginationComp } from "../Common/Pagination/Pagination";
import { constantText } from "../../_helpers/constants.text";
import LimitDropDown from "../Common/LimitDropdown/LimitDropDown";
import ButtonField from "../Common/ButtonField/ButtonField";
import IngestionTable from "./IngestionTable";
//Helper Files
import Config from "../../Config/config";
import {
  DEFAULT_JSON,
} from "../Common/FormHelper/FormValidSetter";
import checkValidity from "../Common/FormHelper/FieldValidator";
import DatePicker from "../Common/DatePicker/DatePicker";
import FormRender from "../Common/FormHelper/FormRender";
import { apiCalls } from "../../_services/common.service";
import { history } from "../../_helpers/history";
import { ingestionConstant } from "./Ingestion.constant";
import { showSuccessErrorMsg } from "../../_actions/alertMessages.action";
import { createQuery } from "../Common/CommonFunction/CommonFuntion";

//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
import LightIcon from "images/light-icon.svg";
import FilterIcon from "images/filter-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
//CSS
import "./IngestionList.css";
//JSON
import {
  sideSelectFilters,
  filterByDate,
} from "./Schema/SideFilter.json";

export const filterValidityCheck = (jsonform) => {
  let formIsValid = jsonform?.some(e => e?.value?.length);
  return { formValidity: formIsValid };
};

class IngestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listLoading: true,
      searchVal: "",
      openDrawer: false,
      blankDate: true,
      filterDatakey: false,
      showWarningPopup: false,
      showFilterDrawer: false,
      showStatusPopup: false,
      currentRow: null,
      selectedTab: 0,
      allData: [],
      modelTitle: "",
      modelDesc: "",
      maxPage: null,
      listFilterQuery: {},
      filters: {
        formValidity: false,
        filterByDate: JSON.parse(JSON.stringify(filterByDate)),
        selectFilters: DEFAULT_JSON(sideSelectFilters) || [],
      },
      queryData:{
        externalid: "",
        offset: 1,
        limit: 10
      },
      thData: ingestionConstant.tableHeadArr,
      filteredRows: [],
      totalRecords: 0,
    };
  }

  componentDidMount() {
    this.fetchIngestionList();
  }
  refreshIngestionList = () => {
    this.setState(
      {
        listLoading: true,
        allData: [],
        filteredRows: [],
      },
      () => {
        this.fetchIngestionList();
      }
    );
  };
  setQueryData = async () => {
    const { filters, queryData } = this.state;
    this.setState({
      listFilterQuery: await {
        filters: filters.selectFilters,
        filterByDate: filters.filterByDate,
        paramQuery: queryData
      },
    });
  };
  filterData = async () => {
    this.setState(
      {
        filterDatakey: true,
        searchMode: false,
        allData: [],
        filteredRows: [],
        totalRecords: 0,
        maxPage: null
      },
      () => {
        this.fetchIngestionList();
      }
    );
  };
  clearFilter = () => {
    const { filters, queryData } = this.state;
    const { filterByDate, selectFilters } = filters;
    //Clear Date
    filterByDate.forEach((item) => {
      if (item?.display) {
        item.date.endDate = "";
        item.date.startDate = "";
      }
    });
    //Clear Select
    selectFilters.map((filter) => {
      filter.value =
        filter?.type === "text" ? "" : filter?.multiple ? [] : null;
    });
    this.setState({
      filterDatakey: false,
      filters: {
        ...filters,
        formValidity: false,
        selectFilters,
        filterByDate
      },
      queryData: {
        ...queryData,
        offset: 1
      }
    },() => {
        this.showHideFilterDrawer();
        this.fetchIngestionList();
      });
  };
  fetchIngestionList = async () => {
    await this.setQueryData();
    const { queryData, listFilterQuery } = this.state;
    const { limit } = queryData;
    const query = createQuery(listFilterQuery);
    const response = await apiCalls(
      `${Config?.ingestionCmsStatus}${query ? query : ""}`,
      "GET",
      {},
      "/ingestion-dashboard",
      false
    );
    if (response && response?.rows?.length) {
      const Count = response?.count;
      const maxPage = Count ? Math.ceil(Count / limit) : 1;
      const data = this.formatListData(JSON.parse(JSON.stringify([...response?.rows])));
      this.setState({
        listLoading: false,
        filteredRows: data,
        allData: response?.rows || [],
        totalRecords: Count,
        maxPage,
      });
    } else {
      this.setState({
        listLoading: false,
        filteredRows: [],
        allData: [],
        totalRecords: 0,
        maxPage: null,
      });
    }
  };
  getStatusText = (value, third = '') => {
    let STATUS = ['Fail','Pass', third];
    return value ? STATUS[value] : ingestionConstant?.blankText;
  }
  formatListData = (res) => {

    return res?.map((row) => {
      const obj = {};
      ingestionConstant?.rowKeys?.forEach((key) => {
        if (key === "ottStatus") {
          let lastObj = row[key] && row[key]?.length
              ? row[key][row[key]?.length - 1]
              : null;

              if(lastObj && lastObj?.publish == 2){
                obj[key] = `Unpublish: Pass`;
              }
              else if(lastObj){
                obj[key] = `Publish: ${this.getStatusText(
                  lastObj?.publish
                )}\nImage: ${this.getStatusText(
                  lastObj?.imageCopy
                )}\nValidation: ${this.getStatusText(lastObj?.validation)}`;
              }

        } else if (key === "middlewareStatus") {

          let lastObj = row[key] && row[key]?.length
              ? row[key][row[key]?.length - 1]
              : null;

              if(lastObj && lastObj?.ingestionPublish == 2){
                obj[key] = `Unpublish: Pass`;
              }
              else if(lastObj){
                obj[key] = `Publish: ${this.getStatusText(
                  lastObj?.ingestionPublish
                )}\nImage: ${this.getStatusText(
                  lastObj?.ingestionImageUpload
                )}\nJson: ${this.getStatusText(lastObj?.ingestionJsonUpload)}`;
              }

        } else if (key === "axinomStatus") {
          let lastObj =
            row[key] && row[key]?.length
              ? row[key][row[key]?.length - 1]
              : null;
              if(lastObj && lastObj?.jobName && lastObj?.metaState){
                obj[key] = `Job Name: ${lastObj?.jobName}\nMeta: ${lastObj?.metaState}`;
              }
              else if(lastObj && lastObj?.metaState){
                obj[key] = `Meta: ${lastObj?.metaState}`;
              }
        } else if (key === "sqsContentStatus") {
          let lastObj =
            row[key] && row[key]?.length
              ? row[key][row[key]?.length - 1]
              : null;
              if(lastObj && lastObj?.message){
                obj[key] = `Message: ${lastObj?.message}`;
              }
        } else if (key === "createdOn" || key === "modifiedOn") {
          obj[key] = row[key]
            ? moment(row[key]).format(constantText?.date_format_placeholder_with_full_time)
            : "NA";
        } else {
          obj[key] = row[key] ? row[key] : "NA";
        }
      });
      obj["id"] = row["id"];
      return obj;
    });
  };
  handleRoute = (route) => {
    history.push(route);
  };
  handleSearch = (e) => {
    const { name, value } = e.target;
    const { queryData } = this.state;
    this.setState({ queryData : {...queryData, [name]: value }});
  };
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  };
  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { externalid } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      let searchMode = externalid?.length === 0 ? false : true;
      if (externalid.trim().length >= 3 || externalid?.length === 0) {
        this.setState(
          {
            allData: [],
            filteredRows: [],
            listLoading: true,
            totalRecords: 0,
            searchMode,
            queryData: {
              ...queryData,
              offset: 1,
            },
          },
          () => {
            this.fetchIngestionList();
          }
        );
      }
    }, 500);
  };
  closeWarningPopup = () => {
    this.setState({
      showWarningPopup: false,
    });
  };
  showHideWarningPopup = (warnMode, data) => {
    const { showWarningPopup } = this.state;
    const updateObj = {
      showWarningPopup: !showWarningPopup,
    };
    if (data && warnMode) {
      if (warnMode === "Error") {
        updateObj.modelTitle = warnMode;
        updateObj.modelDesc = data;
      } else {
        updateObj.modelTitle = warnMode;
        updateObj.modelDesc = Array.isArray(data) ? data?.join() : data;
      }
    }
    this.setState(updateObj);
  };

  handlePage = (event, offset) => {
    const { queryData } = this.state;
    this.setState({ queryData : { ...queryData, offset} }, () => {
      this.fetchIngestionList();
    });
  };
  refreshHandler = async (row) => {
    try {
      const { filteredRows } = this.state;
      const copyfilteredRows = [...filteredRows];
      const findIndex = copyfilteredRows.findIndex((e) => e?.id === row.id);
      copyfilteredRows[findIndex].isRefreshing = true;
      this.setState({ filteredRows: copyfilteredRows });
      const response = await apiCalls(
        `${Config?.ingestionCmsStatus}/${row.externalId}`,
        "GET",
        {},
        "/ingestion-dashboard",
        false
      );
      if (response) {
        let items = [...this.state.filteredRows];
        items[findIndex] = response;
        const data = this.formatListData(items);
        const dataIndex = data.findIndex((e) => e?.id === row.id);
        const selected = { ...data[dataIndex] };
        copyfilteredRows[findIndex] = selected;
        copyfilteredRows[findIndex].isRefreshing = false;
        this.setState({ filteredRows: copyfilteredRows });
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };


  downloadJSON = async () => {
    const { currentRow } = this.state;
    const { externalId } = currentRow;
    try{
      const response = await apiCalls(
        `${Config.axinomCmsStatus}/${Config.downloadJson}/${externalId}`,
        "GET",
        {}
      );
      if (response && Object.keys(response).length > 0) {
      var zip = new JSZip();
      for(let key in response){
        zip.file(key, JSON.stringify(response[key]));
      }
      zip.generateAsync({type:"blob"}).then(function(content) { 
        saveAs(content, `${externalId}.zip`);
    });
     }else{
      showSuccessErrorMsg(constantText.noZip, null, 'error');
     }}catch(error){
      console.error(error)
      return
    }
  };
  getDrawerUi = () => {

    const publishToggleText = (val) => {
      return val == 2 ? "Unpublish" : "Publish";
    }
    const { currentRow } = this.state;
    let { ottStatus, axinomStatus, middlewareStatus, sqsContentStatus } = currentRow || {};
    ottStatus = ottStatus || []; 
    axinomStatus = axinomStatus || []; 
    middlewareStatus = middlewareStatus || []; 
    sqsContentStatus = sqsContentStatus || []; 

    const jobIds = {};
    const createdata = (name, statusArray) => {
      statusArray.forEach( status => {
        if(status.jobId) {
          jobIds[status?.jobId] ? jobIds[status?.jobId][name] = status : jobIds[status?.jobId] = { [name]: status };
          //Set Date
          jobIds[status?.jobId] && status?.updatedOn
            ? (jobIds[status?.jobId]["recordDate"] = status?.updatedOn)
            : jobIds[status?.jobId] && status?.createdOn
            ? (jobIds[status?.jobId]["recordDate"] = status?.createdOn)
            : null;
        }
      })
    }
    if (ottStatus?.length) { createdata('ottStatus', ottStatus) }
    if (axinomStatus?.length) { createdata('axinomStatus', axinomStatus) }
    if (middlewareStatus?.length) { createdata('middlewareStatus', middlewareStatus) }
    if (sqsContentStatus?.length) { createdata('sqsContentStatus', sqsContentStatus) }

    const Rows = (Object.keys(jobIds)?.map((key, index) => {
      const { recordDate, ottStatus, axinomStatus, sqsContentStatus, middlewareStatus } = jobIds[key] || {};
      return (
      <div key={index} className="ing-box whitebox">
        <div className="date-time flex align-items-center justify-content-between">
          <span className="date">
            Date :{" "}
            {recordDate
              ? moment(recordDate).format(
                  constantText?.date_format_without_time
                )
              : ingestionConstant?.blankText}
          </span>
          <span className="date">
            JobId :{" "}
            {key ? key : ingestionConstant?.blankText}
          </span>
        </div>
        
        <div className="ing-st-list">
          <div className="ing-row flex">
            <div className="heading left"><h6>OTT</h6></div>
            <div className="right">
              <div className="row">
                <div className="col-3">
                  <div className="label">Validation</div>  
                  <div className="value">
                    {this.getStatusText(ottStatus?.validation)}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">Image</div>
                  <div className="value">
                    {this.getStatusText(ottStatus?.imageCopy)}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">{publishToggleText(ottStatus?.publish)}</div>
                  <div className="value">
                    {this.getStatusText(ottStatus?.publish, ingestionConstant?.passText)}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">Time</div>
                  <div className="value">
                    {ottStatus?.updatedOn ? moment(ottStatus?.updatedOn).format(constantText?.time_with_second_lt) : ingestionConstant?.blankText}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ing-row flex">
            <div className="heading left"><h6>Middleware</h6></div>
            <div className="right">
              <div className="row">
                <div className="col-3">
                  <div className="label">Json</div>
                  <div className="value">
                    {this.getStatusText(middlewareStatus?.ingestionJsonUpload)}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">Image</div>
                  <div className="value">
                    {this.getStatusText(middlewareStatus?.ingestionImageUpload)}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">{publishToggleText(middlewareStatus?.ingestionPublish)}</div>
                  <div className="value">
                    {this.getStatusText(middlewareStatus?.ingestionPublish, ingestionConstant?.passText)}
                  </div>
                </div>
                <div className="col-3">
                      <div className="label">Time</div>
                      <div className="value">
                        {middlewareStatus?.updatedOn ? moment(middlewareStatus?.updatedOn).format(constantText?.time_with_second_lt) : ingestionConstant?.blankText}
                      </div>
                    </div>
              </div>
            </div>
          </div>
          <div className="ing-row flex">
            <div className="heading left"><h6>Axinom</h6></div>
            <div className="right">
              <div className="row">
                <div className="col-6">
                  <div className="label">Job Name</div>
                  <div className="value">
                  {axinomStatus?.jobName ? axinomStatus?.jobName : ingestionConstant?.blankText}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">Meta</div>
                  <div className="value">
                  {axinomStatus?.metaState ? axinomStatus?.metaState : ingestionConstant?.blankText}
                  </div>
                </div>
                <div className="col-3">
                  <div className="label">Time</div>
                  <div className="value">
                    {axinomStatus?.updatedOn ? moment(axinomStatus?.updatedOn).format(constantText?.time_with_second_lt) : ingestionConstant?.blankText}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ing-row flex">
            <div className="heading left"><h6>SQSTracker</h6></div>
            <div className="right">
              <div className="row">
                  <div className="col-9">
                    <div className="label">Message</div>
                    <div className="value">
                    {this.getStatusText(sqsContentStatus?.message)}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="label">Time</div>
                    <div className="value">
                      {sqsContentStatus?.createdOn ? moment(sqsContentStatus?.createdOn).format(constantText?.time_with_second_lt) : ingestionConstant?.blankText}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>                    
      </div>                    
    )}));

    return (
      <div className="sidebarBox remove-btn">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{"View"}</div>
          <div className="side-close-btn" onClick={this.showHideDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="actions-btn flex align-items-center justify-content-between p-b-10">
                <span>{constantText?.click_to_download_file} &nbsp; {" "}</span>
                <div className={"ref-link"} onClick={this.downloadJSON}><strong>{constantText?.download_file}</strong></div>
              </div>
            {( Rows?.length ? Rows?.reverse() : (
                  <div
                    className={"flex align-items-center justify-content-center"}
                  >
                  {constantText?.no_record_found}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };
 showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };
  getFiltersUi = () => {
    let { filters } = this.state;
    let { filterByDate, selectFilters, formValidity } = filters;

    let allDateFilters = null;
    if (filterByDate && filterByDate.length) {
      allDateFilters = filterByDate.map((filterDate, i) => {
        //display true
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
                  data-test="episode-handleDateChange"
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
            data-test="episode-applyFilter"
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData();
            }}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            disabled={!formValidity}
            buttonText={constantText.clear_text}
            data-test="episode-clearFilter"
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };
  handleDateChange = (type, index, event) => {
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
        if (moment(value).isSameOrBefore(endDate) || value === "") {
          filterByDate[index].date.startDate = value
          ? moment(value).format(constantText?.placeholder_date_Format)
          : value;
        }
      } else {
        filterByDate[index].date.startDate = value
        ? moment(value).format(constantText?.placeholder_date_Format)
        : value;
      }
      startDate = value;
    } else {
      if (startDate) {
        if (moment(value).isSameOrAfter(startDate) || value === "") {
          filterByDate[index].date.endDate = value
          ? moment(value).format(constantText?.placeholder_date_Format)
          : value;
        }
      } else {
        filterByDate[index].date.endDate = value
        ? moment(value).format(constantText?.placeholder_date_Format)
        : value;
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
            : (!!checkDate) && formValidity
          : (!!checkDate),
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
  showHideDrawer = (e, rowIndex = null) => {
    let { openDrawer, allData } = this.state;
    let obj = null;
    if(rowIndex !== null){
      const { ottStatus, externalId, axinomStatus, middlewareStatus, sqsContentStatus } = allData[rowIndex];
      obj = { ottStatus, externalId, axinomStatus, middlewareStatus, sqsContentStatus };
    }
    this.setState({ openDrawer: !openDrawer, currentRow: obj });
  };

  render() {
    const {
      thData,
      filterDatakey,
      openDrawer,
      filteredRows,
      showFilterDrawer,
      totalRecords,
      queryData,
      listLoading,
    } = this.state;
    const { offset, limit, externalid } = queryData;
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
            <Typography color="textPrimary">
              {constantText.ingestion_text}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              onClick={() => this.handleRoute(constantText.dashboard_route)}
            >
              <AngleLeftArrow />
            </span>
            <span data-test="ingestion-heading-text">
              {constantText.ingestion_text}
            </span>
          </div>
          <div className="master-form s-form flex">
            <input
              className="auto-search"
              type="text"
              autoComplete="off"
              name="externalid"
              onChange={this.handleSearch}
              onKeyPress={this.handleKeyPress}
              onKeyUp={this.handleKeyUp}
              placeholder={ingestionConstant.searchText}
              value={ externalid || ""}
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
              data-test="ingestion-filter"
              onClick={this.showHideFilterDrawer}
            />
          </div>
        </div>
        <div
          className="refresh-queue flex align-items-center"
        >
          <LightIcon />
          {constantText.please_refresh_text}{" "}
          <span onClick={this.refreshIngestionList} className="ref-link auto-ref-link">
            {constantText.refresh_ingestion_text}
          </span>
        </div>
        <div className="master-table-block">
          <IngestionTable
            HCell={thData}
            rowData={filteredRows}
            showHideDrawer={this.showHideDrawer}
            loadingRecords={listLoading}
            rowKeys={ingestionConstant?.rowKeys}
          />

          <div className="page-nav bor-top p-l-20 p-r-20 flex align-items-center justify-content-between">
            {filteredRows.length > 0 && (
              <div className="page-dropdown flex align-items-center">
                <LimitDropDown
                  name="limit"
                  value={limit}
                  data={ingestionConstant?.limitArr}
                  onChange={(event) => {
                    let { name, value } = event.target;
                    const { queryData } = this.state;
                    this.setState({ queryData : { ...queryData, offset, [name]: Number(value)} }, () =>
                      this.fetchIngestionList()
                    );
                  }}
                />
                <div className="page-info">{`Showing ${
                  totalRecords > limit ? limit : totalRecords
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
        <Drawer
            open={showFilterDrawer}
            anchor="right"
            onClose={this.showHideFilterDrawer}
          >
            {this.getFiltersUi()}
        </Drawer>
          <Drawer
            anchor="right"
            classes={{ paper: 'drawer-paper-600' }} 
            open={openDrawer}
            onClose={(e) => this.showHideDrawer(e, null)}
          >
            {this.getDrawerUi()}
          </Drawer>
      </div>
    );
  }
}

export default IngestionList;
