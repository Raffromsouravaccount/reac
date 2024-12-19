import React from 'react';
import { shallow, mount } from 'enzyme';

import AppliedFilter from '../../../../_components/Common/LeftTab/AppliedFilter'
import { constantText } from '../../../../_helpers/constants.text';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    options: [ 
     {label: "Start Date", value: "27/01/2021"},
     {label: "End Date", value: "06/02/2021"},
     {label: "Group / Countries", value: "Burundi"},
     {label: "Group / Countries", value: "Comoros"},
     {label: "Group / Countries", value: "Djibouti"},
     {label: "Translation Language", value: "Assamese"},
     {label: "Translation Language", value: "English"}
    ]
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<AppliedFilter {...baseProps} />)
    return wrapper;
}

describe('AppliedFilter', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders AppliedFilter default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check text', () => {
        expect(wrapper.find('.l-sec').text()).toEqual(constantText.applied_filters_text);
    })

    it('should check text result', () => {
        expect(wrapper.find('.w-100').text()).toEqual(constantText.result_text);
    })
})