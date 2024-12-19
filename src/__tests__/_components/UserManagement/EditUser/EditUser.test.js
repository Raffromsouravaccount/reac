import React from 'react';
import { shallow, mount } from 'enzyme';

import { mapStateToProps } from '../../../../_components/User/EditUser/EditUser';
import EditUser from '../../../../_components/User/EditUser/EditUser';
import { findByTestAttr, storeFactory } from '../../../../Utils';

// service
import { userService } from '../../../../_services/user.service';
import SelectWithSearch from '../../../../_components/Common/SelectWithSearch/SelectWithSearch';
import InputField from '../../../../_components/Common/InputField/InputField';
import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<EditUser store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  user_reducer: {}
}

describe('Edit User', () => {
  let wrapper;
  const state = {
    rolesArr: [{
      createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1", createdOn: "2021-02-03T05:51:05.552Z",
      created_by: { first_name: "Jaipal", last_name: "Singh" }, description: "this is description",
      id: "9a96d779-719d-4f0d-b7a0-e8e2348096c0", modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
      modifiedOn: "2021-02-03T05:51:05.552Z", modified_by: { first_name: "Jaipal", last_name: "Singh" },
      name: "Content Manager", permission: [], status: "1"
    }, {
      createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1", createdOn: "2021-02-03T05:51:05.552Z",
      created_by: { first_name: "Jaipal", last_name: "Singh" }, description: "this is description",
      id: "9a96d771-719d-4f0d-b7a0-e8e2348096c4", modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
      modifiedOn: "2021-02-03T05:51:05.552Z", modified_by: { first_name: "Jaipal", last_name: "Singh" },
      name: "Featuring Manager", permission: [], status: "1"
    }],
    userData: {
      comments: "test translate", countries: [], createdBy: "38c34c4f-68c9-4eb0-b71f-b80f1e551448", createdOn: "2021-01-19T11:19:37.875Z",
      created_by: { first_name: "jaipal", last_name: "Singh" }, email: "sandeepkumar13009@gmail.com", firstName: "test",
      id: "0ce9e4fb-76f5-4ff6-913f-649ab413bd9d", lastLogin: "2021-01-28T08:07:54.622Z", lastName: "translate",
      modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7", modifiedOn: "2021-02-05T10:02:43.715Z", modified_by: { first_name: "Sandeep", last_name: "Kumar" },
      phone: "8650888613", role: { name: "Translator", permission: [] }, roleId: "9a96d779-719d-4f0d-b7a0-e8e2348096c0",
      roleValue: { Name: "Translator", id: "9a96d773-719d-4f0d-b7a0-e8e2348096c7" }, translationLanguages: [{ title: 'test' }], userStatus: "2"
    },
    languageArr: [{ title: 'Arabic', status: '1' }]
  }
  beforeEach(() => {
    wrapper = setup(initialState).dive();
    wrapper.setState({ ...state });
  });

  it('Should renders EditUser default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('Should get success users API', async () => {
    const expectedPosts = [
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" },
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    userService.fetch_users_service = mock;
    const result = await userService.fetch_users_service();
    expect(result).toBe(expectedPosts);
  })

  it('Should show states in store as required', () => {
    const intialState = {
      user_reducer: {
        rolesArr: [{ id: "e6627741-91ba-4333-9981-8f124c0b2e11", name: "Test 1" }],
        countriesArr: [{ id: "e6627741-91ba-4333-9981-8f124c0b2e11", title: "Afghanistan" }],
        languageArr: [{ title: 'Arabic', status: '1' }]
      }
    };
    expect(mapStateToProps(intialState).rolesArr).toEqual([{ id: "e6627741-91ba-4333-9981-8f124c0b2e11", name: "Test 1" }]);
    expect(mapStateToProps(intialState).countriesArr).toEqual([{ id: "e6627741-91ba-4333-9981-8f124c0b2e11", title: "Afghanistan" }]);
    expect(mapStateToProps(intialState).languageArr).toEqual([{ title: 'Arabic', status: '1' }]);
  })

  it('Should get success user roles API', async () => {
    const expectedPosts = [
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" },
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    userService.fetch_roles_service = mock;
    const result = await userService.fetch_roles_service();
    expect(result).toBe(expectedPosts);
  })

  it('Should get success users countries API', async () => {
    const expectedPosts = [
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", title: "Afghanistan" }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    userService.fetch_countries_service = mock;
    const result = await userService.fetch_countries_service();
    expect(result).toBe(expectedPosts);
  })

  it('Should get success users language API', async () => {
    const expectedPosts = [
      { title: 'Arabic', status: '1' }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    userService.fetch_language_service = mock;
    const result = await userService.fetch_language_service();
    expect(result).toBe(expectedPosts);
  })

  it('Should get success users by id API', async () => {
    const expectedPosts = [
      { id: "3d2e1270-7290-47fe-9ef6-6073b4c8dbb8", firstName: "Test" }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    const key = "3d2e1270-7290-47fe-9ef6-6073b4c8dbb8"
    userService.fetchUserByIdKey_service = mock;
    const result = await userService.fetchUserByIdKey_service(key);
    expect(result).toBe(expectedPosts);
  })

  it('Should renders selectwithsearch default', () => {
    expect(wrapper.containsMatchingElement(<SelectWithSearch />)).toEqual(true);
  })

  it('Should renders InputField default', () => {
    expect(wrapper.containsMatchingElement(<InputField />)).toEqual(true);
  })

  it('Should renders Buttonfield default', () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  })

  it('should check onChange method of country field', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-user-country');
    button.simulate('change');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of role field', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-role-change');
    button.simulate('change');
    expect(spy).toHaveBeenCalled();
  })

  it('should check active-inactive onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'showHideStatePopup');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-active-inactive-button');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of textarea', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'comments', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-user-comments');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of firstname inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'firstName', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-user-firstname');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of last inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'lastname', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-user-lastname');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of number inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'number', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-user-number');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check click method of update user', () => {
    const spy = jest.spyOn(wrapper.instance(), 'updateUser');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'update-user-button');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleRoute onclick method for left arrow', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'left-handle-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleRoleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-role-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleCloseStatusDropdown method', () => {
    jest.spyOn(wrapper.instance(), 'handleCloseStatusDropdown');
    wrapper.instance().handleCloseStatusDropdown();
    expect(wrapper.instance().handleCloseStatusDropdown).toBeCalled();
  })

  it('should check handleOpenCloseStatusDropDown method', () => {
    jest.spyOn(wrapper.instance(), 'handleOpenCloseStatusDropDown');
    wrapper.instance().handleOpenCloseStatusDropDown();
    expect(wrapper.instance().handleOpenCloseStatusDropDown).toBeCalled();
  })

  it('should check updateUser method', () => {
    jest.spyOn(wrapper.instance(), 'updateUser');
    wrapper.instance().updateUser();
    expect(wrapper.instance().updateUser).toBeCalled();
  })

  it('should check updateUser method', () => {
    const updatedData = {
      roleValue: {
        group: ["7f42cec0-b71a-40cb-8d3a-1d09796d4710", "6ffa921c-b5c2-42c1-92b0-07fb1bdaa092",
          "c181637a-8eb3-4ee8-9ad5-5d432b785bcf", "7021289b-27a2-4f77-a9c3-7bf164b3d885",
          "accadc22-522a-47b4-804f-5ebb5baecdbe", "f6737c9f-08b1-473e-b66d-f838be7054ce"],
        language: [],
        roleId: "9a96d777-719d-4f0d-b7a0-e8e2348096c2"
      }
    }
    wrapper.setState({ updatedData })
    jest.spyOn(wrapper.instance(), 'updateUser');
    wrapper.instance().updateUser();
    expect(wrapper.instance().updateUser).toBeCalled();
  })

  it('should check activateDeactivateUser method', () => {
    jest.spyOn(wrapper.instance(), 'activateDeactivateUser');
    wrapper.instance().activateDeactivateUser();
    expect(wrapper.instance().activateDeactivateUser).toBeCalled();
  })

  it('should check getRoleNameFromId method', () => {
    jest.spyOn(wrapper.instance(), 'getRoleNameFromId');
    wrapper.instance().getRoleNameFromId();
    expect(wrapper.instance().getRoleNameFromId).toBeCalled();
  })

  it('should check filterActiveData method', () => {
    jest.spyOn(wrapper.instance(), 'filterActiveData');
    wrapper.instance().filterActiveData();
    expect(wrapper.instance().filterActiveData).toBeCalled();
  })

  it('should check selectGroup', () => {
    jest.spyOn(wrapper.instance(), 'selectGroup');
    wrapper.instance().selectGroup();
    expect(wrapper.instance().selectGroup).toBeCalled();
  })

  it('should check fetchMaster', () => {
    jest.spyOn(wrapper.instance(), 'fetchMaster');
    wrapper.instance().fetchMaster();
    expect(wrapper.instance().fetchMaster).toBeCalled();
  })

  it('should check componentWillReceiveProps', () => {
    const nextProps = {
      rolesArr: [], languageArr: []
    }
    jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
    wrapper.instance().componentWillReceiveProps(nextProps);
    expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
  })

  it('should check getUserData', () => {
    const props = {
      match: {
        isExact: true, params: { id: "de17ce3c-eb7f-42ec-bcfc-18a0a74fc767" },
        path: "/user/view/:id", url: "/user/view/de17ce3c-eb7f-42ec-bcfc-18a0a74fc767"
      }
    }
    wrapper.setProps({ ...props })
    jest.spyOn(wrapper.instance(), 'getUserData');
    wrapper.instance().getUserData();
    expect(wrapper.instance().getUserData).toBeCalled();
  })

  it('should check fetchUserData', () => {
    jest.spyOn(wrapper.instance(), 'fetchUserData');
    wrapper.instance().fetchUserData();
    expect(wrapper.instance().fetchUserData).toBeCalled();
  })

})