import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../../Utils';
import PhotoDetails from '../../../../_components/CastAndCrewManagement/PhotoDetails/PhotoDetails';
import { commonService } from '../../../../_services/common.service';
import JSONSchema from '../../../../_components/CastAndCrewManagement/Schema/PhotoDetails/PhotoDetails.json';

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<PhotoDetails store={store} {...props} />).dive();
  if (state) wrapper.setState(state);
  return wrapper;
}

const initialState = {
  castCrewMgmt_reducer: {}
}

describe('render', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup(initialState);
    wrapper.setState({JSONSchema, fileName: 'xyz', showStatePopup: false})
  });

  afterEach(() => {
  })


  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should test InputChanger', () => {
    const spy = jest.spyOn(wrapper.instance(), 'InputChanger');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'input-changer-method');
    button.simulate('change');
    expect(spy).toHaveBeenCalled();
  })

  it('should test handleOnDrop', () => {
    const files = [{
      lastModified: 1602582862128,
      lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
      name: "pjimage-5-1589546097.jpg",
      path: "pjimage-5-1589546097.jpg",
      size: 14626,
      type: "image/jpeg",
      webkitRelativePath: ""
    }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleOnDrop');
    instance.handleOnDrop(files);
    expect(instance.handleOnDrop).toHaveBeenCalledTimes(1);

    const data = {
      data: "",
      fileName: "pjimage-5-1589546097-fdb4a9da-5f80-48da-af33-02659f36da9d.jpg",
      status: 200,
      statusText: "OK"
    }
    const imageObj = {
      externalId: "1-7-1000397",
      imageDimension: null,
      imageExtension: ".jpg",
      imageType: "other",
      imagetitle: "pjimage-5-1589546097",
      uuid: "fdb4a9da-5f80-48da-af33-02659f36da9d"
    }
    const mock = jest.fn().mockReturnValue(data);
    commonService.get_signed_url_and_upload_to_s3 = mock;
    const result = commonService.get_signed_url_and_upload_to_s3(files[0], imageObj);
    expect(result).toBe(data);
  })

  it('should test fillPhotoDetails', () => {
    const item = {
      ageGroup: null,
      cast_profile_id: "fdb4a9da-5f80-48da-af33-02659f36da9d",
      contentId: "fdb4a9da-5f80-48da-af33-02659f36da9d",
      createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
      description: "",
      gender: null,
      genre: null,
      id: "f861d154-1d56-4014-bf53-43da86bb05ad",
      imageDetails: {
        name: "shche_-team-m8s23hSrdHg-unsplash.jpg",
        size: "7363552",
        url: "shche_-team-m8s23hsrdhg-unsplash-fdb4a9da-5f80-48da-af33-02659f36da9d.jpg",
      },
      imageStatus: "1",
      language: null,
      modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
      others: null,
      sequence: 55,
      title: "shche_-team-m8s23hSrdHg-unsplash.jpg",
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillPhotoDetails');
    instance.fillPhotoDetails(item);
    expect(instance.fillPhotoDetails).toHaveBeenCalledTimes(1);
  })

  it('should test fillPhotoDetails for else condition', () => {
    const item = {
      ageGroup: null,
      cast_profile_id: "fdb4a9da-5f80-48da-af33-02659f36da9d",
      contentId: "fdb4a9da-5f80-48da-af33-02659f36da9d",
      createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
      description: "",
      gender: null,
      genre: null,
      id: "f861d154-1d56-4014-bf53-43da86bb05ad",
      imageStatus: "1",
      language: null,
      modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
      others: null,
      sequence: 55,
      title: "shche_-team-m8s23hSrdHg-unsplash.jpg",
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillPhotoDetails');
    instance.fillPhotoDetails(item);
    expect(instance.fillPhotoDetails).toHaveBeenCalledTimes(1);
  })

  it('should check the handleSubmit method', () => {
    wrapper.setState({ JSONSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleSubmit');
    instance.handleSubmit();
    expect(instance.handleSubmit).toHaveBeenCalledTimes(1);
  })

  it('should check the setSelectDataArr method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr(null, 1);
    expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
  })

  it('should test handleRoute method', () => {
    wrapper.setProps({ editRoute: jest.fn() })
    jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  })
  
  it('should check onClick method of handleSubmit', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'photo-details-handleSubmit-button');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check InputChanger method', () => {
    const event = {target: {value: 'mock', name: 'mock value'}};
    jest.spyOn(wrapper.instance(), 'InputChanger');
    wrapper.instance().InputChanger(event, 1);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })

  it('should check InputChanger method', () => {
    const event = {target: {value: 'mock', name: 'mock value'}};
    jest.spyOn(wrapper.instance(), 'InputChanger');
    wrapper.instance().InputChanger(event, 0);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

})