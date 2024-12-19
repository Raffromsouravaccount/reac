import React from 'react';
import { shallow, mount } from 'enzyme';

import SeasonCard from '../../../../../_components/Season/SeasonList/SeasonCard/SeasonCard';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
  data : {
    id: "36159cf2-ec4d-4e14-9894-9hjhjhjgjhfgj",
    externalId: "1-3-1000512",
    title: "No Title",
    note: null,
    shortDescription: null,
    description: null,
    longDescription: null,
    subtype: "4117cc68-49f5-11eb-b378-0242ac130002",
    autoPlay: false,
    tags: null,
    countries: "India,Comoros,Nepal",
    audioLanguages: "Hindi,English,Punjabi,Gujrati",
    contentCategoryId: null,
    contentStateId: "3bb64421-f15f-4dda-adec-03c324c140a3",
    createdBy: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
    modifiedBy: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
    status: "1",
    lastModifiedBy: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
    lastModifiedOn: "2021-02-10T11:08:49.998Z",
    _created_on: "2021-02-10T11:08:50.000Z",
    _modified_on: "2021-02-10T11:08:50.000Z",
    _created_by: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
    _modified_by: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
    last_modified_by: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
    content_state_id: "3bb64421-f15f-4dda-adec-03c324c140a3",
    content_category_id: null,
    CollectionImages: [],
    contentState: {
      title: "Draft",
    },
    lastModifiedByUser: {
      first_name: "jaipal",
      last_name: "Singh",
    },
    CollectionAsset: null,
  }
}

const setup = (props = {}) => {
    const wrapper = mount(<SeasonCard {...baseProps} />);
    return wrapper;
}

describe('SeasonCard', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders SeasonCard default', () => {
        expect(wrapper.exists()).toBe(true);
    })

})