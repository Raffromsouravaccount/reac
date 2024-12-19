import React from 'react';
import { shallow } from 'enzyme';

import { mapStateToProps } from '../../../_components/RoleManagement/RoleListing';
import RoleListing from '../../../_components/RoleManagement/RoleListing';
import { findByTestAttr, storeFactory } from '../../../Utils';
import { CommonModel } from '../../../_components/Common/Model/CommonModel';

// Service
import { userService } from '../../../_services/user.service';
import { userActions } from '../../../_actions/user.action';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<RoleListing store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  user_reducer: {}
}

describe('RoleManagement', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup(initialState).dive();
  });

  it('Should renders RoleManagement default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('Should check input field', () => {
    const inputField = wrapper.find('.auto-search');
    expect(inputField.exists()).toBe(true);
  });

  it('Should renders commonmodel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('Should get success user roles action', async () => {
    const expectedPosts = [
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" },
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    userActions.fetch_roles_action = mock;
    const result = await userActions.fetch_roles_action();
    expect(result).toBe(expectedPosts);
  })

  it('Should get success user roles service', async () => {
    const expectedPosts = [
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" },
      { id: "e6627741-91ba-4333-9981-8f124c0b2e11", firstName: "Test" }
    ]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    userService.fetch_roles_service = mock;
    const result = await userService.fetch_roles_service();
    expect(result).toBe(expectedPosts);
  })

  it('should check filter showdrawer onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'showHideFilterDrawer');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-filter-drawer');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check title text of usermanagement', () => {
    const titleText = findByTestAttr(wrapper, 'role-title-text');
    expect(titleText.text()).toMatch('Role Management');
  })

  it('should check filter showdrawer onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'showHideFilterDrawer');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-filter-data');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check filter onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'filterData');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-filter-data');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of input field', () => {
    const event = { target: { name: 'searchVal', value: 'test' } };
    const handleFilter = jest.spyOn(wrapper.instance(), 'handleFilter');
    wrapper.update(); // <--- Needs this to force re-render
    const roleInput = wrapper.find('input');
    roleInput.simulate('change', event);

    expect(handleFilter).toBeCalled();
  })

  it('search text is echoed', () => {
    const searchVal = "test";
    wrapper.setState({ searchVal });
    const InputBox = wrapper.find('input');
    InputBox.simulate('click');
    wrapper.update();

    expect(wrapper.state('searchVal')).toBe("test");
  });

  it('change status set value in state', () => {
    const status = "1";
    wrapper.setState({ status });
    const changeStatusButton = findByTestAttr(wrapper, 'role-change-status');
    const event = { target: { name: 'status', value: '1' } };
    changeStatusButton.simulate('change', event);
    wrapper.update();

    expect(wrapper.state('status')).toBe("1");
  });

  it('should check clear filter onclick', () => {
    const spy = jest.spyOn(wrapper.instance(), 'clearFilter');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-clear-filter');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('Should paper render', () => {
    const cardWrapper = wrapper.find('.card-wrap');
    expect(cardWrapper.exists()).toBe(true);
  });

  it('Should show states in store as required', () => {
    const intialState = {
      user_reducer: {
        rolesArr: [{ id: "e6627741-91ba-4333-9981-8f124c0b2e11", name: "Test 1" }]
      }
    };
    expect(mapStateToProps(intialState).allRolesData).toEqual([{ id: "e6627741-91ba-4333-9981-8f124c0b2e11", name: "Test 1" }]);
  })

  it('open common model set value in state', () => {
    const showStatePopup = true;
    wrapper.setState({ showStatePopup });
    const changeStatusButton = wrapper.find('.card-wrap');;
    changeStatusButton.simulate('click');
    wrapper.update();
    expect(wrapper.state('showStatePopup')).toBe(true);
  });

  it("should check componentDidMount", () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should check getAllRolesData', () => {
    jest.spyOn(wrapper.instance(), 'getAllRolesData');
    wrapper.instance().getAllRolesData();
    expect(wrapper.instance().getAllRolesData).toBeCalled();
  })

  it('should check showHideStatePopup', () => {
    jest.spyOn(wrapper.instance(), 'showHideStatePopup');
    wrapper.instance().showHideStatePopup();
    expect(wrapper.instance().showHideStatePopup).toBeCalled();
  })

  it('should check activateDeactivateRole', () => {
    const currentRoleDetails = {
      createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
      createdOn: "2021-02-03T05:51:05.552Z",
      created_by: { first_name: "Jaipal", last_name: "Singh" },
      description: "this is description",
      id: "9a96d772-719d-4f0d-b7a0-e8e2348096c6",
      modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
      modifiedOn: "2021-02-08T08:57:53.842Z",
      modified_by: { first_name: "Sandeep", last_name: "Kumar" },
      name: "SEO Expert",
      permission: [],
      status: "0"
    }
    wrapper.setState({ currentRoleDetails });
    jest.spyOn(wrapper.instance(), 'activateDeactivateRole');
    wrapper.instance().activateDeactivateRole();
    expect(wrapper.instance().activateDeactivateRole).toBeCalled();
  })

  it('should check handlePage', () => {
    jest.spyOn(wrapper.instance(), 'handlePage');
    wrapper.instance().handlePage();
    expect(wrapper.instance().handlePage).toBeCalled();
  })

  it('should check handleRoute', () => {
    jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  })


})