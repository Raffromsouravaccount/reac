import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//SubComponents
import Actors from './SubComponents/Actors'
import Others from './SubComponents/Others'
import { CommonModel } from '../../Common/Model/CommonModel';
import Lock from './../../Common/Locked/Locked'
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import { getLocalData } from "../../../_helpers/util";
import checkValidity from "../../Common/FormHelper/FieldValidator";

//Actions
import { castCrewMgmtActions } from '../../../_actions/castCrewMgmt.action';

//Services
import {
  update_cast_crew,
  post_cast_crew,
  get_cast_crew
} from './../../../_services/movie.service'
import { apiCalls } from "../../../_services/common.service";

//Common
import { removeAllDynamicAddfields } from './../../Common/CommonFunction/CommonFuntion';
import Config from '../../../Config/config';


// CSS
import '../../../../public/css/Common/CastNCrew.css';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from 'images/lock-icon.svg';

class CastAndCrew extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    const {actors, others}= jsonData;
    this.state = {
      movieId: this.props.movieId,
      language: this.props.language,
      actors: JSON.parse(JSON.stringify(actors)),
      others: JSON.parse(JSON.stringify(others)),
      castList: [],
      action: 'PUT',
      isDone: false,
      markDoneEnabled: true,
      showModel: false,
      status: null,
    }
  }

  static getDerivedStateFromProps(props, state) {
    return state
  }

  populateDataToState = (castCrewData, userID) => {
    let { currentTabData } = this.props;
    let { isLocked } = currentTabData;
    const othersAttributes = [...this.state.others.attributes];
    let actorsAttributes = [...this.state.actors.attributes];
    //populating others
    othersAttributes.map(item => {
     
      if (castCrewData.hasOwnProperty(item.name)) {
        item.value = castCrewData[item.name]
      }
      return item
    })

    // populating actors
    if (castCrewData.hasOwnProperty(this.state.actors.name) && castCrewData[this.state.actors.name].length) {
      actorsAttributes = castCrewData[this.state.actors.name].map(item => {
        const actor = {
          actor: { ...actorsAttributes[0]['actor'] },
          character: { ...actorsAttributes[0]['character'] }
        }
        actor.actor.value = item.actor || null;
        actor.character.value = item.character;
        return actor;
      })
    }

    // update state
    this.setState((prevState) => {
      return {
        stage: this.props?.stage?.title,
        actors: {
          ...prevState.actors,
          attributes: [...actorsAttributes]
        },
        others: {
          ...prevState.others,
          attributes: [...othersAttributes]
        }
      }
    })
  }

  enableFields = () => {
    const othersAttributes = [...this.state.others.attributes];
    const actorsAttributes = [...this.state.actors.attributes];
    //populating others
    const othersAttributesArray = othersAttributes.map(item => {
      item.disabled = false
      return item
    })

    // populating actors
    actorsAttributes.map(item => {
      return Object.keys(item).map(key => {
        item[key].disabled = false
        return item
      })
    })
    // update state
    this.setState((prevState) => {
      return {
        actors: {
          ...prevState.actors,
          attributes: [...actorsAttributes]
        },
        others: {
          ...prevState.others,
          attributes: [...othersAttributesArray]
        }
      }
    })

  }

  updateMarkDoneStatus = (flag) => {
    this.setState({ markDoneEnabled: flag })
  }

  async componentDidMount() {
    const requestParams = {
      movieId: this.state.movieId,
      language: this.state.language
    }
    // getting existing castAndCrew item if exist
    this.getMovieDetails();
    const castAndCrew = await get_cast_crew(requestParams)
    if (castAndCrew) {
      const { userID } = getLocalData("userData");
      this.populateDataToState(castAndCrew, userID)
      this.setAction('PUT')
      this.updateMarkDoneStatus(true)
    }
  }

  getMovieDetails = async () => {
    let { movieId } = this.props;
    let url = `${Config.movieProperties}/${movieId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  unlockCastCrew = () => {
    this.toggleModel();
    this.props.unLockedSession(this.props?.selectedTab);
  }

  toggleModel = () => {
    this.setState(prevState => {
      return { showModel: !prevState.showModel }
    });
  }

  setAction = (action) => {
    this.setState({ action })
  }

  // it Updates old Value of selected element to new Value
  updateSection = (section, index, property, value) => {
    if (property) {
      section.attributes[index][property].value = value
      section.attributes[index][property].isChanged = true
    } else {
      section.attributes[index].value = value
      section.attributes[index].isChanged = true
    }
  }

  // It contains validation logic for castAndCrew form
  validateElement = (section, index, property, value) => {
    const element = property? section.attributes[index][property] : section?.attributes[index];
    let error = element?.disabled || false
    let result;
    element.error = false;
    element.errorMsg = false;

    if(value && !element?.disabled) {
      if(typeof value === "object") {
        if(Array.isArray(value)) {
          value.forEach(item => {
            result = checkValidity(item?.castName, element?.validation, false);
          })
        } else {
          result = checkValidity(value?.castName, element?.validation, false);
        }
      } else {
        result = checkValidity(value, element?.validation, false);
      }

      if (result && result.errorText) {
        element.error = true;
        element.errorMsg = result.errorText;
        error = true
      }
    }

    return error
  }

  // It updates selected input whenever user types something in input field
  handleChange = (event, index, sectionName, property) => {
    if (this.state.isLocked) {
      return;
    }
    const { value } = event.target
    const section = { ...this.state[sectionName] };
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
    // Validating
    const error = this.validateElement(section, index, property, value)

    // updating element value
    if (!error) {
      this.updateSection(section, index, property, value)
    }

    this.setState({ [sectionName]: section });
  }

  // It Updates dropDown item whenever user selects an item for dropdown
  handleMultiSelect = (event, index, value, sectionName, property) => {
    if (this.state.isLocked) {
      return;
    }

    const section = { ...this.state[sectionName] };

    // Validating
    const error = this.validateElement(section, index, property, value)

    // updating element value
    if (!error) {
      this.updateSection(section, index, property, value)
    }

    this.setState({ [sectionName]: section });
  }

  // It bascically takes users input from dropDown and adds it as new item to value array, whenever user clicks Enter
  handleKeyPress = (event, index, sectionName, property) => {
    const value = event?.target?.value ? event?.target?.value.trim() : ''
    if (event?.key === 'Enter' && value !== '') {
      let selectedItems = []
      if (property) {
        selectedItems = [...this.state[sectionName].attributes[index][property].value]
      } else {
        selectedItems = [...this.state[sectionName].attributes[index].value]
      }
      const item = {
        castName: value
      }
      selectedItems.push(item);
      this.handleMultiSelect(event, index, selectedItems, sectionName, property)
    }
  }

  resetElement = (element, sectionName, attributes) => {
    element.value = null
    if (element.type === 'text') {
      element.value = ''
    } else if (element.multiple && element.type === 'dropDown') {
      element.value = []
    }
    this.setState((prevState) => {
      return {
        [sectionName]: {
          ...prevState[sectionName],
          attributes: attributes
        }
      }
    })
  }

  updateChangeStatus = (element, sectionName, attributes, response) => {
    element.isChanged = false;
    this.setState((prevState) => {
      return {
        [sectionName]: {
          ...prevState[sectionName],
          attributes: attributes
        }
      }
    })
  }

  validateActor = (item) => {
    let actor = {}
    for (const property in item) {
      actor = {
        ...actor,
        [item[property].name]: item[property].value
      }
    }
    return actor
  }

  updateCastCrew = async (castCrewData, element, sectionName, attributes) => {
    let response = false
    const requestBody = {
      language: this.state.language,
      ...castCrewData
    }
    if (this.state.action === 'POST') {
      requestBody.movieId = this.state.movieId
      response = await post_cast_crew(requestBody)
    } else {
      response = await update_cast_crew(requestBody, this.state.movieId)
    }
    // handle response
    if (response.status !== 200 && response.status != 201) {
      this.props.autoSaveError(response)
      if (element) {
        this.resetElement(element, sectionName, attributes)
      }
    } else {
      this.updateMarkDoneStatus(true)
      this.props.markAsDone(this.props.selectedTab, false);
      if (element) {
        this.updateChangeStatus(element, sectionName, attributes, response.data)
      }
      if (this.state.action === 'POST') {
        this.setAction('PUT');
      }
    }
  }

  resetElementErrorStatus = (element, sectionName, attributes) => {
    element.error = false;
    element.errorMsg = false;

    this.setState((prevState) => {
      return {
        [sectionName]: {
          ...prevState[sectionName],
          attributes: attributes
        }
      }
    })
  }

  // It
  handleBlurEvent = async (event, index, sectionName, property) => {
    if (this.state.isLocked) {
      return;
    }
    let castCrewData = {}
    let element = {}
    const attributes = [...this.state[sectionName].attributes]

    if (property) {
      element = attributes[index][property]
      castCrewData[this.state[sectionName].name] = attributes.reduce((result, item) => {
        const actor = this.validateActor(item)
        if (actor) {
          result.push(actor)
        }
        return result
      }, [])
    } else {
      element = attributes[index]
      castCrewData = {
        [attributes[index].name]: attributes[index].value
      }
    }
    if (element.isChanged) {
      this.updateCastCrew(castCrewData, element, sectionName, attributes)
    }
    this.resetElementErrorStatus(element, sectionName, attributes)
  }

  addActor = (actorsData) => {
    const actor = JSON.parse(JSON.stringify(actorsData.attributes[0]))
    for (const prop in actor) {
      if (typeof actor[prop].value === 'object') {
        actor[prop].value = null;
      } else {
        actor[prop].value = ''
      }
      actor[prop].error = false
      actor[prop].errorMsg = false
    }
    actorsData.attributes.push(actor)
  }

  // this function handles Addition/Removal of Actor section from castAndCrew
  manageActors = (event, index, sectionName) => {
    if (this.state.isLocked) {
      return;
    }
    const actorsData = { ...this.state.actors }

    if (index === 0) {
      // push section to attributes array
      this.addActor(actorsData)

    } else {
      // pop section at index from attributes array
      actorsData.attributes.splice(index, 1)
      const castCrewData = {}
      castCrewData[this.state[sectionName]?.name] = actorsData.attributes.reduce((result, item) => {
        const actor = this.validateActor(item)
        if (actor) {
          result.push(actor)
        }
        return result
      }, [])
      this.updateCastCrew(castCrewData, null, 'actors', actorsData.attributes)

    }
    this.setState({ actors: actorsData })
  }

  // this function updates castAndCrew section Done
  markDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  }

  inputSearchHandler = async (value, index, sectionName, property) => {
    let movieId = this.state.movieId;
    let options = []
    if (value) {
      options = await apiCalls(`${Config.castnamesUrl}?castName=${value}`, "GET", {}, `/cast/edit/${movieId}`, false);
    }
    this.setState(prevState => {
      let section = prevState[sectionName]
      if (property) {
        section.attributes[index][property].data = options
      } else {
        section.attributes[index].data = options
      }
      return {
        [sectionName]: section
      }
    });
  }

  // It does some cleaning when component unmounts to free some RAM
  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    if (!this.state.movieId) {
      return null;
    }
    let { markDoneEnabled,status } = this.state;
    let { currentTabData, stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData;
    return (
      <div className="create-movie">
        <Lock
          lock={isLocked}
          lockedBy={lockedBy}
          clicked={this.toggleModel}>
          <div className="whitebox">
            <div className="ccm-head flex align-items-center justify-content-between m-b-30">
              <h4>{constantText.cast_crew_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div className="autosave">
                  {constantText.all_fields_auto_save_text}
                </div>
                <div className={`mark-done ${isDone ? "mark-active" : markDoneEnabled ? "mark-fill-active" : ""} auto-mark-done`}
                  data-test="markDoneBtn" onClick={()=> (markDoneEnabled && !isDone && !isLocked)? this.markDone(): {}}>
                  <span>
                    <MarkDone />
                  </span>
                  {constantText.mark_as_done_text}
                </div>
              </div>
            </div>
            <div className="movieForm-tab">
              <div className="movie-f-wrap col-12">
                <Actors metadata={this.state.actors}
                  disabled={!!isLocked} data-test="handleChangeBtn"
                  handleChange={(event, index, property) => this.handleChange(event, index, 'actors', property)}
                  handleMultiSelect={(event, index, value, property) => this.handleMultiSelect(event, index, value, 'actors', property)}
                  handleKeyPress={(event, index, property) => this.handleKeyPress(event, index, 'actors', property)}
                  onBlur={(event, index, property) => this.handleBlurEvent(event, index, 'actors', property)}
                  manageActors={(event, index) => { this.manageActors(event, index, 'actors') }}
                  inputSearchHandler={(event, index, property) => this.inputSearchHandler(event, index, 'actors', property)} />
                <Others metadata={this.state.others}
                  disabled={!!isLocked}
                  handleChange={(event, index) => this.handleChange(event, index, 'others')}
                  handleMultiSelect={(event, index, value) => this.handleMultiSelect(event, index, value, 'others')}
                  handleKeyPress={(event, index) => this.handleKeyPress(event, index, 'others')}
                  onBlur={(event, index) => { this.handleBlurEvent(event, index, 'others') }}
                  inputSearchHandler={(event, index) => this.inputSearchHandler(event, index, 'others')} />
              </div>
            </div>
          </div>
        </Lock>
        <CommonModel className='popup-wrap status-popup' state={this.state.showModel}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.unlockCastCrew}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.toggleModel}
          handleClose={this.toggleModel}
        />
      </div>
    );
  }
}

CastAndCrew.propTypes = {
  movieId: PropTypes.string,
  language: PropTypes.string
};

const mapStateToProps = state => {
  let castData = state.castCrewMgmt_reducer;
  return {
    castData
  }
}
const mapDispatch = {
  getCastList: castCrewMgmtActions.get_castList_action
};

export default connect(mapStateToProps, mapDispatch)(CastAndCrew);
