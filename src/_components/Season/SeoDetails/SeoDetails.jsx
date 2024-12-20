import React, { Component } from "react";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper Files
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import checkValidity from "../../Common/FormHelper/FieldValidator";
import {formValidityCheck} from "../../Common/FormHelper/FormValidSetter";
import ViewSeason from "../../Common/ViewDetail/ViewSeason";
import ButtonField from '../../Common/ButtonField/ButtonField';
import { permissionObj } from '../../../_helpers/permission';

import Lock from "../../Common/Locked/Locked";
import LockedPopup from "../../TvShow/LockedPopup";

import { DEFAULT_JSON, getSelectedGroup } from "../../../_helpers/util";
import MarkDone from "images/tick.svg";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

//css
import '../../../../public/css/Common/GlobalField.css';
class SeoDetails extends Component {
  constructor(props) {
    super(props);
    let { state, journeyType } = props;
    const { jsonData } = props;
    this.state = {
      JSONSchema:
        DEFAULT_JSON((journeyType == "2" )? jsonData: (journeyType == "3")? jsonData: jsonData?.SeoJson ),        
         JSONSchemaGlobal:
        DEFAULT_JSON(state ? jsonData: jsonData.globalProperties) || [],
      tvShowId: null,
      allGlobalData: [],
      updateId: [],
      tabData: constantText.tvshow_seo_header_arr,
      selectedTab: 0,
      identifyTab: state,
      action: "UnPublished",
      tvShowTitle: null,
      formIsValid: false,
      readyToDone: true,
      isUpdate: false,
      showStatePopup: false,
      status: null,
      stage: null,
      generateUrlStructure: this.generateUrlStructure.bind(this)
    };
  }
  async componentDidMount() {
    let { tvShowId, seasonId } = this.props;
    this.setState({ tvShowId: tvShowId, seasonId : seasonId || null }, this.fillSeoDetails);
    let shallowArr = []
    await shallowArr.push(JSON.parse(JSON.stringify([...this.state.JSONSchemaGlobal])))
    this.setState({ allGlobalData: shallowArr });
  }
  static getDerivedStateFromProps = (props, state) => {
    if(props.propertiesData && !state.propertiesDataFetched) {
      state.propertiesDataFetched = true;
      state.generateUrlStructure(props.propertiesData)
    }
    return state
  }
  generateUrlStructure = async (response) => {
    const { JSONSchema } = this.state;
    const { journeyType } = this.props
    const copyJSON = [...JSONSchema];
    if (response) {
      let seasonName = response?.title?.value?.toLowerCase().split(" ").join("-");
           seasonName =   seasonName.replace(constantText.seoSefUrlRegex, '');
      let externalId = response?.externalId?.value;
      const autoGeneratedUrl = `${Config.seasonSefUrl}/${seasonName}/${externalId}`;
      const findIndex = copyJSON.findIndex((item) => item?.name === "sefUrl");
      const findIndexOfCanonicalUrl = copyJSON?.findIndex((item) => item?.name === "canonicalUrl");
      copyJSON[findIndex].helperText = `${Config.seoDomainName}`;
      let { contentState } = response;
      this.setState({ status: contentState?.title?.value });  
      if (copyJSON[findIndex]?.value === "" || copyJSON[findIndex]?.inherited === "true") {
        copyJSON[findIndex].value = autoGeneratedUrl;
        copyJSON[findIndex].inherited = 'false';
      }
      if (journeyType === "1") {
        copyJSON[findIndexOfCanonicalUrl].helperText = `${Config.seoDomainName}`;        
        if (copyJSON[findIndexOfCanonicalUrl].value === "" || copyJSON[findIndexOfCanonicalUrl]?.inherited === "true") {
          copyJSON[findIndexOfCanonicalUrl].value = autoGeneratedUrl;
          copyJSON[findIndexOfCanonicalUrl].inherited = 'false';
        }
      }
    }
    this.setState({ JSONSchema: copyJSON })
  };
  
