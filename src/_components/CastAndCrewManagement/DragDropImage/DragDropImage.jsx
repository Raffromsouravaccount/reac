import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";

import ImageListing from "./ImageListing/ImageListing";
import PhotoDetails from "../PhotoDetails/PhotoDetails";
import ButtonField from "../../Common/ButtonField/ButtonField";
import Locked from "../../Common/Locked/Locked"
import { CommonModel } from '../../Common/Model/CommonModel';
import BadgeBox from "./../../Common/BadgeBox/BadgeBox";
import { DECREASE_REQUEST, INCREASE_REQUEST } from '../../../_constants/common.constants';

import MarkDone from "images/tick.svg";
import CloudUploadIcon from "images/cloud-upload-icon.svg";
import "./DragDropImage.css";
import Config from "../../../Config/config";
import LockIcon from "images/lock-icon.svg";
import { getLocalData } from "../../../_helpers/util";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from '../../../_helpers/permission';
import { history } from '../../../_helpers/history';
import { getFileNameAndExtension } from "../../../_helpers/validation";
import { apiCalls, commonService } from "../../../_services/common.service";
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';

const acceptedFilesTypes = ".jpeg,.jpg,.png";
class DragDropImage extends Component {
  constructor(props) {
    let ImageSection = getLocalData("ImageSection");

    super(props);
    this.state = {
      files: [], rejectedFiles: [],
      status: ImageSection === "edit" ? 0 : ImageSection === "view" ? 2 : 0,
      Item: {}, fileName: "", imagesCount: 0,
      mode: "create", castProfileId: "",
      showModel: false, view: "", language: 'EN',
      imageDetails: null, listingdata: null, listUpdated: false,
      error: false
    };
  }

  componentDidMount() {
    if (!!this.props?.castProfileId) {
      if (this.props.mode) {
        this.setState({
          mode: this.props.mode,
          castProfileId: this.props.castProfileId,
          view: this.props.view || ""
        })
      }
      this.getCastData();
      this.getImageList()
    }
  }

  getImageList = async () => {
    this.setState({
      listUpdated: false
    })
    let url = `${Config.imageListing}/${this.props.castProfileId}`;
    const response = await apiCalls(url, "GET", {});
    if (response) {
      this.setState({
        imagesCount: response.length,
        listingdata: response,
        listUpdated: true
      });
    }
  }

  getCastData = async () => {
    let { castProfileId } = this.props;
    const response = await apiCalls(`${Config.createProfileUrl}/${castProfileId}`, "GET");
    if (response) {
      let { contentState } = response;
      this.setState({
        status: contentState?.title,
        externalId:response?.externalId
      });
    }
  }

  handleOnDrop = (files, rejectedFiles) => {
    let { currentTabData,  castProfileId } = this.props;
    const { isLocked } = currentTabData || {};
    const { externalId}=this.state
    if (!isLocked && castProfileId) {
      if (files) {
        this.setState({ files, rejectedFiles, DropzoneChecklist: 1 }, () => {
          const validFileExtensions = [".jpg", ".jpeg", ".png"];
          if (files && files.length > 0) {
            files?.map(fileData => {
              let fileObj = getFileNameAndExtension(fileData?.name, validFileExtensions);
              const imageFormatName=fileObj?.name.replace(/[^a-zA-Z0-9]/g, '');
              let imageObj = {
                externalId:this.props.externalId ?this.props.externalId :externalId,
                imageType: constantText.otherImage,
                imageDimension: null,
                imagetitle: imageFormatName.length>0 ? imageFormatName :'profile',
                uuid: castProfileId,
                imageExtension: fileObj?.extension
              };
              this.props.INCREASE_REQUEST();
              commonService.get_signed_url_and_upload_to_s3(fileData, imageObj).then(data => {
                this.props.DECREASE_REQUEST();
                let imageDetails = {
                  url: data?.fileName ? `${data.fileName}`: `${imageObj.imagetitle}-${imageObj?.uuid}${imageObj.imageExtension}`,
                  name: fileData?.name,
                  size: fileData?.size.toString()
                };
                this.setState(prevState => ({ imageDetails, error: false, listUpdated: false }), () => this.saveImage());
              }).catch(error => { });
            });
          }
        });
      }
    }
  };

  saveImage = async () => {
    const { imageDetails } = this.state
    let PostValidaData = {
      contentId: this.props.castProfileId,
      imageDetails: imageDetails,
      title: imageDetails?.name,
      description: ""
    }
    let url = `${Config.postphotoDetails}/${this.props.castProfileId}`;
    const res = await apiCalls(url, "POST", PostValidaData, null, false, false, this.props.autoSaveError);
    if (res?.status == 400 && res?.message) {
      showSuccessErrorMsg(res.message, null, 'error');
      this.getImageList()
    } else if (res?.id) {
      this.props.markAsDone(this.props?.selectedTab, false);
      this.getImageList()
    } else {
      this.getImageList()
    }
  }
  editstatus = (status, lang) => {
    this.setState({
      mode: status,
      Item: lang,
    });
  };

  editRoute = (value) => {
    this.setState({
      mode: value,
    });
  };

  handleMarkAsDone = () => {
    this.props?.markAsDone(this.props?.selectedTab, true);
  };

