import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { CreateEditLicense } from '../../../../_components/Collection/CreateCollection/LicenseModule/SubComponent/CreateEditLicense';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';

import { collectionService } from '../../../../_services/collection.service';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CreateEditLicense {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

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
  col: "col-md-6 col-lg-6",  errorText: "", groupBy: "group", keyText: "title", label: "Country / Group", multiple: true,
  name: "country", path: "user/country-group", touched: 0, type: "file", valid: true,  validation: { required: false }, value: null,
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
  col: "col-md-6 col-lg-6",  errorText: "", groupBy: "group", keyText: "title", label: "businessType", multiple: true,
  name: "businessType", path: "user/businessType", touched: 0, type: "file", valid: true,  validation: { required: false }, value: {title: 'Premium'},
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
  col: "col-md-6 col-lg-6",  errorText: "", groupBy: "group", keyText: "title", label: "billingtype", multiple: true, disabled: false,
  name: "billingType", path: "user/billingtype", touched: 0, type: "file", valid: true,  validation: { required: false }, value: {title: 'Premium'},
  data: [
    { id: "eaa0ae7f-af0c-42c9-b611-69c58d2aa938", title: "Bangladesh", code: "BD", status: "1", group: "Others" },
    { id: "61e5bb9d-6492-4cc0-84dd-b1b6dd1aee91", title: "Indonesia", code: "ID", status: "1", group: "Others" },,
    { id: "6625d6fa-11b7-4217-a542-6490a4d43e42", title: "Malaysia", code: "MY", status: "1", group: "Others" },
    { id: "fb142448-2ca1-4e07-b0d5-98a9a0c6f034", title: "Maldives", code: "MV", status: "1", group: "Others" },
    { id: "09d227f4-a183-4585-b2db-cd4e51fc03cf", title: "Philippines", code: "PH", status: "1", group: "Others" },
    { id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
  ]
}
]

