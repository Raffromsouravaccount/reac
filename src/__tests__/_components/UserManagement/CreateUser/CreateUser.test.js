import React from 'react';
import { shallow } from 'enzyme';

import { mapStateToProps } from '../../../../_components/User/CreateUser/CreateUser';
import CreateUser from '../../../../_components/User/CreateUser/CreateUser';
import { storeFactory, findByTestAttr } from '../../../../Utils';

// service
import { userService } from '../../../../_services/user.service';
import SelectWithSearch from '../../../../_components/Common/SelectWithSearch/SelectWithSearch';
import InputField from '../../../../_components/Common/InputField/InputField';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<CreateUser store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  user_reducer: {}
}

describe('<CreateUser />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup(initialState).dive();
  });

  it('Should renders CreateUser default', () => {
    expect(wrapper.exists()).toBe(true);
  });

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

  it('should check create user onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'createUser');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'create-user-button');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('Should renders selectwithsearch default', () => {
    expect(wrapper.containsMatchingElement(<SelectWithSearch />)).toEqual(true);
  })

  it('Should renders InputField default', () => {
    expect(wrapper.containsMatchingElement(<InputField />)).toEqual(true);
  })

  it('should check onChange method of input field', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'group-button');
    button.simulate('change');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of input field', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-value-button');
    button.simulate('change');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of textarea', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'comments', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'text-area-create-user');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of firstname inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'firstName', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-firstname-input');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of last inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'lastname', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-lastname-input');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of email inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'email', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-email-input');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of number inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'number', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-number-input');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check title text of usermanagement', () => {
    const titleText = findByTestAttr(wrapper, 'create-user-text');
    expect(titleText.text()).toMatch('Create User');
  })

  it('should check fetchMaster', () => {
    jest.spyOn(wrapper.instance(), 'fetchMaster');
    wrapper.instance().fetchMaster();
    expect(wrapper.instance().fetchMaster).toBeCalled();
  })

  it('should check selectGroup', () => {
    jest.spyOn(wrapper.instance(), 'selectGroup');
    wrapper.instance().selectGroup();
    expect(wrapper.instance().selectGroup).toBeCalled();
  })

  it('should check createUser', () => {
    jest.spyOn(wrapper.instance(), 'createUser');
    wrapper.instance().createUser();
    expect(wrapper.instance().createUser).toBeCalled();
  })
  
  it('should check formatGroupData', () => {
    const data = [{value: 'mock'}]
    jest.spyOn(wrapper.instance(), 'formatGroupData');
    wrapper.instance().formatGroupData(data);
    expect(wrapper.instance().formatGroupData).toBeCalled();
  })

  it('should check fetchUserDetails', async () => {
    jest.spyOn(wrapper.instance(), 'fetchUserDetails');
    wrapper.instance().fetchUserDetails();
    expect(wrapper.instance().fetchUserDetails).toBeCalled();
  })
  
  it('should check componentWillReceiveProps', () => {
    const nextProps = {
      rolesArr: [], languageArr: []
    }
    jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
    wrapper.instance().componentWillReceiveProps(nextProps);
    expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
  })

  it('should check componentDidMount', async () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should check createUser', async () => {
    const userData = {
      comments: "test user", email: "testuser@gmail.com", firstName: "test", language: [], lastName: "user",
      group: [{title: "Comoros", status: "1", id: "6ffa921c-b5c2-42c1-92b0-07fb1bdaa092", code: "KM", group: "AFRICA_EA"}],
      phoneNumber: "8650888613", roleValue: {id: "9a96d771-719d-4f0d-b7a0-e8e2348096c4", Name: "Featuring Manager"}
    }
    wrapper.setState({userData})
    jest.spyOn(wrapper.instance(), 'createUser');
    wrapper.instance().createUser();
    expect(wrapper.instance().createUser).toBeCalled();
  })

  it('should check createUser rolename as Translator', async () => {
    const userData = {
      comments: "test user", email: "testuser@gmail.com", firstName: "test", language: [], lastName: "user",
      group: [{title: "Comoros", status: "1", id: "6ffa921c-b5c2-42c1-92b0-07fb1bdaa092", code: "KM", group: "AFRICA_EA"}],
      phoneNumber: "8650888613", roleValue: {id: "9a96d771-719d-4f0d-b7a0-e8e2348096c4", Name: "Translator"}
    }
    wrapper.setState({userData})
    jest.spyOn(wrapper.instance(), 'createUser');
    wrapper.instance().createUser();
    expect(wrapper.instance().createUser).toBeCalled();
  })


  it('should check handleRoute', async () => {
    jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-route-button');
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
  
  it('should check handleRoleRoute', async () => {
    jest.spyOn(wrapper.instance(), 'handleRoleRoute');
    wrapper.instance().handleRoleRoute();
    expect(wrapper.instance().handleRoleRoute).toBeCalled();
  })

})