import React, { Component } from "react";
import { constantText } from "../../../../_helpers/constants.text";
import { permissionObj } from "../../../../_helpers/permission";
import SeasonList from "../SeasonList";
import { dateDiffDayCount } from "../../../../_helpers/util";
//Icons
import Edit from "images/edit.svg";
import Delete from "images/delete.svg";
import AccordianNormal from "images/arrow-icon.svg";
import AccordianActive from "images/arrow-active-icon.svg";
class OrderSets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: 0,
    };
  }

  handleAccordian = (setIndex) => {
    this.setState({
      expanded: this.state.expanded === setIndex ? false : setIndex,
    });
  };

  handelSetOperations(set, mode) {
    const { editHandler, deleteHandler } = this.props;
    if (mode == "edit") {
      editHandler(set);
    }
    else if (mode == "remove") {
      deleteHandler(set);
    }
  }
  setSeasonListData = (seasonList) => {
    const { tvShow } = this.props;
    const { tvShowLicenses } = tvShow || {};
    seasonList?.map((item) => {
      item["licenceExpDays"] = [];
      if (item?.seasonLicenses?.length > 0) {
        item?.seasonLicenses.map((licenceItem) => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      }
      else if(tvShowLicenses?.length > 0){
        tvShowLicenses?.map((licenceItem) => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      }
    });
    return seasonList;
  };
  render() {
    const { expanded } = this.state;
    let { isViewMode, option, OrderSets, LanguageArr, showHideClonePopup, editHandler, tvShow, reArrangeSetHandler } = this.props;
    let { canUpdate } = permissionObj?.movies?.imagesModule;

    return (
      <div className="set-order-wrap">
        {OrderSets.map((set, setIndex) => (
          <div
            key={setIndex}
            className={
              expanded === set?.seasonOrderingId
                ? "ans-ques-block active"
                : "ans-ques-block"
            }
          >
            <div className="question-list flex auto-question-block">
              <div
                className="question auto-question"
                id={setIndex}
                data-test="handle-accordian-button"
                onClick={(e) => this.handleAccordian(set?.seasonOrderingId)}
              >
                <span>
                  <AccordianNormal className="normal-icon" />
                  <AccordianActive className="active-icon" />
                </span>
                {set?.setName}
              </div>
              {set && !isViewMode && (
                <div className="flex right-icon">
                  <span
                    className="edit auto-edit"
                    onClick={() =>
                      this.handelSetOperations(set, "edit")
                    }
                  >
                    <Edit />
                  </span>
                  <span
                    className="remove auto-remove"
                    onClick={() => this.handelSetOperations(set, "remove")}
                  >
                    <Delete />
                  </span>
                </div>
              )}
            </div>
            {expanded === set?.seasonOrderingId && (
              <div className="answer-list">
                <div className="flex m-b-20">
                <span className="g-cou-l-name">
                    {constantText.create_movie_images_gc_text}
                  </span>
                  <span className="g-cou-r-name">
                      {set?.countryId?.length ? set?.countryId?.map(e => e?.title)?.join(',') : "NA"}
                  </span>
                </div>
                <SeasonList
                  tvShow={tvShow}
                  id={set?.seasonOrderingId}
                  LanguageArr={LanguageArr}
                  matchParams={this.props?.matchParams}
                  contentIdKey={option?.contentIdKey}
                  showHideClonePopup={showHideClonePopup}
                  assignedData={set?.seasonList ? this.setSeasonListData(set?.seasonList) : []}
                  reArrangeHandler={(event) => reArrangeSetHandler(event, setIndex)}
                  meta={option}
                />
              </div>
            )}
          </div>
        ))}{" "}
      </div>
    );
  }
}

export default OrderSets;
