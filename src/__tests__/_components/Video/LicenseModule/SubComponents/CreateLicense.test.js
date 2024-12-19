import React from "react";
import { shallow } from "enzyme";

import { storeFactory } from "../../../../../Utils";
import CreateLicense from "../../../../../_components/Video/LicenseModule/subComponent/CreateLicense";
import jsonData from "../../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json";

const setup = (initialstate = {}, props = {}) => {
  const store = storeFactory(initialstate);
  const wrapper = shallow(
    <CreateLicense store={store} {...props} />
  ).dive();
  return wrapper;
};
const initialState = {
  videoMgmt_reducer: {},
};

const LicenseJSONSchema= [{
  "manual_section": [{
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
  }],
  "template_edit_section": [{
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
  }],
  "template_section": [{
    "name": "setName",
    "type": "text",
    "value": "",
    "col": "col-md-6 col-lg-6",
    "label": "Set Name",
    "errorText": "",
    "validation": {
      "required": true,
      "isAlphaNumericWithSpecialChars": true,
      "maxLength": 250
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
    "disablePast": true,
    "errorText": "",
    "validation": {
      "required": true
    }
  }],
  "search_filter_section": [{
    "name": "fromDate",
    "type": "date",
    "value": "",
    "col": "col-md-12 col-lg-12",
    "label": "License From Date",
    "errorText": "",
    "validation": {
      "required": false
    }
  }, {
    "name": "toDate",
    "type": "date",
    "value": "",
    "col": "col-md-12 col-lg-12",
    "label": "License To Date",
    "errorText": "",
    "validation": {
      "required": false
    }
  }, {
    "name": "businessType",
    "type": "dropdown",
    "value": null,
    "col": "col-md-12 col-lg-12",
    "multiple": false,
    "path": "/master/BusinessType",
    "label": "Business Type",
    "keyText": "title",
    "data": [],
    "errorText": "",
    "validation": {
      "required": false
    }
  }, {
    "name": "billingType",
    "type": "dropdown",
    "value": null,
    "col": "col-md-12 col-lg-12",
    "multiple": false,
    "path": "/master/BillingType",
    "label": "Billing Type",
    "keyText": "title",
    "data": [],
    "errorText": "",
    "validation": {
      "required": false
    }
  }, {
    "name": "platform",
    "type": "dropdown",
    "value": null,
    "col": "col-md-12 col-lg-12",
    "multiple": true,
    "path": "/master/Platform",
    "label": "Platform",
    "keyText": "title",
    "data": [],
    "errorText": "",
    "validation": {
      "required": false
    }
  }, {
    "display": true,
    "col": "",
    "name": "status",
    "label": "Status",
    "areaLabel": "status",
    "labelPlacement": "end",
    "value": null,
    "type": "radio",
    "data": [{
      "label": "Active",
      "value": "1"
    }, {
      "label": "Inactive",
      "value": "0"
    }],
    "validation": {}
  }],
  "commonmodel_section": [{
    "name": "reason",
    "type": "dropdown",
    "value": [],
    "col": "col-md-12 col-lg-12",
    "path": "/master/ReasonType",
    "keyText": "title",
    "multiple": false,
    "label": "Reason",
    "data": [],
    "errorText": "",
    "validation": {
      "required": true
    }
  }]
}]

describe('LicenseModule', () => {
  let wrapper;
  const baseProps = {
    jsonData: jsonData.License,
    markAsDone: jest.fn(),
    openLicenseForm: jest.fn()
  }
  beforeEach(() => {
    const wrapperInstance = setup(initialState, { ...baseProps });
    wrapper = wrapperInstance.dive();
    wrapper.setState({template_edit_section: jsonData?.template_edit_section})
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })



  it('render component for getMergeArrayOfObject', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getMergeArrayOfObject');
    instance.getMergeArrayOfObject();
    expect(instance.getMergeArrayOfObject).toHaveBeenCalled();
  })

  it('should check componentDidMount method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalled();
  })

  it("should check componentWillReceiveProps method", () => {
    const mockSet = {
      audioLanguages: [],
      billingTypeRecords: [],
      businessTypeRecords: [],
      castTypeRecords: [],
      countryGroupRecords: [],
      dashSuffixRecords: [],
      hlsSuffixRecords: [],
      masterRecords: {},
      platformRecords: [],
      relationRecords: [],
      tagBadgeRecords: [],
      tvodTierRecords: []
    }
    wrapper.setState({...mockSet})
    jest.spyOn(wrapper.instance(), "componentWillReceiveProps");
    wrapper.instance().componentWillReceiveProps();
    expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
  })

 
  it('should check componentWillReceiveProps method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentWillReceiveProps');
    instance.componentWillReceiveProps();
    expect(instance.componentWillReceiveProps).toHaveBeenCalled();
  })


  it('should check getMovieDetails method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getMovieDetails');
    instance.getMovieDetails();
    expect(instance.getMovieDetails).toHaveBeenCalled();
  })

  it('should check checkDateValidationForSubmitTemplate method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkDateValidationForSubmitTemplate');
    instance.checkDateValidationForSubmitTemplate();
    expect(instance.checkDateValidationForSubmitTemplate).toHaveBeenCalled();
  })

  it('should check fillEditDetails method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillEditDetails');
    instance.fillEditDetails();
    expect(instance.fillEditDetails).toHaveBeenCalled();
  })

  it('should check fillEditDetailsTemplate method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillEditDetailsTemplate');
    instance.fillEditDetailsTemplate();
    expect(instance.fillEditDetailsTemplate).toHaveBeenCalled();
  })

  it("should check handleTemplate method", () => {
    const event = {target:{name:'mapCollectionId',files:[{path:"hello user"}]}}
    const mockSet = {
      templateData : [{
        billingType: {title: "Premium", id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2"},
        businessType: {title: "Premium", id: "24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},
        country : [{id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso"}],
        currentStatus: "Active",
        invalidCountry:[{id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso"}],
        licenseDate: undefined,
        templateId: undefined,
        platform:[{id: "f9c84a3c-f58c-409c-b958-4e5d28ef156f", title: "Mobile"}],
        tvodTier: {title: "TVOD_Platinum", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118"}
      }]
    }
    const value = {DisplayName: "Template2", CurrentStatus: "1", uuid: "ac207c46-2879-44e9-a384-c0ed6aac57b0", template: Array(2)}
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleTemplate");
    wrapper.instance().handleTemplate(event, null,null,value);
    expect(wrapper.instance().handleTemplate).toBeCalled();
  })

  it('should check checkOnlyExistCountry', () => {
    const templateList ={"billingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"businessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"country":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platform":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"tvodTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"currentStatus":"Active","invalidCountry":[],"licenseDate":[{"name":"setName","type":"text","value":"","col":"col-md-6 col-lg-6","label":"Set Name","errorText":"","validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250}},{"name":"isParentTypeTvod","value":false,"col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"errorText":""},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}}]}
    const mockSet = {"language":"EN","contentId":"205b7288-002d-4afd-87d8-895be6031e03","editTab":0,"manualJsonSchema":[{"name":"setName","type":"text","value":"","col":"col-md-7 col-lg-7","label":"Set Name","errorText":"","validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250},"touched":0},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true},"touched":0},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","errorText":"","validation":{"required":true},"touched":0},{"name":"country","type":"dropdown","value":[],"col":"col-md-6 col-lg-6","multiple":true,"groupBy":"group","path":"user/country-group","keyText":"title","label":"Country / Group","data":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola","code":"AO","status":"1","group":"AFRICA_MA"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon","code":"CM","status":"1","group":"AFRICA_MA"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic","code":"CF","status":"1","group":"AFRICA_MA"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad","code":"TD","status":"1","group":"AFRICA_MA"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo","code":"CG","status":"1","group":"AFRICA_MA"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)","code":"CD","status":"1","group":"AFRICA_MA"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon","code":"GA","status":"1","group":"AFRICA_MA"},{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana","code":"BW","status":"1","group":"AFRICA_SA"},{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia","code":"NA","status":"1","group":"AFRICA_SA"},{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa","code":"ZA","status":"1","group":"AFRICA_SA"},{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland","code":"SZ","status":"1","group":"AFRICA_SA"}],"errorText":"","validation":{"required":true},"touched":0},{"name":"businessType","type":"dropdown","value":null,"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BusinessType","keyText":"title","label":"Business Type","data":[{"title":"Advertisement","status":"1","id":"6fbedee2-921b-4abf-9143-7d006f5a1450"},{"title":"advertisement_authenticated","status":"1","id":"1d39250f-48a7-40e3-adaa-bf976cc332bb"},{"title":"advertisement_authenticated_downloadable","status":"1","id":"9700e1fe-d36a-408b-95dd-a3e95baa9cf8"},{"title":"advertisement_downloadable","status":"1","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},{"title":"free_authenticated","status":"1","id":"16066125-0356-4b8b-9633-b1032b0ffeff"},{"title":"free_authenticated_downloadable","status":"1","id":"0ce15743-1e88-4f49-8e1f-f7559f4d389c"},{"title":"free_downloadable","status":"1","id":"80a13565-f2a5-4036-bb4e-251d7cb030a9"},{"title":"Premium","status":"1","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},{"title":"premium_downloadable","status":"1","id":"d6b5d8f5-2322-4d7c-acd5-7e1bea010132"},{"title":"test","status":"1","id":"14739970-e00f-4c7b-a788-daa1ce8cb386"},{"title":"testing","status":"1","id":"a74e6da7-7567-41f2-9c71-4c0c34703d10"},{"title":"tvod","status":"1","id":"317fbc1f-24fa-4ce4-97be-0857cd3948b3"},{"title":"tvod_downloadable","status":"1","id":"1911d195-02d2-412d-9b3c-cc9f241d4f43"}],"errorText":"","validation":{"required":true},"touched":0},{"name":"billingType","type":"dropdown","value":{},"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BillingType","keyText":"title","label":"Billing Type","data":[{"title":"Club","status":"1","id":"8dc545d9-470e-4fb8-b32f-bdee3368c952"},{"title":"Premium","status":"1","id":"858f7d02-3388-49ef-ba1c-4a594df616f8"},{"title":"test","status":"1","id":"a71f6157-d6f8-46db-b2f7-1be58f512139"},{"title":"testing","status":"1","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},{"title":"Testtest","status":"1","id":"378b8ad7-5f30-47c8-972e-d38b2be0fe49"}],"disabled":true,"errorText":"","validation":{"required":false},"touched":0},{"name":"platform","type":"conditionalDropdown","value":[],"col":"col-md-6 col-lg-6","multiple":true,"path":"/master/Platform","keyText":"title","label":"Platform","data":[{"title":"Connected Devices","status":"1","id":"5b72cd93-5445-4d84-b69b-50d04b432fb6"},{"title":"KaiOS","status":"1","id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d"},{"title":"Mobile","status":"1","id":"bc1f7d8e-53af-4db8-8e0f-c7cf25fe5345"},{"title":"Smart TV","status":"1","id":"6d54b9bf-c041-48c8-9150-a05c59221b22"},{"title":"test","status":"1","id":"158d4523-8c6d-453f-997b-8bc8c0a631f8"},{"title":"testing","status":"1","id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f"},{"title":"Web","status":"1","id":"de7c4077-9323-4f79-960b-0003004e1ee8"}],"errorText":"","validation":{"required":false},"touched":0},{"name":"tvodTier","type":"dropdown","value":{},"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/TVODTier","keyText":"title","label":"TVOD Tier","data":[{"title":"test","status":"1","id":"b9773dba-f380-45dd-9b1a-9db2192ea3fe"},{"title":"testing","status":"1","id":"3ac2b4c9-9708-4864-b9ae-1a191cdd9ef8"},{"title":"TVOD_Gold","status":"1","id":"5b44c8f7-1166-465f-a56c-ae03a08bb503"},{"title":"TVOD_Platinum","status":"1","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},{"title":"TVOD_Silver","status":"1","id":"4d4a6f84-5e9f-4c70-a126-822516e47daf"}],"errorText":"","validation":{"required":false},"touched":0},{"name":"isParentTypeTvod","col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"touched":0}],"JSONSchema":[],"templateEdit":0,"formData":{"fromDate":"","toDate":"","reason":"","currentStatus":"","country":"","businessType":"","billingType":{},"tvodTier":{},"platform":[],"id":""},"displayName":"","errorMessageForDate":"","stage":{"title":"Draft"},"currentStatus":"","errorMsg":"","template":{"DisplayName":"Template2","CurrentStatus":"1","uuid":"ac207c46-2879-44e9-a384-c0ed6aac57b0","template":[{"id":"5be25f9a-2c58-4b86-a5be-378de4a9091b","status":"1","countryId":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platformId":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"createdOn":"2021-03-30T10:58:48.322Z","modifiedOn":"2021-04-14T05:30:46.654Z","BillingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"BusinessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"TVODTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"}},{"id":"35881c9e-7c7a-4b28-ab1e-bb25ca0a1856","status":"1","countryId":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"},{"id":"d3f975c3-7e80-4aa4-b8a0-fc35ba937c10","title":"Equatorial Guinea"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"},{"id":"166e4525-7c01-46d6-9f33-f07eec1ef2d3","title":"Sao Tome and Principe"}],"platformId":[{"id":"6d54b9bf-c041-48c8-9150-a05c59221b22","title":"Smart TV"}],"createdOn":"2021-04-14T05:30:46.654Z","modifiedOn":"2021-04-14T05:30:46.654Z","BillingType":null,"BusinessType":{"title":"advertisement_authenticated","id":"1d39250f-48a7-40e3-adaa-bf976cc332bb"},"TVODTier":{"title":"TVOD_Silver","id":"4d4a6f84-5e9f-4c70-a126-822516e47daf"}}]},"licenceStatus":"2","countriesList":[],"businessTypeList":[],"billingTypeList":[],"tvodTierList":[],"platformsList":[],"templateList":[{"DisplayName":"Template2","CurrentStatus":"1","uuid":"ac207c46-2879-44e9-a384-c0ed6aac57b0","template":[{"id":"5be25f9a-2c58-4b86-a5be-378de4a9091b","status":"1","countryId":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platformId":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"createdOn":"2021-03-30T10:58:48.322Z","modifiedOn":"2021-04-14T05:30:46.654Z","BillingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"BusinessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"TVODTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"}},{"id":"35881c9e-7c7a-4b28-ab1e-bb25ca0a1856","status":"1","countryId":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"},{"id":"d3f975c3-7e80-4aa4-b8a0-fc35ba937c10","title":"Equatorial Guinea"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"},{"id":"166e4525-7c01-46d6-9f33-f07eec1ef2d3","title":"Sao Tome and Principe"}],"platformId":[{"id":"6d54b9bf-c041-48c8-9150-a05c59221b22","title":"Smart TV"}],"createdOn":"2021-04-14T05:30:46.654Z","modifiedOn":"2021-04-14T05:30:46.654Z","BillingType":null,"BusinessType":{"title":"advertisement_authenticated","id":"1d39250f-48a7-40e3-adaa-bf976cc332bb"},"TVODTier":{"title":"TVOD_Silver","id":"4d4a6f84-5e9f-4c70-a126-822516e47daf"}}]},{"DisplayName":"template1","CurrentStatus":"1","uuid":"e130d52b-a6c1-4502-81f7-c0ee31773b33","template":[{"id":"5be25f9a-2c58-4b86-a5be-378de4a9091a","status":"1","countryId":[{"id":"0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71","title":"Burkina Faso"},{"id":"0077a5a3-461f-4d5d-9d22-fc30923c4a02","title":"Northern Mariana Islands"},{"id":"011c2697-7ea6-440d-9f4d-6840f08f2197","title":"United Arab Emirates"}],"platformId":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"createdOn":"2021-03-30T10:58:48.322Z","modifiedOn":"2021-03-30T10:58:48.322Z","BillingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"BusinessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"TVODTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"}}]}],"licenseList":[],"license_uuid":"","showStatePopup":false,"error":false,"isDisabled":false,"templateListData":[{"billingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"businessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"country":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platform":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"tvodTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"currentStatus":"Active","invalidCountry":[],"licenseDate":[{"name":"setName","type":"text","value":"","col":"col-md-6 col-lg-6","label":"Set Name","errorText":"","validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250}},{"name":"isParentTypeTvod","value":false,"col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"errorText":""},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}}]},{"billingType":{},"businessType":{"title":"advertisement_authenticated","id":"1d39250f-48a7-40e3-adaa-bf976cc332bb"},"country":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"},{"id":"d3f975c3-7e80-4aa4-b8a0-fc35ba937c10","title":"Equatorial Guinea"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"},{"id":"166e4525-7c01-46d6-9f33-f07eec1ef2d3","title":"Sao Tome and Principe"}],"platform":[{"id":"6d54b9bf-c041-48c8-9150-a05c59221b22","title":"Smart TV"}],"tvodTier":{"title":"TVOD_Silver","id":"4d4a6f84-5e9f-4c70-a126-822516e47daf"},"currentStatus":"Active","invalidCountry":[{"id":"d3f975c3-7e80-4aa4-b8a0-fc35ba937c10","title":"Equatorial Guinea"},{"id":"166e4525-7c01-46d6-9f33-f07eec1ef2d3","title":"Sao Tome and Principe"}],"licenseDate":[{"name":"setName","type":"text","value":"","col":"col-md-6 col-lg-6","label":"Set Name","errorText":"","validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250}},{"name":"isParentTypeTvod","value":false,"col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"errorText":""},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}}]}],"isLocked":false,"template_data":"","dateCreated":"","template_static_edit":"","template_index":null,"userDetails":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola","code":"AO"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon","code":"CM"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic","code":"CF"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad","code":"TD"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo","code":"CG"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)","code":"CD"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon","code":"GA"},{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana","code":"BW"},{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia","code":"NA"},{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa","code":"ZA"},{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland","code":"SZ"}],"assignedCountry":[],"invalidCountryMsg":false,"disableSubmitButton":true,"disableTemplateButton":true,"licenseCount":1,"template_edit_section":[{"name":"country","type":"dropdown","value":[],"col":"col-md-6 col-lg-6","multiple":true,"groupBy":"group","path":"user/country-group","keyText":"title","label":"Country / Group","data":[],"errorText":"","validation":{"required":true}},{"name":"businessType","type":"dropdown","value":"","col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BusinessType","keyText":"title","label":"Business Type","data":[],"errorText":"","validation":{"required":true}},{"name":"billingType","type":"dropdown","value":"","col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BillingType","keyText":"title","label":"Billing Type","data":[],"errorText":"","validation":{"required":false}},{"name":"platform","type":"conditionalDropdown","value":[],"col":"col-md-6 col-lg-6","multiple":true,"path":"/master/Platform","keyText":"title","label":"Platform","data":[],"errorText":"","validation":{"required":false}},{"name":"tvodTier","type":"dropdown","value":"","col":"col-md-6 col-lg-6","multiple":false,"path":"/master/TVODTier","keyText":"title","label":"TVOD Tier","data":[],"errorText":"","validation":{"required":false}}],"status":"Draft"}
   
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "checkOnlyExistCountry");
    wrapper.instance().checkOnlyExistCountry(templateList);
    expect(wrapper.instance().checkOnlyExistCountry).toBeCalled(); 
  })

  it("should check handleValidateError method", () => {
    const templateList ={"billingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"businessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"country":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platform":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"tvodTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"currentStatus":"Active","invalidCountry":[],"licenseDate":[{"name":"setName","type":"text","value":"","col":"col-md-6 col-lg-6","label":"Set Name","errorText":"","validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250}},{"name":"isParentTypeTvod","value":false,"col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"errorText":""},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","disablePast":true,"errorText":"","validation":{"required":true}}]}
  
    jest.spyOn(wrapper.instance(), "handleValidateError");
    wrapper.instance().handleValidateError(templateList);
    expect(wrapper.instance().handleValidateError).toBeCalled();
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
    const event = { target: { value: '' } }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleLicenceChange');
    instance.handleLicenceChange(event);
    expect(instance.handleLicenceChange).toHaveBeenCalled();
  })
  it('should check handleStatePopup method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleStatePopup');
    instance.handleStatePopup();
    expect(instance.handleStatePopup).toHaveBeenCalled();
  })
  it('should check showHideStatePopup method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideStatePopup');
    instance.showHideStatePopup();
    expect(instance.showHideStatePopup).toHaveBeenCalled();
  })


  it('should check updateTemplateLicence method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateTemplateLicence');
    instance.updateTemplateLicence();
    expect(instance.updateTemplateLicence).toHaveBeenCalled();
  })

  it("should check handleCountryDisableData method", () => {
    jest.spyOn(wrapper.instance(), "handleCountryDisableData");
    wrapper.instance().handleCountryDisableData();
    expect(wrapper.instance().handleCountryDisableData).toBeCalled();
  })
  it('should check fillEditDetailsTemplate', () => {
    const response = {
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }
    jest.spyOn(wrapper.instance(), "fillEditDetailsTemplate");
    wrapper.instance().fillEditDetailsTemplate(response, 0);
    expect(wrapper.instance().fillEditDetailsTemplate).toBeCalled();
  })
  it('should check fillEditDetails', () => {
    const response = {
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }
    jest.spyOn(wrapper.instance(), "fillEditDetails");
    wrapper.instance().fillEditDetails(response);
    expect(wrapper.instance().fillEditDetails).toBeCalled();
  })

  it('should check submitTemplateLicence', () => {
    const response = [{
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }]
    jest.spyOn(wrapper.instance(), "submitTemplateLicence");
    wrapper.instance().submitTemplateLicence(response);
    expect(wrapper.instance().submitTemplateLicence).toBeCalled();
  })


  it('should check submitLicence', () => {
    const response = [{
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }]
    jest.spyOn(wrapper.instance(), "submitLicence");
    wrapper.instance().submitLicence(response);
    expect(wrapper.instance().submitLicence).toBeCalled();
  })

  it('should check generateObject', () => {
    const response = [{
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }]
    jest.spyOn(wrapper.instance(), "generateObject");
    wrapper.instance().generateObject(response);
    expect(wrapper.instance().generateObject).toBeCalled();
  })
  it('should check checkValidationForUSerCountry', () => {
    const response = [{
      billingType: { "title": null, "id": null },
      businessType: { "title": "Advertisement", "id": "6fbedee2-921b-4abf-9143-7d006f5a1450" },
      country: [[{ "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d", "title": "India" }]],
      platform: [[{ "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6", "title": "Connected Devices" }]],
      id: "867a54e3-22dc-4a83-8c2d-8e6106eb00e7", currentStatus: "1"
    }]
    jest.spyOn(wrapper.instance(), "checkValidationForUSerCountry");
    wrapper.instance().checkValidationForUSerCountry(response);
    expect(wrapper.instance().checkValidationForUSerCountry).toBeCalled();
  })











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
   wrapper.setState({template_edit_section:LicenseJSONSchema[0].template_edit_section})
    instance.setSelectDataArrTemplate(res,0);
    expect(instance.setSelectDataArrTemplate).toHaveBeenCalledTimes(1);
  });
  



  it("should test setSelectDataArr", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectDataArr");
    const manualJsonSchema = [{
      col: "col-md-6 col-lg-6",
      data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
      errorText: "",
      keyText: "displayTitle",
      label: "Collection or External id",
      multiple: true,
      name: "country",
      touched: 1,
      type: "SearchableWithCreate",
      valid: true,
      validation: {required: true},
      value: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
      withoutCreate: true},
      {
       col: "col-md-6 col-lg-6",
       data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
       errorText: "",
       keyText: "displayTitle",
       label: "Collection or External id",
       multiple: true,
       name: "mapCollectionId",
       touched: 1,
       type: "file",
       valid: true,
       validation: {required: true},
       value: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
       withoutCreate: true},
       {
         col: "col-md-6 col-lg-6",
         data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
         errorText: "",
         keyText: "displayTitle",
         label: "Collection or External id",
         multiple: true,
         name: "mapCollectionId",
         touched: 1,
         type: "checkbox",
         valid: true,
         validation: {required: true},
         value: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
         withoutCreate: true}]
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
   wrapper.setState({manualJsonSchema:manualJsonSchema})
    instance.setSelectDataArr(res,1);
    expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
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
it("should test selectGroupForTemplate", () => {
  const template_edit_section = [{"name":"country","type":"dropdown","value":[],"col":"col-md-6 col-lg-6","multiple":true,"groupBy":"group","path":"user/country-group","keyText":"title","label":"Country / Group","data":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola","code":"AO","status":"1","group":"AFRICA_MA"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon","code":"CM","status":"1","group":"AFRICA_MA"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic","code":"CF","status":"1","group":"AFRICA_MA"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad","code":"TD","status":"1","group":"AFRICA_MA"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo","code":"CG","status":"1","group":"AFRICA_MA"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)","code":"CD","status":"1","group":"AFRICA_MA"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon","code":"GA","status":"1","group":"AFRICA_MA"},{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana","code":"BW","status":"1","group":"AFRICA_SA"},{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia","code":"NA","status":"1","group":"AFRICA_SA"},{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa","code":"ZA","status":"1","group":"AFRICA_SA"},{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland","code":"SZ","status":"1","group":"AFRICA_SA"}],"errorText":"","validation":{"required":true},"touched":1},{"name":"businessType","type":"dropdown","value":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BusinessType","keyText":"title","label":"Business Type","data":[{"title":"Advertisement","status":"1","id":"6fbedee2-921b-4abf-9143-7d006f5a1450"},{"title":"advertisement_authenticated","status":"1","id":"1d39250f-48a7-40e3-adaa-bf976cc332bb"},{"title":"advertisement_authenticated_downloadable","status":"1","id":"9700e1fe-d36a-408b-95dd-a3e95baa9cf8"},{"title":"advertisement_downloadable","status":"1","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},{"title":"free_authenticated","status":"1","id":"16066125-0356-4b8b-9633-b1032b0ffeff"},{"title":"free_authenticated_downloadable","status":"1","id":"0ce15743-1e88-4f49-8e1f-f7559f4d389c"},{"title":"free_downloadable","status":"1","id":"80a13565-f2a5-4036-bb4e-251d7cb030a9"},{"title":"Premium","status":"1","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},{"title":"premium_downloadable","status":"1","id":"d6b5d8f5-2322-4d7c-acd5-7e1bea010132"},{"title":"test","status":"1","id":"14739970-e00f-4c7b-a788-daa1ce8cb386"},{"title":"testing","status":"1","id":"a74e6da7-7567-41f2-9c71-4c0c34703d10"},{"title":"tvod","status":"1","id":"317fbc1f-24fa-4ce4-97be-0857cd3948b3"},{"title":"tvod_downloadable","status":"1","id":"1911d195-02d2-412d-9b3c-cc9f241d4f43"}],"errorText":"","validation":{"required":true},"touched":0},{"name":"billingType","type":"dropdown","value":null,"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BillingType","keyText":"title","label":"Billing Type","data":[{"title":"Club","status":"1","id":"8dc545d9-470e-4fb8-b32f-bdee3368c952"},{"title":"Premium","status":"1","id":"858f7d02-3388-49ef-ba1c-4a594df616f8"},{"title":"test","status":"1","id":"a71f6157-d6f8-46db-b2f7-1be58f512139"},{"title":"testing","status":"1","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},{"title":"Testtest","status":"1","id":"378b8ad7-5f30-47c8-972e-d38b2be0fe49"}],"errorText":"","validation":{"required":false},"touched":1},{"name":"platform","type":"conditionalDropdown","value":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"col":"col-md-6 col-lg-6","multiple":true,"path":"/master/Platform","keyText":"title","label":"Platform","data":[{"title":"Connected Devices","status":"1","id":"5b72cd93-5445-4d84-b69b-50d04b432fb6"},{"title":"KaiOS","status":"1","id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d"},{"title":"Mobile","status":"1","id":"bc1f7d8e-53af-4db8-8e0f-c7cf25fe5345"},{"title":"Smart TV","status":"1","id":"6d54b9bf-c041-48c8-9150-a05c59221b22"},{"title":"test","status":"1","id":"158d4523-8c6d-453f-997b-8bc8c0a631f8"},{"title":"testing","status":"1","id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f"},{"title":"Web","status":"1","id":"de7c4077-9323-4f79-960b-0003004e1ee8"}],"errorText":"","validation":{"required":false},"touched":0},{"name":"tvodTier","type":"dropdown","value":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/TVODTier","keyText":"title","label":"TVOD Tier","data":[{"title":"test","status":"1","id":"b9773dba-f380-45dd-9b1a-9db2192ea3fe"},{"title":"testing","status":"1","id":"3ac2b4c9-9708-4864-b9ae-1a191cdd9ef8"},{"title":"TVOD_Gold","status":"1","id":"5b44c8f7-1166-465f-a56c-ae03a08bb503"},{"title":"TVOD_Platinum","status":"1","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},{"title":"TVOD_Silver","status":"1","id":"4d4a6f84-5e9f-4c70-a126-822516e47daf"}],"errorText":"","validation":{"required":false},"touched":0}]
  const instance = wrapper.instance();
  jest.spyOn(instance, "selectGroupForTemplate");
  wrapper.setState({template_edit_section})
  instance.selectGroupForTemplate({target:{checked: true}},"Others");
  expect(instance.selectGroupForTemplate).toHaveBeenCalledTimes(1);
});



it('should test componentDidMount ',()=>{
const licenseData = {"billingType":{"title":null,"id":null},"businessType":{"title":"advertisement_downloadable","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},"country":[[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"}],[{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"}],[{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],[{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"}],[{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"}],[{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"}],[{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"}],[{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana"}],[{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia"}],[{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa"}],[{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland"}]],"fromDate":"2021-04-20T00:00:00.000Z","platform":[[{"id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d","title":"KaiOS"}]],"reason":{"title":null,"id":null},"toDate":"2021-04-25T00:00:00.000Z","tvodTier":{"title":null,"id":null},"id":"6f42817b-2778-4053-83b3-c3f990e0e240","currentStatus":"1","createdBy":"","updatedBy":"","updatedByEmail":"","dateCreated":"","setName":"a","isParentTypeTvod":true,"validateCountries":true}
 wrapper.setProps({licenseData:licenseData})
 const instance = wrapper.instance();
 jest.spyOn(instance, 'componentDidMount');
 instance.componentDidMount();
 expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
});

it('should test handleMarkAsDone ',()=>{
  wrapper.setProps({selectedTab:3})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'handleMarkAsDone');
   instance.handleMarkAsDone(false);
   expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
  });
  
  it('should test componentDidMount ',()=>{
    const licenseData = {"billingType":{"title":null,"id":null},"businessType":{"title":"advertisement_downloadable","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},"country":[[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"}],[{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"}],[{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],[{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"}],[{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"}],[{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"}],[{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"}],[{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana"}],[{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia"}],[{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa"}],[{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland"}]],"fromDate":"2021-04-20T00:00:00.000Z","platform":[[{"id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d","title":"KaiOS"}]],"reason":{"title":null,"id":null},"toDate":"2021-04-25T00:00:00.000Z","tvodTier":{"title":null,"id":null},"id":"6f42817b-2778-4053-83b3-c3f990e0e240","currentStatus":"1","createdBy":"","updatedBy":"","updatedByEmail":"","dateCreated":"","setName":"a","isParentTypeTvod":true,"validateCountries":true}
     wrapper.setProps({licenseData:licenseData})
     const instance = wrapper.instance();
     jest.spyOn(instance, 'componentDidMount');
     instance.componentDidMount();
     expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
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
  


    
  it('should test InputChangerGroup',()=>{
    const event = {target:{name:'setName', value:"hello" , files:[{path:"test/image/path"}]}}

      
    // const wrapper = setup();
   wrapper.setState({template_edit_section:LicenseJSONSchema[0].template_edit_section})
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



})