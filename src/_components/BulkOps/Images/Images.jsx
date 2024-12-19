import React from "react";
import { Component } from "react";
import axiosRequest from "axios";
import moment from 'moment';

import LightIcon from "images/light-icon.svg";
import ButtonField from "../../Common/ButtonField/ButtonField";

import DownArrow from "images/down-arrow.svg";
import DownDisableArrow from "images/down-disable-arrow.svg";
import UpArrow from "images/up-arrow.svg";
import ViewIcon from "images/view-icon.svg";
import DownloadIcon from "images/download-icon.svg";


import SelectWithSearch from '../../Common/SelectWithSearch/SelectWithSearch'
import { PaginationComp } from '../../Common/Pagination/Pagination';
import CheckBox from "../../Common/CheckBox/CheckBox";
import { CommonModel } from "../../Common/Model/CommonModel";

//Service
import { apiCalls } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';
import Config from "../../../Config/config";

import { store } from '../../../_helpers/store';
import { getFileNameAndExtension } from '../../../_helpers/validation';
import { getLocalData } from '../../../_helpers/util';
import { constantText } from "../../../_helpers/constants.text";
import { history } from "../../../_helpers/history";

import { INCREASE_REQUEST, DECREASE_REQUEST } from '../../../_constants/common.constants';

import ImageErrors from './ImageErrors';

import {
  contentTypesList
} from "../Schema/Images/Images.json";

import '../../../../public/css/Common/BulkOps.css';

