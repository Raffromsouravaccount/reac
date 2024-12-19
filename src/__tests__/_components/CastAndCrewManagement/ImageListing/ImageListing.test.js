import React from 'react';
import { shallow, mount } from 'enzyme';

import ImageListing from '../../../../_components/CastAndCrewManagement/DragDropImage/ImageListing/ImageListing';
import { CommonModel } from '../../../../_components/Common/Model/CommonModel';
import { Image } from '../../../../_components/CastAndCrewManagement/DragDropImage/ImageListing/ImageListing';

import { permissionObj } from '../../../../_helpers/permission';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ImageListing {...props} permissionObj={permissionObj} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<ImageListing/>', () => {
  let wrapper;
  const state = {
    selectedValue: {
      genre: [{ name: 'genre', title: 'genre title' }],
      gender: [{ name: 'gender', title: 'gender title' }],
      ageGroup: [{ name: 'ageGroup', title: 'ageGroup title' }],
      language: [{ name: 'language', title: 'language title' }]
    },
    showDeletePOPUP: null,
    deleteImageId: 'xyz123',
    openLogoutDropdown: false,
    listingdata: [
      {
        ageGroup: null, cast_profile_id: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", contentId: "3cea4d09-495c-43df-ad9b-b25a89c80c4a",
        createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7", description: "", gender: null, genre: null, id: "847019dc-5c8d-4824-adef-6eb09d6509d6",
        imageDetails: { url: "download-3cea4d09-495c-43df-ad9b-b25a89c80c4a.jpg", name: "download.jpg", size: "6671" }, imageStatus: "1",
        language: null, modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7", others: null, sequence: 8, title: "download.jpg"
      },
      {
        ageGroup: null, cast_profile_id: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", contentId: "3cea4d09-495c-43df-ad9b-b25a89c80c4a",
        createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7", description: "", gender: null, genre: null, id: "cf9d6ea1-2993-4135-ad7e-f58ad9f332c2",
        imageDetails: { url: "download-3cea4d09-495c-43df-ad9b-b25a89c80c4a.jpg", name: "download.jpg", size: "6671" }, imageStatus: "1", language: null, modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
        others: null, sequence: 7, title: "download.jpg"
      }
    ]
  }
  const props = {
    lock: false,
    btn1Action: jest.fn(),
    btn2Action: jest.fn()
  }
  beforeEach(() => {
    wrapper = setup({ ...props }, { ...state });
  });

  it('Should renders ImageListing default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test handleOpenClose', () => {
    const key = '847019dc-5c8d-4824-adef-6eb09d6509d6';
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleOpenClose');
    instance.handleOpenClose(key);
    expect(instance.handleOpenClose).toBeCalled();
  });

  it('should test handleOpenClose', () => {
    wrapper.setState({ openLogoutDropdown: undefined })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleOpenClose');
    instance.handleOpenClose();
    expect(instance.handleOpenClose).toBeCalled();
  });

  it('should test handleClose', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleClose');
    instance.handleClose();
    expect(instance.handleClose).toHaveBeenCalledTimes(1);
  });

  it('should test truncate method else', () => {
    jest.spyOn(wrapper.instance(), 'truncate');
    wrapper.instance().truncate('test');
    expect(wrapper.instance().truncate).toBeCalled();
  })

  it('should test truncate method', () => {
    jest.spyOn(wrapper.instance(), 'truncate');
    wrapper.instance().truncate('test test test test test test');
    expect(wrapper.instance().truncate).toBeCalled();
  })

  it('should test getReorderedList method', () => {
    jest.spyOn(wrapper.instance(), 'getReorderedList');
    wrapper.instance().getReorderedList();
    expect(wrapper.instance().getReorderedList).toBeCalled();
  })

  it('should test handlePopUpClose method', () => {
    jest.spyOn(wrapper.instance(), 'handlePopUpClose');
    wrapper.instance().handlePopUpClose();
    expect(wrapper.instance().handlePopUpClose).toBeCalled();
  })

  it('should test handleEdit method', () => {
    wrapper.setProps({ mode: 'edit', lock: false })
    jest.spyOn(wrapper.instance(), 'handleEdit');
    wrapper.instance().handleEdit();
    expect(wrapper.instance().handleEdit).toBeCalled();
  })

  it('should test handleView method', () => {
    jest.spyOn(wrapper.instance(), 'handleView');
    wrapper.instance().handleView();
    expect(wrapper.instance().handleView).toBeCalled();
  })

  it('should test handleRemove method', () => {
    jest.spyOn(wrapper.instance(), 'handleRemove');
    wrapper.instance().handleRemove();
    expect(wrapper.instance().handleRemove).toBeCalled();
  })

  it('should test deleteImage method', () => {
    jest.spyOn(wrapper.instance(), 'deleteImage');
    wrapper.instance().deleteImage();
    expect(wrapper.instance().deleteImage).toBeCalled();
  })

  it('should test getLastToId method', () => {
    jest.spyOn(wrapper.instance(), 'getLastToId');
    wrapper.instance().getLastToId();
    expect(wrapper.instance().getLastToId).toBeCalled();
  })

  it('should test getFromId method', () => {
    jest.spyOn(wrapper.instance(), 'getFromId');
    wrapper.instance().getFromId();
    expect(wrapper.instance().getFromId).toBeCalled();
  })

  it('should test moveImage method', () => {
    const listingdata = [
      {
        ageGroup: null, cast_profile_id: "bce04b7c-18c9-4cd8-80ee-dbacb3f57cf2", contentId: "bce04b7c-18c9-4cd8-80ee-dbacb3f57cf2",
        createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7", description: "", gender: null, genre: null, id: "cb0749ec-5623-4dad-81aa-cab75c97ab2b",
        imageDetails: { url: "download-bce04b7c-18c9-4cd8-80ee-dbacb3f57cf2.jpg", name: "download.jpg", size: "6671" }, imageStatus: "1",
        language: null, modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7", others: null, sequence: 18, title: "download.jpg"
      },
      {
        ageGroup: null, cast_profile_id: "bce04b7c-18c9-4cd8-80ee-dbacb3f57cf2", contentId: "bce04b7c-18c9-4cd8-80ee-dbacb3f57cf2",
        createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7", description: "", gender: null, genre: null, id: "cb0749ec-5623-4dad-81aa-cab75c97ab2b",
        imageDetails: { url: "download-bce04b7c-18c9-4cd8-80ee-dbacb3f57cf2.jpg", name: "download.jpg", size: "6671" }, imageStatus: "1",
        language: null, modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7", others: null, sequence: 18, title: "download.jpg"
      }
    ]
    wrapper.setState({ listingdata })
    jest.spyOn(wrapper.instance(), 'moveImage');
    wrapper.instance().moveImage(1, 0);
    expect(wrapper.instance().moveImage).toBeCalled();
  })

  it('should test onDropComplete method', () => {
    jest.spyOn(wrapper.instance(), 'onDropComplete');
    wrapper.instance().onDropComplete(true, true);
    expect(wrapper.instance().onDropComplete).toBeCalled();
  })

  it('should test renderUsers method', () => {
    jest.spyOn(wrapper.instance(), 'renderUsers');
    wrapper.instance().renderUsers();
    expect(wrapper.instance().renderUsers).toBeCalled();
  })

  it('Should renders CommonModel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('should check onClick btn1Action ', () => {
    const myFakeCallback = () => {};
    wrapper.find('#btnAction').first().prop('btn1Action')(myFakeCallback);
    wrapper.find('#btnAction').first().prop('btn2Action')(myFakeCallback);
    
  })
})