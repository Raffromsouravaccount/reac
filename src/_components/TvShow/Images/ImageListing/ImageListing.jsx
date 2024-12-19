import React, { Component } from 'react';
import { MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';

//Common Files
import DropDown from '../../../Common/DropDown/DropDown';
import {completeImagePath} from '../../../Common/CommonFunction/CommonFuntion';

//Helper files
import { constantText } from '../../../../_helpers/constants.text';
import { getImageResolution } from "../../../../_helpers/util";
import "../../../.../../../../public/css/Common/ImageListing.css";
// import "./ImageListing.css";

//icons
import ThreeDotIcon from "images/three-dot-icon.svg";
import Image from "images/img-gallery-icon.svg";
import InvalidImage from "images/invalid-image.svg";

import "./ImageListing.css";

class ImagesListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDropdown: ""
        }
        this.myRef = React.createRef();
    }

    handleOpenClose = (index) => {
        this.setState({ openDropdown: this.state.openDropdown !== index ? index : "" });
    };

    onFileUpload = () => { };

    handleMenu = (menuItemIndex, menuItem) => {
        const { setIndex, imageIndex, handleMenuClick, item,set } = this.props;
        if (menuItem?.DisplayName == "Change Image") {
            this?.myRef?.current?.click();
        } else {
            handleMenuClick(setIndex, imageIndex, menuItem, item,set);
        }
        this.handleOpenClose(menuItemIndex);
    }

    getImageUploadView = () => {
        const { isViewMode, isLocked, onSelectFile, setIndex, imageIndex, item,set } = this.props;
        if (isViewMode) {
            return (
                <div className="info-block">
                    <span>No Image Uploaded.</span>
                </div>
            )
        }
        return (
            <div className="upload-block flex justify-content-center">
                <button className={`upload-btn auto-uploadImage-${imageIndex}`} onClick={this.onFileUpload}>
                    {constantText.create_movie_images_upload_text}
                </button>
                <input
                    disabled={isLocked}
                    ref={this.myRef}
                    type="file"
                    accept="image/x-png,image/jpg,image/jpeg"
                    name={item?.key}
                    onChange={(e) => onSelectFile(e, setIndex, imageIndex, item,set)}
                />
            </div>
        )
    }

    render() {
        const { openDropdown } = this.state;
        const {
            isLocked,
            imageIndex,
            menuItems,
            item,
            set, externalId
        } = this.props;
        const isImageUploaded = (item && item?.url && item?.url.length > 0);
        return (
            <div className="item-box">
                <div className="item-img">
                    {isImageUploaded && !item?.valid &&
                        <span className="invalid-image">
                            <InvalidImage className="info-icon" />
                            <span className="tooltip-sec" >
                                <div className="tooltip-box">{constantText.create_movie_invalid_images_text} </div>
                            </span>
                        </span>
                    }
                    {isImageUploaded ?
                        <img src={completeImagePath(externalId, item?.key, item?.url, item?.resolution)} alt="avatar" />
                        :
                        <Image className="avatar-icon" />
                    }
                </div>
                <div className="item-con">
                    <div className="item-head flex align-items-center justify-content-between">
                        {item && item?.title &&
                            <div className="item-name">{item?.title}</div>
                        }
                        {item && item?.resolution &&
                            <div className="item-name">{getImageResolution(item?.title)}</div>
                        }
                        {isImageUploaded ?
                            <div className="item-m-icon">
                                <ThreeDotIcon />
                                <DropDown
                                    open={openDropdown === imageIndex}
                                    handleOpenClose={() => this.handleOpenClose(imageIndex)}
                                    handleClose={() => this.handleOpenClose(imageIndex)}
                                    className="link-dropdown"
                                >
                                    {menuItems.map((menuItem, menuItemIndex) => (
                                        <MenuItem
                                            key={menuItemIndex}
                                            onClick={() => !isLocked ? this.handleMenu(menuItemIndex, menuItem) : ''}>
                                            {menuItem?.label}
                                        </MenuItem>
                                    ))}
                                </DropDown>
                            </div>
                            :
                           item && item?.mandatory && <div className="item-mandatory">{constantText.create_movie_req_images_text}</div>
                        }
                    </div>
                    <div className="item-text">
                        {!isImageUploaded ?
                            this.getImageUploadView()
                            :
                            <div className="info-block">
                                <div className="flex justify-content-between main-cover-text">
                                    <strong> {item && item?.imageTitle} </strong>
                                    <strong> {item && item?.size} </strong>
                                </div>
                               <span className="text-left text-block">{item?.imageDescription?.length >constantText.movie_image_description_length ? item?.imageDescription.substring(0, constantText.movie_image_description_length)+'...' : item?.imageDescription}</span>
                                {/* {descriptionBtn &&
                                    item?.description &&
                                    item?.description.length > 0 &&
                                    <span onClick={() => handleAddDescription(item)} className="item-btn" >Add Description</span>
                                } */}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default ImagesListing;
