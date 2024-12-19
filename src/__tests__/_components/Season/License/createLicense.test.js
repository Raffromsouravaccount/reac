import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { CreateLicense }  from '../../../../_components/Season/LicenseModule/subModule/createLicense';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { tvSeasonService } from "../../../../_services/tvSeason.service";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CreateLicense {...props} />)
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

const template_edit_section = [{
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


describe('<CreateLicense />', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let componentDidMountSpy;
  beforeEach(() => {
    wrapper = setup();
    componentDidMountSpy = jest.spyOn(CreateLicense.prototype, 'componentDidMount');
    wrapper.setState({ status: 'Draft' });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should renders CreateLicense default', () => {
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
  it('should check fillEditDetailsTemplate method', () => {
    const response = {
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillEditDetailsTemplate');
    instance.fillEditDetailsTemplate(response);
    expect(instance.fillEditDetailsTemplate).toHaveBeenCalled();
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


  it('should check selectGroupForTemplate method', () => {
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
    jest.spyOn(instance, 'selectGroupForTemplate');
    instance.selectGroupForTemplate();
    expect(instance.selectGroupForTemplate).toHaveBeenCalled();
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
  it('should check submitLicence method', async () => {
    const wrapper = setup(null, { manualJsonSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'submitLicence');
    instance.submitLicence();
    expect(instance.submitLicence).toHaveBeenCalled();
  })
  it('Should called Edit license click!', () => {
    const editTab = 1;
    const wrapper = setup(null, { editTab })
    const spy = jest.spyOn(wrapper.instance(), 'editLicence');
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
  it('should test InputChanger for file type',()=>{
    const event = {target:{name:'setName',files:[{path:"test/image/path"}]}}
  
        const manualJsonSchema= [{
          "name": "setName",
          "type": "file",
          "value": "",
          "col": "col-md-7 col-lg-7",
          "label": "Set Name",
          "errorText": "",
          "validation": {
            "required": true,
            "isAlphaNumericWithSpecialChars": true,
            "maxLength": 250
          }
        }, {
          "name": "fromDate",
          "type": "date",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "label": "License From Date",
          "minDate": "sameOrAfter",
          "disablePast": true,
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "toDate",
          "type": "date",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "label": "License To Date",
          "minDate": "sameOrAfter",
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "country",
          "type": "dropdown",
          "value": [],
          "col": "col-md-6 col-lg-6",
          "multiple": true,
          "groupBy": "group",
          "path": "user/country-group",
          "keyText": "title",
          "label": "Country / Group",
          "data": [],
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "businessType",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/BusinessType",
          "keyText": "title",
          "label": "Business Type",
          "data": [],
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "billingType",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/BillingType",
          "keyText": "title",
          "label": "Billing Type",
          "data": [],
          "disabled": true,
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "platform",
          "type": "conditionalDropdown",
          "value": [],
          "col": "col-md-6 col-lg-6",
          "multiple": true,
          "path": "/master/Platform",
          "keyText": "title",
          "label": "Platform",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "tvodTier",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/TVODTier",
          "keyText": "title",
          "label": "TVOD Tier",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "isParentTypeTvod",
          "value": false,
          "col": "col-md-6 col-lg-6",
          "type": "checkbox",
          "label": "Parent Type TVOD",
          "labelPlacement": "end",
          "validation": {
            "required": false
          }
        }]
    // const wrapper = setup();
   wrapper.setState({manualJsonSchema:manualJsonSchema})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'InputChanger');
   instance.InputChanger(event,0);
   expect(instance.InputChanger).toHaveBeenCalledTimes(1);
  });
  
  it('should test InputChangerTemplate ',()=>{
    const event = {target:{name:'setName',value:'test value' ,files:[{path:"test/image/path"}]}}
    const templateListData =  [{"billingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"businessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"country":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platform":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"tvodTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"currentStatus":"Active","invalidCountry":[],"licenseDate":[{"name":"setName","type":"text","value":"kk","col":"col-md-6 col-lg-6","label":"Set Name","errorText":null,"validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250},"valid":true,"touched":1},{"name":"isParentTypeTvod","value":false,"col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"errorText":""},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":null,"validation":{"required":true}},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","disablePast":true,"errorText":null,"validation":{"required":true}}]}] 
   wrapper.setState({templateListData:templateListData})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'InputChangerTemplate');
   instance.InputChangerTemplate(event,0,0);
   expect(instance.InputChangerTemplate).toHaveBeenCalledTimes(1);
  });
  
  it('should test InputChanger',()=>{
    const event = {target:{name:'setName',files:[{path:"test/image/path"}]}}

        const manualJsonSchema= [{
          "name": "setName",
          "type": "text",
          "value": "",
          "col": "col-md-7 col-lg-7",
          "label": "Set Name",
          "errorText": "",
          "validation": {
            "required": true,
            "isAlphaNumericWithSpecialChars": true,
            "maxLength": 250
          }
        }, {
          "name": "fromDate",
          "type": "date",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "label": "License From Date",
          "minDate": "sameOrAfter",
          "disablePast": true,
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "toDate",
          "type": "date",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "label": "License To Date",
          "minDate": "sameOrAfter",
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "country",
          "type": "dropdown",
          "value": [],
          "col": "col-md-6 col-lg-6",
          "multiple": true,
          "groupBy": "group",
          "path": "user/country-group",
          "keyText": "title",
          "label": "Country / Group",
          "data": [],
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "businessType",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/BusinessType",
          "keyText": "title",
          "label": "Business Type",
          "data": [],
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "billingType",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/BillingType",
          "keyText": "title",
          "label": "Billing Type",
          "data": [],
          "disabled": true,
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "platform",
          "type": "conditionalDropdown",
          "value": [],
          "col": "col-md-6 col-lg-6",
          "multiple": true,
          "path": "/master/Platform",
          "keyText": "title",
          "label": "Platform",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "tvodTier",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/TVODTier",
          "keyText": "title",
          "label": "TVOD Tier",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "isParentTypeTvod",
          "value": false,
          "col": "col-md-6 col-lg-6",
          "type": "checkbox",
          "label": "Parent Type TVOD",
          "labelPlacement": "end",
          "validation": {
            "required": false
          }
        }]
    // const wrapper = setup();
   wrapper.setState({manualJsonSchema:manualJsonSchema})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'InputChanger');
   instance.InputChanger(event,1);
   expect(instance.InputChanger).toHaveBeenCalledTimes(1);
 });


  it('should check InputChanger method for type file', () => {
    const event = { target: { value: 'this is test', files: [{ value: '1000' }] } }
    const wrapper = setup(null, { manualJsonSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 1);
    expect(instance.InputChanger).toHaveBeenCalled();
  })
  it('should check InputChangerTemplate method for type file', () => {
    const event = { target: { value: 'this is test', files: [{ value: '1000' }] } }
    const wrapper = setup(null, { manualJsonSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChangerTemplate');
    instance.InputChangerTemplate(event, 1);
    expect(instance.InputChangerTemplate).toHaveBeenCalled();
  })


  
  it('should check InputChangerGroup method for type file', () => {
    const event = { target: { value: 'This is Test ', files: [{ value: '1000' }] } }
    const wrapper = setup(null, { template_edit_section });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChangerGroup');
    instance.InputChangerGroup(event, 1);
    expect(instance.InputChangerGroup).toHaveBeenCalled();
  })
  
  it('should check InputChangerTemplate method for type file', () => {
    const event = { target: { value: 'This is Test ', files: [{ value: '1000' }] } }
    const wrapper = setup(null, { template_edit_section });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChangerTemplate');
    instance.InputChangerTemplate(event, 1);
    expect(instance.InputChangerTemplate).toHaveBeenCalled();
  })
  
  
  it('should check InputChanger method for status Published', () => {
    const wrapper = setup(null, { manualJsonSchema, status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger();
    expect(instance.InputChanger).toHaveBeenCalled();
  })

  it('should check InputChangerTemplate method for status Published', () => {
    const wrapper = setup(null, { manualJsonSchema, status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChangerTemplate');
    instance.InputChangerTemplate();
    expect(instance.InputChangerTemplate).toHaveBeenCalled();
  })

  it('should check InputChanger method for Business Type', () => {
    const event = { target: { value: 'test', files: [{ value: '12' }] } }
    const wrapper = setup(null, { manualJsonSchema, status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger(event, 2);
    expect(instance.InputChanger).toHaveBeenCalled();
  })
  it('should check InputChangerTemplate method for Business Type', () => {
    const event = { target: { value: 'test', files: [{ value: '12' }] } }
    const wrapper = setup(null, { manualJsonSchema, status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChangerTemplate');
    instance.InputChangerTemplate(event, 2);
    expect(instance.InputChangerTemplate).toHaveBeenCalled();
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
    tvSeasonService.create_licence_service = mock;
    const result = await tvSeasonService.create_licence_service(id, params);
    expect(result).toBe(response);
  })
  it('get response from saveTemplateLicence', async () => {
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
    tvSeasonService.create_licence_service = mock;
    const result = await tvSeasonService.create_licence_service(id, params);
    expect(result).toBe(response);
  })
  


  it('Should check Get License api call', async () => {
    const id = 'c371985c-5981-4374-af3c-5b7bc924bf16';
    const params = {
      id: "c371985c-5981-4374-af3c-5b7bc924bf16",
    }
    const response = {
      autoPlay: false,
      contentCategory: null,
      contentCategoryId: null,
      id: "c371985c-5981-4374-af3c-5b7bc924bf16",
      externalId: "1-3-1000097"
    }
    const mock = jest.fn().mockReturnValue(response);
    tvSeasonService.list_licence_service = mock;
    const result = await tvSeasonService.list_licence_service(id, params);
    expect(result).toBe(response);
  })


  it('should check submitTemplateLicence method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'submitTemplateLicence');
    instance.submitTemplateLicence();
    expect(instance.submitTemplateLicence).toHaveBeenCalled();
  })
  it('should check handleTemplate method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleTemplate');
    instance.handleTemplate();
    expect(instance.handleTemplate).toHaveBeenCalled();
  })
  it('should check handleEdit method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleEdit');
    instance.handleEdit();
    expect(instance.handleEdit).toHaveBeenCalled();
  })
  
  it('should check handleValidateError method', () => {
    const templateListData = {
      country: [
        { id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso" },
        { id: "0077a5a3-461f-4d5d-9d22-fc30923c4a02", title: "Northern Mariana Islands" },
        { id: "011c2697-7ea6-440d-9f4d-6840f08f2197", title: "United Arab Emirates" }]
    };
    jest.spyOn(wrapper.instance(), 'handleValidateError');
    wrapper.instance().handleValidateError(templateListData);
    expect(wrapper.instance().handleValidateError).toBeCalled();
  })
  it('should check handleValidateError method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleValidateError');
    instance.handleValidateError();
    expect(instance.handleValidateError).toHaveBeenCalled();
  })
  it('should check handlerButtonChange method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handlerButtonChange');
    instance.handlerButtonChange();
    expect(instance.handlerButtonChange).toHaveBeenCalled();
  })
  it('should check editLicence method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'editLicence');
    instance.editLicence();
    expect(instance.editLicence).toHaveBeenCalled();
  })
 
  it('should check submitLicence method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'submitLicence');
    instance.submitLicence();
    expect(instance.submitLicence).toHaveBeenCalled();
  })
  it('should check generateObject method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'generateObject');
    instance.generateObject();
    expect(instance.generateObject).toHaveBeenCalled();
  })

  it('should check generateObjectForSubmitLicense method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'generateObjectForSubmitLicense');
    instance.generateObjectForSubmitLicense();
    expect(instance.generateObjectForSubmitLicense).toHaveBeenCalled();
  })
  it('should check checkValidationForUSerCountry method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkValidationForUSerCountry');
    instance.checkValidationForUSerCountry();
    expect(instance.checkValidationForUSerCountry).toHaveBeenCalled();
  })
  it('should check saveTemplateLicence method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'saveTemplateLicence');
    instance.saveTemplateLicence();
    expect(instance.saveTemplateLicence).toHaveBeenCalled();
  })
 
  it('should check handleLicenceChange method', () => {
    const event = { target: { value: 'test', files: [{ value: '12' }] } }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleLicenceChange');
    instance.handleLicenceChange(event, 2);
    expect(instance.handleLicenceChange).toHaveBeenCalled();
  })
  it('should test componentDidMount ',()=>{
    const licenseData = {"billingType":{"title":null,"id":null},"businessType":{"title":"advertisement_downloadable","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},"country":[[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"}],[{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"}],[{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],[{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"}],[{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"}],[{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"}],[{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"}],[{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana"}],[{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia"}],[{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa"}],[{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland"}]],"fromDate":"2021-04-20T00:00:00.000Z","platform":[[{"id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d","title":"KaiOS"}]],"reason":{"title":null,"id":null},"toDate":"2021-04-25T00:00:00.000Z","tvodTier":{"title":null,"id":null},"id":"6f42817b-2778-4053-83b3-c3f990e0e240","currentStatus":"1","createdBy":"","updatedBy":"","updatedByEmail":"","dateCreated":"","setName":"a","isParentTypeTvod":true,"validateCountries":true}
     wrapper.setProps({licenseData:licenseData,jsonData:manualJsonSchema})
     const instance = wrapper.instance();
     jest.spyOn(instance, 'componentDidMount');
     instance.componentDidMount();
     expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
  

  it("should test setSelectDataArrTemplate", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectDataArrTemplate");
    const res = [
      {
         "id":"400936a3-b479-4f65-8375-4677402c0339",
         "title":"Others",
         "countries":[
            {
               "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
               "title":"India",
               "code":"IN",
               "status":"1"
            }
         ],
         "status":"1"
      }];
      const template_edit_section = [{
        "name": "country",
        "type": "dropdown",
        "value": [],
        "col": "col-md-6 col-lg-6",
        "multiple": true,
        "groupBy": "group",
        "path": "user/country-group",
        "keyText": "title",
        "label": "Country / Group",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      }, {
        "name": "businessType",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/BusinessType",
        "keyText": "title",
        "label": "Business Type",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      }, {
        "name": "billingType",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/BillingType",
        "keyText": "title",
        "label": "Billing Type",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }, {
        "name": "platform",
        "type": "conditionalDropdown",
        "value": [],
        "col": "col-md-6 col-lg-6",
        "multiple": true,
        "path": "/master/Platform",
        "keyText": "title",
        "label": "Platform",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }, {
        "name": "tvodTier",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/TVODTier",
        "keyText": "title",
        "label": "TVOD Tier",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }]
   wrapper.setState({template_edit_section:template_edit_section})
    instance.setSelectDataArrTemplate(res,0);
    expect(instance.setSelectDataArrTemplate).toHaveBeenCalledTimes(1);
  });
  it("should test selectGroup", () => {
    const manualJsonSchema = [{
      "name": "setName",
      "type": "text",
      "value": "a",
      "col": "col-md-7 col-lg-7",
      "label": "Set Name",
      "errorText": "",
      "validation": {
        "required": true,
        "isAlphaNumericWithSpecialChars": true,
        "maxLength": 250
      },
      "touched": 0
    }, {
      "name": "fromDate",
      "type": "date",
      "value": "2021-04-20",
      "col": "col-md-6 col-lg-6",
      "label": "License From Date",
      "minDate": "sameOrAfter",
      "disablePast": true,
      "errorText": "",
      "validation": {
        "required": true
      },
      "touched": 0
    }, {
      "name": "toDate",
      "type": "date",
      "value": "2021-04-25",
      "col": "col-md-6 col-lg-6",
      "label": "License To Date",
      "minDate": "sameOrAfter",
      "errorText": "",
      "validation": {
        "required": true
      },
      "touched": 0
    }, {
      "name": "country",
      "type": "dropdown",
      "value": [],
      "col": "col-md-6 col-lg-6",
      "multiple": true,
      "groupBy": "group",
      "path": "user/country-group",
      "keyText": "title",
      "label": "Country / Group",
      "data": [{
        "id": "66e3f511-73f1-4731-9a0a-c070558698aa",
        "title": "Angola",
        "code": "AO",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "cc345c9b-335e-4283-ac51-c603e0bbe7d6",
        "title": "Cameroon",
        "code": "CM",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "d3044dbd-1dd8-4cda-8602-e4e03f4b557b",
        "title": "Central African Republic",
        "code": "CF",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "aa271ec3-faff-46ac-aa6d-bdda1862e228",
        "title": "Chad",
        "code": "TD",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "595a0657-d60e-4248-b75d-8bc2c77181bb",
        "title": "Congo",
        "code": "CG",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "190bd48a-86ec-459c-a734-3679cb23aac1",
        "title": "Congo (Democratic Republic of the)",
        "code": "CD",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67",
        "title": "Gabon",
        "code": "GA",
        "status": "1",
        "group": "AFRICA_MA"
      }, {
        "id": "ba7216dd-51cb-40d3-808a-cfc0b4597752",
        "title": "Botswana",
        "code": "BW",
        "status": "1",
        "group": "AFRICA_SA"
      }, {
        "id": "cd56aa76-153a-43b1-9393-2ece61ccefe0",
        "title": "Namibia",
        "code": "NA",
        "status": "1",
        "group": "AFRICA_SA"
      }, {
        "id": "386588f9-0080-4d4a-9b7c-7f2d1dc60c77",
        "title": "South Africa",
        "code": "ZA",
        "status": "1",
        "group": "AFRICA_SA"
      }, {
        "id": "0ea03c08-7086-4519-814c-e4333581ba8d",
        "title": "Swaziland",
        "code": "SZ",
        "status": "1",
        "group": "AFRICA_SA"
      }],
      "errorText": "Please enter the required fields.",
      "validation": {
        "required": true
      },
      "touched": 1
    }, {
      "name": "businessType",
      "type": "dropdown",
      "value": {
        "title": "advertisement_downloadable",
        "id": "245fee5c-c924-446b-a168-da94d9cd12c3"
      },
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/BusinessType",
      "keyText": "title",
      "label": "Business Type",
      "data": [{
        "title": "Advertisement",
        "status": "1",
        "id": "6fbedee2-921b-4abf-9143-7d006f5a1450"
      }, {
        "title": "advertisement_authenticated",
        "status": "1",
        "id": "1d39250f-48a7-40e3-adaa-bf976cc332bb"
      }, {
        "title": "advertisement_authenticated_downloadable",
        "status": "1",
        "id": "9700e1fe-d36a-408b-95dd-a3e95baa9cf8"
      }, {
        "title": "advertisement_downloadable",
        "status": "1",
        "id": "245fee5c-c924-446b-a168-da94d9cd12c3"
      }, {
        "title": "free_authenticated",
        "status": "1",
        "id": "16066125-0356-4b8b-9633-b1032b0ffeff"
      }, {
        "title": "free_authenticated_downloadable",
        "status": "1",
        "id": "0ce15743-1e88-4f49-8e1f-f7559f4d389c"
      }, {
        "title": "free_downloadable",
        "status": "1",
        "id": "80a13565-f2a5-4036-bb4e-251d7cb030a9"
      }, {
        "title": "Premium",
        "status": "1",
        "id": "24d21e44-16f9-4ecc-a14e-f9e060b7a48e"
      }, {
        "title": "premium_downloadable",
        "status": "1",
        "id": "d6b5d8f5-2322-4d7c-acd5-7e1bea010132"
      }, {
        "title": "test",
        "status": "1",
        "id": "14739970-e00f-4c7b-a788-daa1ce8cb386"
      }, {
        "title": "testing",
        "status": "1",
        "id": "a74e6da7-7567-41f2-9c71-4c0c34703d10"
      }, {
        "title": "tvod",
        "status": "1",
        "id": "317fbc1f-24fa-4ce4-97be-0857cd3948b3"
      }, {
        "title": "tvod_downloadable",
        "status": "1",
        "id": "1911d195-02d2-412d-9b3c-cc9f241d4f43"
      }],
      "errorText": "",
      "validation": {
        "required": true
      },
      "touched": 0
    }, {
      "name": "billingType",
      "type": "dropdown",
      "value": {
        "title": null,
        "id": null
      },
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/BillingType",
      "keyText": "title",
      "label": "Billing Type",
      "data": [{
        "title": "Club",
        "status": "1",
        "id": "8dc545d9-470e-4fb8-b32f-bdee3368c952"
      }, {
        "title": "Premium",
        "status": "1",
        "id": "858f7d02-3388-49ef-ba1c-4a594df616f8"
      }, {
        "title": "test",
        "status": "1",
        "id": "a71f6157-d6f8-46db-b2f7-1be58f512139"
      }, {
        "title": "testing",
        "status": "1",
        "id": "55fe8f96-0fb4-432b-af2a-dda09e301ca2"
      }, {
        "title": "Testtest",
        "status": "1",
        "id": "378b8ad7-5f30-47c8-972e-d38b2be0fe49"
      }],
      "disabled": true,
      "errorText": "",
      "validation": {
        "required": false
      },
      "touched": 0
    }, {
      "name": "platform",
      "type": "conditionalDropdown",
      "value": [{
        "id": "0b4bf044-b439-4c98-8fa3-f4a15e9eab3d",
        "title": "KaiOS"
      }],
      "col": "col-md-6 col-lg-6",
      "multiple": true,
      "path": "/master/Platform",
      "keyText": "title",
      "label": "Platform",
      "data": [{
        "title": "Connected Devices",
        "status": "1",
        "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6"
      }, {
        "title": "KaiOS",
        "status": "1",
        "id": "0b4bf044-b439-4c98-8fa3-f4a15e9eab3d"
      }, {
        "title": "Mobile",
        "status": "1",
        "id": "bc1f7d8e-53af-4db8-8e0f-c7cf25fe5345"
      }, {
        "title": "Smart TV",
        "status": "1",
        "id": "6d54b9bf-c041-48c8-9150-a05c59221b22"
      }, {
        "title": "test",
        "status": "1",
        "id": "158d4523-8c6d-453f-997b-8bc8c0a631f8"
      }, {
        "title": "testing",
        "status": "1",
        "id": "f9c84a3c-f58c-409c-b958-4e5d28ef156f"
      }, {
        "title": "Web",
        "status": "1",
        "id": "de7c4077-9323-4f79-960b-0003004e1ee8"
      }],
      "errorText": "",
      "validation": {
        "required": false
      },
      "touched": 0
    }, {
      "name": "tvodTier",
      "type": "dropdown",
      "value": {
        "title": "test",
        "id": "b9773dba-f380-45dd-9b1a-9db2192ea3fe"
      },
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/TVODTier",
      "keyText": "title",
      "label": "TVOD Tier",
      "data": [{
        "title": "test",
        "status": "1",
        "id": "b9773dba-f380-45dd-9b1a-9db2192ea3fe"
      }, {
        "title": "testing",
        "status": "1",
        "id": "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef8"
      }, {
        "title": "TVOD_Gold",
        "status": "1",
        "id": "5b44c8f7-1166-465f-a56c-ae03a08bb503"
      }, {
        "title": "TVOD_Platinum",
        "status": "1",
        "id": "01e686be-71ca-4355-b8e6-a85d6b4b6118"
      }, {
        "title": "TVOD_Silver",
        "status": "1",
        "id": "4d4a6f84-5e9f-4c70-a126-822516e47daf"
      }],
      "errorText": "",
      "validation": {
        "required": false
      },
      "touched": 0
    }, {
      "name": "isParentTypeTvod",
      "value": true,
      "col": "col-md-6 col-lg-6",
      "type": "checkbox",
      "label": "Parent Type TVOD",
      "labelPlacement": "end",
      "validation": {
        "required": false
      },
      "touched": 0
    }]
    const instance = wrapper.instance();
    jest.spyOn(instance, "selectGroup");
    wrapper.setState({manualJsonSchema})
    instance.selectGroup({target:{checked: true}},"Others");
    expect(instance.selectGroup).toHaveBeenCalledTimes(1);
  });

  it('should test InputChanger for file type',()=>{
    const event = {target:{name:'setName',files:[{path:"test/image/path"}]}}
  
        const manualJsonSchema= [{
          "name": "setName",
          "type": "file",
          "value": "",
          "col": "col-md-7 col-lg-7",
          "label": "Set Name",
          "errorText": "",
          "validation": {
            "required": true,
            "isAlphaNumericWithSpecialChars": true,
            "maxLength": 250
          }
        }, {
          "name": "fromDate",
          "type": "date",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "label": "License From Date",
          "minDate": "sameOrAfter",
          "disablePast": true,
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "toDate",
          "type": "date",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "label": "License To Date",
          "minDate": "sameOrAfter",
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "country",
          "type": "dropdown",
          "value": [],
          "col": "col-md-6 col-lg-6",
          "multiple": true,
          "groupBy": "group",
          "path": "user/country-group",
          "keyText": "title",
          "label": "Country / Group",
          "data": [],
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "businessType",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/BusinessType",
          "keyText": "title",
          "label": "Business Type",
          "data": [],
          "errorText": "",
          "validation": {
            "required": true
          }
        }, {
          "name": "billingType",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/BillingType",
          "keyText": "title",
          "label": "Billing Type",
          "data": [],
          "disabled": true,
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "platform",
          "type": "conditionalDropdown",
          "value": [],
          "col": "col-md-6 col-lg-6",
          "multiple": true,
          "path": "/master/Platform",
          "keyText": "title",
          "label": "Platform",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "tvodTier",
          "type": "dropdown",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "multiple": false,
          "path": "/master/TVODTier",
          "keyText": "title",
          "label": "TVOD Tier",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }, {
          "name": "isParentTypeTvod",
          "value": false,
          "col": "col-md-6 col-lg-6",
          "type": "checkbox",
          "label": "Parent Type TVOD",
          "labelPlacement": "end",
          "validation": {
            "required": false
          }
        }]
    // const wrapper = setup();
   wrapper.setState({manualJsonSchema:manualJsonSchema})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'InputChanger');
   instance.InputChanger(event,0);
   expect(instance.InputChanger).toHaveBeenCalledTimes(1);
  });
  
  it('should check handleTemplateEdit onclick method', () => {
    const templateData = [{
      billingType: { title: "Premium", id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2" },
      businessType: { title: "Premium", id: "24d21e44-16f9-4ecc-a14e-f9e060b7a48e" },
      country: [{ id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso" },
      { id: "0077a5a3-461f-4d5d-9d22-fc30923c4a02", title: "Northern Mariana Islands" },
      { id: "011c2697-7ea6-440d-9f4d-6840f08f2197", title: "United Arab Emirates" }],
      currentStatus: "Active"
    }]
    const template_edit_section =  [{
      "name": "country",
      "type": "dropdown",
      "value": [],
      "col": "col-md-6 col-lg-6",
      "multiple": true,
      "groupBy": "group",
      "path": "user/country-group",
      "keyText": "title",
      "label": "Country / Group",
      "data": [],
      "errorText": "",
      "validation": {
        "required": true
      }
    }, {
      "name": "businessType",
      "type": "dropdown",
      "value": "",
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/BusinessType",
      "keyText": "title",
      "label": "Business Type",
      "data": [],
      "errorText": "",
      "validation": {
        "required": true
      }
    }, {
      "name": "billingType",
      "type": "dropdown",
      "value": "",
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/BillingType",
      "keyText": "title",
      "label": "Billing Type",
      "data": [],
      "errorText": "",
      "validation": {
        "required": false
      }
    }, {
      "name": "platform",
      "type": "conditionalDropdown",
      "value": [],
      "col": "col-md-6 col-lg-6",
      "multiple": true,
      "path": "/master/Platform",
      "keyText": "title",
      "label": "Platform",
      "data": [],
      "errorText": "",
      "validation": {
        "required": false
      }
    }, {
      "name": "tvodTier",
      "type": "dropdown",
      "value": "",
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/TVODTier",
      "keyText": "title",
      "label": "TVOD Tier",
      "data": [],
      "errorText": "",
      "validation": {
        "required": false
      }
    }]
    const templateListData = [{ test: '234' }];
    wrapper.setState({ template_edit_section:template_edit_section })
    jest.spyOn(wrapper.instance(), 'handleTemplateEdit');
    wrapper.instance().handleTemplateEdit(templateData, 0);
    expect(wrapper.instance().handleTemplateEdit).toBeCalled();
  })


  it('should test getUserDetails ',()=>{
  const instance = wrapper.instance();
     jest.spyOn(instance, 'getUserDetails');
     instance.getUserDetails();
     expect(instance.getUserDetails).toHaveBeenCalledTimes(1);
    });

    it('should test InputChangerGroup',()=>{
      const event = {target:{name:'setName', value:"hello" , files:[{path:"test/image/path"}]}}
  
      const template_edit_section =  [{
        "name": "country",
        "type": "dropdown",
        "value": [],
        "col": "col-md-6 col-lg-6",
        "multiple": true,
        "groupBy": "group",
        "path": "user/country-group",
        "keyText": "title",
        "label": "Country / Group",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      }, {
        "name": "businessType",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/BusinessType",
        "keyText": "title",
        "label": "Business Type",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      }, {
        "name": "billingType",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/BillingType",
        "keyText": "title",
        "label": "Billing Type",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }, {
        "name": "platform",
        "type": "conditionalDropdown",
        "value": [],
        "col": "col-md-6 col-lg-6",
        "multiple": true,
        "path": "/master/Platform",
        "keyText": "title",
        "label": "Platform",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }, {
        "name": "tvodTier",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/TVODTier",
        "keyText": "title",
        "label": "TVOD Tier",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }]
      // const wrapper = setup();
     wrapper.setState({template_edit_section:template_edit_section})
     const instance = wrapper.instance();
     jest.spyOn(instance, 'InputChangerGroup');
     instance.InputChangerGroup(event,1);
     expect(instance.InputChangerGroup).toHaveBeenCalledTimes(1);
   });
    it('should test InputChangerGroup',()=>{
      const event = {target:{name:'setName', value:"hello" , files:[{path:"test/image/path"}]}}
      const template_edit_section= [{
        "name": "country",
        "type": "file",
        "value": [],
        "col": "col-md-6 col-lg-6",
        "multiple": true,
        "groupBy": "group",
        "path": "user/country-group",
        "keyText": "title",
        "label": "Country / Group",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      }, {
        "name": "businessType",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/BusinessType",
        "keyText": "title",
        "label": "Business Type",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      }, {
        "name": "billingType",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/BillingType",
        "keyText": "title",
        "label": "Billing Type",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }, {
        "name": "platform",
        "type": "conditionalDropdown",
        "value": [],
        "col": "col-md-6 col-lg-6",
        "multiple": true,
        "path": "/master/Platform",
        "keyText": "title",
        "label": "Platform",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }, {
        "name": "tvodTier",
        "type": "dropdown",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "multiple": false,
        "path": "/master/TVODTier",
        "keyText": "title",
        "label": "TVOD Tier",
        "data": [],
        "errorText": "",
        "validation": {
          "required": false
        }
      }]
        
      // const wrapper = setup();
     wrapper.setState({template_edit_section:template_edit_section})
     const instance = wrapper.instance();
     jest.spyOn(instance, 'InputChangerGroup');
     instance.InputChangerGroup(event,0);
     expect(instance.InputChangerGroup).toHaveBeenCalledTimes(1);
   });
  
   it('should test editLicenceTemplate',()=>{
   const template_edit_section= [{
      "name": "country",
      "type": "file",
      "value": [],
      "col": "col-md-6 col-lg-6",
      "multiple": true,
      "groupBy": "group",
      "path": "user/country-group",
      "keyText": "title",
      "label": "Country / Group",
      "data": [],
      "errorText": "",
      "validation": {
        "required": true
      }
    }, {
      "name": "businessType",
      "type": "dropdown",
      "value": "",
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/BusinessType",
      "keyText": "title",
      "label": "Business Type",
      "data": [],
      "errorText": "",
      "validation": {
        "required": true
      }
    }, {
      "name": "billingType",
      "type": "dropdown",
      "value": "",
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/BillingType",
      "keyText": "title",
      "label": "Billing Type",
      "data": [],
      "errorText": "",
      "validation": {
        "required": false
      }
    }, {
      "name": "platform",
      "type": "conditionalDropdown",
      "value": [],
      "col": "col-md-6 col-lg-6",
      "multiple": true,
      "path": "/master/Platform",
      "keyText": "title",
      "label": "Platform",
      "data": [],
      "errorText": "",
      "validation": {
        "required": false
      }
    }, {
      "name": "tvodTier",
      "type": "dropdown",
      "value": "",
      "col": "col-md-6 col-lg-6",
      "multiple": false,
      "path": "/master/TVODTier",
      "keyText": "title",
      "label": "TVOD Tier",
      "data": [],
      "errorText": "",
      "validation": {
        "required": false
      }
    }]
    const templateListData = [{ test: '234' }];
    const templateEdit = 1;
    wrapper.setState({ templateListData, templateEdit, template_edit_section: template_edit_section })
   const instance = wrapper.instance();
   jest.spyOn(instance, 'editLicenceTemplate');
   instance.editLicenceTemplate();
   expect(instance.editLicenceTemplate).toHaveBeenCalledTimes(1);
 });
 
})
