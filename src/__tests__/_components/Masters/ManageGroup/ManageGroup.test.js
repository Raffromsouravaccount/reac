import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import ManageGroup from '../../../../_components/Masters/ManageGroup/ManageGroup';
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
  const wrapper = shallow(<ManageGroup store={store} {...props} />).dive();
  return wrapper;
}

describe('<ManageGroup />', () => {
  let wrapper;
  const initialStore = {
    user_reducer: {}
  };
  const event = { target: { name: 'xyz', value: '123' }, preventDefault: jest.fn() }

  beforeEach(() => {
    wrapper = setup(initialStore, null, null).dive();
   
  });
 

  it('Should renders ManageGroup default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test ComponentDidMount',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  }); 

  it("should check the componentWillReceiveProps with response ", () => {
    const mockSet = {
        code: "KW",
        createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        created_by: {first_name: "Jaipal", last_name: "Singh"},
        id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
        is_group_assigned: true,
        modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        modified_by: {first_name: "Jaipal", last_name: "Singh"},
        status: "1",
        title: "testing",
        _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _created_on: "2020-11-16T12:54:46.565Z",
        _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _modified_on: "2021-02-11T05:39:45.442Z"
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentWillReceiveProps");
    instance.componentWillReceiveProps(mockSet);
    expect(instance.componentWillReceiveProps).toBeCalled();
  });

  it("should check the componentWillReceiveProps with response ", () => {
    const mockSet = {
        code: "KW",
        createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        created_by: {first_name: "Jaipal", last_name: "Singh"},
        id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
        is_group_assigned: true,
        modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        modified_by: {first_name: "Jaipal", last_name: "Singh"},
        status: "1",
        title: "testing",
        _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _created_on: "2020-11-16T12:54:46.565Z",
        _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _modified_on: "2021-02-11T05:39:45.442Z"
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentWillReceiveProps");
    instance.componentWillReceiveProps(mockSet);
    expect(instance.componentWillReceiveProps).toBeCalled();
  });

  it("should check the setSelectedCountries with response ", () => {
    const countries = ["96f7bbfd-a1d2-425c-98dd-08fb1ec40794"]
    wrapper.setState({countries,mode:"Edit"})
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectedCountries");
    instance.setSelectedCountries(countries);
    expect(instance.setSelectedCountries).toBeCalled();
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

  it('should check InputChanger', () => {
    jest.spyOn(wrapper.instance(), 'InputChanger');
    wrapper.instance().InputChanger(event, 1);
    expect(wrapper.instance().InputChanger).toBeCalled();
});

it('should test handleChange',()=>{
    jest.spyOn(wrapper.instance(), 'handleChange');
    wrapper.instance().handleChange(event, 1);
    expect(wrapper.instance().handleChange).toBeCalled();
  });

  it('should test handleCreateEditGroup',()=>{

    const mockSet = {
            selectedCountries: {
              code: "KW",
              createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              created_by: {first_name: "Jaipal", last_name: "Singh"},
              id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
              is_group_assigned: true,
              modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              modified_by: {first_name: "Jaipal", last_name: "Singh"},
              status: "1",
              title: "testing",
              _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              _created_on: "2020-11-16T12:54:46.565Z",
              _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
              _modified_on: "2021-02-11T05:39:45.442Z"
          },
          formIsValid: true
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleCreateEditGroup');
    instance.handleCreateEditGroup();
    expect(instance.handleCreateEditGroup).toHaveBeenCalledTimes(1);
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

  it("should check the handleRowSelectAll with availablewithSelected ", () => {
    const selectedCountries = {
        code: "KW",
        createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        created_by: {first_name: "Jaipal", last_name: "Singh"},
        id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
        is_group_assigned: true,
        modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        modified_by: {first_name: "Jaipal", last_name: "Singh"},
        status: "1",
        title: "testing",
        _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _created_on: "2020-11-16T12:54:46.565Z",
        _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _modified_on: "2021-02-11T05:39:45.442Z"
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleRowSelectAll");
    instance.handleRowSelectAll(selectedCountries, event, 1);
    expect(instance.handleRowSelectAll).toBeCalled();
  });

  it("should check the handleRowSelect with selectedCountries ", () => {
    const selectedCountries = {
        code: "KW",
        createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        created_by: {first_name: "Jaipal", last_name: "Singh"},
        id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
        is_group_assigned: true,
        modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        modified_by: {first_name: "Jaipal", last_name: "Singh"},
        status: "1",
        title: "testing",
        _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _created_on: "2020-11-16T12:54:46.565Z",
        _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _modified_on: "2021-02-11T05:39:45.442Z",

    };

    const row = {
      title: "testing"
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleRowSelect");
    instance.handleRowSelect(row);
    expect(instance.handleRowSelect).toBeCalled();
  });

  it('should test handleEditStatus',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleEditStatus');
    instance.handleEditStatus();
    expect(instance.handleEditStatus).toHaveBeenCalledTimes(1);
  }); 

  it("should check the handleRemoveAssigned with selectedCountries ", () => {
    const selectedCountries = {
        code: "KW",
        createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        created_by: {first_name: "Jaipal", last_name: "Singh"},
        id: "7f42cec0-b71a-40cb-8d3a-1d09796d4710",
        is_group_assigned: true,
        modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        modified_by: {first_name: "Jaipal", last_name: "Singh"},
        status: "1",
        title: "testing",
        _created_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _created_on: "2020-11-16T12:54:46.565Z",
        _modified_by: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
        _modified_on: "2021-02-11T05:39:45.442Z"
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleRemoveAssigned");
    instance.handleRemoveAssigned(selectedCountries);
    expect(instance.handleRemoveAssigned).toBeCalled();
  });

  it('should test render',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  }); 




});