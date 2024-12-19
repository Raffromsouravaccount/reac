import React from 'react';
import { shallow } from 'enzyme';

import CreateProfile from '../../../../_components/CastAndCrewManagement/CreateProfile/CreateProfile';
import { storeFactory, findByTestAttr } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<CreateProfile store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
}

describe('CreateProfile', () => {
  let wrapper;
  const state = {
    profileData: { castAwards: null, castBackground: null, castBirthPlace: null, castBirthday: null, castCareer: null, castKnownAs: "test 1", castName: "testt" },
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
      }],
    relation: [[{
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
    }]],
    canMarkAsDone: true,
    castProfileId: '123'
  }
  const event = { target: { name: 'mock', value: 'test' } };
  const stateArr = [
    {
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Related To", multiple: false,
      name: "castProfileId", path: "", type: "autocreate", validation: { required: false }, value: null
    },
    {
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Relation", multiple: false,
      name: "relation", path: "/master/Relation", type: "dropdownAsync", validation: { required: false }, value: null
    }];
    const updatedObj = {
      castName: "testt", castProfileId: "8dd36d1f-7b4e-4512-95d3-44c597c04af4", relation: "44348a32-5051-4c4d-a980-67680924e024", relationTitle: "Grandmother"
    }
  beforeEach(() => {
    wrapper = setup(initialState);
    wrapper.setState({ ...state });
  });

  it('Should renders CreateProfile default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test addRemoveRelation', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'addRemoveRelation');
    instance.addRemoveRelation(0);
    expect(instance.addRemoveRelation).toHaveBeenCalledTimes(1);
  })

  it('should test addRemoveRelation index > 0', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'addRemoveRelation');
    instance.addRemoveRelation(2);
    expect(instance.addRemoveRelation).toHaveBeenCalledTimes(1);
  })

  it('should test updateDataValue method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateDataValue');
    instance.updateDataValue(stateArr, updatedObj);
    expect(instance.updateDataValue).toHaveBeenCalledTimes(1);
  })

  it('should test checkIfMarkAsDone method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkIfMarkAsDone');
    instance.checkIfMarkAsDone();
    expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
  })

  it('should test autoSave method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'autoSave');
    instance.autoSave();
    expect(instance.autoSave).toHaveBeenCalledTimes(1);
  })

  it('should test getAllRelatedData method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAllRelatedData');
    instance.getAllRelatedData();
    expect(instance.getAllRelatedData).toHaveBeenCalledTimes(1);
  })

  it('should test checkError method', () => {
    const data = [{
      col: "col-md-6 col-lg-6",
      data: [{ title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
      { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
      { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
      { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" },
      { title: "Father in law", status: "1", id: "ed7e5314-accf-423d-887c-d36b00a57b18" },
      { title: "Grandfather", status: "1", id: "39f0f2a5-e5ff-4d6d-ab52-2476d3db0e8b" }],
      errorText: "",
      keyText: "title",
      label: "Relation",
      multiple: false,
      name: "relation",
      path: "/master/Relation",
      type: "dropdown",
      validation: { required: false },
      value: null
    }];
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkError');
    const checkRequired = true;
    instance.checkError(data, checkRequired);
    expect(instance.checkError).toHaveBeenCalledTimes(1);
  })

  it('should test getFile method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getFile');
    instance.getFile();
    expect(instance.getFile).toHaveBeenCalledTimes(1);
  })

  it('should test setSelectDataArr method without rootIndex', () => {
    const data = [{ title: "Actor", status: "1", id: "3bb64421-f15f-4dda-adec-03c324c140a3" },
    { title: "Art Direction", status: "1", id: "ce6c59af-85bb-41b2-b39c-4fdb95571b14" },
    { title: "Background Score", status: "1", id: "01f0b5bc-b4e0-47a9-a771-6d1441327051" },
    { title: "Casting", status: "1", id: "72a18e11-afc7-4fde-a610-690b447e64b7" },
    { title: "Character", status: "1", id: "5e871913-cc3c-4304-a8b0-386265670c55" }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr('profile', null, 4, data);
    expect(instance.setSelectDataArr).toBeCalled();
  })

  it('should test setSelectDataArr method', () => {
    const data = [{ title: "Actor", status: "1", id: "3bb64421-f15f-4dda-adec-03c324c140a3" },
    { title: "Art Direction", status: "1", id: "ce6c59af-85bb-41b2-b39c-4fdb95571b14" },
    { title: "Background Score", status: "1", id: "01f0b5bc-b4e0-47a9-a771-6d1441327051" },
    { title: "Casting", status: "1", id: "72a18e11-afc7-4fde-a610-690b447e64b7" },
    { title: "Character", status: "1", id: "5e871913-cc3c-4304-a8b0-386265670c55" }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr('profile', 0, 1, data);
    expect(instance.setSelectDataArr).toBeCalled();
  })

  it('should test formatData method', () => {
    const data = [{
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      keyText: "castName",
      label: "Related To",
      multiple: false,
      name: "castProfileId",
      path: "",
      type: "autocreate",
      validation: { required: false },
      value: null
    },
    {
      col: "col-md-6 col-lg-6",
      data: (14)[{ title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
        { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
        { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
        { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" },
        { title: "Father in law", status: "1", id: "ed7e5314-accf-423d-887c-d36b00a57b18" },
        { title: "Grandfather", status: "1", id: "39f0f2a5-e5ff-4d6d-ab52-2476d3db0e8b" }],
      errorText: "",
      keyText: "title",
      label: "Relation",
      multiple: false,
      name: "relation",
      path: "/master/Relation",
      type: "dropdown",
      validation: { required: false },
      value: null
    }];
    const instance = wrapper.instance();
    jest.spyOn(instance, 'formatData');
    instance.formatData(data, true);
    expect(instance.formatData).toHaveBeenCalledTimes(1);
  })

  it('should check formatNestedData', () => {
    const dataArr = [{ castProfileId: 'zyx123', relation: state?.relation }];
    const instance = wrapper.instance();
    jest.spyOn(instance, 'formatNestedData');
    instance.formatNestedData(dataArr);
    expect(instance.formatNestedData).toHaveBeenCalledTimes(1);
  })

  it('should check formatAllData', () => {
    const checkRequired = true;
    const instance = wrapper.instance();
    jest.spyOn(instance, 'formatAllData');
    instance.formatAllData(checkRequired);
    expect(instance.formatAllData).toHaveBeenCalledTimes(1);
  })

  it('should check unlockProfile', () => {
    const props = {
      unLockedSession: jest.fn()
    }
    wrapper.setProps({ ...props });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'unlockProfile');
    instance.unlockProfile();
    expect(instance.unlockProfile).toHaveBeenCalledTimes(1);
  })

  it('should check showHideLockPopup', () => {
    jest.spyOn(wrapper.instance(), 'showHideLockPopup');
    wrapper.instance().showHideLockPopup();
    expect(wrapper.instance().showHideLockPopup).toBeCalled();
  })

  it('should check markAsDone', () => {
    wrapper.setProps({ markAsDone: jest.fn() });
    jest.spyOn(wrapper.instance(), 'markAsDone');
    wrapper.instance().markAsDone();
    expect(wrapper.instance().markAsDone).toBeCalled();
  })

  it('should check handleAutoCreate', () => {
    jest.spyOn(wrapper.instance(), 'handleAutoCreate');
    wrapper.instance().handleAutoCreate(event, 0, 0, 'relation');
    expect(wrapper.instance().handleAutoCreate).toBeCalled();
  })

  it('should check handleInputForAutoCreate', async () => {
    jest.spyOn(wrapper.instance(), 'handleInputForAutoCreate');
    wrapper.instance().handleInputForAutoCreate();
    expect(wrapper.instance().handleInputForAutoCreate).toBeCalled();
  })

  it('should check handleAutoCreate without rootIndex', () => {
    jest.spyOn(wrapper.instance(), 'handleAutoCreate');
    wrapper.instance().handleAutoCreate(event, null, 1, 'relation');
    expect(wrapper.instance().handleAutoCreate).toBeCalled();
  })

  it('should check onFileChange method', () => {
    const event = {
      target: {
        files: {
          0: {
            lastModified: '1611690882219', lastModifiedDate: 'Wed Jan 27 2021 01:24:42 GMT+0530 (India Standard Time)',
            name: "download.jpg", size: '6671', type: "image/jpeg", webkitRelativePath: ""
          }
        }
      }
    };
    jest.spyOn(wrapper.instance(), 'onFileChange');
    wrapper.instance().onFileChange(event);
    expect(wrapper.instance().onFileChange).toBeCalled();
  })

  it('should check handleStateChange method with published staged', () => {
    wrapper.setState({ stage: 'Published' });
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, 0, 0, 'relation');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check handleStateChange method with unpublished staged', () => {
    wrapper.setState({ stage: 'Unpublished' });
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, 0, 0, 'relation');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check markAsDone method', () => {
    const currentTabData = {
      isLocked: false
    }
    wrapper.setProps({ currentTabData });
    const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'markAsDone-btn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleStateChange method', () => {
    const currentTabData = {
      isLocked: false
    }
    wrapper.setProps({ currentTabData });
    const spy = jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'formrender-comp');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check addRemoveRelation method', () => {
    const currentTabData = {
      isLocked: false
    }
    wrapper.setProps({ currentTabData });
    const spy = jest.spyOn(wrapper.instance(), 'addRemoveRelation');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'buttonField').first();
    button.simulate('click', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check setRelationData', () => {
    const profileData = {
      castRelationship: [
        { relation: "44348a32-5051-4c4d-a980-67680924e024", castProfileId: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", relationTitle: "Grandmother", castName: "testt" },
        { relation: "44348a32-5051-4c4d-a980-67680924e024", castProfileId: "8dd36d1f-7b4e-4512-95d3-44c597c04af4", relationTitle: "Grandmother", castName: "testt" },
        { castName: "xyz", relation: "44348a32-5051-4c4d-a980-67680924e024", relationTitle: "Grandmother" }]
    }
    jest.spyOn(wrapper.instance(), 'setRelationData');
    wrapper.instance().setRelationData(profileData);
    expect(wrapper.instance().setRelationData).toBeCalled();
  })

  it('should check updateRelationData', () => {
    jest.spyOn(wrapper.instance(), 'updateRelationData');
    wrapper.instance().updateRelationData(stateArr, updatedObj);
    expect(wrapper.instance().updateRelationData).toBeCalled();
  })

  it('should check getProfileData', () => {
    jest.spyOn(wrapper.instance(), 'getProfileData');
    wrapper.instance().getProfileData();
    expect(wrapper.instance().getProfileData).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

});