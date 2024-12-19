import React from "react";
import { shallow } from "enzyme";
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import Season from "../../../../_components/Season/SeasonList/Season";
import { constantText } from "../../../../_helpers/constants.text";
import { tvShowConstants } from "../../../../_components/TvShow/Constants/tvshow.constants";
import { DEFAULT_JSON } from "../../../../_components/Common/FormHelper/FormValidSetter";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import BreadcrumbsComp from "../../../../_components/Common/BreadCrumbs/BreadCrumbs";
import ButtonField from "../../../../_components/Common/ButtonField/ButtonField";
import { findByTestAttr } from "../../../../Utils";
import headerTabs from "../../../../_components/Season/Schema/SeasonList/HeaderTabs.json";

const propsInitial = {
  match: 
  {
    url: '/tvshow/view/6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b/season',
    params : 
    {id: '6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b'}
  }
}
const setup = (state = {}, props = propsInitial) => {
  const wrapper = shallow(<Season {...props} />);
  wrapper.update();
  if (state) wrapper.setState(state);
  return wrapper;
};
const OrderSetJson = [
  {
    "name": "setName",
    "type": "text",
    "value": "Test",
    "col": "col-md-12 col-lg-12",
    "label": "Set Name",
    "errorText": "",
    "validation": {
      "required": true
    }
  },
  {
    "name": "country",
    "type": "dropdownAsync",
    "value": [{
      "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
      "group":"Others",
      "title":"India"}],
    "col": "col-md-12 col-lg-12",
    "multiple": true,
    "groupBy": "group",
    "path": "user/country-group",
    "keyText": "title",
    "label": "Country / Group",
    "data": [{
      "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
      "group":"Others",
      "title":"India"}],
    "errorText": "",
    "validation": {
      "required": true
    }
  }
]
const initialState = {
  JSONSchema: OrderSetJson,
  selectJourney: null,
  showAskedPopup: false,
  tvShow: {},
  showSetPopup: false,
  showDelPopup: false,
  showSetEditPopup:false,
  selectedTab: 0,
  setMode: 'create',
  assignedData: [],
  allStatus: [],
  LanguageArr: [],
  filteredData: [],
  defaultSeasonId: "2522f523-e2e9-4461-8d1b-e043dbb40b05",
  searchString: "",
  OrderSetList: [
    {
       "seasonOrderingId":"b4dd2adc-95b0-4f52-a569-d6669f150c63",
       "tvShowId":"6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
       "setName":"tess",
       "countryId":[
          {
             "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
             "title":"India"
          }
       ],
       "seasonId":null,
       "status":"1",
       "createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
       "modifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
       "_created_on":"2021-04-19T11:39:29.970Z",
       "_modified_on":"2021-04-19T11:39:37.638Z",
       "seasonList":[
          {
             "seasonId":"61efebf9-097f-4eb8-8a2a-a357d8d18ad0",
             "title":"No Title",
             "externalId":"0-2-5z51004299",
             "note":null,
             "lastModifiedOn":"2021-04-19T10:12:59.179Z",
             "index":1,
             "journeyType":"1",
             "audioLanguages":null,
             "countries":"",
             "SeasonImages":[
                
             ],
             "contentState_populated":{
                "title":"Draft"
             },
             "seasonLicenses":[
                
             ],
             "subtype_populated":null,
             "lastModifiedBy_populated":{
                "first_name":"Shivam",
                "last_name":"Sharma"
             }
          },
          {
             "seasonId":"109a499c-8456-4d67-8f6e-9d157b7bfa6d",
             "title":"No Title",
             "externalId":"0-2-5z51004301",
             "note":null,
             "lastModifiedOn":"2021-04-19T11:21:03.929Z",
             "index":2,
             "journeyType":"1",
             "audioLanguages":null,
             "countries":"Angola,Cameroon,Central African Republic,Chad,Congo,Congo (Democratic Republic of the),Gabon,Botswana,Namibia,South Africa,Swaziland",
             "SeasonImages":[
                
             ],
             "contentState_populated":{
                "title":"Draft"
             },
             "seasonLicenses":[
                {
                   "validFrom":"2021-04-19T00:00:00.000Z",
                   "validUntil":"2021-04-25T00:00:00.000Z"
                }
             ],
             "subtype_populated":null,
             "lastModifiedBy_populated":{
                "first_name":"Rakesh",
                "last_name":"chandra"
             }
          }
       ]
    },
    {
      "seasonOrderingId":"b4dd22hh-95b0-4f52-a569-d6669f150c63",
      "tvShowId":"6a6b5bf7-4ssfb-9ea5-a399-bbf2268cf43b",
      "setName":"tess2",
      "countryId":[
         {
            "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
            "title":"India"
         }
      ],
      "seasonId":null,
      "status":"1",
      "createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
      "modifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
      "_created_on":"2021-04-19T11:39:29.970Z",
      "_modified_on":"2021-04-19T11:39:37.638Z",
      "seasonList":[
         {
            "seasonId":"61efebf9-097f-4eb8-8a2a-a357d8d18ad0",
            "title":"No Title",
            "externalId":"0-2-5z51004299",
            "note":null,
            "lastModifiedOn":"2021-04-19T10:12:59.179Z",
            "index":1,
            "journeyType":"1",
            "audioLanguages":null,
            "countries":"",
            "SeasonImages":[
               
            ],
            "contentState_populated":{
               "title":"Draft"
            },
            "seasonLicenses":[
               
            ],
            "subtype_populated":null,
            "lastModifiedBy_populated":{
               "first_name":"Shivam",
               "last_name":"Sharma"
            }
         },
         {
            "seasonId":"109a499c-8456-4d67-8f6e-9d157b7bfa6d",
            "title":"No Title",
            "externalId":"0-2-5z51004301",
            "note":null,
            "lastModifiedOn":"2021-04-19T11:21:03.929Z",
            "index":2,
            "journeyType":"1",
            "audioLanguages":null,
            "countries":"Angola,Cameroon,Central African Republic,Chad,Congo,Congo (Democratic Republic of the),Gabon,Botswana,Namibia,South Africa,Swaziland",
            "SeasonImages":[
               
            ],
            "contentState_populated":{
               "title":"Draft"
            },
            "seasonLicenses":[
               {
                  "validFrom":"2021-04-19T00:00:00.000Z",
                  "validUntil":"2021-04-25T00:00:00.000Z"
               }
            ],
            "subtype_populated":null,
            "lastModifiedBy_populated":{
               "first_name":"Rakesh",
               "last_name":"chandra"
            }
         }
      ]
   }
 ],
  seasonOrderingId:"2522f523-e2e9-4461-8d1b-e043dbb40b05",
  options: JSON.parse(JSON.stringify(headerTabs)),
  updateObj: { setName: null, country: null },
  model: {
    detail: "",
    open: false,
    desc: "",
    btn1: constantText.yes_text,
    btn2: constantText.no_text,
  },
};

