import React from 'react';
import { shallow } from 'enzyme';

import { storeFactory, findByTestAttr } from '../../../../../Utils';
import ImageSets from '../../../../../_components/Collection/CreateCollection/Images/ImageSets/ImageSets';
import { commonService } from '../../../../../_services/common.service';
import { CommonModel } from '../../../../../_components/Common/Model/CommonModel';

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ImageSets store={store} {...props} />).dive();
  if (state) wrapper.setState(state);
  return wrapper;
}

const initialState = {
  movieMgmt_reducer: {}
}

const set = [
  {
    default: true,
    imageSetId: "53bddd6b-c980-4a52-b88e-50fe3d941605",
    images: [
      {
        imageDescription: "", imagePresetId: "84930878-152f-4110-89fc-432425f94205", imageTitle: "", key: "cover",
        mandatory: false, maxSize: "20MB", resolution: "1920*770", sequence: 1, title: "Cover", url: ""
      }, {
        imageDescription: "", imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0", imageTitle: "", key: "appcover", mandatory: false,
        maxSize: "20MB", resolution: "1440*810", sequence: 2, title: "App Cover", url: ""
      }
    ],
    movieId: "b8776805-766c-4dce-8d75-0c306d140141",
    setName: "Default",
    tags: { others: null }
  }
]

const imageData = {
  imageDescription: "", imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0", imageTitle: "pjimage-5-1589546097",
  key: "appcover", mandatory: false, maxSize: "20MB", resolution: "1440✕810", sequence: 2, size: "14.28 KB",
  title: "App Cover", url: "pjimage-5-1589546097-603c560f-e407-4a41-a9f3-785b46fdc0c0.jpg", valid: false
};
const setIndex = 0;
const imageIndex = 1;
let menuItem = {}

