import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import CollectionImages from '../../../../_components/Collection/CreateCollection/CollectionImages/CollectionImages';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CollectionImages {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('CollectionImages', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let instance;
  const baseProps = {
    location: {
      state: {
        seletedTab: true
      }
    }
  }
  beforeEach(() => {
    wrapper = setup();
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders CollectionImages default', () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should check getFormElement for type text', () => {
      const element = {
        name: 'name', type: 'text', placeHolder:'name as', required: true, multiple: false,options: {}
      }
      jest.spyOn(wrapper.instance(), 'getFormElement');
      wrapper.instance().getFormElement(element);
      expect(wrapper.instance().getFormElement).toBeCalled();
  })

  it('should check getFormElement for type tagimage', () => {
    const element = {
      name: 'name', type: 'text', placeHolder:'name as', required: true, multiple: false,options: {}
    }
    jest.spyOn(wrapper.instance(), 'getFormElement');
    wrapper.instance().getFormElement(element);
    expect(wrapper.instance().getFormElement).toBeCalled();
})

it('should check getFormElement for type dropDown', () => {
    const element = {
      name: 'name', type: 'text', placeHolder:'name as', required: true, multiple: false,options: {}
    }
    jest.spyOn(wrapper.instance(), 'getFormElement');
    wrapper.instance().getFormElement(element);
    expect(wrapper.instance().getFormElement).toBeCalled();
})

it('should check getFormElement default', () => {
    const element = {
        name: 'name', type: '', placeHolder:'name as', required: true, multiple: false,options: {}
      }
    jest.spyOn(wrapper.instance(), 'getFormElement');
    wrapper.instance().getFormElement(element);
    expect(wrapper.instance().getFormElement).toBeCalled();
})
})