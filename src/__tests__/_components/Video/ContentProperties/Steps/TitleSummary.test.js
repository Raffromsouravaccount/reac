import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import TitleSummary from '../../../../../_components/Video/ContentProperties/Steps/TitleSummary';
import { findByTestAttr } from '../../../../../Utils';
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
    handleChange: jest.fn(),
    handleTab: jest.fn(),
    setSelectDataArr: jest.fn(),
    global: [{mock: 'mockData'}]
  }

  beforeEach(() => {
    wrapper = setup({...baseProps});
  });

  it('Should renders Classification default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check renderMultiSections', () => {
    const headerData = [{name: 'test', value: "test"}];
    const instance = wrapper.instance();
    jest.spyOn(instance, 'renderMultiSections');
    instance.renderMultiSections(null, headerData);
    expect(instance.renderMultiSections).toBeCalled();
  })

  it('should check onChange method', () => {
    wrapper.find('#handleChange').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onClick method', () => {
    const button = wrapper.find('.next-step-btn').first();
    button.simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check setSelectDataArr method using props', () => {
    const button = wrapper.find('#handleChange').first();
    button.props().setSelectDataArr();
  })
  
  it('should check handleChange method', () => {
    const button = wrapper.find('#global-form-render').first();
    button.simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check setSelectDataArr method using props', () => {
    const button = wrapper.find('#global-form-render').first();
    button.props().setSelectDataArr();
  })
  
})