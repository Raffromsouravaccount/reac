import React from 'react';
import { shallow, mount } from 'enzyme';

import UnPublishedHistory from '../../../../_components/Common/PublishContent/UnPublishedHistory';
import { constantText } from '../../../../_helpers/constants.text';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {

    unPublishedHistory: {
        country: [{ id: "c387e93c-0394-499e-be33-84a3ce1b445b", title: "Vietnam" }]
    }
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<UnPublishedHistory unPublishedHistory={baseProps.unPublishedHistory}/>)
    return wrapper;
}

describe('UnPublishedHistory', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps},null);
    })

    it('Should renders UnPublishedHistory default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check unpublish history text', () => {
        expect(wrapper.find('.main-title').text()).toEqual(constantText.un_published_history_text)
    })

    it('should check label text', () => {
        expect(wrapper.find('.label').text()).toEqual(constantText.create_movie_images_gc_text)
    })
})