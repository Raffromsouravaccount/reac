import React from 'react';
import { shallow, mount } from 'enzyme';

import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';
import { storeFactory } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}) => {
    const wrapper = shallow(<ButtonField {...props} />);
    return wrapper;
}

describe('ButtonField', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders ButtonField default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})