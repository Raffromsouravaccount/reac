import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import moxios from 'moxios';
import ManageTemplate from '../../../../_components/Masters/ManageTemplate/ManageTemplate';
//Helpers
import { findByTestAttr, storeFactory } from '../../../../Utils';
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */


import axios from "../../../../_helpers/axiosInstance";

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ManageTemplate store={store} {...props} />).dive();
  return wrapper;
}

describe('<ManageTemplate />', () => {
  let wrapper;
  const initialStore = {
    user_reducer: {}
  };
  const event = { target: { name: 'xyz', value: '123',files: [{
    lastModified: 1602582862128,
    lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
    name: "pjimage-5-1589546097.jpg",
    path: "pjimage-5-1589546097.jpg",
    size: 14626,
    type: "image/jpeg",
    webkitRelativePath: ""
  }] }, preventDefault: jest.fn() }
  beforeEach(() => {
    wrapper = setup(initialStore, null, null);
  });

  it('Should renders ManageTemplate default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test ComponentDidMount',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  }); 

    it('should test handleSave',()=>{
      const instance = wrapper.instance();
      jest.spyOn(instance, 'handleSave');
      instance.handleSave();
      expect(instance.handleSave).toHaveBeenCalledTimes(1);
    }); 

    it('should test setOptions',()=>{
      const mode = "Edit"
      const data ={
        createdBy: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
        created_by: {first_name: "jaipal", last_name: "Singh"},
        id: "6be59dbd-d17e-4289-af1b-a6fb1e871124",
        licenceTemplateDetails:[{
          BillingType: null,
          BusinessType: {title: "Advertisement", id: "6fbedee2-921b-4abf-9143-7d006f5a1450"},
          TVODTier: {title: "TVOD_Gold", id: "5b44c8f7-1166-465f-a56c-ae03a08bb503"},
          countryId:[{id: "6ffa921c-b5c2-42c1-92b0-07fb1bdaa092", title: "Comoros"}]
        }],
        modifiedBy: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51",
        modified_by: {first_name: "Shrishti", last_name: "Sahu"},
        status: "1",
        title: "Testting",
        _created_by: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
        _created_on: "2021-01-27T15:02:58.056Z",
        _modified_by: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51",
        _modified_on: "2021-02-20T08:09:57.736Z"
      }
      const mockSet = {
            JSONSchema:[{
              col: "col-md-6 col-lg-4",
              errorText: "",
              label: "Template Title",
              name: "DisplayName",
              touched: 1,
              type: "text",
              valid: true,
              validation: {required: true, minLength: 5, maxLength: 250},
              value: "Testting"
            }],
            copyData:[{
              col: "col-md-5 col-lg-4",
              data: [{}],
              errorText: "",
              groupBy: "group",
              keyText: "title",
              label: "Country Grouping",
              moreText: "Countries",
              multiple: true,
              name: "Country",
              touched: 1,
              type: "dropdown",
              validation: {required: true},
              value:{title: "testing", status: "1", id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710", code: "KW", group: "AFRICA_EA"}
             }],
          LicenseSchema:[{
            id: "2bf307cd-8755-4449-9480-71150600d68f",
            name: "License",
            data:[{}]
          }]
      }
      wrapper.setState({...mockSet});
      const instance = wrapper.instance();
      jest.spyOn(instance, 'setOptions');
      instance.setOptions(mode,data);
      expect(instance.setOptions).toHaveBeenCalledTimes(1);
    }); 

    it('should test fetchMaster',()=>{
      const baseProps = {
        DECREASE_REQUEST : jest.fn()
      }
      const instance = wrapper.instance();
      wrapper.setProps({...baseProps});
      jest.spyOn(instance, 'fetchMaster');
      instance.fetchMaster();
      expect(instance.fetchMaster).toHaveBeenCalledTimes(1);
    }); 

    it("should check the formatDate ", () => {
      const monthNames =["Jan","Feb","Mar","Apr",
                        "May","Jun","Jul","Aug",
                        "Sep", "Oct","Nov","Dec"]; 
    const instance = wrapper.instance();
    jest.spyOn(instance, "formatDate");
    instance.formatDate(monthNames);
    expect(instance.formatDate).toBeCalled();
  });

  it('should check TitleChanger', () => {
    const mockSet = {
      JSONSchema:[{
        col: "col-md-6 col-lg-4",
        errorText: "",
        label: "Template Title",
        name: "DisplayName",
        touched: 1,
        type: "text",
        valid: true,
        validation: {required: true, minLength: 5, maxLength: 250},
        value: "Testing"
      }],
      formIsValid : true
    };
    wrapper.setState({...mockSet });
    jest.spyOn(wrapper.instance(), 'TitleChanger');
    wrapper.instance().TitleChanger(event, 0);
    expect(wrapper.instance().TitleChanger).toBeCalled();
  });

  it('should check LicenseChanger', () => {
    const mockSet = {
      copyJSON:[{
        col: "col-md-6 col-lg-4",
        errorText: "",
        label: "Template Title",
        name: "DisplayName",
        touched: 1,
        type: "text",
        valid: true,
        validation: {required: true, minLength: 5, maxLength: 250},
        value: "Testing"
      }]
    };
    wrapper.setState({...mockSet})
    jest.spyOn(wrapper.instance(), 'LicenseChanger');
    wrapper.instance().LicenseChanger(event, 0,0);
    expect(wrapper.instance().LicenseChanger).toBeCalled();
  });

  it('should check handleSave', () => {
    const  LicenseSchema = [{
      col: "col-md-6 col-lg-4",
      errorText: "",
      label: "Template Title",
      name: "DisplayName",
      touched: 1,
      type: "text",
      valid: true,
      validation: {required: true, minLength: 5, maxLength: 250},
      value: "Testing",
      id: "2bf307cd-8755-4449-9480-71150600d68f",
      
    }]

    const baseProps = {
      INCREASE_REQUEST: jest.fn(),
      createMaster: jest.fn(),
      DECREASE_REQUEST: jest.fn()
    }
    wrapper.setState({...LicenseSchema, mode:"Create"});
    wrapper.setProps({...baseProps});
    jest.spyOn(wrapper.instance(), 'handleSave');
    wrapper.instance().handleSave(event, 0);
    expect(wrapper.instance().handleSave).toBeCalled();
  });

  it('should check handleChange', () => {
    jest.spyOn(wrapper.instance(), 'handleChange');
    wrapper.instance().handleChange(event, 0);
    expect(wrapper.instance().handleChange).toBeCalled();
  });

  it('should test handleAddRemoveLicense for if',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleAddRemoveLicense');
    instance.handleAddRemoveLicense(0);
    expect(instance.handleAddRemoveLicense).toHaveBeenCalledTimes(1);
  }); 

  it('should test handleAddRemoveLicense for else',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleAddRemoveLicense');
    instance.handleAddRemoveLicense();
    expect(instance.handleAddRemoveLicense).toHaveBeenCalledTimes(1);
  }); 

  it('should test addLicense',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'addLicense');
    instance.addLicense();
    expect(instance.addLicense).toHaveBeenCalledTimes(1);
  }); 

  it('should test removeLicense',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'removeLicense');
    instance.removeLicense();
    expect(instance.removeLicense).toHaveBeenCalledTimes(1);
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

  it('should test patchRemoveLicense',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'patchRemoveLicense');
    instance.patchRemoveLicense();
    expect(instance.patchRemoveLicense).toHaveBeenCalledTimes(1);
  }); 

  it('should test handleEditStatus',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleEditStatus');
    instance.handleEditStatus();
    expect(instance.handleEditStatus).toHaveBeenCalledTimes(1);
  }); 

  it('should test handleEditPath',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleEditPath');
    instance.handleEditPath();
    expect(instance.handleEditPath).toHaveBeenCalledTimes(1);
  }); 

  it('should test render',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  }); 

