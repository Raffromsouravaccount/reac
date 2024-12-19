import React from 'react';
import { shallow, mount } from 'enzyme';

import UserListing from '../../../_components/User/UserListing';
import { findByTestAttr } from '../../../Utils';
import { CommonModel } from '../../../_components/Common/Model/CommonModel';

// Service
import { userService } from '../../../_services/user.service';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<UserListing {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<UserManagement />', () => {
  const filters = {
    searchVal: "", sort: "descending", fields: [
      {
        col: "", data: [{
          createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
          createdOn: "2021-02-03T05:51:05.552Z",
          created_by: { first_name: "Jaipal", last_name: "Singh" },
          description: "this is description",
          id: "9a96d779-719d-4f0d-b7a0-e8e2348096c0",
          modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1"
        }],
        display: true, keyText: "name", label: "Role Name", limitTags: 1, multiple: true,
        name: "role", path: "/roles", type: "dropdownAsync", validation: {}, value: []
      }, {
        col: "", data: [], display: true, groupBy: "group", keyText: "title", label: "Country Group",
        limitTags: 1, multiple: true, name: "group", path: "/master/CountryGroup", type: "dropdownAsync",
        validation: {}, value: []
      },
      {
        col: "", data: [], display: false, keyText: "title", label: "Translation Language", limitTags: 1,
        multiple: true, name: "language", path: "/master/Language", type: "dropdownAsync", validation: {}, value: []
      }, {
        areaLabel: "status", col: "", data: [], display: true, label: "Status", labelPlacement: "end",
        name: "userStatus", type: "radio", validation: {}, value: null
      }
    ]
  }
  let wrapper;
  const filteredUsers = [{ value: 'mock' }]
  beforeEach(() => {
    wrapper = setup(null, { filteredUsers });
  });

  it('Should renders UserManagement default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('Should check input field', () => {
    const inputField = wrapper.find('input');
    expect(inputField.exists()).toBe(true);
  })

  it('should check onChange method of input field', () => {
    const event = { target: { name: 'searchVal', value: 'test' } };
    const user = mount(<UserListing />);
    const handleChange = jest.spyOn(user.instance(), 'handleChange');
    user.update(); // <--- Needs this to force re-render
    const userInput = user.find('input');
    userInput.simulate('change', event);

    expect(handleChange).toBeCalled();
  })

  it('should check title text of usermanagement', () => {
    const titleText = findByTestAttr(wrapper, 'user-title-text');
    expect(titleText.text()).toMatch('User Management');
  })

  it('should check sort showdrawer onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'showHideSortDrawer');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-sort-drawer');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check filter showdrawer onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'showHideFilterDrawer');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-filter-drawer');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check clearSort onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'clearSort');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'user-clear-sort');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

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

  it('Should renders commonmodel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('should check handlePagination method', () => {
    jest.spyOn(wrapper.instance(), 'handlePagination');
    wrapper.instance().handlePagination();
    expect(wrapper.instance().handlePagination).toBeCalled();
  })

  it('should check activateDeactivateUser method', () => {
    const currentUser = {
      userStatus: "1", id: "0ce9e4fb-76f5-4ff6-913f-649ab413bd9d"
    }
    wrapper.setState({ currentUser });
    jest.spyOn(wrapper.instance(), 'activateDeactivateUser');
    wrapper.instance().activateDeactivateUser();
    expect(wrapper.instance().activateDeactivateUser).toBeCalled();
  })

  it('should check clearFilter method', () => {
    wrapper.setState({ filters });
    jest.spyOn(wrapper.instance(), 'clearFilter');
    wrapper.instance().clearFilter();
    expect(wrapper.instance().clearFilter).toBeCalled();
  })

  it('should check showHideStatePopup', () => {
    jest.spyOn(wrapper.instance(), 'showHideStatePopup');
    wrapper.instance().showHideStatePopup();
    expect(wrapper.instance().showHideStatePopup).toBeCalled();
  })

  it('should check handleMultiSelect', () => {
    wrapper.setState({ filters })
    const event = {
      target: {
        value: [{
          createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
          createdOn: "2021-02-03T05:51:05.552Z", created_by: { first_name: "Jaipal", last_name: "Singh" },
          description: "this is description", id: "9a96d779-719d-4f0d-b7a0-e8e2348096c0",
          modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1", modifiedOn: "2021-02-03T05:51:05.552Z",
          modified_by: { first_name: "Jaipal", last_name: "Singh" }, name: "Content Manager"
        }]
      }
    }
    jest.spyOn(wrapper.instance(), 'handleMultiSelect');
    wrapper.instance().handleMultiSelect(event, 0);
    expect(wrapper.instance().handleMultiSelect).toBeCalled();
  })

  it('should check sortData', () => {
    const sort = [{
      comments: "test translate", countries: [], createdOn: "2021-01-19T11:19:37.875Z",
      created_by: { first_name: "jaipal", last_name: "Singh" }, email: "sandeepkumar13009@gmail.com",
      firstName: "test", id: "0ce9e4fb-76f5-4ff6-913f-649ab413bd9d", lastLogin: "2021-01-28T08:07:54.622Z",
      lastName: "translate", modifiedOn: "2021-02-05T10:02:43.715Z", modified_by: { first_name: "Sandeep", last_name: "Kumar" },
      phone: "8650888613", role: { name: "Translator", permission: [] }, roleId: "9a96d773-719d-4f0d-b7a0-e8e2348096c7",
      translationLanguages: [], userStatus: "2"
    }, {
      comments: "Kellton user", countries: [], createdOn: "2021-01-19T09:45:04.233Z", created_by: { first_name: "Jaipal", last_name: "Singh" },
      email: "akshit.Khajuria@kelltontech.com", firstName: "Akshit", id: "de17ce3c-eb7f-42ec-bcfc-18a0a74fc767", lastLogin: "2021-02-05T06:48:25.492Z",
      lastName: "Khajuria", modifiedOn: "2021-02-03T12:20:34.595Z", modified_by: { first_name: "Akshit", last_name: "Khajuria" }, phone: "8823640267",
      role: { name: "Tech Analyst", permission: [] }, roleId: "9a96d776-719d-4f0d-b7a0-e8e234809610", translationLanguages: [], userStatus: "1"
    }]
    jest.spyOn(wrapper.instance(), 'sortData');
    wrapper.instance().sortData(sort);
    expect(wrapper.instance().sortData).toBeCalled();
  })

  it('should check sortData', () => {
    const filters = {
      searchVal: "", sort: "ascending", fields: [
        {
          col: "", data: [{
            createdBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1", createdOn: "2021-02-03T05:51:05.552Z",
            created_by: { first_name: "Jaipal", last_name: "Singh" }, description: "this is description",
            id: "9a96d779-719d-4f0d-b7a0-e8e2348096c0", modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1"
          }], display: true, keyText: "name", label: "Role Name", limitTags: 1, multiple: true,
          name: "role", path: "/roles", type: "dropdownAsync", validation: {}, value: []
        }, {
          col: "", data: [], display: true, groupBy: "group", keyText: "title", label: "Country Group",
          limitTags: 1, multiple: true, name: "group", path: "/master/CountryGroup", type: "dropdownAsync",
          validation: {}, value: []
        },
        {
          col: "", data: [], display: false, keyText: "title", label: "Translation Language", limitTags: 1,
          multiple: true, name: "language", path: "/master/Language", type: "dropdownAsync", validation: {}, value: []
        }, {
          areaLabel: "status", col: "", data: [], display: true, label: "Status", labelPlacement: "end",
          name: "userStatus", type: "radio", validation: {}, value: null
        }
      ]
    }
    wrapper.setState({ filters })
    const sort = [{
      comments: "test translate", countries: [], createdOn: "2021-01-19T11:19:37.875Z",
      created_by: { first_name: "jaipal", last_name: "Singh" }, email: "sandeepkumar13009@gmail.com",
      firstName: "test", id: "0ce9e4fb-76f5-4ff6-913f-649ab413bd9d", lastLogin: "2021-01-28T08:07:54.622Z",
      lastName: "translate", modifiedOn: "2021-02-05T10:02:43.715Z", modified_by: { first_name: "Sandeep", last_name: "Kumar" },
      phone: "8650888613", role: { name: "Translator", permission: [] }, roleId: "9a96d773-719d-4f0d-b7a0-e8e2348096c7",
      translationLanguages: [], userStatus: "2"
    }, {
      comments: "Kellton user", countries: [], createdOn: "2021-01-19T09:45:04.233Z", created_by: { first_name: "Jaipal", last_name: "Singh" },
      email: "akshit.Khajuria@kelltontech.com", firstName: "Akshit", id: "de17ce3c-eb7f-42ec-bcfc-18a0a74fc767", lastLogin: "2021-02-05T06:48:25.492Z",
      lastName: "Khajuria", modifiedOn: "2021-02-03T12:20:34.595Z", modified_by: { first_name: "Akshit", last_name: "Khajuria" }, phone: "8823640267",
      role: { name: "Tech Analyst", permission: [] }, roleId: "9a96d776-719d-4f0d-b7a0-e8e234809610", translationLanguages: [], userStatus: "1"
    }]
    jest.spyOn(wrapper.instance(), 'sortData');
    wrapper.instance().sortData(sort);
    expect(wrapper.instance().sortData).toBeCalled();
  })

  it('should check filterData without params', () => {
    jest.spyOn(wrapper.instance(), 'filterData');
    wrapper.instance().filterData(null);
    expect(wrapper.instance().filterData).toBeCalled();
  })

  it('should check filterData with sort as param', () => {
    wrapper.setState({filterHighLight: true})
    jest.spyOn(wrapper.instance(), 'filterData');
    wrapper.instance().filterData('sort');
    expect(wrapper.instance().filterData).toBeCalled();
  })

  it('should check filterData with filter as param', () => {
    wrapper.setState({filterHighLight: true})
    jest.spyOn(wrapper.instance(), 'filterData');
    wrapper.instance().filterData('filter');
    expect(wrapper.instance().filterData).toBeCalled();
  })
  
  it('should check setSelectDataArr', () => {
    jest.spyOn(wrapper.instance(), 'setSelectDataArr');
    wrapper.instance().setSelectDataArr(null, 1);
    expect(wrapper.instance().setSelectDataArr).toBeCalled();
  })
  
  it('should check selectGroup', () => {
    jest.spyOn(wrapper.instance(), 'selectGroup');
    wrapper.instance().selectGroup();
    expect(wrapper.instance().selectGroup).toBeCalled();
  })

  it('should check getAllUsers', () => {
    jest.spyOn(wrapper.instance(), 'getAllUsers');
    wrapper.instance().getAllUsers();
    expect(wrapper.instance().getAllUsers).toBeCalled();
  })
  
  it('should check checkIfSubArrayExist', () => {
    jest.spyOn(wrapper.instance(), 'checkIfSubArrayExist');
    wrapper.instance().checkIfSubArrayExist();
    expect(wrapper.instance().checkIfSubArrayExist).toBeCalled();
  })

})
