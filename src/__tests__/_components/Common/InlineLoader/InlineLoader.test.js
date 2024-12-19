import React from 'react';
import { shallow, mount } from 'enzyme';

import InlineLoader from '../../../../_components/Common/InlineLoader/InlineLoader';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    show: true
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<InlineLoader {...baseProps} />)
    return wrapper;
}

describe('InlineLoader', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders InlineLoader default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})