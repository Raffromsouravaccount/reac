import React from 'react';
import { shallow, mount } from 'enzyme';

import {PaginationComp} from '../../../../_components/Common/Pagination/Pagination'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<PaginationComp {...props} />)
    return wrapper;
}

describe('Pagination', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Pagination default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})