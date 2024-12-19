import React from 'react';
import { Component, Fragment } from 'react';
//Helper Files
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import BulkAssignAssets from './BulkAssignAssets';
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import ButtonField from "../../Common/ButtonField/ButtonField";
import FormRender from "../../Common/FormHelper/FormRender";
import { constantText } from '../../../_helpers/constants.text';
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';
import checkValidity from "../../Common/FormHelper/FieldValidator";

//Json
import {
  select_content_type_status, select_action_type, select_externalId_mode
} from "../Schema/PublishAndUnpublish/PublishAndUnpublish.json";
import headerTabs from '../Schema/HeaderTab/HeaderTab.json';
import filtersJson from "../Schema/SideFilter/SideFilter.json";
import ByExternalIdJson from "../Schema/PublishAndUnpublish/ByExternalId.json";
//Icon
import LightIcon from "images/light-icon.svg";
class PublishAndUnpublish extends Component {
  constructor(props) {
    let headerTabsCopy = JSON.parse(JSON.stringify(headerTabs));
    headerTabsCopy = headerTabsCopy.filter(tab => tab.visible);
    super(props)
    this.bulkAssignAssets = React.createRef();
    this.state = {
      selectedTab: 0,
      contentSelectedTab: 0,
      subTypeTab:0,
      filterQuery: {},
      languageArr: [],
      externalIDArr: [],
      selectedExternalIdTab: 0,
      byExternalIdJson: JSON.parse(JSON.stringify(ByExternalIdJson)),
      options: headerTabsCopy,
      searchText: '',
      adding: false,
      selectedContentType: '',
      selectedActionType: '',
      action: select_action_type[0]?.keyName,
      subTypeOptions: [],
      selectedSubTypeOption:''
    }
  }
  componentDidMount = () => {
    this.getList()
  }

  tabExternalSwitched = (event, selectedTab) =>{
    this.setState({
      selectedExternalIdTab: selectedTab
    });
  }

  tabSwitched = (event, selectedTab, type) => {
    if (selectedTab === this.state.selectedTab && type === constantText.bulksOpsConstant.actionType) {
      return;
    } else if (selectedTab === this.state.contentSelectedTab && type === constantText.bulksOpsConstant.contentType) {
      return;
    }else if(selectedTab===this.state.subTypeTab && type=== constantText.bulksOpsConstant.subType){
      return
    }
    else if (type === constantText.bulksOpsConstant.actionType) {
      this.setState({
        selectedTab: selectedTab,
        selectedActionType: select_action_type[selectedTab]?.name,
        action: selectedTab == 0 ? select_action_type[selectedTab]?.keyName : selectedTab == 1 ? select_action_type[selectedTab]?.keyName : select_action_type[selectedTab]?.keyName
      })
    } else if (type === constantText.bulksOpsConstant.contentType) {
      this.setState({
        subTypeOptions: [],
        selectedSubTypeOption:'',
        subTypeTab:0,
        contentSelectedTab: selectedTab
      },()=>{
        let subTypeParams=select_content_type_status[selectedTab]?.name===constantText.bulksOpsConstant.tvshowContentName? constantText.bulksOpsConstant.tvShowSubType : select_content_type_status[selectedTab]?.name===constantText.bulksOpsConstant.episodeContentName ? constantText.bulksOpsConstant.episodeSubType :'';
        if(subTypeParams && subTypeParams?.length>0){
        this.getSubType(subTypeParams)
        }
      })
    }else if(type===constantText.bulksOpsConstant.subType){
      const {subTypeOptions}=this.state
      this.setState({
        subTypeTab: selectedTab,
        selectedSubTypeOption:subTypeOptions.length >0 ? subTypeOptions[selectedTab].id :''
      })
    }
  }

