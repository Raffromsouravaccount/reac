import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import ManageMasters from '../../../_components/Masters/ManageMasters';
import InlineLoader from '../../../_components/Common/InlineLoader/InlineLoader';
//Helpers
import { findByTestAttr, storeFactory } from '../../../Utils';
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ManageMasters store={store} {...props} />).dive();
  return wrapper;
}

describe('<ManageMasters />', () => {
  let wrapper;
  const initialStore = {
    user_reducer: {}
  };
  const event = { target: { name: 'xyz', value: '123', files:[{
    lastModified: 1602582862128,
    lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
    name: "pjimage-5-1589546097.jpg",
    path: "pjimage-5-1589546097.jpg",
    size: 14626,
    type: "image/jpeg",
    webkitRelativePath: ""
  }] }, preventDefault: jest.fn() }
  beforeEach(() => {
    wrapper = setup(initialStore, null, null).dive();
  });
  it('Should renders ManageMasters default', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('render component without error', () => {
    const initialState = {
      UUID: null,
      isCustom: false,
      customPath: "",
      apiKey: null,
      popupMode: "add",
      masterArr: [],
      masterLoading: false,
      searchVal: "",
      searchKey: "",
      formData: [],
      formIsValid: false,
      showStatePopup: false,
      showStatusModel: false,
      selectedStatus: "",
      MODULE: {},
      countField: null,
      thData: [],
      filteredData: [],
      filteredRows: [],
      totalRecords: 0,
      page: 1,
      limit: 10,
    }
    const props = {};
    props.fetchMaster = jest.fn();
    props.location = {};
    props.location.search = '?module=AgeRating';
    const output = setup(initialStore, props);
    const masterComp = output.dive();
    masterComp.setState(initialState);
    expect(masterComp.state().UUID).toEqual(null);
  });
  
  it('should test ComponentDidMount',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  }); 

  it("should check the componentWillReceiveProps with response ", () => {
    const mockSet = {
      masterArr:[],
      masterLoading:true
    };
    wrapper.setProps({...mockSet});
    wrapper.setState({...mockSet});
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentWillReceiveProps");
    instance.componentWillReceiveProps(mockSet);
    expect(instance.componentWillReceiveProps).toBeCalled();
  });

  it('should check handleSearch', () => {
    jest.spyOn(wrapper.instance(), 'handleSearch');
    wrapper.instance().handleSearch(event);
    expect(wrapper.instance().handleSearch).toBeCalled();
});


  it("should check the getRowsKey ", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getRowsKey");
    instance.getRowsKey();
    expect(instance.getRowsKey).toBeCalled();
  });

  it('should check handleRoute onclick method with masters', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'masters');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should check handleRoute onclick method with mastersManagment', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'masterManagment');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should check showHideFormDialog method', () => {
    const instance = wrapper.instance();
    const formData = [{
      errorText: "",
      label: "Age Group",
      name: "title",
      touched: 0,
      type: "text",
      valid: true,
      validation: {required: true},
      value: ""
    }];
    wrapper.setState({ formData });
    jest.spyOn(instance, 'showHideFormDialog');
    instance.showHideFormDialog(false);
    expect(instance.showHideFormDialog).toHaveBeenCalledTimes(1);
  })

  it('should check showEditPopup method', () => {
    const instance = wrapper.instance();
    const copyFormData = {
          formData : [{
                errorText: "",
                label: "Age Group",
                name: "title",
                touched: 0,
                type: "text",
                valid: true,
                validation: {required: true},
                value: "100-200"
              }],
              popupMode: "edit",
              showStatePopup: true,
              selectedStatus: "1",
              UUID: "e1cdc02e-c7bb-414d-b983-1eb9bfdb1aae"
    };
    wrapper.setState({...copyFormData });
    jest.spyOn(instance, 'showEditPopup');
    instance.showEditPopup(false);
    expect(instance.showEditPopup).toHaveBeenCalledTimes(1);
  });

  it('should check showHideStatus method', () => {
    const instance = wrapper.instance();
    const mockData = {
              showStatusModel: true,
              showStatePopup: true,
              selectedStatus: "1",
              UUID: "e1cdc02e-c7bb-414d-b983-1eb9bfdb1aae"
    };
    wrapper.setState({...mockData });
    jest.spyOn(instance, 'showHideStatus');
    instance.showHideStatus(false);
    expect(instance.showHideStatus).toHaveBeenCalledTimes(1);
  });

  it('should test activateDeactivateStatus',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'activateDeactivateStatus');
    instance.activateDeactivateStatus();
    expect(instance.activateDeactivateStatus).toHaveBeenCalledTimes(1);
  });

  it('should test saveHandler',()=>{
    const instance = wrapper.instance();
    const copyFormData = {
          formData : [{
                errorText: "",
                label: "Age Group",
                name: "title",
                touched: 0,
                type: "text",
                valid: true,
                validation: {required: true},
                value: "100-200"
              }],
          mode:"add",
          formValidity:true    
    };
    wrapper.setState({...copyFormData });
    jest.spyOn(instance, 'saveHandler');
    instance.saveHandler(false);
    expect(instance.saveHandler).toHaveBeenCalledTimes(1);
  });

  it('should test deleteHandler',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'deleteHandler');
    instance.deleteHandler();
    expect(instance.deleteHandler).toHaveBeenCalledTimes(1);
  });

  it('should test handleCustomPath',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleCustomPath');
    instance.handleCustomPath();
    expect(instance.handleCustomPath).toHaveBeenCalledTimes(1);
  });

  it('should test handlePage',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handlePage');
    instance.handlePage();
    expect(instance.handlePage).toHaveBeenCalledTimes(1);
  });

  it('should test filterData',()=>{
    const instance = wrapper.instance();
    const filteredData = {
          formData : [
            {createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              created_by: {first_name: "Jaipal", last_name: "Singh"},
              id: "e1cdc02e-c7bb-414d-b983-1eb9bfdb1aae",
              modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              modified_by: {first_name: "Jaipal", last_name: "Singh"},
              status: "1",
              title: "100-200",
              _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              _created_on: "2020-11-16T12:54:46.565Z",
              _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              _modified_on: "2021-02-11T05:39:42.338Z"
            }]
    };
    wrapper.setState({ filteredData });
    jest.spyOn(instance, 'filterData');
    instance.filterData(false);
    expect(instance.filterData).toHaveBeenCalledTimes(1);
  });

  it('should test render',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
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
  


});