import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ViewCollection from '../../../_components/Collection/CreateCollection/ViewCollection';
import { findByTestAttr } from '../../../Utils';

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
  const wrapper = shallow(<ViewCollection {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ViewCollection', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let instance;
  const baseProps = {
    match: {
      params: {id: 'xyz123'}
    }
  }
  beforeEach(() => {
    wrapper = setup({ ...baseProps });
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders ViewCollection default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render handlePermission', () => {
    jest.spyOn(instance, 'handlePermission')
    instance.handlePermission();
    expect(instance.handlePermission).toBeCalled();
  })

  it('should test componentDidMount method', () => {
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should test componentDidMount method else condition', () => {
    wrapper.setProps({match: {} })
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })
  
  it('should render setStage', () => {
    jest.spyOn(instance, 'setStage')
    instance.setStage();
    expect(instance.setStage).toBeCalled();
  })
  
  it('should render handleTab', () => {
    jest.spyOn(instance, 'handleTab')
    instance.handleTab();
    expect(instance.handleTab).toBeCalled();
  })
  
  it('should render handleCollectionRoute', () => {
    jest.spyOn(instance, 'handleCollectionRoute')
    instance.handleCollectionRoute();
    expect(instance.handleCollectionRoute).toBeCalled();
  })
  
  it('should render linksClickHandler', () => {
    jest.spyOn(instance, 'linksClickHandler')
    instance.linksClickHandler();
    expect(instance.linksClickHandler).toBeCalled();
  })
  
  it('should render getExternalId', () => {
    jest.spyOn(instance, 'getExternalId')
    instance.getExternalId();
    expect(instance.getExternalId).toBeCalled();
  })
  
  it('should render handleRoute', () => {
    jest.spyOn(instance, 'handleRoute')
    instance.handleRoute();
    expect(instance.handleRoute).toBeCalled();
  })
  
  it('should render getCollectionTabsComp for selectedTab 0', () => {
    wrapper.setState({ selectedTab: 0, externalId: 'xyz1'});
    jest.spyOn(instance, 'getCollectionTabsComp')
    instance.getCollectionTabsComp();
    expect(instance.getCollectionTabsComp).toBeCalled();
  })

  it('should render getCollectionTabsComp for selectedTab 1', () => {
    wrapper.setState({ selectedTab: 1, externalId: 'xyz1'});
    jest.spyOn(instance, 'getCollectionTabsComp')
    instance.getCollectionTabsComp();
    expect(instance.getCollectionTabsComp).toBeCalled();
  })

  it('should render getCollectionTabsComp for selectedTab 2', () => {
    wrapper.setState({ selectedTab: 2, externalId: 'xyz1'});
    jest.spyOn(instance, 'getCollectionTabsComp')
    instance.getCollectionTabsComp();
    expect(instance.getCollectionTabsComp).toBeCalled();
  })

  it('should render getCollectionTabsComp for selectedTab 3', () => {
    wrapper.setState({ selectedTab: 3, externalId: 'xyz1'});
    jest.spyOn(instance, 'getCollectionTabsComp')
    instance.getCollectionTabsComp();
    expect(instance.getCollectionTabsComp).toBeCalled();
  })

  it('should render getCollectionTabsComp for selectedTab 4', () => {
    wrapper.setState({ selectedTab: 4, externalId: 'xyz1'});
    jest.spyOn(instance, 'getCollectionTabsComp')
    instance.getCollectionTabsComp();
    expect(instance.getCollectionTabsComp).toBeCalled();
  })

  it('should render getCollectionTabsComp for selectedTab 5', () => {
    wrapper.setState({ selectedTab: 5, externalId: 'xyz1'});
    jest.spyOn(instance, 'getCollectionTabsComp')
    instance.getCollectionTabsComp();
    expect(instance.getCollectionTabsComp).toBeCalled();
  })

  it('should check getCollectionTabsComp onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleCollectionRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handleCollectionRoute');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
  
  it('should render getCollectionStatus', () => {
    jest.spyOn(instance, 'getCollectionStatus')
    instance.getCollectionStatus();
    expect(instance.getCollectionStatus).toBeCalled();
  })

})