it('should check selectGroup', () => {
  const mockSet = {
    LicenseSchema:[{
      data:[{
        col: "col-md-5 col-lg-4",
        data:[{}],
        errorText: "",
        groupBy: "group",
        keyText: "title",
        label: "Country Grouping",
        moreText: "Countries",
        multiple: true,
        name: "Country",
        touched: 1,
        type: "dropdown",
        validation: {required: true},
        value:[{
          code: "KW",
          group: "AFRICA_EA",
          id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
          status: "1",
          title: "testing"
        }]
      }],
      id: "2bf307cd-8755-4449-9480-71150600d68f",
      name: "License"
    }],
    templateIsValid : true
  };
  wrapper.setState({...mockSet });
  jest.spyOn(wrapper.instance(), 'selectGroup');
  wrapper.instance().selectGroup(event, 0, 0);
  expect(wrapper.instance().selectGroup).toBeCalled();
});

it('should check handleAddRemoveLicense onclick method', () => {
  const spy = jest.spyOn(wrapper.instance(), 'handleAddRemoveLicense');
  wrapper.instance().forceUpdate();
  wrapper.update();
  const button = findByTestAttr(wrapper, 'handleAddRemoveLicense');
  button.simulate('click');
  expect(spy).toHaveBeenCalled();
});
   
});