  getSubType = async (subTypeParams) => {
    let { subTypeOptions ,subTypeTab} = this.state;
    let response = await apiCalls(`master/${subTypeParams}?status=all&translation=yes`, "GET", {}, null, true, false, this.props.autoSaveError);
    if (response.length > 0) {
      response.forEach((item) => {
        let subTypeObject = {}
        subTypeObject.label = item?.title,
          subTypeObject.name = item?.title,
          subTypeObject.id = item?.id
        subTypeOptions.push(subTypeObject)
      })
    }

    this.setState({
      subTypeOptions,
      selectedSubTypeOption:subTypeOptions.length >0 ? subTypeOptions[subTypeTab].id :''
    })
  }
  getExternalIdMode = (contentArray) => {
    const { selectedExternalIdTab } = this.state
    return (
      <div className="cr-mov-tab ralated-tabs">
        <LeftTab
          className="tabs"
          orientation="horizontal"
          variant="scrollable"
          options={[...contentArray]}
          selectedTab={selectedExternalIdTab}
          showIcon={false}
          handleChange={(event, selectedTab) => this.tabExternalSwitched(event, selectedTab)} />
      </div>
    )
  }
  getContentTypes = (contentArray, type) => {
    const { selectedTab, contentSelectedTab ,subTypeTab} = this.state
    return (
      <div className="cr-mov-tab ralated-tabs">
        <LeftTab
          className="tabs"
          orientation="horizontal"
          variant="scrollable"
          options={[...contentArray]}
          selectedTab={type == constantText.bulksOpsConstant.actionType ? selectedTab : type===constantText.bulksOpsConstant.subType ? subTypeTab : contentSelectedTab}
          showIcon={false}
          handleChange={(event, selectedTab) => this.tabSwitched(event, selectedTab, type)} />
      </div>
    )
  }

