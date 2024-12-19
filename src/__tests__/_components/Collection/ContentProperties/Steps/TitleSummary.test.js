import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import TitleSummary from '../../../../../_components/Collection/CreateCollection/ContentProperties/Steps/TitleSummary';
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
  const wrapper = shallow(<TitleSummary {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('TitleSummary', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  const baseProps = {
    handleTab: jest.fn(),
    global: [{mock: 'global'}],
    handleChange: jest.fn(),
    setSelectDataArr: jest.fn()
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check onClick method of handleTab', () => {
    wrapper.find('.next-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check onClick method of handleChange', () => {
    wrapper.find('#formRender-section').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onChange method of setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRender-section').prop('setSelectDataArr')(myFakeCallback)
  })


  it('should check onChange method of setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderOnChange').prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check onClick method of handleChange', () => {
    wrapper.find('#formRenderOnChange').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

})