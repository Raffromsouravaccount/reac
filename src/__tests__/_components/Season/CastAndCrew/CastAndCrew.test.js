import React from 'react';
import { shallow } from 'enzyme';
import { expect, it, jest } from '@jest/globals';

import CastAndCrew from './../../../../../src/_components/Season/CastAndCrew/CastAndCrew';
import jsonData from '../../../../_components/Season/Schema/Season_StandardJourney_FE_Structure.json'
import { findByTestAttr } from '../../../../Utils';

const setup = (props = {}, state = null) => {
  const component = shallow(<CastAndCrew {...props} />)
  if (state) component.setState(state);
  return component;
}

describe('<CastAndCrew/>', () => {
  let component, mockFunc;
  const baseProps = {
    jsonData :jsonData
  }
  beforeEach(() => {
    mockFunc = jest.fn()
    component = setup({...baseProps});
  });
  it('Should renders ContentProperties default', () => {
    expect(component.exists()).toBe(true);
  })

  it('Should set component state as per props passed', () => {
    const selectedTab = 1, tvShowId = 123, seasonId= 234;
    const component = setup({...baseProps}, { selectedTab, tvShowId, seasonId })
    expect(component.state().selectedTab).toEqual(1);
    expect(component.state().tvShowId).toEqual(123);
    expect(component.state().seasonId).toEqual(234);
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
    instance.handleSearchableInput(null, 0, 0, 'actor' );
    expect(instance.handleSearchableInput).toBeCalled();
  })


  it('should check handleSave method', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'handleSave');
    instance.handleSave(0, 0, 'actor' );
    expect(instance.handleSave).toBeCalled();
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
    instance.handleSearchableInput();
    expect(instance.handleSearchableInput).toBeCalled();
  })

  it('should check checkError', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'checkError');
    instance.checkError();
    expect(instance.checkError).toBeCalled();
  })

  it('should check componentDidMount', () => {
    const mockSet  = {
      tvShowId:'123',
      seasonId:'12345',
      viewOnly: true
    }
    component.setState({...mockSet});
    const instance = component.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should check updatedDataValue', () => {
    const globalPropertiesData = [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Sponsors",
      multiple: true, name: "cdad2189-ffbe-41c2-914a-cb92ffb457a5", type: "SearchableWithCreate", validation: { required: false, isChar: true },
      value: []
    }]
    const response = { "3bb64421-f15f-4dda-adec-03c324c140a3": [{
      actor: {id: "ead0e7e2-0f30-4466-97bc-c7e8e28cbe88", castName: "Test Cast"},
      character: ""
    }]}
    component.setState({ globalPropertiesData })
    jest.spyOn(component.instance(), 'updatedDataValue');
    component.instance().updatedDataValue(response);
    expect(component.instance().updatedDataValue).toBeCalled();
  })

  it('should check formatData', () => {
    const mockSet = {
      hasValue : true
    }
    component.setState ( {
      ...mockSet
    })
    const formatData = false;
    jest.spyOn(component.instance(), 'formatData');
    component.instance().formatData();
    expect(component.instance().formatData).toBeCalled();
  })

  it('should check addRemoveMultipleFields', () => {
    const name = 'actors';
    jest.spyOn(component.instance(), 'addRemoveMultipleFields');
    component.instance().addRemoveMultipleFields(name, 1);
    expect(component.instance().addRemoveMultipleFields).toBeCalled();
  })

  it('should check addRemoveMultipleFields with 0 index', () => {
    const name = 'actors';
    jest.spyOn(component.instance(), 'addRemoveMultipleFields');
    component.instance().addRemoveMultipleFields(name, 0);
    expect(component.instance().addRemoveMultipleFields).toBeCalled();
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


})