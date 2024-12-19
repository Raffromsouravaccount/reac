import React from 'react';
import { shallow, mount } from 'enzyme';

import Page404 from '../../../../_components/Common/ErrorPage/Page404'

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
    const wrapper = shallow(<Page404 {...baseProps} />)
    return wrapper;
}

describe('Page404', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Page404 default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})