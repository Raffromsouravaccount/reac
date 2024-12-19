import React from 'react';
import { shallow } from 'enzyme';

import CastAndCrewView from '../../../../_components/TvShow/CastAndCrew/ViewCastAndCrew';
import jsonData from '../../../../_components/TvShow/Schema/TvShow_StandardJourney_FE_Structure.json';


const setup = ( props = {}) => {
  const wrapper = shallow(<CastAndCrewView {...props} />);
  return wrapper;
}

describe('render', () => {
  let wrapper;
  const baseProps = {
    jsonData : jsonData
  }
  beforeEach(() => {
    wrapper = setup({...baseProps});
  })
  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check the handleTab method', () => {
    const wrapper = setup({...baseProps});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleTab');
    instance.handleTab();
    expect(instance.handleTab).toBeCalled();
  })

  it('should check componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should check fetchContentData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchContentData');
    instance.fetchContentData();
    expect(instance.fetchContentData).toBeCalled();
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
    wrapper.setState({ globalPropertiesData })
    jest.spyOn(wrapper.instance(), 'updatedDataValue');
    wrapper.instance().updatedDataValue(response);
    expect(wrapper.instance().updatedDataValue).toBeCalled();
  })

  it('should check updatedDataValue with actors Data and others Data', () => {
    const mockSet = {
              actors : [{
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
                }],
              others : [{
                col: "col-md-6 col-lg-6",
                data: [],
                errorText: "",
                keyText: "castName",
                label: "Actor Change",
                multiple: true,
                name: "cdff7b55-f594-4ef5-a3e5-6e371803f253",
                type: "SearchableWithCreate",
                validation: {required: false, isChar: true},
                value: []
              }],
          actorDta : [{
            actor:{
              id: "ead0e7e2-0f30-4466-97bc-c7e8e28cbe88", castName: "Test Cast"
            },
            character: ""
          }] 
    }
   
    wrapper.setState({ ...mockSet })
    jest.spyOn(wrapper.instance(), 'updatedDataValue');
    wrapper.instance().updatedDataValue();
    expect(wrapper.instance().updatedDataValue).toBeCalled();
  })

  it('should check render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toBeCalled();
  })

});