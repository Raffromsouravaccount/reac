import React,{Component} from 'react';
import moment from "moment";

import ViewIcon from "images/view-icon.svg";
import LightIcon from "images/light-icon.svg";
import DownloadIcon from "images/download-icon.svg";

import { apiCalls } from "../../../_services/common.service";
import {capitalizeFirstLetter} from "../../../_helpers/util"

import { PaginationComp } from '../../Common/Pagination/Pagination';
import { CommonModel } from "../../Common/Model/CommonModel";
import ImportHistoryErrorList from "./ImportHistoryErrorList";

import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { history } from "../../../_helpers/history";
import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";

class ImportHistory extends Component{
  constructor(props){
    super(props);
   this.state={
      importHistoryData:null,
     filterData: {
      operation: 'Import',
      limit: 10,
      offset: 1,
      totalRecords: null,
     },
     model: {
      detail: "",
      open: false,
      disableBackdropClick: true,
      desc: "",
      showBtn1: true,
      showBtn2: true,
      btn1: constantText.tvShowsConstants.yes,
      btn2: constantText.tvShowsConstants.no
    },
    publishContentType:'',
    showErrorList:false,
    validation:null,
    publishErrors:null,
    selectedTab:0
   }
  }

  componentDidMount(){
    this.getImportHistory();
  }

  refreshHistoryList=()=>{
    this.getImportHistory();
  }

