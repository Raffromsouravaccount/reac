import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import Transcoding from '../../../_components/TranscodingManagement/Transcoding/Transcoding';
import { findByTestAttr } from  '../../../Utils'; 

import axios from "../../../_helpers/axiosInstance";
import BreadcrumbsComp from "../../../_components/Common/BreadCrumbs/BreadCrumbs";
import InlineLoader from "../../../_components/Common/InlineLoader/InlineLoader";

import LightIcon from "images/light-icon.svg";
import Config from "../../../Config/config";
/**
 * Factory function to create a ShallowWrapper for the Transcoding Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const initialState = {
  transcodingList: [{externalId: 'zee5123', name:"test"}],
  isRequestIntiate: false,
  searchText: '',
  queryData: {
    limit: 10,
    searchString: "",
    page: 0,
  },
  count: 0,
  maxPage: null
}
const initialprops = {
  history: { push: jest.fn() }
}
const setup = () => {
  const wrapper = shallow(<Transcoding />);
  return wrapper;
}

describe("Render transcoding Component", () => {
  let wrapper;
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup();
    wrapper.setState({ ...initialState });
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });
  it('Should renders transcodingList default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('Should check input field', () => {
    const inputField = wrapper.find('input');
    expect(inputField.exists()).toBe(true);
  });

  it('should test handleRoute', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalledTimes(1);
  });
  it('should test gotoMapContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'gotoMapContent');
    instance.gotoMapContent();
    expect(instance.gotoMapContent).toHaveBeenCalledTimes(1);
  });
  it('should test searchContent', () => {
    const instance = wrapper.instance();
    const event = { target: { name: "test", value: "test" } }

    jest.spyOn(instance, 'searchContent');
    instance.searchContent(event);
    expect(instance.searchContent).toHaveBeenCalledTimes(1);
  });
  it('should test getAllTranscodings', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAllTranscodings');
    instance.getAllTranscodings();
    expect(instance.getAllTranscodings).toHaveBeenCalledTimes(1);
  });
  it('should test fetchTranscoding', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchTranscoding');
    instance.fetchTranscoding();
    expect(instance.fetchTranscoding).toHaveBeenCalledTimes(1);
  });

  it('should test nextCall', () => {
    wrapper.setState({isRequestIntiate: true, maxPage: 10});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'nextCall');
    instance.nextCall(5);
    expect(instance.nextCall).toHaveBeenCalledTimes(1);
  });
  
  it('should test setQueryData', () => {
    const queryData = {
      searchString: 'tesst'
    }
    wrapper.setState({ queryData: queryData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setQueryData');
    instance.setQueryData();
    expect(instance.setQueryData).toHaveBeenCalledTimes(1);
  });
  it('should test searchHandleChange', () => {
    const event = { target: { name: "test", value: "test" } }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'searchHandleChange');
    instance.searchHandleChange(event);
    expect(instance.searchHandleChange).toHaveBeenCalledTimes(1);
  });
  it('should test handleKeyPress', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleKeyPress');
    instance.handleKeyPress();
    expect(instance.handleKeyPress).toHaveBeenCalledTimes(1);
  });
  it('should test handleKeyUp', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleKeyUp');
    instance.handleKeyUp();
    expect(instance.handleKeyUp).toHaveBeenCalledTimes(1);
  });
  it('should test refresh', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'refresh');
    instance.refresh();
    expect(instance.refresh).toHaveBeenCalledTimes(1);
  });

  it('should test refresh', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'refresh');
    instance.refresh();
    expect(instance.refresh).toHaveBeenCalledTimes(1);
  });
  it('Should renders BreadcrumbsComp default', () => {
    expect(wrapper.containsMatchingElement(<BreadcrumbsComp />)).toEqual(true);
  });
  it('Should renders InlineLoader default', () => {
    expect(wrapper.containsMatchingElement(<InlineLoader />)).toEqual(true);
  });
  it('Should renders LightIcon default', () => {
    expect(wrapper.containsMatchingElement(<LightIcon />)).toEqual(true);
  });

  it('should call getAllShows API Success', (done) => {
    moxios.stubRequest(`${Config.transcodingList}?limit=10&page=1`, {
      status: 200,
      data: {
        count: 1,
        rows: [
          {
            id: "7ed64554-7025-48a2-8178-5105f691f015",
            externalId: null,
            transcodingUid: "string16",
            transcodingDetail: [],
            status: "1",
            _created_by: null,
            _modified_by: null,
            createdOn: "2021-01-22T08:12:12.797Z",
            modifiedOn: "2021-01-22T08:12:12.797Z",
            created_by: null,
            modified_by: null
          },
        ],
      },
    });
    moxios.wait(function () {
      expect(wrapper.state('transcodingList')).toHaveLength(1);
      done();
    });
  });

  it('should test componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handleRouteBtn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
  
  it('should check refresh onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'refresh');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'refBtn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check gotoMapContent onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'gotoMapContent');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = wrapper.find('.btn-create-user');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

});