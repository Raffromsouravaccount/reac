import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import ManageTranslation from '../../../../_components/Masters/Translation/ManageTranslation';
//Helpers
import { findByTestAttr, storeFactory } from '../../../../Utils';
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ManageTranslation store={store} {...props} />).dive();
  return wrapper;
}

describe('<ManageMasters />', () => {
  let wrapper;
  const initialStore = {
    user_reducer: {}
  };
  const event = { target: { name: 'xyz', value: '123',files:[{
    lastModified: 1602582862128,
    lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
    name: "pjimage-5-1589546097.jpg",
    path: "pjimage-5-1589546097.jpg",
    size: 14626,
    type: "image/jpeg",
    webkitRelativePath: ""
  }] }, preventDefault: jest.fn() }
  beforeEach(() => {
    wrapper = setup(initialStore);
  });

  it('Should renders ManageTranslation default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test ComponentDidMount',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  }); 

  it('should test handleRoute',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalledTimes(1);
  }); 

  it("should check the fillDetails with mockSet ", () => {
    const mockSet = {
              formData:[{
                errorText: "",
                label: "Primary Genre",
                name: "title",
                touched: 1,
                type: "text",
                valid: true,
                validation: {required: true, isChar: true, minLength: 2, maxLength: 100},
                value: "testing"
              }],
              translationValid: true,
              formIsValid : true,
              TranslationSchema:[{
                col: "col-md-6 col-lg-4",
                errorText: "",
                label: "Primary Genre in Arabic",
                moreText: "Arabic",
                name: "xyz",
                touched: 1,
                type: "text",
                valid: true,
                validation: {maxLength: 100},
                value: ""
                }] ,
              mode:"Edit" ,
              data:{
                createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
                created_by: {first_name: "Jaipal", last_name: "Singh"},
                id: "27569553-95ae-421c-9fd6-67e79001cb55",
                modifiedBy: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51",
                modified_by: {first_name: "Shrishti", last_name: "Sahu"},
                status: "1",
                title: "Testingtesting",
                translations: [{code: "hi", title: "एनीमेशन",name:"xyz"}],
                _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
                _created_on: "2020-11-16T12:54:46.565Z",
                _modified_by: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51",
                _modified_on: "2021-02-19T13:53:28.261Z"
              }
            };
    const instance = wrapper.instance();
    wrapper.setState({...mockSet});
    jest.spyOn(instance, "fillDetails");
    instance.fillDetails();
    expect(instance.fillDetails).toBeCalled();
  });

  it('should check TranslationChanger', () => {
    const  TranslationSchema = [{
      col: "col-md-6 col-lg-4",
      errorText: "",
      label: "Primary Genre in Arabic",
      moreText: "Arabic",
      name: "xyz",
      touched: 1,
      type: "text",
      valid: true,
      validation: {maxLength: 100},
      value: ""
      }]
      wrapper.setState({...TranslationSchema});
    jest.spyOn(wrapper.instance(), 'TranslationChanger');
    wrapper.instance().TranslationChanger(event, 0);
    expect(wrapper.instance().TranslationChanger).toBeCalled();
});

    it('should check InputChanger', () => {
      const mockSet = {
        formData:[{
          errorText: "",
          label: "Primary Genre",
          name: "title",
          touched: 1,
          type: "file",
          valid: true,
          validation: {required: true, isChar: true, minLength: 2, maxLength: 100},
          value: "testing"
        }],
        formValidity : true
      };
      wrapper.setState({...mockSet });
      jest.spyOn(wrapper.instance(), 'InputChanger');
      wrapper.instance().InputChanger(event, 0);
      expect(wrapper.instance().InputChanger).toBeCalled();
    });
  
    it('should test handleSave',()=>{
      const mockSet = {
        translationValid:true,
        formValidity : true,
        mode: "Create"
      };
      const baseProps = {
        createMaster : jest.fn(),
        updateMaster : jest.fn()
      }
      const instance = wrapper.instance();
      wrapper.setState({...mockSet});
      wrapper.setProps({...baseProps});
      jest.spyOn(instance, 'handleSave');
      instance.handleSave();
      expect(instance.handleSave).toHaveBeenCalledTimes(1);
    }); 

    it('should check handleRoute onclick method with master-module', () => {
      const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
      wrapper.instance().forceUpdate();
      wrapper.update();
      const button = findByTestAttr(wrapper, 'master-module');
      button.simulate('click');
      expect(spy).toHaveBeenCalled();
    });

    it('should check handleRoute onclick method with masters', () => {
      const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
      wrapper.instance().forceUpdate();
      wrapper.update();
      const button = findByTestAttr(wrapper, 'masters');
      button.simulate('click');
      expect(spy).toHaveBeenCalled();
    });

    it('should check handleRoute onclick method with manage-master-backbtn', () => {
      const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
      wrapper.instance().forceUpdate();
      wrapper.update();
      const button = findByTestAttr(wrapper, 'manage-master-backbtn');
      button.simulate('click');
      expect(spy).toHaveBeenCalled();
    });
});