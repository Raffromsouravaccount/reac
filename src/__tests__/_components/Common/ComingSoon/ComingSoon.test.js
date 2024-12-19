import React from 'react';
import { shallow, mount } from 'enzyme';

import ComingSoon from '../../../../_components/Common/ComingSoon/ComingSoon';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {}

const setup = (initialState = {}, props = {}) => {
    const wrapper = shallow(<ComingSoon {...props} />);
    return wrapper;
  }

describe('ComingSoon', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders ComingSoon default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})