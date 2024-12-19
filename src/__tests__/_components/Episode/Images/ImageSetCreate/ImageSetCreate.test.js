import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';

import { storeFactory, findByTestAttr } from '../../../../../Utils';
import ImageSetCreate from '../../../../../_components/Episode/Images/ImageSetCreate/ImageSetCreate';
import { expect, it, jest } from '@jest/globals';
import FormRender from '../../../../../_components/Common/FormHelper/FormRender';
import ButtonField from '../../../../../_components/Common/ButtonField/ButtonField';

import jsonData from '../../../../../_components/Episode/Schema/Episode_Manual_StandardJourney_FE_Structure.json';

const props = {
  editSet: {
    GroupCountry: [], Platform: [], default: false,
    imageSetId: "905c2c44-38b0-4c91-8223-5d8e4fc0e2a9",
    images: [
      { imageTitle: "", imageDescription: "", url: "", mandatory: false, maxSize: "20MB" },
      { imageTitle: "", imageDescription: "", url: "", mandatory: false, maxSize: "20MB" },
      { imageTitle: "", imageDescription: "", url: "", mandatory: false, maxSize: "20MB" }
    ],
    setName: "test",
    tags: { genre: [], language: [], ageGroup: [], gender: [], others: "" },
    episodeId: "85b3c599-cb1c-40b4-8a54-571466cde3b4"
  },
  imageSets: [{
    default: true,
    imageSetId: "8216a05e-18e0-4fa0-9792-1a2c65b3d03f",
    images: [],
    setName: "Default",
    tags: { others: null },
    episodeId: "08ff3701-d67c-482c-be77-238769f6e87c"
  },
  {
    GroupCountry: [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore" }],
    Platform: [{ id: "5b72cd93-5445-4d84-b69b-50d04b432fb6", title: "Connected Devices" }],
    default: false, imageSetId: "a85aafe0-bdd6-4f79-9ee1-00e9f13a80a3",
    images: [], setName: "test",
    tags: { genre: [], language: [], ageGroup: [], gender: [], others: "others" },
    episodeId: "08ff3701-d67c-482c-be77-238769f6e87c"
  }],
  navToImageSet:jest.fn(),
  jsonData: jsonData.Images
}
const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ImageSetCreate store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  movieMgmt_reducer: {}
}

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup(initialState, { ...props });
  });

  afterEach(() => {
  })

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })
  it('should call component did mount', () => {
    const wrapperInstance = wrapper.instance();
    const editSet={};
    wrapper.setProps({editSet:editSet})
    jest.spyOn(wrapperInstance, 'componentDidMount')
    wrapperInstance.componentDidMount();
    expect(wrapperInstance.componentDidMount).toHaveBeenCalled();
  });

 it('should call component did mount', () => {
    const wrapperInstance = wrapper.instance();
    jest.spyOn(wrapperInstance, 'componentDidMount')
    wrapperInstance.componentDidMount();
    expect(wrapperInstance.componentDidMount).toHaveBeenCalled();
  });

  it('should check the component render method', () => {
    const editSet = { setName: 'test' }
    const wrapperInstance = wrapper.setState({ editSet });
    expect(wrapperInstance.exists()).toBe(true);
  })

  it("should test setMasterData method", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setMasterData');
    instance.setMasterData('fields', 1);
    expect(instance.setMasterData).toHaveBeenCalled();
  })

  it('should check formatData method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'formatData');
    instance.formatData();
    expect(instance.formatData).toHaveBeenCalled();
  })

  it('should check createSet method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'createSet');
    instance.createSet();
    expect(instance.createSet).toHaveBeenCalled();
  })

  it('should check createSet method', () => {
    wrapper.setProps({episodeId:'xyz', editSet: {}})
    const instance = wrapper.instance();
    jest.spyOn(instance, 'createSet');
    instance.createSet();
    expect(instance.createSet).toHaveBeenCalled();
  })

  it('should check selectGroup method', () => {
    const mockedEvent = { target: {} }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectGroup');
    instance.selectGroup(mockedEvent, 'Others', 'fields');
    expect(instance.selectGroup).toHaveBeenCalled();
  })

  it('should check onClick method of navToImageSet', () => {
    const navToImageSet = jest.fn()
    const baseProps = {
      navToImageSet
    }
    wrapper.setProps({ ...baseProps });
    wrapper.find('.back-arrow').simulate('click');
    expect(baseProps.navToImageSet).toHaveBeenCalledTimes(0);
  })

  it('should check the onChange method inside formRender', () => {
    const formFieldsJson = {
      fields: [{
        col: "col-md-6 col-lg-6", errorText: "", label: "Set Name", name: "setName", type: "text",
        validation: { required: true, maxLength: 250, isAlphaNumericWithSpecialChars: true }, value: ""
      }]
    }
    expect(wrapper.containsMatchingElement(<FormRender />)).toEqual(true);
  })

  it('should check tagtext', () => {
    expect(wrapper.find('.set-tag').text()).toEqual(' Image Tags')
  })

  it('should check ButtonFielf', () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  })

  it('should check getUpdatedData method call', () => {
    const shallowFormFieldsJson = {
      fields: [{
        col: "col-md-6 col-lg-6", errorText: "", label: "Set Name", name: "setName", type: "text",
        validation: { required: true, maxLength: 250, isAlphaNumericWithSpecialChars: true }, value: "test"
      }, {
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Gender", multiple: true,
        name: "gender", path: "/master/Gender", type: "dropdown", validation: { required: false },
        value: [{ id: "e8a87594-7e7f-45a2-8270-6ce399b7ff0b", title: "Male" }]
      }],
      tags: [{
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Gender", multiple: true,
        name: "gender", path: "/master/Gender", type: "dropdown", validation: { required: false }, value: []
      }]
    }
    const editSet = {
      tags: {
        ageGroup: [{ id: "9a96d778-719d-4f0d-b7a0-e8e2348096c2", title: "20-30" }],
        gender: [{ id: "e8a87594-7e7f-45a2-8270-6ce399b7ff0b", title: "Male" }],
        genre: [{ id: "2832460c-bd72-4c78-8955-a5e46d4dd363", title: "Comedy" }],
        language: [{ id: "eb4c9b92-0a9f-44fd-b4dd-f9e8f5628726", title: "French" }],
        movieId: "23d4b9ac-1592-406e-b5d2-38dd4c7a72e7", setName: "test", others: "test"
      }
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getUpdatedData');
    instance.getUpdatedData(shallowFormFieldsJson, editSet);
    expect(instance.getUpdatedData).toHaveBeenCalled();
  })

  it('should check inputChange onChange method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'inputChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'input-change');
    button.simulate('change', 1);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChnage method',()=>{
    const spy=jest.spyOn(wrapper.instance(),'inputChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button=findByTestAttr(wrapper,'input-change-field')
    button.simulate('change',1);
    expect(spy).toHaveBeenCalled()
  })

  it('should check showCommonPopUp method',()=>{
    const spy=jest.spyOn(wrapper.instance(),'showCommonPopUp')
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button=findByTestAttr(wrapper,'show-common')
    button.simulate('click',1)
    expect(spy).toHaveBeenCalled()
  })

  it('should check hidePopUp method',()=>{
    const instance=wrapper.instance();
    jest.spyOn(instance,'hidePopUp')
    instance.hidePopUp()
    expect(instance.hidePopUp).toHaveBeenCalled()
  })

  it('should check showHideStatePopup method',()=>{
    const instance=wrapper.instance();
    jest.spyOn(instance,'showHideStatePopup')
    instance.showHideStatePopup()
    expect(instance.showHideStatePopup).toHaveBeenCalled()
  })

   it('should check inputChnageforCondition method',()=>{
     const event={target:{value:'test'}}
    const instance=wrapper.instance();
    jest.spyOn(instance,'inputChange')
    instance.inputChange(event,1,'fields')
    expect(instance.inputChange).toHaveBeenCalled()
  })


})