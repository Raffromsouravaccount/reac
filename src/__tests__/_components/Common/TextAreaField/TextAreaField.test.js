import React from 'react';
import { shallow, mount } from 'enzyme';

import TextAreaField from '../../../../_components/Common/TextAreaField/TextAreaField';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<TextAreaField {...props} />)
    return wrapper;
  }
  
  describe('TextAreaField', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup();
    })
    it('Should renders TextAreaField default', () => {
      expect(wrapper.exists()).toBe(true);
    })
  });