import React from 'react';
import { shallow, mount } from 'enzyme';

import AutoCompleteText from '../../../../_components/Common/AutoCompleteText/AutoCompleteText';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    data : [{DisplayName: 'xyz'}]
}

const setup = (props = {}) => {
    const wrapper = shallow(<AutoCompleteText {...baseProps} />);
    return wrapper;
}

describe('AutoCompleteText', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps});
    })

    it('Should renders AutoCompleteText default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})