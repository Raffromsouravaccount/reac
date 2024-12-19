import React, { Component } from 'react';
import { connect } from 'react-redux';

//Helper Files
import FormRender from '../../../Common/FormHelper/FormRender';
import { constantText } from '../../../../_helpers/constants.text';
import { getSelectedGroup } from '../../../../_helpers/util';
import ButtonField from "../../../Common/ButtonField/ButtonField";
import checkValidity from '../../../Common/FormHelper/FieldValidator';
import { formValidityCheck } from "../../../Common/FormHelper/FormValidSetter";
import { INCREASE_REQUEST, DECREASE_REQUEST } from '../../../../_constants/common.constants';
import config from '../../../../Config/config';
import { showSuccessErrorMsg } from '../../../../_actions/alertMessages.action';
import { CommonModel } from "../../../Common/Model/CommonModel";

//Service
import { apiCalls } from "../../../../_services/common.service";

//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
import TagIcon from "images/tag-icon.svg";




class ImageSetCreate extends Component {

  constructor(props) {
    super(props);
    const { jsonData } = props;
    this.state = {
      formFieldsJson: JSON.parse(JSON.stringify(jsonData?.createSet)),
      disableSaveButton: true,
      showStatePopup:false
    };
  }

  getUpdatedData = (shallowFormFieldsJson, editSet) => {
    Object.keys(shallowFormFieldsJson).forEach(key => {
      shallowFormFieldsJson[key].forEach((field, index) => {
        if (key === 'tags') {
          editSet['tags'][`${field.name}`] ? field.value = editSet['tags'][`${field.name}`] : "";
        } else {
          editSet[`${field.name}`] ? field.value = editSet[`${field.name}`] : "";
        }
      })
    })
    return shallowFormFieldsJson;
  }

  componentDidMount() {
    let { editSet } = this.props;
    if (editSet && editSet.setName) {
      let { formFieldsJson } = this.state;
      let shallowFormFieldsJson = JSON.parse(JSON.stringify(formFieldsJson));
      shallowFormFieldsJson = this.getUpdatedData(shallowFormFieldsJson, editSet);
      let { formValidity } = formValidityCheck(shallowFormFieldsJson['fields'].filter(item => item.name === 'setName'));
      this.setState({ formFieldsJson: shallowFormFieldsJson, disableSaveButton: !formValidity }, () => {
        this.getMasterData();
      })
    } else {
      this.getMasterData();
    }
  }

  getMasterData() {
    let { formFieldsJson } = this.state;
    let shallowFormFieldsJson = JSON.parse(JSON.stringify(formFieldsJson));
    Object.keys(shallowFormFieldsJson).forEach(key => {
      shallowFormFieldsJson[key].forEach((field, index) => {
        if (field.type == 'dropdown' && field.path) {
          this.setMasterData(key, index, shallowFormFieldsJson, field.path);
        }
      })
    })
  }

  async setMasterData(key, index, shallowFormFieldsJson, url) {
    if (index == 1 && key == 'fields') {
      let response = await apiCalls(url, 'GET', {});
      if (response) {
        const GroupName = [];
        response.forEach((group) => {
          group?.countries.forEach((item) => {
            const obj = { ...item };
            obj.group = group?.title;
            GroupName.push(obj);
          });
        });
        shallowFormFieldsJson[key][index]['data'] = GroupName;

        this.setState({ formFieldsJson: shallowFormFieldsJson });
      }
    }
    else {
      let response = await apiCalls(url, 'GET', {});
      if (response) {
        shallowFormFieldsJson[key][index]['data'] = response;
        this.setState({ formFieldsJson: shallowFormFieldsJson });
      }
    }
  }

  selectGroup = (event, group, key) => {
    const { formFieldsJson } = this.state;
    const copyFormFieldsJson = JSON.parse(JSON.stringify(formFieldsJson));
    const copyElement = { ...copyFormFieldsJson[key][1] };
    const copyOptions = [...copyElement.data];
    copyElement.value = getSelectedGroup(event, group, copyOptions, copyElement.value);

    copyFormFieldsJson[key][1] = copyElement;
    this.setState({ formFieldsJson: copyFormFieldsJson });
  };

  inputChange = (event, elemIndex, key) => {
    let { formFieldsJson } = this.state;
    let shallowFormFieldsJson = JSON.parse(JSON.stringify(formFieldsJson));
    const copyJSON = [...shallowFormFieldsJson[key]];
    const fieldJSON=[...shallowFormFieldsJson['fields']];
    const tagsJSON=[...shallowFormFieldsJson['tags']];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement) {
    updatedElement.value =
    updatedElement?.type === "checkbox"
      ? event.target.checked
      :updatedElement?.type==="text"? (event.target.value.trim() ? event.target.value : event.target.value.trim()):event?.target?.value;
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
    shallowFormFieldsJson[key][elemIndex] = updatedElement;
    this.setState({ formFieldsJson: shallowFormFieldsJson, disableSaveButton:  formValidityCheck(fieldJSON)?.formValidity ? ! formValidityCheck(tagsJSON)?.formValidity :true });
  }

  autoSave = () => { }

