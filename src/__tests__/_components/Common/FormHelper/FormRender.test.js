import React from 'react';
import { configure, shallow, mount } from 'enzyme';

// Component
import FormRender from '../../../../_components/Common/FormHelper/FormRender';
import { findByTestAttr } from '../../../../Utils';

describe('<FormRender />', () => {
  let component;
  let mockFunc;
  const handleBlur = jest.fn()
  const form = [
    {
      name: "question",
      value: "",
      col: "col-md-6 col-lg-6",
      type: "text",
      label: "Question",
      errorText: "",
      validation: {
        required: true,
        minLength: 5
      }
    },
    {
      name: "answer",
      value: "",
      col: "col-md-6 col-lg-6",
      type: "textarea",
      label: "Answer",
      errorText: "",
      validation: {
        required: true,
        minLength: 5
      }
    },
    {
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      keyText: "title",
      label: "Cast Type",
      multiple: true,
      name: "castType",
      path: "/master/CastType",
      type: "dropdownAsync",
      validation: { required: true },
      value: []
    }]
  beforeEach(() => {
    mockFunc = jest.fn();
    const props = {
      form: form,
      onChange: mockFunc,
      isDisable: false,
      serverCall: true,
      sectionMultipleBlock: 'mockValue'
    };
    component = mount(<FormRender {...props} />);
  });

  it('Should renders FormRender default', () => {
    expect(component.exists()).toBe(true);
  });

  it('Should render InputField', () => {
    const wrapper = findByTestAttr(component, 'component-inputField');
    expect(wrapper.length).toBe(2);
  });

  it('should check InputBuilder', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'InputBuilder');
    instance.InputBuilder(form, handleBlur);
    expect(instance.InputBuilder).toBeCalled(); 
  })

  it('should check serverCalls', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'serverCalls');
    instance.serverCalls();
    expect(instance.serverCalls).toBeCalled(); 
  })

});