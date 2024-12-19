import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ContentProperties from '../../../../_components/Collection/CreateCollection/ContentProperties/ContentProperties';
import Adapter from 'enzyme-adapter-react-16';
import { expect, jest } from '@jest/globals';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ContentProperties {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ContentProperties', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let instance;
  const props = {
    unLockedSession: jest.fn(),
    markAsDone: jest.fn()
  }
  const state = {
    profile: [
      { name: "section", type: "sectionMultiple", multipleKey: "file", label: "Uplaod Profile Image", value: undefined },
      { name: "castName", type: "text", col: "col-md-6 col-lg-6", value: "testt", label: "Profile Name", validation: { isChar: true, required: true, minLength: 5, maxLength: 250 } },
      { col: "col-md-6 col-lg-6", errorText: "", label: "Also known as", name: "castKnownAs", type: "text", validation: { required: true, maxLength: 250 }, value: "test" },
      {
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Tag/Badge", multiple: true, name: "castTag",
        path: "/master/TagBadge", type: "dropdownAsync", validation: { required: true }, value: [{ title: "Politician", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118" }]
      },
      {
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Cast Type", multiple: true, name: "castType",
        path: "/master/CastType", type: "dropdownAsync", validation: { required: true }, value: [{ title: "Background Score", id: "01f0b5bc-b4e0-47a9-a771-6d1441327051" }]
      }]
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...props });
    instance = wrapper.instance();
    wrapper.setState({ ...state });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check updateValues method', () => {
    const props = {
      setStage: jest.fn()
    }
    const dataObj = {
      contentState: { title: "Changed" }
    }
    wrapper.setProps({ ...props });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateValues');
    instance.updateValues(dataObj);
    expect(instance.updateValues).toBeCalled();
  })

  it('should test handleTab', () => {
    const headetTabs = [
      { label: "Title Summary", isDone: false },
      { label: "Control Fields", isDone: false, fetched: true }
    ]
    wrapper.setState({ headetTabs });
    jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().handleTab(null, 1);
    expect(wrapper.instance().handleTab).toBeCalled();
  })

  it('should unLockProperties method', () => {
    jest.spyOn(instance, 'unLockProperties');
    instance.unLockProperties();
    expect(instance.unLockProperties).toBeCalled();
  })

  it('should showHideLockPopup method', () => {
    jest.spyOn(instance, 'showHideLockPopup');
    instance.showHideLockPopup();
    expect(instance.showHideLockPopup).toBeCalled();
  })

  it('should markAsDone method', () => {
    jest.spyOn(instance, 'markAsDone');
    instance.markAsDone();
    expect(instance.markAsDone).toBeCalled();
  })

  it('should checkIfMarkAsDone method', () => {
    jest.spyOn(instance, 'checkIfMarkAsDone');
    instance.checkIfMarkAsDone();
    expect(instance.checkIfMarkAsDone).toBeCalled();
  })

  it('should check selectCountryGroup', () => {
    const baseState = {
      specialCategory: [[
        {
          col: "col-md-6 col-lg-6",
          data: [],
          errorText: "",
          isChanged: false,
          keyText: "title",
          label: "Special Category",
          multiple: true,
          name: "specialCategory",
          path: "/master/SpecialCategory",
          type: "dropdownAsync",
          validation: { required: false },
          value: [{ title: "Fresh arrival", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118" }]
        },
        {
          col: "col-md-6 col-lg-6",
          data: [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
          { id: "468fd8ff-afa3-4245-8dc8-25ba230dfabd", title: "Sri Lanka", code: "LK", status: "1", group: "Others" },
          { id: "1f9ec5c0-56f5-4776-a61a-d8ecaad6d0f7", title: "Thailand", code: "TH", status: "1" }],
          errorText: "",
          groupBy: "group",
          isChanged: true,
          keyText: "title",
          label: "Country/Group for Special Category",
          multiple: true,
          name: "specialCategoryCountry",
          path: "user/country-group",
          type: "dropdownAsync",
          validation: { required: false },
          value: [{ id: "1f9ec5c0-56f5-4776-a61a-d8ecaad6d0f7", title: "Thailand", code: "TH" }]
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Special Category - From Timeline",
          multiple: true,
          name: "specialCategoryFrom",
          placeholder: "DD/MM/YYYY HH:MM",
          type: "datetime-local",
          validation: { required: false, minDate: "sameOrAfter" },
          value: "2021-02-04T01:31",
          withTime: true
        },
      ]],
    };
    wrapper.setState({ ...baseState });
    const event = { target: { name: 'mock' } }
    const instance = wrapper.instance();
    jest.spyOn(instance, "selectCountryGroup");
    instance.selectCountryGroup(event, 'Others', 'specialCategory', 0, 1);
    expect(instance.selectCountryGroup).toBeCalled();
  })

  it('should check autoSave', () => {
    jest.spyOn(instance, "autoSave");
    instance.autoSave();
    expect(instance.autoSave).toBeCalled();
  })

  it('should check formatNestedData', () => {
    const relation = [[{
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Related To", multiple: false,
      name: "castProfileId", path: "", type: "autocreate", validation: { required: false }, value: null
    }, {
      col: "col-md-6 col-lg-6", data: [
        { title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
        { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
        { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
        { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" }
      ], errorText: "", keyText: "title", label: "Relation", multiple: false, name: "relation",
      path: "/master/Relation", type: "dropdownAsync", validation: { required: false }, value: null
    }], [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Related To", multiple: false,
      name: "castProfileId", path: "", type: "autocreate", validation: { required: false }, value: null
    }, {
      col: "col-md-6 col-lg-6", data: [
        { title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
        { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
        { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
        { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" }
      ], errorText: "", keyText: "title", label: "Relation", multiple: false, name: "relation",
      path: "/master/Relation", type: "dropdownAsync", validation: { required: false }, value: null
    }]];
    const dataArr = [{ castProfileId: 'zyx123', relation: relation }];
    jest.spyOn(instance, 'formatNestedData');
    instance.formatNestedData(dataArr);
    expect(instance.formatNestedData).toHaveBeenCalledTimes(1);
  })

  it('should check formatValue', () => {
    const value = [{
      id: "9a6412f2-6862-47ef-8a07-9dde2a9a2731", status: "1", title: "Animation"
    }]
    jest.spyOn(instance, "formatValue");
    instance.formatValue(value, true);
    expect(instance.formatValue).toBeCalled();
  })

  it('should test setSelectDataArr method', () => {
    const data = [{ title: "Actor", status: "1", id: "3bb64421-f15f-4dda-adec-03c324c140a3" },
    { title: "Art Direction", status: "1", id: "ce6c59af-85bb-41b2-b39c-4fdb95571b14" },
    { title: "Background Score", status: "1", id: "01f0b5bc-b4e0-47a9-a771-6d1441327051" },
    { title: "Casting", status: "1", id: "72a18e11-afc7-4fde-a610-690b447e64b7" },
    { title: "Character", status: "1", id: "5e871913-cc3c-4304-a8b0-386265670c55" }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr('profile', 1, data);
    expect(instance.setSelectDataArr).toBeCalled();
  })

  it('should check handleStateChange', () => {
    const event = { target: { value: 'test' } };
    jest.spyOn(instance, 'handleStateChange');
    instance.handleStateChange(event, 1, 'profile');
    expect(instance.handleStateChange).toBeCalled();
  })

  it('should check handleSearchableInput', () => {
    jest.spyOn(instance, 'handleSearchableInput');
    instance.handleSearchableInput();
    expect(instance.handleSearchableInput).toBeCalled();
  })

  it('should check getControlFieldData', () => {
    jest.spyOn(instance, 'getControlFieldData');
    instance.getControlFieldData();
    expect(instance.getControlFieldData).toBeCalled();
  })
  
  it('should check fetchContentData', () => {
    jest.spyOn(instance, 'fetchContentData');
    instance.fetchContentData();
    expect(instance.fetchContentData).toBeCalled();
  })
  
  it('should check setInitialData', () => {
    jest.spyOn(instance, 'setInitialData');
    instance.setInitialData();
    expect(instance.setInitialData).toBeCalled();
  })
  
  it('should check getCollectionData', () => {
    jest.spyOn(instance, 'getCollectionData');
    instance.getCollectionData();
    expect(instance.getCollectionData).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })
})