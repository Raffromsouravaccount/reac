import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Drawer from '@material-ui/core/Drawer';

//SubComponents
import LeftTab from './../../Common/LeftTab/CommonLeftTab'
import AssignedContent from './AssignedContent/AssignedContent'
import AddContent from './AddContent/AddContent'

//Common Component
import Lock from "../../Common/Locked/Locked";
import { CommonModel } from '../../Common/Model/CommonModel';
import { removeAllDynamicAddfields } from './../../Common/CommonFunction/CommonFuntion';
// import DropDown from "../../Common/DropDown/DropDown";

//Helper files
import { constantText } from './../../../_helpers/constants.text';
import { getLocalData } from './../../../_helpers/util';
import { permissionObj } from './../../../_helpers/permission';

// Config
import Config from '../../../Config/config';


//Services
import {
  post_map_content,
  delete_map_content,
  get_map_content,
  rearrange_map_content
} from '../../../_services/movie.service'
import { apiCalls } from '../../../_services/common.service';


//Images
import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";

//css
import '../../../../public/css/Common/MapContent.css';

import ButtonField from "../../Common/ButtonField/ButtonField";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

class MapContent extends Component {
  constructor(props) {
    super(props)
    let { jsonData } = props;
    this.state = {
      userID: getLocalData("userData")?.userID,
      markDoneEnabled: true,
      showFilterDrawer: false,
      showModel: false,
      commanModal: null,
      addingNewContent: false,
      action: constantText.post,
      mainContent: [],
      linkContent: [],
      searchText: '',
      selectedTab: 0, showLockedPopup: false,
      options: JSON.parse(JSON.stringify(jsonData)),
      status: null,
    }
  }

  static getDerivedStateFromProps(props, state) {
    state.movieId = props.contentId
    return state
  }

  getMappedContent = async () => {
    if (!this.state.movieId) {
      return;
    }
    const currentTab = this.state.options[this.state.selectedTab]
    const requestParams = {
      movieId: this.state.movieId,
      type: currentTab.type
    }
    //getting existing mapContent item if exist
    return await get_map_content(requestParams)
  }

  componentDidMount() {
    const currentTab = { ...this.state.options[this.state.selectedTab] }
    this.getMovieDetails();
    this.getMappedContent()
      .then(content => {
        if (content && content.length) {
          this.populateDataToState(content)
          this.updateMarkDoneStatus(true)
        }
      })
      .catch(error => {
      })
    currentTab.fetched = true
    this.updateOption(currentTab)
  }

