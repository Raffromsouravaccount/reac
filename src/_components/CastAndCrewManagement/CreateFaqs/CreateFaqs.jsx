import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { connect } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//Helper Files
import { createFaqsConstant } from "./CreateFaqsConstant";
import ButtonField from "../../Common/ButtonField/ButtonField";
import InputField from "../../Common/InputField/InputField";
import LockedPopup from "../../CreateMovie/LockedPopup";
import { CommonModel } from "../../Common/Model/CommonModel";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import { isValidatedForm, DEFAULT_JSON, } from "../../Common/FormHelper/FormValidSetter";
import Lock from "../../Common/Locked/Locked";
import { castCrewMgmtService } from "./../../../_services/castCrewMgmt.service";
import { getLocalData, setLocalData } from "../../../_helpers/util";
import { castCrewMgmtActions } from "../../../_actions/castCrewMgmt.action";
import axios from "../../../_helpers/axiosInstance";
import Config from "../../../Config/config";
import {
  requiredValidate,
  minLength,
  maxLength,
  objectRequiredFieldValidation,
} from "../../../_helpers/validation";
import { constantText } from "../../../_helpers/constants.text";
//Images
import AccordianActive from "images/arrow-active-icon.svg";
import Edit from "images/edit.svg";
import Delete from "images/delete.svg";
import List from "images/list.svg";
import MarkDone from "images/tick.svg";
import AccordianNormal from "images/arrow-icon.svg";
//Css
import "./CreateFaqs.css";
class CreateFaqs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faq: {
        question: "",
        answer: "",
      },
      faqs: [],
      currentFaq: {},
      open: false,
      isOpen: false,
      error: false,
      active: false,
      isEditing: false,
      accordionIndex: null,
      questionlistdrag: [],
      questionlistdrop: [],
      markAsActive: false,
      allfaq: [],
      showLockedPopup: false,
      selectedIndex: null,
      castProfileId: "",
      language: "",
      questionId: "",
      showDelFaqPOPUP: false,
      JSONSchema: []
    };
  }

  componentDidMount() {
    const { castProfileId, Faq } = this.props;
    this.setState(prevState => ({
      castProfileId: castProfileId,
       JSONSchema: DEFAULT_JSON(JSON.parse(JSON.stringify(Faq))) || []
    }));
    if(this.props?.match?.params?.id){
      this.props.fetchFaq(this.props.match.params.id);
    }
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    let { faq } = this.state;
    this.setState((prevState) => ({ faq: { ...faq, [name]: value } }));
  };

  handleInputChange = (event) => {
    let { name, value } = event.target;
    let { currentFaq } = this.state;
    this.setState((prevState) => ({
      currentFaq: { ...currentFaq, [name]: value },
    }));
  };

  InputChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event?.target?.value;
      updatedElement.file = event?.target?.files[0];
    } else {
      if(updatedElement) {
      updatedElement.value =
        updatedElement?.type === "checkbox"
          ? event?.target?.checked
          : event?.target?.value;
      }
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
    if(updatedElement) {
      updatedElement.valid = isValid;
      updatedElement.errorText = errorText;
      //updated element's touched property
      updatedElement.touched = 1;
    }
    this.setState({ JSONSchema: copyJSON });
  };

  componentWillReceiveProps = (nextProps) => {
    let { allfaq } = nextProps;
    this.setState({
      allfaq:
        allfaq.faq && allfaq.faq.length > 0
          ? allfaq.faq.sort((obj1, obj2) => obj1.index - obj2.index)
          : []
    });
  };

  submitquestans = async (event) => {
    event?.preventDefault();
    let { JSONSchema, castProfileId } = this.state;
    if(JSONSchema)
    {
      JSONSchema.forEach((schema)=>{ schema.validation.required=true})      
    }    
    const { formValidity, validatedForm } = isValidatedForm(JSONSchema);
    this.setState({
      JSONSchema: validatedForm,
    });
    if (formValidity) {
      
      const validateObj = {};
      validateObj.castProfileId = castProfileId;
      JSONSchema.forEach((item) => {        
        validateObj[item.name] = item?.value;
      });

       let response = await axios.post(Config.createfaqUrl, validateObj);
     
      this.props.fetchFaq(castProfileId);      
      JSONSchema.forEach((schema)=>{ schema.validation.required=false})      

      this.setState((prevState) => ({
        JSONSchema: DEFAULT_JSON(JSONSchema),
        error:true
      }));
    }
  };

  showHideEditFaq = (currentFaq, index) => {
    const { isEditing, open } = this.state;
    this.setState({
      open: !open,
      isEditing: !isEditing,
      currentFaq: currentFaq || {},
      error: false,
      selectedIndex: index,
    });
  };

  saveFaqs = async (e, index) => {

    let { currentFaq, castProfileId } = this.state;
    let { question, answer } = currentFaq;
    let faqId = currentFaq.id;
    let validateObj = { question, answer, faqId };
    let error = objectRequiredFieldValidation(validateObj);
    if (
      error ||
      maxLength(1000, question) ||
      minLength(5, question) ||
      maxLength(5000, answer) ||
      minLength(5, answer)
    ) {
      return this.setState({
        error: true,
      });
    } else {
      let response = await axios.put(Config.createfaqUrl, validateObj);
      return this.setState(
        {
          open: false,
          isEditing: false,
        },
        () => this.props.fetchFaq(castProfileId)
      );
    }
  };

  removefaqPOPUP = (faq) => {
    this.setState({
      questionId: faq?.id,
      showDelFaqPOPUP: true,
    });
  };
  deleteQuestion = async () => {
    const { castProfileId, questionId } = this.state;
    let validateObj = { faqId: questionId };
    let response = await axios.delete(Config.createfaqUrl, {
      data: validateObj,
    });
    if (response.data && response.data.message === "Success") {
      this.setState({ showDelFaqPOPUP: false });
      this.props.fetchFaq(castProfileId);
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  toggleOpenClose = (e, index) => {
    let { active, accordionIndex } = this.state;
    this.setState({
      isOpen: index == accordionIndex ? false : true,
      active: !active,
      accordionIndex: accordionIndex == index ? null : index,
    });
  };

  checkValidation = () => {
    let { faq } = this.state;
    let { question, answer } = faq;

    if (faq["question"] && faq["answer"].length > 0) {
      setLocalData("FAQ-checklist", 1);
      return true;
    } else {
      return false;
    }
  };

  onDragEnd = async (result) => {
    let { allfaq, castProfileId } = this.state;

    const { destination, draggableId, source, type } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const sourceIndex = source.index;
    const targetIndex = destination.index;

    let formatedData = allfaq.slice();
    const [deletedItem] = formatedData.splice(sourceIndex, 1);
    formatedData.splice(targetIndex, 0, deletedItem);
    this.setState({
      allfaq: formatedData,
    });
    let data = formatedData.map((obj, index) => {
      let { id } = obj;
      return { faqId: id, index: index + 1 };
    });
    let resultObj = { faqs: data };
    let response = await axios.put(
      `${Config.createfaqUrl}/re-order`,
      resultObj,
      { loader: false }
    );
  };

  render() {
    let {
      error,
      isOpen,
      open,
      currentFaq,
      isEditing,
      accordionIndex,
      selectedIndex,
      showDelFaqPOPUP,
      JSONSchema,
    } = this.state;
    let { allfaq } = this.state;
    return (
      <div>
        <div className="whitebox">
          <div className="faq-box">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>FAQ</h4>
              <div className="status-head flex align-items-center">
                <div className="cm-draft">{createFaqsConstant.draftList}</div>
                <div
                  className={'mark-done mark-active'}
                >
                  <span>
                    <MarkDone />
                  </span>{" "}
                  {createFaqsConstant.mark}
                </div>
              </div>
            </div>
            <div className="mid-content col-12">
              <div className="wrap-group flex faq-textarea-field">
                <FormRender
                  form={JSONSchema}
                  onChange={this.InputChanger}
                />
                <div className="col-md-6 col-lg-6 form-save-btn">
                  <ButtonField
                    data-test="create-faq-test-button"
                    className="zee-btn-field zee-full"
                    variant="contained"
                    color="primary"
                    buttonText={"SAVE"}
                    onClick={this.submitquestans}
                  />
                </div>
              </div>
              <div className="col-12">
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="droppable-1">
                    {(provided, _) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {allfaq &&
                          allfaq.map((faq, index) => {
                            let question = `question-${index}`;
                            let answer = `answer-${index}`;
                            return (
                              <Draggable
                                key={faq.id}
                                draggableId={"draggable-" + faq.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <div
                                      className={
                                        isOpen && index == accordionIndex
                                          ? "ans-ques-block active"
                                          : "ans-ques-block"
                                      }
                                      key={faq.index}
                                    >
                                      <div className="question-list flex">
                                        <div
                                          className="question"
                                          id={question}
                                          onClick={(e) =>
                                            this.toggleOpenClose(e, index)
                                          }
                                        >
                                          <span>
                                            <AccordianNormal className="normal-icon" />
                                            <AccordianActive className="active-icon" />
                                          </span>
                                          {faq.question}
                                        </div>
                                        <div className="flex right-icon">
                                          <span
                                            className="edit tooltip-sec"
                                            onClick={() => this.showHideEditFaq(faq, index)}
                                          >
                                            <Edit />
                                            <div className="tooltip-box">
                                              {constantText.tool_tip_edit}{" "}
                                            </div>
                                          </span>
                                          <span
                                            className="remove tooltip-sec"
                                            onClick={() => this.removefaqPOPUP(faq)}
                                          >
                                            <Delete />
                                            <div className="tooltip-box">
                                              {constantText.tool_tip_delete}{" "}
                                            </div>
                                          </span>
                                          <span
                                            className="list"
                                            {...provided.dragHandleProps}
                                          >
                                            <span
                                              className="list tooltip-sec">
                                              <List />
                                              <div className="tooltip-box">
                                                {constantText.tool_tip_reshuffle}{" "}
                                              </div>
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                      {isOpen && index == accordionIndex && (
                                        <div className="answer-list">
                                          <div id={answer}>{faq.answer}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
              {isEditing && selectedIndex !== null ? (
                <div>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    className="modal"
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={open}>
                      <div className="center-popup">
                        <div className="paper global-popup">
                          <div className="popup-tittle">
                            <h2>{createFaqsConstant.editFaqs}</h2>
                          </div>
                          <div className="main-popucontent">
                            <InputField
                              className="zee-textarea-field"
                              name="question"
                              value={currentFaq.question}
                              onChange={this.handleInputChange}
                              placeholder="Question"
                              multiline
                              error={
                                error &&
                                  (requiredValidate(currentFaq.question) ||
                                    minLength(5, currentFaq.question) ||
                                    maxLength(1000, currentFaq.question))
                                  ? true
                                  : false
                              }
                              errorMsg={
                                requiredValidate(currentFaq.question) ||
                                minLength(5, currentFaq.question) ||
                                maxLength(1000, currentFaq.question)
                              }
                              label="Question"
                            />
                            <InputField
                              className="zee-textarea-field"
                              name="answer"
                              value={currentFaq.answer}
                              onChange={this.handleInputChange}
                              placeholder="Answer"
                              multiline
                              error={
                                error &&
                                  (requiredValidate(currentFaq.answer) ||
                                    minLength(5, currentFaq.answer) ||
                                    maxLength(5000, currentFaq.answer))
                                  ? true
                                  : false
                              }
                              errorMsg={
                                requiredValidate(currentFaq.answer) ||
                                minLength(5, currentFaq.answer) ||
                                maxLength(5000, currentFaq.answer)
                              }
                              label="Answer"
                            />
                          </div>
                          <div className="btn-group">
                            <ButtonField
                              onClick={(e) => this.saveFaqs(e, selectedIndex)}
                              buttonText={"Save"}
                            />
                            <ButtonField
                              onClick={this.showHideEditFaq}
                              buttonText={"Cancel"}
                            />
                          </div>
                        </div>
                      </div>
                    </Fade>
                  </Modal>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <CommonModel
          className="popup-wrap status-popup"
          state={showDelFaqPOPUP}
          showIcon={false}
          showTitle={true}
          title={`Delete`}
          showDes={true}
          des={constantText.delete_question_message}
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={() => this.deleteQuestion()}
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={() => this.setState({ showDelFaqPOPUP: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { allfaq } = state.castCrewMgmt_reducer;

  return {
    allfaq,
  };
};

const actionCreators = {
  createFaq: castCrewMgmtActions.create_faq_action,
  fetchFaq: castCrewMgmtActions.fetch_all_faq_action,
  viewProfile: castCrewMgmtActions.view_profile_action,
  image_markasdone_action: castCrewMgmtActions.image_markasdone_action,
};

export default connect(mapStateToProps, actionCreators)(CreateFaqs);
