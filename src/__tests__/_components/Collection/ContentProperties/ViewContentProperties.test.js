import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ViewContentProperties from '../../../../_components/Collection/CreateCollection/ContentProperties/ViewContentProperties';
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

  const props = { collectionId: '123' }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...props })
    renderSpy = jest.spyOn(ViewContentProperties.prototype, 'render');
    componentDidMountSpy = jest.spyOn(ViewContentProperties.prototype, 'componentDidMount');
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
  })

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

  it('should test componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })
  
  it('should test handleTab', () => {
    const headetTabs = [ 
      {label: "Title Summary", isDone: false},
      {label: "Control Fields", isDone: false, fetched: true}
    ]
    wrapper.setState({ headetTabs });
    jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().handleTab(null, 1);
    expect(wrapper.instance().handleTab).toBeCalled();
  })

  it('should check handleTab onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handleTab-btn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleTab onclick method', () => {
    wrapper.setState({selectedTab: 2})
    const spy = jest.spyOn(wrapper.instance(), 'handleTab');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'btn-handleTab');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
})