  getMovieDetails = async () => {
    let { contentId } = this.props;
    let url = `${Config.movieProperties}/${contentId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  componentDidUpdate() {
    const currentTab = { ...this.state.options[this.state.selectedTab] }
    if (this.state[currentTab.name].length <= 0 && !currentTab.fetched) {
      this.getMappedContent()
        .then(mapContent => {
          // handle response
          this.populateDataToState(mapContent)
        })
        .catch(error => {
          //handle Error
        })
      currentTab.fetched = true
      this.updateOption(currentTab)
    }
  }

  autoSaveError = (res) => {
    let stateObj = {},
      optionsCopy = JSON.parse(JSON.stringify(this.state.options));
    optionsCopy.forEach(option => {
      option['fetched'] = false;
      if (this.state[option.name]?.length) { stateObj[option.name] = [] }
    })
    stateObj['options'] = optionsCopy;
    this.setState(stateObj);
    this.props.autoSaveError(res);
  }

  updateOption = (updatedOption) => {
    this.setState((prevState) => {
      const options = prevState.options.map(option => {
        if (option.name === updatedOption?.name) {
          option = updatedOption
        }
        return option
      })
      return {
        options
      }
    })
  }

  populateDataToState = (contentData) => {
    const data = {}
    const currentTab = this.state.options[this.state.selectedTab]
    data[currentTab.name] = contentData || []
    this.setState({ ...data })
  }

  lockMapContent = async (closeModel) => {
  }

  switchToAddContent = () => {
    this.setState({ addingNewContent: true })
  }

  closeAddContent = () => {
    this.setState({ addingNewContent: false })
  }


  addContentHandler = (newContents) => {
    const { status } = this.state;
    if (status === constantText.contentConstants.published) {
      this.setState({ status: constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview) {
      this.setState({ status: constantText.contentConstants.draft })
    }
    if (status ===  constantText.contentConstants.unpublished) {
      this.setState({ status:constantText.contentConstants.draft })
    }
    let currentTab = this.state.options[this.state.selectedTab];
    const contentData = newContents?.map(item => item.movieId);
    this.updateMapContents(newContents, contentData, currentTab);
  }

  updateMapContents = async (newContents, contentData, currentTab) => {
    let response = false;
    const assignedContentId = new Set([...contentData]);
    const requestBody = {
      movieId: this.state.movieId,
      type: currentTab.type,
      assignedContentId: [...assignedContentId]
    }
    response = await post_map_content(requestBody, this.autoSaveError)

    // handle response
    if (response) {
      if (this.state.action === constantText.post) {
        this.updateMarkDoneStatus(true);
        this.updateIsDone(false);
      }
      this.setState((prevState) => {
        return {
          [currentTab.name]: [...newContents, ...prevState[currentTab.name]]
        }
      })
    }
  }

  updateMarkDoneStatus = (flag) => {
    this.setState({ markDoneEnabled: flag })
  }

  updateIsDone = (flag) => {
    this.props.markAsDone(this.props?.selectedTab, flag);
  }

  markDone = async () => {
    if (!this.state.markDoneEnabled) {
      return false;
    }
    this.updateIsDone(true);
  }

  toggleModal = (flag, action, data) => {
    const currentTab = this.state.options[this.state.selectedTab]
    if (!flag) {
      this.setState({ commanModal: null })
      return;
    }
    let properties = null
    if(action == 'removeItem') {
      properties = {
        title: currentTab.deleteTitle,
        btn1Action: () => this.unMapContent(data),
        des: currentTab.deleteModalDescription
      }
    } else {
      return null
    }
    const commanModal = <CommonModel className='popup-wrap status-popup'
      {...properties}
      state
      btn2Action={() => this.toggleModal(false)}
      handleClose={() => this.toggleModal(false)} />
    this.setState({ commanModal })
  }

  searchContent = (ev) => {
    const { value } = ev.target;
    this.setState({ searchText: value });
  }

  optionClickedHandler = (event, selectedTab) => {
    if (selectedTab === this.state.selectedTab) {
      return;
    }
    this.setState({ selectedTab })
  }

  toggleFilterDrawer = () => {

  }

  unMapContent = (data) => {
    let currentSection = this.state.options[this.state.selectedTab];
    this.removeContents(currentSection, data);
    this.toggleModal(false)
  }

  removeContents = async (currentSection, item) => {
    const requestbody = {
      assignedId: item.movieId,
      type: currentSection.type
    }
    const response = await delete_map_content(requestbody, this.state.movieId, this.autoSaveError)
    if (response && response.status === 200) {
      // update state
      this.updateIsDone(false);
      this.setState((prevState) => {
        return {
          [currentSection.name]: prevState[currentSection.name].filter((element) => element.movieId !== item.movieId)
        }
      })
    }
  }

  reArrangeHandler = async (event) => {
    const { status } = this.state;
    if (status === constantText.contentConstants.published) {
      this.setState({ status: constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview) {
      this.setState({ status: constantText.contentConstants.draft })
    }
    if (status ===  constantText.contentConstants.unpublished) {
      this.setState({ status:constantText.contentConstants.draft })
    }
    const { source, destination } = event;
    if (destination === null) {
      return;
    }
    const currentTab = this.state.options[this.state.selectedTab]
    let contentListCopy = JSON.parse(JSON.stringify([...this.state[currentTab.name]]))
    let contentList = [...this.state[currentTab.name]]
    let content = contentList.splice(source.index, 1)
    contentList.splice(destination.index, 0, content[0]);

    // update on server
    const contentData = contentList.map(item => item.movieId);
    this.reArrangeContents(contentListCopy, contentData, currentTab)

    // update state
    this.setState({ [currentTab.name]: contentList })

  }

  reArrangeContents = async (contentList, contentData, currentTab) => {
    const requestBody = {
      type: currentTab.type,
      rearrangeArray: [...contentData]
    }
    const response = await rearrange_map_content(requestBody, this.state.movieId, this.autoSaveError)
    if (response && response.status === 200) {
      this.updateIsDone(false)
    } else {
      this.setState({ [currentTab.name]: contentList })
    }
  }

  unLockedMap = status => {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({ showLockedPopup: !showLockedPopup }), async () => {
      if (status) {
        const res = await Promise.all([
          this.props.unLockedSession(this.props?.selectedTab),
          this.getMappedContent()
        ]);
        if (res && res[1] && res[1].length) { this.populateDataToState(res[1]) }
      }
    })
  }

  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    const { movieId, markDoneEnabled, options, selectedTab, searchText, showLockedPopup, status } = this.state;
    if (!movieId) {
      return null;
    }

    let { currentTabData, isViewMode } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};

    const option = options[selectedTab];
    let list = [...this.state[option.name]];
    const searchDisable = !!list.length;
    if (searchText && searchText.length) {
      list = list.filter(item => String(item.title).toLowerCase().includes(String(searchText).toLowerCase()));
    }
    let { canUpdate } = permissionObj?.movies?.mapContentModule;
    return (
      <React.Fragment>
        {this.state.addingNewContent ?
          <AddContent
            movieId={this.state.movieId}
            added={this.addContentHandler}
            meta={option}
            stage={this.props?.stage?.title}
            closeAddContent={this.closeAddContent}
            assignedData={this.state[option.name]} />
          : <Lock
            lock={isLocked && !isViewMode}
            lockedBy={lockedBy}
            clicked={() => this.unLockedMap(false)}>
            <div className="whitebox mapcontent-block">
              <div className="drag-drop-wrap">
                <div className="ccm-head flex align-items-center justify-content-between">
                  <h4>{constantText.map_content_text}</h4>
                  <div className="status-head flex align-items-center">
                    {status && <BadgeBox className="create-movie-stage" status={status} />}
                    {!isViewMode ?
                      <>
                        <div className="autosave">
                          {constantText.all_fields_auto_save_text}
                        </div>
                        <div
                          onClick={() => (markDoneEnabled && !isDone && !isLocked) ? this.markDone() : {}}
                          disabled={isLocked}
                          className={`mark-done ${isDone ? "mark-active" : markDoneEnabled ? "mark-fill-active" : ""} auto-mark-done`}>
                          <span>
                            <MarkDone />
                          </span>
                          {constantText.mark_as_done_text}
                        </div>
                      </>
                      :
                      <div className="edit-btn">
                        <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                          buttonText={constantText.edit_movie_text}
                          disabled={!canUpdate()}
                          onClick={() => canUpdate() ? this.props.handleRoute(`/movie/edit/${movieId}`) : ""}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className="cr-mov-tab">
                  <LeftTab
                    className="tabs"
                    orientation="horizontal"
                    variant="scrollable"
                    options={[...this.state.options]}
                    selectedTab={this.state.selectedTab}
                    showIcon={false}
                    handleChange={this.optionClickedHandler} />
                </div>
                <AssignedContent
                  isViewMode={isViewMode}
                  list={list}
                  unMapContent={(event, data) => this.toggleModal(true, 'removeItem', data)}
                  reArrangeHandler={this.reArrangeHandler}
                  addContent={this.switchToAddContent}
                  meta={option}
                  toggleFilterDrawer={this.toggleFilterDrawer}
                  onSearch={this.searchContent}
                  searchDisable={searchDisable}
                  searchText={this.state.searchText}
                  isLocked={isLocked} />
              </div>
            </div>
            {this.state.commanModal}
          </Lock>}
        <div className="sidebarBox">
          <Drawer
            open={this.state.showFilterDrawer}
            anchor="right"
            onClose={this.toggleFilterDrawer}>
            {/* <FilterDrawer /> */}
          </Drawer>
        </div>
        <CommonModel className='popup-wrap status-popup' state={showLockedPopup}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={() => this.unLockedMap(true)}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={() => this.unLockedMap(false)}
          handleClose={() => this.unLockedMap(false)}
        />
      </React.Fragment >
    )
  }
}

MapContent.propTypes = {
  contentId: PropTypes.string
};

export default MapContent;