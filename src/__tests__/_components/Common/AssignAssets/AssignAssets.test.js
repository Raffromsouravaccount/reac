import React from 'react';
import { shallow } from 'enzyme';

import AssignAssets from '../../../../_components/Common/AssignAssets/AssignAssets';

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
    contentIdKey: option.contentIdKey,
    added: () => { },
    contentId: contentId,
    meta: option,
    closeAddAsset: () => { },
    assignedData: [{
        "id": "178023ab-8286-4243-bb3a-5fe579abf31b",
        "externalId": "1-3-1000109",
        "title": "No Title",
        "note": null,
        "shortDescription": null,
        "description": null,
        "longDescription": null,
        "subtype": "4117cc68-49f5-11eb-b378-0242ac130002",
        "autoPlay": false,
        "tags": null,
        "languages": null,
        "contentCategoryId": null,
        "contentStateId": "3bb64421-f15f-4dda-adec-03c324c140a3",
        "createdBy": "c4c935ab-a2a0-44ad-80e9-743aad654dcd",
        "modifiedBy": "c4c935ab-a2a0-44ad-80e9-743aad654dcd",
        "status": "1",
        "lastModifiedBy": "c4c935ab-a2a0-44ad-80e9-743aad654dcd",
        "lastModifiedOn": "2021-01-14T11:25:19.770Z",
        "_created_on": "2021-01-14T09:53:36.408Z",
        "_modified_on": "2021-01-14T11:25:19.770Z",
        "_created_by": "c4c935ab-a2a0-44ad-80e9-743aad654dcd",
        "_modified_by": "c4c935ab-a2a0-44ad-80e9-743aad654dcd",
        "last_modified_by": "c4c935ab-a2a0-44ad-80e9-743aad654dcd",
        "content_state_id": "3bb64421-f15f-4dda-adec-03c324c140a3",
        "content_category_id": null,
        "contentCategory": null,
        "created_by": { "firstName": "Pawan", "lastName": "Kumar" },
        "modified_by": { "firstName": "Pawan", "lastName": "Kumar" },
        "contentState": { "title": "Draft" }
    }],
    moviesList: { data: [], count: 0 },
    collectionList: { data: [], count: 0 }
}

const baseProps = {
    getCollectionList: jest.fn()
}

const setup = (props = initialState, state = null) => {
    const wrapper = shallow(<AssignAssets {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<AssignAssets />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })
    it('Should renders AssignAssets default', () => {
        expect(wrapper.exists()).toBe(true);
    })
    it('should test UNSAFE_componentWillReceiveProps', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'UNSAFE_componentWillReceiveProps');
        testComp.UNSAFE_componentWillReceiveProps(initialState, testComp.state || {});
        expect(testComp.UNSAFE_componentWillReceiveProps).toHaveBeenCalledTimes(1);
    })
    it('should test UNSAFE_componentWillReceiveProps for movies', () => {
        let initialStateCopy = { ...initialState };
        initialStateCopy.meta.name = 'movies';
        const testComp = setup(initialStateCopy, null).instance();
        jest.spyOn(testComp, 'UNSAFE_componentWillReceiveProps');
        testComp.UNSAFE_componentWillReceiveProps(initialState, testComp.state || {});
        expect(testComp.UNSAFE_componentWillReceiveProps).toHaveBeenCalledTimes(1);
    })
    it('should test componentDidMount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentDidMount');
        testComp.componentDidMount();
        expect(testComp.componentDidMount).toHaveBeenCalledTimes(1);
    })
    it('should test getFilterJson', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getFilterJson');
        testComp.getFilterJson();
        expect(testComp.getFilterJson).toHaveBeenCalledTimes(1);
    })
    it('should test getStatusTypesCount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getStatusTypesCount');
        testComp.getStatusTypesCount([]);
        expect(testComp.getStatusTypesCount).toHaveBeenCalledTimes(1);
    })
    it('should test getContentList', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getContentList');
        testComp.getContentList();
        expect(testComp.getContentList).toHaveBeenCalledTimes(1);
    })
    it('should test getQueryData', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getQueryData');
        testComp.getQueryData();
        expect(testComp.getQueryData).toHaveBeenCalledTimes(1);
    })
    it('should test nextCall', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'nextCall');
        testComp.nextCall(1);
        expect(testComp.nextCall).toHaveBeenCalledTimes(1);
    })
    it('should test processContentList', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'processContentList');
        testComp.processContentList();
        expect(testComp.processContentList).toHaveBeenCalledTimes(1);
    })
    it('should test toggleFilterDrawer', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleFilterDrawer');
        testComp.toggleFilterDrawer();
        expect(testComp.toggleFilterDrawer).toHaveBeenCalledTimes(1);
    })
    it('should test applyFilter', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'applyFilter');
        testComp.applyFilter({ formValidity: true, filterByStatus: [{ active: true }], filterByDate: [], selectFilters: [] });
        expect(testComp.applyFilter).toHaveBeenCalledTimes(1);
    })
    it('should test applyFilter clear', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'applyFilter');
        testComp.applyFilter({ formValidity: true, filterByStatus: [], filterByDate: [], selectFilters: [] }, true);
        expect(testComp.applyFilter).toHaveBeenCalledTimes(1);
    })
    it('should test searchAssets', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'searchAssets');
        testComp.searchAssets({ target: "test" });
        expect(testComp.searchAssets).toHaveBeenCalledTimes(1);
    })
    it('should test handleKeyPress', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'handleKeyPress');
        testComp.handleKeyPress();
        expect(testComp.handleKeyPress).toHaveBeenCalledTimes(1);
    })
    it('should test handleKeyUp', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'handleKeyUp');
        testComp.handleKeyUp();
        expect(testComp.handleKeyUp).toHaveBeenCalledTimes(1);
    })
    it('should test assignAssetHandler', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'assignAssetHandler');
        testComp.assignAssetHandler({});
        expect(testComp.assignAssetHandler).toHaveBeenCalledTimes(1);
    })
    it('should test toggleCheckbox', () => {
        const assetsList = [
            {
                CollectionAsset: null, CollectionImages: [], contentState: { title: "Draft" },
                externalId: "1-3-1000169", id: "f6f35194-d433-444d-bf31-f3a5d571e78e",
                lastModifiedByUser: { first_name: "Sandeep", last_name: "Kumar" }, isChecked: true,
                lastModifiedOn: "2021-01-28T09:18:26.326Z", note: null, title: "No Title"
            },
            {
                CollectionAsset: null, CollectionImages: [], contentState: { title: "Draft" },
                externalId: "1-3-1000160", id: "df5fc6d9-94f5-45ec-b014-05eec70b8ef1", isChecked: true,
                lastModifiedByUser: { first_name: "Sandeep", last_name: "Kumar" },
                lastModifiedOn: "2021-01-28T06:56:52.640Z", note: null, title: "No Title"
            }]
            wrapper.setState({assetsList});
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleCheckbox');
        testComp.toggleCheckbox({}, { id: contentId });
        expect(testComp.toggleCheckbox).toHaveBeenCalledTimes(1);
    })
    it('should test componentWillUnmount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentWillUnmount');
        testComp.componentWillUnmount();
        expect(testComp.componentWillUnmount).toHaveBeenCalledTimes(1);
    })
})
