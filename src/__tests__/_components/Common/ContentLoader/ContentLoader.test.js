import React from 'react';
import { shallow, mount } from 'enzyme';

import ContentLoader from '../../../../_components/Common/ContentLoader/ContentLoader';
import { storeFactory } from './../../../../Utils' 

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {requestCount: true}

const setup = (initialState = {}, props = {}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<ContentLoader store={store} {...props} />).dive();
    return wrapper;
  }
  
  const initialState = {
    common_reducer: {}
  }

describe('ContentLoader', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup(initialState, {...baseProps});
    })

    it('Should renders ContentLoader default', () => {
        wrapper.setProps({...baseProps});      
        expect(wrapper.exists()).toBe(true);
    })
})