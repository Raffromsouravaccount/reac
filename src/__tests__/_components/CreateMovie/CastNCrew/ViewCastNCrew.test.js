import React from 'react';
import { shallow, mount } from 'enzyme';
import { storeFactory } from './../../../../Utils';
import ViewCastAndCrew from './../../../../_components/CreateMovie/CastNCrew/ViewCastNCrew';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';
import { expect, it, jest } from '@jest/globals';

const setup = (initialstate = {}, props = {}) => {
  const store = storeFactory(initialstate);
  const wrapper = shallow(<ViewCastAndCrew store={store} {...props} />).dive();
  return wrapper;
}
const initialState = {
  movieMgmt_reducer: {}
}

describe('render ViewCastAndCrew', () => {
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
      movieId: 123
    },
    jsonData: jsonData?.CastNCrew
  }
  beforeEach(() => {
    wrapper = setup(initialState, { ...props }).dive();
    wrapper.setState({movieId: '123'});
  })

  it('Should renders ContentProperties default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check populateDataToState', () => {
    const others = {
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
    const castCrewData = {
      '3bb64421-f15f-4dda-adec-03c324c140a3': [
        {
          actor: {
            castName: "Cast testing",
            id: "c677733c-9383-409e-bd40-4ad9eb074741"
          },
          character: "test test"
        }
      ]
    }
    wrapper.setState({ others });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'populateDataToState');
    instance.populateDataToState(castCrewData);
    expect(instance.populateDataToState).toBeCalled();
  })

  it('should test componentDidMount method', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should test componentWillUnmount method', () => {
    jest.spyOn(wrapper.instance(), 'componentWillUnmount');
    wrapper.instance().componentWillUnmount();
    expect(wrapper.instance().componentWillUnmount).toBeCalled();
  })

})