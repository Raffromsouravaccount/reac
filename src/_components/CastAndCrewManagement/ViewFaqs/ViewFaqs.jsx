import React, { Component } from "react";
import { connect } from "react-redux";
import { castCrewMgmtActions } from "../../../_actions/castCrewMgmt.action";
import ButtonField from "../../Common/ButtonField/ButtonField";
import BadgeBox from "./../../Common/BadgeBox/BadgeBox";

import { getLocalData } from "../../../_helpers/util";
import { history } from "../../../_helpers/history";
import { permissionObj } from '../../../_helpers/permission';

import MarkDone from "images/tick.svg";
import AccordianActive from "images/arrow-active-icon.svg";
import AccordianNormal from "images/arrow-icon.svg";
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";

import { apiCalls } from "../../../_services/common.service";


class ViewFaqs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faq: {
        question: "",
        answer: "",
      },
      faqs: [],
      currentFaq: {},
      status: null,
      open: false,
      isOpen: false,
      error: false,
      active: false,
      isEditing: false,
      accordionIndex: null,
      allfaq: [],
      castProfileId:""
    };
  }

  componentWillReceiveProps = (nextProps) => {
    let { allfaq } = nextProps;
    this.setState({
      allfaq: allfaq?.faq,
    });

  }

  lockedSession = () => {
    this.props?.lockedSession(0);
  };

  componentDidMount() {
    if(this.props?.match?.params?.id){
      this.setState({castProfileId:this.props.match.params.id},()=>
      {
        this.getCastData();
        this.fetchContentData()
      }
      )
    }
  }

  getCastData = async () => {
    let {  castProfileId } = this.state;
    const response = await apiCalls(`${Config.createProfileUrl}/${castProfileId}`, "GET");
    if (response) {
      let { contentState } = response;
      this.setState({
        status: contentState?.title,
      });
    }
  }

  fetchContentData = async () => {
    let {  castProfileId } = this.state;
    let url = `${Config.createfaqUrl}/${castProfileId}`;
    let response = await apiCalls(url, "GET", {});
    let faq = response?.faq;
    this.setState({
      allfaq: faq
    });
  };
  toggleOpenClose = (e, index) => {
    let { active, accordionIndex ,isOpen} = this.state;
    this.setState((prevState, props)=>({
      isOpen: index == accordionIndex ? false : true,
      active: !active,
      accordionIndex: accordionIndex == index ? null : index,
    }));
  };

  handleConditionRoute = (view, id) => {
    let detail = {};
    detail.castProfileId = id;
    detail.view = view;
    history.push(`/cast/edit/${id}`, constantText.editFAQ);
  }



  render() {
    let {
      faq,
      isOpen,
      accordionIndex,
      allfaq,
      castProfileId,
      status
    } = this.state;
    let { question, answer } = faq;

    let {canUpdate}= permissionObj?.cast?.faq;
    return (
      <div className="whitebox">
        <div className="faq-box">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4 data-test="faq-view-faqheading">FAQ</h4>
            <div className="status-head flex align-items-center">
              <BadgeBox status={status} />
              {
                (status !== constantText.castProfile.archived && this.props.viewMode) ?
                <ButtonField
                  className="cm-edit-btn"
                  variant="contained"
                  disabled={!canUpdate()}
                  color="primary"
                  data-test={constantText.edit_faq_test}
                  onClick={()=> canUpdate()? this.props.handleRoute(`/cast/edit/${this.props.castProfileId}`): ""}
                  buttonText={"Edit FAQ"}
                />
                : null
              }
            </div>
          </div>
          <div className="mid-content col-12">
            { allfaq && allfaq.length>0 && allfaq.map((faqs, index) => (
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
                      {faqs.question}
                    </div>
                  </div>
                  {isOpen && index == accordionIndex && (
                      <div className="answer-list">
                        <div id={answer}>{faqs.answer}</div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export {ViewFaqs}
export default ViewFaqs;
