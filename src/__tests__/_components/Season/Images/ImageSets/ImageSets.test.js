import React from "react";
import { shallow } from "enzyme";
import moxios from "moxios";

import { storeFactory, findByTestAttr } from "../../../../../Utils";
import ImageSets from "../../../../../_components/Season/Images/ImageSets/ImageSets";
import { commonService } from "../../../../../_services/common.service";
import { CommonModel } from "../../../../../_components/Common/Model/CommonModel";
import axios from "../../../../../_helpers/axiosInstance";
import { expect } from "@jest/globals";

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ImageSets store={store} {...props} />).dive();
  if (state) wrapper.setState(state);
  return wrapper;
};

const initialState = {
  movieMgmt_reducer: {},
};

const set = [
  {
    default: false,
    imageSetId: "53bddd6b-c980-4a52-b88e-50fe3d941605",
    images: [
      {
        imageDescription: "",
        imagePresetId: "84930878-152f-4110-89fc-432425f94205",
        imageTitle: "",
        key: "cover",
        mandatory: false,
        maxSize: "20MB",
        resolution: "1920*770",
        sequence: 1,
        title: "Cover",
        url: "",
      },
      {
        imageDescription: "",
        imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0",
        imageTitle: "",
        key: "appcover",
        mandatory: false,
        maxSize: "20MB",
        resolution: "1440*810",
        sequence: 2,
        title: "App Cover",
        url: "",
      },
    ],
    movieId: "b8776805-766c-4dce-8d75-0c306d140141",
    setName: "Default",
    tags: { others: null },
  },
];

const imageData = {
  imageDescription: "",
  imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0",
  imageTitle: "pjimage-5-1589546097",
  key: "appcover",
  mandatory: false,
  maxSize: "20MB",
  resolution: "1440✕810",
  sequence: 2,
  size: "14.28 KB",
  title: "App Cover",
  url: "pjimage-5-1589546097-603c560f-e407-4a41-a9f3-785b46fdc0c0.jpg",
  valid: false,
};
const setIndex = 0;
const imageIndex = 1;
let menuItem = {};

