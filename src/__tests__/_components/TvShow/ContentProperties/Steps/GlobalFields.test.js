import React from 'react';
import Enzyme, { shallow ,mount} from 'enzyme';

import GlobalFields from '../../../../../_components/TvShow/ContentProperties/Steps/GlobalFields';
import FormRender from '../../../../../_components/Common/FormHelper/FormRender';
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
  const wrapper = shallow(<GlobalFields {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('GlobalFields', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  const baseProps = {
    handleTab: jest.fn(),
    globalFields: [
      {name: "title", value: "title", col: "col-md-6 col-lg-6", type: "text", label: "Title"},
      {name: "country", type: "dropdown", col: "col-md-6 col-lg-6", value: Array(2), multiple: true}
    ],
    disabled: false,
    addRemoveMultipleFields: jest.fn(),
    setSelectDataArr: jest.fn(),
    selectGroup: jest.fn(),
    handleChange: jest.fn(),
    handleBlur: jest.fn()
  }


  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders GlobalFields default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });

  it('should test getMultipleSectionUI func',()=>{
    const headerData=[
    {
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      groupBy: "group",
      keyText: "title",
      label: "Country/Group for Special Category",
      multiple: true,
      name: "specialCategoryCountry",
      path: "user/country-group",
      type: "dropdownAsync",
      validation: {required: false},
      value: []
    }
  ]
  const instance = wrapper.instance();
  jest.spyOn(instance, 'getMultipleSectionUI');
  instance.getMultipleSectionUI('globalFields', null, headerData);
    expect(instance.getMultipleSectionUI).toBeCalled();
  });

  it('should test FormRender',()=>{
    const handleBlur = jest.fn();
    const onChange = jest.fn();
    const setSelectDataArr = jest.fn();
    const handleAutoCreateInput = jest.fn();
    const addRemoveMultipleFields = jest.fn();
    
    let formRenderComp = shallow(<FormRender/>);
    expect(formRenderComp.find(FormRender))
    handleBlur.mockClear();
    onChange.mockClear();
    setSelectDataArr.mockClear();
    handleAutoCreateInput.mockClear();
    addRemoveMultipleFields.mockClear();    
  }); 

  it('should check handleTab onClick method', () => {
    wrapper.find('.prev-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })
  it('should check onChange method of setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderComp').first().prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check onChange method of selectGroup', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderComp').first().prop('selectGroup')(myFakeCallback)
  })

});