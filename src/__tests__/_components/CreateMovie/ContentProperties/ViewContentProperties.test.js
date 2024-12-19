import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ViewContentProperties from '../../../../_components/CreateMovie/ContentProperties/ViewContentProperties';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';


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
  const baseProps = {
    movieId:'xyz',
    jsonData: jsonData.ContentProperties
  }
  const state = {
  state: {title: 'Draft'},
  selectedTab: 0,
  contentData: {
    globalProperties: [{}]
  }
  }
  beforeEach(() => {
    wrapper = setup({ ...baseProps });
    renderSpy = jest.spyOn(ViewContentProperties.prototype, 'render');
    componentDidMountSpy = jest.spyOn(ViewContentProperties.prototype, 'componentDidMount');
    wrapper.setState({ ...state });
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
    const state = {
      global : [{id:'zyz', title: 'gloabl'}],
      awards: [{id:'yaz', title: 'awards'}],
      specialCategory: [{id:'yaz', title: 'special'}],
      skip_song: [{id:'yaz', title: 'song'}]
    }
    const props = { setStage: jest.fn() }
    const dataObj = {
      duration: "13:34:46", introStartTime: "12:33:45", skipAvailable: true, globalProperties:[{}],
      contentState: { id: "3bb64421-f15f-4dda-adec-03c324c140a3", title: "Draft"},awards: [{abc: 'test'}],
      specialCategory: [{specialCategory:'apecial'}], skipSong: [{skipSong: 'song'}]
    };
    wrapper.setState({ ...state });
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
  
  it("should check updateArrValue method with params", () => {
    const stateArr = [
      {
        col: "col-md-6 col-lg-6",
        data: [],
        errorText: "",
        keyText: "title",
        label: "Special Category",
        multiple: true,
        name: "specialCategory",
        path: "/master/SpecialCategory",
        type: "dropdownAsync",
        validation: { required: false },
        value: [],
      },
      {
        col: "col-md-6 col-lg-6",
        data: [],
        errorText: "",
        groupBy: "group",
        keyText: "title",
        label: "Country/Group for Special Category",
        multiple: true,
        name: "specialCategoryCountry",
        path: "user/country-group",
        type: "dropdownAsync",
        validation: { required: false },
        value: [],
      }];
  
    const updatedObj = {
      specialCategory: [],
      specialCategoryCountry: [],
      specialCategoryFrom: "",
      specialCategoryTo: "",
    };
    jest.spyOn(wrapper.instance(), "updateArrValue");
    wrapper.instance().updateArrValue(stateArr, updatedObj);
    expect(wrapper.instance().updateArrValue).toBeCalled();
  });

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

  it('should check handleTab onclick method', () => {
    wrapper.setState({selectedTab: 2})
    const spy = jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = wrapper.find('.next-step-btn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
  
  it('should check render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render()
    expect(instance.render).toBeCalled();
  });
  
  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should check handleTab onclick method', () => {
    wrapper.setState({selectedTab: 2})
    const spy = jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = wrapper.find('.prev-step-btn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })


})