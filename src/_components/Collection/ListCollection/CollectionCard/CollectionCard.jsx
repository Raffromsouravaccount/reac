import React from 'react';
import moment from "moment";

import { constantText } from "../../../../_helpers/constants.text";


import ViewIcon from 'images/view-icon.svg';
import CopyIcon from 'images/copy-icon.svg';
import UpArrow from 'images/up-arrow.svg';
import MovieIcon from 'images/movie-icon.svg';

const CollectionCard = (props) => {
    return (
        <div className="mov-info-box flex justify-content-between">
            <div className="icon">
                <UpArrow />
            </div>
            <div className="left-area flex">
                <div className="movie-img">
                    <img src="images/demo.jpg" alt="img" />
                </div>
                <div className="info">
                    <div className="mov-detail flex align-items-center list-top-text">
                        <h4>{props.collectionName}</h4>
                        <span className="s-badge dot-badge green">
                            {props.collectionState}
                        </span>
                    </div>
                    <div className="status-text flex p-b-10">
                        <span className="label">Last Modified by</span>
                        <span className="text">
                            <span>{props.modifiedBy}</span>{" "}
                            <span>{moment.utc(props.modifiedDate).format("DD-MMM-YYYY")}</span>
                        </span>
                    </div>
                    <div className="status-text flex">
                        <span className="label">Note</span>
                        <span className="text">{props.note}</span>
                    </div>
                </div>
            </div>
            <div className="right-area">
                <div className="mov-icon-sec flex align-items-center">
                    <div className="mov-id">
                        <span className="text-id">{constantText.external_id_text}</span>
                        <span className="num-id">{props.contentId}</span>
                    </div>
                    <div className="mov-icon mov-view tooltip-sec" onClick= {props.viewHandler}>
                        <ViewIcon />
                        <div className="tooltip-box">View</div>
                    </div>
                    <div className="mov-icon mov-copy tooltip-sec">
                        <CopyIcon />
                        <div className="tooltip-box">Copy</div>
                    </div>
                </div>
                <div className="mov-link flex justify-content-end d-none">
                    <div className="mov-link-btn">
                        <MovieIcon /> <span>Link Movies +3</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CollectionCard;