import React from 'react';
import { shallow, mount } from 'enzyme';

import QuickLink from '../../../../_components/Common/PublishContent/QuickLink';
import { constantText } from '../../../../_helpers/constants.text';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<QuickLink {...props} showTranslation={true} assignedLang={[{lang:'hindi'}]} keyText={'title'} 
    showHideOtherLangModel={jest.fn()} translationDone={true}/>)
    return wrapper;
}

describe('QuickLink', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders QuickLink default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check quick links text', () => {
        expect(wrapper.find('h4').text()).toEqual(constantText.quick_links_text)
    })

    it('should check translation text', () => {
        expect(wrapper.find('h6').text()).toEqual(constantText.translation_text)
    })
});