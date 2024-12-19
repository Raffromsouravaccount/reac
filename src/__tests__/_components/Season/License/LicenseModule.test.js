
import { findByTestAttr } from '../../../../Utils';
import InputField from '../../../../_components/Common/InputField/InputField';
import Adapter from 'enzyme-adapter-react-16';
import LockedPopup from '../../../../_components/CreateMovie/LockedPopup';
import { CommonModel } from '../../../../_components/Common/Model/CommonModel';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { LicenseModule }  from '../../../../_components/Season/LicenseModule/licenseModule';
import { tvSeasonService } from "../../../../_services/tvSeason.service";
import jsonData from '../../../../_components/Season/Schema/Season_StandardJourney_FE_Structure.json'
import { BeachAccess } from '@material-ui/icons';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<LicenseModule {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
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

const manualJsonSchema = [{
  col: "col-md-6 col-lg-6", errorText: "", groupBy: "group", keyText: "title", label: "Name", multiple: true,
  name: "country", path: "user/country-group", touched: 0, type: "dropdown", valid: true, validation: { required: false }, value: null,
  data: [
    { id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh", code: "BD", status: "1", group: "Others" },
    { id: "61e5bb9d-6492-4cc0-84dd-b1b6dd1aee91", title: "Indonesia", code: "ID", status: "1", group: "Others" },
    { id: "6625d6fa-11b7-4217-a542-6490a4d43e42", title: "Malaysia", code: "MY", status: "1", group: "Others" },
    { id: "fb142448-2ca1-4e07-b0d5-98a9a0c6f034", title: "Maldives", code: "MV", status: "1", group: "Others" },
    { id: "09d227f4-a183-4585-b2db-cd4e51fc03cf", title: "Philippines", code: "PH", status: "1", group: "Others" },
    { id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
  ]
},
{
  col: "col-md-6 col-lg-6", errorText: "", groupBy: "group", keyText: "title", label: "Country / Group", multiple: true,
  name: "country", path: "user/country-group", touched: 0, type: "file", valid: true, validation: { required: false }, value: null,
  data: [
    { id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh", code: "BD", status: "1", group: "Others" },
    { id: "61e5bb9d-6492-4cc0-84dd-b1b6dd1aee91", title: "Indonesia", code: "ID", status: "1", group: "Others" },
    { id: "6625d6fa-11b7-4217-a542-6490a4d43e42", title: "Malaysia", code: "MY", status: "1", group: "Others" },
    { id: "fb142448-2ca1-4e07-b0d5-98a9a0c6f034", title: "Maldives", code: "MV", status: "1", group: "Others" },
    { id: "09d227f4-a183-4585-b2db-cd4e51fc03cf", title: "Philippines", code: "PH", status: "1", group: "Others" },
    { id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
  ]
},
{
  col: "col-md-6 col-lg-6", errorText: "", groupBy: "group", keyText: "title", label: "businessType", multiple: true,
  name: "businessType", path: "user/businessType", touched: 0, type: "file", valid: true, validation: { required: false }, value: { title: 'Premium' },
  data: [
    { id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh", code: "BD", status: "1", group: "Others" },
    { id: "61e5bb9d-6492-4cc0-84dd-b1b6dd1aee91", title: "Indonesia", code: "ID", status: "1", group: "Others" },
    { id: "6625d6fa-11b7-4217-a542-6490a4d43e42", title: "Malaysia", code: "MY", status: "1", group: "Others" },
    { id: "fb142448-2ca1-4e07-b0d5-98a9a0c6f034", title: "Maldives", code: "MV", status: "1", group: "Others" },
    { id: "09d227f4-a183-4585-b2db-cd4e51fc03cf", title: "Philippines", code: "PH", status: "1", group: "Others" },
    { id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
  ]
},
{
  col: "col-md-6 col-lg-6", errorText: "", groupBy: "group", keyText: "title", label: "billingtype", multiple: true, disabled: false,
  name: "billingType", path: "user/billingtype", touched: 0, type: "file", valid: true, validation: { required: false }, value: { title: 'Premium' },
  data: [
    { id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh", code: "BD", status: "1", group: "Others" },
    { id: "61e5bb9d-6492-4cc0-84dd-b1b6dd1aee91", title: "Indonesia", code: "ID", status: "1", group: "Others" }, ,
    { id: "6625d6fa-11b7-4217-a542-6490a4d43e42", title: "Malaysia", code: "MY", status: "1", group: "Others" },
    { id: "fb142448-2ca1-4e07-b0d5-98a9a0c6f034", title: "Maldives", code: "MV", status: "1", group: "Others" },
    { id: "09d227f4-a183-4585-b2db-cd4e51fc03cf", title: "Philippines", code: "PH", status: "1", group: "Others" },
    { id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
  ]
}]

describe('<LicenseModule />', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let componentDidMountSpy, componentWillReceivePropsSpy;
  const baseProps = {
    jsonData : jsonData
  }
  beforeEach(() => {
    wrapper = setup({...baseProps});
    wrapper.setState({ status: 'Draft'});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders LicenseModule default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('Should show states in store as required', () => {
    const intialState = {
      collection_reducer: {
        collectionLicence: [{
          id: "3bb64421-f15f-4dda-adec-03c324c140a3",
          status: "1",
          platformId: []
        }]
      }
    };
    expect(mapStateToProps(intialState).licenceData).toEqual([{ id: "3bb64421-f15f-4dda-adec-03c324c140a3", status: "1", platformId: [] }]);
  })

  it('should check handleEdit method', () => {
    const stateData = {
      isLocked: true,
      licenceData: [{
        id: "3bb64421-f15f-4dda-adec-03c324c140a3",
        status: "1",
        platformId: []
      }]
    }
    const wrapper = setup(null, { ...stateData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleEditStatus');
    instance.handleEditStatus();
    expect(instance.handleEditStatus).toHaveBeenCalledTimes(1);
  });

  it('should check activateDeactivateLicence method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'activateDeactivateLicence');
    instance.activateDeactivateLicence();
    expect(instance.activateDeactivateLicence).toHaveBeenCalledTimes(1);
  });

  it('search text is echoed', () => {
    const searchVal = "test";
    const wrapper = setup(null, { searchVal });
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
    const searchVal = 'bangladesh'
    const wrapper = setup(null, { copyLicenseList, searchVal });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'applyFilterForCountry');
    instance.applyFilterForCountry();
    expect(instance.applyFilterForCountry).toHaveBeenCalledTimes(1);
  })

  it('should test generateObject', () => {
    let data = [[{ id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh" }]]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'generateObject');
    instance.generateObject(data);
    expect(instance.generateObject).toHaveBeenCalledTimes(1);
  })

  it('should test unLockProperties', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'unLockProperties');
    instance.unLockProperties();
    expect(instance.unLockProperties).toHaveBeenCalledTimes(1);
  })

  it('Should renders LockedPop default', () => {
    expect(wrapper.containsMatchingElement(<LockedPopup />)).toEqual(true);
  })

  it('Should renders CommonModel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('Should renders InputField default', () => {
    expect(wrapper.containsMatchingElement(<InputField />)).toEqual(true);
  })

  it('Should get success API', async () => {
    const expectedPosts = [
      {
        id: "3bb64421-f15f-4dda-adec-03c324c140a3",
        status: "1",
        platformId: []
      }]
    const mock = jest.fn().mockReturnValue(expectedPosts);
    collectionService.collection_get_license_service = mock;
    const result = await collectionService.collection_get_license_service();
    expect(result).toBe(expectedPosts);
  })

  it('should test showHideStatePopup', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideStatePopup');
    instance.showHideStatePopup();
    expect(instance.showHideStatePopup).toBeCalled();
  })

  it('should check state value', () => {
    const showLockedPopup = true;
    const wrapper = setup(null, { showLockedPopup });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideStatePopup');
    instance.showHideStatePopup();
    expect(wrapper.state('showLockedPopup')).toBe(true);
  });

  it('should test showHideStatePopupLock', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideStatePopupLock');
    instance.showHideStatePopupLock();
    expect(instance.showHideStatePopupLock).toHaveBeenCalledTimes(1);
  })

  it('Should check edit api call', async () => {
    const id = 'c371985c-5981-4374-af3c-5b7bc924bf16';
    const params = {
      businessTypeId: "6fbedee2-921b-4abf-9143-7d006f5a1450",
      platformId: [],
      countriesId: ["2feeac02-7d14-45f0-b94a-2ae30235f79d", "2feeac02-7d14-45f0-b94a-2ae30235f79c"]
    }
    const response = {
      autoPlay: false,
      contentCategory: null,
      contentCategoryId: null,
      id: "c371985c-5981-4374-af3c-5b7bc924bf16",
      externalId: "1-3-1000097"
    }
    const mock = jest.fn().mockReturnValue(response);
    collectionService.collection_edit_licence_service = mock;
    const result = await collectionService.collection_edit_licence_service(id, params);
    expect(result).toBe(response);
  })

  it('should test componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })

  it('should test getCollectionData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getCollectionData');
    instance.getCollectionData();
    expect(instance.getCollectionData).toBeCalled();
  })

  it('should test componentWillReceiveProps', () => {
    const nextProps = {
      licenceData: {
        data: [
          {
            BillingType: { title: null, id: null }, BusinessType: { title: "advertisement_authenticated", id: "1d39250f-48a7-40e3-adaa-bf976cc332bb" },
            ReasonType: { title: null, id: null }, countriesId: [Array(1)], id: "b0d8a607-e4b3-401f-b8d9-f15d5cd72913", platformId: [Array(1)], status: "1"
          }
        ]
      }
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentWillReceiveProps');
    instance.componentWillReceiveProps(nextProps);
    expect(instance.componentWillReceiveProps).toBeCalled();
  })

  it('should test InputChanger ', () => {
    const event = {target: {value: 'test'}}
    wrapper.setState({ JSONCommonModel: manualJsonSchema});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 0, 'clearReason');
    expect(instance.InputChanger).toBeCalled();
  })

  it('should test InputChanger else condition', () => {
    const event = {target: {value: 'test'}}
    wrapper.setState({ JSONCommonModel: manualJsonSchema});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 0);
    expect(instance.InputChanger).toBeCalled();
  })

  it('should test InputChanger else condition for type file', () => {
    const event = {target: {value: 'test', files: [{}]}}
    wrapper.setState({ JSONCommonModel: manualJsonSchema});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 1);
    expect(instance.InputChanger).toBeCalled();
  })

  it('should test setSelectDataArr', () => {
    wrapper.setState({ JSONCommonModel: manualJsonSchema});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr(null, 0);
    expect(instance.setSelectDataArr).toBeCalled();
  })


})