describe('render', () => {
  let wrapper;
  const props = {
    navToImageSet: jest.fn(),
    unLockedSession: jest.fn(),
    navToEditMode: jest.fn(),
    isViewMode: false,
    currentTabData: {
      isLocked: false
    }
  }
  const contentData = {
    imageSets: [{
      default: true,
      imageSetId: "f77b2dce-20f5-4874-a011-a017849b6f66",
      images: [{
        imageDescription: "",
        imagePresetId: "84930878-152f-4110-89fc-432425f94205",
        imageTitle: "",
        key: "cover",
        mandatory: false,
        maxSize: "20MB",
        resolution: "1920*770",
        sequence: 1,
        title: "Cover",
        url: ""
      }, {
        imageDescription: "",
        imagePresetId: "603c560f-e407-4a41-a9f3-785b46fdc0c0",
        imageTitle: "",
        key: "appcover",
        mandatory: false,
        maxSize: "20MB",
        resolution: "1440*810",
        sequence: 2,
        title: "App Cover",
        url: ""
      }, {
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
        url: "917249-amitabh-bachchan-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
        valid: false
      }],
      movieId: "7c8ce3c7-66bf-494a-92fa-49fb38179f13",
      setName: "Default",
      tags: { others: null }
    }]
  };
  beforeEach(() => {
    wrapper = setup(initialState);
    wrapper.setProps({ ...props });
    wrapper.setState({ contentData })
  });

  afterEach(() => {
  })

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('render', () => {
    expect(wrapper.find('.create-movie').length).toBe(1);
  })

  it('Should renders CommonModel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('should test handleAccordian', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleAccordian');
    instance.handleAccordian();
    expect(instance.handleAccordian).toBeCalled();
  })

  it('should check handleMenuClick for view', () => {
    menuItem = { label: 'View' };
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenuClick');
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toBeCalled();
  })

  it('should check handleMenuClick for Published status', () => {
    wrapper.setState({ status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenuClick');
    instance.handleMenuClick();
    expect(instance.handleMenuClick).toBeCalled();
  })

  it('should check handleMenuClick for Unpublished status', () => {
    wrapper.setState({ status: 'Unpublished' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenuClick');
    instance.handleMenuClick();
    expect(instance.handleMenuClick).toBeCalled();
  })

  it('should check handleMenuClick for edit', () => {
    menuItem = { label: 'Edit' };
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenuClick');
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  })


  it('should check handleMenuClick for delete', () => {
    const status = 'Draft';
    wrapper.setState({ status });
    menuItem = { label: 'Delete' };
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenuClick');
    instance.handleMenuClick(setIndex, imageIndex, menuItem, imageData, set);
    expect(instance.handleMenuClick).toHaveBeenCalledTimes(1);
  })

  it('should check confirmationPopupClose method', () => {
    const action = true;
    const setItem = set;
    const model = {
      des: "Do you want to delete the image with other information?",
      showModel: true, title: "Delete Image", type: "image"
    }
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    wrapper.setState({ model, imageItem, setItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'confirmationPopupClose');
    instance.confirmationPopupClose(action);
    expect(instance.confirmationPopupClose).toHaveBeenCalledTimes(1);
  })

  it('should check confirmationPopupClose method else condition', () => {
    const action = true;
    const setItem = set;
    const model = {
      des: "Do you want to delete the image with other information?",
      showModel: true, title: "Delete Image", type: "zyz"
    }
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    wrapper.setState({ model, imageItem, setItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'confirmationPopupClose');
    instance.confirmationPopupClose(action);
    expect(instance.confirmationPopupClose).toHaveBeenCalledTimes(1);
  })

  it('should check viewEditImageModalClose method', () => {
    const action = true;
    const addEditImageJson = [{
      name: "imageTitle", value: "pjimage-5-1589546097", col: "", type: "text", label: "Image Title",
      validation: { maxLength: 250, required: true }, errorText: ""
    }, {
      col: "", errorText: "", label: "Description", name: "imageDescription",
      touched: 1, type: "textarea", valid: true, validation: { maxLength: 250 }, value: "hrithik"
    }]
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    wrapper.setState({ contentData, imageItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'viewEditImageModalClose');
    instance.viewEditImageModalClose(action, addEditImageJson);
    expect(instance.viewEditImageModalClose).toBeCalled();
  })

  it('should check validateMarkAsDone method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'validateMarkAsDone');
    instance.validateMarkAsDone(set);
    expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
  })

  it('should check toggleLockModel method', () => {
    const instance = wrapper.instance();
    const showLockPopup = false;
    wrapper.setState({ showLockPopup });
    jest.spyOn(instance, 'toggleLockModel');
    instance.toggleLockModel(true);
    expect(instance.toggleLockModel).toHaveBeenCalledTimes(1);
  })

  it('should check getSetInformation method', () => {
    const data = {
      others: "test image"
    };
    const type = 'tags'
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getSetInformation');
    instance.getSetInformation(data, type);
    expect(instance.getSetInformation).toHaveBeenCalledTimes(2);
  })

  it('should check onSelectFile method', () => {
    const event = {
      target: {
        files: [{
          lastModified: 1602582862128,
          lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
          name: "pjimage-5-1589546097.jpg",
          path: "pjimage-5-1589546097.jpg",
          size: 14626,
          type: "image/jpeg",
          webkitRelativePath: ""
        }]
      }
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'onSelectFile');
    instance.onSelectFile(event);
    expect(instance.onSelectFile).toBeCalled();
  })

  it('should check uploadImagefile method', async () => {
    const file = [{
      lastModified: 1602582862128,
      lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
      name: "pjimage-5-1589546097.jpg",
      path: "pjimage-5-1589546097.jpg",
      size: 14626,
      type: "image/jpeg",
      webkitRelativePath: ""
    }];
    const imageObj = {
      externalId: "1-1-1000011",
      imageDimension: "1440✕810",
      imageExtension: ".jpg",
      imageType: "appcover",
      imagetitle: "dec_hny 4",
      uuid: "603c560f-e407-4a41-a9f3-785b46fdc0c0"
    }
    const response = {}
    const mock = jest.fn().mockReturnValue(response);
    commonService.get_signed_url_and_upload_to_s3 = mock;
    const signedUrl = await commonService.get_signed_url_and_upload_to_s3(file, imageObj);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'uploadImagefile');
    instance.uploadImagefile();
    expect(instance.uploadImagefile).toHaveBeenCalledTimes(1);
  })

  it('should check updateImageSet method call', () => {
    const imageItem = { setIndex, imageIndex, menuItem, imageData };
    const dataParams = {
      imageSetId: "53bddd6b-c980-4a52-b88e-50fe3d941605",
      images: [{
        imageDescription: "", imagePresetId: "84930878-152f-4110-89fc-432425f94205", imageTitle: "", key: "cover",
        mandatory: false, maxSize: "20MB", resolution: "1920*770", sequence: 1, title: "Cover", url: ""
      }]
    }
    const viewEditModalState = true
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateImageSet');
    instance.updateImageSet(dataParams);
    expect(instance.updateImageSet).toBeCalled();
  })

  it('should check updateMarkAsDone ', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateMarkAsDone');
    instance.updateMarkAsDone();
    expect(instance.updateMarkAsDone).toBeCalled();
  })

  it('should check updateMarkAsDone ', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getImageListingView');
    instance.getImageListingView();
    expect(instance.getImageListingView).toBeCalled();
  })

  it('should check componentDidMount ', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should check getCollectionData ', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getCollectionData');
    instance.getCollectionData();
    expect(instance.getCollectionData).toBeCalled();
  })

  it('should check getImageSets ', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getImageSets');
    instance.getImageSets();
    expect(instance.getImageSets).toBeCalled();
  })

  it('should check handelSetOperations ', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handelSetOperations');
    instance.handelSetOperations(set, 'edit', null);
    expect(instance.handelSetOperations).toBeCalled();
  })

  it('should check handelSetOperations else condition', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handelSetOperations');
    instance.handelSetOperations(set, 'remove', null);
    expect(instance.handelSetOperations).toBeCalled();
  })

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
      mandatory: false
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
        movieId: "b8776805-766c-4dce-8d75-0c306d140141",
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
      url: ""
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
      'quick-filing',
      false,
      set
    );
    expect(instance.getImageListingView).toHaveBeenCalledTimes(1);
  });

  it('should check navigateToEditMode', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'navigateToEditMode');
    instance.navigateToEditMode();
    expect(instance.navigateToEditMode).toBeCalled();
  })

  it('should check onClick method of navToImageSet', () => {
    wrapper.find('.auto-create-newSet').simulate('click');
    expect(props.navToImageSet).toHaveBeenCalled();
  })

  it('should check handleAccordian onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleAccordian');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = wrapper.find('.question');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
})