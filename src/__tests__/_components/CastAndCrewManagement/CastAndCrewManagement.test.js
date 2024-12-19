import React from 'react';
import { shallow, mount } from 'enzyme';

import CastAndCrewManagement from '../../../_components/CastAndCrewManagement/CastAndCrewManagement';
import { findByTestAttr } from '../../../Utils';

import LeftTab from '../../../_components/Common/LeftTab/CommonLeftTab';
import QuickLinks from '../../../_components/Common/QuickLinks/QuickLinks';
// Service

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CastAndCrewManagement {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<CastAndCrewManagement />', () => {
  let wrapper;
  const state = {
    defaultTab: {selectedTab: 1},
    selectedTab: 0
  }
  const props = {
    match: 'zyz',
    match: {
      params: {id: '123'}
    }
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setState({ ...state });
    wrapper.setProps({ ...props });
  });

  it('Should renders CastAndCrewManagement default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test getContentId', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getContentId'); 
    instance.getContentId();
    expect(instance.getContentId).toBeCalled();
  })

  it("should check cast profile heading text", () => {
    const titleText = findByTestAttr(wrapper, 'cast-header');
    expect(titleText.text()).toMatch('Profile Details')
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'cast-handle-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('Should renders LeftTab default', () => {
    expect(wrapper.containsMatchingElement(<LeftTab />)).toEqual(true);
  })

  it('should test linksClickHandler', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'linksClickHandler');
    instance.linksClickHandler();
    expect(instance.linksClickHandler).toHaveBeenCalledTimes(1);
  })

  it('should test markAsDone', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'markAsDone'); 
    instance.markAsDone(1, true);
    expect(instance.markAsDone).toHaveBeenCalledTimes(1);
  })

  it('should test markAsDone else condition', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'markAsDone'); 
    instance.markAsDone(1, false);
    expect(instance.markAsDone).toHaveBeenCalledTimes(1);
  })

  it('Should renders quicklinks default', () => {
    expect(wrapper.containsMatchingElement(<QuickLinks />)).toEqual(true);
  })

  it('should test handleTab', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'handleTab'); 
    instance.handleTab();
    expect(instance.handleTab).toHaveBeenCalledTimes(1);
  })

  it('should test unLockedSession', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'unLockedSession'); 
    instance.unLockedSession();
    expect(instance.unLockedSession).toHaveBeenCalledTimes(1);
  })
  
  it('should test setStage', () => {
    const stage = {title: "Draft"};
    jest.spyOn(wrapper.instance(), 'setStage'); 
    wrapper.instance().setStage(stage);
    expect(wrapper.instance().setStage).toBeCalled();
  })
  
  it('should check getExternalId', () => {
    jest.spyOn(wrapper.instance(), 'getExternalId'); 
    wrapper.instance().getExternalId();
    expect(wrapper.instance().getExternalId).toBeCalled();
  })
  
  it('should check autoSaveError method', () => {
    const error = {
      data: {
        message: 'This section is locked by another user.'
      }
    }
    jest.spyOn(wrapper.instance(), 'autoSaveError'); 
    wrapper.instance().autoSaveError(error);
    expect(wrapper.instance().autoSaveError).toBeCalled();
  })
  
  it('should check linksClickHandler', () => {
    const data = {
      path : 'xyz'
    }
    jest.spyOn(wrapper.instance(), 'linksClickHandler'); 
    wrapper.instance().linksClickHandler(data);
    expect(wrapper.instance().linksClickHandler).toBeCalled();
  })
  
  it('should check markAsDoneNLockedAction', () => {
    jest.spyOn(wrapper.instance(), 'markAsDoneNLockedAction'); 
    wrapper.instance().markAsDoneNLockedAction();
    expect(wrapper.instance().markAsDoneNLockedAction).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount'); 
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should check getCastStatus', () => {
    jest.spyOn(wrapper.instance(), 'getCastStatus'); 
    wrapper.instance().getCastStatus();
    expect(wrapper.instance().getCastStatus).toBeCalled();
  })

})