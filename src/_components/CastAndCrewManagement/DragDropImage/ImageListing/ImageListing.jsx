import React, { Component, useRef } from "react";
import { connect } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import Modal from "@material-ui/core/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import DropDown from "../../../Common/DropDown/DropDown";
import RearrangeIcon from "images/rearrange-icon.svg";
import TagIcon from "images/tag-icon.svg";
import ThreeDotIcon from "images/three-dot-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";

import "./ImageListing.css";
import { constantText } from "../../../../_helpers/constants.text";
import { permissionObj } from '../../../../_helpers/permission';
import { CommonModel } from '../../../Common/Model/CommonModel'
import Config from "../../../../Config/config";
import { apiCalls } from "../../../../_services/common.service";

export const Image = ({ image, index, moveImage, getLastToId, mode, handleView, handleRemove, handleEdit, externalId, handleOpenClose, openLogoutDropdown, truncate, canUpdate, lock}) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'Image',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      let toId = '', fromId = '';
      if (dragIndex === hoverIndex) {
        return;
      } else {
        toId = item.id;
        fromId = image.id;
      }
      moveImage(dragIndex, hoverIndex, toId, fromId);
      item.index = hoverIndex;
    },
    drop(item) {
      getLastToId(item.id);
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: "Image", id: image.id, index },
    canDrag: (canUpdate() && mode !== 'view') ? !lock : false,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="col-sm-6 col-md-6 col-lg-6 col-xl-4"
    >
      <div
        className={mode !== 'view' ? "item-box" : "item-box photo-pointer"}
        onClick={() => { mode !== 'view' ? {} : handleView(image) }}
      >
        <div className="item-img">
          {mode !== 'view' && <RearrangeIcon />}
          <img src={`${Config.imageBaseUrl}${externalId}/${constantText.otherImage}/${image?.imageDetails?.url}`} alt="avatar" />
        </div>
        <div className={"item-con"} >
          <div className="item-head flex align-items-center justify-content-between">
            <div className="item-name">{truncate(image.title)}</div>
            {mode !== 'view' && <div className="item-m-icon">
              <ThreeDotIcon />
              <DropDown
                open={openLogoutDropdown == image.id}
                handleOpenClose={() => handleOpenClose(image.id)}
                handleClose={() => handleOpenClose(image.id)}
                data-test="image-open-close"
                className="link-dropdown"
              >
                <MenuItem data-test="view-list" onClick={() => handleView(image)}>View</MenuItem>
                <MenuItem data-test="edit-list" onClick={() => handleEdit(image)}>Edit</MenuItem>
                <MenuItem data-test="remove-list" onClick={() => handleRemove(image)}>Remove</MenuItem>
              </DropDown>
            </div>}
          </div>
          <div className="item-tag flex align-items-center">
            <div className="tag-icon">
              <TagIcon />
            </div>
            {((!image.genre && !image.gender && !image.ageGroup && !image.language && !image.others)) && <div className="tag-other">No Tag</div>}
            {(image?.genre && image?.genre.length > 0) && <div className="tag-name">
              {image?.genre?.map(item => (item?.title)).join(', ')}
            </div>}
            {(image?.gender && image?.gender.length > 0) && <div className="tag-name"> {image?.gender?.map(item => (item?.title)).join(', ')}</div>}
            {(image?.ageGroup && image?.ageGroup.length > 0) && <div className="tag-name"> {image?.ageGroup?.map(item => (item?.title)).join(', ')}</div>}
            {(image?.language && image?.language.length > 0) && <div className="tag-name">{image?.language?.map(item => (item?.title)).join(', ')}</div>}
            {(image.others && image.others) && <div className="tag-other">{image.others}</div>}

          </div>
          <div className="item-text">
            {(image.description && image.description.length > 0) &&
              <span>{image.description.length > constantText.description_length ? image.description.substring(0, constantText.description_length) + '...' : image.description}</span>}
            {(!image.description && !image.description.length > 0) && mode !== 'view' && <span
              onClick={() => handleEdit(image)}
              className="item-btn"
            >
              Add Tag and Description
                </span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
class ImageListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      listingdata:props.listingdata ,
      openLogoutDropdown: "",
      showDeletePOPUP: false,
      deleteImageId: "",
      fromId: '',
      dropIndex: '',
    };
  }

  handleOpenClose = (key) => {
    let { openLogoutDropdown } = this.state;
    if (openLogoutDropdown !== key && !this.props.lock) {
      this.setState({ openLogoutDropdown: key });
    } else {
      this.setState({
        openLogoutDropdown: "",
      });
    }
  };

  handleClose = () => {
    this.setState({ openLogoutDropdown: false });
  };

  truncate = (str) => {
    if (str) {
      return str.length > 15 ? str.substring(0, 10) + "..." : str;
    }
  };

  async getReorderedList(params) {
    let url = `${Config.imageReorderUrl}/${this.props.castProfileId}`
    const res = await apiCalls(url, "patch", params,null, false, false, this.props.autoSaveError);
    if (res?.status == 400 && res?.message) {
      showSuccessErrorMsg(res.message, null, 'error');
    } else if (res) {
      this.props.markAsDone(this.props?.selectedTab, false);
      this.setState({
        listingdata: res
      });
    }
  
  }

  handlePopUpClose = () => {
    this.setState({
      open: false,
    });
  };

  handleEdit = (Item) => {
    const { canUpdate } = permissionObj?.cast?.images;
    if (canUpdate() && this.props?.mode !== 'view') {
      if (!this.props.lock) {
        var lang = Item;
        this.props.editstatus('edit', lang);
        this.setState({ openLogoutDropdown: false });
      }
    }
  };

  handleView = (item) => {
    this.setState({
      selectedValue: item,
      open: true,
      openLogoutDropdown:false
    });
  };

  handleRemove = (item) => {
    const { canUpdate } = permissionObj?.cast?.images;
    if (canUpdate() && this.props.mode !== 'view') {
      if (!this.props.lock) {
        this.setState({ openLogoutDropdown: false, showDeletePOPUP: true, deleteImageId: item.id });
      }
    }
  };

  async deleteImage() {
    const {deleteImageId}=this.state
    let url = `${Config.deletePhotoDetails}/${this.props.castProfileId}`;
    await apiCalls(url, "DELETE", {  imageId: deleteImageId },null, true, false, this.props.autoSaveError);
      this.setState({
        showDeletePOPUP:false
      },()=>{
        this.props.markAsDone(this.props?.selectedTab, false);
        this.props.getImageList()
      })
  }

  getLastToId = (toId) => {
    const {fromId, dropIndex} = this.state;
    this.onDropComplete(toId, dropIndex, fromId);
  }

  getFromId = (id, hIndex) => {
    this.setState({
      fromId: id,
      dropIndex: hIndex
    })
  }

  moveImage = (dragIndex, hoverIndex, toId, fromId) => {
    const listingdata = Object.assign([], this.state.listingdata);
    const draggedImage = this.state.listingdata[dragIndex];
    const hoverImageSeq = this.state.listingdata[hoverIndex]?.sequence;
    this.setState((prevState, props) => ({
      listingdata: update(listingdata, { $splice: [[dragIndex, 1], [hoverIndex, 0, draggedImage]]})
    }), () => {
      this.getFromId(fromId, hoverImageSeq);
    });
  }

  onDropComplete = (lastToId, dropIndex, fromId) => {
    if (lastToId && fromId) {
      setTimeout(() => {
        this.getReorderedList({
          'sequence': dropIndex,
          'id': lastToId.toString()
        });
      })
    }
  }

  renderUsers = (item, index) => {
    let { openLogoutDropdown } = this.state;
    const { canUpdate } = permissionObj?.cast?.images;
    return (
      <Image 
        image={item}
        index={index}
        key={item?.id}
        mode = {this.props?.mode}
        handleView = {() => this.handleView(item)}
        externalId = {this.props?.externalId}
        handleOpenClose = {() => this.handleOpenClose(item.id)}
        handleClose={() => this.handleOpenClose(item.id)}
        handleEdit = {() => this.handleEdit(item)}
        handleRemove = {() => this.handleRemove(item)}
        openLogoutDropdown = {openLogoutDropdown}
        truncate = {this.truncate}
        canUpdate = {canUpdate}
        lock = {this.props.lock}
        getLastToId = {this.getLastToId}
        moveImage={this.moveImage} {...this.props} />
    );
  };
  render() {
    const { selectedValue, listingdata, showDeletePOPUP, deleteImageId } = this.state
    return (
      <div>
          <div className="col-12 rearrange-head flex align-items-center justify-content-between">
            <div className="title">{(listingdata && listingdata.length > 0) ? constantText.uploaded_images : constantText.no_image_available}</div>
            {this.props.mode !== 'view' && <div className="r-text flex align-items-center">
              Click
              <RearrangeIcon />
              And drag to rearrange
            </div>}
          </div>
          <div className="col-12 rearrange-wrap">
            <div className="row">
              {this.state.listingdata && this.state.listingdata.map(this.renderUsers)}
            </div>
          </div>
        <Modal
          className="photo-popup"
          open={this.state.open}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className="photo-box">
            <div className="head">
              View Photo
              <span className="close-btn" onClick={this.handlePopUpClose}>
                <CloseSquareIcon />
              </span>
            </div>
            <div className="photo-content">
              <div className="row">
                <div className="col-img col-sm-5 col-md-5">
                  <img
                    src={
                     `${Config.imageBaseUrl}${this.props.externalId}/${constantText.otherImage}/${selectedValue && selectedValue?.imageDetails?.url}` 
                    }
                    alt="avatar"
                  />
                </div>
                <div className="col-text col-sm-7 col-md-7">
                  <h4>
                    {selectedValue && selectedValue.title}
                  </h4>
                  <div className="tag-list flex align-items-center">
                    <div className="tag-icon">
                      <TagIcon />
                    </div>
                    {selectedValue &&
                      selectedValue.genre && selectedValue.genre.length > 0 && <div className="tag-name">
                        {selectedValue?.genre?.map(item => (item?.title)).join(', ')}
                      </div>}
                    {selectedValue &&
                      selectedValue.gender && selectedValue.gender.length > 0 && <div className="tag-name">
                        {selectedValue?.gender?.map(item => (item?.title)).join(', ')}
                      </div>}

                    {selectedValue &&
                      selectedValue.ageGroup && selectedValue.ageGroup.length > 0 && <div className="tag-name">
                        {selectedValue?.ageGroup?.map(item => (item?.title)).join(', ')}
                      </div>}
                    {selectedValue &&
                      selectedValue.language && selectedValue.language.length > 0 && <div className="tag-name">
                        {selectedValue?.language?.map(item => (item?.title)).join(', ')}
                      </div>}
                    {selectedValue && selectedValue.others && <div className="tag-other">
                      {selectedValue.others}
                    </div>}
                  </div>
                  <p>
                    {selectedValue &&
                      selectedValue.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <CommonModel
          className="popup-wrap status-popup"
          id="btnAction"
          state={showDeletePOPUP}
          showIcon={false}
          showTitle={true}
          title={`Delete`}
          showDes={true}
          des={constantText.delete_image_message}
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={() => this.deleteImage(deleteImageId)}
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={() => this.setState({ showDeletePOPUP: false })}
        />
      </div>
    );
  }
}

export default ImageListing;
