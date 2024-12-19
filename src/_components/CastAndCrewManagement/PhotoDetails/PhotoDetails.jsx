import React, { Component } from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import ButtonField from "../../Common/ButtonField/ButtonField";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import { formValidityCheck } from "../../Common/FormHelper/FormValidSetter";
import { isValidatedForm } from "../../Common/FormHelper/FormValidSetter";
import { CommonModel } from "../../Common/Model/CommonModel";
import { DECREASE_REQUEST, INCREASE_REQUEST } from '../../../_constants/common.constants';
import AngleLeftArrow from "images/angle-left-arrow.svg";
import TagIcon from "images/tag-icon.svg";
import "./PhotoDetails.css";
import Config from "../../../Config/config";
import { getLocalData } from "../../../_helpers/util";
import { getFileNameAndExtension } from "../../../_helpers/validation";
import { apiCalls, commonService } from '../../../_services/common.service';
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';
import { constantText } from "../../../_helpers/constants.text";
const acceptedFilesTypes = ".jpeg,.jpg,.png";
const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : item.type === "dropdownAsync"
            ? null
            : ""),
        (item.touched = 0);
      item.valid = true;
      if (item.type === "dropdownAsync") {
        item.data = [];
      }
      return item;
    });
  }
};

class PhotoDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      JSONSchema: [],
      error: false,
      fileName: "",
      imageId: "",
      modifiedBy: "",
      imageDetails: "",
      postedImageId: "",
      disableSaveButton: true,
      castProfileId: "",
      showStatePopup:false
    };
  }

  componentDidMount() {
    const { item, CastProfileJSON } = this.props || {};
    this.setState({ JSONSchema: DEFAULT_JSON(CastProfileJSON) }, () => {
      this.fillPhotoDetails(item);
    });
  }


  fillPhotoDetails = (item) => {
    const { fileName, JSONSchema } = this.state;
    let copyJSON = []
    if (JSONSchema) {
      copyJSON = [...JSONSchema];
    }
    if (item) {
      let url;
      copyJSON.forEach((field) => {
        if (
          field.name === "description" ||
          field.name === "title" ||
          field.name === "others"
        ) {
          field.value = item[field?.name] ? item[field?.name] : "";
        } else if (field.type !== "sectionMultiple") {
          field.value = item[field?.name] ? item[field?.name] : null;
        }
      });
      if (item?.imageDetails?.url) {
        url = item?.imageDetails?.url;
      } else if (fileName) {
        url = fileName;
      }
      let { formValidity } = formValidityCheck(copyJSON);
      this.setState({
        JSONSchema: copyJSON,
        fileName: url,
        imageId: item?.imageId,
        disableSaveButton: !formValidity,
        castProfileId: item?.contentId
      });
    }
  };



  handleRoute = (e) => {
    e?.stopPropagation();
    this.props?.editRoute("create");
  };
  onBlurUpdate = () => { };
  handleOnDrop = (files, rejectedFiles) => {
      this.setState({ files, rejectedFiles },()=>{
        if(files && files.length>0){
        const validFileExtensions = [".jpg", ".jpeg", ".png"];
        let fileObj=getFileNameAndExtension(files[0]?.name,validFileExtensions);
        const imageFormatName=fileObj?.name.replace(/[^a-zA-Z0-9]/g, '');
        let imageObj={
          externalId:this.props.externalId,
          imageType:constantText.otherImage,
          imageDimension:null,
          imagetitle:imageFormatName.length>0 ? imageFormatName :'profile',
          uuid:this.props.castProfileId,
          imageExtension:fileObj?.extension
        };
        this.props.INCREASE_REQUEST();
        commonService.get_signed_url_and_upload_to_s3(files[0], imageObj).then(data => {
          this.props.DECREASE_REQUEST();
          this.setState(prevState => ({ fileName: data?.fileName ? `${data.fileName}` : `${imageObj.imagetitle}-${imageObj?.uuid}${imageObj.imageExtension}`, error: false, }));
        }).catch(error => {
        });
      }
    });

  };

  handleSubmit = async () => {
    const { JSONSchema, castProfileId } = this.state;
    const { formValidity, validatedForm } = isValidatedForm(JSONSchema);
    this.setState({ JSONSchema: validatedForm });
    if (formValidity) {
      const PostObj = {};
      JSONSchema.forEach(item => {
        if (item) {
          if (item.name === "description" || item.name === "title" || item.name === "others") {
            PostObj[item.name] = item.value?.trim() ? item.value?.trim() : "";
          }
          else if (item.type !== "sectionMultiple") {
            let localArray = []
            if (item.value) {
              for (let selectedValueIndex = 0; selectedValueIndex < item.value.length; selectedValueIndex++) {
                localArray.push(item.value[selectedValueIndex].id)
              }
              PostObj[item.name] = localArray
            } else {
              PostObj[item.name] = []
            }

          }
        }
      });
      PostObj['imageDetails'] = {
        url: this.state.fileName ? this.state.fileName : this.props?.item?.imageDetails.url,
        name: this.state.JSONSchema[0].value,
        size: (this.state.files && this.state.files.length > 0) ? this.state.files[0].size.toString() : this.props?.item?.imageDetails.size
      };
      let url = `${Config.editPhotoDetails}/${this.props?.item?.id}/${castProfileId}`;
      this.props?.markAsDone(this.props?.selectedTab, false);
      const res = await apiCalls(url, "PUT", PostObj, null, false, false, this.props.autoSaveError);
      if (res) {
        this.props?.markAsDone(this.props?.selectedTab, false);
        showSuccessErrorMsg(
          constantText.updatedImageSuccess,
          'imageEdit',
          "Success",
          false,
          this.props.editRoute
        );
        this.props.getImageList()
      }
    }
  };

  setSelectDataArr = (res, index) => {
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[index];
    if (updatedElement) {
      updatedElement.data = res || [];
    }
    this.setState({ JSONSchema: copyJSON });
  }
  InputChanger = (event, elemIndex) => {
    const { JSONSchema } = this.state;
    let copyJSON = []
    if (JSONSchema) {
      copyJSON = [...JSONSchema];
    }
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event?.target?.value;
      updatedElement.file = event?.target?.files[0];
    } else {
      if (updatedElement) {
        updatedElement.value =
          updatedElement?.type === "checkbox"
            ? event.target.checked
            : updatedElement?.type === "text" ? (event.target.value.trim() ? event.target.value : event.target.value.trim()) : event?.target?.value;
      }
    }
    //check validity
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
    let { formValidity } = formValidityCheck(copyJSON);
    this.setState({ JSONSchema: copyJSON, disableSaveButton: !formValidity });
  };

  showCommonPopUp=()=>{
    this.setState({
      showStatePopup:true
    })
  }

  showHideStatePopup=(e)=>{
      this.handleRoute(e);
  }
  hidePopUp=()=>{
    this.setState({
      showStatePopup:false
    })
  }

  render() {
    const { fileName, JSONSchema, disableSaveButton,showStatePopup  } = this.state;
    const sectionImageTag = (
      <div className="img-tag flex align-items-center">
        <span className="tag-icon">
          <TagIcon />
        </span>{" "}
        {JSONSchema && JSONSchema[2]?.label}
      </div>
    );
    return (
      <div className="edit-photo" data-test="edit-photo-component">
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
        <div className="ccm-head flex align-items-center justify-content-between">
          <h4>
            <span
              className="edit-link"
              data-test="photo-details-handle-route"
              onClick={() => this.showCommonPopUp()}
            >
              <AngleLeftArrow />
            </span>
            Photo Details
          </h4>
          <div className="status-head flex align-items-center">
            <div className="cm-draft">Draft</div>
          </div>
        </div>
        <div className="edit-photo-form">
          <div className="row">
            <div className="col-md-6 col-lg-6 space-right">
              <form>
                {(JSONSchema?.length !== 0) && <FormRender
                  form={JSONSchema}
                  data-test="input-changer-method"
                  onChange={this.InputChanger}
                  serverCall={true}
                  sectionMultipleBlock={sectionImageTag}
                  setSelectDataArr={this.setSelectDataArr}
                />}
                <ButtonField
                  className="zee-btn-field zee-full"
                  variant="contained"
                  color="primary"
                  buttonText={"Save"}
                  disabled={disableSaveButton}
                  data-test="photo-details-handleSubmit-button"
                  onClick={() => {
                    this.handleSubmit();
                  }}
                />
              </form>
            </div>
            <div className="col-md-6 col-lg-6 space-left">
              <div className="img-box">
                <img src={fileName ? `${Config.imageBaseUrl}${this.props.externalId}/${constantText.otherImage}/${fileName}` : `${Config.imageBaseUrl}${this.props.externalId}/${constantText.otherImage}/${this.props?.item?.imageDetails.url}`} alt="user images" />
                <div className="change-file-sec">
                  <Dropzone
                    onDrop={this.handleOnDrop}
                    maxSize={Config.imageMaxSize}
                    accept={acceptedFilesTypes}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps({
                          className: "dropzone",
                        })}
                      >
                        <div className={!disableSaveButton ? "change-file" : "disable-f-btn change-file"}>
                          Change Photo
                          <input disabled={disableSaveButton} className="file-btn" {...getInputProps()} />
                        </div>
                        {this.state.rejectedFiles &&
                          this.state.rejectedFiles.map((item, index) => (
                            <div key={index} className="error-msg">
                              {item.errors &&
                                item.errors.map((sub) => (
                                  <div>
                                    {sub.code === "file-too-large" ? (
                                      <div>{constantText.create_movie_image_filesize_text}</div>
                                    ) : (
                                        <div>{constantText.image_format}</div>
                                      )}
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    )}
                  </Dropzone>
                </div>
              </div>
            </div>
          </div>
        </div>
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
export default connect(null, actionCreators)(PhotoDetails);