  formatData = (data) => {
    const formattedData = {};
    data?.forEach(item => {
      item.value ? formattedData[`${item.name}`] = Array.isArray(item.value) ? item.value.map(selectedValue => selectedValue.id) : item.value : formattedData[`${item.name}`] = (item.name === 'setName' || item.name === 'others') ? "" : [];
    });
    return formattedData;
  }

  createSet = async (e) => {
    const { formFieldsJson } = this.state;
    const { tvShowId ,seasonId} = this.props;
    const dataObj ={}
    dataObj['setName']=this.formatData([...formFieldsJson['fields']]).setName.trim(),
    dataObj['GroupCountry']=this.formatData([...formFieldsJson['fields']]).GroupCountry,
    dataObj['Platform']=this.formatData([...formFieldsJson['fields']]).Platform,
    dataObj['tags'] = this.formatData([...formFieldsJson['tags']]);

    let url =  `${config.season.imageSet}`;

    if (this.props.editSet && this.props.editSet.setName) {
      const dataParams = {
        imageSetId: this.props.editSet.imageSetId,
        ...dataObj
      }
      url = `${url}/${tvShowId}/${seasonId}`
      const sameSetName=  this.props.imageSets && this.props.imageSets.filter(set=>set.setName?.trim().toLowerCase()===dataObj.setName.trim().toLowerCase());
      let updateSetDetail=dataObj.setName?.trim().toLowerCase()===this.props.editSet.setName.trim().toLowerCase()?true: sameSetName.length==0?true:false;
      if(updateSetDetail){
      const res = await apiCalls(url, "PUT", dataParams, null, true, false, this.props.autoSaveError);
      if (res?.status == 400 && res?.message) {
        showSuccessErrorMsg(res.message, null, 'error');
      } else if (res) {
        this.props.markAsDone(this.props?.selectedTab, false);
        this.props.navToImageSet(0);
      }}else{
        showSuccessErrorMsg(constantText.sameSetName, null, 'error');
      }
    } else {

      let dataParams = { seasonId: seasonId,tvShowId: tvShowId, imageSets: dataObj };
      const res = await apiCalls(url, "POST", dataParams,null, true, false, this.props.autoSaveError);
      if (res?.status == 400 && res?.message) {
        showSuccessErrorMsg(res.message, null, 'error');
      } else if (res) {
        this.props.markAsDone(this.props?.selectedTab, false);
        this.props.navToImageSet(0);
      }
    }
  }


  showCommonPopUp=()=>{
    this.setState({
      showStatePopup:true
    })
  }

  showHideStatePopup=()=>{
    this.props.navToImageSet(0);
  }
  hidePopUp=()=>{
    this.setState({
      showStatePopup:false
    })
  }

  render() {
    const { navToImageSet, editSet } = this.props;
    const { formFieldsJson, disableSaveButton, showStatePopup } = this.state;
    let { currentTabData } = this.props;
    let { isLocked } = currentTabData || {};
    return (
      <div className="whitebox">
        <div className="ccm-head flex align-items-center m-b-30">
          <CommonModel
              className="popup-wrap status-popup"
              state={showStatePopup}
              showTitle={true}
              title="Image"
              showIcon={false}
              showDes={true}
              des={
                constantText.licence_save_message
              }
              showBtn1={true}
              btn1Text={constantText.ok_text}
              btn1Action={
               this.showHideStatePopup
              }
              showBtn2={true}
              btn2Text={"Cancel"}
              btn2Action={this.hidePopUp}
            />
          <span className="back-arrow auto-back-arrow" onClick={() => this.showCommonPopUp()}><AngleLeftArrow /></span>
          {editSet && editSet.setName ?
            <h4>{constantText.create_movie_image_edit_set_text}</h4>
            :
            <h4>{constantText.create_movie_image_create_set_text}</h4>
          }
        </div>
        <div className="movieForm-tab">
          <div className="movie-f-wrap row col-12">
            {formFieldsJson.fields.length > 0 &&
              <FormRender
                data-test="input-change-field"
                form={formFieldsJson.fields}
                onChange={(e, index) => this.inputChange(e, index, 'fields')}
                selectGroup={(e, group) => this.selectGroup(e, group, 'fields')}
                handleBlur={this.autoSave}
                isDisable={isLocked}
              />}
            <div className="set-tag col-md-12 col-lg-12 flex ">
              <TagIcon /> <h4>{constantText.create_movie_image_tags_text}</h4>
            </div>
            <FormRender
              data-test="input-change"
              form={formFieldsJson.tags}
              onChange={(e, index) => this.inputChange(e, index, 'tags')}
              handleBlur={this.autoSave}
              isDisable={isLocked}
            />
          </div>
          <div className="row col-12">
            <div className="col-md-6 col-lg-6 m-b-30 form-save-btn">
              <ButtonField
                className="zee-btn-field zee-full"
                variant="contained"
                color="primary"
                buttonText={constantText.create_movie_image_create_set_save_text}
                disabled={disableSaveButton}
                onClick={this.createSet}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const actionCreators = dispatch => {
  return {
    INCREASE_REQUEST: () => dispatch({ type: INCREASE_REQUEST }),
    DECREASE_REQUEST: () => dispatch({ type: DECREASE_REQUEST })
  }
};
export default connect(null, actionCreators)(ImageSetCreate);
