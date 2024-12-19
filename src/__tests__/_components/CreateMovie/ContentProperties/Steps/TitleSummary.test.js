import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import TitleSummary from '../../../../../_components/CreateMovie/ContentProperties/Steps/TitleSummary';
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
  const wrapper = shallow(<TitleSummary {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('TitleSummary', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  const baseProps = {
    handleChange: jest.fn(),
    setSelectDataArr: jest.fn(),
    handleTab: jest.fn(),
    specialCategory: [{mockValue: "test"}],
    global: [{globalMock: 'test', value: 'global'}]
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders TitleSummary default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test header Data', () => {
    const headerData = [
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
        validation: { required: false },
        value: []
      }
    ]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getMultipleSectionUI');
    instance.getMultipleSectionUI('title_summary', headerData, true);
    expect(instance.getMultipleSectionUI).toBeCalled();
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });


  it('should render <FormRender /> components', () => {
    const wrapper = shallow(<TitleSummary />);
    expect(wrapper.find(FormRender)).toHaveLength(1);
  });

  it('should test FormRender', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();
    const setSelectDataArr = jest.fn();
    const handleAutoCreateInput = jest.fn();
    let formRenderComp = shallow(<FormRender />);
    expect(formRenderComp.find(FormRender))
    onBlur.mockClear();
    onChange.mockClear();
    setSelectDataArr.mockClear();
    handleAutoCreateInput.mockClear();
  });

  it('should check onChange method of handleChange', () => {
    wrapper.find('#formRenderOnChange').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onChange method of setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderOnChange').prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check handleTab onClick method', () => {
    wrapper.find('.next-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check handleChange method', () => {
    const event = {target: {name: 'handleChange', value: 'test'}}
    jest.spyOn(wrapper.instance(), 'handleChange');
    wrapper.instance().handleChange(event);
    expect(wrapper.instance().handleChange).toBeCalled();
  })
  
  it('should check onChange method of handleChange for global', () => {
    wrapper.find('#globalFormRender').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onChange method of setSelectDataArr for global', () => {
    const myFakeCallback = () => {};
    wrapper.find('#globalFormRender').prop('setSelectDataArr')(myFakeCallback)
  })
})