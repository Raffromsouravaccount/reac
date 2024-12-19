import React, { Component } from "react";
import axiosRequest from "axios";
import SelectWithSearch from '../../Common/SelectWithSearch/SelectWithSearch'
import LeftTab from '../../Common/LeftTab/CommonLeftTab';

import LightIcon from "images/light-icon.svg";
import FileIcon from "images/file-icon.svg";

//Service
import { apiCalls } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';
import Config from "../../../Config/config";
import { getLocalData } from '../../../_helpers/util';
import { getFileNameAndExtension } from '../../../_helpers/validation';
import { constantText } from "../../../_helpers/constants.text";
import { store } from '../../../_helpers/store';
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { history } from "../../../_helpers/history";
import {
  contentTypesList
} from "../Schema/ExportFile/ExportFile.json";
import { INCREASE_REQUEST, DECREASE_REQUEST } from '../../../_constants/common.constants';
class ImportFile extends Component {
  constructor(props) {
    super(props);
    const { RoleName } = getLocalData("userData") || {};
    if(RoleName?.toLowerCase() != constantText.systemAdmin) {
      const episodeContentIndex = contentTypesList.findIndex(item => item.value == 'episode');
      contentTypesList[episodeContentIndex].subContents = contentTypesList[episodeContentIndex].subContents.filter(item => item.name != 'indexno')
    }
    this.state = {

      contentOptions: contentTypesList,
      selectedOption: contentTypesList[0],
      isFileUploading: false,
      uploadingFileName: '',
      fileValidateSuccess: false,
      fileKey: '',
      jobId: '',
      selectedTab: 0,
      errorSectionsList:[],
      validationSuccess:true,
      validationProblems: false,
      subContentTab:0
    };
  }

  checkIsSelectedSubTabVideoUid = () => {
    const { selectedOption, subContentTab } = this.state;
    return selectedOption?.subContents[subContentTab]?.name == constantText.bulksOpsConstant.videoImportSubType;
  }

