import React from 'react';
import { shallow, mount } from 'enzyme';

import {CommonModel} from '../../../../_components/Common/Model/CommonModel'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<CommonModel {...props} />)
    return wrapper;
}

describe('CommonModel', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders CommonModel default', () => {
        expect(wrapper.exists()).toBe(true);
    })

})