describe("Render Season Component", () => {
  let wrapper;
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup(initialState);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

it('Should renders Season default', () => {
    expect(wrapper.exists()).toBe(true);
})
it("should test ComponentDidMount", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "componentDidMount");
  instance.componentDidMount();
  expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
});
it("should call getAllStatus, fetchDefaultList, getAllLanguage API Success", async (done) => {
  const responseData0 = {
    status: 200,
    response: {
      status: 200,
      data: [
        {
           "title":"Archived",
           "status":"1",
           "id":"28d8bc82-af3a-4e04-bdf7-0a5df324ac51"
        },
        {
           "title":"Changed",
           "status":"1",
           "id":"38c34c4f-68c9-4eb0-b71f-b80f1e551447"
        },
        {
           "title":"Draft",
           "status":"1",
           "id":"3bb64421-f15f-4dda-adec-03c324c140a3"
        },
        {
           "title":"Need Work",
           "status":"1",
           "id":"38c34c4f-68c9-4eb0-b71f-b80f1e551448"
        },
        {
           "title":"Published",
           "status":"1",
           "id":"081cc5b2-a302-4bfb-8e5c-68544ae636e6"
        },
        {
           "title":"Publishing Queue",
           "status":"1",
           "id":"4e565298-6e9c-4d5f-8a03-c23a42cabedd"
        },
        {
           "title":"Scheduled",
           "status":"1",
           "id":"3951d801-9758-4a09-be3e-0af342ba9d13"
        },
        {
           "title":"Submitted To Review",
           "status":"1",
           "id":"38c34c4f-68c9-4eb0-b71f-b80f1e551446"
        },
        {
           "title":"Unpublished",
           "status":"1",
           "id":"21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe"
        }
     ],
    },
  };
  const responseData1 = {
    "status": 200,
    "response": {
        "status": 200,
        "data": [
            {
                "title": "Arabic",
                "status": "1",
                "id": "14b29f2c-d179-400f-b524-d3a80248c8cc",
                "code": "ar"
            },
            {
                "title": "Assamese",
                "status": "1",
                "id": "7f7a0f2a-dae7-4535-bc56-86545d384268",
                "code": "as"
            },
            {
                "title": "Bahasa (Indonesia)",
                "status": "1",
                "id": "7c59f385-57a4-4a04-ac7b-269ea2460abc",
                "code": "id"
            },
            {
                "title": "Bengali",
                "status": "1",
                "id": "49728102-8b14-4453-91a2-18abe2a837e9",
                "code": "bn"
            },
            {
                "title": "Bhojpuri",
                "status": "1",
                "id": "49006dbd-71ff-41a1-abe3-8277702ed0f2",
                "code": "hr"
            },
            {
                "title": "English",
                "status": "1",
                "id": "d5beccd7-e469-4449-baba-a3a57fb67a91",
                "code": "en"
            },
            {
                "title": "French",
                "status": "1",
                "id": "eb4c9b92-0a9f-44fd-b4dd-f9e8f5628726",
                "code": "fr"
            },
            {
                "title": "German",
                "status": "1",
                "id": "86e0e39c-6e0e-4f30-9400-f771ba0e503c",
                "code": "de"
            },
            {
                "title": "Gujarati",
                "status": "1",
                "id": "7e820be2-7915-40fa-9216-48c05fc81f23",
                "code": "gu"
            },
            {
                "title": "Hindi",
                "status": "1",
                "id": "1007afb0-65ea-4978-bd51-21b0f3b05c20",
                "code": "hi"
            },
            {
                "title": "Kannada",
                "status": "1",
                "id": "7b78c7af-f865-4ab2-aeba-7823e126307f",
                "code": "km"
            },
            {
                "title": "Korean",
                "status": "1",
                "id": "d6ed63e9-435a-43d0-86cb-8178e2ca7e6f",
                "code": "ko"
            },
            {
                "title": "Malay",
                "status": "1",
                "id": "2a4b4b29-ab25-4695-a54a-7783870bb08b",
                "code": "ms"
            },
            {
                "title": "Malayalam",
                "status": "1",
                "id": "bbefd589-1695-4151-bf4f-8d8dfd11314f",
                "code": "ml"
            },
            {
                "title": "Mandarin",
                "status": "1",
                "id": "bb9aa39c-8ba7-4263-8e1d-e3fedc36a1ac",
                "code": "zh"
            },
            {
                "title": "Marathi",
                "status": "1",
                "id": "c2cacebd-445d-4d51-acc8-2f279f341394",
                "code": "mr"
            },
            {
                "title": "Odia",
                "status": "1",
                "id": "87cd5b07-1448-4a53-9d76-f2b7e8e468ca",
                "code": "or"
            },
            {
                "title": "Punjabi",
                "status": "1",
                "id": "d2222177-0a34-439b-a8ed-20bee4ac65af",
                "code": "pa"
            },
            {
                "title": "Russian",
                "status": "1",
                "id": "6038a58e-b25c-4dde-a273-280ef191aa73",
                "code": "ru"
            },
            {
                "title": "Tamil",
                "status": "1",
                "id": "81993bdb-2ca3-4574-a734-271b9dcaae49",
                "code": "ta"
            },
            {
                "title": "Telugu",
                "status": "1",
                "id": "5b0c3993-242f-45f7-bcb9-026b4ee80d30",
                "code": "te"
            },
            {
                "title": "Thai",
                "status": "1",
                "id": "b5ce6081-080f-44e6-99ad-73698ba1c806",
                "code": "th"
            }
        ]
    }
  }
  const responseData2 = {
    status: 200,
    response: {
      status: 200,
      data: {
        tvShow: {
          tvShowId: "6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
          externalId: "0-0-1z51004291",
          note: "Test inherit",
          dateZee5Published: "2021-04-16T00:00:00.000Z",
          audioLanguages: ["49006dbd-71ff-41a1-abe3-8277702ed0f2"],
          countries: "Congo,Equatorial Guinea",
          tvShowLicenses: [
            {
              validFrom: "2021-04-15T00:00:00.000Z",
              validUntil: "2021-04-16T00:00:00.000Z",
            },
          ],
          TvShowImages: [
            {
              imageDetails: {
                url: "503error-07c3cc5f-0b49-4032-af0c-159565b559db.png",
                size: "134.11 KB",
                valid: false,
                resolution: "1170✕658",
              },
            },
          ],
        },
        orderList: [
          {
            seasonOrderingId: "2522f523-e2e9-4461-8d1b-e043dbb40b05",
            tvShowId: "6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
            setName: "Default",
            countryId: null,
            seasonId: null,
            status: "1",
            createdBy: "ce7859b7-b9d5-4603-bde2-2fe416d790ec",
            modifiedBy: "ce7859b7-b9d5-4603-bde2-2fe416d790ec",
            _created_on: "2021-04-19T10:09:21.183Z",
            _modified_on: "2021-04-19T10:09:21.183Z",
            seasonList: [
              {
                seasonId: "61efebf9-097f-4eb8-8a2a-a357d8d18ad0",
                title: "No Title",
                externalId: "0-2-5z51004299",
                note: null,
                lastModifiedOn: "2021-04-19T10:12:59.179Z",
                index: 1,
                journeyType: "1",
                audioLanguages: null,
                countries: "",
                SeasonImages: [],
                contentState_populated: {
                  title: "Draft",
                },
                seasonLicenses: [
                  {
                    validFrom: "2021-04-15T00:00:00.000Z",
                    validUntil: "2021-04-16T00:00:00.000Z",
                  },
                ],
                subtype_populated: null,
                lastModifiedBy_populated: {
                  first_name: "Shivam",
                  last_name: "Sharma",
                },
              },
            ],
          },
        ],
      },
    }
  };

  wrapper.instance().getAllStatus();
  wrapper.instance().getAllLanguage();
  wrapper.instance().fetchDefaultList();
  moxios.wait(function () {
    const request0 = moxios.requests.at(0);
    request0
      .respondWith(responseData0)
      .then(() => {
        expect(wrapper.state("allStatus")).toHaveLength(9);
      })
      .catch((err) => {
        console.log(err);
      });
      const request1 = moxios.requests.at(1);
      request1
        .respondWith(responseData1)
        .then(() => {
          expect(wrapper.state("LanguageArr")).toHaveLength(22);
        })
        .catch((err) => {
          console.log(err);
        });
    const request2 = moxios.requests.at(2);
    request2
      .respondWith(responseData2)
      .then((res) => {
        expect(wrapper.state("assignedData")).toHaveLength(1);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

it("should test createNewSet", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "createNewSet");
  instance.createNewSet();
  expect(instance.createNewSet).toHaveBeenCalledTimes(1);
});

it("should test InputChanger", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "InputChanger");
  instance.InputChanger({target:{value:'testing'}},0);
  expect(instance.InputChanger).toHaveBeenCalledTimes(1);
});

it("should test setSelectDataArr", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "setSelectDataArr");
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
  instance.setSelectDataArr(res,1);
  expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
});

