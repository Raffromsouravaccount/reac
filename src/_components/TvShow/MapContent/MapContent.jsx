import React, { Component } from "react";
import Drawer from '@material-ui/core/Drawer';

//SubComponents
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

import { apiCalls } from "../../../_services/common.service";


// Config
import Config from '../../../Config/config';



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
      searchText: '',
      selectedTab: 0, showLockedPopup: false,
      options: JSON.parse(JSON.stringify(jsonData)),
      status: null,
    }
  }

  fetchContentData = async () => {
    let { tvShowId } = this.state;
    let response = await apiCalls(`${Config.tvShowProperties}/${tvShowId}`, "GET", {});
    if (response) {
      this.setState({status: response?.contentState?.title})
    }
  };

  static getDerivedStateFromProps(props, state) {
    state.tvShowId = props.contentId
    return state
  }

  getMappedContent = async () => {
    if (!this.state.tvShowId) {
      return;
    }
    //getting existing mapContent item if exist
    const url = `${Config.tvShow.mapContent}/${this.state.tvShowId}`;
    return await apiCalls( url, "GET", {}, null, false, false, this.props.autoSaveError );
  }

  componentDidMount() {
    this.fetchContentData();
    const currentTab = { ...this.state.options[this.state.selectedTab] }
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


  componentDidUpdate() {
    const currentTab = { ...this.state.options[this.state.selectedTab] }
    if (this.state[currentTab.name]?.length <= 0 && !currentTab.fetched) {
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
    optionsCopy?.forEach(option => {
      option['fetched'] = false;
      this.state[option.name]?.length ? stateObj[option.name] = [] : "";
    })
    stateObj['options'] = optionsCopy;
    this.setState(stateObj);
    this.props.autoSaveError(res);
  }

  updateOption = (updatedOption) => {
    this.setState((prevState) => {
      const options = prevState?.options?.map(option => {
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
    data[currentTab?.name] = contentData || []
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
    const {status} = this.state;
    if (status === constantText.contentConstants.published){
      this.setState({ status:constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview){
      this.setState({ status:constantText.contentConstants.draft })
    }
    let currentTab = this.state.options[this.state.selectedTab];
    const contentData = newContents?.map(item => item = item.tvShowId);
    this.updateMapContents(newContents, contentData, currentTab);
  }

  updateMapContents = async (newContents, contentData, currentTab) => {
    let response = false;
    const assignedContentId = new Set([...contentData]);
    const requestBody = {
      tvShowId: this.state.tvShowId,
      assignedContentId: [...assignedContentId]
    }
    const url = `${Config.tvShow.mapContent}`;
    response = await apiCalls( url,"POST",requestBody, null, false, false, this.props.autoSaveError );

    // handle response
    if (response) {
      if (this.state.action === constantText.post) {
        this.updateMarkDoneStatus(true);
        this.updateIsDone(false);
      }
      this.setState((prevState) => {
        return {
          [currentTab.name]: prevState[currentTab.name].concat(newContents)
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
    if(!this.state.markDoneEnabled) {
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
    if (action == "removeItem") {
      properties = {
        title: currentTab.deleteTitle,
        btn1Action: () => this.unMapContent(data),
        des: currentTab.deleteModalDescription
      }
    } else {
      return null;
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
    const requestBody = {
      assignedId: item.tvShowId
    }
    const url = `${Config.tvShow.mapContent}/${this.state.tvShowId}`;
    const response = await apiCalls( url, "DELETE", requestBody, null, false, false, this.props.autoSaveError );
    if (response && response.status === 200) {
      // update state
      this.updateIsDone(false);
      this.setState((prevState) => {
        return {
          [currentSection.name]: prevState[currentSection.name].filter((element) => element.tvShowId !== item.tvShowId)
        }
      })
    }
  }

  reArrangeHandler = async (event) => {
    const {status} = this.state;
    if (status === constantText.contentConstants.published){
      this.setState({ status:constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview){
      this.setState({ status:constantText.contentConstants.draft })
    }
    const { source, destination } = event;
    if(destination === null) {
      return;
    }
    const currentTab = this.state.options[this.state.selectedTab]
    let contentListCopy = JSON.parse(JSON.stringify([...this.state[currentTab.name]]))
    let contentList = [...this.state[currentTab.name]]
    let content = contentList.splice(source.index, 1)
    contentList.splice(destination.index, 0, content[0]);

    // update on server
    const contentData = contentList.map(item => item = item.tvShowId);
    this.reArrangeContents(contentListCopy, contentData, currentTab)

    // update state
    this.setState({ [currentTab.name]: contentList })

  }

  reArrangeContents = async (contentList, contentData, currentTab) => {
    const requestBody = {
      rearrangeArray: [...contentData]
    }
    const url = `${Config.tvShow.mapContentRearrange}/${this.state.tvShowId}`;
    const response = await apiCalls( url,"PATCH",requestBody, null, false, false, this.props.autoSaveError );
    if (response && response.status === 200) {
      this.updateIsDone(false)
    } else {
      this.setState({ [currentTab.name]: contentList })
    }
  }

  unLockedMap= status=> {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({ showLockedPopup: !showLockedPopup }), async () => {
      if (status) {
        const res = await Promise.all([
          this.props.unLockedSession(this.props?.selectedTab),
          this.getMappedContent()
        ]);
        if(res && res[1] && res[1].length) this.populateDataToState(res[1])
      }
    })
  }

  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    const { tvShowId, markDoneEnabled, options, selectedTab, searchText, showLockedPopup, status } = this.state;
    if (!tvShowId) {
      return null;
    }

    let { currentTabData, isViewMode, stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};

    const option = options[selectedTab];
    let list = [...this.state[option.name]];
    const searchDisable = !!list.length;
    if (searchText && searchText.length) {
      list = list.filter(item => String(item.title).toLowerCase().includes(String(searchText).toLowerCase()));
    }
    let { canUpdate }= permissionObj?.tvShows?.mapContentModule;
    return (
      <React.Fragment>
        {this.state.addingNewContent ?
          <AddContent
            tvShowId={this.state.tvShowId}
            added={this.addContentHandler}
            meta={option}
            stage={status}
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
                    {status && <BadgeBox className="create-movie-stage" status={status}  />}
                    {!isViewMode ?
                      <>
                        <div className="autosave">
                          {constantText.all_fields_auto_save_text}
                        </div>
                        <div
                          onClick={()=> (markDoneEnabled && !isDone && !isLocked)? this.markDone(): {}}
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
                          buttonText={constantText.tv_show_text.edit}
                          disabled={!canUpdate()}
                          onClick={() => canUpdate()? this.props.handleRoute(`${Config.tvShow.edit}/${tvShowId}`): ""}
                        />
                      </div>
                    }
                  </div>
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
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={()=> this.unLockedMap(true)}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={()=> this.unLockedMap(false)}
          handleClose={()=> this.unLockedMap(false)}
        />
      </React.Fragment >
    )
  }
}



export default MapContent;