class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentOptions: contentTypesList,
      selectedOption: contentTypesList[0],
      fileValidateSuccess:false,
      isFileValidationError: false,
      uploadingFileName: '',
      importUpdateFile: true,
      imagesHistoryData: [],
      fileKey:'',
      jobId:'',
      showErrorList:false,
      validation:null,
      publishErrors:null,
      selectedTab:0,
      filterData: {
        operation: 'Image',
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
    }
  }

  componentDidMount(){
    this.getImagesHistory();
  }


  getImagesHistory = async (page) => {
    let { filterData } = this.state;
    let { operation, limit, offset } = filterData;
    let url = `image?limit=${limit}&offset=${offset}`;
    let response = await apiCalls(url, 'GET', null, null, true, false, this.autoSaveError, Config.BackendPlaceholderApiURL);
    if (response) {
      response?.rows.map(item => {
        item.viewError = false
        item.viewChildList = []
      });
      this.setState({
        imagesHistoryData: response?.rows || [],
        filterData: {
          ...filterData,
          totalRecords: response.count
        }
      })
    }
  }

  onFileUploadAndValidate = async (event) => {
    const validFileExtensions = [".zip"];
    const { selectedOption } = this.state;
    const contentData = event?.target?.files[0];
    let fileObj = getFileNameAndExtension(contentData.name, validFileExtensions)
    var formData = new FormData();
    formData.append("contentData", contentData);
    this.setState({
      isFileUploading: true,
      uploadingFileName: contentData?.name
    })
    if (fileObj?.extension) {
      if (contentData) {
        store.dispatch({ type: INCREASE_REQUEST})
        let response = await axiosRequest.put(`${Config.BackendPlaceholderApiURL}${Config.bulkUpdate.imageUpload}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json',
            'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'authorization': `Bearer ${getLocalData('token')}`
          }
        }).catch(function (error) {
          showSuccessErrorMsg(error?.response?.data?.message, null, "Error", true, null, true)
        })
        store.dispatch({ type: DECREASE_REQUEST })
        if (response?.status == 200) {
          this.getImagesHistory()
        }

      }
    } else {
      return showSuccessErrorMsg(constantText?.bulksOpsConstant?.fileFormatError, null, "Error", true, null, true)
    }
  }

  getUploadedList = async (page) => {
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


  handlePage = (event, page) => {
    let { filterData } = this.state;
    this.setState({
      filterData: {
        ...filterData,
        offset: page
      }
     }, () => this.getImagesHistory(page));
  };

  showHideError = (image, index) => {
    this.setState({
      showErrorList:true,
      validation: image.validation,
      publishErrors:[],
      selectedTab:0
    })
  }

  showHideChildList = async (image, index) => {
    let copyImageData = this.state.imagesHistoryData;
    if(image?.validation?.status == 1 && copyImageData[index].viewChildList.length == 0) {
      let url = `${Config.bulkUpdate.image}/${image?.jobId}`;
      let response = await apiCalls(url, "GET", null, null, true, null, this.autoSaveError, Config.BackendPlaceholderApiURL);
      if (response) {
        response.map(item => item.published = false)
        copyImageData[index].viewError = false;
        copyImageData[index].viewChildList = response || [];
        this.setState({ imagesHistoryData: copyImageData })
      }
    } else {
      copyImageData[index].viewChildList = [];
      this.setState({ imagesHistoryData: copyImageData })
    }
  }


  backToHistory=()=>{
    this.setState({
      showErrorList:false
    })
  }

  autoSaveError = (error) => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getTvShowStatus);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, "Error", true, null, true);
    }
  };


  publishChecked = (image, imageIndex, item, childIndex) => {
    let imagesHistoryDataCopy = [...this.state.imagesHistoryData];
    imagesHistoryDataCopy[imageIndex]['viewChildList'][childIndex].published = !imagesHistoryDataCopy[imageIndex]['viewChildList'][childIndex].published;
    this.setState({ imagesHistoryData: imagesHistoryDataCopy })
  }

  publishSingleContent = (childImage, bulkImage) => {
    let contentType = bulkImage.contentType == 'tvshow' ? 'tvShow' : bulkImage.contentType;
    const data = {
      externalId: [childImage.externalId],
      contentType: contentType,
      bulkOpsJobId:bulkImage.jobId
    }
    const alertData = {
      title: constantText.bulksOpsConstant.publish,
      desc: constantText.bulksOpsConstant.publishDesc
    }
    this.showModelAlert(alertData, data, 'publishSingleImage');
  }

  publishBulkContent = async (imageIndex) => {
    let { imagesHistoryData } = this.state;
    const childImage = imagesHistoryData[imageIndex];
    const checkChildChecked = imagesHistoryData[imageIndex]['viewChildList'].filter(item => item.published);
    let contentType = childImage.contentType == 'tvshow' ? 'tvShow' : childImage.contentType;
    const data = {
      externalId: [],
      contentType: contentType,
      bulkOpsJobId:childImage.jobId
    }
    const alertData = {
      title: constantText.bulksOpsConstant.publish,
      desc: constantText.bulksOpsConstant.publishDesc
    }
    if(checkChildChecked.length > 0) {
      alertData.desc = constantText.bulksOpsConstant.publishSelectedDesc
      checkChildChecked.map(item => {
        data.externalId.push(item.externalId)
      })
    } else {
      if(childImage?.viewChildList.length > 0) {
        childImage.viewChildList.map(item => {
          data.externalId.push(item.externalId)
        })
      } else {
        let url = `${Config.bulkUpdate.image}/${childImage?.jobId}`;
        let response = await apiCalls(url, "GET", null, null, false, null, this.autoSaveError, Config.BackendPlaceholderApiURL);
        if(response) {
          response.map(item => {
            data.externalId.push(item.externalId)
          })
        }
      }
    }
    this.showModelAlert(alertData, data, 'publishBulkImage');
  }

  handleModel = (flag, modelAction) => {
    if (!flag) {
      this.closeModel()
      return;
    }
    if (modelAction?.detail?.type === 'confirmed') {
      history.push(`bulkupdate/dashboard/${modelAction?.detail?.data}`);
      return;
    }
    if (modelAction?.detail?.type === 'publishSingleImage') {
      this.serverCallAction(modelAction?.detail?.data)
    }
    if (modelAction?.detail?.type === 'publishBulkImage') {
      this.serverCallAction(modelAction?.detail?.data)
    }
  }

  serverCallAction = async (data) =>{
    let url = `${Config.bulkUpdate.imagePublish}`;
    let response = await apiCalls(url, "POST", data, null, true, null, this.autoSaveError, Config.BackendPlaceholderApiURL);
    if(response) {
      const alertData = {
        title: constantText.bulksOpsConstant.publishStatus,
        desc: constantText.bulksOpsConstant.dashboardDesc
      }
      this.showConfirmModal(alertData, response?.jobId)
    } else {
      this.closeModel()
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

  showConfirmModal = (alertData, data) => {
    const { model } = this.state;
    let shallowModel = { ...model };
    shallowModel.open = true;
    shallowModel.showBtn1 = true;
    shallowModel.showBtn2 = false;
    shallowModel.btn1 = constantText.tvShowsConstants.ok
    shallowModel.title = alertData?.title;
    shallowModel.desc = alertData?.desc;
    shallowModel.detail = {
      type: 'confirmed',
      data: data
    }
    this.setState({ model: shallowModel });
  }


  downloadFile = (data) => {
    if(data?.fileUrl){
      window.location.href = data?.fileUrl
    }
  }

  getStatus = (image) => {
    let successNum = (Number(image.updated) - Number(image.published) - Number(image.publishFailedCount))
    if(image.status == 0) {
      return <div className="s-badge orange">{constantText.bulksOpsConstant.processing}</div>
    }
    if(image.status == 1) {
      return <React.Fragment>
        {
          (image.totalContentCount != image.published) &&
          <div className="s-badge green">{constantText.bulksOpsConstant.success + ' +' + successNum}</div>
        }
        {
          (image.publishFailedCount > 0) &&
          <div className="s-badge red">{constantText.bulksOpsConstant.publishedFailed + ' +' + image.publishFailedCount}</div>
        }
        <div className="s-badge blue">{constantText.bulksOpsConstant.published + ' +' + image.published}</div>
        </React.Fragment>
    } else {
      return <div className="s-badge red">{constantText.bulksOpsConstant.failed}</div>
    }
  }

  getDisabled = (image) => {
    if(Number(image.totalContentCount) == Number(image.published)){
      return true;
    } else {
      return false
    }
  }

  getChildStatus = (item) => {
    if(item.publishStatus == 0 || item.status == 0){
      return(<div className={`s-badge orange`}>
        {constantText.bulksOpsConstant.processing}
      </div>)
    }
    if(item.publishStatus == 1){
      return(<div className={`s-badge green`}>
        {constantText.bulksOpsConstant.published}
      </div>)
    }
    if(item.publishStatus == 2){
      return(<div className={`s-badge red`}>
        {constantText.bulksOpsConstant.failedToPublish}
      </div>)
    }
    if(item.status == 1) {
      return(<div className={`s-badge green`}>
        {constantText.bulksOpsConstant.success}
      </div>)
    } else {
      return(<div className={`s-badge red`}>
        {constantText.bulksOpsConstant.failed}
      </div>)
    }
  }


  getTableRows = () => {
    let { imagesHistoryData } = this.state;
    return imagesHistoryData?.map((image, imageIndex) => {
      return(
        <React.Fragment key={imageIndex}>
          {
          <React.Fragment>
          <div className="img-table-row flex">
            {
              (image.viewChildList.length == 0 && image.status == '1') ?
                <DownArrow onClick={() => this.showHideChildList(image, imageIndex)} />
              :
              image.status == '1' &&
                <UpArrow onClick={() => this.showHideChildList(image, imageIndex)} />
            }
            {
              (image.status == '0' || image.status == '2') &&
                <DownDisableArrow />
            }
            <div className="file-name">{image.fileName || 'NA'}</div>
            <div className="uploaded-on">
              <span className="m-r-20">{moment(image.uploadedOn).format(constantText.date_format_with_time)}</span>
            </div>
            <div className="uploaded-by">{image.uploadedBy || 'NA'}</div>
            <div className="progress-status">
              { this.getStatus(image) }
            </div>
            <div className="action-btn flex" >
              {
                (image.status == '1') &&
                <div className="tooltip-sec">
                  <div
                    disabled={this.getDisabled(image)}
                    onClick={() => (image.totalContentCount != image.published) && this.publishBulkContent(imageIndex)}
                    className={`publish-btn  ${image?.publishedIds == null ? 'disabled' : (image.totalContentCount == image.published || image.publishProcessingCount > 0) ? 'disabled' : ''}`}
                    >
                      {(image.totalContentCount == image.published) ? constantText.bulksOpsConstant.published : image.publishProcessingCount > 0 ? constantText.bulksOpsConstant.processing : constantText.bulksOpsConstant.publishNow}
                   </div>
                  {image?.publishedIds == null&& <div className="tooltip-box">
                  {constantText.bulksOpsConstant.contentInDraft}
                          </div>}
                   </div>
              }
              {
                (image?.status == 2) &&
                <ViewIcon onClick={() => this.showHideError(image, imageIndex)} className="view-btn" />
              }
              {
                <span className={'download-btn'}>
                  <DownloadIcon className="view-btn" disabled={!image?.fileUrl} onClick={() => this.downloadFile(image)} />
                </span>
              }
            </div>
          </div>
          {
            (image?.viewChildList?.length > 0) &&
            <div className="img-bulk-child">
                {image?.viewChildList.map((item, childIndex) => {
                  return (<div key={childIndex} className="img-bulk-child-row flex">
                    <div className="left flex">
                      <div className="checkbox-div ">
                        <CheckBox disabled={item.publishStatus == 1 || item.publishStatus == 0 } handleCheckBox={() => this.publishChecked(image, imageIndex, item, childIndex)} checked={item.published} />
                      </div>
                     <div className="info">
                        <div className="mov-detail flex ">
                            <h4>
                              {item.externalId || 'NA'}
                            </h4>
                            {this.getChildStatus(item)}
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      {
                        <div className="tooltip-sec">
                        <button disabled={item.published || item.publishStatus == 1 || item.publishStatus == 0} onClick={() => this.publishSingleContent(item, image)} className={`publish-btn ${item.state=== constantText.bulksOpsConstant.imageSubContentState ? 'disabled' : (item.published || item.publishStatus == 1 || item.publishStatus == 0) ? 'disabled' : ''}`}>
                          {(item.publishStatus == null || item.publishStatus == 2) ? constantText.bulksOpsConstant.publishNow : item.publishStatus == 0 ? constantText.bulksOpsConstant.processing : constantText.bulksOpsConstant.published }
                        </button>
                         {item.state===constantText.bulksOpsConstant.imageSubContentState && <div className="tooltip-box">
                          {constantText.bulksOpsConstant.contentInDraft}
                          </div>}
                        </div>
                      }
                    </div>
                  </div>)
                })}
            </div>
          }
          </React.Fragment>
          }
        </React.Fragment>
      )
  })
}


  render() {
    const { showErrorList,validation,publishErrors,selectedTab,fileValidateSuccess,filterData, imagesHistoryData, model } = this.state;
    let { totalRecords, limit, offset } = filterData;

    return (
      <div data-test="bulkOpsImages" className="whitebox">
        {
          showErrorList  ? <ImageErrors validation={validation} publishErrors={publishErrors}  selectedTab={selectedTab} backToHistory={this.backToHistory}/>
          :
          <div className="img-bulk-wrap">

          <div className="p-all-15 flex align-items-center m-b-10 justify-content-between">
            <div className="flex align-items-center">
              <div className="refresh-list-box m-r-20">
                <div data-test="uploadZip" className="icon-w-text">
                  <LightIcon />
                  {constantText.bulksOpsConstant.uploadZip}
                </div>
              </div>
              <div className="upload-block upload-btn">
                  {constantText.bulksOpsConstant.uploadFile}
                  <input type="file" name="contentData" disabled={fileValidateSuccess}   onClick={(event)=> {
                event.target.value = null
            }}  onChange={this.onFileUploadAndValidate} />
              </div>
            </div>
            <div class="refreshList" onClick={() => this.getImagesHistory()}>
              <a className="text-underline">
                <strong>Refresh List</strong>
              </a>
            </div>
          </div>

          <div className="scrollBar scroll-X">
            <div className="img-bulk-inner">
              <div className="img-table-row flex align-items-center img-head">
                <div className="file-name">{constantText.bulksOpsConstant.fileName}</div>
                <div className="uploaded-on">{constantText.bulksOpsConstant.uploadedOn}</div>
                <div className="uploaded-by">{constantText.bulksOpsConstant.uploadedBy}</div>
                <div className="progress-status">{constantText.bulksOpsConstant.status}</div>
                <div className="action-btn">{constantText.bulksOpsConstant.action}</div>
              </div>
              <div className="img-bulk-parent">
                {
                  imagesHistoryData?.length > 0 && this.getTableRows()
                }
              </div>
              <PaginationComp
              count={Math.ceil(totalRecords / limit)}
              page={offset}
              showFirstButton={true}
              showLastButton={true}
              onChange={this.handlePage} />
            </div>
          </div>
        </div>
        }

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
    );
  }
}

export default Images;