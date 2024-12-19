import React from "react";
import { shallow } from "enzyme";
import moxios from 'moxios';

import DragDropImage from "../../../../_components/CastAndCrewManagement/DragDropImage/DragDropImage";
import { storeFactory, findByTestAttr } from "../../../../Utils";
import axios from "../../../../_helpers/axiosInstance";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<DragDropImage store={store} {...props} />).dive();
  return wrapper;
};

const initialState = {};

describe("DragDropImage", () => {
  let wrapper;
  const props = {
    currentTabData: {
      isDone: false,
      isLocked: false,
      label: "Images",
      lockedBy: "Sandeep Kumar",
      name: "image",
      permissionKey: "cast",
      permissionName: "canUpdate",
      permissionSubKey: "images",
      sectionName: "image",
    },
    externalId: "1-7-1000093",
    castProfileId: "3cea4d09-495c-43df-ad9b-b25a89c80c4a",
    markAsDone: jest.fn(),
    unLockedSession: jest.fn(),
    mode: true
  };
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup(initialState);
    wrapper.setProps({ ...props });
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("Should renders DragDropImage default", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test handleOnDrop dropdown", () => {
    const instance = wrapper.instance(); // you assign your instance of the wrapper
    jest.spyOn(instance, "handleOnDrop"); // You spy on the randomFunction
    instance.handleOnDrop();
    expect(instance.handleOnDrop).toHaveBeenCalledTimes(1);
  });

  it("should test handleOnDrop dropdown", () => {
    const instance = wrapper.instance(); // you assign your instance of the wrapper
    jest.spyOn(instance, "handleOnDrop"); // You spy on the randomFunction
    instance.handleOnDrop();
    expect(instance.handleOnDrop).toHaveBeenCalledTimes(1);
  });

  it("should test saveImage ", () => {
    const instance = wrapper.instance(); // you assign your instance of the wrapper
    jest.spyOn(instance, "saveImage"); // You spy on the randomFunction
    instance.saveImage();
    expect(instance.saveImage).toBeCalled();
  });

  it("should test getImageList", () => {
    jest.spyOn(wrapper.instance(), "getImageList");
    wrapper.instance().getImageList();
    expect(wrapper.instance().getImageList).toBeCalled();
    const response = [];
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().imagesCount > 1).toBe();
        done();
      });
    });
  });

  it("should test getCastData", () => {
    jest.spyOn(wrapper.instance(), "getCastData");
    wrapper.instance().getCastData();
    expect(wrapper.instance().getCastData).toBeCalled();
    const response = {
      castAwards: null, castBackground: null, castBirthPlace: null, castBirthday: null,
      castCareer: null, castKnownAs: "test 1", castName: "testt"
    }
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().status).toEqual('Draft');
        done();
      });
    });
  });

  it("should test handleOnDrop", () => {
    const files = [{
      lastModified: "1611690882219", lastModifiedDate: "Wed Jan 27 2021 01:24:42 GMT+0530 (India Standard Time)",
      name: "download.jpg", path: "download.jpg", size: 6671, type: "image/jpeg", webkitRelativePath: "",
    }];
    jest.spyOn(wrapper.instance(), "handleOnDrop");
    wrapper.instance().handleOnDrop(files);
    expect(wrapper.instance().handleOnDrop).toBeCalled();
  });

  it("should test saveImage", () => {
    jest.spyOn(wrapper.instance(), "saveImage");
    wrapper.instance().saveImage();
    expect(wrapper.instance().saveImage).toBeCalled();
  });

  it("should test editstatus", () => {
    jest.spyOn(wrapper.instance(), "editstatus");
    wrapper.instance().editstatus();
    expect(wrapper.instance().editstatus).toBeCalled();
  });

  it("should test editRoute", () => {
    jest.spyOn(wrapper.instance(), "editRoute");
    wrapper.instance().editRoute();
    expect(wrapper.instance().editRoute).toBeCalled();
  });

  it("should test handleMarkAsDone", () => {
    jest.spyOn(wrapper.instance(), "handleMarkAsDone");
    wrapper.instance().handleMarkAsDone();
    expect(wrapper.instance().handleMarkAsDone).toBeCalled();
  });

  it("should test checkValidation", () => {
    const files = [{
      lastModified: "1611690882219", lastModifiedDate: "Wed Jan 27 2021 01:24:42 GMT+0530 (India Standard Time)",
      name: "download.jpg", path: "download.jpg", size: 6671, type: "image/jpeg", webkitRelativePath: "",
    }];
    wrapper.setState({files})
    jest.spyOn(wrapper.instance(), "checkValidation");
    wrapper.instance().checkValidation();
    expect(wrapper.instance().checkValidation).toBeCalled();
  });

  it("should test checkValidation without state value", () => {
    jest.spyOn(wrapper.instance(), "checkValidation");
    wrapper.instance().checkValidation();
    expect(wrapper.instance().checkValidation).toBeCalled();
  });

  it("should test handleEditImage", () => {
    jest.spyOn(wrapper.instance(), "handleEditImage");
    wrapper.instance().handleEditImage();
    expect(wrapper.instance().handleEditImage).toBeCalled();
  });

  it("should test toggleModel", () => {
    jest.spyOn(wrapper.instance(), "toggleModel");
    wrapper.instance().toggleModel();
    expect(wrapper.instance().toggleModel).toBeCalled();
  });

  it("should test lockUnlockCastProfile", () => {
    jest.spyOn(wrapper.instance(), "lockUnlockCastProfile");
    wrapper.instance().lockUnlockCastProfile();
    expect(wrapper.instance().lockUnlockCastProfile).toBeCalled();
  });

  it("should test isTouchDevice", () => {
    jest.spyOn(wrapper.instance(), "isTouchDevice");
    wrapper.instance().isTouchDevice();
    expect(wrapper.instance().isTouchDevice).toBeCalled();
  });

  it('should test handleMarkAsDone onClick', () => {
    wrapper.setState({mode: 'create', imagesCount: '1'})
    const spy = jest.spyOn(wrapper.instance(), 'handleMarkAsDone');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'markAsDone-btn').first();
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
  
  it("should test componentDidMount", () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  });

});
