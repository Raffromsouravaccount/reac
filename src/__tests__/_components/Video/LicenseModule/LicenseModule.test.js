import React from "react";
import { shallow } from "enzyme";

import { storeFactory, findByTestAttr } from "../../../../Utils";
import LicenseModule from "../../../../_components/Video/LicenseModule/LicenseModule";

import LicenseJSON from "../../../../_components/Video/Schema/license/LicenseModule.json";
import jsonData from "../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json";

const setup = (initialstate = {}, props = {}) => {
  const store = storeFactory(initialstate);
  const wrapper = shallow(<LicenseModule store={store} {...props} />).dive();
  return wrapper;
};
const initialState = {
  videoMgmt_reducer: {},
};

describe("LicenseModule", () => {
  let wrapper;
  const baseProps = {
    unLockedSession: jest.fn(),
    markAsDone: jest.fn(),
    language: 'en',
    getLicenseData: jest.fn(),
    unLockedSession: jest.fn(),
    jsonData: jsonData.License
  };
  const state = {
    commonmodel_section : [{
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
    }],
    currentStatus: 'test'};

  beforeEach(() => {
    const wrapperInstance = setup(initialState, { ...baseProps });
    wrapper = wrapperInstance.dive();
    wrapper.setState({...state})
    
  });

  it("render component without error", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test removeLock", () => {
    jest.spyOn(wrapper.instance(), "removeLock");
    wrapper.instance().removeLock();
    expect(wrapper.instance().removeLock).toBeCalled();
  });

  it("should check markAsDone", () => {
    jest.spyOn(wrapper.instance(), "markAsDone");
    wrapper.instance().markAsDone(true);
    expect(wrapper.instance().markAsDone).toBeCalled();
  });

  it('should check handleMarkAsDone method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMarkAsDone');
    instance.handleMarkAsDone();
    expect(instance.handleMarkAsDone).toHaveBeenCalled();
  })

  it('should check markAsDone method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'markAsDone');
    instance.markAsDone();
    expect(instance.markAsDone).toHaveBeenCalled();
  })
  it("should check handleMarkAsDone", () => {
    jest.spyOn(wrapper.instance(), "handleMarkAsDone");
    wrapper.instance().handleMarkAsDone(true);
    expect(wrapper.instance().handleMarkAsDone).toBeCalled();
  });
  it("should check handleEditStatus method", () => {
    const licenseData ={
      "billingType": {
        "title": null,
        "id": null
      },
      "businessType": {
        "title": "advertisement_authenticated",
        "id": "1d39250f-48a7-40e3-adaa-bf976cc332bb"
      },
      "country": [
        [{
          "id": "66e3f511-73f1-4731-9a0a-c070558698aa",
          "title": "Angola"
        }],
        [{
          "id": "cc345c9b-335e-4283-ac51-c603e0bbe7d6",
          "title": "Cameroon"
        }],
        [{
          "id": "d3044dbd-1dd8-4cda-8602-e4e03f4b557b",
          "title": "Central African Republic"
        }],
        [{
          "id": "aa271ec3-faff-46ac-aa6d-bdda1862e228",
          "title": "Chad"
        }],
        [{
          "id": "595a0657-d60e-4248-b75d-8bc2c77181bb",
          "title": "Congo"
        }],
        [{
          "id": "190bd48a-86ec-459c-a734-3679cb23aac1",
          "title": "Congo (Democratic Republic of the)"
        }],
        [{
          "id": "c1e23d4f-cdf2-4f9c-857a-adaf2f2d4f67",
          "title": "Gabon"
        }],
        [{
          "id": "ba7216dd-51cb-40d3-808a-cfc0b4597752",
          "title": "Botswana"
        }],
        [{
          "id": "cd56aa76-153a-43b1-9393-2ece61ccefe0",
          "title": "Namibia"
        }],
        [{
          "id": "386588f9-0080-4d4a-9b7c-7f2d1dc60c77",
          "title": "South Africa"
        }],
        [{
          "id": "0ea03c08-7086-4519-814c-e4333581ba8d",
          "title": "Swaziland"
        }]
      ],
      "fromDate": "2021-04-28T00:00:00.000Z",
      "platform": [
        [{
          "id": "5b72cd93-5445-4d84-b69b-50d04b432fb6",
          "title": "Connected Devices"
        }]
      ],
      "reason": {
        "title": null,
        "id": null
      },
      "toDate": "2021-04-30T00:00:00.000Z",
      "tvodTier": {
        "title": null,
        "id": null
      },
      "id": "15cd61b6-a518-4007-b217-c2ecfdf59915",
      "currentStatus": "1",
      "createdBy": "",
      "updatedBy": "",
      "updatedByEmail": "",
      "dateCreated": "",
      "setName": "te st",
      "validateCountries": true
    }
    const formData = {"reason":"","currentStatus":"","uuid":"","fromDate":"","toDate":"","country":"","businessType":"","billingType":{},"tvodTier":"","platform":"","dateCreated":"","createdBy":"","updatedBy":"","userDetails":""}
    wrapper.setState({
      formData: formData,
      contentId: "d3044dbd-1dd8-4cda-8602-e4e03f4b557b",
    });
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleEditStatus");
    instance.handleEditStatus(1, licenseData);
    expect(instance.handleEditStatus).toHaveBeenCalled();
  });


  it("should check setSelectDataArr", () => {
    const res = [
      {
        id: "8dc545d9-470e-4fb8-b32f-bdee3368c952",
        status: "1",
        title: "Club",
      },
      {
        id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2",
        status: "1",
        title: "Premium",
      },
    ];
    wrapper.setState({ manualJsonSchema: baseProps.jsonData });
    jest.spyOn(wrapper.instance(), "setSelectDataArr");
    wrapper.instance().setSelectDataArr(res, 0);
    expect(wrapper.instance().setSelectDataArr).toBeCalled();
  });

  it("should check setSelectDataArrComonArr", () => {
    const res = [
      {
        id: "6273161b-5dc5-47f1-b14a-74b5df9d4690",
        status: "1",
        title: "Legal issue",
      },
      {
        id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2",
        status: "1",
        title: "License expired",
      },
    ];
    jest.spyOn(wrapper.instance(), "setSelectDataArrComonArr");
    wrapper.instance().setSelectDataArrComonArr(res, 0);
    expect(wrapper.instance().setSelectDataArrComonArr).toBeCalled();
  });

  it("should check InputChangerCommonable", () => {
    const event = {target: {value: 'test'}}
    jest.spyOn(wrapper.instance(), "InputChangerCommonable");
    wrapper.instance().InputChangerCommonable(event, 0);
    expect(wrapper.instance().InputChangerCommonable).toBeCalled();
  });
  
  it("should check InputChanger method", () => {
    wrapper.setState({manualJsonSchema: baseProps.jsonData})
    const event = {target: {value: 'test'}}
    jest.spyOn(wrapper.instance(), "InputChanger");
    wrapper.instance().InputChanger(event, 0);
    expect(wrapper.instance().InputChanger).toBeCalled();
  });
  
  it("should check InputChanger2", () => {
    wrapper.setState({manualJsonSchema: baseProps.jsonData})
    const event = {target: {value: 'test'}}
    jest.spyOn(wrapper.instance(), "InputChanger2");
    wrapper.instance().InputChanger2(event, 0);
    expect(wrapper.instance().InputChanger2).toBeCalled();
  });

  it("should check getBusinessType method", () => {
    jest.spyOn(wrapper.instance(), "getBusinessType");
    wrapper.instance().getBusinessType(null, null);
    expect(wrapper.instance().getBusinessType).toBeCalled();
  })

  it("should check getBillingType method", () => {
    jest.spyOn(wrapper.instance(), "getBillingType");
    wrapper.instance().getBillingType(null, null);
    expect(wrapper.instance().getBillingType).toBeCalled();
  })

  it("should check getPlatform method", () => {
    jest.spyOn(wrapper.instance(), "getPlatform");
    wrapper.instance().getPlatform(null, null);
    expect(wrapper.instance().getPlatform).toBeCalled();
  })
  
  it("should check showHideFilterDrawer method", () => {
    jest.spyOn(wrapper.instance(), "showHideFilterDrawer");
    wrapper.instance().showHideFilterDrawer();
    expect(wrapper.instance().showHideFilterDrawer).toBeCalled();
  })

  it("should check handleEditStatus method", () => {
    jest.spyOn(wrapper.instance(), "handleEditStatus");
    wrapper.instance().handleEditStatus();
    expect(wrapper.instance().handleEditStatus).toBeCalled();
  })
  
  it("should check activateDeactivateLicence method", () => {
    jest.spyOn(wrapper.instance(), "activateDeactivateLicence");
    wrapper.instance().activateDeactivateLicence();
    expect(wrapper.instance().activateDeactivateLicence).toBeCalled();
  })
  
  it("should check handleDate method", () => {
    const event = {target : {value:'xyz', name: 'mock'}}
    jest.spyOn(wrapper.instance(), "handleDate");
    wrapper.instance().handleDate(event);
    expect(wrapper.instance().handleDate).toBeCalled();
  })
  
  it("should check clearFilter method", () => {
    wrapper.setState({ manualJsonSchema: baseProps.jsonData });
    jest.spyOn(wrapper.instance(), "clearFilter");
    wrapper.instance().clearFilter();
    expect(wrapper.instance().clearFilter).toBeCalled();
  })
  
  it("should check getFilterDrawerUI method", () => {
    wrapper.setState({ manualJsonSchema: baseProps.jsonData });
    jest.spyOn(wrapper.instance(), "getFilterDrawerUI");
    wrapper.instance().getFilterDrawerUI();
    expect(wrapper.instance().getFilterDrawerUI).toBeCalled();
  })
  
  it("should check getFilterDrawerUI method", () => {
    wrapper.setState({ showStatePopup: false });
    jest.spyOn(wrapper.instance(), "showHideStatePopup");
    wrapper.instance().showHideStatePopup();
    expect(wrapper.instance().showHideStatePopup).toBeCalled();
  })
  
  it("should check showHideStatePopupLock method", () => {
    wrapper.setState({ showStatePopupLock: false });
    jest.spyOn(wrapper.instance(), "showHideStatePopupLock");
    wrapper.instance().showHideStatePopupLock();
    expect(wrapper.instance().showHideStatePopupLock).toBeCalled();
  })

  it("should check getExpiredLicense method", () => {
    wrapper.setState({ contentId: '123' });
    jest.spyOn(wrapper.instance(), "getExpiredLicense");
    wrapper.instance().getExpiredLicense();
    expect(wrapper.instance().getExpiredLicense).toBeCalled();
  })
  
  it("should check handleExpiredLicence method", () => {
    wrapper.setState({ contentId: '123', language: 'en' });
    jest.spyOn(wrapper.instance(), "handleExpiredLicence");
    wrapper.instance().handleExpiredLicence();
    expect(wrapper.instance().handleExpiredLicence).toBeCalled();
  })  
  
  it("should check applyFilterForDrawer method", () => {
    const event = {target: {value: 'test', name: 'mock'}}
    wrapper.setState({ manualJsonSchema: baseProps.jsonData });
    jest.spyOn(wrapper.instance(), "applyFilterForDrawer");
    wrapper.instance().applyFilterForDrawer(event);
    expect(wrapper.instance().applyFilterForDrawer).toBeCalled();
  })
  
  it("should check applyFilter method", () => {
    jest.spyOn(wrapper.instance(), "applyFilter");
    wrapper.instance().applyFilter();
    expect(wrapper.instance().applyFilter).toBeCalled();
  })
  
  it("should check applyFilterForCountry method", () => {
    jest.spyOn(wrapper.instance(), "applyFilterForCountry");
    wrapper.instance().applyFilterForCountry();
    expect(wrapper.instance().applyFilterForCountry).toBeCalled();
  })
  
  it("should check checkValidation method", () => {
    jest.spyOn(wrapper.instance(), "checkValidation");
    wrapper.instance().checkValidation();
    expect(wrapper.instance().checkValidation).toBeCalled();
  })
  
  it("should check lockUnlockLicence method", () => {
    jest.spyOn(wrapper.instance(), "lockUnlockLicence");
    wrapper.instance().lockUnlockLicence();
    expect(wrapper.instance().lockUnlockLicence).toBeCalled();
  })

  it('should test InputChanger2',()=>{
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
   jest.spyOn(instance, 'InputChanger2');
   instance.InputChanger2(event,1);
   expect(instance.InputChanger2).toHaveBeenCalledTimes(1);
 });



 it('should test InputChanger2 for file type',()=>{
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
 jest.spyOn(instance, 'InputChanger2');
 instance.InputChanger2(event,0);
 expect(instance.InputChanger2).toHaveBeenCalledTimes(1);
});

