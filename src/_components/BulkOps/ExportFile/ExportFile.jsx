import React, { Component, Fragment } from "react";
import moment from "moment";
import FormRender from "../../Common/FormHelper/FormRender";
import ButtonField from "../../Common/ButtonField/ButtonField";
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import checkValidity from '../../Common/FormHelper/FieldValidator';
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';

import LightIcon from "images/light-icon.svg";
//helper
import { constantText } from "../../../_helpers/constants.text";
import { DEFAULT_JSON } from "../../../_helpers/util"
//Service
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";

import {
  select_content_type_status,
  select_filter,
  select_fields,
  contentProperties
} from "../Schema/ExportFile/ExportFile.json";

class ExportFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFilterJSON: DEFAULT_JSON(select_filter),
      selectFieldJSON: DEFAULT_JSON(select_fields),
      contentTypeOptions: select_content_type_status,
      subTypeOptions: [],
      selectedTab: 0,
      subSelectedTab: 0,
      contentFilters: {},
      subContentFilters: {},
      timeId:null
    }

  }
  componentWillUnmount(){
   clearTimeout(this.state.timeId)
  }

  getSubType = async (subTypeParams) => {
    let { subTypeOptions } = this.state;
    let response = await apiCalls(`master/${subTypeParams}?status=all&translation=yes`, "GET", {}, null, true, false, this.props.autoSaveError);
    if (response?.length > 0) {
      response.forEach((item) => {
        let subTypeObject = {}
        subTypeObject.label = item?.title,
          subTypeObject.name = item?.title,
          subTypeObject.id = item?.id
        subTypeOptions.push(subTypeObject)
      })
    }

    this.setState({
      subTypeOptions
    })
  }

  getSubTypeName=(selectedTab)=>{
    switch(selectedTab){
      // case 1:
      //  return constantText?.bulksOpsConstant?.movieSubType
      // case 2:
      //  return constantText?.bulksOpsConstant?.videoSubType
      case 1 :
        return constantText?.bulksOpsConstant?.tvshowSubType
      case 2:
       return constantText?.bulksOpsConstant?.episodeSubType
      default :
       return null

    }
  }

  tabSwitched = (event, selectedTab, type) => {
    if (selectedTab === this.state.selectedTab && type === 'contentType') {
      return;
    } else if (selectedTab === this.state.subSelectedTab && type==='subContentType') {
      return;
    }
    else if (type === 'contentType') {

      let subTypeParams = this.getSubTypeName(selectedTab)
      this.setState({
        selectedTab: selectedTab,
        subSelectedTab:0,
        subTypeOptions: [],
        selectFilterJSON: DEFAULT_JSON(select_filter),
        selectFieldJSON: DEFAULT_JSON(select_fields),
      }, () => {
        if(subTypeParams){
        this.getSubType(subTypeParams)
        }
      })
    }else if(type==='subContentType'){
      this.setState({
        subSelectedTab:selectedTab
      })

    }
  }
  getContentTypes = (contentArray, type) => {
    const { selectedTab, subSelectedTab } = this.state
    return (
      <div className="cr-mov-tab ralated-tabs">
        <LeftTab
          className="tabs"
          orientation="horizontal"
          variant="scrollable"
          options={[...contentArray]}
          selectedTab={ type == 'contentType' ? selectedTab : subSelectedTab}
          showIcon={false}
          handleChange={(event, selectedTab) => this.tabSwitched(event, selectedTab, type)} />
      </div>
    )
  }

  setSelectDataArr = (res, index, key) => {
    const { selectFilterJSON, selectFieldJSON } = this.state;
    const copySelect = key === 'filter' ? [...selectFilterJSON] : [...selectFieldJSON];
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
      if(key==='filter'){
      copySelect[index].data = res;
      }else{
        copySelect[index].data=contentProperties;
      }
    }
    if (key === 'filter') {
      this.setState({ selectFilterJSON: copySelect });
    } else {
      this.setState({ selectFieldJSON: copySelect });
    }
  };

  inputChange = (event, elemIndex, key) => {
    let { selectFilterJSON, selectFieldJSON } = this.state;
    let shallowFormFilterJson = [...JSON.parse(JSON.stringify(selectFilterJSON))];
    let shallowFormFieldJson = [...JSON.parse(JSON.stringify(selectFieldJSON))]
    const copyJSON = key === 'filter' ? shallowFormFilterJson : shallowFormFieldJson;
    const filterJSON = [...shallowFormFilterJson];
    const fieldJSON = [...shallowFormFieldJson];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement) {
      updatedElement.value =
        updatedElement?.type === "checkbox"
          ? event.target.checked
          : updatedElement?.type === "text" ? (event.target.value.trim() ? event.target.value : event.target.value.trim()) : event?.target?.value;
    }
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
    if (updatedElement) {
      updatedElement.valid = isValid;
      updatedElement.errorText = errorText;
      //updated element's touched property
      updatedElement.touched = 1;
    }
    if (key === 'filter') {
      shallowFormFilterJson[elemIndex] = updatedElement;
      this.setState({ selectFilterJSON: shallowFormFilterJson });
    } else {
      shallowFormFieldJson[elemIndex] = updatedElement;
      this.setState({ selectFieldJSON: shallowFormFieldJson });
    }
  };

  exportContentType = async () => {
    const { selectFilterJSON, subSelectedTab, subTypeOptions,selectedTab } = this.state
    let data = {}, audioLanguageArray = [];
    selectFilterJSON.forEach(item => {
      if (item.name === 'audioLanguages') {
        item?.value?.forEach(item => {
          audioLanguageArray.push(item.id)
        })
        data.audioLanguageId = audioLanguageArray?.length > 0 ? audioLanguageArray.toString() : ''
      }
      if (item.name == 'originalTelecastFromDate') {
        data.originalTelecastFromDate = item?.value?._d ? moment(item?.value?._d).format('YYYY-MM-DD') : item?.value ? moment(item?.value).format('YYYY-MM-DD') : ''
      }
      if (item.name == 'originalTelecastToDate') {
        data.originalTelecastToDate = item?.value?._d ? moment(item?.value?._d).format('YYYY-MM-DD') : item?.value ? moment(item?.value).format('YYYY-MM-DD') : ''
      }
    })
    data.subTypeId = subTypeOptions[subSelectedTab]?.id ? subTypeOptions[subSelectedTab]?.id :'';
    if(!data.originalTelecastFromDate){
    return showSuccessErrorMsg(constantText?.bulksOpsConstant?.fromDateError, null,'Error', true, null, true)
    }else if(!data.originalTelecastToDate){
      return showSuccessErrorMsg(constantText?.bulksOpsConstant?.toDateError, null,'Error', true, null, true)
    }else if(!moment(data.originalTelecastToDate).isSameOrAfter(data.originalTelecastFromDate)){
      return showSuccessErrorMsg(constantText?.bulksOpsConstant?.dateCompareError, null,'Error', true, null, true)
    }else if(constantText?.bulksOpsConstant?.monthsDifference <  moment(data.originalTelecastToDate).diff(moment(data.originalTelecastFromDate), 'months', true)){
      return showSuccessErrorMsg(constantText?.bulksOpsConstant?.dateMonthsDiffMessage, null,'Error', true, null, true)
    }else{
    let endPoint = this.getAPIEndType(selectedTab);
    if(endPoint){
    let res = await apiCalls(endPoint, "POST", data, null, true, false, this.props.autoSaveError, Config.BackendPlaceholderApiURL);
    if (res?.jobId) {
      let count = 1;
      this.callContentTypeExportStatus(res?.jobId,count)
      this.timeWaitMessage()
    }
    }
  }
  }
  getAPIEndType=(selectedTab)=>{
    switch(selectedTab){
    // case 1:
    //  return Config.bulkUpdate.movieExport
    // case 2:
    //   return Config.bulkUpdate.videoExport
    case 1:
      return Config.bulkUpdate.tvShowExport
    case 2 :
      return Config.bulkUpdate.episodeExport
     default :
     return  null
    }

  }
  callContentTypeExportStatus = async (jobId,count) => {
    let response = await apiCalls(`${Config.bulkUpdate.tvShowExportStatus}/${jobId}`, "GET", {}, null, true, false, this.props.autoSaveError, Config.BackendPlaceholderApiURL);
    if (response?.jobFinished && response?.url) {
      clearTimeout(this.state.timeId)
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

      fetch(`${response?.url}`, requestOptions)
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.setAttribute('download', response?.fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          return Promise.reject({ Error: 'Something Went Wrong', err });
        })
    } else {
       let time=constantText?.bulksOpsConstant?.exportAPIInterval * parseInt(count);
       let timeId = setTimeout(()=>{
          count = count + 1
          if(count <= constantText?.bulksOpsConstant?.countLimit) {
          this.callContentTypeExportStatus(jobId,count)
          }
        }, time)
         this.setState({timeId})
       }
  }
  timeWaitMessage =()=>{
    showSuccessErrorMsg(
      constantText?.bulksOpsConstant?.exportPopUpMessage,
       null,
      "Success",
      false,
      this.props.editRoute
    )
  }

  render() {
    const {  selectFieldJSON, selectFilterJSON, subTypeOptions } = this.state;
    return (
      <div className="whitebox p-all-15">
        <div className="bulk-ops-wrap ex-file-wrap">
          <div className="refresh-list-box m-b-20">
            <div className="icon-w-text">
              <LightIcon />
            Please select content type , sub type , filters and
            parameters from below to generate xls file.
          </div>
          </div>
          <h4>Select Content Type</h4>
          {this.getContentTypes(select_content_type_status, "contentType")}

           { subTypeOptions &&
            subTypeOptions?.length > 0 && <h4>Select Sub Type</h4>}
          {subTypeOptions &&
            subTypeOptions?.length > 0 &&
            this.getContentTypes(subTypeOptions, "subContentType")}

          <h4>Select Filter</h4>

          <div className="row">
            <FormRender
              form={selectFilterJSON}
              groupIndex={0}
              data-test="selectFilterForm"
              setSelectDataArr={(e, index) => this.setSelectDataArr(e, index, 'filter')}
              onChange={(e, index) => this.inputChange(e, index, 'filter')}
              selectGroup={() => { }}
              handleAutoCreateInput={() => { }}
              handleBlur={() => { }}
            />
          </div>

          {/* <h4>Select Fields</h4>
          <div className="row">
            <FormRender
              form={selectFieldJSON}
              groupIndex={0}
              data-test="selectFildsForm"
              setSelectDataArr={(e, index) => this.setSelectDataArr(e, index, 'field')}
              onChange={(e, index) => this.inputChange(e, index, 'field')}
              selectGroup={() => { }}
              handleAutoCreateInput={() => { }}
              handleBlur={() => { }}
            />
         </div>  */}
           {/* <SelectWithSearch
              name={name}
              className="zee-SelectWSearch-field"
              label={'Content Type'}
              limitTags={1}
              moreText={"more"}
              multiple={false}
              data={contentOptions}
              value={selectedOption}
              required={false}
              keyText={"title"}
              onBlur={()=>{}}
              onChange={this.handleConetentType}
              error={
                false
              }
              errorMsg={false}
            />*/}


          {/* <div className="non-ed-param">
            <h6>Non Editable Parameters</h6>
            <h6>TV Show Properties</h6>
            <div className="param-list">
              <ul className="flex">
                <li>TV Show Name</li>
                <li>TV Show External ID</li>
                <li>Season Name</li>
                <li>Season Name</li>
              </ul>
            </div>
          </div> */}
          {/* <div className="ex-note m-b-20 m-t-10">
            Note: Your Excel will be imported on the basis of above selected
            parameters.
        </div> */}

          <div className="row m-b-10">
            <div className="col-md-4">
              <ButtonField
                data-test="export-button"
                onClick={() => { this.exportContentType() }}
                className="zee-btn-field zee-full"
                variant="contained"
                color="primary"
                buttonText={"Export File"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExportFile;
