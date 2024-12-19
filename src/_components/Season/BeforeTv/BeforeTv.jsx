import React, {Component} from "react";

//Common Components
import FormRender from '../../Common/FormHelper/FormRender';

// Helpers
import { breadCrumbs } from "./breadCrumbs";


import AngleLeftArrow from "images/angle-left-arrow.svg";
import AccordianNormal from "images/arrow-icon.svg";
import AccordianActive from "images/arrow-active-icon.svg";

import { constantText } from "../../../_helpers/constants.text";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";

//CSS
import "../../../../public/css/Common/GlobalField.css";

import {
  beforeTvProperties
} from "./beforeTv.json";

const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : ((
            item.type === "dropdownAsync" ||
            item.type === "dropdown" ||
            item.type === "conditionalDropdown" ||
            item.type === "SearchableWithCreate"
            )? item.multiple? []: null: ""),
        (item.touched = 0));
      item.valid = true;
      return item;
    });
  }
};

class BeforeTvProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetType : [
        {
            assetName:"AssetType-Episode"
        },
        {
            assetName:"AssetType-Webisode"
        }

    ],
    isOpen: true,
    accordionIndex: null,
    beforeTvProperties:DEFAULT_JSON(beforeTvProperties) || []
    }
  }
  toggleOpenClose = (e, index) => {
    let { active, accordionIndex ,isOpen} = this.state;
    this.setState((prevState, props)=>({
      isOpen: true,
      active: !active,
      accordionIndex: accordionIndex == index ? null : index,
    }));
  };

  render() {
    let {
      assetType,
      isOpen,
      accordionIndex,
      beforeTvProperties
    } = this.state;
    const { match, path } = this.props;
    let url = "/edit";
    let seasonUrl = "/season";
    if (path?.includes("/tvshow/:viewEdit")) {
      url = `/${match?.params?.viewEdit}`;
    }
    if (path?.includes("/tvshow/:quickSingle")) {
      url = `/${match?.params?.quickSingle}/edit`;
    }
    if(path?.includes("/season/view")){
      seasonUrl = "/season/view";
    }
    return (
          <div className="d-wrap c-n">

      <BreadcrumbsComp
          links={breadCrumbs.links(url, seasonUrl, match?.params?.id, match?.params?.seasonId)}
          typography={breadCrumbs.typography}
        />

        <div className="profile-head flex align-items-center justify-content-between" data-test="headingWrapper">
          <div className="back-user-btn">
            <span onClick={() => this.handleRoute(`/tvshow${url}/${match?.params?.id}/season`)} >
              <AngleLeftArrow />
            </span>
            <strong>
              <span data-test="placeholderHeading">{constantText.before_tv_text.before_tv}</span>
            </strong>
          </div>
        </div>

            <div className="col-12">
                <div className="row">
                    <div className="whitebox col-md-9 col-lg-9 col-xl-10">
                        <div className="ccm-head w-100 flex align-items-center justify-content-between m-b-30">
                              <h4>{constantText.before_tv_text.before_tv_properties_text}</h4>
                        </div>
                      <div className="mid-content col-12">
                      { assetType && assetType.length>0 && assetType.map((asset, index) => (
                      <div key={index}>
                        <div
                        className={
                          isOpen && index == accordionIndex
                            ? "ans-ques-block active"
                            : "ans-ques-block"
                        }
                        data-test='question-list'
                        onClick={(e) => this.toggleOpenClose(e, index)}>
                          <div className="question-list flex">
                            <div className="question q-full">
                              <span>
                                <AccordianNormal className="normal-icon" />
                                <AccordianActive className="active-icon" />
                              </span>
                              {asset.assetName}
                            </div>
                          </div>
                          {isOpen && index == accordionIndex && (
                              <div className="answer-list">
                                  <div className="movie-f-wrap col-12">
                                      <div className="global-wrap">
                                          <div className="global-row">
                                            <div className="add-plush-row top-title">
                                              <div className="top-text">{`${constantText.before_tv_text.episodeSet}`}</div>
                                              <div className="add-another-f-btn create-btn">
                                              <div className='add-btn-field flex align-items-center'
                                                    onClick={() => {}}>
                                                  <span className="plush-icon-btn"></span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="row input-space-35">
                                  <FormRender
                                      form={beforeTvProperties}
                                      data-test="episodePropertiesForm"
                                      setSelectDataArr={(value, index) => this.setSelectDataArr('episodeProperties', null, index, value)}
                                      onChange={()=>this.handleStateChange()}
                                      handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, null, index, 'episodeProperties')}
                                      selectGroup={(ev, group) => this.selectDayPartGroup('episodeProperties', ev, group)}
                                      handleBlur={this.handleBlur}
                                      isDisable={false}
                                  />
                                  </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                      </div>
                    </div>

                </div>
                
              </div>
          </div>
          
    );
  }
}

export default BeforeTvProperties;

