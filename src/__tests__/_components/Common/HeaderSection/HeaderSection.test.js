import React from 'react';
import { shallow, mount } from 'enzyme';

import HeaderSection from '../../../../_components/Common/HeaderSection/HeaderSection'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    showInputField: false,
    showFilterButton: false,
    showMarkDone: false,
    showAddButton: false
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<HeaderSection {...baseProps} />)
    return wrapper;
}

describe('HeaderSection', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders HeaderSection default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})