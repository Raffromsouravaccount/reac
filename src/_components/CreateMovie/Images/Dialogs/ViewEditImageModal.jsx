import React, { Component } from 'react';
import Modal from "@material-ui/core/Modal";
import { Button } from '@material-ui/core';

//Icons
import CloseSquareIcon from "images/close-square-icon.svg";
import Image from "images/img-gallery-icon.svg";
import InvalidImage from "images/invalid-image.svg";

//Common Files
import FormRender from '../../../Common/FormHelper/FormRender';
import checkValidity from "../../../Common/FormHelper/FieldValidator";
import {completeImagePath} from "../../../Common/CommonFunction/CommonFuntion";
import { formValidityCheck } from "../../../Common/FormHelper/FormValidSetter";

//Helper files
import { constantText } from '../../../../_helpers/constants.text';
import { getImageResolution } from "../../../../_helpers/util";

import { addEditImage } from '../../Schema/Images/Image.json';
class ViewEditImageModal extends Component {
    constructor(props) {
        let { jsonData } = props;
        super(props);
        this.state = {
            addEditImageJson: JSON.parse(JSON.stringify(jsonData?.addEditImage)),
            saveButtonEnable:true
        }
    }

    componentDidMount() {
        const { imageItem, viewEditModalMode } = this.props;
        if (viewEditModalMode == 'edit') {
            this.setImageDataToForm(imageItem?.imageData)
        }
    }

    setImageDataToForm = (imageData) => {
        const image = { ...imageData };
        let updatedJson = [...this.state.addEditImageJson];
        updatedJson.forEach(element => {
            element.value = image[`${element.name}`] || "";
        });
        this.setState({ addEditImageJson: updatedJson })
    }

    inputChangeViewAddEdit = (e, index) => {
        let { addEditImageJson} = this.state;
        addEditImageJson[index].value = e.target.value.trim() ? e.target.value : e.target.value.trim()
        let { formValidity } = formValidityCheck(addEditImageJson);
        const { isValid, errorText } = checkValidity(
            addEditImageJson[index]?.value,
            addEditImageJson[index]?.validation
            );
            addEditImageJson[index].valid = isValid;
            addEditImageJson[index].errorText = errorText;
            //updated element's touched property
            addEditImageJson[index].touched = 1;
        this.setState({ addEditImageJson,saveButtonEnable:formValidity });
    }

    render() {
        const {
            viewEditModalState,
            viewEditModalMode,
            imageItem,
            viewEditImageModalClose,
            isLocked,
            onSelectFile,
            externalId
        } = this.props;

        let { addEditImageJson, saveButtonEnable } = this.state;
        return (
            <Modal className="photo-popup"
                open={viewEditModalState}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className="photo-box">
                    <div className="head">
                        {viewEditModalMode == 'view' &&
                            <span>
                                <span> {imageItem && imageItem.imageData.title} {imageItem && getImageResolution(imageItem.imageData.title)} </span>
                                <div className="close-btn" onClick={(e) => viewEditImageModalClose(false)}>
                                    <CloseSquareIcon />
                                </div>
                            </span>
                        }
                        {viewEditModalMode == 'edit' &&
                            <span>{constantText.editImageLabel}</span>
                        }
                    </div>
                    <div className="photo-content">
                        <div className="row padd-bot20">
                            <div className="col-img col-sm-5 col-md-5">
                            <div className="wrap-edit-img">
                                {imageItem?.imageData && !imageItem?.imageData.valid &&
                              <span className="invalid-image">
                                <InvalidImage className="info-icon" />
                                <span className="tooltip-sec" >
                                <div className="tooltip-box">{constantText.create_movie_invalid_images_text} </div>
                              </span>
                              </span>
                                }
                                {imageItem?.imageData?.url && imageItem?.imageData?.url.length ?
                                    <img src={completeImagePath(externalId, imageItem.imageData.key, imageItem.imageData.url, imageItem.imageData.resolution)} alt="avatar" />
                                    :
                                    <div className="no-img-icon flex align-items-center justify-content-center"><Image /></div>
                                }
                                {viewEditModalMode == 'edit' &&
                                    <div className="upload-block flex justify-content-center">
                                        <button className="upload-btn" onClick={this.onFileUpload}>
                                            {constantText.create_movie_images_change_text}
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/x-png,image/jpg,image/jpeg"
                                            name={imageItem?.imageData?.title}
                                            onChange={(e) => onSelectFile(e, imageItem?.setIndex, imageItem?.imageIndex, imageItem?.imageData)}
                                        />
                                    </div>
                                }
                                </div>
                            </div>
                            {viewEditModalMode == 'view' &&
                                <div className="col-text col-sm-7 col-md-7">
                                    <div className="flex justify-content-between main-cover-text">
                                        <strong> {imageItem && imageItem.imageData.imageTitle} </strong>
                                        <strong> {imageItem && imageItem.imageData.size} </strong>
                                    </div>
                                    <p>  {imageItem && imageItem.imageData.imageDescription} </p>
                                </div>
                            }
                            {viewEditModalMode == 'edit' &&
                                <div className="col-text col-sm-7 col-md-7">
                                    <div className="flex justify-content-between main-cover-text">
                                        <strong> {imageItem && imageItem?.imageData?.title}&nbsp;&nbsp;&nbsp;{imageItem && getImageResolution(imageItem.imageData.title)}  </strong>
                                        <strong> {imageItem && imageItem?.imageData?.size} </strong>
                                    </div>
                                    <FormRender
                                        data-test="input-change-dialoge"
                                        form={addEditImageJson}
                                        onChange={this.inputChangeViewAddEdit}
                                        isDisable={isLocked}
                                    />
                                </div>
                            }

                        </div>
                    </div>
                    {viewEditModalMode == 'edit' &&
                        <div className="photo-actions">
                            <div className="MuiDialogActions-root MuiDialogActions-spacing">
                                <Button id="saveBtn" onClick={() =>{saveButtonEnable ? viewEditImageModalClose(true, addEditImageJson):{}}}>Save</Button>
                                <Button id="cancelBtn" onClick={() => viewEditImageModalClose(false)}>Cancel</Button>
                            </div>
                        </div>
                    }
                </div>
            </Modal >
        );
    }
}

export default ViewEditImageModal;