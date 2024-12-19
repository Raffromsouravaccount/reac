import React from 'react';
import { shallow, mount } from 'enzyme';

import ViewEditImageModal from '../../../../../_components/Video/Images/Dialogs/ViewEditImageModal';
import jsonData from '../../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json';
import { findByTestAttr } from '../../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ViewEditImageModal {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ViewEditImageModal', () => {
  let wrapper;
  const props = {
    viewEditModalState: true,
    viewEditModalMode: 'edit',
    viewEditImageModalClose: jest.fn(),
    onSelectFile: jest.fn(),
    jsonData : jsonData.Images

  }
  
  beforeEach(() => {
    wrapper = setup({ ...props });
  });

  it('Should renders component default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check setImageDataToForm method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setImageDataToForm');
    instance.setImageDataToForm();
    expect(instance.setImageDataToForm).toHaveBeenCalled();
  })

  it('should check inputChangeViewAddEdit method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'inputChangeViewAddEdit');
    const event = { target: { value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'input-change-dialoge').first();
    button.simulate('change', event, 0);
    expect(spy).toBeCalled();
  })

  it('should check viewEditImageModalClose onclick method', () => {
    wrapper.setProps({viewEditModalMode: 'view'});
    const button = wrapper.find('.close-btn');
    button.simulate('click');
    expect(props.viewEditImageModalClose).toBeCalled();
  })

  it('should check onSelectFile onclick method', () => {
    wrapper.setProps({viewEditModalMode: 'edit'});
    const button = wrapper.find('input');
    button.simulate('change');
    expect(props.onSelectFile).toBeCalled();
  })
  
  it('should check viewEditImageModalClose onclick method', () => {
    wrapper.setProps({viewEditModalMode: 'edit'});
    const button = wrapper.find('#cancelBtn');
    button.simulate('click');
    expect(props.viewEditImageModalClose).toBeCalled();
  })

  it('should check viewEditImageModalClose onclick method', () => {
    wrapper.setProps({viewEditModalMode: 'edit'});
    wrapper.setState({saveButtonEnable: true})
    const button = wrapper.find('#saveBtn');
    button.simulate('click');
    expect(props.viewEditImageModalClose).toBeCalled();
  })
  
});