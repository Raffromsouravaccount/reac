import React from 'react';
import { shallow, mount } from 'enzyme';

import PublishedHistory from '../../../../_components/Common/PublishContent/PublishedHistory';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<PublishedHistory {...props} UnPublishContent= {jest.fn()} status={"Changed"} canPublish={true} />)
    return wrapper;
}

describe('PublishedHistory', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders PublishedHistory default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});