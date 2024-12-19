
import React from 'react';
import { shallow, mount } from 'enzyme';

import TimePicker from '../../../../_components/Common/TimePicker/TimePicker';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const handleBlur = jest.fn();
const handleChange = jest.fn();
const params = {
    className: "zee-time-field",
    disabled: false,
    error: false,
    errorMsg: "",
    format: undefined,
    label: "Video Duration",
    name: "duration",
    onBlur: () => handleBlur,
    onChange: e => handleChange,
    required: true,
    value: "18:30:49",
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<TimePicker {...props} {...params} />)
    return wrapper;
}

describe('TimePicker', () => {
    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation((init) => [init, setState]);
    beforeEach(() => {
        wrapper = setup();
    })
    
    it('Should renders TimePicker default', () => {
        const setIsOpen = false;
        React.useState = jest.fn().mockReturnValue([setIsOpen, {}])
        expect(wrapper.exists()).toBe(true);
    })
})