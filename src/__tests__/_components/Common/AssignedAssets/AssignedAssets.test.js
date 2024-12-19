import React from 'react';
import { shallow } from 'enzyme';

import AssignedAssets from '../../../../_components/Common/AssignedAssets/AssignedAssets';

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
};
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
    }]
};

const setup = (props = initialState, state = null) => {
    const wrapper = shallow(<AssignedAssets {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<AssignedAssets />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })
    it('Should renders AssignedAssets default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})
