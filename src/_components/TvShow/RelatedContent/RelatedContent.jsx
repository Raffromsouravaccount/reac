import React, { Component, Fragment } from "react";
import Drawer from '@material-ui/core/Drawer';

import DisplayName from "../../Common/DisplayName/DisplayName";
import AddRelatedContent from './AddRelatedContent/AddRelatedContent';
import AssignedAssets from '../../Common/AssignedAssets/AssignedAssets';
import RearrangeContents from "../../Common/RearrangeContents/RearrangeContents";

import Lock from "./../../Common/Locked/Locked";
import LeftTab from './../../Common/LeftTab/CommonLeftTab';
import { CommonModel } from './../../Common/Model/CommonModel';
import Header from './../../Common/HeaderSection/HeaderSection';
import BreadCrumbs from './../../Common/BreadCrumbs/BreadCrumbs';
import { removeAllDynamicAddfields } from './../../Common/CommonFunction/CommonFuntion';

import { breadCrumbs } from './breadCrumbs';
import headerTabs from './../Schema/RelatedContent/HeaderTabs.json';
import displayNameJson from './../Schema/RelatedContent/DisplayName.json';

import Config from "../../../Config/config";

import { apiCalls } from "../../../_services/common.service";

import { getLocalData } from "../../../_helpers/util";
import { permissionObj } from "../../../_helpers/permission";
import { constantText } from './../../../_helpers/constants.text';

import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";

import '../../../../public/css/Common/RelatedContent.css';
import { tvShowBreadcrumbUrls } from "../../../_helpers/history";

