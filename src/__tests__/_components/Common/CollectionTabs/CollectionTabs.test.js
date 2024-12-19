import React from 'react';
import { shallow, mount } from 'enzyme';

import CollectionTabs from '../../../../_components/Common/CollectionTabs/CollectionTabs';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {}

const setup = (props = {}) => {
    const wrapper = shallow(<CollectionTabs {...baseProps} />);
    return wrapper;
}

describe('CollectionTabs', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps});
    })

    it('Should renders CollectionTabs default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})