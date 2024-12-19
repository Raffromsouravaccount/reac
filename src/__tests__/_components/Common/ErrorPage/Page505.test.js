import React from 'react';
import { shallow, mount } from 'enzyme';

import Page505 from '../../../../_components/Common/ErrorPage/Page505'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Page505 {...baseProps} />)
    return wrapper;
}

describe('Page505', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Page505 default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})