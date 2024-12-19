import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from 'file-saver';

//Common Components
import { PaginationComp } from "../Common/Pagination/Pagination";
import { constantText } from "../../_helpers/constants.text";
import LimitDropDown from "../Common/LimitDropdown/LimitDropDown";
import { CommonModel } from "../Common/Model/CommonModel";
import IngestionTable from "./IngestionTable";
//Helper Files
import Config from "../../Config/config";
import { apiCalls } from "../../_services/common.service";
import { history } from "../../_helpers/history";
import { ingestionConstant } from "./Ingestion.constant";
import { showSuccessErrorMsg } from '../../_actions/alertMessages.action';
//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
import LightIcon from "images/light-icon.svg";
//CSS
import "./IngestionList.css";
import IngestionStatusTable from "./IngestionStatusTable";

class IngestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listLoading: true,
      searchVal: "",
      showWarningPopup: false,
      showStatusPopup: false,
      modelTitle: "",
      modelDesc: "",
      maxPage: null,
      thData: ingestionConstant.tableHeadArr,
      filteredRows: [],
      totalRecords: 0,
      page: 1,
      limit: 5,
    };
  }

  componentDidMount() {
    const { page } = this.state;
    this.fetchIngestionList(page);
  }
  refreshIngestionList = () => {
    const { page } = this.state;
    this.setState(
      {
        listLoading: true,
        filteredRows: [],
      },
      () => {
        this.fetchIngestionList(page);
      }
    );
  };
  fetchIngestionList = async (page) => {
    const { limit, searchVal } = this.state;
    const response = await apiCalls(
      `${Config.axinomCmsStatus}?limit=${limit}&offset=${page}&externalid=${searchVal}`,
      "GET",
      {},
      "/ingestion",
      false
    );
    if (response && response?.rows?.length) {
      const Count = response?.count;
      const maxPage = Count ? Math.ceil(Count / limit) : 1;
      const data = this.formatListData(response?.rows);
      this.setState({
        listLoading: false,
        filteredRows: data,
        totalRecords: Count,
        maxPage,
      });
    } else {
      this.setState({
        listLoading: false,
        filteredRows: [],
        totalRecords: 0,
        maxPage: null,
      });
    }
  };
  formatListData = (res) => {
    const joinName = (obj) => {
      if (obj?.first_name && obj?.last_name) {
        return `${obj?.first_name} ${obj?.last_name}`;
      } else {
        return "NA";
      }
    };
    return res?.map((item) => {
      const obj = {};
      ingestionConstant?.rowKeys?.forEach((key, i) => {
        if (key === "start" || key === "end") {
          obj[key] = item[key]
            ? moment(item[key]).format(constantText.date_format_with_lt)
            : "NA";
        } else if (key === "imageCopy" || key === "publish") {
          obj[key] = !!Number(item[key]) ? "Completed" : "-";
        } else if (key === "validation") {
          obj[key] = !!Number(item[key]) ? "Pass" : "-";
        } else if (key === "ingestionJsonUpload" || key === "ingestionImageUpload" || key === "ingestionPublish" || key === "ingestionUnpublish") {
          obj[key] = item[key] === null ? "NA" : item[key] == 0 ?  "-" : "Pass";
        } else if (key === "unpublishState") {
          obj[key] = item[key] == 1 ? "UnPublication process initiated" : "NA";
        } else if (key === "createdOn" || key === "modifiedOn") {
          obj[key] = item[key]
            ? moment(item[key]).format(constantText.date_format_placeholder)
            : "NA";
        } else if (key === "created_by" || key === "modified_by") {
          obj[key] = joinName(item[key]);
        } else {
          obj[key] = item[key] ? item[key] : "NA";
        }
      });
      obj["id"] = item["id"];
      obj["warnings"] = item["warnings"];
      obj["sqsContentStatus"] = item["sqsContentStatus"];
      return obj;
    });
  };
  handleRoute = (route) => {
    history.push(route);
  };
  handleSearch = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: [value], page: 1 }, () =>
      this.fetchIngestionList(1)
    );
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

  showHideStatus = (data) => {
    const statusObj = {
      showStatusPopup: true,
      title: 'Content Status',
      desc: <IngestionStatusTable data={data}/>
    };
    this.setState({ statusObj });
  };

  handlePage = (event, page) => {
    this.setState({ page }, () => {
      this.fetchIngestionList(page);
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
        `${Config.axinomCmsStatus}/${row.externalId}`,
        "GET",
        {},
        "/ingestion",
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
  downloadJSON=async(externalId)=>{
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
  }
  
  render() {
    const {
      thData,
      modelTitle,
      modelDesc,
      showWarningPopup,
      searchVal,
      filteredRows,
      totalRecords,
      limit,
      page,
      listLoading,
      statusObj
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
            <span data-test="ingestion-heading-text">{constantText.ingestion_text}</span>
          </div>
          <div className="master-form flex">
            <input
              className="auto-search"
              type="text"
              autoComplete="off"
              name="searchVal"
              onChange={this.handleSearch}
              placeholder={ingestionConstant.searchText}
              value={searchVal}
            />
          </div>
        </div>
        <div
          onClick={this.refreshIngestionList}
          className="refresh-queue flex align-items-center"
        >
          <LightIcon />
          {constantText.please_refresh_text}{" "}
          <span className="ref-link auto-ref-link">
            {constantText.refresh_ingestion_text}
          </span>
        </div>
        <div className="master-table-block">
          <IngestionTable
            HCell={thData}
            refreshHandler={this.refreshHandler}
            downloadJSON={this.downloadJSON}
            rowData={filteredRows}
            loadingRecords={listLoading}
            rowKeys={ingestionConstant?.rowKeys}
            handleWarningIcon={this.showHideWarningPopup}
            handleStatus={this.showHideStatus}
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
                    this.setState({ [name]: Number(value), page: 1 }, () =>
                      this.fetchIngestionList(1)
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
                page={page}
                showFirstButton={true}
                showLastButton={true}
                onChange={this.handlePage}
              />
            )}
          </div>
        </div>
        <CommonModel
          className="popup-wrap status-popup"
          state={showWarningPopup}
          showTitle={true}
          title={modelTitle}
          showIcon={false}
          showDes={true}
          des={modelDesc}
          showBtn1={true}
          btn1Text={constantText.ok_text}
          btn1Action={this.showHideWarningPopup}
          showBtn2={false}
          handleClose={this.closeWarningPopup}
        />
        {statusObj?.showStatusPopup &&
          <CommonModel
            className="popup-wrap status-popup"
            state={true}
            showTitle={true}
            title={statusObj.title}
            showIcon={false}
            showDes={true}
            desWithoutDialogText={true}
            des={statusObj.desc}
            showBtn1={true}
            btn1Text={constantText.ok_text}
            btn1Action={() => this.setState({ statusObj: { showStatusPopup: false, desc: null } })}
            showBtn2={false}
          />
        }
      </div>
    );
  }
}

export default IngestionList;