describe('<CreateEditLicense />', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let componentDidMountSpy;
  beforeEach(() => {
    wrapper = setup();
    componentDidMountSpy = jest.spyOn(CreateEditLicense.prototype, 'componentDidMount');
    wrapper.setState({ status: 'Draft' });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders CreateEditLicense default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('shallow called hooks', async () => {
    const licenseData = { billingType: { title: null, id: null } }
    const wrapper = setup({ licenseData }, null)
  });

  it('should check fillEditDetails method', () => {
    const response = {
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillEditDetails');
    instance.fillEditDetails(response);
    expect(instance.fillEditDetails).toHaveBeenCalled();
  })

 
  it('should check setSelectDataArr method', () => {
    const res = [{
      countries:
        [{ id: "7021289b-27a2-4f77-a9c3-7bf164b3d885", title: "Eritrea", code: "ER", status: "1" },
        { id: "accadc22-522a-47b4-804f-5ebb5baecdbe", title: "Ethiopia", code: "ET", status: "1" },
        { id: "f6737c9f-08b1-473e-b66d-f838be7054ce", title: "Kenya", code: "KE", status: "1" },
        { id: "fce58340-85de-4ae8-949e-3124da10b7a9", title: "Madagascar", code: "MG", status: "1" },
        { id: "d04f66b6-7a30-4665-a720-058afea69ab1", title: "Malawi", code: "MW", status: "1" }],
      length: 1,
      id: "400936a3-b479-4f65-8375-4677402c0339",
      status: "1",
      title: "Others"
    }]
    const wrapper = setup(null, { manualJsonSchema })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr(res, 0);
    expect(instance.setSelectDataArr).toHaveBeenCalled();
  });

  it('should check setSelectDataArr method else', () => {
    const res = [{
      countries:
        [{ id: "7021289b-27a2-4f77-a9c3-7bf164b3d885", title: "Eritrea", code: "ER", status: "1" },
        { id: "accadc22-522a-47b4-804f-5ebb5baecdbe", title: "Ethiopia", code: "ET", status: "1" },
        { id: "f6737c9f-08b1-473e-b66d-f838be7054ce", title: "Kenya", code: "KE", status: "1" },
        { id: "fce58340-85de-4ae8-949e-3124da10b7a9", title: "Madagascar", code: "MG", status: "1" },
        { id: "d04f66b6-7a30-4665-a720-058afea69ab1", title: "Malawi", code: "MW", status: "1" }],
      length: 1,
      id: "400936a3-b479-4f65-8375-4677402c0339",
      status: "1",
      title: "Others"
    }]
    const wrapper = setup(null, { manualJsonSchema })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr(res, 1);
    expect(instance.setSelectDataArr).toHaveBeenCalled();
  });

  it('should check selectGroup method', () => {
    const mockJson = [{
      col: "col-md-6 col-lg-6",
      data: [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
      { id: "468fd8ff-afa3-4245-8dc8-25ba230dfabd", title: "Sri Lanka", code: "LK", status: "1", group: "O" }],
      errorText: "",
      groupBy: "group",
      keyText: "title",
      label: "Country / Group",
      multiple: true,
      name: "country",
      path: "user/country-group",
      touched: 0,
      type: "dropdown",
      valid: true,
      validation: { required: false },
      value: [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore" }]
    }, {
      col: "col-md-6 col-lg-6",
      data: [{ title: "Advertisement", status: "1", id: "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      { title: "advertisement_authenticated", status: "1", id: "1d39250f-48a7-40e3-adaa-bf976cc332bb" },
      { title: "advertisement_authenticated_downloadable", status: "1", id: "9700e1fe-d36a-408b-95dd-a3e95baa9cf8" },
      { title: "advertisement_downloadable", status: "1", id: "245fee5c-c924-446b-a168-da94d9cd12c3" }],
      errorText: "",
      keyText: "title",
      label: "Business Type",
      multiple: false,
      name: "businessType",
      path: "/master/BusinessType",
      touched: 0,
      type: "dropdown",
      valid: true,
      validation: { required: false },
      value: [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore" }]
    }]
    const wrapper = setup(null, { manualJsonSchema: mockJson });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectGroup');
    instance.selectGroup();
    expect(instance.selectGroup).toHaveBeenCalled();
  })

  it('should check InputChanger method', () => {
    const wrapper = setup(null, { manualJsonSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger();
    expect(instance.InputChanger).toHaveBeenCalled();
  })

  it('should check InputChanger method for type file', () => {
    const event = { target: { value: 'test', files: [{ value: '12' }] } }
    const wrapper = setup(null, { manualJsonSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 1);
    expect(instance.InputChanger).toHaveBeenCalled();
  })

  it('should check InputChanger method for status Published', () => {
    const wrapper = setup(null, { manualJsonSchema, status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger();
    expect(instance.InputChanger).toHaveBeenCalled();
  })

  it('should check InputChanger method for Business Type', () => {
    const event = { target: { value: 'test', files: [{ value: '12' }] } }
    const wrapper = setup(null, { manualJsonSchema, status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 2);
    expect(instance.InputChanger).toHaveBeenCalled();
  })


  it('should check submitLicence method', async () => {
    const wrapper = setup(null, { manualJsonSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'submitLicence');
    instance.submitLicence();
    expect(instance.submitLicence).toHaveBeenCalled();
  })

  it('Should called submit license click!', () => {
    const wrapper = setup(null, { manualJsonSchema });
    const spy = jest.spyOn(wrapper.instance(), 'submitLicence');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'submit-license-button');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('Should called update license click!', () => {
    const editTab = 1;
    const wrapper = setup(null, { editTab })
    const spy = jest.spyOn(wrapper.instance(), 'updateLicence');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'submit-license-button');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check generateObject method', () => {
    const data = [{ id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India" }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'generateObject');
    instance.generateObject(data);
    expect(instance.generateObject).toHaveBeenCalled();
  })

  it('should check generateObject method else condition', () => {
    const data = [{ id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India" }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'generateObject');
    instance.generateObject();
    expect(instance.generateObject).toHaveBeenCalled();
  })

  it('Should check post api call', async () => {
    const id = 'c371985c-5981-4374-af3c-5b7bc924bf16';
    const params = {
      businessTypeId: "6fbedee2-921b-4abf-9143-7d006f5a1450",
      platformId: [],
      countriesId: ["2feeac02-7d14-45f0-b94a-2ae30235f79d"]
    }
    const response = {
      autoPlay: false,
      contentCategory: null,
      contentCategoryId: null,
      id: "c371985c-5981-4374-af3c-5b7bc924bf16",
      externalId: "1-3-1000097"
    }
    const mock = jest.fn().mockReturnValue(response);
    collectionService.collection_create_licence_service = mock;
    const result = await collectionService.collection_create_licence_service(id, params);
    expect(result).toBe(response);
  })

  it('Should check put api call', async () => {
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

  it('Should check componentDidMount', () => {
    const licenseData = {
      country: [{ id: 1, keyText: 'IND' }],
      businessType: [{ id: 1, keyText: 'Premium' }],
      billingType: [{ id: 1, keyText: 'club' }],
      platform: [{ id: 1, keyText: 'club' }],
      currentStatus: 'Active',
      id: 1
    }
    wrapper.setProps({ licenseData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalled();
  })

  it('should test openLicenseForm method', () => {
    const baseProps = {
      openLicenseForm: jest.fn()
    }
    wrapper.setProps({ ...baseProps });
    wrapper.find('.back-user-btn').simulate('click');
    expect(baseProps.openLicenseForm).toHaveBeenCalled();
  })

})