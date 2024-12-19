import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../../Utils';
import ManualLicense from '../../../../_components/TvShow/LicenseModule/SubComponents/CreateLicense';
import LicenseJSON from "../../../../_components/TvShow/Schema/TvShow_StandardJourney_FE_Structure.json";
import { expect, it, jest } from '@jest/globals';
import { tvShowsService } from '../../../../_services/tvShows.service';

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ManualLicense store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  movieMgmt_reducer: {}
}

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

const licenseList = [{
  "id": "f8d9ece7-247b-4e8a-8b66-196d4d9a44ef",
  "movieId": "c497732d-f7e8-494f-93a8-6ed051bb17a6",
  "validFrom": "2021-04-26T10:21:00.000Z",
  "validUntil": "2021-04-30T10:21:00.000Z",
  "countriesId": [
    [{
      "id": "ba7216dd-51cb-40d3-808a-cfc0b4597752",
      "title": "Botswana"
    }]
  ],
  "platformId": [],
  "TVODTier": {
    "title": null,
    "id": null
  },
  "BillingType": {
    "title": null,
    "id": null
  },
  "BusinessType": {
    "title": "free_authenticated",
    "id": "16066125-0356-4b8b-9633-b1032b0ffeff"
  },
  "status": "1",
  "reasonType": {
    "title": null,
    "id": null
  },
  "setName": "Q1",
  "isParentTypeTvod": false
}, {
  "id": "ad6c9e64-8ebb-41ec-b9d0-d128339c421f",
  "movieId": "c497732d-f7e8-494f-93a8-6ed051bb17a6",
  "validFrom": "2021-04-27T10:15:00.000Z",
  "validUntil": "2021-04-29T10:15:00.000Z",
  "countriesId": [
    [{
      "id": "cc345c9b-335e-4283-ac51-c603e0bbe7d6",
      "title": "Cameroon"
    }]
  ],
  "platformId": [],
  "TVODTier": {
    "title": null,
    "id": null
  },
  "BillingType": {
    "title": null,
    "id": null
  },
  "BusinessType": {
    "title": "advertisement_downloadable",
    "id": "245fee5c-c924-446b-a168-da94d9cd12c3"
  },
  "status": "1",
  "reasonType": {
    "title": null,
    "id": null
  },
  "setName": "S1",
  "isParentTypeTvod": true
}, {
  "id": "1f1fd87b-8258-4c80-b7a2-b91114fe6e6d",
  "movieId": "c497732d-f7e8-494f-93a8-6ed051bb17a6",
  "validFrom": "2021-04-28T10:13:00.000Z",
  "validUntil": "2021-04-30T10:13:00.000Z",
  "countriesId": [
    [{
      "id": "aa271ec3-faff-46ac-aa6d-bdda1862e228",
      "title": "Chad"
    }]
  ],
  "platformId": [],
  "TVODTier": {
    "title": null,
    "id": null
  },
  "BillingType": {
    "title": null,
    "id": null
  },
  "BusinessType": {
    "title": "free_authenticated_downloadable",
    "id": "0ce15743-1e88-4f49-8e1f-f7559f4d389c"
  },
  "status": "1",
  "reasonType": {
    "title": null,
    "id": null
  },
  "setName": "l2",
  "isParentTypeTvod": false
}]
describe('ManualLicense', () => {
  let wrapper;
  const tvShowId = 'be60db9f-efbb-4a3e-b0c2-00789e0c2665';
  beforeEach(() => {
    const wrapperInstance = setup(initialState);
    wrapper = wrapperInstance.dive();
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check generateObjectForSubmitLicense method', () => {
    jest.spyOn(wrapper.instance(), 'generateObjectForSubmitLicense');
    wrapper.instance().generateObjectForSubmitLicense();
    expect(wrapper.instance().generateObjectForSubmitLicense).toBeCalled();
  })

  it('should check generateObjectForSubmitLicense method with licenceData as params', () => {
    const licenceData = [{
      billingTypeId: "55fe8f96-0fb4-432b-af2a-dda09e301ca2", businessTypeId: "24d21e44-16f9-4ecc-a14e-f9e060b7a48e",
      countriesId: ["1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66"], fromDate: "2021-01-22T00:00:00.000Z",
      platformId: ["f9c84a3c-f58c-409c-b958-4e5d28ef156f", "de7c4077-9323-4f79-960b-0003004e1ee8"], reasonType: null,
      status: "1", tvodTierId: "01e686be-71ca-4355-b8e6-a85d6b4b6118", validFrom: "2021-01-22T00:00:00.000Z",
      validUntil: "2021-02-07T00:00:00.000Z",
    }]
    jest.spyOn(wrapper.instance(), 'generateObjectForSubmitLicense');
    wrapper.instance().generateObjectForSubmitLicense(licenceData);
    expect(wrapper.instance().generateObjectForSubmitLicense).toBeCalled();
  })

  it('should check checkValidationForUSerCountry method', () => {
    jest.spyOn(wrapper.instance(), 'checkValidationForUSerCountry');
    wrapper.instance().checkValidationForUSerCountry();
    expect(wrapper.instance().checkValidationForUSerCountry).toBeCalled();
  })

  it('should check checkValidationForUSerCountry method with params', () => {
    const templateListData = ["0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", "0077a5a3-461f-4d5d-9d22-fc30923c4a02",
      "011c2697-7ea6-440d-9f4d-6840f08f2197"];
    const userDetails = [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG" },
    { id: "468fd8ff-afa3-4245-8dc8-25ba230dfabd", title: "Sri Lanka", code: "LK" }]
    wrapper.setState({ userDetails })
    jest.spyOn(wrapper.instance(), 'checkValidationForUSerCountry');
    wrapper.instance().checkValidationForUSerCountry(templateListData);
    expect(wrapper.instance().checkValidationForUSerCountry).toBeCalled();
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
  it('should check submitTemplateLicence onclick method', () => {
    const templateListData = [{ test: '234' }];
    const licenceStatus = "2"
    wrapper.setState({ templateListData, licenceStatus })
    const spy = jest.spyOn(wrapper.instance(), 'submitTemplateLicence');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'submit-template-license');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check InputChanger method', () => {
    const event = { target: { value: 'xyz' } }
    wrapper.setProps({ manualJsonSchema: LicenseJSON })
    jest.spyOn(wrapper.instance(), 'InputChanger');
    wrapper.instance().InputChanger(event, 1);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })

  it('render component setSelectDataArr', () => {
    wrapper.setProps({ manualJsonSchema: LicenseJSON })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr(null, 1);
    expect(instance.setSelectDataArr).toHaveBeenCalled();
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


it('should test componentDidMount ',()=>{
  const licenseData = {"billingType":{"title":null,"id":null},"businessType":{"title":"advertisement_downloadable","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},"country":[[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"}],[{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"}],[{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],[{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad"}],[{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"}],[{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)"}],[{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon"}],[{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana"}],[{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia"}],[{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa"}],[{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland"}]],"fromDate":"2021-04-20T00:00:00.000Z","platform":[[{"id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d","title":"KaiOS"}]],"reason":{"title":null,"id":null},"toDate":"2021-04-25T00:00:00.000Z","tvodTier":{"title":null,"id":null},"id":"6f42817b-2778-4053-83b3-c3f990e0e240","currentStatus":"1","createdBy":"","updatedBy":"","updatedByEmail":"","dateCreated":"","setName":"a","isParentTypeTvod":true,"validateCountries":true}
   wrapper.setProps({licenseData:licenseData,jsonData:LicenseJSONSchema})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'componentDidMount');
   instance.componentDidMount();
   expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });


  it("should test selectGroupForTemplate", () => {
    const template_edit_section = [{"name":"country","type":"dropdown","value":[],"col":"col-md-6 col-lg-6","multiple":true,"groupBy":"group","path":"user/country-group","keyText":"title","label":"Country / Group","data":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola","code":"AO","status":"1","group":"AFRICA_MA"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon","code":"CM","status":"1","group":"AFRICA_MA"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic","code":"CF","status":"1","group":"AFRICA_MA"},{"id":"aa271ec3-faff-46ac-aa6d-bdda1862e228","title":"Chad","code":"TD","status":"1","group":"AFRICA_MA"},{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo","code":"CG","status":"1","group":"AFRICA_MA"},{"id":"190bd48a-86ec-459c-a734-3679cb23aac1","title":"Congo (Democratic Republic of the)","code":"CD","status":"1","group":"AFRICA_MA"},{"id":"c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67","title":"Gabon","code":"GA","status":"1","group":"AFRICA_MA"},{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana","code":"BW","status":"1","group":"AFRICA_SA"},{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia","code":"NA","status":"1","group":"AFRICA_SA"},{"id":"386588f9-0080-4d4a-9b7c-7f2d1dc60c77","title":"South Africa","code":"ZA","status":"1","group":"AFRICA_SA"},{"id":"0ea03c08-7086-4519-814c-e4333581ba8d","title":"Swaziland","code":"SZ","status":"1","group":"AFRICA_SA"}],"errorText":"","validation":{"required":true},"touched":1},{"name":"businessType","type":"dropdown","value":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BusinessType","keyText":"title","label":"Business Type","data":[{"title":"Advertisement","status":"1","id":"6fbedee2-921b-4abf-9143-7d006f5a1450"},{"title":"advertisement_authenticated","status":"1","id":"1d39250f-48a7-40e3-adaa-bf976cc332bb"},{"title":"advertisement_authenticated_downloadable","status":"1","id":"9700e1fe-d36a-408b-95dd-a3e95baa9cf8"},{"title":"advertisement_downloadable","status":"1","id":"245fee5c-c924-446b-a168-da94d9cd12c3"},{"title":"free_authenticated","status":"1","id":"16066125-0356-4b8b-9633-b1032b0ffeff"},{"title":"free_authenticated_downloadable","status":"1","id":"0ce15743-1e88-4f49-8e1f-f7559f4d389c"},{"title":"free_downloadable","status":"1","id":"80a13565-f2a5-4036-bb4e-251d7cb030a9"},{"title":"Premium","status":"1","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},{"title":"premium_downloadable","status":"1","id":"d6b5d8f5-2322-4d7c-acd5-7e1bea010132"},{"title":"test","status":"1","id":"14739970-e00f-4c7b-a788-daa1ce8cb386"},{"title":"testing","status":"1","id":"a74e6da7-7567-41f2-9c71-4c0c34703d10"},{"title":"tvod","status":"1","id":"317fbc1f-24fa-4ce4-97be-0857cd3948b3"},{"title":"tvod_downloadable","status":"1","id":"1911d195-02d2-412d-9b3c-cc9f241d4f43"}],"errorText":"","validation":{"required":true},"touched":0},{"name":"billingType","type":"dropdown","value":null,"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/BillingType","keyText":"title","label":"Billing Type","data":[{"title":"Club","status":"1","id":"8dc545d9-470e-4fb8-b32f-bdee3368c952"},{"title":"Premium","status":"1","id":"858f7d02-3388-49ef-ba1c-4a594df616f8"},{"title":"test","status":"1","id":"a71f6157-d6f8-46db-b2f7-1be58f512139"},{"title":"testing","status":"1","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},{"title":"Testtest","status":"1","id":"378b8ad7-5f30-47c8-972e-d38b2be0fe49"}],"errorText":"","validation":{"required":false},"touched":1},{"name":"platform","type":"conditionalDropdown","value":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"col":"col-md-6 col-lg-6","multiple":true,"path":"/master/Platform","keyText":"title","label":"Platform","data":[{"title":"Connected Devices","status":"1","id":"5b72cd93-5445-4d84-b69b-50d04b432fb6"},{"title":"KaiOS","status":"1","id":"0b4bf044-b439-4c98-8fa3-f4a15e9eab3d"},{"title":"Mobile","status":"1","id":"bc1f7d8e-53af-4db8-8e0f-c7cf25fe5345"},{"title":"Smart TV","status":"1","id":"6d54b9bf-c041-48c8-9150-a05c59221b22"},{"title":"test","status":"1","id":"158d4523-8c6d-453f-997b-8bc8c0a631f8"},{"title":"testing","status":"1","id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f"},{"title":"Web","status":"1","id":"de7c4077-9323-4f79-960b-0003004e1ee8"}],"errorText":"","validation":{"required":false},"touched":0},{"name":"tvodTier","type":"dropdown","value":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"col":"col-md-6 col-lg-6","multiple":false,"path":"/master/TVODTier","keyText":"title","label":"TVOD Tier","data":[{"title":"test","status":"1","id":"b9773dba-f380-45dd-9b1a-9db2192ea3fe"},{"title":"testing","status":"1","id":"3ac2b4c9-9708-4864-b9ae-1a191cdd9ef8"},{"title":"TVOD_Gold","status":"1","id":"5b44c8f7-1166-465f-a56c-ae03a08bb503"},{"title":"TVOD_Platinum","status":"1","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},{"title":"TVOD_Silver","status":"1","id":"4d4a6f84-5e9f-4c70-a126-822516e47daf"}],"errorText":"","validation":{"required":false},"touched":0}]
    const instance = wrapper.instance();
    jest.spyOn(instance, "selectGroupForTemplate");
    wrapper.setState({template_edit_section})
    instance.selectGroupForTemplate({target:{checked: true}},"Others");
    expect(instance.selectGroupForTemplate).toHaveBeenCalledTimes(1);
  });

  it('render component checkValidation', () => {
    wrapper.setProps({ manualJsonSchema: LicenseJSON })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkValidation');
    instance.checkValidation();
    expect(instance.checkValidation).toBeCalled();
  })

  it('render component handleCountryDisableData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleCountryDisableData');
    instance.handleCountryDisableData();
    expect(instance.handleCountryDisableData).toBeCalled();
  })

  it('should check getUserDetails', () => {
    jest.spyOn(wrapper.instance(), 'getUserDetails');
    wrapper.instance().getUserDetails();
    expect(wrapper.instance().getUserDetails).toBeCalled();
  })


  it('should check handleMarkAsDone', () => {
    const props = {
      markAsDone: jest.fn()
    }
    wrapper.setProps({ ...props });
    jest.spyOn(wrapper.instance(), 'handleMarkAsDone');
    wrapper.instance().handleMarkAsDone();
    expect(wrapper.instance().handleMarkAsDone).toBeCalled();
  })

  it('should check fillEditDetails', () => {
    const resData = {
      billingType: { title: null, id: null },
      businessType: { title: "free_authenticated", id: "16066125-0356-4b8b-9633-b1032b0ffeff" },
      country: [],
      createdBy: "",
      currentStatus: "1",
    }
    jest.spyOn(wrapper.instance(), 'fillEditDetails');
    wrapper.instance().fillEditDetails(resData);
    expect(wrapper.instance().fillEditDetails).toBeCalled();
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

  it('should check fillEditDetailsTemplate', () => {
    const res = [{
      billingType: { title: "Premium", id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2" },
      businessType: { title: "Premium", id: "24d21e44-16f9-4ecc-a14e-f9e060b7a48e" },
      country: [],
      currentStatus: "Active"
    }]
    jest.spyOn(wrapper.instance(), 'fillEditDetailsTemplate');
    wrapper.instance().fillEditDetailsTemplate(res, 0);
    expect(wrapper.instance().fillEditDetailsTemplate).toBeCalled();
  });

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

  it('should check handleTemplateEdit onclick method', () => {
    const templateData = [{
      billingType: { title: "Premium", id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2" },
      businessType: { title: "Premium", id: "24d21e44-16f9-4ecc-a14e-f9e060b7a48e" },
      country: [{ id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso" },
      { id: "0077a5a3-461f-4d5d-9d22-fc30923c4a02", title: "Northern Mariana Islands" },
      { id: "011c2697-7ea6-440d-9f4d-6840f08f2197", title: "United Arab Emirates" }],
      currentStatus: "Active"
    }]
    const templateListData = [{ test: '234' }];
    wrapper.setState({ templateListData })
    jest.spyOn(wrapper.instance(), 'handleTemplateEdit');
    wrapper.instance().handleTemplateEdit(templateData, 0);
    expect(wrapper.instance().handleTemplateEdit).toBeCalled();
  })

  it('should test checkOnlyExistCountry', () => {
    const templateListData = {
      country: [{ id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso" },
      { id: "0077a5a3-461f-4d5d-9d22-fc30923c4a02", title: "Northern Mariana Islands" },
      { id: "011c2697-7ea6-440d-9f4d-6840f08f2197", title: "United Arab Emirates" }]
    };
    jest.spyOn(wrapper.instance(), 'checkOnlyExistCountry');
    wrapper.instance().checkOnlyExistCountry(templateListData);
    expect(wrapper.instance().checkOnlyExistCountry).toBeCalled();
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

  it('should check validateUserCountry method', () => {
    const templateListData = {
      country: [{ id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71", title: "Burkina Faso" },
      { id: "0077a5a3-461f-4d5d-9d22-fc30923c4a02", title: "Northern Mariana Islands" },
      { id: "011c2697-7ea6-440d-9f4d-6840f08f2197", title: "United Arab Emirates" }]
    };
    wrapper.setState({ templateListData })
    jest.spyOn(wrapper.instance(), 'validateUserCountry');
    wrapper.instance().validateUserCountry();
    expect(wrapper.instance().validateUserCountry).toBeCalled();
  })

  // api call
  it('should check editLicence method', async () => {
    const testData = [{
      col: "col-md-6 col-lg-6",
      disablePast: true,
      errorText: "",
      label: "License From Date",
      minDate: "sameOrAfter",
      name: "fromDate",
      touched: 0,
      type: "date",
      valid: true,
      validation: { required: true },
      value: "2021-02-07"
    },
    {
      col: "col-md-6 col-lg-6",
      data: [{ title: "Advertisement", status: "1", id: "6fbedee2-921b-4abf-9143-7d006f5a1450" }, {
        id: "1d39250f-48a7-40e3-adaa-bf976cc332bb",
        status: "1",
        title: "advertisement_authenticated"
      }],
      errorText: "",
      keyText: "title",
      label: "Business Type",
      multiple: false,
      name: "businessType",
      path: "/master/BusinessType",
      touched: 0,
      type: "dropdown",
      valid: true,
      validation: { required: true },
      value: { title: "free_authenticated", id: "16066125-0356-4b8b-9633-b1032b0ffeff" }
    }]
    const id = '50c31de9-81eb-435e-82c1-7cb39f78e056';
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
    wrapper.setState({ manualJsonSchema: testData })
    jest.spyOn(wrapper.instance(), 'editLicence');
    wrapper.instance().editLicence();
    expect(wrapper.instance().editLicence).toBeCalled();

    const mock = jest.fn().mockReturnValue(response);
    tvShowsService.edit_licence_service = mock;
    const result = await tvShowsService.edit_licence_service(id,tvShowId, params);
    expect(result).toBe(response);
  })

  it('should check editLicenceTemplate onclick method', () => {
    const templateListData = [{ test: '234' }];
    const templateEdit = 1;
    const temp_edit = [{
      col: "col-md-6 col-lg-6",
      data: [{ code: "SG", group: "Others", id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", status: "1", title: "Singapore" }],
      errorText: "",
      groupBy: "group",
      keyText: "title",
      label: "Country / Group",
      licenseDate: undefined,
      multiple: true,
      name: "country",
      path: "user/country-group",
      touched: 1,
      type: "dropdown",
      valid: true,
      validation: { required: true },
      value: [{
        id: "0268c610-2ef9-4bc3-86bf-7ffaf1bd2f71",
        title: "Burkina Faso"
      }]
    }]
    wrapper.setState({ templateListData, templateEdit, template_edit_section: temp_edit })
    const spy = jest.spyOn(wrapper.instance(), 'editLicenceTemplate');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'edit-license-template');
    // button.simulate('click');
    // expect(spy).toHaveBeenCalled();
  })

  // api call
  it('should check submitLicence method', async () => {
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
    tvShowsService.create_licence_service = mock;
    const result = await tvShowsService.create_licence_service(params, tvShowId);
    jest.spyOn(wrapper.instance(), 'submitLicence');
    wrapper.instance().submitLicence();
    expect(wrapper.instance().submitLicence).toBeCalled();
    expect(result).toBe(response);
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
  it('should check generateObject method', () => {
    const data = [{ id: "f9c84a3c-f58c-409c-b958-4e5d28ef156f", title: "Mobile" },
    { id: "de7c4077-9323-4f79-960b-0003004e1ee8", title: "Web" }]
    jest.spyOn(wrapper.instance(), 'generateObject');
    wrapper.instance().generateObject(data);
    expect(wrapper.instance().generateObject).toBeCalled();
  })

  it('should check generateObjectForSubmitLicense method', () => {
    const licenceData = [{ id: "f9c84a3c-f58c-409c-b958-4e5d28ef156f", title: "Mobile" },
    { id: "de7c4077-9323-4f79-960b-0003004e1ee8", title: "Web" }]
    jest.spyOn(wrapper.instance(), 'generateObjectForSubmitLicense');
    wrapper.instance().generateObjectForSubmitLicense(licenceData);
    expect(wrapper.instance().generateObjectForSubmitLicense).toBeCalled();
  })

  it('should check handleLicenceChange onclick method', () => {
    const event = { target: { value: 'xyz' } }
    const templateListData = [{ test: '234' }];
    const editTab = 0;
    wrapper.setState({ templateListData, editTab })
    const spy = jest.spyOn(wrapper.instance(), 'handleLicenceChange');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-licence-change');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check showHideStatePopup method', () => {
    wrapper.setState({ showStatePopup: true })
    jest.spyOn(wrapper.instance(), 'showHideStatePopup');
    wrapper.instance().showHideStatePopup();
    expect(wrapper.instance().showHideStatePopup).toBeCalled();
  })

  it('should check handleStatePopup', () => {
    const props = {
      openLicenseForm: jest.fn()
    }
    wrapper.setProps({ ...props });
    jest.spyOn(wrapper.instance(), 'handleStatePopup');
    wrapper.instance().handleStatePopup();
    expect(wrapper.instance().handleStatePopup).toBeCalled();
  })

  it('should test handleDeleteTemplate', () => {
    const data = [{ test: '234' }];
    jest.spyOn(wrapper.instance(), 'handleDeleteTemplate');
    wrapper.instance().handleDeleteTemplate(data, 0);
    expect(wrapper.instance().handleDeleteTemplate).toBeCalled();
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

 

    it('should test InputChangerTemplate ',()=>{
      const event = {target:{name:'setName',value:'test value' ,files:[{path:"test/image/path"}]}}
      const templateListData =  [{"billingType":{"title":"testing","id":"55fe8f96-0fb4-432b-af2a-dda09e301ca2"},"businessType":{"title":"Premium","id":"24d21e44-16f9-4ecc-a14e-f9e060b7a48e"},"country":[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"},{"id":"cc345c9b-335e-4283-ac51-c603e0bbe7d6","title":"Cameroon"},{"id":"d3044dbd-1dd8-4cda-8602-e4e03f4b557b","title":"Central African Republic"}],"platform":[{"id":"de7c4077-9323-4f79-960b-0003004e1ee8","title":"Web"},{"id":"f9c84a3c-f58c-409c-b958-4e5d28ef156f","title":"testing"}],"tvodTier":{"title":"TVOD_Platinum","id":"01e686be-71ca-4355-b8e6-a85d6b4b6118"},"currentStatus":"Active","invalidCountry":[],"licenseDate":[{"name":"setName","type":"text","value":"kk","col":"col-md-6 col-lg-6","label":"Set Name","errorText":null,"validation":{"required":true,"isAlphaNumericWithSpecialChars":true,"maxLength":250},"valid":true,"touched":1},{"name":"isParentTypeTvod","value":false,"col":"col-md-6 col-lg-6","type":"checkbox","label":"Parent Type TVOD","labelPlacement":"end","validation":{"required":false},"errorText":""},{"name":"fromDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License From Date","minDate":"sameOrAfter","disablePast":true,"errorText":null,"validation":{"required":true}},{"name":"toDate","type":"date","value":"","col":"col-md-6 col-lg-6","label":"License To Date","minDate":"sameOrAfter","disablePast":true,"errorText":null,"validation":{"required":true}}]}] 
     wrapper.setState({templateListData:templateListData})
     const instance = wrapper.instance();
     jest.spyOn(instance, 'InputChangerTemplate');
     instance.InputChangerTemplate(event,0,0);
     expect(instance.InputChangerTemplate).toHaveBeenCalledTimes(1);
    });
    
});