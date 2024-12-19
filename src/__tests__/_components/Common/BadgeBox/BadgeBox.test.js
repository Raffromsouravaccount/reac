import React from 'react';
import { shallow, mount } from 'enzyme';

import BadgeBox from '../../../../_components/Common/BadgeBox/BadgeBox';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    status: 'Draft'
}

const setup = (props = {}) => {
    const wrapper = shallow(<BadgeBox {...baseProps} />);
    return wrapper;
}

describe('BadgeBox', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps});
    })

    it('Should renders BadgeBox default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})