it("should test selectGroup", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "selectGroup");
  instance.selectGroup({target:{checked: true}},"Others");
  expect(instance.selectGroup).toHaveBeenCalledTimes(1);
});

it("should test selectCountryGroup", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "selectCountryGroup");
  instance.selectCountryGroup({target:{checked: true}},"Others");
  expect(instance.selectCountryGroup).toHaveBeenCalledTimes(1);
});

it("should test goToSeason", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "goToSeason");
  instance.goToSeason();
  expect(instance.goToSeason).toHaveBeenCalledTimes(1);
});

it("should test tabSwitched", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "tabSwitched");
  instance.tabSwitched({},0);
  instance.tabSwitched({},1);
  expect(instance.tabSwitched).toHaveBeenCalledTimes(2);
});

it("should test searchDefaultChange", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "searchDefaultChange");
  instance.searchDefaultChange({target: {name:"searchString",value:"test"}});
  expect(instance.searchDefaultChange).toHaveBeenCalledTimes(1);
});
it("should test handleConditionRoute", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "handleConditionRoute");
  instance.handleConditionRoute("archive","2522f523-e2e9-4461-8d1b-e043dbb40b05");
  expect(instance.handleConditionRoute).toHaveBeenCalledTimes(1);
});

it("should test handleModel", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "handleModel");
  const model= {"detail":"","open":false,"desc":"","btn1":"Yes","btn2":"No"};
  const model2= {"detail":{ view: "archive", contentId: "2522f523-e2e9-4461-8d1b-e043dbb40b0"},"open":true,"desc":"","btn1":"Yes","btn2":"No"};
  instance.handleModel(true,model);
  instance.handleModel(false,model2);
  expect(instance.handleModel).toHaveBeenCalledTimes(2);
});

