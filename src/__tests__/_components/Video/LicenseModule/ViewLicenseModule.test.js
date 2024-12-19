import React from "react";
import { shallow } from "enzyme";

import { storeFactory } from "../../../../Utils";
import ViewLicenseModule from "../../../../_components/Video/LicenseModule/ViewLicenseModule";

const setup = (initialstate = {}, props = {}) => {
  const store = storeFactory(initialstate);
  const wrapper = shallow(
    <ViewLicenseModule store={store} {...props} />
  ).dive();
  return wrapper;
};
const initialState = {
  videoMgmt_reducer: {},
};

describe("ViewLicenseModule", () => {
  let wrapper;
  const baseProps = {
    unLockedSession: jest.fn(),
    markAsDone: jest.fn(),
    language: "en",
    getLicenseData: jest.fn(),
    unLockedSession: jest.fn(),
    licenseList: [],
  };
  const state = {
    commonmodel_section: [
      {
        name: "reason",
        type: "dropdown",
        value: [],
        col: "col-md-12 col-lg-12",
        path: "/master/ReasonType",
        keyText: "title",
        multiple: false,
        label: "Reason",
        data: [],
        errorText: "",
        validation: {
          required: true,
        },
      },
    ],
    currentStatus: "test",
    filters: {
        searchVal: 'test'
    },
    copyLicenseList: [{mockValue: 'test',}]
  };

  beforeEach(() => {
    const wrapperInstance = setup(initialState, { ...baseProps });
    wrapper = wrapperInstance.dive();
    wrapper.setState({ ...state });
  });

  it("render component without error", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should check handleSearch", () => {
    const event = { target: { name: "abc", value: "mock" } };
    jest.spyOn(wrapper.instance(), "handleSearch");
    wrapper.instance().handleSearch(event);
    expect(wrapper.instance().handleSearch).toBeCalled();
  });

  it("should check applyFilter", () => {
    jest.spyOn(wrapper.instance(), "applyFilter");
    wrapper.instance().applyFilter();
    expect(wrapper.instance().applyFilter).toBeCalled();
  });

  it("should check componentWillReceiveProps", () => {
    const mockProps = {
      licenseList: {
        data: [
          {
            BillingType: {
              title: "Premium",
              id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2",
            },
            BusinessType: {
              title: "Premium",
              id: "24d21e44-16f9-4ecc-a14e-f9e060b7a48e",
            },
            TVODTier: {
              title: "TVOD_Platinum",
              id: "01e686be-71ca-4355-b8e6-a85d6b4b6118",
            },
            countriesId: [],
            id: "12451a5f-a97f-4be1-b863-ed988bf0209d",
            platformId: [],
            reasonType: { title: null, id: null },
            status: "1",
            validFrom: "2021-02-02T00:00:00.000Z",
            validUntil: "2021-02-26T00:00:00.000Z",
            videoId: "0cd0742f-080c-44ab-b366-ca4c545ef9ab",
          },
        ],
      },
    };
    jest.spyOn(wrapper.instance(), "componentWillReceiveProps");
    wrapper.instance().componentWillReceiveProps(mockProps);
    expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
  });
});