  bulkPublish = (data,type) => {
    const alertData = {
      title: constantText.bulksOpsConstant.bulkPublish,
      desc: constantText.bulksOpsConstant.bulkPublishDesc
    }
    this.setState({
      publishContentType:type==='tvshow' ? 'TV shows' :'Episodes'
    })
    this.showModelAlert(alertData, data, 'published')
  }

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      const refreshData = () => {
        this.componentDidMount();
      }
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getImportHist);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  getImportHistory = async (page) => {
    let { filterData } = this.state;
    let { operation, limit, offset } = filterData;
    let url = `history?operation=${operation}&limit=${limit}&offset=${offset}`;
    let response = await apiCalls(url, 'GET', null, null, true, false, this.autoSaveError, Config.BackendPlaceholderApiURL);
    if (response) {
      this.setState({
        importHistoryData: response?.rows || [],
        filterData: {
          ...filterData,
          totalRecords: response.count
        }
      })
    }
  }

  showModelAlert = (alertData, data, type) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: type,
      data: data
    }
    this.setState({ model: shallowModel });
  }

  showConfirmModal = (alertData,jobId) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = false;
    shallowModel.btn1 = constantText.okText
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: 'confirmed'
    }
    this.setState({ model: shallowModel },()=>{
      if(jobId){
     history.push({ pathname: `${constantText.bulk_dashboard_route}/${jobId}` });
      }
    });
  }

  closeModel = (type) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = false;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = true;
    shallowModel.title = '';
    shallowModel.desc = '';
    shallowModel.detail = '';
    this.setState({ model: shallowModel });
    if(type){
      this.props.history.goBack();
    }
  }

  handleModel = (flag, modelAction) => {
    const {publishContentType}=this.state
    if (!flag || modelAction?.detail?.type === 'confirmed') {
      this.closeModel()
      return;
    }
    if (modelAction?.detail?.type === 'published') {
      const { bulkPublished, indexImportType, bulkPublishedInitiated, bulkPublishedDesc, videoImportType } = constantText.bulksOpsConstant;
      let desc;
      switch (modelAction?.detail?.data?.type) {
        case indexImportType:
        case videoImportType:
          desc = bulkPublishedInitiated
          break;
        default:
          desc = bulkPublishedDesc
          break;
      }
      const alertData = {
        title: bulkPublished,
        desc
      }
      this.serverCallsAction(modelAction?.detail?.data, alertData)
    }
  }

  serverCallsAction = async (data, alertData) => {
    const { indexImportType, videoImportType } = constantText.bulksOpsConstant;
    let url;
    switch (data.type) {
      case indexImportType:
        url = `${Config.bulkUpdate.bulkOpsIndexUpdatePublish}?jobId=${data?.id}`
        break;
      case videoImportType:
        url = `${Config.bulkUpdate.publishUpdateVideo}?jobId=${data?.id}`
        break;
      default:
        url = `${this.publishEndPoint(data.contentType)}?jobId=${data?.id}`
        break;
    }
    let response = await apiCalls(url, "GET", null, null, true, null, this.autoSaveError, Config.BackendPlaceholderApiURL);
    if(response === null) response = {}
    if (response || Object.keys(response || { check: null }).length == 0) {
      this.showConfirmModal(alertData, response?.jobId);
      this.componentDidMount();
    } else {
      const { model } = this.state;
      let shallowModel = { ...model };
      shallowModel.open = false;
      this.setState({ model: shallowModel })
    }
  }
  publishEndPoint=(type)=>{
    switch(type){
      case 'movie':
      return Config.bulkUpdate.moviePublish
      case 'video':
      return Config.bulkUpdate.videoPublish
      case 'tvshow':
      return Config.bulkUpdate.tvshowPublish
      case 'episode':
      return Config.bulkUpdate.episodePublish
      default :
      return null
    }
  }

  // import fail status=2
  importStatus = (item) => {
    if (item.publishStatus == null ) {
      if(item.status== '2' && item?.validation?.status==1) return 'Failed'
      if(item.status == '0') return 'Processing';
      if(item.status == '1') return 'Updated';
      if(item.status == '2') return 'Import Failed';
    } else {
      if(item.publishStatus == '0') return 'Processing';
      if(item.publishStatus == '1') return 'Published';
      if(item.publishStatus == '2' || item.publishStatus == '3') return 'Published Failed';
    }
  }

  handlePage = (event, page) => {
    let { filterData } = this.state;
    this.setState({
      filterData: {
        ...filterData,
        offset: page
      }
     }, () => this.getImportHistory(page));
  };

  downloadFile = (data) => {
    if(data?.fileUrl) {
      window.location.href = data?.fileUrl
    }
  }

  getImportHistoryErrorlist=(item)=>{
    if(item.type===constantText.bulksOpsConstant.placeholderImport && item.status== '2' && item?.validation?.status==1 ){
      history.push({ pathname: `${constantText.bulk_upload_route}/${item?.id}`});
    }else{
    let validation= item?.validation
    this.setState({
      showErrorList:true,
      validation,
      publishErrors:[],
      selectedTab:0
    })
   }
  }
  getImportPublishErrorlist=(item)=>{
    history.push({ pathname: `${constantText.bulk_dashboard_route}/${item?.publishJobId}`});
  }
  backToHistory=()=>{
    this.setState({
      showErrorList:false
    })
  }
  handleTab = (event, selectedTab) =>
  this.setState({ selectedTab });
  getTableRows = () => {
    let { importHistoryData } = this.state;
    return importHistoryData?.map((item, i) => {
      return(
        <tr key={i}>
          <td className="ex-file-n">{item.fileName}</td>
          <td className="ex-file-d">{item.contentType.length>0 ? capitalizeFirstLetter(item.contentType) : 'NA'}</td>
          <td className="ex-file-d">{moment(item.uploadedOn).format(constantText.bulksOpsConstant.importExportDateFormat)}</td>
          <td className="ex-file-u">{item.uploadedBy}</td>
          <td className={(item.publishStatus == '0') ? 'ex-file-st st-yellow' : (item.publishStatus == '1' || (item.publishStatus == null && item.status == '1')) ? 'ex-file-st st-green': 'ex-file-st st-red'}>
         {this.importStatus(item)}
          </td>
          <td className="ex-act-btn">
          <div className="flex align-items-center">

            <DownloadIcon className="m-r-10" onClick={() => this.downloadFile(item)} />
            { (item.publishStatus == '2' || item.publishStatus == '3') ?<ViewIcon  onClick={()=>{this.getImportPublishErrorlist(item)}}/> :item.status==='2'? <ViewIcon  onClick={()=>{this.getImportHistoryErrorlist(item)}}/> :''}

            { ((item.publishStatus == '1') || (item.publishStatus === null && item.status == '1')) && item?.publishedIds && item.publishedIds?.length>0 &&
              <span
              onClick={() => this.bulkPublish(item, item?.contentType)}
              className={item.publishStatus === '1' ? "disabled history-publish-link" :"history-publish-link"}
               >
              <u> {(item.publishStatus === null && item.status == '1') ? 'Publish Now' : (item.publishStatus == '1') ? 'Published' : ''}</u>
              </span>}
          </div>
          </td>
        </tr>
      )
    })
  }


  render(){
    let { filterData, model, importHistoryData ,showErrorList,validation,publishErrors,selectedTab} = this.state;
    let { totalRecords, limit, offset } = filterData;
    return(
      <div className="bulk-ops-wrap imp-exp-history">
          <div
          className="refresh-queue flex align-items-center"
        >
          <LightIcon />
          {constantText.please_refresh_text}{" "}
          <span onClick={this.refreshHistoryList} className="ref-link auto-ref-link">
            {constantText.refresh_list_text}
          </span>
        </div>
        {showErrorList  ?<ImportHistoryErrorList validation={validation} handleTab={this.handleTab}   publishErrors ={publishErrors}  selectedTab ={selectedTab} backToHistory={this.backToHistory}/> :
        <div className="status-table whitebox  scrollBar scroll-X">
          <table>
            <thead>
              <tr>
                <th className="ex-file-n">File Name</th>
                <th className="ex-file-d">Content Type</th>
                <th className="ex-file-d">Uploaded On</th>
                <th className="ex-file-u">Uploaded By</th>
                <th className="ex-file-st">Status</th>
                <th className="ex-act-btn">Actions</th>
              </tr>
            </thead>
            <tbody>
              {importHistoryData?.length > 0 && this.getTableRows()}
            </tbody>
          </table>
          <PaginationComp
            count={Math.ceil(totalRecords / limit)}
            page={offset}
            showFirstButton={true}
            showLastButton={true}
            onChange={this.handlePage} />
        </div>}

        <CommonModel
          className="popup-wrap status-popup"
          state={model.open}
          showIcon={false}
          showTitle={true}
          title={model.title}
          showDes={true}
          des={model.desc}
          showBtn1={model.showBtn1}
          btn1Text={model.btn1}
          btn1Action={() => this.handleModel(true, model)}
          showBtn2={model.showBtn2}
          btn2Action={() => this.handleModel(false, model)}
        />

      </div>
    )
  }
}

export default ImportHistory;