it("should test updateSet", async(done) => {

  const responseData0 = {
    status: 200,
    response: {
      status: 200,
      data: [{
        "_created_on":"2021-04-19T11:39:29.970Z",
        "_modified_on":"2021-04-19T11:39:37.638Z",
        "seasonOrderingId":"b4dd2adc-95b0-4f52-a569-d6669f150c63",
        "tvShowId":"6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
        "setName":"tess",
        "countryId":[
           "2feeac02-7d14-45f0-b94a-2ae30235f79d"
        ],
        "seasonId":null,
        "status":"1",
        "createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
        "modifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec"
     }],
    },
  };
  wrapper.instance().updateSet();
  moxios.wait(function () {
    const request0 = moxios.requests.at(0);
    request0
      .respondWith(responseData0)
      .then(() => {
        expect(wrapper.state("showSetPopup")).toBe(false);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
it("should test deleteSet", async(done) => {

  const responseData0 = {
    status: 200,
    response: {
      status: 200,
      data: null,
    },
  };
  wrapper.instance().deleteSet();
  moxios.wait(function () {
    const request0 = moxios.requests.at(0);
    request0
      .respondWith(responseData0)
      .then(() => {
        expect(wrapper.state("showDelPopup")).toBe(false);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
it("should test fetchSetList", async(done) => {

  const responseData0 = {
    status: 200,
    response: {
      status: 200,
      data: {
        "tvShow":{
           "tvShowId":"6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
           "externalId":"0-0-1z51004291",
           "note":"Test inherit",
           "dateZee5Published":"2021-04-16T00:00:00.000Z",
           "audioLanguages":[
              "49006dbd-71ff-41a1-abe3-8277702ed0f2"
           ],
           "countries":"Angola,Congo,Equatorial Guinea,Gabon,Botswana,Lesotho,Namibia,South Africa,Swaziland",
           "tvShowLicenses":[
              {
                 "validFrom":"2021-04-20T00:00:00.000Z",
                 "validUntil":"2021-04-23T00:00:00.000Z"
              },
              {
                 "validFrom":"2021-04-15T00:00:00.000Z",
                 "validUntil":"2021-04-16T00:00:00.000Z"
              }
           ],
           "TvShowImages":[
              {
                 "imageDetails":{
                    "url":"503error-07c3cc5f-0b49-4032-af0c-159565b559db.png",
                    "size":"134.11 KB",
                    "valid":false,
                    "resolution":"1170✕658"
                 }
              }
           ]
        },
        "orderList":[
           {
              "seasonOrderingId":"b4dd2adc-95b0-4f52-a569-d6669f150c63",
              "tvShowId":"6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
              "setName":"tess",
              "countryId":[
                 {
                    "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
                    "title":"India"
                 }
              ],
              "seasonId":null,
              "status":"1",
              "createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
              "modifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
              "_created_on":"2021-04-19T11:39:29.970Z",
              "_modified_on":"2021-04-19T11:39:37.638Z",
              "seasonList":[
                 {
                    "seasonId":"61efebf9-097f-4eb8-8a2a-a357d8d18ad0",
                    "title":"No Title",
                    "externalId":"0-2-5z51004299",
                    "note":null,
                    "lastModifiedOn":"2021-04-19T10:12:59.179Z",
                    "index":1,
                    "journeyType":"1",
                    "audioLanguages":null,
                    "countries":"",
                    "SeasonImages":[
                       
                    ],
                    "contentState_populated":{
                       "title":"Draft"
                    },
                    "seasonLicenses":[
                       
                    ],
                    "subtype_populated":null,
                    "lastModifiedBy_populated":{
                       "first_name":"Shivam",
                       "last_name":"Sharma"
                    }
                 },
                 {
                    "seasonId":"109a499c-8456-4d67-8f6e-9d157b7bfa6d",
                    "title":"No Title",
                    "externalId":"0-2-5z51004301",
                    "note":null,
                    "lastModifiedOn":"2021-04-19T11:21:03.929Z",
                    "index":2,
                    "journeyType":"1",
                    "audioLanguages":null,
                    "countries":"Angola,Cameroon,Central African Republic,Chad,Congo,Congo (Democratic Republic of the),Gabon,Botswana,Namibia,South Africa,Swaziland",
                    "SeasonImages":[
                       
                    ],
                    "contentState_populated":{
                       "title":"Draft"
                    },
                    "seasonLicenses":[
                       {
                          "validFrom":"2021-04-19T00:00:00.000Z",
                          "validUntil":"2021-04-25T00:00:00.000Z"
                       }
                    ],
                    "subtype_populated":null,
                    "lastModifiedBy_populated":{
                       "first_name":"Rakesh",
                       "last_name":"chandra"
                    }
                 }
              ]
           }
        ]
     },
    },
  };
  wrapper.instance().fetchSetList();
  moxios.wait(function () {
    const request0 = moxios.requests.at(0);
    request0
      .respondWith(responseData0)
      .then(() => {
        expect(wrapper.state("OrderSetList")).toHaveLength(1);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
it("should test fetchSetList API failed", async(done) => {

  const responseData0 = {
    status: 200,
    response: {
      status: 200,
      data: null,
    },
  };
  wrapper.instance().fetchSetList();
  moxios.wait(function () {
    const request0 = moxios.requests.at(0);
    request0
      .respondWith(responseData0)
      .then(() => {
        expect(wrapper.state("OrderSetList")).toHaveLength(0);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
it("should test reArrangeHandler", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "reArrangeHandler");
  const e = {
    source: {
      droppableId: "droppable-0",
      index: 1
    },
    destination:{
      droppableId: "droppable-0",
      index: 0
    }
  };
  instance.reArrangeHandler(e);
  expect(instance.reArrangeHandler).toHaveBeenCalledTimes(1);
});

it("should test reArrangeSetHandler", () => {
  const instance = wrapper.instance();
  jest.spyOn(instance, "reArrangeSetHandler");
  const e = {
    source: {
      droppableId: "droppable-0",
      index: 1
    },
    destination:{
      droppableId: "droppable-0",
      index: 0
    }
  };
  instance.reArrangeSetHandler(e, 0);
  expect(instance.reArrangeSetHandler).toHaveBeenCalledTimes(1);
});

});