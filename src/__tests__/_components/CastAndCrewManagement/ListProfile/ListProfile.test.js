import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from 'moxios';

import ListProfile from '../../../../_components/CastAndCrewManagement/ListProfile/ListProfile';
import { findByTestAttr } from '../../../../Utils';
import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';

import axios from "../../../../_helpers/axiosInstance";
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ListProfile {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ListProfile', () => {
  let wrapper;
  const state = {
    model: {
      btn1: "Yes", btn2: "No", desc: "", detail: "", open: false
    },
    isRequestIntiate: true,
    lastEvaluatedKey: 1,
    maxPage: 2
  }
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup();
    wrapper.setState({ ...state})
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it('Should renders ListProfile default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should check view heading text", () => {
    const titleText = findByTestAttr(wrapper, 'list-profile-heading-text');
    expect(titleText.text()).toMatch('Cast Profiles')
  })

  it('should check filter showdrawer onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'showHideFilterDrawer');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-showfilterdrawer');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check applyFilter onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'applyFilter');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-applyFilter');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check clearFilter onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'clearFilter');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-clearFilter');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-handleRoute');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of multiselect', () => {
    const event = {
      target: {
        value: [{
          id: "783eae8d-eb80-4df7-9b57-ea525ab431a3",
          status: "1", title: "Actor"
        }]
      }
    };
    const filter = {
      fields: [{
        col: "", data: [], display: true, keyText: "title", label: "Cast Type", limitTags: 1, multiple: true,
        name: "castType", path: "/master/CastType", type: "dropdownAsync", validation: {},
        value: [{ id: "783eae8d-eb80-4df7-9b57-ea525ab431a3", status: "1", title: "Actor" }]
      }]
    }
    const wrapper = setup(null, { filter })
    const spy = jest.spyOn(wrapper.instance(), 'handleMultiSelect');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-handleMultiSelect');
    button.simulate('change', event, 0);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of input', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'castName', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-handleChange');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of handleLeftTab', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleLeftTab');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'list-profile-handleLeftTab');
    button.simulate('change');
    expect(spy).toHaveBeenCalled();
  })

  it('Should renders ButtonField default', () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  })

  it('should test handleModel', () => {
    const model = {
      btn1: "Yes", btn2: "No", desc: "", detail: {
        view: 'archive'
      }, open: false
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleModel');
    instance.handleModel(true, model);
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  })

  it('should test handleKeyUp', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleKeyUp');
    instance.handleKeyUp();
    expect(instance.handleKeyUp).toHaveBeenCalledTimes(1);
  })

  it('should test handleKeyPress', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleKeyPress');
    instance.handleKeyPress();
    expect(instance.handleKeyPress).toHaveBeenCalledTimes(1);
  })

  it('should test fetchLeftTabData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchLeftTabData');
    instance.fetchLeftTabData();
    expect(instance.fetchLeftTabData).toHaveBeenCalledTimes(1);
  })

  it('should test fetchListProfile', () => {
    wrapper.setState({ isRequestIntiate: true });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchListProfile');
    instance.fetchListProfile();
    expect(instance.fetchListProfile).toHaveBeenCalledTimes(1);
  })

  it('should test getTagBadge', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getTagBadge');
    instance.getTagBadge();
    expect(instance.getTagBadge).toHaveBeenCalledTimes(1);
  })

  it('should test getListProfile', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getListProfile');
    instance.getListProfile();
    expect(instance.getListProfile).toHaveBeenCalledTimes(1);
  })

  it('should test nextCall', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'nextCall');
    instance.nextCall();
    expect(instance.nextCall).toHaveBeenCalledTimes(1);
  })

  it('should test getAppliedFilter', () => {
    const filter = {
      castTag: [{ title: "Anchor", status: "1", id: "90473cb1-39d4-44cf-90e7-b32b048eea0f" }],
      castType: [{ title: "Actor", status: "1", id: "783eae8d-eb80-4df7-9b57-ea525ab431a3" }],
      castBirthday: 1,
      fields: [{
        col: "", data: [], display: true, keyText: "title", label: "Cast Type", limitTags: 1, multiple: true,
        name: "castType", path: "/master/CastType", type: "dropdownAsync", validation: {},
        value: [{ id: "783eae8d-eb80-4df7-9b57-ea525ab431a3", status: "1", title: "Actor" }]
      }]
    }
    const wrapper = setup(null, { filter })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAppliedFilter');
    instance.getAppliedFilter();
    expect(instance.getAppliedFilter).toHaveBeenCalledTimes(1);
  })

  it('should test handleKeyUp', () => {
    const state = {
      filter: {
        castName: "xyzzzz",
        castTag: [{ title: "Anchor", status: "1", id: "90473cb1-39d4-44cf-90e7-b32b048eea0f" }],
        castType: [{ title: "Actor", status: "1", id: "783eae8d-eb80-4df7-9b57-ea525ab431a3" }],
        fields: [{
          col: "", data: [], display: true, keyText: "title", label: "Cast Type", limitTags: 1, multiple: true,
          name: "castType", path: "/master/CastType", type: "dropdownAsync", validation: {},
          value: [{ id: "783eae8d-eb80-4df7-9b57-ea525ab431a3", status: "1", title: "Actor" }]
        }]
      }
    }
    wrapper.setState({ ...state });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleKeyUp');
    instance.handleKeyUp();
    expect(instance.handleKeyUp).toHaveBeenCalledTimes(1);
  })

  it('should check setSelectDataArr method', () => {
    const state = {
      filter: {
        castName: "xyzzzz",
        castTag: [{ title: "Anchor", status: "1", id: "90473cb1-39d4-44cf-90e7-b32b048eea0f" }],
        castType: [{ title: "Actor", status: "1", id: "783eae8d-eb80-4df7-9b57-ea525ab431a3" }],
        fields: [{
          col: "", data: [], display: true, keyText: "title", label: "Cast Type", limitTags: 1, multiple: true,
          name: "castType", path: "/master/CastType", type: "dropdownAsync", validation: {},
          value: [{ id: "783eae8d-eb80-4df7-9b57-ea525ab431a3", status: "1", title: "Actor" }]
        }]
      }
    }
    const res = [
      {title: "Actor", status: "1", id: "a988da71-245c-4dd5-a0e7-77da447d4101"},
      {title: "Art Direction", status: "1", id: "ce6c59af-85bb-41b2-b39c-4fdb95571b14"},
      {title: "Background Score", status: "1", id: "01f0b5bc-b4e0-47a9-a771-6d1441327051"},
      {title: "Casting", status: "1", id: "72a18e11-afc7-4fde-a610-690b447e64b7"},
      {title: "Character", status: "1", id: "5e871913-cc3c-4304-a8b0-386265670c55"}
    ]
    wrapper.setState({ ...state });
    jest.spyOn(wrapper.instance(), 'setSelectDataArr');
    wrapper.instance().setSelectDataArr(res, 0);
    expect(wrapper.instance().setSelectDataArr).toBeCalled();
  })

  it('should check archiveServerCalls', () => {
    jest.spyOn(wrapper.instance(), 'archiveServerCalls');
    wrapper.instance().archiveServerCalls();
    expect(wrapper.instance().archiveServerCalls).toBeCalled();
  })

  it('should check handleConditionRoute method for view', () => {
    jest.spyOn(wrapper.instance(), 'handleConditionRoute');
    wrapper.instance().handleConditionRoute('view');
    expect(wrapper.instance().handleConditionRoute).toBeCalled();
  })
  
  it('should check handleConditionRoute method for edit', () => {
    jest.spyOn(wrapper.instance(), 'handleConditionRoute');
    wrapper.instance().handleConditionRoute('edit');
    expect(wrapper.instance().handleConditionRoute).toBeCalled();
  })
  
  it('should check handleConditionRoute method for create', () => {
    jest.spyOn(wrapper.instance(), 'handleConditionRoute');
    wrapper.instance().handleConditionRoute('create');
    expect(wrapper.instance().handleConditionRoute).toBeCalled();
  })
  
  it('should check handleConditionRoute method for archive', () => {
    jest.spyOn(wrapper.instance(), 'handleConditionRoute');
    wrapper.instance().handleConditionRoute('archive');
    expect(wrapper.instance().handleConditionRoute).toBeCalled();
  })
  
  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })
  
  it('should check getAllStatus', () => {
    jest.spyOn(wrapper.instance(), 'getAllStatus');
    wrapper.instance().getAllStatus();
    const response = [
      {title: "Archived", status: "1", id: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51"},
      {title: "Changed", status: "1", id: "38c34c4f-68c9-4eb0-b71f-b80f1e551447"},
      {title: "Draft", status: "1", id: "3bb64421-f15f-4dda-adec-03c324c140a3"}
    ];
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().allStatus.length()).toEqual(0);
        done();
      });
    });
  })
  
  it('should check getListProfileQueryParams', () => {
    jest.spyOn(wrapper.instance(), 'getListProfileQueryParams');
    wrapper.instance().getListProfileQueryParams();
    expect(wrapper.instance().getListProfileQueryParams).toBeCalled();
  })

})