  checkValidation = () => {
    const { files } = this.state;
    if (files.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  handleEditImage = (view) => {
    this.setState({
      mode: 'create',
      view: "edit"
    }, () => {
      history.push(`/cast/edit/${this.props.castProfileId}`, constantText.editImage)
    });
  };

  toggleModel = () => {
    this.setState(prevState => {
      return { showModel: !prevState.showModel }
    });
  }

  lockUnlockCastProfile = () => {
    this.toggleModel();
    this.props?.unLockedSession(this.props?.selectedTab);
  }

  isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  };


  render() {
    const { imagesCount, mode, view, language, status, listingdata, listUpdated,externalId } = this.state
    const { canUpdate } = permissionObj?.cast?.images;
    let { match, currentTabData } = this.props;
    const { isDone, isLocked, lockedBy } = currentTabData || {};
    const backendForDND = this.isTouchDevice() ? TouchBackend : HTML5Backend;
    return (
      <div className="whitebox">
        <Locked
          lock={this.props.mode !== 'view' && isLocked}
          lockedBy={lockedBy}
          clicked={this.toggleModel}>
          {(mode === 'create') ? (
            <div className="drag-drop-wrap">
              <div className="ccm-head flex align-items-center justify-content-between">
                <h4>Images</h4>
                <div className="status-head flex align-items-center">
                  <BadgeBox status={status} />
                  <div className="autosave">All fields are auto save</div>
                  <div
                    data-test="markAsDone-btn"
                    className={`mark-done ${isDone ? "mark-active" : (imagesCount > 0) ? "mark-fill-active" : ""}`}
                    onClick={() => {
                      if (!isLocked && !isDone && imagesCount > 0) {
                        this.handleMarkAsDone();
                      }
                    }}
                  >
                    <span>
                      <MarkDone />
                    </span>
                    Mark as Done
                  </div>
                </div>
              </div>
              <Dropzone
                onDrop={this.handleOnDrop}
                maxSize={Config.imageMaxSize}
                accept={acceptedFilesTypes}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="upload-area-wrap">
                    <div className="col-12">
                      <div
                        {...getRootProps({
                          className: "dropzone upload-img-area",
                        })}
                      >
                        <div className="img-upload-btn">
                          <input disabled={isLocked} {...getInputProps()} />
                          <div className="flex align-items-center">
                            <CloudUploadIcon />
                            Drop files here or Browse
                          </div>
                        </div>
                        <div className="file-name">
                          Supportable File: JPEG, JPG, PNG
                        </div>
                        {this.state.rejectedFiles &&
                          this.state.rejectedFiles.map((item, id) => (
                            <div key={item.id}>
                              {item.errors &&
                                item.errors.map((sub, id) => (
                                  <div className="error-msg" key={sub.id}>
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
                    </div>
                  </div>
                )}
              </Dropzone>
              {listUpdated && <DndProvider backend={backendForDND}><ImageListing editstatus={this.editstatus} castProfileId={this.props.castProfileId} language={language}
                markAsDone={this.props.markAsDone} lock={isLocked} mode={this.props.mode} selectedTab={this.props.selectedTab} autoSaveError={this.props.autoSaveError} listingdata={listingdata} getImageList={this.getImageList}  {...this.props} externalId={this.props.externalId ?this.props.externalId :externalId}/></DndProvider>}
            </div>
          ) : (
              <div>
                {mode === 'edit' ? (
                  <PhotoDetails editRoute={this.editRoute} item={this.state.Item} language={language}
                    markAsDone={this.props.markAsDone} castProfileId={this.props.castProfileId}
                    CastProfileJSON={this.props.CastProfileJSON} selectedTab={this.props.selectedTab} autoSaveError={this.props.autoSaveError} getImageList={this.getImageList}  {...this.props} externalId={this.props.externalId ? this.props.externalId :externalId} />
                ) : (
                    <div>
                      <div className="drag-drop-wrap">
                        <div className="ccm-head flex align-items-center justify-content-between">
                          <h4>Images</h4>
                          <div className="status-head flex align-items-center">
                            <BadgeBox status={status} />
                            {(mode !== 'view') && <div className="autosave">All fields are auto save</div>}
                            {
                              (status !== constantText.castProfile.archived && this.props.viewMode) ?
                                <ButtonField
                                  className="cm-edit-btn"
                                  variant="contained"
                                  color="primary"
                                  disabled={!canUpdate()}
                                  buttonText={"Edit Images"}
                                  onClick={() => canUpdate() ? this.props.handleRoute(`/cast/edit/${this.props.castProfileId}`) : ""}
                                />
                                : null
                            }
                          </div>
                        </div>
                        {listUpdated && <DndProvider backend={backendForDND}><ImageListing editstatus={this.editstatus} castProfileId={this.props.castProfileId}
                          markAsDone={this.props.markAsDone} mode={this.props.mode} lock={isLocked} selectedTab={this.props.selectedTab} autoSaveError={this.props.autoSaveError} listingdata={listingdata} getImageList={this.getImageList}  {...this.props} externalId={this.props.externalId ? this.props.externalId :externalId} /></DndProvider>}
                      </div>
                    </div>
                  )}
              </div>
            )}
        </Locked>
        <CommonModel className='popup-wrap status-popup' state={this.state.showModel}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.lockUnlockCastProfile}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.toggleModel}
          handleClose={this.toggleModel}
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
export default connect(null, actionCreators)(DragDropImage);
