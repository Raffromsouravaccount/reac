import React from 'react';
import { shallow, mount } from 'enzyme';

import Movie from '../../../../_components/Common/Movie/Movie'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    data: {
        MovieImages: [], MovieLicenses: [], MovieMapContents: [], contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: { title: "Draft" }, countries: [{id: '1', keyText:"INDIA"}], createdOn: "2021-01-19T09:56:57.631Z",
        dateZee5Published: null, duration: null, externalId: "1-1-1000003", isChecked: true, journeyType: "1",
        lastModifiedBy_populated: { first_name: "Rehan", last_name: "Rizvi" }, lastModifiedOn: "2021-01-19T09:57:09.670Z",
        licenceExpDays: [], modifiedOn: "2021-01-19T09:57:09.670Z", movieCountry: [], movieId: "70d4cf5e-6392-4613-a926-7df8aa25740b",
        originCountry: null, subtype: "9d59978f-d691-4482-9094-fe240b523ea4", subtype_populated: { title: "Movie" }, title: "No Title"
    },
    showButton: true, isLocked: false, showCheckbox: true, licensesCountriesDialog: true, isViewMode: false, showDelete: true
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Movie {...baseProps} />)
    return wrapper;
}

describe('Movie', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Movie default', () => {
        expect(wrapper.exists()).toBe(true);
    })

})