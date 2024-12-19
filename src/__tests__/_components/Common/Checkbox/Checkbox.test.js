import React from 'react';
import { shallow, mount } from 'enzyme';

import CheckBox from '../../../../_components/Common/CheckBox/CheckBox';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
}

const setup = (props = {}) => {
    const wrapper = shallow(<CheckBox {...baseProps} />);
    return wrapper;
}

describe('CheckBox', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders CheckBox default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})