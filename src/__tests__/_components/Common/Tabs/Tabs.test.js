import React from 'react';
import { shallow, mount } from 'enzyme';

import Tabs from '../../../../_components/Common/Tabs/Tabs';
import { jssPreset } from '@material-ui/core';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Tabs {...props} />)
    return wrapper;
  }
  
  describe('Tabs', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setup();
    })
    it('Should renders Tabs default', () => {
      expect(wrapper.exists()).toBe(true);
    })

    it('should check handleTabChange method', () => {
        jest.spyOn(wrapper.instance(), 'handleTabChange');
        wrapper.instance().handleTabChange();
        expect(wrapper.instance().handleTabChange).toBeCalled();
    })

    it('should check onClick method', () => {
        jest.spyOn(wrapper.instance(), 'onClick');
        wrapper.instance().onClick();
        expect(wrapper.instance().onClick).toBeCalled();
    })
  });