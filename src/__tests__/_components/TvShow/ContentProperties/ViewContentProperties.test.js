import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ViewContentProperties from '../../../../_components/TvShow/ContentProperties/ViewContentProperties';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { collectionService } from '../../../../_services/collection.service';
import { expect, it, jest } from '@jest/globals';
import ViewDetails from '../../../../_components/Common/ViewDetail/ViewDetails';
import jsonData from '../../../../_components/TvShow/Schema/TvShow_StandardJourney_FE_Structure.json';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ViewContentProperties {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ViewContentProperties', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let renderSpy, componentDidMountSpy;
  let baseProps = {
    tvShowId : '916d3c29-ac81-49fe-8071-92ae328facd2',
    handleRoute: jest.fn(),
    selectedTab: 2,
    tvShow:{ 
      specialCategory: [{name:'test'}]
    },
    specialCategory: [
      {name: "specialCategory", type: "dropdownAsync", col: "col-md-6 col-lg-6", value: Array(0), multiple: true},
      {name: "specialCategoryCountry", type: "dropdownAsync", col: "col-md-6 col-lg-6", value: Array(0), multiple: true},
      {name: "specialCategoryFrom", type: "datetime-local", withTime: true, placeholder: "DD/MM/YYYY HH:MM", col: "col-md-6 col-lg-6"},
      {name: "specialCategoryTo", type: "datetime-local", withTime: true, placeholder: "DD/MM/YYYY HH:MM", col: "col-md-6 col-lg-6"}
    ],
    handleTab: jest.fn(),
    jsonData : jsonData
  } 
  const awards = [
    {name: "awardRecipient", type: "SearchableWithCreate", col: "col-md-6 col-lg-6", value: Array(0), multiple: true},
    {name: "awardsCategory", col: "col-md-6 col-lg-6", value: Array(0), type: "dropdownAsync", multiple: true},
    {name: "awardsandrecognition", value: "", col: "col-md-6 col-lg-6", type: "text", label: "Award/Honour"}
  ]
  beforeEach(() => {
    wrapper = setup({...baseProps});
    renderSpy = jest.spyOn(ViewContentProperties.prototype, 'render');
    componentDidMountSpy = jest.spyOn(ViewContentProperties.prototype, 'componentDidMount');
    wrapper.setProps({ ...baseProps });
    wrapper.setState({ awards });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check fetchContentData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchContentData');
    instance.fetchContentData()
    expect(instance.fetchContentData).toBeCalled();
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
  });

  it('should check getControlFieldData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getControlFieldData');
    instance.getControlFieldData()
    expect(instance.getControlFieldData).toBeCalled();
  });

  it('should check componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount()
    expect(instance.componentDidMount).toBeCalled();
  });

  it('should check componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount()
    expect(instance.componentDidMount).toBeCalled();
  });
  
  it('should check updateArrValue', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateArrValue');
    instance.updateArrValue()
    expect(instance.updateArrValue).toBeCalled();
  });

  it('should check handleTab', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleTab');
    instance.handleTab()
    expect(instance.handleTab).toBeCalled();
  });

  it('should check render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render()
    expect(instance.render).toBeCalled();
  });

  it('should check handleRoute onClick method', () => {
    wrapper.find('.MuiButton-containedPrimary').first().simulate('click');
    expect(baseProps.handleRoute).toHaveBeenCalled();
  })

  it('Should renders BadgeBox default', () => {
    expect(wrapper.containsMatchingElement(<ViewDetails />)).toEqual(true);
  })

  it('should check handleTab onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handleTabNext');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
  
  it('should check updatedDataValue', () => {
    const res = [
      {id: "b766058f-9d15-4bf7-911c-3fc383d749d5", tvShowId: "ac303e60-cfe6-43c9-bf08-24955c6b01d7", title: null, shortDescription: null, webDescription: null},
      {id: "f26115a0-2374-445b-a5c4-4da46394e4f4", tvShowId: "ac303e60-cfe6-43c9-bf08-24955c6b01d7", title: null, shortDescription: null, webDescription: null},
      {id: "fed7286c-166f-4295-ba43-845267c15032", tvShowId: "ac303e60-cfe6-43c9-bf08-24955c6b01d7", title: null, shortDescription: null, webDescription: null}
    ]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updatedDataValue');
    instance.updatedDataValue(res);
    expect(instance.updatedDataValue).toBeCalled();
  });

})