const pageSectionName = "related_content";
class RelatedContent extends Component {
  constructor(props) {
    super(props)
    let headerTabsCopy = JSON.parse(JSON.stringify(headerTabs));
    headerTabsCopy = headerTabsCopy.filter(tab => tab.visible);
    this.state = {
      userData: getLocalData("userData"),
      isLocked: false,
      lockedBy: '',
      isDone: false,
      markDoneEnabled: true,
      showFilterDrawer: false,
      commanModal: null,
      adding: false,
      action: constantText.put,
      searchText: '',
      selectedTab: 5,
      options: headerTabsCopy,
      languageArr: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    state.tvShowId = props.match.params.id
    return state
  }

  getRelatedContent = async () => {
    if (!this.state.tvShowId) {
      return;
    }
    const currentTab = this.state.options[this.state.selectedTab];
    //getting existing relatedContent item if exist
    let url = `${Config.tvShow.relatedContent}/${this.state.tvShowId}/${currentTab.name}`;
    if (currentTab.name == "rearrangeContent") {
      url = `${Config.tvShow.relatedRearrangeContent}/${this.state.tvShowId}`;
    } else if (currentTab.name == "displayName") {
      url = `${Config.tvShow.relatedContent}/trailTitle/${this.state.tvShowId}`;
    }
    return await apiCalls(url, "GET", {}, false, true);
  }

  componentDidMount = async () => {
    let currentTab = { ...this.state.options[this.state.selectedTab] }
    const res = await Promise.all([
      this.getRelatedContent(),
      this.getTvShowRelatedContentStatus(),
      this.getAllLanguage()
    ])
    if (res && res[0] && res[0].length) {
      this.populateDataToState(res[0])
      this.updateMarkDoneStatus(true)
    }
    currentTab.fetched = true
    this.updateOption(currentTab)
  }

  getAllLanguage = async () => {
    let response = await apiCalls(`${Config.masterUrl}/Language`, "GET", {}, `/tvshow`, false)
    if (response) { this.setState({ languageArr: response }) }
  }

  componentDidUpdate() {
    let currentTab = { ...this.state.options[this.state.selectedTab] }
    if ((!this.state[currentTab.name] || this.state[currentTab.name].length <= 0) && !currentTab.fetched) {
      this.getRelatedContent()
        .then(relatedContent => {
          if (relatedContent) {
            this.populateDataToState(relatedContent)
          }
        })
        .catch(error => {
        })
      currentTab.fetched = true
      this.updateOption(currentTab)
    }
  }

  autoSaveError = error => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      let stateObj = {},
        optionsCopy = JSON.parse(JSON.stringify(this.state.options));
      optionsCopy.forEach(option => {
        option['fetched'] = false;
        if (this.state[option.name]?.length) {
          stateObj[option.name] = []
        }
      })
      stateObj['options'] = optionsCopy;
      const refreshData = () => {
        this.getTvShowRelatedContentStatus();
        this.setState(stateObj);
      }
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, refreshData);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, 'Error', true, null);
    }
  }

  getTvShowRelatedContentStatus = async () => {
    const { tvShowId, userData } = this.state;
    const response = await apiCalls(`${Config.tvShow.action}/${tvShowId}?section=${pageSectionName}`, "GET");
    if (response && response.length > 0) {
      let { isDone, isLocked, lockedByUser } = response[0];
      const { id, firstName, lastName } = lockedByUser || {};
      isLocked = (isLocked && (id != userData?.userID)) ? true : false;
      const lockedBy = isLocked ? `${firstName} ${lastName}` : ""
      this.setState(prevState => ({ isLocked, isDone, lockedBy }));
    }
  }

  markAsDone = async (isDone) => {
    const { tvShowId, markDoneEnabled } = this.state;
    if (!markDoneEnabled) {
      return false;
    }
    if (isDone) {
      const requestBody = { tvShowId, isDone, sectionName: pageSectionName };
      const response = await this.markAsDoneNLockedAction(requestBody);
      if (response) {
        this.setState(prevState => ({ isDone }));
      }
    } else {
      this.setState(prevState => ({ isDone }));
    }
  }

  unLockedSession = async () => {
    this.toggleModal(false);
    const { tvShowId } = this.state;
    const requestBody = { tvShowId, isLocked: true, sectionName: pageSectionName };
    const response = await Promise.all([
      this.markAsDoneNLockedAction(requestBody),
      this.getRelatedContent()
    ]);
    if (response && response[0]) { this.setState(prevState => ({ isLocked: false })) }
    if (response && response[1] && response[1].length) { this.populateDataToState(response[1]) }
  }

  markAsDoneNLockedAction = async data => {
    const response = await apiCalls(Config.tvShow.action, "POST", data);
    return response;
  }

  updateOption = (updatedOption) => {
    this.setState((prevState) => {
      prevState.options[this.state.selectedTab] = updatedOption
      return {
        options: prevState.options
      }
    })
  }

  populateDataToState = (contentData) => {
    const data = {}
    const currentTab = this.state.options[this.state.selectedTab]
    data[currentTab.name] = contentData || []
    this.setState({ ...data })
  }

  toggleModal = (flag, action, data) => {
    const currentTab = this.state.options[this.state.selectedTab]
    if (!flag) {
      this.setState({ commanModal: null })
      return;
    }
    let properties = null
    switch (action) {
      case 'lock':
        properties = {
          btn1Action: () => this.unLockedSession(),
          des: `${constantText.section_lock_with} ${this.state.lockedBy}, ${constantText.confirm_still_change}`
        }
        break;
      case 'removeItem':
        properties = {
          title: currentTab.deleteTitle,
          btn1Action: () => this.removeContent(data),
          des: currentTab.deleteModalDescription
        }
        break;
      default:
        return null;
    }
    const commanModal = <CommonModel className='popup-wrap status-popup'
      {...properties}
      state
      btn2Action={() => this.toggleModal(false)}
      handleClose={() => this.toggleModal(false)} />
    this.setState({ commanModal })
  }

  switchToAdd = () => {
    if (this.state.isLocked) {
      return;
    }
    this.setState({ adding: true })
  }

  closeAddContent = () => {
    this.setState({ adding: false })
  }

  addDisplayNameHandler = async (newContents) => {
    const currentTab = this.state.options[this.state.selectedTab]
    const requestBody = {
      tvShowId: this.state.tvShowId,
      trailTitles: newContents
    }
    const url = `${Config.tvShow.relatedContent}/trailTitle`;
    const response = await apiCalls(url, "POST", requestBody, false, true, false, this.autoSaveError);
    if (response) {
      this.updateMarkDoneStatus(true)
      this.markAsDone(false)
      this.setState({ [currentTab.name]: response })
    }
  }

  addContentHandler = (newContents) => {
    let currentTab = this.state.options[this.state.selectedTab]
    const contentData = newContents.map(item => item[currentTab.contentIdKey]);
    this.updateRelatedContents(newContents, contentData, currentTab);
  }

  updateRelatedContentRearrangeContent = async (contentList, contentData, currentTab) => {
    let response = false;
    const requestBody = {
      tvShowId: this.state.tvShowId,
      relatedContent: contentData
    }
    const url = `${Config.tvShow.relatedRearrangeContent}`;
    response = await apiCalls(url, "PUT", requestBody, false, true, false, this.autoSaveError);
    // handle response
    if (response) {
      this.updateMarkDoneStatus(true)
      this.markAsDone(false)
    } else {
      this.setState({ [currentTab.name]: contentList })
    }
  }

  updateRelatedContents = async (newContents, contentData, currentTab) => {
    let response = false;
    const assignedContentId = new Set([...contentData]);
    const requestBody = {
      tvShowId: this.state.tvShowId,
      relatedContentType: currentTab.name,
      relatedContentId: [...assignedContentId]
    }
    const url = `${Config.tvShow.relatedContent}`;
    response = await apiCalls(url, "POST", requestBody, false, true, false, this.autoSaveError);
    // handle response
    if (response) {
      const index = this.state.options.findIndex(item => item.name == 'rearrangeContent');
      this.setState((prevState) => {
        if (index >= 0) {
          prevState.options[index]['fetched'] = false
        }
        return {
          options: prevState.options,
          rearrangeContent: [],
          [currentTab.name]: prevState[currentTab.name] ? prevState[currentTab.name].concat(newContents) : newContents
        }
      })
      this.updateMarkDoneStatus(true)
      this.markAsDone(false)
    }
  }

  searchRelatedContent = () => {

  }

  toggleFilterDrawer = () => {

  }


  tabSwitched = (event, selectedTab) => {
    if (selectedTab === this.state.selectedTab) {
      return;
    }
    let stateQuery = { selectedTab };
    if (selectedTab == 0 || selectedTab == 1) {
      let options = this.state.options;
      options[selectedTab].fetched = false;
      stateQuery['options'] = options;
      stateQuery[options[selectedTab].name] = [];
    }
    this.setState(stateQuery);
  }

  updateMarkDoneStatus = (flag) => {
    this.setState({ markDoneEnabled: flag })
  }

  removeContent = (data) => {
    if (this.state.isLocked) {
      return;
    }
    let currentTab = this.state.options[this.state.selectedTab]
    this.removeContentsFromDB(currentTab, data);
    this.toggleModal(false)
  }

  removeContentsFromDB = async (currentTab, item) => {
    const requestbody = {
      relatedId: item[currentTab.contentIdKey],
      relatedContentType: currentTab.name
    }
    const url = `${Config.tvShow.relatedContent}/${this.state.tvShowId}`;
    const response = await apiCalls(url, "DELETE", requestbody, false, true, false, this.autoSaveError);
    if (response && response.length) {
      this.markAsDone(false)
      this.setState((prevState) => {
        return {
          [currentTab.name]: prevState[currentTab.name].filter((element) => element[currentTab.contentIdKey] !== item[currentTab.contentIdKey])
        }
      })
    }
  }

  reArrangeHandler = async (event) => {
    const { source, destination } = event
    if (this.state.isLocked || !destination || source.index == destination.index) {
      return;
    }
    const currentTab = this.state.options[this.state.selectedTab]
    let contentList = [...this.state[currentTab.name]]
    const contentListCopy = JSON.parse(JSON.stringify([...this.state[currentTab.name]]))
    let content = contentList.splice(source.index, 1)
    contentList.splice(destination.index, 0, content[0]);

    // update on server

    if (currentTab.name === 'rearrangeContent') {
      const contentData = contentList.map((item, index) => {
        return {
          relatedContentType: item.relatedContentType,
          newSequence: index + 1
        }
      });
      this.updateRelatedContentRearrangeContent(contentListCopy, contentData, currentTab);
    } else {
      const contentData = contentList.map(item => item[currentTab.contentIdKey]);
      this.reArrangeContents(contentListCopy, contentData, currentTab)
    }

    // update state
    this.setState({ [currentTab.name]: contentList })

  }

  reArrangeContents = async (contentList, contentData, currentTab) => {
    const requestBody = {
      relatedContentType: currentTab.name,
      rearrangeArray: [...contentData]
    }
    const url = `${Config.tvShow.relatedContent}/rearrange/${this.state.tvShowId}`;
    const response = await apiCalls(url, "PATCH", requestBody, false, true, false, this.autoSaveError);
    if (response && response.length) {
      this.markAsDone(false)
    } else {
      this.setState({ [currentTab.name]: contentList })
    }
  }

  titleChangeHandler = (event, index, sectionName) => {
    const { value } = event.target
    const assignedData = [...this.state[sectionName]]
    assignedData[index]['newTitle'] = value
    this.setState({ [sectionName]: assignedData })
  }

  updateChangedTitle = async (event, index, sectionName) => {
    const currentTab = { ...this.state.options[this.state.selectedTab] }
    const content = { ...this.state[sectionName][index] };
    let contentListCopy = JSON.parse(JSON.stringify([...this.state[sectionName]]));
    if (contentListCopy[index].newTitle) { delete contentListCopy[index].newTitle }
    if (!content.newTitle?.length) {
      return;
    }
    const contentData = [{
      relatedContentType: content.relatedContentType,
      newTitle: content.newTitle
    }];
    const response = this.updateRelatedContentRearrangeContent(contentListCopy, contentData, currentTab);
    if (response) {
      this.setState(prevState => {
        prevState[sectionName][index].title = content.newTitle;
        delete prevState[sectionName][index].newTitle;
        return {
          [sectionName]: prevState[sectionName]
        }
      })
    }
  }

  renderAssignedContents = (canUpdate) => {
    const option = this.state.options[this.state.selectedTab];
    const assignedData = this.state[option.name] || [];
    const searchDisable = false, searchText = "";
    switch (option.name) {
      case 'movies':
      case 'collections':
      case 'videos':
      case 'tvShows':
      case 'seasons':
      case 'episodes': 
        return (
          <AssignedAssets
            languageArr={this.state.languageArr}
            showHeader={false}
            contentIdKey={option.contentIdKey}
            assignedData={[...assignedData]}
            removeAsset={(event, data) => this.toggleModal(true, 'removeItem', data)}
            addAssets={this.switchToAddAsset}
            onSearch={this.searchAssets}
            searchDisable={searchDisable}
            searchText={searchText}
            reArrangeHandler={this.reArrangeHandler}
            meta={option}
            isLocked={this.state.isLocked || !canUpdate} />)

      case 'rearrangeContent':
        return (
          <RearrangeContents
            inputDisabled={this.state?.isLocked}
            assignedData={[...assignedData]}
            reArrangeHandler={this.reArrangeHandler}
            meta={option}
            titleChanged={this.titleChangeHandler}
            updateChangedTitle={this.updateChangedTitle}
          />)

      case 'displayName':
        return (
          <DisplayName
            jsonFields={displayNameJson}
            assignedData={[...assignedData]}
            meta={option}
            saveDisplayName={this.addDisplayNameHandler}
          />
        )
      default:
        return null
    }
  }

  renderAddContent = () => {
    const option = this.state.options[this.state.selectedTab]
    const assignedData = this.state[option.name] || []
    switch (option.name) {
      case 'movies':
      case 'collections':
      case 'videos':
      case 'tvShows':
      case 'seasons':
      case 'episodes': 
        return (
          <AddRelatedContent
            tvShowId={this.state.tvShowId}
            languageArr={this.state.languageArr}
            contentIdKey={option.contentIdKey}
            added={this.addContentHandler}
            meta={option}
            closeAddAsset={this.closeAddContent}
            assignedData={[...assignedData]} />)
      default:
        return null
    }
  }

  goBack = () => {
    this.props.history.goBack();
  }

  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    const { tvShowId, isDone, markDoneEnabled, options, adding, isLocked, lockedBy, commanModal, showFilterDrawer } = this.state;
    const permission = permissionObj.tvShows.relatedContent;
    const {location} = this.props;
    // validate tvShowId
    if (!tvShowId) {
      return null;
    }
    const selectedTab = options[this.state.selectedTab];
    const { tvShowUrl } = tvShowBreadcrumbUrls(location);
    return (
      <Fragment>
        <div className="d-wrap c-n">
          <BreadCrumbs className="" links={breadCrumbs.links(tvShowUrl, tvShowId)}
            typography={breadCrumbs.typography} journeyType={location?.state?.journeyType}/>
          {adding ?
            this.renderAddContent() :
            <div>
              <Header
                {...selectedTab}
                goBack={this.goBack}
                title={constantText.related_content_text}
                showInputField={false}
                showFilterButton={false}
                filterClicked={this.toggleFilterDrawer}
                markDoneClicked={() => (markDoneEnabled && !isDone && !isLocked && permission.canUpdate()) ? this.markAsDone(true) : {}}
                markDoneClasses={`mark-done ${isDone ? "mark-active" : markDoneEnabled ? "mark-fill-active" : ""} auto-mark-done`}
                markDoneDisabled={isLocked || !permission.canUpdate()}
                addButtonClicked={this.switchToAdd}
                addButtonDisabled={isLocked || !permission.canUpdate()} />
              <Lock
                lock={isLocked}
                lockedBy={lockedBy}
                clicked={() => this.toggleModal(true, 'lock')}>
                <div >
                  <div className="cr-mov-tab ralated-tabs">
                    <LeftTab
                      className="tabs"
                      orientation="horizontal"
                      variant="scrollable"
                      options={[...options]}
                      selectedTab={this.state.selectedTab}
                      showIcon={false}
                      handleChange={this.tabSwitched} />
                  </div>
                  {this.renderAssignedContents(permission.canUpdate())}
                </div>
                {commanModal}
              </Lock>
            </div>}
        </div>
        <div className="sidebarBox">
          <Drawer
            open={showFilterDrawer}
            anchor="right"
            onClose={this.toggleFilterDrawer}>
            {/* <FilterDrawer /> */}
          </Drawer>
        </div>
      </Fragment >
    )
  }
}

export default RelatedContent;