  onFileUploadAndValidate = async (event) => {
    const validFileExtensions = [".xlsx", ".xls"];
    const { selectedOption, subContentTab } = this.state;
    const contentData = event?.target?.files[0];
    let fileObj = getFileNameAndExtension(contentData.name, validFileExtensions)
    var formData = new FormData();
    formData.append("contentData", contentData);
    this.setState({
      isFileUploading: true,
      uploadingFileName: contentData?.name,
      errorSectionsList:[]
    })
    if (fileObj?.extension) {
      if (contentData) {
        let url = Config.BackendPlaceholderApiURL;
        switch (subContentTab) {
          case 2:
            url = url + `${Config.bulkUpdate.bulkOpsIndexUpdate}/${selectedOption?.value}`
            break;
          case 1:
            url = url + Config.bulkUpdate.bulkOpsPlaceholder
            break;
          default:
            const { validateUpdateVideo, validate } = Config.bulkUpdate
            url = url + `${this.checkIsSelectedSubTabVideoUid() ? validateUpdateVideo : validate}?contentType=${selectedOption?.value}`
            break;
        }
        store.dispatch({ type: INCREASE_REQUEST })
        let response = await axiosRequest.post(url, formData, {
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
        if (response?.data?.data) {
          let data=response?.data?.data;
          const {errorSectionsList}=this.state
          for(let key in data){
            if(Array.isArray(data[key])){
              let sectionObject={};
              sectionObject.label=key;
              sectionObject.list=data[key];
              errorSectionsList.push(sectionObject)
            }
          }
          this.setState({
            errorSectionsList,
            fileValidateSuccess: response?.data?.data?.key ? true:false,
            fileKey: response?.data?.data?.key,
            jobId: response?.data?.data?.jobId,
            validationSuccess:response?.data?.data.validationSuccess,
            validationProblems: response?.data?.data?.problems?.length > 0 ? true : false
          })

        }

      }
    } else {
      return showSuccessErrorMsg(constantText?.bulksOpsConstant?.fileFormatError, null, "Error", true, null, true)
    }
  }


  getEndPoint=(contentType)=>{
    switch(contentType){
      case 'movie':
       return Config.bulkUpdate.importMovie
      case 'video':
       return Config.bulkUpdate.importVideo
      case 'tvshow':
       return Config.bulkUpdate.importTvShow
      case 'episode':
       return Config.bulkUpdate.importEpisode
      case 'placeholder':
      return  Config.bulkUpdate.updatePlaceholder
       default :
      return null
    }

  }

  updateFile = async () => {
    const { selectedOption, fileKey, jobId ,subContentTab} = this.state;
    let data = {
      'fileKey': fileKey,
      'jobId': jobId
    }, res = true, endPoint = '';
    switch (subContentTab) {
      case 2:
        endPoint = endPoint + `${Config.bulkUpdate.bulkOpsIndexUpdate}/${selectedOption?.value}`
        break;
      case 1:
        endPoint = Config.bulkUpdate.updatePlaceholder
        break;
      default:
        if(this.checkIsSelectedSubTabVideoUid()) {
          endPoint = Config.bulkUpdate.importUpdateVideo
          delete data.fileKey
        } else{
          endPoint = this.getEndPoint(selectedOption?.value)
        }
        break;
    }
    res = await apiCalls(endPoint, "POST", data, null, true, false, this.props.autoSaveError, Config.BackendPlaceholderApiURL);
    if (typeof res != 'undefined') {
      showSuccessErrorMsg(
        constantText?.bulksOpsConstant?.importSuccess,
        null,
        constantText?.bulksOpsConstant?.importTitle,
        false,
        this.props.editRoute
      )
    }
    if(subContentTab == 2 || this.checkIsSelectedSubTabVideoUid()) {
      this.setState({ fileValidateSuccess: false })
    }
  }

  handleConetentType = (event, id, name, value) => {
    this.setState({
      selectedOption: value,
      subContentTab:0

    });
  };

  renderError = (list) => {
    return (
      <div className="file-table scrollBar scroll-X">
        <table>
          <tbody>
            { list && list.length>0 ? list.map((item,index) => {
              return <tr key={index}>
                <td valign="top">
                  <strong>Line :</strong> {item?.row} <br />
                  <strong>{constantText.external_id_text} :</strong> {item?.externalId ? item?.externalId : 'NA'}
                </td>
                <td className="st-red" valign="top">{item.isError ? constantText.bulksOpsConstant.importError  :  constantText.bulksOpsConstant.importWarning  }</td>
                <td valign="top">
                  {Object.keys(item?.errors).map((key,index) => {
                    return <p key={index}> <strong>{key}</strong>: {item?.errors[key]}</p>
                  })}
                </td>
              </tr>
            }):  <tr>
              <td colSpan={3}>
              {constantText.bulksOpsConstant.noError}

              </td>

            </tr>}

          </tbody>
        </table>
      </div>
    )

  }
  handleTab = (event, selectedTab) => this.setState({ selectedTab });
  getSubContentTypes = (contentArray) => {
    const { subContentTab } = this.state
    return (
      <div className="cr-mov-tab ralated-tabs">
        <LeftTab
          className="tabs"
          orientation="horizontal"
          variant="scrollable"
          options={[...contentArray]}
          selectedTab={subContentTab}
          showIcon={false}
          handleChange={(event, selectedTab) => this.tabSwitched(event, selectedTab)} />
      </div>
    )
  }

  tabSwitched = (event, selectedTab) => {
    if (selectedTab === this.state.subContentTab) {
      return;
    } else{
      this.setState({
        subContentTab:selectedTab
      })
    }
  }
  downloadTemplateFile= ()=>{
    let url = `${Config.imageBaseUrl}${Config.downloadTemplateURL}`;
    let fileName = constantText.bulksOpsConstant.sampleTemplate;
    if(this.state.subContentTab == 2) {
      url = `${Config.imageBaseUrl}${Config.downloadIndexTemplateURL}`;
      fileName = constantText.bulksOpsConstant.sampleIndexTemplate;
    } else if (this.checkIsSelectedSubTabVideoUid()) {
      url = `${Config.imageBaseUrl}${Config.sampleVideoUidTemplateURL}`;
      fileName = constantText.bulksOpsConstant.SampleVideoUidTemplate;
    }
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    fetch(url, requestOptions)
    .then((res) => {
      return  res.blob();
    })
    .then((blob) => {
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      return Promise.reject({ Error: 'Something Went Wrong', err });
    })
  }

  placeholderMessage=(type)=>{
    switch(type){
      case 'movie':
      return constantText.bulksOpsConstant.movieNonEditableMessage
      case 'video':
      return constantText.bulksOpsConstant.videoNonEditableMessage
      case 'tvshow':
      return constantText.bulksOpsConstant.tvShowNonEditableMessage
      case 'episode':
      return constantText.bulksOpsConstant.episodeNonEditablemessage
      case 'placeholder':
      return constantText.bulksOpsConstant.placeholderEditableMessage
      default :
      return ''
    }
  }

  getNonEditableFields=(type)=>{
    switch(type){
      case 'movie':
        return constantText.bulksOpsConstant.movieNonEditFields
        case 'video':
        return constantText.bulksOpsConstant.videoNonEditFields
        case 'tvshow':
        return constantText.bulksOpsConstant.tvShowNonEditFields
        case 'episode':
        return constantText.bulksOpsConstant.episodeNonEditFields
        case 'placeholder':
        return  constantText.bulksOpsConstant.placeholderNonEditFields
        default :
        return ''
    }
  }
  render() {
    let { contentOptions, selectedOption, uploadingFileName, fileValidateSuccess, selectedTab,errorSectionsList,validationSuccess , subContentTab, validationProblems } = this.state;
    const nonEditablelist=subContentTab==1 ?  constantText.bulksOpsConstant.placeholderNonEditFields : this.getNonEditableFields(selectedOption?.value);
    if(this.checkIsSelectedSubTabVideoUid()) {
      errorSectionsList = errorSectionsList?.length ? errorSectionsList?.filter(item => item?.list?.length) : []
    }
    return (
      <div className="whitebox p-all-15">
        <div className="bulk-ops-wrap imp-file-wrap">
          <div className="refresh-list-box m-b-20">
            <div className="icon-w-text">
              <LightIcon />
            Please Import your file from below.
          </div>
          </div>

          <div className="row m-b-10">
            <div className="col-md-5">
              <SelectWithSearch
                name={'contentTypesList'}
                className="zee-SelectWSearch-field"
                label={'Content Type'}
                limitTags={1}
                moreText={"more"}
                multiple={false}
                data={contentOptions}
                value={selectedOption}
                required={false}
                keyText={"title"}
                onBlur={() => { }}
                onChange={this.handleConetentType}
                error={
                  false
                }
                errorMsg={false}
              />
            </div>
            {(subContentTab == 1 || subContentTab == 2 || this.checkIsSelectedSubTabVideoUid()) &&
              <div className="bulk-dashboard-link ">
                <span onClick={this.downloadTemplateFile} className="ref-link auto-ref-link">
                  {constantText.bulksOpsConstant.downloadTemplate}
                </span>
              </div>
            }

          </div>

          <div className="row m-b-10">
            <div className="col-md-12">
             {selectedOption && selectedOption.id && selectedOption.id != '3' && this.getSubContentTypes(selectedOption?.subContents)}
           </div>
         </div>


          <div className="row m-b-10">
            <div className="col-md-5">
              <div className="upload-block w-100 ">
                <button className={(fileValidateSuccess || !selectedOption?.id) ? "upload-btn auto-button-upload w-100 disabled" : "upload-btn auto-button-upload w-100 btn-h-40"}>Upload File</button>
                <input type="file" name="contentData" disabled={(fileValidateSuccess || !selectedOption?.id)} onClick={(event) => {
                  event.target.value = null
                }} onChange={this.onFileUploadAndValidate} />
              </div>
            </div>
            {!(subContentTab == 2 || this.checkIsSelectedSubTabVideoUid()) &&
              <div className="col-md-12 m-t-20">
                <p>{subContentTab == 1 ? constantText.bulksOpsConstant.placeholderEditableMessage : this.placeholderMessage(selectedOption?.value)}</p>
                <div className="row">
                  {nonEditablelist.length > 0 && nonEditablelist.map(item => {
                    return (<div className="col-md-3 col-sm-6" key={item}>&bull;&nbsp;{item}</div>)
                  })}
                </div>
              </div>
            }
          </div>

          {(fileValidateSuccess || errorSectionsList?.length > 0) && <div className="file-detail-wrap">
            <h6>File Details</h6>
            <div className="file-detail m-b-20">
              <div className="file-name">
                <FileIcon /> {'test'} {uploadingFileName}
              </div>
              {/* <div className="file-cancel">Cancel</div> */}
            </div>
            {/* <p>
              Preparing your import It will take time, Please wait for some time.
          </p> */}
          </div>}

          {errorSectionsList?.length > 0 && <div className="file-detail-wrap">
            {/* <h4>File Details</h4> */}
            <div className="row m-b-10">
              {/* <div className="col-lg-12">
                <div className="file-graybox">
                  <h6>File Name</h6>
                  <div className="file-detail m-b-20">
                    <div className="file-name">
                      <FileIcon />{uploadingFileName}
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="whiteBox">
                <div className="ccm-head flex align-items-center justify-content-between m-b-0">
                  {/* <h4>{constantText.add_content_text}</h4> */}

                  {<div className="back-user-btn flex align-items-center">
                    <strong><span>{validationProblems && constantText.bulksOpsConstant.errorsSummary}</span></strong>
                  </div>}

                  {!validationSuccess && <BadgeBox className="s-badge red"
                    status={'Invalid'}
                  />}

                </div>
                {(validationProblems || !validationSuccess) && <div className="col-lg-12 ">

                  <div className=" cr-mov-tab  p-b-30">
                    <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={errorSectionsList}
                      selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
                  </div>

                  <div className="file-graybox m-b-20">
                    {this.renderError(errorSectionsList[selectedTab]?.list)}
                  </div>

                </div>}
              </div>
            </div>
          </div>}
          {fileValidateSuccess && <div className="row m-b-10">
            <div className="col-md-5">
              <div className="file-graybox">
                <h6>Validations</h6>
                <p>We have found no errors in the file, Please upload file from below.</p>
                <div className="upload-btn upload-block" onClick={() => { this.updateFile() }} >
                  Import / Update File
                  {/* <input name="import-file" type="file" onChange={this.updateFile} /> */}
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}
export default ImportFile;
