import React, { Component } from 'react';
import { connect } from 'react-redux';
import MenuItem from "@material-ui/core/MenuItem";
import { constantText } from '../../../../_helpers/constants.text';
import { permissionObj } from '../../../../_helpers/permission';

//Icons
import MarkDone from "images/tick.svg";
import Edit from "images/edit.svg";
import Delete from "images/delete.svg";
import LockIcon from "images/lock-icon.svg";
import AccordianNormal from "images/arrow-icon.svg";
import AccordianActive from "images/arrow-active-icon.svg";
import ActivateIcon from 'images/ImageSetActive.svg';
import DeactivateIcon from 'images/ImageSetDeactive.svg';

import ImagesListing from "../ImageListing/ImageListing";
import ViewEditImageModal from '../Dialogs/ViewEditImageModal.jsx';
import { CommonModel } from '../../../Common/Model/CommonModel';
import DropDown from "../../../Common/DropDown/DropDown";
import Locked from '../../../Common/Locked/Locked';
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import ButtonField from "../../../Common/ButtonField/ButtonField";
import { getImageResolution } from "../../../../_helpers/util";
import { showSuccessErrorMsg } from '../../../../_actions/alertMessages.action';

import "../../../../../public/css/Common/ImageSetBlock.css";

import { checkImageType, validateImageSize, formatSizeUnits, validateImageResolution,getFileNameAndExtension } from '../../../../_helpers/validation';