describe("render", () => {
  let wrapper;
  const baseProps = {
    isViewMode: false,
    navToImageSet: jest.fn(),
    unLockedSession: jest.fn(),
    markAsDone: jest.fn()
  };
  beforeEach(() => {
    moxios.install(axios)
    wrapper = setup(initialState, { ...baseProps });
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("render component without error", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("render", () => {
    expect(wrapper.find(".create-movie").length).toBe(1);
  });

  it("Should renders CommonModel default", () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  });

  it("should test handleAccordian", () => {
    const ImageSets = set;
    wrapper.setState({ ImageSets });
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleAccordian");
    instance.handleAccordian();
    expect(instance.handleAccordian).toHaveBeenCalledTimes(1);
  });

  it("should check handleMenuClick for view", () => {
    menuItem = { label: "View" };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMenuClick");
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it("should check handleMenuClick for edit", () => {
    menuItem = { label: "Edit" };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMenuClick");
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it("should check handleMenuClick for delete", () => {
    const status = "Draft";
    wrapper.setState({ status });
    menuItem = { label: "Delete" };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMenuClick");
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  });

  it("should check confirmationPopupClose method", () => {
    const action = true;
    const setItem = set;
    const model = {
      des: "Do you want to delete the image with other information?",
      showModel: true,
      title: "Delete Image",
      type: "image",
    };
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    wrapper.setState({ model, imageItem, setItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, "confirmationPopupClose");
    instance.confirmationPopupClose(action);
    expect(instance.confirmationPopupClose).toHaveBeenCalledTimes(1);
  });

  it("should check confirmationPopupClose method type!= image", () => {
    const action = true;
    const setItem = set;
    const model = {
      des: "Do you want to delete the image with other information?",
      showModel: true,
      title: "Delete Image",
      type: "xyz",
    };
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    wrapper.setState({ model, imageItem, setItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, "confirmationPopupClose");
    instance.confirmationPopupClose(action);
    expect(instance.confirmationPopupClose).toHaveBeenCalledTimes(1);
  });



  it("should check viewEditImageModalClose method", () => {
    const action = true;
    const addEditImageJson = [
      {
        name: "imageTitle",
        value: "pjimage-5-1589546097",
        col: "",
        type: "text",
        label: "Image Title",
        validation: { maxLength: 250, required: true },
        errorText: "",
      },
      {
        col: "",
        errorText: "",
        label: "Description",
        name: "imageDescription",
        touched: 1,
        type: "textarea",
        valid: true,
        validation: { maxLength: 250 },
        value: "hrithik",
      },
    ];
    const contentData = {
      imageSets: [
        {
          default: true,
          imageSetId: "f77b2dce-20f5-4874-a011-a017849b6f66",
          images: [
            {
              imageDescription: "",
              imagePresetId: "84930878-152f-4110-89fc-432425f94205",
              imageTitle: "",
              key: "cover",
              mandatory: false,
              maxSize: "20MB",
              resolution: "1920*770",
              sequence: 1,
              title: "Cover",
              url: "",
            },
            {
              imageDescription: "",
              imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0",
              imageTitle: "",
              key: "appcover",
              mandatory: false,
              maxSize: "20MB",
              resolution: "1440*810",
              sequence: 2,
              title: "App Cover",
              url: "",
            },
            {
              imageDescription: "test 1",
              imagePresetId: "07c3cc5f-0b49-4032-af0c-159565b559db",
              imageTitle: "manoj",
              key: "list",
              mandatory: true,
              maxSize: "20MB",
              resolution: "1170✕658",
              sequence: 3,
              size: "5.93 KB",
              title: "List",
              url:
                "917249-amitabh-bachchan-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
              valid: false,
            },
          ],
          movieId: "7c8ce3c7-66bf-494a-92fa-49fb38179f13",
          setName: "Default",
          tags: { others: null },
        },
      ],
    };
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    wrapper.setState({ contentData, imageItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, "viewEditImageModalClose");
    instance.viewEditImageModalClose(action, addEditImageJson);
    expect(instance.viewEditImageModalClose).toBeCalled();
  });

  it("should check validateMarkAsDone method", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "validateMarkAsDone");
    instance.validateMarkAsDone(set);
    expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it("should check toggleLockModel method", () => {
    const instance = wrapper.instance();
    const showLockPopup = false;
    wrapper.setState({ showLockPopup });
    jest.spyOn(instance, "toggleLockModel");
    instance.toggleLockModel(false);
    expect(instance.toggleLockModel).toHaveBeenCalledTimes(1);
  });

  it("should check toggleLockModel method", () => {
    const instance = wrapper.instance();
    const showLockPopup = false;
    wrapper.setState({ showLockPopup });
    jest.spyOn(instance, "toggleLockModel");
    instance.toggleLockModel(true);
    expect(instance.toggleLockModel).toHaveBeenCalledTimes(1);
  });

  it("should check getSetInformation method", () => {
    const data = {
      ageGroup: [
        { id: "a53e6637-6d38-425a-bf1b-2e62b2c64055", title: "40-50" },
      ],
      gender: [{ id: "e504270a-d2e8-4eb4-9c14-316d875722bc", title: "Female" }],
      genre: [{ id: "5194816a-af68-445c-affe-f00743c120fc", title: "Crime" }],
      language: [
        { id: "49006dbd-71ff-41a1-abe3-8277702ed0f2", title: "Bhojpuri" },
      ],
      others: "test image",
    };
    const type = "tags";
    const instance = wrapper.instance();
    jest.spyOn(instance, "getSetInformation");
    instance.getSetInformation(data, type);
    expect(instance.getSetInformation).toHaveBeenCalledTimes(2);
  });

  it("should check onSelectFile method", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "onSelectFile");
    instance.onSelectFile();
    expect(instance.onSelectFile).toHaveBeenCalledTimes(1);
  });

  it("should check uploadImagefile method", async () => {
    const file = [
      {
        lastModified: 1602582862128,
        lastModifiedDate:
          "Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)",
        name: "pjimage-5-1589546097.jpg",
        path: "pjimage-5-1589546097.jpg",
        size: 14626,
        type: "image/jpeg",
        webkitRelativePath: "",
      },
    ];
    const imageObj = {
      externalId: "1-1-1000011",
      imageDimension: "1440✕810",
      imageExtension: ".jpg",
      imageType: "appcover",
      imagetitle: "dec_hny 4",
      uuid: "603c560f-e407-4a41-a9f3-785b46fdc0c0",
    };
    const response = {};
    const mock = jest.fn().mockReturnValue(response);
    commonService.get_signed_url_and_upload_to_s3 = mock;
    const signedUrl = await commonService.get_signed_url_and_upload_to_s3(
      file,
      imageObj
    );
    const instance = wrapper.instance();
    jest.spyOn(instance, "uploadImagefile");
    instance.uploadImagefile();
    expect(instance.uploadImagefile).toHaveBeenCalledTimes(1);
  });

  it('should check updateImageSet', () => {
    jest.spyOn(wrapper.instance(), 'updateImageSet');
    wrapper.instance().updateImageSet();
    expect(wrapper.instance().updateImageSet).toBeCalled();
  })

  it("should check the updateMarkAsDone ", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "updateMarkAsDone");
    instance.updateMarkAsDone();
    expect(instance.updateMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it("should check the updateMarkAsDone ", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getImageListingView");
    instance.getImageListingView(1, true, 1, [{label: 'test'}], null, null, true);
    expect(instance.getImageListingView).toHaveBeenCalledTimes(1);
  });

  it("should check the getImageSets ", (done) => {
    const response = {
      imageSets: [
        {
          default: true,
          imageSetId: "fabb98b5-9c45-4740-a786-485f55bbafb1",
          images: [
            {
              imageDescription: "",
              imagePresetId: "84930878-152f-4110-89fc-432425f94205",
              imageTitle: "",
              key: "cover",
              mandatory: false,
              maxSize: "20MB",
              resolution: "1920*770",
              sequence: 1,
              title: "Cover",
              url: "",
            },
          ],
          setName: "Default",
          tags: { others: null },
          videoId: "0cd0742f-080c-44ab-b366-ca4c545ef9ab",
        },
      ],
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getImageSets");
    instance.getImageSets();
    expect(instance.getImageSets).toBeCalled();
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().expanded).toBe(0);
        done();
      });
    });
  });

  it("should check onClick method handleAccordian", () => {
    const baseProps = {
      isViewMode: false,
    };
    const imageSets = set;
    const contentData = { imageSets };
    const component = setup(initialState, { ...baseProps }, { contentData });
    const spy = jest.spyOn(component.instance(), "handleAccordian");
    component.find(".question").simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check onClick method handelSetOperations", () => {
    const baseProps = {
      isViewMode: false,
      navToImageSet: jest.fn(),
    };
    const imageSets = set;
    const contentData = { imageSets };
    const component = setup(initialState, { ...baseProps }, { contentData });
    const spy = jest.spyOn(component.instance(), "handelSetOperations");
    component.find(".edit").simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check onClick method handelSetOperations", () => {
    const baseProps = {
      isViewMode: false,
      navToImageSet: jest.fn(),
    };
    const imageSets = set;
    const contentData = { imageSets };
    const component = setup(initialState, { ...baseProps }, { contentData });
    const spy = jest.spyOn(component.instance(), "handelSetOperations");
    component.find(".remove").simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check the handelSetOperations ", () => {
    const mockSet = {
      GroupCountry: [],
      Platform: [],
      default: false,
      imageSetId: "905c2c44-38b0-4c91-8223-5d8e4fc0e2a9",
      images: [
        {
          imageTitle: "",
          imageDescription: "",
          url: "",
          mandatory: false,
          maxSize: "20MB",
        },
        {
          imageTitle: "",
          imageDescription: "",
          url: "",
          mandatory: false,
          maxSize: "20MB",
        },
        {
          imageTitle: "",
          imageDescription: "",
          url: "",
          mandatory: false,
          maxSize: "20MB",
        },
      ],
      setName: "test",
      tags: { genre: [], language: [], ageGroup: [], gender: [], others: "" },
      videoId: "85b3c599-cb1c-40b4-8a54-571466cde3b4",
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handelSetOperations");
    instance.handelSetOperations(mockSet, "remove", set);
    expect(instance.handelSetOperations).toBeCalled();
  });

  it("should check the handelSetOperations ", () => {
    const mockSet = {
      GroupCountry: [],
      Platform: [],
      default: false,
      imageSetId: "905c2c44-38b0-4c91-8223-5d8e4fc0e2a9",
      images: [
        {
          imageTitle: "",
          imageDescription: "",
          url: "",
          mandatory: false,
          maxSize: "20MB",
        },
        {
          imageTitle: "",
          imageDescription: "",
          url: "",
          mandatory: false,
          maxSize: "20MB",
        },
        {
          imageTitle: "",
          imageDescription: "",
          url: "",
          mandatory: false,
          maxSize: "20MB",
        },
      ],
      setName: "test",
      tags: { genre: [], language: [], ageGroup: [], gender: [], others: "" },
      videoId: "85b3c599-cb1c-40b4-8a54-571466cde3b4",
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "handelSetOperations");
    instance.handelSetOperations(mockSet, "edit", set);
    expect(instance.handelSetOperations).toBeCalled();
  });

  it("should check onClick method navToImageSet", () => {
    const baseProps = {
      navToImageSet: jest.fn(),
      isViewMode: false,
      isLocked: false,
    };
    const component = setup(initialState, { ...baseProps });
    component.find(".upload-btn").simulate("click");
    expect(baseProps.navToImageSet).toHaveBeenCalled();
  });

  it("should check method navigateToEditMode", () => {
    const baseProps = {
      navToEditMode: jest.fn(),
      videoId: "zyzyy",
    };
    const component = setup(initialState, { ...baseProps });
    jest.spyOn(component.instance(), "navigateToEditMode");
    component.instance().navigateToEditMode();
    expect(component.instance().navigateToEditMode).toBeCalled();
  });

  it("should check the getImageListingView with params", () => {
    const image = {
      imageDescription: "",
      imagePresetId: "84930878-152f-4110-89fc-432425f94205",
      imageTitle: "",
      key: "cover",
      mandatory: false,
      maxSize: "20MB",
      resolution: "1920*770",
      sequence: 1,
      title: "Cover",
      url: "",
    };
    const menuItems = [
      { label: "View" },
      { label: "Edit" },
      { label: "Delete" },
    ];
    const pageState = "";
    const instance = wrapper.instance();
    jest.spyOn(instance, "getImageListingView");
    instance.getImageListingView(
      0,
      null,
      0,
      menuItems,
      image,
      null,
      false,
      set
    );
    expect(instance.getImageListingView).toHaveBeenCalledTimes(1);
  });

  it("should check the getImageListingView with params", () => {
    const set = [
      {
        default: true,
        imageSetId: "53bddd6b-c980-4a52-b88e-50fe3d941605",
        images: [
          {
            imageDescription: "",
            imagePresetId: "84930878-152f-4110-89fc-432425f94205",
            imageTitle: "",
            key: "cover",
            mandatory: false,
            maxSize: "20MB",
            resolution: "1920*770",
            sequence: 1,
            title: "Cover",
            url: "",
          },
          {
            imageDescription: "",
            imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0",
            imageTitle: "",
            key: "appcover",
            mandatory: false,
            maxSize: "20MB",
            resolution: "1440*810",
            sequence: 2,
            title: "App Cover",
            url: "",
          },
        ],
        seasonId: "b8776805-766c-4dce-8d75-0c306d140141",
        setName: "Default",
        tags: { others: null },
      },
    ];

    const image = {
      imageDescription: "",
      imagePresetId: "84930878-152f-4110-89fc-432425f94205",
      imageTitle: "",
      key: "list",
      mandatory: false,
      maxSize: "20MB",
      resolution: "1920*770",
      sequence: 1,
      title: "Cover",
      url: "",
    };
    const menuItems = [
      { label: "View" },
      { label: "Edit" },
      { label: "Delete" },
    ];
    const pageState = "single-landing-page";
    const instance = wrapper.instance();
    jest.spyOn(instance, "getImageListingView");
    instance.getImageListingView(
      0,
      null,
      0,
      menuItems,
      image,
      null,
      false,
      set
    );
    expect(instance.getImageListingView).toHaveBeenCalledTimes(1);
  });

  it('should check deleteSet', () => {
    jest.spyOn(wrapper.instance(), 'deleteSet');
    wrapper.instance().deleteSet();
    expect(wrapper.instance().deleteSet).toBeCalled();
  })

  it("should check onClick method toggleLockModel", () => {
    const component = setup();
    const spy = jest.spyOn(component.instance(), 'toggleLockModel');
    component.instance().forceUpdate();
    component.update();
    const button = findByTestAttr(component, 'toggleLock');
    button.simulate("change");
    expect(spy).not.toBeCalled();
  });

  it("should check onClick method confirmationPopupClose", () => {
    const model =  {
        des: "", showModel: true, title: "", type: ""
      }
    const wrapper = setup();
    wrapper.setState({model})
    const spy = jest.spyOn(wrapper.instance(), "confirmationPopupClose");
    wrapper.find("#confirmationPopupClose").simulate("change");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should check handleMenuClick for status published", () => {
    const status = "Published";
    wrapper.setState({status})
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMenuClick");
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  });
  
  it("should check handleMenuClick for status Submit to Review", () => {
    const status = "Submit to Review";
    wrapper.setState({status})
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMenuClick");
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  });

})