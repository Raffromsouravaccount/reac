import React from 'react';
import { shallow } from 'enzyme';
import { storeFactory } from '../../../../Utils';

import CollectionAssignment from '../../../../_components/CreateMovie/CollectionAssignment/CollectionAssignment';
import * as commonService from '../../../../_services/common.service';
import * as movieService from '../../../../_services//movie.service';
import { constantText } from '../../../../_helpers/constants.text';

const option = {
  "addPageTitle": "Add Collections",
  "assignedText": "Assigned Collections",
  "availableText": "Available Collections",
  "contentIdKey": "id",
  "deleteModalDescription": "Do you want to remove this collection from the assigned listing?",
  "deleteTitle": "Delete Collection",
  "itemButtonText": "Assign to Collection",
  "label": "Collection Assignment",
  "name": "collections",
  "noItemsText": "No collection have been assigned",
  "searchPlaceholder": "Search Via Collections",
  "selectedItemsButtonText": "Assign to Collections",
  "selectedItemsTitle": "Assign Collections",
  "showAddButton": true,
  "showFilterButton": true,
  "showFilterButtonListing": false,
  "showInputField": true,
  "showInputFieldListing": false,
  "showMarkDone": true
}
const contentId = 'ffaec43c-7e63-42a6-86ea-5b4104f5c6a3';
const initialState = {
  movieMgmt_reducer: {}
}
const setup = (initialstate = {}, props = { match: { params: { id: contentId } } }) => {
  const store = storeFactory(initialstate);
  const wrapper = shallow(<CollectionAssignment store={store} {...props} />).dive();
  return wrapper;
}
describe('render', () => {
  let wrapper;
  beforeEach(() => {
    movieService.post_collection_assignment = jest.fn().mockReturnValue([{}])
    movieService.delete_collection_assignment = jest.fn().mockReturnValue({ status: 200 })
    movieService.get_collection_assignment = jest.fn().mockReturnValue([{}])
    movieService.rearrange_collection_assignment = jest.fn().mockReturnValue({ status: 200 })
    commonService.apiCalls = jest.fn().mockReturnValue([{}])
    wrapper = setup(initialState).dive();
    wrapper.setState({ adding: false })
  });
  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })
  it('should test goBack', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'goBack');
    testComp.goBack();
    expect(testComp.goBack).toHaveBeenCalledTimes(1);
  })
  it('should test renderAssignedContents', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    testComp.setState({ option })
    jest.spyOn(testComp, 'renderAssignedContents');
    testComp.renderAssignedContents();
    expect(testComp.renderAssignedContents).toHaveBeenCalledTimes(1);
  })
  it('should test renderAddContent', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'renderAddContent');
    testComp.renderAddContent();
    expect(testComp.renderAddContent).toHaveBeenCalledTimes(1);
  })
  it('should test componentWillUnmount', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'componentWillUnmount');
    testComp.componentWillUnmount();
    expect(testComp.componentWillUnmount).toHaveBeenCalledTimes(1);
  })
  it('should test getAssignedCollections', () => {
    jest.spyOn(wrapper.instance(), 'getAssignedCollections');
    wrapper.instance().getAssignedCollections();
    expect(wrapper.instance().getAssignedCollections).toHaveBeenCalledTimes(1);
  })
  it('should test autoSaveError', () => {
    jest.spyOn(wrapper.instance(), 'autoSaveError');
    wrapper.instance().autoSaveError({ data: { message: constantText.locked_by_another_text } });
    expect(wrapper.instance().autoSaveError).toHaveBeenCalledTimes(1);
  })
  it('should test autoSaveError else condition', () => {
    jest.spyOn(wrapper.instance(), 'autoSaveError');
    wrapper.instance().autoSaveError();
    expect(wrapper.instance().autoSaveError).toHaveBeenCalledTimes(1);
  })
  it('should test getMovieCollectionAssignmentStatus', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    testComp.setState({ contentId: contentId, userID: '123' })
    jest.spyOn(testComp, 'getMovieCollectionAssignmentStatus');
    testComp.getMovieCollectionAssignmentStatus();
    expect(testComp.getMovieCollectionAssignmentStatus).toHaveBeenCalledTimes(1);
  })
  it('should test markAsDone', () => {
    wrapper.setState({ markDoneEnabled: false })
    jest.spyOn(wrapper.instance(), 'markAsDone');
    wrapper.instance().markAsDone();
    expect(wrapper.instance().markAsDone).toBeCalled();
  })
  it('should test markAsDone false', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    testComp.setState({ contentId: contentId, markDoneEnabled: true })
    jest.spyOn(testComp, 'markAsDone');
    jest.spyOn(testComp, 'markAsDoneNLockedAction');
    testComp.markAsDone(true);
    expect(testComp.markAsDone).toHaveBeenCalledTimes(1);
    expect(testComp.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
  })
  it('should test unLockedSession', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    testComp.setState({ contentId: contentId })
    jest.spyOn(testComp, 'unLockedSession');
    testComp.unLockedSession();
    expect(testComp.unLockedSession).toHaveBeenCalledTimes(1);
  })
  it('should test populateDataToState', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    testComp.setState({ option: option })
    jest.spyOn(testComp, 'populateDataToState');
    testComp.populateDataToState();
    expect(testComp.populateDataToState).toHaveBeenCalledTimes(1);
  })
  it('should test closeAddCollection', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'closeAddCollection');
    testComp.closeAddCollection();
    expect(testComp.closeAddCollection).toHaveBeenCalledTimes(1);
  })
  it('should test updateMarkDoneStatus', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'updateMarkDoneStatus');
    testComp.updateMarkDoneStatus(true);
    expect(testComp.updateMarkDoneStatus).toHaveBeenCalledTimes(1);
  })
  it('should test updateIsDone', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'updateIsDone');
    testComp.updateIsDone(true);
    expect(testComp.updateIsDone).toHaveBeenCalledTimes(1);
  })
  it('should test reArrangeContents', () => {
    const output = setup(initialState);
    const testComp = output.dive().instance();
    jest.spyOn(testComp, 'reArrangeContents');
    testComp.reArrangeContents();
    expect(testComp.reArrangeContents).toHaveBeenCalledTimes(1);
  })
  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })
  it('should test toggleModal for lock', () => {
    wrapper.setState({ option: option })
    jest.spyOn(wrapper.instance(), 'toggleModal');
    wrapper.instance().toggleModal(true, 'removeItem', {});
    expect(wrapper.instance().toggleModal).toBeCalled();
  })
  it('should test toggleModal', () => {
    wrapper.setState({ option: option })
    jest.spyOn(wrapper.instance(), 'toggleModal');
    wrapper.instance().toggleModal(true, 'lock', {});
    expect(wrapper.instance().toggleModal).toBeCalled();
  })
  it('should test addContentHandler', () => {
    const newContents = [{
      CollectionAsset: null, CollectionImages: [], contentState: { title: "Draft" }, externalId: "1-3-1000697", id: "301f2d60-5f22-4d4a-af27-0c47b1d5fed7",
      lastModifiedByUser: { first_name: "Sandeep", last_name: "Kumar" }, lastModifiedOn: "2021-02-15T13:07:21.621Z", note: null, title: "No Title",
    }]
    wrapper.setState({ option: option })
    jest.spyOn(wrapper.instance(), 'addContentHandler');
    wrapper.instance().addContentHandler(newContents);
    expect(wrapper.instance().addContentHandler).toBeCalled();
  })
  it('should test removeCollection', () => {
    wrapper.setState({ isLocked: true })
    jest.spyOn(wrapper.instance(), 'removeCollection');
    wrapper.instance().removeCollection();
    expect(wrapper.instance().removeCollection).toBeCalled();
  })
  it('should test removeCollection else condition', () => {
    jest.spyOn(wrapper.instance(), 'removeCollection');
    wrapper.instance().removeCollection();
    expect(wrapper.instance().removeCollection).toBeCalled();
  })
  it('should test reArrangeHandler when locked', () => {
    const testComp = wrapper.instance();
    testComp.setState({ option, isLocked: true })
    jest.spyOn(testComp, 'reArrangeHandler');
    testComp.reArrangeHandler({ source: { index: 0 }, destination: { index: 1 } });
    expect(testComp.reArrangeHandler).toHaveBeenCalledTimes(1);
  })
  it('should test reArrangeHandler when not locked', () => {
    const testComp = wrapper.instance();
    testComp.setState({ option, isLocked: false })
    jest.spyOn(testComp, 'reArrangeHandler');
    testComp.reArrangeHandler({ source: { index: 0 }, destination: { index: 1 } });
    expect(testComp.reArrangeHandler).toHaveBeenCalledTimes(1);
  })
  it('should test switchToAddCollection', () => {
    wrapper.setState({ isLocked: true })
    jest.spyOn(wrapper.instance(), 'switchToAddCollection');
    wrapper.instance().switchToAddCollection();
    expect(wrapper.instance().switchToAddCollection).toHaveBeenCalledTimes(1);
  })
  it('should test switchToAddCollection else condition', () => {
    jest.spyOn(wrapper.instance(), 'switchToAddCollection');
    wrapper.instance().switchToAddCollection();
    expect(wrapper.instance().switchToAddCollection).toHaveBeenCalledTimes(1);
  })
  it('should test removeCollectionsFromDB', () => {
    const testComp = wrapper.instance();
    testComp.setState({ contentId: contentId })
    jest.spyOn(testComp, 'removeCollectionsFromDB');
    testComp.removeCollectionsFromDB(option, { id: "" });
    expect(testComp.removeCollectionsFromDB).toHaveBeenCalledTimes(1);
  })
})