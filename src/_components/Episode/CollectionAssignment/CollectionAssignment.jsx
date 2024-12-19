import React, { Component, Fragment } from "react";
import Drawer from '@material-ui/core/Drawer';

import AssignedAssets from "../../Common/AssignedAssets/AssignedAssets";
import AddCollections from './AddCollections/AddCollections'

import Header from '../../Common/HeaderSection/HeaderSection'
import Lock from "../../Common/Locked/Locked";
import { CommonModel } from '../../Common/Model/CommonModel';
import { removeAllDynamicAddfields } from '../../Common/CommonFunction/CommonFuntion';
import BreadCrumbs from '../../Common/BreadCrumbs/BreadCrumbs';

import { breadCrumbs } from './breadCrumbs';
import { constantText } from '../../../_helpers/constants.text';
import { getLocalData } from '../../../_helpers/util';

import '../../../../public/css/Common/CollectionAssignment.css';

import headerTab from "../Schema/CollectionAssignment/HeaderTab.json";
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import { showSuccessErrorMsg } from "../../../_actions/alertMessages.action";
import { permissionObj } from "../../../_helpers/permission";
import { episodeBreadcrumbUrls } from "../../../_helpers/history";

const pageSectionName = "collection_assignment";
class CollectionAssignment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userID: getLocalData("userData")?.userID || "",
      isLocked: false,
      lockedBy: '',
      isDone: false,
      markDoneEnabled: true,
      showFilterDrawer: false,
      commanModal: null,
      adding: false,
      searchText: '',
      option: JSON.parse(JSON.stringify(headerTab))
    }
  }

  static getDerivedStateFromProps(props, state) {
    state.contentId = props.match.params.episodeId
    return state
  }

  getAssignedCollections = async () => {
    if (!(this.state.contentId)) { return; }
    const url = `${Config.episode.collectionAssignment}/${this.state.contentId}`;
    return await apiCalls(url, "GET", {}, false, true);
  }

  componentDidMount = async () => {
    const res = await Promise.all([
      this.getAssignedCollections(),
      this.getEpisodeCollectionAssignmentStatus()
    ])
    if (res && res[0] && res[0].length) {
      this.populateDataToState(res[0])
      this.updateMarkDoneStatus(true)
    }
  }

  autoSaveError = error => {
    if (error?.data?.message == constantText.locked_by_another_text) {
      const refreshData = () => {
        this.componentDidMount();
      }
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, refreshData);
    } else {
      showSuccessErrorMsg(error?.data?.message, null, 'Error', true, null);
    }
  }

  getEpisodeCollectionAssignmentStatus = async () => {
    const { contentId, userID } = this.state;
    const response = await apiCalls(`${Config.episode.action}/${contentId}?section=${pageSectionName}`, "GET");
    if (response && response.length > 0) {
      let { isDone, isLocked, lockedByUser } = response[0];
      const { id, firstName, lastName } = lockedByUser || {};
      isLocked = (isLocked && (id != userID)) ? true : false;
      const lockedBy = isLocked ? `${firstName} ${lastName}` : ""
      this.setState(prevState => ({ isLocked, isDone, lockedBy }));
    }
  }

  markAsDone = async (isDone) => {
    const { contentId, markDoneEnabled } = this.state;
    if (!markDoneEnabled) {
      return false;
    }
    if (isDone) {
      const requestBody = { episodeId: contentId, isDone, sectionName: pageSectionName };
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
    const { contentId } = this.state;
    const requestBody = { episodeId: contentId, isLocked: true, sectionName: pageSectionName };
    const response = await Promise.all([
      this.markAsDoneNLockedAction(requestBody),
      this.getAssignedCollections()
    ]);
    if (response && response[0]) { this.setState(prevState => ({ isLocked: false })) }
    if (response && response[1] && response[1].length) { this.populateDataToState(response[1]) }
  }

  markAsDoneNLockedAction = async data => {
    const response = await apiCalls(Config.episode.action, "POST", data);
    return response;
  }

  populateDataToState = (contentData) => {
    const option = this.state.option
    const data = {};
    data[option.name] = contentData || [];
    this.setState({ ...data })
  }

  toggleModal = (flag, action, data) => {
    if (!flag) {
      this.setState({ commanModal: null })
      return;
    }
    let option = this.state.option
    let properties = null
    switch (action) {
      case 'lock':
        properties = {
          btn1Action: () => this.unLockedSession(true),
          des: `${constantText.section_lock_with} ${this.state.lockedBy}, ${constantText.confirm_still_change}`
        }
        break;
      case 'removeItem':
        properties = {
          title: option.deleteTitle,
          btn1Action: () => this.removeCollection(data),
          des: option.deleteModalDescription
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

  switchToAddCollection = () => {
    if (this.state.isLocked) {
      return;
    }
    this.setState({ adding: true })
  }

  closeAddCollection = () => {
    this.setState({ adding: false })
  }

  addContentHandler = (newContents) => {
    let currentTab = this.state.option;
    const contentData = newContents.map(item => item[currentTab.contentIdKey]);
    this.updateCollections(newContents, contentData, currentTab);
  }

  updateCollections = async (newContents, contentData, currentTab) => {
    let response = false;
    const assignedContentId = new Set([...contentData]);
    const requestBody = {
      assignId: [...assignedContentId]
    }
    const url = `${Config.episode.collectionAssignment}/${this.state.contentId}`
    response = await apiCalls(url, "POST", requestBody, false, true, false, this.autoSaveError);
    if (response) {
      this.markAsDone(false);
      this.updateMarkDoneStatus(true);
      this.setState((prevState) => {
        const data = prevState[currentTab.name] ? prevState[currentTab.name].concat(newContents) : newContents;
        return { [currentTab.name]: data };
      })
    }
  }

  updateMarkDoneStatus = (flag) => {
    this.setState({ markDoneEnabled: flag })
  }

  updateIsDone = (flag) => {
    this.setState({ isDone: flag })
  }

  searchCollections = () => {

  }

  toggleFilterDrawer = () => {

  }

  removeCollection = (data) => {
    if (this.state.isLocked) {
      return;
    }
    this.removeCollectionsFromDB(this.state.option, data);
    this.toggleModal(false)
  }

  removeCollectionsFromDB = async (currentTab, item) => {
    let response = false;
    const url = `${Config.episode.collectionAssignment}/${this.state.contentId}?collectionId=${item[currentTab.contentIdKey]}`;
    response = await apiCalls(url, "DELETE", {}, false, true, true, this.autoSaveError);
    if (response && response.length) {
      this.markAsDone(false);
      this.setState((prevState) => {
        const data = prevState[currentTab.name].filter((element) => element[currentTab.contentIdKey] !== item[currentTab.contentIdKey]);
        return { [currentTab.name]: data };
      })
    }
  }

  reArrangeHandler = async (event) => {
    const { source, destination } = event
    if (this.state.isLocked || !destination || source.index == destination.index) {
      return;
    }
    const currentTab = this.state.option;
    let contentList = [...this.state[currentTab.name]];
    const contentListCopy = JSON.parse(JSON.stringify([...this.state[currentTab.name]]))
    const content = contentList.splice(source.index, 1);
    contentList.splice(destination.index, 0, content[0]);

    const contentData = contentList.map(item => item[currentTab.contentIdKey]);
    this.reArrangeContents(contentListCopy, contentData, currentTab);

    this.setState({ [currentTab.name]: contentList });
  }

  reArrangeContents = async (contentList, contentData, currentTab) => {
    const requestBody = {
      relatedContentType: currentTab.name,
      rearrangeArray: [...contentData]
    }
    const url = `${Config.episode.collectionAssignment}/${this.state.contentId}`;
    const response = await apiCalls(url, "PATCH", requestBody, false, true, true, this.autoSaveError);
    if (response) {
      this.markAsDone(false)
    } else {
      this.setState({ [currentTab.name]: contentList })
    }
  }

  renderAssignedContents = (canUpdate) => {
    const option = { ...this.state.option }
    const assignedData = this.state[option.name] || []
    return (
      <AssignedAssets
        hideDraggable={true}
        showHeader={false}
        contentIdKey={option.contentIdKey}
        assignedData={[...assignedData]}
        removeAsset={(event, data) => this.toggleModal(true, 'removeItem', data)}
        meta={option}
        isLocked={this.state.isLocked || !canUpdate} />
    )
  }

  renderAddContent = () => {
    const option = this.state.option
    const assignedData = this.state[option.name] || []
    return (
      <AddCollections
        contentIdKey={option.contentIdKey}
        added={this.addContentHandler}
        contentId={this.state.contentId}
        meta={option}
        closeAddAsset={this.closeAddCollection}
        assignedData={[...assignedData]} />)
  }

  goBack = () => {
    this.props.history.goBack();
  }

  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    const {
      contentId,
      isDone,
      markDoneEnabled,
      option,
      adding,
      isLocked,
      lockedBy,
      commanModal,
      showFilterDrawer
    } = this.state;
    const permission = permissionObj.episode.collectionAssignment;

    if (!contentId) {
      return null;
    }
    const { location, match } = this.props
    let { tvShowUrl, seasonUrl, episodeUrl } = episodeBreadcrumbUrls(location)
    return (
      <Fragment>
        <div className="d-wrap c-n">
          <BreadCrumbs className="" links={breadCrumbs.links(tvShowUrl, seasonUrl, episodeUrl, match.params.id, match.params.seasonId, contentId)}
            typography={breadCrumbs.typography} />
          {adding ?
            this.renderAddContent()
            :
            <div className="collection-assign-block  collection-assign-block-content">
              <Header
                {...option}
                showInputField={option.showInputFieldListing}
                showFilterButton={option.showFilterButtonListing}
                goBack={this.goBack}
                title={constantText.collection_assignment_text}
                filterClicked={this.toggleFilterDrawer}
                markDoneClicked={() => (markDoneEnabled && !isDone && !isLocked && permission.canUpdate()) ? this.markAsDone(true) : {}}
                markDoneClasses={`mark-done ${isDone ? "mark-active" : markDoneEnabled ? "mark-fill-active" : ""}`}
                markDoneDisabled={isLocked || !permission.canUpdate()}
                addButtonText={option.selectedItemsButtonText}
                addButtonClicked={this.switchToAddCollection}
                addButtonDisabled={isLocked || !permission.canUpdate()} />
              <div className="collection-heading">
                <strong>{option.assignedText}</strong>
              </div>
              <Lock
                lock={isLocked}
                lockedBy={lockedBy}
                clicked={() => this.toggleModal(true, 'lock')}>
                <div >
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

export default CollectionAssignment;