//Services
import { apiCalls, commonService } from '../../../../_services/common.service';
import Config from '../../../../Config/config';
import { DECREASE_REQUEST, INCREASE_REQUEST } from '../../../../_constants/common.constants';
const CustomDropdown = ({ statusChanger, status, licenseData }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropDown
      open={open}
      buttonText={status}
      handleClose={() => setOpen(!open)}
      handleOpenClose={() => setOpen(!open)}
    >
      <MenuItem
        onClick={() => {
          setOpen(!open);
          statusChanger(
            status == "Active" ? "InActive" : "Active",
            licenseData
          );
        }}
      >
        {status == "Active" ? "Inactive Set" : "Activate Set"}
      </MenuItem>
    </DropDown>
  );
};
class ImageSets extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    this.state = {
      showLockPopup: false, markAsDoneStatus: 1,
      expanded: 0,
      imageItem: null,
      menuItems: jsonData?.menuItems,
      viewEditModalState: false,
      viewEditModalMode: "",
      model: {
        showModel: false,
        type: "",
        title: "",
        des: ""
      },
      setItem: null,
      contentData: {},
      updatedImageItem:null,
      copyImageItem:null,
      showStatePopup: false,
      status: null,
      imageSetId:null,
      setStatus:1
    };

  }

  componentDidMount() {
    this.getImageSets(this.props.videoId);
    this.getVideoDetails();
  }

  getVideoDetails = async () => {
    let { videoId } = this.props;
    let url = `${Config.videoProperties}/${videoId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title,externalId:response?.externalId })
    }
  }

  getImageSets = async (videoId) => {
    let url = `${Config.videoImageSet}/${videoId}`;
    const res = await apiCalls(url, "GET", {});
    if (res) {
      const contentDataObj = res;
      const sets = contentDataObj.imageSets || [];
      const defaultExpand = sets.filter(item => item.default);
      if (!this.state.expanded) {
        this.setState({
          expanded: defaultExpand.length > 0 ? defaultExpand[0].imageSetId : ""
        })
      }

      let markStatus = 1;
      if (!contentDataObj.isDone) {
        if (this.validateMarkAsDone(sets)) {
          markStatus = 2;
        }
      } else if (contentDataObj.isDone) {
        markStatus = 3;
        this.props.markAsDone(this.props?.selectedTab, true);
      }
      this.setState({ contentData: contentDataObj, markAsDoneStatus: markStatus });
    }
  }

  handleAccordian = (setIndex) => {
    this.setState({ expanded: this.state.expanded === setIndex ? false : setIndex });
  };

  handelSetOperations(set, mode,imageSets) {
    if (mode == 'edit') {
      this.props?.navToImageSet(1, set,imageSets);
    } else if (mode == 'remove') {
      let { model } = this.state;
      let shallowModel = { ...model };
      shallowModel.type = 'set';
      shallowModel.showModel = true;
      shallowModel.title = constantText.create_movie_image_delete_set_title;
      shallowModel.des = constantText.create_movie_image_delete_set_text;
      this.setState({ setItem: set, model: shallowModel });
    }
  }

  onSelectFile = async (event, setIndex, imageIndex, image,set) => {
    if (event?.target?.files && event?.target?.files[0]) {
      const file = event.target.files[0];
      const validFileExtensions = [".jpg", ".jpeg", ".png"];
      if (!checkImageType(file.name, validFileExtensions)) {
        return showSuccessErrorMsg(constantText.create_movie_image_filetype_text, '', constantText.error);
      } else if (!validateImageSize(file, 20 * 1024 * 1024)) {
        return showSuccessErrorMsg(constantText.create_movie_image_filesize_text, '', constantText.error);
      }
    let fileObj=getFileNameAndExtension(file.name,validFileExtensions)
      if(fileObj?.name && fileObj?.extension){
      this.uploadImagefile(file,fileObj, setIndex, imageIndex, image,set);
      }
    }
  };

  uploadImagefile = async (file,fileObj, setIndex, imageIndex, image,set) => {
    const imageFormatName=fileObj?.name.replace(/[^a-zA-Z0-9]/g, '');
    let imageObj={
      externalId:this.props.externalId ? this.props.externalId : this.state.externalId,
      imageType:image?.key,
      imageDimension:getImageResolution(image?.title),
      imagetitle:imageFormatName?.length>0 ? imageFormatName :'video',
      uuid:image?.imagePresetId,
      imageExtension:fileObj.extension
    };
    this.props.INCREASE_REQUEST();
    const signedUrl = await commonService.get_signed_url_and_upload_to_s3(file,imageObj);
    this.props.DECREASE_REQUEST();
    if (signedUrl.fileName) {
      const imageResolution=getImageResolution(image.title);
      const { contentData, viewEditModalState, imageItem } = this.state;
      const dataParams = {
        imageSetId: contentData.imageSets[setIndex].imageSetId,
        images: [{
          imageDescription: image.imageDescription,
          imagePresetId: image.imagePresetId,
          resolution: getImageResolution(image.title),
          valid: await validateImageResolution(file, imageResolution),
          size: formatSizeUnits(file.size),
          imageTitle: fileObj?.name,
          url:signedUrl?.fileName
        }]
      }
      if (viewEditModalState) {
        const updatedImageItem ={... JSON.parse(JSON.stringify(imageItem))};
        updatedImageItem.imageData.url = dataParams.images[0].url;
        let updatedImageobject={
          setIndex: updatedImageItem.setIndex,
          imageIndex: updatedImageItem.imageIndex,
          menuItem: {
            label: updatedImageItem.menuItem.label
          },
          imageData: {
            imageTitle: fileObj.name,
            imageDescription: image.imageDescription,
            url: signedUrl?.fileName,
            mandatory: image.mandatory,
            maxSize: image.maxSize,
            imagePresetId: image.imagePresetId,
            title: image.title,
            resolution: getImageResolution(image.title),
            sequence: image.sequence,
            key: image.key,
            size: formatSizeUnits(file.size),
            valid: await validateImageResolution(file, imageResolution)
          }
        }
        updatedImageItem.imageData.valid=await validateImageResolution(file, imageResolution);
        updatedImageItem.imageData.size=formatSizeUnits(file.size);
        this.setState({  updatedImageItem:updatedImageobject,copyImageItem:updatedImageItem })
      }else{
      this.updateImageSet(dataParams);
      }
    }

  }

  updateImageSet = async (dataParams) => {
    const { videoId } = this.props;
    let url = Config.videoImageSet;
    url = url + '/' + videoId;
    const res = await apiCalls(url, "PUT", dataParams,null, true, false, this.props.autoSaveError);
    if (res) {
      this.props.markAsDone(this.props?.selectedTab, false);
      this.getImageSets(videoId);
    }
  }


  handleMenuClick = (setIndex, imageIndex, menuItem, imageData, set) => {
    const {status} = this.state;
    if (status === constantText.contentConstants.published){
      this.setState({ status:constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview){
      this.setState({ status:constantText.contentConstants.draft })
    }
    if (status ===  constantText.contentConstants.unpublished) {
      this.setState({ status:constantText.contentConstants.draft })
    }
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    if (menuItem.label == 'View') {
      this.setState({ imageItem: imageItem, viewEditModalState: true, viewEditModalMode: 'view' ,updatedImageItem:null});
    } else if (menuItem.label == 'Edit') {
      this.setState({ imageItem: imageItem, viewEditModalState: true, viewEditModalMode: 'edit',updatedImageItem:null });
    } else if (menuItem.label == 'Delete') {
      let { model } = this.state;
      let shallowModel = { ...model };
      shallowModel.showModel = true;
      shallowModel.type = 'image';
      shallowModel.title = constantText.create_movie_image_delete_image_title;
      shallowModel.des = constantText.create_movie_image_delete_image_text;
      this.setState({ imageItem: imageItem, model: shallowModel, setItem: set ,updatedImageItem:null});
    }
  }

  confirmationPopupClose = (action) => {
    let { model, imageItem, setItem } = this.state;
    let shallowModel = { ...model };
    const imageSetData = JSON.parse(JSON.stringify(setItem));
    const imageData = JSON.parse(JSON.stringify(imageItem));
    if (action && shallowModel.type != 'image') {
      this.deleteSet(imageSetData, imageSetData.imageSetId, false);
    } else if (action) {
      this.deleteSet(imageData, imageSetData.imageSetId, true);
    }
    shallowModel.showModel = false;
    shallowModel.type = '';
    shallowModel.title = '';
    shallowModel.des = '';
    this.setState({ imageItem: null, setItem: null, model: shallowModel });
  }

  deleteSet = async (set, imageSetId, imageDelete) => {
    let url = Config.videoImageSet;
    url = `${url}/${this.props.videoId}/${imageSetId}`;
    let body = {};
    if (imageDelete && set.imageData && set.imageData.imagePresetId) {
      body.imagePresetId = set.imageData.imagePresetId
    }
    const res = await apiCalls(url, "DELETE", body,null, true, false, this.props.autoSaveError);
    if (res) {
      this.getImageSets(this.props.videoId);
      this.props.markAsDone(this.props?.selectedTab, false);
    }
  }


  viewEditImageModalClose = (action, addEditImageJson) => {
    if (action) {
      const { contentData, imageItem,copyImageItem } = this.state;
      const imageItemShallow = copyImageItem ? JSON.parse(JSON.stringify(copyImageItem)):JSON.parse(JSON.stringify(imageItem));
      const dataParams = {
        imageSetId: contentData.imageSets[imageItemShallow.setIndex].imageSetId,
        images: [{
          imageDescription: imageItemShallow.imageData?.imageDescription,
          imagePresetId: imageItemShallow.imageData?.imagePresetId,
          imageTitle: imageItemShallow.imageData?.imageTitle,
          mandatory: imageItemShallow.imageData?.mandatory,
          maxSize: imageItemShallow.imageData?.maxSize,
          resolution: imageItemShallow.imageData?.resolution,
          size: imageItemShallow.imageData?.size,
          url: imageItemShallow.imageData?.url,
          valid: imageItemShallow.imageData?.valid,
          imageTitle: addEditImageJson.filter(field => field.name == 'imageTitle')[0].value || "",
          imageDescription: addEditImageJson.filter(field => field.name == 'imageDescription')[0].value || "",
        }]
      }
      this.updateImageSet(dataParams);
    }
    this.setState({ viewEditModalState: false, imageItem: null, viewEditModalMode: "" ,copyImageItem:null});
  }

  validateMarkAsDone = (sets) => {
    const setsNotCompleted = sets.filter(set => (set.images.filter(image => (image.mandatory && image.url == ""))).length);
    return setsNotCompleted.length ? false : true
  }

  updateMarkAsDone = async () => {
    this.props?.markAsDone(this.props?.selectedTab, true);
  }

  toggleLockModel = status => {
    let { showLockPopup }= this.state;
    this.setState(prevState=> ({showLockPopup: !showLockPopup}), ()=> {
      if(status) {
        this.props?.unLockedSession(this.props?.selectedTab);
      }
    })
  }

  getSetInformation = (data, type) => {
    if (type === 'tags') {
      let shallowArray = [];
      data.gender && data.gender.length ? shallowArray = [...shallowArray, ...data.gender] : '';
      data.language && data.language.length ? shallowArray = [...shallowArray, ...data.language] : '';
      data.genre && data.genre.length ? shallowArray = [...shallowArray, ...data.genre] : '';
      data.ageGroup && data.ageGroup.length ? shallowArray = [...shallowArray, ...data.ageGroup] : '';
      if (data.others && data.others.length) {
        let othersArray = data.others.split(",");
        othersArray = othersArray.map(item => item.trim()).filter(item => item.length);
        shallowArray = [...shallowArray, ...othersArray];
      }
      return this.getSetInformation(shallowArray);
    }
    return data?.map(u => u.title ? u.title : u).join(', ');

  }

  getImageListingView = (imageIndex, isLocked, setIndex, menuItems, image, pageState, isViewMode, set) => {
    const view = (
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 m-b-30" key={imageIndex}>
        <ImagesListing
          isViewMode={isViewMode}
          isLocked={isLocked}
          setIndex={setIndex}
          imageIndex={imageIndex}
          menuItems={isViewMode ? menuItems.filter(item => item.label === 'View') : menuItems}
          handleMenuClick={this.handleMenuClick}
          item={image}
          descriptionBtn={true}
          onSelectFile={this.onSelectFile}
          set={set}
          externalId={this.props.externalId ? this.props.externalId :this.state.externalId}
        />
      </div>)
    const isQuickAndSingleLandingPage = !!(pageState == 'single-landing-page' || pageState == 'quick-filing');
    if (isQuickAndSingleLandingPage && image.mandatory ) {
      return view;
    } else if(isQuickAndSingleLandingPage &&  !set.default && image.key==='list'){
      return view;
    } else if (!isQuickAndSingleLandingPage) {
      return view;
    }
    return;
  }

  navigateToEditMode = () => {
    const {  navToEditMode, videoId } = this.props;
    const url = `/video/edit/${videoId}`;
    navToEditMode(url);
  }

  showHideStatePopup = (imageSetId,setStatus) => {
    let { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup,
      imageSetId,
      setStatus
    });
  }

  activateDeactivateUser = () => {
    const { imageSetId,setStatus} = this.state;
    const {videoId}=this.props;
    let url = `${Config.videoImageSet}/${videoId}/${imageSetId}/${setStatus==="1"? 0:1}`;
    this.setState({
      showStatePopup: false
    }, async () => {
      let response = await apiCalls(`${url}`, "PATCH", {});
      if (response) {
        this.getImageSets(videoId);
      }
    });
  }

  render() {
    const {
      markAsDoneStatus, expanded, contentData,
      viewEditModalState, viewEditModalMode, imageItem, model, menuItems, showLockPopup, updatedImageItem,externalId,status ,showStatePopup,setStatus} = this.state;
    const { navToImageSet, pageState,  isViewMode } = this.props;
    const imageSets = contentData.imageSets || [];
    let { currentTabData ,stage} = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    let { canUpdate }= permissionObj?.videos?.imagesModule;
    return (
      <div className="create-movie create-images-list">
        <div className="whitebox">
          <Locked
            data-test="toggleLock"
            lock={isLocked}
            lockedBy={lockedBy}
            clicked={()=>this.toggleLockModel(false)}>
            <div className="ccm-head flex align-items-center justify-content-between m-b-30">
              <h4>{constantText.create_movie_images_text}</h4>
              {!isViewMode &&
                <div className="status-head flex align-items-center">
                  <BadgeBox className="create-movie-stage" status={status ? status: stage?.title}/>
                  <div className={`mark-done ${isDone ? "mark-active" : (markAsDoneStatus === 2) ? "mark-fill-active" : ""} auto-mark-done`}
                    onClick={markAsDoneStatus===2 && !isDone && !isLocked? this.updateMarkAsDone:''}>
                    <span>
                      <MarkDone />
                    </span>
                    {constantText.mark_as_done_text}
                  </div>
                </div>
              }
              {isViewMode &&
                <div className="status-head flex align-items-center">
                  <BadgeBox className="create-movie-stage" status={status ?  status :stage?.title?stage?.title:stage}/>
                  <div className="edit-btn">
                    <ButtonField
                     disabled={!canUpdate()}
                      buttonText={constantText.edit_video_text}
                      className="zee-btn-field zee-full MuiButton-containedPrimary"
                      onClick={()=> canUpdate()? this.props.handleRoute(`/video/edit/${this.props.videoId}`): ""}
                    />
                  </div>
                </div>
              }
            </div>
            <div className="movieForm-tab">
              {!isViewMode  &&
                <div className="col-12 flex justify-content-between align-items-center">
                  <h4>{constantText.create_movie_images_create_set_action_text}</h4>
                  <button className="upload-btn auto-create-newSet" disabled={isLocked} onClick={() => !isLocked ? navToImageSet(1) : ''}>
                    {constantText.create_movie_images_create_set_btn_text}
                  </button>
                </div>
              }
              <div className="set-f-wrap">
                {imageSets.map((set, setIndex) => (
                  <div key={setIndex} className={expanded === set.imageSetId ? "ans-ques-block active" : "ans-ques-block"} >

                    <div className="question-list flex imageset-acc">
                      <div className="question" id={setIndex} onClick={(e) => this.handleAccordian(set.imageSetId)} >
                        <span>
                          <AccordianNormal className="normal-icon" />
                          <AccordianActive className="active-icon" />
                        </span>
                        {set.setName}
                      </div>
                      {!(set && set.default) && !isViewMode &&
                        <div className="flex right-icon">
                          <div  className={
                          set.status==="0"
                            ? "status-dropdown val inactive"
                            : "status-dropdown val"
                          }>
                           <CustomDropdown
                            status={
                              set.status==="0"
                                ? "Inactive"
                                : "Active"
                            }
                            statusChanger={
                              ()=>!isLocked ? this.showHideStatePopup(set.imageSetId,set.status):""
                            }
                          />
                          </div>
                          <span className="edit" onClick={() => !isLocked ? this.handelSetOperations(set, 'edit',imageSets) : ""} >
                            <Edit />
                          </span>
                          <span className="remove" onClick={() => !isLocked ? this.handelSetOperations(set, 'remove',{}) : ""} >
                            <Delete />
                          </span>
                        </div>
                      }
                    </div>
                    { expanded === set.imageSetId && (
                      <div className="answer-list">
                        <div className="flex images-desc">
                          <ul>
                            <li>
                              <strong>{constantText.create_movie_images_patform_text} </strong>

                              <span>
                                {set.default ?
                                  constantText.create_movie_images_set_platform_text
                                  :
                                  this.getSetInformation(set.Platform)
                                }
                              </span>

                            </li>
                            <li>
                              <strong>{constantText.create_movie_images_tag_text} </strong>

                              <span>
                                {set.default ?
                                  constantText.create_movie_images_set_tag_text
                                  :
                                  this.getSetInformation(set.tags, 'tags')
                                }
                              </span>

                            </li>
                          </ul>
                          <ul>
                            <li>
                              <strong>{constantText.create_movie_images_gc_text} &nbsp;&nbsp;</strong>

                              <span>
                                {set.default ?
                                  constantText.create_movie_images_set_gc_text
                                  :
                                  this.getSetInformation(set.GroupCountry)
                                }
                              </span>

                            </li>
                          </ul>
                        </div>
                        <div className="row">
                          {imageSets[setIndex].images.map((image, imageIndex) => (
                            this.getImageListingView(imageIndex, isLocked, setIndex, menuItems, image, pageState, isViewMode, imageSets[setIndex])
                          ))}
                        </div>
                      </div>
                    )}
                     <CommonModel className='popup-wrap status-popup' state={showStatePopup}
                      showTitle={true} title={`${(setStatus === "1") ? 'Deactivate' : 'Activate'}  Image Set`}
                      showIcon={true} icon={(setStatus === "1") ? <DeactivateIcon /> : <ActivateIcon />}
                      showDes={true} des={`Do you want to ${(setStatus=== "1") ? 'deactivate' : 'activate'} the image set?`}
                      showBtn1={true} btn1Text={'Yes'} btn1Action={this.activateDeactivateUser}
                      showBtn2={true} btn2Text={'No'} btn2Action={()=>this.showHideStatePopup(null,null)}
                      handleClose={()=>this.showHideStatePopup(null,null)}
                    />
                  </div>
                ))
                } </div>
            </div>
          </Locked>
        </div>
        {
          viewEditModalState &&
          <ViewEditImageModal 
            movieId={this.props.videoId}
            viewEditModalState={viewEditModalState}
            viewEditModalMode={viewEditModalMode}
            imageItem={updatedImageItem? updatedImageItem :imageItem}
            isLocked={isLocked}
            viewEditImageModalClose={this.viewEditImageModalClose}
            onSelectFile={this.onSelectFile}
            externalId={this.props.externalId ?this.props.externalId :externalId}
            {...this.props}
          />
        }
        {   model.showModel &&
          <CommonModel className='popup-wrap status-popup' state={model.showModel}
            id="confirmationPopupClose"
            showTitle={true} title={model.title}
            showDes={true} des={model.des}
            showBtn1={true} btn1Text={constantText.yes_text} btn1Action={() => this.confirmationPopupClose(true)}
            showBtn2={true} btn2Text={constantText.no_text} btn2Action={() => this.confirmationPopupClose(false)}
            handleClose={() => this.confirmationPopupClose(false)}
          />
        }
        <CommonModel className='popup-wrap status-popup' state={showLockPopup}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={(e) => this.toggleLockModel(true)}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={()=>this.toggleLockModel(false)}
          handleClose={()=>this.toggleLockModel(false)}
        />
      </div >
    )
  }
}

const actionCreators = dispatch => {
  return {
    INCREASE_REQUEST: () => dispatch({ type: INCREASE_REQUEST }),
    DECREASE_REQUEST: () => dispatch({ type: DECREASE_REQUEST })
  }
};
export default connect(null, actionCreators)(ImageSets);
