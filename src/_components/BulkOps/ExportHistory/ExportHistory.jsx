import React,{Component} from 'react';
import moment from "moment";

import ViewIcon from "images/view-icon.svg";
import DownloadIcon from "images/download-icon.svg";

import { apiCalls } from "../../../_services/common.service";

import { PaginationComp } from '../../Common/Pagination/Pagination';
import Button from "../../Common/ButtonField/ButtonField";
import { CommonModel } from "../../Common/Model/CommonModel";

import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";
class ExportHistory extends Component {
  constructor(props) {
    super(props);
    this.state={
      importHistoryData:null,
      filterData: {
        operation: 'Export',
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
      }
    }
  }

  componentDidMount(){
    this.getExportHistory()
  }

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      const refreshData = () => {
        this.componentDidMount();
      }
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, refreshData);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };

  getExportHistory = async (page) => {
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

  bulkPublish = (data) => {
    const alertData = {
      title: constantText.bulksOpsConstant.bulkPublish,
      desc: constantText.bulksOpsConstant.bulkPublishDesc
    }
    this.showModelAlert(alertData, data, 'published')
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

  showConfirmModal = (alertData) => {
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
    this.setState({ model: shallowModel });
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
    if (!flag || modelAction?.detail?.type === 'confirmed') {
      this.closeModel()
      return;
    }
    if (modelAction?.detail?.type === 'published') {
      const alertData = {
        title: constantText.bulksOpsConstant.bulkPublished,
        desc: constantText.bulksOpsConstant.bulkPublishedDesc
      }
      this.serverCallsAction(modelAction?.detail?.data, alertData)
    }
  }

  handlePage = (event, page) => {
    let { filterData } = this.state;
    this.setState({
      filterData: {
        ...filterData,
        offset: page
      }
     }, () => this.getExportHistory(page));
  };

  downloadFile = (data) => {
    if(data?.fileUrl){
      window.location.href = data?.fileUrl
    }
  }

  serverCallsAction = async (data, alertData) => {
    let url = `${Config.bulkUpdate.episodeUpdate}?jobId=${data?.id}`;
    let response = await apiCalls(url, "GET", null, null, true, null, this.autoSaveError, Config.BackendPlaceholderApiURL);
    if (response) {
      this.showConfirmModal(alertData);
      this.componentDidMount();
    }
  }

  getTableRows = () => {
    let { importHistoryData } = this.state;
    return importHistoryData?.map((item, i) => {
      return(
        <tr key={i}>
          <td className="ex-file-n">{item.fileName ? item.fileName : 'NA'}</td>
          <td className="ex-file-d">{moment(item.uploadedOn).format(constantText.bulksOpsConstant.importExportDateFormat)}</td>
          <td className="ex-file-u">{item.uploadedBy}</td>
          <td className={(item.status == 0) ? 'ex-file-st st-yellow' : (item.status == 1) ? 'ex-file-st st-green': 'ex-file-st st-red'}>{(item.status == 0) ? 'Processing' : (item.status == 1) ? 'Success': 'Failed'}</td>
          <td className="ex-act-btn">
          <div className="flex">
            <DownloadIcon disabled={!item?.fileUrl} onClick={() => this.downloadFile(item)} />
          </div>
          </td>
        </tr>
      )
    })
  }

  render(){
    let { filterData, model, importHistoryData } = this.state;
    let { totalRecords, limit, offset } = filterData;
    return(
      <div className="bulk-ops-wrap imp-exp-history">
        <div className="status-table whitebox  scrollBar scroll-X">
          <table>
            <thead>
              <tr>
                <th className="ex-file-n">File Name</th>
                <th className="ex-file-d">Downloaded On</th>
                <th className="ex-file-u">Downloaded By</th>
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
        </div>

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
export default ExportHistory;
