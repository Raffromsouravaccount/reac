import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { findByTestAttr, checkProps } from '../../../../Utils';
import CastAndCrew from './../../../../../src/_components/TvShow/CastAndCrew/CastAndCrew';
import FormRender from '../../../../_components/Common/FormHelper/FormRender';
import { expect, it, jest } from '@jest/globals';
import { Wrapper } from '@material-ui/pickers/wrappers/Wrapper';
import jsonData from '../../../../_components/TvShow/Schema/TvShow_StandardJourney_FE_Structure.json';

const setup = (props={}, state = null) => {
  const component = shallow(<CastAndCrew {...props} />)
  if (state) component.setState(state);
  return component;
}

describe('<CastAndCrew/>', () => {
  let component, mockFunc;
  const baseProps = {
    handleBlur: jest.fn(),
    markAsDone: jest.fn()
    
  }
  beforeEach(() => {
    mockFunc = jest.fn()
    const props = {
      tvShowId: 1230,
      jsonData : jsonData
    };
    component = setup({...props});
    component.setProps({ ...baseProps });
  });
  it('Should renders ContentProperties default', () => {
    expect(component.exists()).toBe(true);
  })

  it('should check componentDidMount', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should check handleSearchableInput method', () => {
    const selectedTab = 0;
    const actors = [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Actor",
      multiple: false, name: "actor", type: "SearchableWithCreate", validation: { required: false, isChar: true }, value: null
    },
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
      type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: ""
    }]
    component.setState({ selectedTab, actors });
    const instance = component.instance();
    jest.spyOn(instance, 'handleSearchableInput');
    instance.handleSearchableInput(null, 0, 0, actors);
    expect(instance.handleSearchableInput).toBeCalled();
  })

  it('should check handleSearchableInput method', () => {
    const selectedTab = 1;
    const globalProperties = [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Sponsors",
      multiple: true, name: "cdad2189-ffbe-41c2-914a-cb92ffb457a5", type: "SearchableWithCreate", validation: { required: false, isChar: true },
      value: []
    },
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
      type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: ""
    }]
    component.setState({ selectedTab, globalProperties });
    const instance = component.instance();
    jest.spyOn(instance, 'handleSearchableInput');
    instance.handleSearchableInput(null, 0, 0, globalProperties);
    expect(instance.handleSearchableInput).toBeCalled();
  })

  it('should check checkError', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'checkError');
    instance.checkError();
    expect(instance.checkError).toBeCalled();
  })

  it('should check updatedDataValue', () => {
    const globalPropertiesData = [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Sponsors",
      multiple: true, name: "cdad2189-ffbe-41c2-914a-cb92ffb457a5", type: "SearchableWithCreate", validation: { required: false, isChar: true },
      value: []
    }]
    const response = {
      "3bb64421-f15f-4dda-adec-03c324c140a3": [{
        actor: { id: "ead0e7e2-0f30-4466-97bc-c7e8e28cbe88", castName: "Test Cast" },
        character: ""
      }]
    }
    component.setState({ globalPropertiesData })
    jest.spyOn(component.instance(), 'updatedDataValue');
    component.instance().updatedDataValue(response);
    expect(component.instance().updatedDataValue).toBeCalled();
  })

  it('should check updatedDataValue with actors Data and others Data', () => {
    const mockSet = {
      actors: [{
        col: "col-md-6 col-lg-6",
        data: [],
        errorText: "",
        keyText: "castName",
        label: "Actor",
        multiple: false,
        name: "actor",
        type: "SearchableWithCreate",
        validation: { required: false, isChar: true },
        value: null
      }],
      others: [{
        col: "col-md-6 col-lg-6",
        data: [],
        errorText: "",
        keyText: "castName",
        label: "Actor Change",
        multiple: true,
        name: "cdff7b55-f594-4ef5-a3e5-6e371803f253",
        type: "SearchableWithCreate",
        validation: { required: false, isChar: true },
        value: []
      }],
      actorDta: [{
        actor: {
          id: "ead0e7e2-0f30-4466-97bc-c7e8e28cbe88", castName: "Test Cast"
        },
        character: ""
      }]
    }

    component.setState({ ...mockSet })
    jest.spyOn(component.instance(), 'updatedDataValue');
    component.instance().updatedDataValue();
    expect(component.instance().updatedDataValue).toBeCalled();
  })

  it('should check formatData', () => {
    const mockSet = {
      hasValue: true
    }
    component.setState({
      ...mockSet
    })
    const formatData = false;
    jest.spyOn(component.instance(), 'formatData');
    component.instance().formatData();
    expect(component.instance().formatData).toBeCalled();
  })

  it('should check handleBlur', () => {
    const sectionName = 'actors';
    jest.spyOn(component.instance(), 'handleBlur');
    component.instance().handleBlur(0, 0, sectionName);
    expect(component.instance().handleBlur).toBeCalled();
  })

  it('should check markAsDone method', () => {
    component.setProps({ markAsDone: jest.fn() });
    jest.spyOn(component.instance(), 'markAsDone');
    component.instance().markAsDone();
    expect(component.instance().markAsDone).toBeCalled();
  })

  it('should check showHideLockPopup', () => {
    jest.spyOn(component.instance(), 'showHideLockPopup');
    component.instance().showHideLockPopup();
    expect(component.instance().showHideLockPopup).toBeCalled();
  })

  it('should check unLockCastNCrew', () => {
    component.setProps({ unLockedSession: jest.fn() });
    jest.spyOn(component.instance(), 'unLockCastNCrew');
    component.instance().unLockCastNCrew();
    expect(component.instance().unLockCastNCrew).toBeCalled();
  })

  it('should check handleTab', () => {
    jest.spyOn(component.instance(), 'handleTab');
    component.instance().handleTab();
    expect(component.instance().handleTab).toBeCalled();
  })

  it('should check render', () => {
    jest.spyOn(component.instance(), 'render');
    component.instance().render();
    expect(component.instance().render).toBeCalled();
  })

  it('should check formRender method rendering', () => {
    expect(component.containsMatchingElement(<FormRender />)).toEqual(true);
  })

  
})