  fillSeoDetails = async () => {
    const { tvShowId, JSONSchema, seasonId } = this.state;
    const url = `${Config.season.seo}/${tvShowId}/${seasonId}`;
    const response = await apiCalls(url, "GET", {});
    if (response) {
      let JSONSchemaCopy = JSONSchema ? JSONSchema?.map(data => ({
        ...data, value: data?.name === 'redirectionType' ? response?.RedirectionType?.value : response?.[data?.name]?.value ? response?.[data?.name]?.value : data["value"],
        initialValue: response?.[data?.name]?.value || data["value"],
        inherited: response?.[data?.name]?.inherited || "true"
      })) : JSONSchema;
      const { formValidity } = formValidityCheck(JSONSchemaCopy);
      let updateObj = {
        formIsValid: formValidity,
        JSONSchema: JSONSchemaCopy,
      };
      this.setState(updateObj);
    }
    this.generateUrlStructure()
  };
  
    fillSeoDetailsGlobal = async () => {
      let { seasonId, allGlobalData, JSONSchemaGlobal, updateId } = this.state;
      const url = `${Config.seo.global}/${seasonId}?langCode=en&type=seo`;
      const responseAll = await apiCalls(url, "GET", {});

      let allGlobalDataCopy = (responseAll?.length > 0) ? responseAll?.map((dataObj) => JSONSchemaGlobal?.map(obj => (
        { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
        ))) : allGlobalData;
       let updateIdCopy = (responseAll?.length > 0) ? responseAll?.map((data, indexItem)=> updateId[indexItem] = data.id): updateId
      this.setState({allGlobalData: allGlobalDataCopy, updateId: updateIdCopy})     
    };
  
  setSelectDataArr = (res, index) => {
    const copySelect = [...this.state.JSONSchema];
    copySelect[index].data = res;
    this.setState({ filters: copySelect });
  };

  setSelectDataArrGlobal = (res, index, rootIndex) => {
    const copyJSONGlobal = [...this.state.allGlobalData];
    const updatedElement = copyJSONGlobal[rootIndex][index];
    if (updatedElement.name === "country") {
      const GroupName = [];
      res?.forEach((group) => {
        group?.countries?.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      updatedElement.data = GroupName || [];
    } else {
      updatedElement.data = res || [];
    }
    this.setState({ allGlobalData: copyJSONGlobal });
  };

  selectGroup = (event, group, rootIndex) => {
    const { allGlobalData } = this.state;
    const copyLicense = [...allGlobalData];
    const copyRoot = copyLicense[rootIndex]
    const copyElement =  copyRoot[0];    
    const copyOptions = [...copyElement.data];
    copyElement.value = getSelectedGroup(event, group, copyOptions, copyElement?.value);
    this.setState({
      allGlobalData: copyLicense
    });
  };

  removeLock = async () => {
    this.showHideStatePopup();
    this.props.unLockedSession(this.props?.selectedTab);
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  handleMarkAsDone = (mode) => {
    this.props.markAsDone(this.props?.selectedTab, mode);
  };

  
  handleSave = async (rootIndex, index, sectionName) => {
    let { seasonId } = this.props;
    let shallowArr = [...this.state[sectionName]] || [];
    let field = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let updatedData
    if (field?.name === "redirectionType") {
      updatedData = (rootIndex != null) ? this.formatData(sectionName, shallowArr) : { [field?.name]: field.value.id};     
    } else {
      updatedData = (rootIndex != null) ? this.formatData(sectionName, shallowArr) : { [field?.name]: field.value };
    }
    let findIndex = shallowArr?.findIndex((item) => item?.name === "sefUrl");
    let findIndexOfCanonicalUrl = shallowArr?.findIndex((item) => item?.name === "canonicalUrl");
    // appending sef and canonicalUrl with every call
    updatedData = {...updatedData, ...{ ["sefUrl"] : shallowArr[findIndex]?.value } } 
    updatedData = {...updatedData, ...{ ["canonicalUrl"] : shallowArr[findIndexOfCanonicalUrl]?.value } } 
    let { errorText } = field;
    if (!errorText) {
      const response = await apiCalls(`${Config.season?.seo}/${seasonId}`, "PATCH", updatedData, null, false, false,
        this.props?.autoSaveError);
      if (response) {
        if (rootIndex != null) {
          let rootArr = [...shallowArr[rootIndex]];
          rootArr = rootArr?.map(data => ({ ...data, inherited: "false" }))         
          rootArr[index] = { ...rootArr[index], initialValue: field?.value, editable: false };
          shallowArr[rootIndex] = rootArr;
          this.setState(prevState => ({ [sectionName]: shallowArr }));
        }
        else {
          shallowArr[index] = { ...shallowArr[index], initialValue: field?.value, inherited: "false", editable: false };         
          this.setState(prevState => ({ [sectionName]: shallowArr }));
        }
        this.props.markAsDone(this.props?.selectedTab, false);
      }
    }
  }

  InputChanger = (event, elemIndex) => {
    let { status } = this.state;
    if (status === constantText.collectionConstants.published) {
      this.setState({ status: constantText.castProfile.changed });
    }
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value = event.target.value;
    }
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation,
      false
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    updatedElement.touched = 1;
    copyJSON[elemIndex] = { ...copyJSON[elemIndex], value: event.target.value }; //new code
    this.setState({ JSONSchema: copyJSON }, () => {
      this.handleMarkAsDone(false);
    });
  };

  autoSaveGlobal = async (rootIndex, index, sectionName) => {
    const copyJSONGlobal = [...this.state[sectionName]];
    const updatedElement = copyJSONGlobal[rootIndex][index];
      const { seasonId, updateId } = this.state;
      const putData = {};
      if (updatedElement?.name === "redirectionType") {
        putData[updatedElement?.name] = updatedElement?.value?.id;
      } else {
        putData[updatedElement?.name] = updatedElement?.value;
      }
      if(updatedElement.name === 'country'){
        putData[updatedElement?.name] = updatedElement.value.map(data => data.id);
      } 
      let saveData = { data : [ putData]}
      let response
      if(updateId?.length === 0){
        response = await apiCalls( Config.season.seoGlobal +'/'+ seasonId, "PUT", saveData, null, false, false, this.props.autoSaveError );
      } else {
        putData["id"] = updateId[rootIndex]
        response = await apiCalls( Config.season.seoGlobal +'/'+ seasonId, "PUT", saveData, null, false, false, this.props.autoSaveError );
      }
      if(response !== null){
        updateId[rootIndex] = response.id
        this.setState({ updateId})
      }
      updatedElement.touched = 0;
      this.setState({ isUpdate: true, allGlobalData: copyJSONGlobal });
      this.props.markAsDone(this.props?.selectedTab, false);
  };



  InputChangerGlobal = (event, rootIndex, index, sectionName) => {
    let { value } = event.target;
    let stepNameArr = this.state[sectionName].slice();
    let shallowArr = [...stepNameArr];
    if (rootIndex != null) {
      let rootArr = [...shallowArr[rootIndex]];
      let { type, validation } = rootArr[index];
      let { errorText } = checkValidity(value, validation, false)
      rootArr[index] = { ...rootArr[index], value, errorText };
      shallowArr[rootIndex] = rootArr;
      this.handleMarkAsDone(false);
      if (type === "checkbox") {
        this.setState(prevState => ({ [sectionName]: shallowArr }));
        this.autoSaveGlobal(index, rootIndex, sectionName);
      }
      this.setState(prevState => ({ [sectionName]: shallowArr }));
    }
    else {
      let { type, validation } = shallowArr[index];
      let { errorText } = checkValidity(value, validation, false)
      shallowArr[index] = { ...shallowArr[index], value, errorText };
      this.setState(prevState => ({ [sectionName]: shallowArr }));
    }
  };

  showHideStatePopup = () => {
    const { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup,
    });
  };


  addRemoveMultipleFields = async(index) => {
    let { allGlobalData, JSONSchemaGlobal } = this.state;
    const copyGlobalData = [...allGlobalData];
    if (index > 0) {
      if(this.state.updateId[index] !== null & this.state.updateId[index] !== undefined){
        await apiCalls( Config.season.global +'/'+ this.state.updateId[index], "DELETE", {}, null, false, false, this.props.autoSaveError );
        copyGlobalData.splice(index, 1);
      } else {
        copyGlobalData.splice(index, 1);
      }
    } else {
      copyGlobalData.push(JSONSchemaGlobal)
    }    
    this.setState({ allGlobalData: copyGlobalData });
  };

  handleEditable = (rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let { editable, initialValue, value } = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    (rootIndex != null) ? (shallowArr[rootIndex][index]["editable"] = !!!editable) :
      (shallowArr[index]["editable"] = !!!editable);

    (rootIndex != null) ? (shallowArr[rootIndex][index]["value"] = !!editable ? initialValue : value) :
      (shallowArr[index]["value"] = !!editable ? initialValue : value);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  }



  handleTab = (event, selectedTab) => this.setState(prevState => ({ selectedTab }));

  render() {
    let { tabData, selectedTab, JSONSchema, readyToDone, showStatePopup, status, allGlobalData } = this.state;
    let { currentTabData, stage, viewOnly, handleRoute } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData;
    let { canUpdate } = permissionObj?.season?.seoModule;

    return (
      <Lock
        lock={isLocked}
        lockedBy={lockedBy}
        clicked={this.showHideStatePopup}
      >
        <div className="whitebox">
          <div className="drag-drop-wrap">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.seo_details_text}</h4>
              <div className="status-head flex align-items-center">
                {stage && (
                  <BadgeBox
                    className="create-movie-stage"
                    status={stage}
                  />
                )}
                {viewOnly &&
                  <div className="edit-btn">
                    <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                      buttonText={constantText.tv_show_season_text.edit}
                      disabled={!canUpdate()}
                      onClick={handleRoute}
                    />
                  </div>
                }
                {!viewOnly &&
                  <div onClick={() => readyToDone &&  !isDone && !isLocked ? this.markAsDone() : {} }
                    disabled={isLocked}
                    className={
                      isDone
                        ? "mark-done mark-active auto-mark-done"
                        : readyToDone
                        ? "mark-done mark-fill-active auto-mark-done"
                        : "mark-done auto-mark-done"
                    }
                  >
                    <span>
                      <MarkDone />
                    </span>
                    {constantText.mark_as_done_text}
                  </div>
                }
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
                data-test="handle-tab-method" selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
            </div>
            {(selectedTab == 0) &&
              <div className="col-12">
                <div className="row input-space-35">
                <ViewSeason allData={JSONSchema}
                  data-test="testTvShowSeo"
                  onChange={this.InputChanger}
                  setSelectDataArr={this.setSelectDataArr}
                  serverCall={true}
                  isDisable={isLocked}
                  updateData={index => this.handleSave(null, index, 'JSONSchema')}
                  callBack={index => this.handleEditable(null, index, "JSONSchema")}
                  viewOnly={viewOnly}
                />
                </div>
              </div>            
            }
            {(selectedTab == 1) &&
              <div className="col-12">  
                <div className="global-wrap">               
                  {allGlobalData?.map((globalGroupFields, globalIndex) => (
                    <div className="global-row" key={globalIndex}>
                      <div className="add-plush-row top-title">
                        <div className="top-text">
                          {`${constantText.global_fields_SEO} ${globalIndex >= 0 ? ` - ${globalIndex + 1}` : ''}`}
                        </div>
                        <div className="add-another-f-btn create-btn">
                          <div className={`${globalIndex > 0 ? 'remove-btn' : ''} add-btn-field flex align-items-center`}
                            onClick={() => this.addRemoveMultipleFields(globalIndex)}>
                            <span className="plush-icon-btn"></span>      
                          </div>
                        </div>
                      </div>
                      <div className="row input-space-35">
                          <ViewSeason 
                            data-test="testTvShowSeo"
                            allData={allGlobalData[globalIndex]}
                            selectGroup={(event, group) =>this.selectGroup (event, group, globalIndex )}
                            setSelectDataArr={(res, index) => this.setSelectDataArrGlobal(res, index, globalIndex )}
                            updateData={index => this.autoSaveGlobal(globalIndex, index, 'allGlobalData')}
                            callBack={index => this.handleEditable(globalIndex, index, "allGlobalData")}
                            serverCall={true}
                            isDisable={isLocked}
                            viewOnly={viewOnly}
                          />
                      </div>                   
                    </div>
                  ))}                
                </div>            
              </div>            
            }            
          </div>
        </div>
        <LockedPopup
          className="popup-wrap status-popup"
          state={showStatePopup}
          lockedBy={lockedBy}
          doneAction={this.removeLock}
          cancelAction={this.showHideStatePopup}
        />
      </Lock>
    );
  }
}

export default SeoDetails;
