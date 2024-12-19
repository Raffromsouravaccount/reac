import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';

import { constantText } from '../../../../_helpers/constants.text';


import Images from '../../../../_components/BulkOps/Images/Images'
import ImageErrors from '../../../../_components/BulkOps/Images/ImageErrors'
import { findByTestAttr } from '../../../../Utils';
import { CommonModel } from '../../../../_components/Common/Model/CommonModel';
import { PaginationComp } from '../../../../_components/Common/Pagination/Pagination';
import axios from "../../../../_helpers/axiosInstance";

// Service

/**
 * Factory function to create a ShallowWrapper for the Images Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<Images {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}


describe('<Images />', () => {
  let wrapper;
  beforeEach(() => {
    moxios.install(axios)
    wrapper = setup(null);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it('Should renders Images default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test getImageList", () => {
    jest.spyOn(wrapper.instance(), "getImagesHistory");
    wrapper.instance().getImagesHistory();
    expect(wrapper.instance().getImagesHistory).toBeCalled();
    const response = [];
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().imagesHistoryData.length).not.toBe(0);
        done();
      });
    });
  });

  it("should check wrapper exist", () => {
    const bulkImgWrapper = findByTestAttr(wrapper, 'bulkOpsImages');
    expect(bulkImgWrapper.exists()).toBe(true);
  })

  it('should render ImageErrors component', () => {
    wrapper.setState({ showErrorList: true });
    const component = wrapper.find(ImageErrors);
    expect(component.length).toBe(1);
  });

  it('Should renders CommonModel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('Should renders PaginationComp default', () => {
    expect(wrapper.containsMatchingElement(<PaginationComp />)).toEqual(true);
  })

  it("should check Upload Zip text", () => {
    const zipUploadText = findByTestAttr(wrapper, 'uploadZip');
    expect(zipUploadText.text()).toMatch(constantText.bulksOpsConstant.uploadZip);
  })

  it("should check call onFileUploadAndValidate", () => {
    jest.spyOn(wrapper.instance(), "onFileUploadAndValidate");
    wrapper.instance().onFileUploadAndValidate();
    expect(wrapper.instance().onFileUploadAndValidate).toBeCalled();
  });

  it("Refresh Image List", () => {
    const spy = jest.spyOn(wrapper.instance(), 'getImagesHistory');
    const button = wrapper.find('.refreshList');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  });

})