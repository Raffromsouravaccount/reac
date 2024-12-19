import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

//Common Components
import ButtonField from "../../Common/ButtonField/ButtonField";
import ImagePreview from "../../Common/ImagePreview/ImagePreview";
import Locked from "../../Common/Locked/Locked"
import { CommonModel } from '../../Common/Model/CommonModel';
import BadgeBox from "./../../Common/BadgeBox/BadgeBox";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";

//Helper files
import { DECREASE_REQUEST, INCREASE_REQUEST } from '../../../_constants/common.constants';
import { constantText } from "../../../_helpers/constants.text";
import Config from "../../../Config/config";
import { getLocalData } from "../../../_helpers/util";
import { apiCalls, commonService } from "../../../_services/common.service";
import { requiredValidate, checkImageType ,getFileNameAndExtension} from "../../../_helpers/validation";

//Icons
import LockIcon from "images/lock-icon.svg";
import MarkDone from "images/tick.svg";

//CSS
import "./CreateProfile.css";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.state = {
      castProfileId: "", stage: "", userData: getLocalData("userData"),
      profile: [], relation: [], relationArr: [], updatedObj: {}, allRelatedData: [],
      imageData: null, profileData: null,
      canMarkAsDone: false, showLockedPopup: false, error: null,errorFileType:false,errorFileSize:false,
      externalId:null
    };
  }

  componentDidMount = () => {
    let { castProfileId, Profile } = this.props;
    const { profile, relation, relationArr } = Profile || {};
    if (castProfileId) {
      this.setState(prevState => ({
        castProfileId,
        profile: profile || [],
        relation: relation || [],
        relationArr: relationArr || []
      }), () => {
        this.getProfileData();
        this.getAllRelatedData();
      });
    }
  }

  getAllRelatedData = async () => {
    let { castProfileId } = this.state;
    const response = await apiCalls(Config.castnamesUrl, "GET", {}, `/cast/edit/${castProfileId}`, false) || [];
    this.setState(prevState => ({ allRelatedData: response }));
  }

  getProfileData = async () => {
    let { castProfileId, profile } = this.state;
    const response = await apiCalls(`${Config.createProfileUrl}/${castProfileId}`, "GET");
    if (response) {
      let { contentState, castProfileImage, markAsDoneDetails } = response;
      this.props.getExternalId(response?.externalId)
      const updatedProfile = await this.updateDataValue(profile, response || {});
      this.setRelationData(response);
      this.setState(prevState => ({
        profileData: response,
        profile: updatedProfile,
        imageData: castProfileImage || null,
        stage: contentState?.title || "",
        externalId:response?.externalId
      }), () => {
        this.props.setStage(contentState)
        this.checkIfMarkAsDone()
      });
    }
  }

  updateDataValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map(data => {
      return {
        ...data,
        value: (updatedObj[data["name"]] ? updatedObj[data["name"]] :
          data["value"]),
      };
    });
    return updatedData;
  };

  updateRelationData = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map(data => {
      let { name } = data;
      let { relation, castName, castProfileId, relationTitle } = updatedObj;
      const relatedToObj = {};
      relatedToObj.id = castProfileId;
      relatedToObj.castName = castName;
      const relationObj = {};
      relationObj.id = relation;
      relationObj.title = relationTitle;
      return {
        ...data,
        value: (name == "relation" && relation) ? relationObj :
          castProfileId ? relatedToObj :
            { id: "", castName },
      };
    });
    return updatedData;
  };
  setRelationData = (profileData) => {
    let { relation, relationArr } = this.state;
    if(profileData?.castRelationship && profileData?.castRelationship?.length){
      relation = profileData?.castRelationship?.map(nestedObj => this.updateRelationData(relationArr, nestedObj));
      this.setState((prevState) => ({ relation }), () => this.checkIfMarkAsDone());
    }
  }
  addRemoveRelation = index => {
    let { relation, relationArr } = this.state;
    let autoFlag = false;
    relation = relation.slice();
    if (index > 0) {
      if(relation[index][0]?.value && relation[index][1]?.value){
        relation.splice(index, 1);
        autoFlag = true;
      }
      else{
        relation.splice(index, 1);
      }
    }else {
      relation.push(relationArr);
    }
    this.setState({ relation }, () => autoFlag ? this.autoSave() : null );
  };

  onFileChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      let fileValid = checkImageType(file?.name);
      if (!fileValid) {
        return this.setState(prevState => ({
          errorFileType:  true,
          errorFileSize:false

        }));
      }else if(file.size > Config.imageMaxSize){
        return this.setState(prevState => ({
          errorFileSize: true,
          errorFileType:false
        }));
      }
      const validFileExtensions = [".jpg", ".jpeg", ".png"];
      let fileObj=getFileNameAndExtension(file.name,validFileExtensions);
      const imageFormatName=fileObj?.name.replace(/[^a-zA-Z0-9]/g, '');
      let imageObj={
        externalId:this.state.externalId,
        imageType:constantText.castProfileImage,
        imageDimension:null,
        imagetitle:imageFormatName.length>0 ? imageFormatName :'profile',
        uuid:this.props.castProfileId,
        imageExtension:fileObj?.extension
      };
      this.props.INCREASE_REQUEST();
      commonService.get_signed_url_and_upload_to_s3(file,imageObj).then(data => {
        this.props.DECREASE_REQUEST();
        let imageData = {
          url:  data?.fileName ? `${data.fileName}`:`${imageObj.imagetitle}-${imageObj?.uuid}${imageObj.imageExtension}`,
          name: `${file?.name}`,
          size: `${file.size}`
        };
        this.setState(prevState => ({ imageData, error: false,errorFileType:false,errorFileSize:false }), () => this.autoSave());
      }).catch(error => {
        console.log("error while upload", error);
      });
    }
  };

  handleInputForAutoCreate = async (event, rootIndex, index) => {
    let { value } = event.target;
    let { castProfileId, relation } = this.state;
    let response = await apiCalls(`${Config.castnamesUrl}?castName=${value}`, "GET", {}, `/cast/edit/${castProfileId}`, false);
    if (response) {
      let shallowArr = [...relation];
      let rootArr = [...shallowArr[rootIndex]];
      rootArr[index] = { ...rootArr[index], data: value ? response : [] };
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ relation: shallowArr }));
    }
  }

  handleAutoCreate = (event, rootIndex, index, stepName) => {
    let { value } = event?.target;
    value = (value?.inputValue) ? { id: "", castName: value?.inputValue } : value;
    this.handleStateChange({ target: { value } }, rootIndex, index, stepName);
  }

  handleStateChange = (event, rootIndex, index, stepName) => {
    let { stage } = this.state
    if (stage === constantText.castProfile.published) {
      this.setState({stage : constantText.castProfile.changed})
    }
    if (stage === constantText.contentConstants.unpublished || stage === constantText.contentConstants.scheduled || stage === constantText.contentConstants.needWork) {
      this.setState({ stage: constantText.contentConstants.draft });
    }
    let { value } = event?.target;
    let stepNameArr = this.state[stepName].slice();
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      let errorText = (index == 1 && value && !rootArr[0]["value"]) ? `Please select ${rootArr[0]["label"]} first` : "";
      value = (index == 1 && value && !rootArr[0]["value"]) ? null : value;
      rootArr[1] = (index == 0) ? { ...rootArr[1], errorText } : rootArr[1];
      rootArr[index] = { ...rootArr[index], value, errorText };
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
    else {
      if(event?.target?.name === 'castName') {
        value = value.replace(/^\s\s*/, '');
      }
      let { updatedObj } = this.state;
      let shallowArr = [...stepNameArr];
      let { errorText } = checkValidity(value, shallowArr[index]?.validation, false);
      shallowArr[index] = { ...shallowArr[index], value, errorText };
      let { name, type, multiple } = shallowArr[index];
      updatedObj = { [name]: (type == "dropdownAsync") ? multiple ? value?.map(data => data?.id) : value?.id : value };
      // this.setState(prevState => ({ [stepName]: shallowArr, updatedObj }));
      this.setState(
        (prevState) => ({ [stepName]: shallowArr, updatedObj }), () => {
        }
      );
    }
  };

  setSelectDataArr = (stepName, rootIndex, index, data) => {
    let { relation, relationArr } = this.state;
    let stepNameArr = this.state[stepName].slice();
    const copyrelationArr = JSON.parse(JSON.stringify(relationArr));
    if (rootIndex != null) {
      copyrelationArr[index] = { ...copyrelationArr[index], data: data || [] }
      if(relation[rootIndex][0]?.value){
        copyrelationArr[0].value = relation[rootIndex][0]?.value;
      }
      relation[rootIndex] = copyrelationArr;
      this.setState((prevState) => ({ relation }), () => this.checkIfMarkAsDone());
    } else {
      let shallowArr = [...stepNameArr];
      shallowArr[index] = { ...shallowArr[index], data: data || [] };
      // shallowArr = this.updateDataValue(shallowArr, profileData || {});
      this.setState((prevState) => ({ [stepName]: shallowArr }), () => this.checkIfMarkAsDone());
    }
  };

  checkError = (data, checkRequired) => {
    let error = null;
    for (let obj of data ? data : []) {
      let { name, multiple, validation, errorText } = obj;
      let { required } = validation || {};
      let value = obj["value"];
      if (errorText) return (error = name);
      if (checkRequired && !!required && requiredValidate(multiple ? !!value?.length : value))
        return (error = name);
    }
    return error;
  }

  formatData = data => {
    let formattedData = {};
    for (let obj of data ? data : []) {
      let { name, type, value, multiple } = obj;
      formattedData[name] = (type == "dropdownAsync") ? multiple ? value?.map(data => data.id) : (value?.id || null) : value;
    }
    return formattedData;
  };

  formatNestedData = dataArr => {
    let formattedData = [];
    dataArr?.map(nestedObj => {
      let { castProfileId, relation } = nestedObj;
      if (castProfileId && relation) {
        const { id, castName } = castProfileId;
        let obj = id ? { castProfileId: id, relation } : { castName, relation };
        formattedData.push(obj);
      }
    });
    return formattedData;
  };

  formatAllData = checkRequired => {
    let { profile, relation } = this.state;
    let dataError = this.checkError(profile, checkRequired);
    let relationArrOfObj = [];
    let relationObj = relation?.map(skipSongNestedArr => skipSongNestedArr?.map(data => {
      relationArrOfObj = [...relationArrOfObj, data];
      return data;
    }));
    let relationError = this.checkError(relationArrOfObj, checkRequired);
    let error = !!dataError || !!relationError;
    return { error };
  };

  checkIfMarkAsDone = () => {
    let { imageData } = this.state;
    let { error } = this.formatAllData(true);
    this.setState({ canMarkAsDone: (!error && imageData) ? true : false });
  };

  autoSave = async () => {
    let { castProfileId, updatedObj, relation, imageData } = this.state;
    let { error } = this.formatAllData(false);

    let castRelationship = relation?.map(relationNestedArr => this.formatData(relationNestedArr, false));
    castRelationship = this.formatNestedData(castRelationship);
    updatedObj = (castRelationship?.length > 0) ? { ...updatedObj, castRelationship } : updatedObj;
    updatedObj = imageData ? { ...updatedObj, castProfileImage: imageData } : updatedObj;
    if (!error) {
      let url = `${Config.createProfileUrl}/${castProfileId}`;
      let response = await apiCalls(url, "PUT", updatedObj, `/cast/edit/${castProfileId}`, false, null, this.props.autoSaveError);
      if (response) {
        this.props.markAsDone(0, false);
        this.checkIfMarkAsDone();
      }
    }
  }

  unlockProfile = () => {
    this.showHideLockPopup();
    this.props?.unLockedSession(this.props?.selectedTab);
  }

  markAsDone = async () => {
    this.props?.markAsDone(this.props?.selectedTab, true);
  }

  showHideLockPopup = () => {
    let { showLockedPopup } = this.state;
    this.setState({
      showLockedPopup: !showLockedPopup
    });
  }

  getFile = isLocked => {
    let { imageData,externalId,errorFileType,errorFileSize } = this.state;
    return (
      <div className="col-md-12 col-lg-12">
        <div className="upload-section flex align-items-center">
          <div className="upload-pic flex align-items-center justify-content-center">
            <ImagePreview
              imageUrl={imageData?.url ? `${Config.imageBaseUrl}${externalId}/${constantText.castProfileImage}/${imageData?.url}` : "images/no-image-icon.svg"}
              title={"Upload profile image*"}
              className="profile-preview-image"
              setRef={this.imgRef}
            />
          </div>
          <div className="upload-btn-wrapper">
            <div className="upload-block">
              <button className="upload-btn auto-button-upload">Upload Profile Image*</button>
              <input type="file" name="myfile" disabled={isLocked} onChange={this.onFileChange} />
            </div>
            {errorFileType ? <span style={{ color: "red" }}>{constantText.image_format}</span> :
              errorFileSize ? <span style={{ color: "red" }}>{constantText.create_movie_image_filesize_text}</span> :
                <span>{constantText.image_Lable}</span>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { stage, profile, profileData, relation, canMarkAsDone } = this.state;
    let { match, currentTabData } = this.props;
    const { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div>
        <Locked lock={isLocked} lockedBy={lockedBy} clicked={this.showHideLockPopup}>
          {profileData &&
            <Fragment>
              <div className="whitebox-bg">                
                  <div className="row">                
                    <div className="full-width">
                      <div className="ccm-head flex align-items-center justify-content-between">
                        <h4>{constantText.profile_details_text}</h4>
                        <div className="status-head flex align-items-center">
                          <BadgeBox status={stage} />
                          <div className="autosave">All fields are auto save</div>
                          <div
                            data-test="markAsDone-btn"
                            id={isLocked ? 'disabled-mark-done-div' : ''}
                            className={`mark-done ${isDone ? "mark-active" : canMarkAsDone ? "mark-fill-active" : ""} auto-mark-done`}
                            onClick={() => {
                              if (canMarkAsDone && !isLocked)
                                this.markAsDone();
                            }}>
                            <span><MarkDone /></span>
                        Mark as Done
                      </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row input-space-35">
                  {<FormRender
                    data-test="formrender-comp"
                    form={profile || []} serverCall={true}
                    sectionMultipleBlock={this.getFile(isLocked)}
                    onChange={(event, index) => this.handleStateChange(event, null, index, "profile")}
                    handleBlur={this.autoSave} isDisable={!!isLocked}
                    setSelectDataArr={(value, index) => this.setSelectDataArr("profile", null, index, value)}
                  />}
                </div>
              </div>
              <div className="whitebox-bg">
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <h5 className="ccm-head profile-title title-border">{constantText.relationship_text}</h5>
                  </div>
                  {relation?.map((rootArr, rootIndex) => {
                    return (
                      <div className="flex repeat-box" key={rootIndex}>
                        <FormRender key={rootIndex}
                          data-test="formrender-relation"
                          form={rootArr || []} serverCall={true}
                          handleAutoCreateInput={(event, index) => this.handleInputForAutoCreate(event, rootIndex, index)}
                          onChange={(event, index) => this.handleStateChange(event, rootIndex, index, "relation")}
                          handleAutoCreate={(event, index) => this.handleAutoCreate(event, rootIndex, index, "relation")}
                          handleBlur={this.autoSave} isDisable={!!isLocked}
                          setSelectDataArr={(value, index) => this.setSelectDataArr("relation", rootIndex, index, value)}
                        />
                        <div className={`${rootIndex > 0 ? 'remove' : 'add'}-btn create-btn`}>
                          <ButtonField
                            data-test="buttonField"
                            autoId={`${rootIndex}`}
                            buttonText={rootIndex > 0 ? '-' : '+'}
                            disabled={!!isLocked}
                            onClick={() => this.addRemoveRelation(rootIndex)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Fragment>
          }
        </Locked>
        <CommonModel
          className="popup-wrap status-popup" state={this.state.showLockedPopup} showTitle={true}
          title={constantText.unlock_title_text} showIcon={true} icon={<LockIcon />} showDes={true}
          des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.unlockProfile}
          showBtn2={true} btn2Text={constantText.no_text}
          btn2Action={this.showHideLockPopup} handleClose={this.showHideLockPopup}
        />
      </div>
    );
  }
}

const actionCreators = dispatch => {
  return {
    INCREASE_REQUEST: () => dispatch({ type: INCREASE_REQUEST }),
    DECREASE_REQUEST: () => dispatch({ type: DECREASE_REQUEST })
  }
};
export default connect(null, actionCreators)(CreateProfile);
