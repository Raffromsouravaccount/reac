import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';

import Classification from '../../../../../_components/CreateMovie/ContentProperties/Steps/Classification';
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
  const wrapper = shallow(<Classification {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('Classification', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  const baseProps = {
    classification: [
      {name: "broadcastState", value: null, col: "col-md-6 col-lg-6", type: "dropdownAsync", multiple: false},
      {name: "rating", value: null, col: "col-md-6 col-lg-6", type: "dropdownAsync", multiple: false},
      {name: "contentOwner", value: null, col: "col-md-6 col-lg-6", type: "dropdownAsync", multiple: false}
    ],
    awards: [
      {name: "awardRecipient", type: "SearchableWithCreate", col: "col-md-6 col-lg-6", value: Array(0), multiple: true},
      {name: "awardsCategory", col: "col-md-6 col-lg-6", value: Array(0), type: "dropdownAsync", multiple: true},
      {name: "awardsandrecognition", value: "", col: "col-md-6 col-lg-6", type: "text", label: "Award/Honour"}
    ],
    handleChange: jest.fn(),
    handleSearchableInput: jest.fn(),
    setSelectDataArr: jest.fn(),
    handleTab: jest.fn(),
    disable: false,
    addRemoveMultipleFields: jest.fn()
  }

  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should have a <div>", () => {
    const wrapper = mount(<Classification/>)
    let container = wrapper.find("div");
    expect(container).toHaveLength(5);
 });

  it('Should renders Classification default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });

  it('should test Awards Data',()=>{
    const awards=[
        {
        col: "col-md-6 col-lg-6",
        data: [],
        errorText: "",
        keyText: "title",
        label: "Award Category",
        multiple: true,
        name: "awardsCategory",
        path: "/master/AwardCategory",
        type: "dropdownAsync",
        validation: {required: false},
        value: []
        }
  ]
  const instance = wrapper.instance();
  jest.spyOn(instance, 'render');
  instance.render('classification', null, awards);
    expect(instance.render).toBeCalled();
  });

  it('should have an movie-f-wrap class', () => {
    const wrapper = shallow(<Classification />);
    expect(wrapper.find("div.movie-f-wrap").length).toBe(1);
  });

  it('should test FormRender',()=>{
    const onBlur = jest.fn();
    const onChange = jest.fn();
    const setSelectDataArr = jest.fn();
    const handleAutoCreateInput = jest.fn();
    let formRenderComp = shallow(<FormRender/>);
    expect(formRenderComp.find(FormRender))
    onBlur.mockClear();
    onChange.mockClear();
    setSelectDataArr.mockClear();
    handleAutoCreateInput.mockClear();
  });

  it('should check handleChange onChange method', () => {
    wrapper.find('#formRenderComp').first().simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onChange method of setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderComp').first().prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check onChange method of handleAutoCreateInput', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderComp').first().prop('handleAutoCreateInput')(myFakeCallback)
  })

  it('should check handleTab onClick method for prev btn', () => {
    wrapper.find('.prev-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })
  
  it('should check handleTab onClick method for next btn', () => {
    wrapper.find('.next-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check handleChange onChange method for awards section', () => {
    wrapper.find('#awardsFormRender').first().simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onChange method of handleAutoCreateInput for awards section', () => {
    const myFakeCallback = () => {};
    wrapper.find('#awardsFormRender').first().prop('handleAutoCreateInput')(myFakeCallback)
  })

  it('should check onChange method of setSelectDataArr for awards section', () => {
    const myFakeCallback = () => {};
    wrapper.find('#awardsFormRender').first().prop('setSelectDataArr')(myFakeCallback)
  })

})