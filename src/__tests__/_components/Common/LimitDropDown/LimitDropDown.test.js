import React from 'react';
import { shallow, mount } from 'enzyme';

import LimitDropDown from '../../../../_components/Common/LimitDropdown/LimitDropDown'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    data: [8, 12, 16]
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<LimitDropDown {...baseProps} />)
    return wrapper;
}

describe('LimitDropDown', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders LimitDropDown default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})