import React from 'react';
import { shallow, mount } from 'enzyme';

import RejectedContent from '../../../../_components/Common/PublishContent/RejectedContent';
import { constantText } from '../../../../_helpers/constants.text';
import SelectWithSearch from '../../../../_components/Common/SelectWithSearch/SelectWithSearch';
import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const country = [{id: "4fb82f84-3140-4d95-9519-1fa7ba884869",title: "Italy"}] 
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<RejectedContent {...props} countryData={country} canReject={true}
    handleMultiSelect={jest.fn()} needWorkAction={jest.fn()} multiple={true} selectedReason={true}/>)
    return wrapper;
}

describe('RejectedContent', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders RejectedContent default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check SelectWithSearch', () => {
        expect(wrapper.containsMatchingElement(<SelectWithSearch />)).toEqual(true);
    })

    it('should check h4 text', () => {
        expect(wrapper.find('h4').text()).toEqual(constantText.reject_content_text);
    })

    it('should render ButtonField default', () => {
        expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
    })
})