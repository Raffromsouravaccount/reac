import React from 'react';
import { shallow, mount } from 'enzyme';

import RearrangeContents from '../../../../_components/Common/RearrangeContents/RearrangeContents';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const data = [{ assignedData: [{ assetContentType: "Movie", sequence: 1, title: "Movies You May Like" }] }]
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<RearrangeContents {...props} assignedData={[...data]} />)
    return wrapper;
}

describe('RearrangeContents', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders RearrangeContents default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should draggable in rearrange component', () => {
    })

});