import React from 'react';
import { shallow, mount } from 'enzyme';

import DatePicker from '../../../../_components/Common/DatePicker/DatePicker';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    onChange: jest.fn(),
    minDate: 'sameOrAfter'
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<DatePicker {...baseProps} />);
    return wrapper;
}

describe('DatePicker', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders DatePicker default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})