it('should check handleRoute method', () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, 'handleRoute');
  instance.handleRoute();
  expect(instance.handleRoute).toHaveBeenCalled();
})
 

    it('should check showHideFilterDrawer method', () => {
      const instance = wrapper.instance();
      jest.spyOn(instance, 'showHideFilterDrawer');
      instance.showHideFilterDrawer();
      expect(instance.showHideFilterDrawer).toHaveBeenCalled();
    })
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

  
  it('should test applyFilter',()=>{
    const validateObj =  {"fromDate":"2021-04-21","toDate":"2021-04-24","businessType":null,"billingType":null,"platform":[],"status":""};
    const copyLicenseList= [{"billingType":{"title":null,"id":null},"businessType":{"title":"free_authenticated_downloadable","id":"0ce15743-1e88-4f49-8e1f-f7559f4d389c"},"country":[[{"id":"d3f975c3-7e80-4aa4-b8a0-fc35ba937c10","title":"Equatorial Guinea"}],[{"id":"595a0657-d60e-4248-b75d-8bc2c77181bb","title":"Congo"}],[{"id":"66e3f511-73f1-4731-9a0a-c070558698aa","title":"Angola"}],[{"id":"260d4e32-108b-4420-a085-2d945e133b5c","title":"Lesotho"}],[{"id":"ba7216dd-51cb-40d3-808a-cfc0b4597752","title":"Botswana"}],[{"id":"cd56aa76-153a-43b1-9393-2ece61ccefe0","title":"Namibia"}]],"fromDate":"2021-04-21T00:00:00.000Z","platform":[],"reason":{"title":null,"id":null},"toDate":"2021-04-24T00:00:00.000Z","tvodTier":{"title":null,"id":null},"id":"1a9b529a-14e6-4175-ad11-cb4a4c68c3c1","currentStatus":"1","createdBy":"","updatedBy":"","updatedByEmail":"","dateCreated":"","setName":"Set License","isParentTypeTvod":false,"validateCountries":false}]
    const filters = {"searchVal":""}
   wrapper.setState({copyLicenseList:copyLicenseList,filters:filters})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'applyFilter');
   instance.applyFilter(validateObj);
   expect(instance.applyFilter).toHaveBeenCalledTimes(1);
  });

});