  handleSearch = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: [value], page: 1 }, () =>
      this.fetchIngestionList(1)
    );
  };
  getList = async () => {
    this.setState({
      selectedActionType: select_action_type[this.state.selectedTab]?.name,
      selectedContentType: select_content_type_status[this.state.contentSelectedTab]?.name
    })
  }
  getAllLanguage = async () => {
    let response = await apiCalls(`${Config.masterUrl}/Language`, "GET", {}, `/movie`, false)
    if (response) { this.setState({ languageArr: response }) }
  }
  addContentHandler = (newContents) => {
    const { selectedTab } = this.state
    let currentTab = this.state.options[this.state.contentSelectedTab]
    const externalId = newContents.map(item => item[currentTab.contentIdKey]);
    const contentType = currentTab.publishApiKey;
    const actionType = selectedTab === 2 ?
     String(constantText.bulksOpsConstant.bulkDeleteAPICode) : selectedTab === 0 ? 
     String(constantText.bulksOpsConstant.bulkPublishAPICode) : String(constantText.bulksOpsConstant.bulkUnPublishAPICode);
     this.publishContent(
      {
        externalId,
        contentType,
        actionType
      });

  }
  closeAddContent = () => {
    this.setState({ adding: false })
  }
  ByExternalIdInputChanger = (event, elemIndex) => {
    let Arr = [];
    const countIds = (externalIds) => {
      if(externalIds?.includes(",")){
        Arr = externalIds.split(",");
        Arr = Arr?.filter(e => e !== "");
        if(Arr?.length > 100){
          return false;
        }
      }
      return true;
    }
    const copyJSON = [...this.state.byExternalIdJson];
    const updatedElement = copyJSON[elemIndex];
    updatedElement.value = event?.target?.value;
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    updatedElement.touched = 1;
    if(isValid){
      updatedElement.valid = countIds(updatedElement?.value) ? updatedElement.valid : false;
      updatedElement.errorText = countIds(updatedElement?.value) ? updatedElement.errorText : constantText?.onlyHundredExternalIdError;
    }
    if(isValid && updatedElement?.value && (!updatedElement?.value?.includes(","))){
      Arr = [updatedElement?.value];
    }
    updatedElement.helperText = Arr?.length ? `External Id Count - ${Arr?.length}`: ``;
    this.setState({ externalIDArr: Arr, externalValid :  updatedElement.valid, byExternalIdJson : copyJSON});
  }
  publishContent = async (data) => {
    const {selectedTab}=this.state;
    let res = await apiCalls(Config.bulkUpdate.bulkOperations, "POST", data, null, true, false, this.props.autoSaveError, null);
    if (res?.jobId) {
      let successMessage=selectedTab==0 ?
       constantText.bulksOpsConstant.bulkPublishSucessMessage : selectedTab==1 ?
       constantText.bulksOpsConstant.bulkUnPublishSucessMessage: constantText.bulksOpsConstant.bulkDeleteSucessMessage
       showSuccessErrorMsg(successMessage, null, "Success", true, null, true)
       if(selectedExternalIdTab == 1){
        this.bulkAssignAssets.current.resetAssestList();
      }
    }
  }
  byExternalActionHandler = () => {
    const { selectedTab, externalIDArr} = this.state
    let currentTab = this.state.options[this.state.contentSelectedTab]
    const externalId = [...externalIDArr];
    const contentType = currentTab.publishApiKey;
    const actionType = selectedTab === 2 ?
     String(constantText.bulksOpsConstant.bulkDeleteAPICode) : selectedTab === 0 ? 
     String(constantText.bulksOpsConstant.bulkPublishAPICode) : String(constantText.bulksOpsConstant.bulkUnPublishAPICode);
     this.publishContent(
      {
        externalId,
        contentType,
        actionType
      });
  }
  render() {
    const { selectedTab, contentSelectedTab, externalValid, byExternalIdJson, selectedActionType, selectedExternalIdTab, action,subTypeOptions,selectedSubTypeOption ,subTypeTab } = this.state;
    const option = this.state.options[contentSelectedTab];
    return (
      <div className="whitebox p-all-15">
        <div className="bulk-ops-wrap ex-file-wrap">
          <div className="refresh-list-box m-b-20">
            <div className="icon-w-text">
              <LightIcon />
              {constantText.bulksOpsConstant.selectFilterTitle}
            </div>
          </div>
          <h4>{constantText.bulksOpsConstant.selectActionType}</h4>
          {this.getContentTypes(select_action_type, constantText.bulksOpsConstant.actionType)}
          <h4>{constantText.bulksOpsConstant.selectContentType}</h4>
          {this.getContentTypes(select_content_type_status, constantText.bulksOpsConstant.contentType)}
          { subTypeOptions &&
            subTypeOptions.length > 0 && <h4>{constantText.bulksOpsConstant.selectSubType}</h4>}
          {subTypeOptions &&
            subTypeOptions.length > 0 &&
            this.getContentTypes(subTypeOptions, constantText.bulksOpsConstant.subType)}

          <h4>{constantText?.bulksOpsConstant?.byExternalId}</h4>
          {this.getExternalIdMode(select_externalId_mode)}
          {selectedExternalIdTab == 0 && 
            <div>
              <div className="row col-12 act-btn-flex-end">
                  <FormRender
                    form={byExternalIdJson}
                    onChange={this.ByExternalIdInputChanger}
                  />
                <div className="col-md-6 col-lg-6 m-b-30 form-save-btn">
                  <ButtonField
                    className="zee-btn-field zee-full"
                    variant="contained"
                    color="primary"
                    disabled={!externalValid}
                    buttonText={`${selectedActionType} ${option?.selectedItemsButtonText}`}
                    onClick={this.byExternalActionHandler}
                  />
                </div>
              </div>
            </div>
          }
          {selectedExternalIdTab == 1 &&
            <Fragment>
              <h4>{constantText.bulksOpsConstant.selectFilter}</h4>
              <BulkAssignAssets
                filtersJson={JSON.parse(
                  JSON.stringify(
                    filtersJson[
                      select_content_type_status[contentSelectedTab]?.name
                    ]
                  )
                )}
                meta={select_action_type[selectedTab]?.name}
                pageClass={"relatedcontent-block related-block-content"}
                quickLinksPage={false}
                contentIdKey={option.contentIdKey}
                added={this.addContentHandler}
                meta={option}
                closeAddAsset={this.closeAddContent}
                assignedData={[]}
                hideBackArrow={false}
                isRelatedContent={false}
                action={action}
                ref={this.bulkAssignAssets}
                selectedSubTypes={selectedSubTypeOption}
                subTypeTab={subTypeTab}
              />
            </Fragment>
          }
        </div>
      </div>
    )
  }
}
export default PublishAndUnpublish;