
import React from 'react'
import { shallow } from 'enzyme';
import { findByTestAttr, storeFactory } from '../../../../Utils';
import ViewLicenseModule from '../../../../_components/CreateMovie/LicenseModule/ViewLicenceModule';
import { expect, it, jest } from '@jest/globals';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ViewLicenseModule store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  movieMgmt_reducer: {}
}

describe('LicenseModule', () => {
  let wrapper;
  const baseProps = {
    jsonData: jsonData.License,
    markAsDone: jest.fn(),
    getLicenseData: jest.fn()
  }
  beforeEach(() => {
    const wrapperInstance = setup(initialState, { ...baseProps });
    wrapper = wrapperInstance.dive();
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check componentDidMount method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalled();
  })

  it('should check componentWillReceiveProps method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentWillReceiveProps');
    instance.componentWillReceiveProps();
    expect(instance.componentWillReceiveProps).toHaveBeenCalled();
  })
  it('should check handleSearch method', () => {
    const event = {target: {name :'test', value: ""}};
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleSearch');
    instance.handleSearch(event);
    expect(instance.handleSearch).toHaveBeenCalled();
  })
  it('should check getExpiredLicense method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getExpiredLicense');
    instance.getExpiredLicense();
    expect(instance.getExpiredLicense).toHaveBeenCalled();
  })
  it("should test applyFilter", () => {
    const validateObj = {
      fromDate: "2021-04-21",
      toDate: "2021-04-24",
      businessType: null,
      billingType: null,
      platform: [],
      status: "",
    };
    const copyLicenseList = [
      {
        billingType: { title: null, id: null },
        businessType: {
          title: "free_authenticated_downloadable",
          id: "0ce15743-1e88-4f49-8e1f-f7559f4d389c",
        },
        country: [
          [
            {
              id: "d3f975c3-7e80-4aa4-b8a0-fc35ba937c10",
              title: "Equatorial Guinea",
            },
          ],
          [{ id: "595a0657-d60e-4248-b75d-8bc2c77181bb", title: "Congo" }],
          [{ id: "66e3f511-73f1-4731-9a0a-c070558698aa", title: "Angola" }],
          [{ id: "260d4e32-108b-4420-a085-2d945e133b5c", title: "Lesotho" }],
          [{ id: "ba7216dd-51cb-40d3-808a-cfc0b4597752", title: "Botswana" }],
          [{ id: "cd56aa76-153a-43b1-9393-2ece61ccefe0", title: "Namibia" }],
        ],
        fromDate: "2021-04-21T00:00:00.000Z",
        platform: [],
        reason: { title: null, id: null },
        toDate: "2021-04-24T00:00:00.000Z",
        tvodTier: { title: null, id: null },
        id: "1a9b529a-14e6-4175-ad11-cb4a4c68c3c1",
        currentStatus: "1",
        createdBy: "",
        updatedBy: "",
        updatedByEmail: "",
        dateCreated: "",
        setName: "Set License",
        isParentTypeTvod: false,
        validateCountries: false,
      },
    ];
    const filters = { searchVal: "" };
    wrapper.setState({ copyLicenseList: copyLicenseList, filters: filters });
    const instance = wrapper.instance();
    jest.spyOn(instance, "applyFilter");
    instance.applyFilter(validateObj);
    expect(instance.applyFilter).toHaveBeenCalledTimes(1);
  });

  
  
})
