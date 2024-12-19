import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ViewLicenceModule from '../../../../_components/Collection/CreateCollection/LicenseModule/ViewLicenseModule';
import { findByTestAttr, storeFactory } from '../../../../Utils';
import InputField from '../../../../_components/Common/InputField/InputField';
import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';
import BadgeBox from '../../../../_components/Common/BadgeBox/BadgeBox';
import Adapter from 'enzyme-adapter-react-16';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ViewLicenceModule store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  collection_reducer: {}
}

describe('<ViewLicenceModule />', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  beforeEach(() => {
    wrapper = setup(initialState).dive();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should renders ViewLicenceModule default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('search text is echoed', () => {
    const searchVal = "test";
    wrapper.setState({ searchVal })
    const InputBox = findByTestAttr(wrapper, 'search-input-field')
    InputBox.simulate('click');
    wrapper.update();
    expect(wrapper.state('searchVal')).toBe("test");
  });

  it('should check onChange method of input field', () => {
    const event = { target: { name: 'searchVal', value: 'test' } };
    const handleSearch = jest.spyOn(wrapper.instance(), 'handleSearch');
    wrapper.update();
    const licenseInput = findByTestAttr(wrapper, 'search-input-field')
    licenseInput.simulate('change', event);
    expect(handleSearch).toBeCalled();
  })

  it('should test applyFilterForCountry', () => {
    const filters = {
       searchVal : [{title: 'Bangladesh'}]
    }
    const copyLicenseList = [{
      billingType: { title: null, id: null },
      businessType: { title: "advertisement_authenticated", id: "1d39250f-48a7-40e3-adaa-bf976cc332bb" },
      country: [
        [{ id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh" }],
        [{ id: "e86b0bd6-e3e3-4d46-a661-04548708e0db", title: "United States of America" }]],
      currentStatus: "1",
      id: "967b2d08-16d7-4fd6-b906-d834df1c16e5",
      platform: [[{ id: "6d54b9bf-c041-48c8-9150-a05c59221b22", title: "Smart TV" }]],
      templateId: undefined
    }]
    wrapper.setState({ copyLicenseList, filters })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'applyFilterForCountry');
    instance.applyFilterForCountry();
    expect(instance.applyFilterForCountry).toHaveBeenCalledTimes(1);
  })

  it('should check handleRoute onclick method', () => {
    expect(wrapper.find('.back-user-btn')
      .prop('handleRoute')).toBe(wrapper.instance().handleRoute);
  })

  it('Should renders InputField default', () => {
    expect(wrapper.containsMatchingElement(<InputField />)).toEqual(true);
  })

  it('Should renders ButtonField default', () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  })

  it('Should renders BadgeBox default', () => {
    const status = true;
    wrapper.setState({ status })
    expect(wrapper.containsMatchingElement(<BadgeBox />)).toEqual(true);
  })

  it('should check div rendering', () => {
    const licenceData = [{
      billingType: { title: null, id: null },
      businessType: { title: "advertisement_authenticated", id: "1d39250f-48a7-40e3-adaa-bf976cc332bb" },
      country: [[{ id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh" }]],
      currentStatus: "1",
      id: "967b2d08-16d7-4fd6-b906-d834df1c16e5",
      platform: [[{ id: "6d54b9bf-c041-48c8-9150-a05c59221b22", title: "Smart TV" }], [{ id: "0b4bf044-b439-4c98-8fa3-f4a15e9eab3d", title: "KaiOS" }]],
      templateId: undefined
    }]
    wrapper.setState({ licenceData });
    expect(wrapper.find(".lice-box").length).toBe(1);
  })

  it('should test componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it("should check componentWillReceiveProps", () => {
    const mockProps = {
      licenceData: {
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

})