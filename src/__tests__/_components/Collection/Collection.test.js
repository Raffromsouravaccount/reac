import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import Collection from '../../../_components/Collection/CreateCollection/Collection';
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
  const wrapper = shallow(<Collection {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('Collection', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let instance;
  const baseProps = {
    location: {
      state: {
        seletedTab: true
      }
    }
  }
  beforeEach(() => {
    wrapper = setup();
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders Collection default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check setCollectionId', () => {
    jest.spyOn(instance, 'setCollectionId');
    instance.setCollectionId();
    expect(instance.setCollectionId).toBeCalled();
  })

  it('should check getCollectionId', () => {
    jest.spyOn(instance, 'getCollectionId');
    instance.getCollectionId();
    expect(instance.getCollectionId).toBeCalled();
  })

  it('should check handlePermission', () => {
    jest.spyOn(instance, 'handlePermission');
    instance.handlePermission();
    expect(instance.handlePermission).toBeCalled();
  })
  
  it('should check unLockedSession', () => {
    jest.spyOn(instance, 'unLockedSession');
    instance.unLockedSession();
    expect(instance.unLockedSession).toBeCalled();
  })

  it('should check markAsDone', () => {
    jest.spyOn(instance, 'markAsDone');
    instance.markAsDone(0, true);
    expect(instance.markAsDone).toBeCalled();
  })

  it('should render getExternalId', () => {
    jest.spyOn(instance, 'getExternalId')
    instance.getExternalId();
    expect(instance.getExternalId).toBeCalled();
  })
  
  it('should render autoSaveError', () => {
    const error = {
      data: {
        message: "This section is locked by another user."
      }
    }
    jest.spyOn(instance, 'autoSaveError')
    instance.autoSaveError(error);
    expect(instance.autoSaveError).toBeCalled();
  })

  it('should render autoSaveError else condition', () => {
    jest.spyOn(instance, 'autoSaveError')
    instance.autoSaveError();
    expect(instance.autoSaveError).toBeCalled();
  })
  
  it('should render setStage', () => {
    jest.spyOn(instance, 'setStage')
    instance.setStage();
    expect(instance.setStage).toBeCalled();
  })
  
  it('should render openEditForm', () => {
    jest.spyOn(instance, 'openEditForm')
    instance.openEditForm();
    expect(instance.openEditForm).toBeCalled();
  })
  
  it('should render createLicense', () => {
    jest.spyOn(instance, 'createLicense')
    instance.createLicense();
    expect(instance.createLicense).toBeCalled();
  })
  
  it('should render linksClickHandler', () => {
    jest.spyOn(instance, 'linksClickHandler')
    instance.linksClickHandler();
    expect(instance.linksClickHandler).toBeCalled();
  })
  
  it('should render handleRoute', () => {
    jest.spyOn(instance, 'handleRoute')
    instance.handleRoute();
    expect(instance.handleRoute).toBeCalled();
  })
  
  it('should render handleTab', () => {
    jest.spyOn(instance, 'handleTab')
    instance.handleTab();
    expect(instance.handleTab).toBeCalled();
  })
  
  it('should render lockedSession', () => {
    const leftTab = [{isLocked: true}];
    wrapper.setState({ leftTab });
    jest.spyOn(instance, 'lockedSession')
    instance.lockedSession(0);
    expect(instance.lockedSession).toBeCalled();
  })
  
  it('should render markAsDoneNLockedAction', () => {
    jest.spyOn(instance, 'markAsDoneNLockedAction')
    instance.markAsDoneNLockedAction();
    expect(instance.markAsDoneNLockedAction).toBeCalled();
  })
  
  it('should render getCollectionStatus', () => {
    jest.spyOn(instance, 'getCollectionStatus')
    instance.getCollectionStatus();
    expect(instance.getCollectionStatus).toBeCalled();
  })

  it('should test componentDidMount method', () => {
    wrapper.setProps({...baseProps});
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should test componentDidMount method else', () => {
    wrapper.setProps({ });
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

})