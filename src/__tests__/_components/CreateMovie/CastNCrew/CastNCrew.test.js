import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';
import { storeFactory, findByTestAttr } from './../../../../Utils';
import CastAndCrew from './../../../../_components/CreateMovie/CastNCrew/CastNCrew';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';

import { expect, it, jest } from '@jest/globals';
import axios from "../../../../_helpers/axiosInstance";


const setup = (initialstate = {}, props = {}) => {
  const store = storeFactory(initialstate);
  const wrapper = shallow(<CastAndCrew store={store} {...props} />).dive();
  return wrapper;
}
const initialState = {
  movieMgmt_reducer: {}
}

describe('render wrapper', () => {
  let wrapper;
  const props = {
    currentTabData: {
      isDone: false,
      isLocked: false,
      label: "Cast & Crew",
      lockedBy: "",
      permissionKey: "movies",
      permissionName: "canUpdate",
      permissionSubKey: "castNCrewModule",
      properties: true,
      quickFiling: false,
      singleLanding: false,
    },
    markDoneEnabled: true,
    jsonData: jsonData.CastNCrew
  }
  const state = {
    markDoneEnabled: true,
    status: 'Draft',
    movieId: 123
  }

  beforeEach(() => {
    const wrapperInstance = setup(initialState, {...props }).dive();
    wrapper = wrapperInstance;
    wrapper.setState({ ...state });
    moxios.install(axios);
  })
  afterEach(() => {
    moxios.uninstall(axios);
  });


  it('Should renders ContentProperties default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check updateSection', () => {
    const section = {
      attributes: [{
        col: "col-md-6 col-lg-6", data: [], error: false, errorMsg: false,
        errorText: "", keyText: "castName", label: "Host/Anchorman", multiple: true,
        name: "72dab561-6c03-4634-ab6f-f5268f716211", type: "SearchableWithCreate",
        validation: { required: false, isChar: true }, value: []
      }, {
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName",
        label: "Lyricist", multiple: true, name: "88a65fb3-ee63-42ad-97ba-53e340120800",
        type: "SearchableWithCreate", validation: { required: false, isChar: true },
        value: []
      }]
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateSection');
    instance.updateSection(section, 1);
    expect(instance.updateSection).toBeCalled();
  })

  it('should check validateActor', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'validateActor');
    instance.validateActor();
    expect(instance.validateActor).toBeCalled();
  })

  it('should check handleBlurEvent', () => {
    wrapper.setState({isLocked: true})
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleBlurEvent');
    instance.handleBlurEvent();
    expect(instance.handleBlurEvent).toBeCalled();
  })

  it('should check render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toBeCalled();
  })

  it('should check componentWillUnmount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentWillUnmount');
    instance.componentWillUnmount();
    expect(instance.componentWillUnmount).toBeCalled();
  })

  it('should check enableFields', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'enableFields');
    instance.enableFields();
    expect(instance.enableFields).toBeCalled();
  })

  it('should check updateMarkDoneStatus', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateMarkDoneStatus');
    instance.updateMarkDoneStatus();
    expect(instance.updateMarkDoneStatus).toBeCalled();
  })

  it('should check componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should test unlockCastCrew', () => {
    wrapper.setProps({ unLockedSession: jest.fn() })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'unlockCastCrew');
    instance.unlockCastCrew();
    expect(instance.unlockCastCrew).toHaveBeenCalledTimes(1);
  });

  it('should check toggleModel', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'toggleModel');
    instance.toggleModel();
    expect(instance.toggleModel).toBeCalled();
  })

  it('should check setAction', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setAction');
    instance.setAction();
    expect(instance.setAction).toBeCalled();
  })

  it('should check validateElement', () => {
    const section = {
      attributes: [{
        col: "col-md-6 col-lg-6", data: [], error: false, errorMsg: false,
        errorText: "", keyText: "castName", label: "Host/Anchorman", multiple: true,
        name: "72dab561-6c03-4634-ab6f-f5268f716211", type: "SearchableWithCreate",
        validation: { required: false, isChar: true }, value: []
      }, {
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName",
        label: "Lyricist", multiple: true, name: "88a65fb3-ee63-42ad-97ba-53e340120800",
        type: "SearchableWithCreate", validation: { required: false, isChar: true },
        value: []
      }]
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'validateElement');
    instance.validateElement(section, 0);
    expect(instance.validateElement).toBeCalled();
  })

  it('should check validateActor', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'validateActor');
    instance.validateActor();
    expect(instance.validateActor).toBeCalled();
  })


  it('should check resetElementErrorStatus', () => {
    const element = {
      col: "col-md-6 col-lg-6",
      data:[{
        castName: "testt", id: "8dd36d1f-7b4e-4512-95d3-44c597c04af4"
      }],
      error: false,
      errorMsg: false,
      errorText: "",
      isChanged: false,
      keyText: "castName",
      label: "Actor",
      multiple: false,
      name: "actor",
      type: "SearchableWithCreate",
      validation: {required: false, isChar: true},
      value: {castName: "testt"}
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'resetElementErrorStatus');
    instance.resetElementErrorStatus(element, 1);
    expect(instance.resetElementErrorStatus).toBeCalled();
  })

  it('should check validateActor', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'validateActor');
    instance.validateActor();
    expect(instance.validateActor).toBeCalled();
  })

  it('should check populateDataToState', () => {
    const castCrewData = {
      "3bb64421-f15f-4dda-adec-03c324c140a3":[
        {
          actor:{
            castName: "test"
          },
          character: ""
        }
      ]
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'populateDataToState');
    instance.populateDataToState(castCrewData, 1);
    expect(instance.populateDataToState).toBeCalled();
  })
  
  it('should check handleKeyPress', () => {
    const actors = {
      attributes: [{
        actor:{
          col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Actor", multiple: false, name: "actor",
          type: "SearchableWithCreate", validation: {required: false, isAlphaNumericWithSpecialChars: true},
          value: {castName: "testt", id: "8dd36d1f-7b4e-4512-95d3-44c597c04af4"}
        },
        character: {
          col: "col-md-6 col-lg-6", errorText: "", label: "Character", maxLength: 250, multiple: false,name: "character",type: "text",
          validation: {required: false, isChar: true, maxLength: 250}, value: "test",  label: "Actors", multiple: true,
          name: "3bb64421-f15f-4dda-adec-03c324c140a3"
        }
      }]
    }
    const event = {target: {value: 'test', name: 'handleKeyPress'}, key: 'Enter'}
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleKeyPress');
    instance.handleKeyPress(event, 0, 'actors', 'character');
    expect(instance.handleKeyPress).toBeCalled();
  })

  it('should check manageActors', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'manageActors');
    instance.manageActors();
    expect(instance.manageActors).toBeCalled();
  })

  it('should check manageActors if condition as index 0', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'manageActors');
    instance.manageActors(null, 0);
    expect(instance.manageActors).toBeCalled();
  })

  it('should check manageActors for isLocked', () => {
    wrapper.setState({isLocked: true});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'manageActors');
    instance.manageActors(null, 0);
    expect(instance.manageActors).toBeCalled();
  })

  it('should check handleBlurEvent else condition', () => {
    const actors = {
      attributes: [{
        actor:{
          col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Actor", multiple: false, name: "actor",
          type: "SearchableWithCreate", validation: {required: false, isAlphaNumericWithSpecialChars: true},
          value: {castName: "testt", id: "8dd36d1f-7b4e-4512-95d3-44c597c04af4"}
        },
        character: {
          col: "col-md-6 col-lg-6", errorText: "", label: "Character", maxLength: 250, multiple: false,name: "character",type: "text",
          validation: {required: false, isChar: true, maxLength: 250}, value: "test",  label: "Actors", multiple: true,
          name: "3bb64421-f15f-4dda-adec-03c324c140a3"
        }
      },
      {
        actor:{
          col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Actor", multiple: false, name: "actor",
          type: "SearchableWithCreate", validation: {required: false, isAlphaNumericWithSpecialChars: true},
          value: {castName: "testt", id: "8dd36d1f-7b4e-4512-95d3-44c597c04af4"}
        },
        character: {
          col: "col-md-6 col-lg-6", errorText: "", label: "Character", maxLength: 250, multiple: false,name: "character",type: "text",
          validation: {required: false, isChar: true, maxLength: 250}, value: "test",  label: "Actors", multiple: true,
          name: "3bb64421-f15f-4dda-adec-03c324c140a3"
        }
      }]
    }
    wrapper.setState({ actors });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleBlurEvent');
    instance.handleBlurEvent(null, 1, 'actors', true);
    expect(instance.handleBlurEvent).toBeCalled();
  })

  it('should check addActor', () => {
    const actorsData = {
      attributes:[
        {
          actor:{
            col: "col-md-6 col-lg-6",
            data: [],
            errorText: "",
            keyText: "castName",
            label: "Actor",
            multiple: false,
            name: "actor",
            type: "SearchableWithCreate",
            validation: {required: false, isChar: true},
            value: null
          }
        }
      ]
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'addActor');
    instance.addActor(actorsData, 1);
    expect(instance.addActor).toBeCalled();
  })
  
  it('should test markDone', () => {
    wrapper.setProps({ markAsDone: jest.fn() })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'markDone');
    instance.markDone();
    expect(instance.markDone).toHaveBeenCalledTimes(1);
  });

  it('should test inputSearchHandler method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'inputSearchHandler');
    instance.inputSearchHandler('test', 0, 'actors', true);
    expect(instance.inputSearchHandler).toBeCalled();
  })

  it('should test inputSearchHandler method else condition', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'inputSearchHandler');
    instance.inputSearchHandler(null, 0, 'actors');
    expect(instance.inputSearchHandler).toBeCalled();
  })
  
  it('should test updateCastCrew method', () => {
    wrapper.setState({ action: 'POST '});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateCastCrew');
    instance.updateCastCrew();
    expect(instance.updateCastCrew).toBeCalled();
  })
  
  it('should test updateChangeStatus method', () => {
    const element= {
      data: [], error: false, errorMsg: false, errorText: "", isChanged: false, keyText: "castName", label: "Actor", multiple: false,
      name: "actor", type: "SearchableWithCreate", validation: {required: false, isAlphaNumericWithSpecialChars: true}, value: {castName: "testt 2"}
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateChangeStatus');
    instance.updateChangeStatus(element);
    expect(instance.updateChangeStatus).toBeCalled();
  })
  
  it('should test resetElement method', () => {
    const element= {
      data: [], error: false, errorMsg: false, errorText: "", isChanged: false, keyText: "castName", label: "Actor", multiple: true,
      name: "actor", type: "dropDown", validation: {required: false, isAlphaNumericWithSpecialChars: true}, value: {castName: "testt 2"}
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'resetElement');
    instance.resetElement(element);
    expect(instance.resetElement).toBeCalled();
  })

  it('should test resetElement method for if condition', () => {
    const element= {
      data: [], error: false, errorMsg: false, errorText: "", isChanged: false, keyText: "castName", label: "Actor", multiple: false,
      name: "actor", type: "text", validation: {required: false, isAlphaNumericWithSpecialChars: true}, value: {castName: "testt 2"}
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'resetElement');
    instance.resetElement(element);
    expect(instance.resetElement).toBeCalled();
  })

  it('should test handleMultiSelect', () => {
    wrapper.setState({ isLocked: true });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMultiSelect');
    instance.handleMultiSelect();
    expect(instance.handleMultiSelect).toBeCalled();
  })

  it('should test handleChange', () => {
    wrapper.setState({ isLocked: true });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleChange');
    instance.handleChange();
    expect(instance.handleChange).toBeCalled();
  })

  it('should test handleChange for else', () => {
    const event = {target: {value: 'text'}}
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleChange');
    instance.handleChange(event, 0, 'actors', 'character');
    expect(instance.handleChange).toBeCalled();
  })

  it('should test handleChange for status published', () => {
    wrapper.setState({status: 'Published'})
    const event = {target: {value: 'text'}}
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleChange');
    instance.handleChange(event, 0, 'actors', 'character');
    expect(instance.handleChange).toBeCalled();
  })

  it('should test handleChange for status Unpublished', () => {
    wrapper.setState({status: 'Unpublished'})
    const event = {target: {value: 'text'}}
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleChange');
    instance.handleChange(event, 0, 'actors', 'character');
    expect(instance.handleChange).toBeCalled();
  })
  
  it('should test handleChange for status Submit to Review', () => {
    wrapper.setState({status: 'Submit to Review'})
    const event = {target: {value: 'text'}}
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleChange');
    instance.handleChange(event, 0, 'actors', 'character');
    expect(instance.handleChange).toBeCalled();
  })
  
  it('should test getMovieDetails', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getMovieDetails');
    instance.getMovieDetails();
    expect(instance.getMovieDetails).toBeCalled();
  })

  it('should check markDone onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'markDone');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'markDoneBtn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

})