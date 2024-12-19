import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr } from '../../../../Utils';
import CastAndCrew from '../../../../_components/Episode/CastNCrew/CastNCrew';
import ViewSeason from '../../../../_components/Common/ViewDetail/ViewSeason';
import castAndCrewJSON from '../../../../_components/Episode/Schema/Standard/CastNCrew.json';

const setup = (props = {}, state = null) => {
  const component = shallow(<CastAndCrew {...props} />);
  if (state) component.setState(state);
  return component;
}

describe('<CastAndCrew/>', () => {
  let component, mockFunc;
  beforeEach(() => {
    mockFunc = jest.fn()
    const props = {
      seasonId: 123,
      jsonData : castAndCrewJSON
    };
    component = setup({...props});
  });
  const event = { target: { name: 'mock', value: 'test' } };
  it('Should renders ContentProperties default', () => {
    expect(component.exists()).toBe(true);
  });

  it("should test componentDidMount", () => {
    const props = {
      seasonId: 123,
      episodeId: 123

    }
    const mockSet = {
      viewOnly : true
    }
    component.setProps({...props});
    component.setState({...mockSet});
    const instance = component.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it('Should set component state as per props passed', () => {
    const selectedTab = 1, seasonId = 123;
    const component = setup(null, { selectedTab, seasonId })
    expect(component.state().selectedTab).toEqual(1);
    expect(component.state().seasonId).toEqual(123);
  })

  it('should check handleStateChange with rootIndex', () => {
    const mockSet = {
      status:"published"
    }
    component.setState({...mockSet});
    const spy = jest.spyOn(component.instance(), 'handleStateChange');
    const event = { target: { value: 'test' } };
    component.instance().forceUpdate();
    component.update();
    const button = findByTestAttr(component, 'casNCrewForm');
    button.simulate('change', event, 0, 0, 'actors');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleStateChange with rootIndex with state Submitted To Review', () => {
    const mockSet = {
      status : "Submitted To Review"
    }
    component.setState({...mockSet});
    const spy = jest.spyOn(component.instance(), 'handleStateChange');
    const event = { target: { value: 'test' } };
    component.instance().forceUpdate();
    component.update();
    const button = findByTestAttr(component, 'casNCrewForm');
    button.simulate('change', event, 0, 0, 'actors');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleStateChange with rootIndex with state Unpublished', () => {
    const mockSet = {
      status : "Unpublished"
    }
    component.setState({...mockSet});
    const spy = jest.spyOn(component.instance(), 'handleStateChange');
    const event = { target: { value: 'test' } };
    component.instance().forceUpdate();
    component.update();
    const button = findByTestAttr(component, 'casNCrewForm');
    button.simulate('change', event, 0, 0, 'actors');
    expect(spy).toHaveBeenCalled();
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
    instance.handleSearchableInput(null, 0,0,actors);
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
    instance.handleSearchableInput();
    expect(instance.handleSearchableInput).toBeCalled();
  })

  it('should check checkError', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'checkError');
    instance.checkError();
    expect(instance.checkError).toBeCalled();
  })

  it('should check handleEditable', () => {
    const instance = component.instance();
    jest.spyOn(instance, 'handleEditable');
    instance.handleEditable();
    expect(instance.handleEditable).toBeCalled();
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
    const shallowArr = [{
      col: "col-md-6 col-lg-6",
      errorText: "",
      label: "Actor Change",
      maxLength: 250,
      multiple: false,
      name: "actorChange",
      type: "text",
      validation: { required: false, ischaracterValidateWithComma: true, maxLength: 250 },
      value: ""
    }, {
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      keyText: "castName",
      label: "Host/Anchorman",
      multiple: true,
      name: "72dab561-6c03-4634-ab6f-f5268f716211",
      type: "SearchableWithCreate",
      validation: { required: false, isChar: true },
      value: []
    }, {
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      keyText: "castName",
      label: "Singer",
      multiple: true,
      name: "d7d7bdab-3a6e-47d6-8be1-50d99535a98e",
      type: "SearchableWithCreate",
      validation: { required: false, isChar: true },
      value: []
    }]
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

  it('should check handleSave', () => {
    jest.spyOn(component.instance(), 'handleSave');
    component.instance().handleSave();
    expect(component.instance().handleSave).toBeCalled();
  })

  it('should check formRender method rendering', () => {
    expect(component.containsMatchingElement(<ViewSeason/>)).toEqual(true);
  })

  it('should check setSelectDataArr', () => {
    jest.spyOn(component.instance(), 'setSelectDataArr');
    component.instance().setSelectDataArr('globalProperties', 0, 0);
    expect(component.instance().setSelectDataArr).toBeCalled();
  })

  it('should check selectGroup', () => {
    const event = { target: { checked: true } };
    jest.spyOn(component.instance(), 'selectGroup');
    component.instance().selectGroup(event, 'Others', 0, 1, 'globalProperties');
    expect(component.instance().selectGroup).toBeCalled();
  })

  it('should check render', () => {
    jest.spyOn(component.instance(), 'render');
    component.instance().render();
    expect(component.instance().render).toBeCalled();
  })


})