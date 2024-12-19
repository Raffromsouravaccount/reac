import React from 'react';
import { shallow, mount } from 'enzyme';

import Content from '../../../../_components/Common/RearrangeContents/Content';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const data = {assetContentType: "ContentType", sequence: 1, title: "Movies You May Like"};
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Content {...props} item={data} />)
    return wrapper;
}

describe('Content', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Content default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});