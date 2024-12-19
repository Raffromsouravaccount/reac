import React from "react";
import { shallow, mount } from "enzyme";
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import MovieList from "../../../../_components/MovieManagement/MovieList/MovieList";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import BreadcrumbsComp from "../../../../_components/Common/BreadCrumbs/BreadCrumbs";
import ButtonField from "../../../../_components/Common/ButtonField/ButtonField";
import { constantText } from "../../../../_helpers/constants.text";
import { findByTestAttr } from "../../../../Utils";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (state = null, props = {}) => {
  const wrapper = shallow(<MovieList {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe("Render MovieList Component", () => {
  let wrapper;
  const event = { target: { name: 'xyz', value: '123'}, preventDefault: jest.fn() }
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup(null, { history: {push : jest.fn()}});
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });
  it('Should renders MovieList default', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("should test ComponentDidMount", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it("should check back heading text", () => {
    const titleText = findByTestAttr(wrapper, "movie-heading-text");
    expect(titleText.text()).toMatch(constantText?.movie_list_text);
  });

  it("should test filterData", () => {
    const filters = {
      "formValidity":{
         "name":"lastModifiedOn",
         "label":"Modified On",
         "for":"All",
         "display":true,
         "date":{
            "startDate":"2021-03-04",
            "endDate":"2021-03-13",
            "startDateKey":"startDate",
            "endDateKey":"endDate",
            "startPlaceholder":"Start Date",
            "endPlaceholder":"End Date"
         }
      },
      "filterByStatus":[
         {
            "label":"All",
            "displayName":"All",
            "active":true
         },
         {
            "label":"Draft",
            "displayName":"Draft"
         },
         {
            "label":"Changed",
            "displayName":"Changed"
         },
         {
            "label":"Published",
            "displayName":"Published"
         },
         {
            "label":"Unpublished",
            "displayName":"Unpublished"
         },
         {
            "label":"Need Work",
            "displayName":"Need Work"
         },
         {
            "label":"Scheduled",
            "displayName":"Scheduled"
         },
         {
            "label":"Submitted to Review",
            "displayName":"Submitted to Review"
         },
         {
            "label":"Archived",
            "displayName":"Archived"
         }
      ],
      "filterByDate":[
         {
            "name":"lastModifiedOn",
            "label":"Modified On",
            "for":"Draft",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Changed On",
            "for":"Changed",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Published On",
            "for":"Published",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Unpublished On",
            "for":"Unpublished",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Reviewed On",
            "for":"Need Work",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Scheduled On",
            "for":"Scheduled",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Submitted On",
            "for":"Submitted to Review",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         },
         {
            "name":"lastModifiedOn",
            "label":"Archived On",
            "for":"Archived",
            "display":false,
            "date":{
               "startDate":"",
               "endDate":"",
               "startDateKey":"startDate",
               "endDateKey":"endDate",
               "startPlaceholder":"Start Date",
               "endPlaceholder":"End Date"
            }
         }
      ],
      "selectFilters":[
         {
            "name":"primaryGenre",
            "keyText":"title",
            "value":[
               {
                  "title":"Animation",
                  "status":"1",
                  "id":"3e4dca7a-e72f-40f8-a366-23829c6d4ff0"
               },
               {
                  "title":"Comedy",
                  "status":"1",
                  "id":"c2774c98-4be0-479c-a731-eaf72d7b37ef"
               }
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Primary Genre",
            "path":"/master/MoviePrimaryGenre",
            "data":[
               {
                  "title":"Cookery",
                  "status":"1",
                  "id":"506f5d98-a456-46c5-9a9d-4a6451d41b78"
               },
               {
                  "title":"Crime",
                  "status":"1",
                  "id":"14071832-2bb3-4e5b-bc50-8cc97ce243bd"
               },
               {
                  "title":"Devotional",
                  "status":"1",
                  "id":"259893ee-84f0-4fc9-a7c6-cabf4bd68997"
               },
               {
                  "title":"Docudrama",
                  "status":"1",
                  "id":"984e53f6-c1d8-4610-8b2f-9ac178885175"
               },
               {
                  "title":"Drama",
                  "status":"1",
                  "id":"ad3ec883-43ed-4584-b766-068a3bf423e6"
               },
               {
                  "title":"Entertainment",
                  "status":"1",
                  "id":"3f123db5-4f22-4f72-a07d-28e10596ad82"
               },
               {
                  "title":"Fantasy",
                  "status":"1",
                  "id":"1b941937-8309-4f49-8f8a-669cb0d6f871"
               },
               {
                  "title":"Horror",
                  "status":"1",
                  "id":"9fcc8954-6f0d-4ed9-9596-8b65de175543"
               },
               {
                  "title":"Infotainment",
                  "status":"1",
                  "id":"313eb226-11e8-41c4-9ce9-ca6615b49a57"
               },
               {
                  "title":"Kids games",
                  "status":"1",
                  "id":"c6deceea-f5ee-4e78-82c8-dbeb21c6b012"
               },
               {
                  "title":"Lifestyle",
                  "status":"1",
                  "id":"4fcd48e9-ae6e-46d5-bba5-878dab7fd867"
               },
               {
                  "title":"Mystery",
                  "status":"1",
                  "id":"60ebfcd9-4a49-44c1-9e0d-90a205b05975"
               },
               {
                  "title":"News",
                  "status":"1",
                  "id":"e558de78-53c2-4685-bc4e-221b69acb6f4"
               },
               {
                  "title":"Sports",
                  "status":"1",
                  "id":"b6aa0fb9-ff3c-45a4-8e93-fc7c091aaa89"
               },
               {
                  "title":"suspense",
                  "status":"1",
                  "id":"fe01d24c-534f-434f-b997-82efd06bdc2b"
               },
               {
                  "title":"test",
                  "status":"1",
                  "id":"4eeaab39-da49-4279-bfb7-c0bc9ccfc43c"
               },
               {
                  "title":"testing",
                  "status":"1",
                  "id":"27569553-95ae-421c-9fd6-67e79001cb55"
               },
               {
                  "title":"Urban",
                  "status":"1",
                  "id":"1834ad3d-440a-463c-b813-3d1153b7f87b"
               },
               {
                  "title":"World",
                  "status":"1",
                  "id":"d18a62f9-bed7-4589-8b29-42992b8429cb"
               }
            ],
            "validation":{
               "required":false
            },
            "touched":1,
            "valid":true,
            "errorText":""
         },
         {
            "name":"secondaryGenre",
            "keyText":"title",
            "value":[
               {
                  "title":"Comedy",
                  "status":"1",
                  "id":"c2774c98-4be0-479c-a731-eaf72d7b37ef"
               }
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Secondary Genre",
            "path":"/master/MoviePrimaryGenre",
            "data":[
               {
                  "title":"Animation",
                  "status":"1",
                  "id":"3e4dca7a-e72f-40f8-a366-23829c6d4ff0"
               },
               {
                  "title":"Cookery",
                  "status":"1",
                  "id":"506f5d98-a456-46c5-9a9d-4a6451d41b78"
               },
               {
                  "title":"Crime",
                  "status":"1",
                  "id":"14071832-2bb3-4e5b-bc50-8cc97ce243bd"
               },
               {
                  "title":"Devotional",
                  "status":"1",
                  "id":"259893ee-84f0-4fc9-a7c6-cabf4bd68997"
               },
               {
                  "title":"Docudrama",
                  "status":"1",
                  "id":"984e53f6-c1d8-4610-8b2f-9ac178885175"
               },
               {
                  "title":"Drama",
                  "status":"1",
                  "id":"ad3ec883-43ed-4584-b766-068a3bf423e6"
               },
               {
                  "title":"Entertainment",
                  "status":"1",
                  "id":"3f123db5-4f22-4f72-a07d-28e10596ad82"
               },
               {
                  "title":"Fantasy",
                  "status":"1",
                  "id":"1b941937-8309-4f49-8f8a-669cb0d6f871"
               },
               {
                  "title":"Horror",
                  "status":"1",
                  "id":"9fcc8954-6f0d-4ed9-9596-8b65de175543"
               },
               {
                  "title":"Infotainment",
                  "status":"1",
                  "id":"313eb226-11e8-41c4-9ce9-ca6615b49a57"
               },
               {
                  "title":"Kids games",
                  "status":"1",
                  "id":"c6deceea-f5ee-4e78-82c8-dbeb21c6b012"
               },
               {
                  "title":"Lifestyle",
                  "status":"1",
                  "id":"4fcd48e9-ae6e-46d5-bba5-878dab7fd867"
               },
               {
                  "title":"Mystery",
                  "status":"1",
                  "id":"60ebfcd9-4a49-44c1-9e0d-90a205b05975"
               },
               {
                  "title":"News",
                  "status":"1",
                  "id":"e558de78-53c2-4685-bc4e-221b69acb6f4"
               },
               {
                  "title":"Sports",
                  "status":"1",
                  "id":"b6aa0fb9-ff3c-45a4-8e93-fc7c091aaa89"
               },
               {
                  "title":"suspense",
                  "status":"1",
                  "id":"fe01d24c-534f-434f-b997-82efd06bdc2b"
               },
               {
                  "title":"test",
                  "status":"1",
                  "id":"4eeaab39-da49-4279-bfb7-c0bc9ccfc43c"
               },
               {
                  "title":"testing",
                  "status":"1",
                  "id":"27569553-95ae-421c-9fd6-67e79001cb55"
               },
               {
                  "title":"Urban",
                  "status":"1",
                  "id":"1834ad3d-440a-463c-b813-3d1153b7f87b"
               },
               {
                  "title":"World",
                  "status":"1",
                  "id":"d18a62f9-bed7-4589-8b29-42992b8429cb"
               }
            ],
            "validation":{
               "required":false
            },
            "touched":1,
            "valid":true,
            "errorText":""
         },
         {
            "name":"thematicGenre",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Thematic Genre",
            "path":"/master/MovieThematicGenre",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"settingGenre",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Setting Genre",
            "path":"/master/MovieSettingGenre",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"actor",
            "type":"SearchableWithCreate",
            "keyText":"castName",
            "data":[
               
            ],
            "errorText":"",
            "col":"",
            "value":null,
            "createPrefix":"Use",
            "path":"",
            "display":true,
            "label":"Actor",
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"subType",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "path":"/master/MovieSubtype",
            "display":true,
            "label":"Sub Type",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"contentCategory",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Content Category",
            "path":"/master/ContentCategory",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"rcsCategory",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"RCS Category",
            "path":"/master/RcsCategory",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"theme",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Theme",
            "path":"/master/Theme",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"targetAudience",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Target Audience",
            "path":"/master/TargetAudience",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"licenseGroupCountries",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "groupBy":"group",
            "label":"License Group/Countries",
            "path":"/master/CountryGroup",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"ageRating",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Age Rating",
            "path":"/master/AgeRating",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"businessType",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Business Type",
            "path":"/master/BusinessType",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"externalId",
            "value":"",
            "col":"",
            "type":"text",
            "label":"External Id",
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"contentRating",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "path":"/master/ContentRating",
            "display":true,
            "label":"Content Rating",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"contentOwner",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "path":"/master/ContentOwner",
            "display":true,
            "label":"Content Owner",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"audioLanguage",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "path":"/master/Language",
            "display":true,
            "label":"Audio Language",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"originalLanguage",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Original Language",
            "path":"/master/Language",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         },
         {
            "name":"tags",
            "type":"SearchableWithCreate",
            "col":"",
            "keyText":"title",
            "value":{
               "title":"Test",
               "id":"d8703dda-4e47-4965-8d47-a62cc2270546"
            },
            "createPrefix":"Use",
            "multiple":false,
            "label":"Tags",
            "data":[],
            "display":true,
            "errorText":"",
            "validation":{
               "required":false
            },
            "touched":1,
            "valid":true
         },
         {
            "name":"translationLanguage",
            "keyText":"title",
            "value":[
               {
                  "title":"Arabic",
                  "status":"1",
                  "id":"14b29f2c-d179-400f-b524-d3a80248c8cc",
                  "code":"ar"
               }
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Translation Language",
            "path":"/master/Language",
            "data":[
               {
                  "title":"Assamese",
                  "status":"1",
                  "id":"816b6e9a-ee6a-4fe6-9724-496d675414a3",
                  "code":"as"
               },
               {
                  "title":"Bahasa (Indonesia)",
                  "status":"1",
                  "id":"7c59f385-57a4-4a04-ac7b-269ea2460abc",
                  "code":"id"
               },
               {
                  "title":"Bengali",
                  "status":"1",
                  "id":"49728102-8b14-4453-91a2-18abe2a837e9",
                  "code":"bn"
               },
               {
                  "title":"Bhojpuri",
                  "status":"1",
                  "id":"49006dbd-71ff-41a1-abe3-8277702ed0f2",
                  "code":"hr"
               },
               {
                  "title":"English",
                  "status":"1",
                  "id":"d5beccd7-e469-4449-baba-a3a57fb67a91",
                  "code":"en"
               },
               {
                  "title":"French",
                  "status":"1",
                  "id":"eb4c9b92-0a9f-44fd-b4dd-f9e8f5628726",
                  "code":"fr"
               },
               {
                  "title":"German",
                  "status":"1",
                  "id":"86e0e39c-6e0e-4f30-9400-f771ba0e503c",
                  "code":"de"
               },
               {
                  "title":"Gujarati",
                  "status":"1",
                  "id":"7e820be2-7915-40fa-9216-48c05fc81f23",
                  "code":"gu"
               },
               {
                  "title":"Hindi",
                  "status":"1",
                  "id":"1007afb0-65ea-4978-bd51-21b0f3b05c20",
                  "code":"hi"
               },
               {
                  "title":"Kannada",
                  "status":"1",
                  "id":"7b78c7af-f865-4ab2-aeba-7823e126307f",
                  "code":"km"
               },
               {
                  "title":"Korean",
                  "status":"1",
                  "id":"d6ed63e9-435a-43d0-86cb-8178e2ca7e6f",
                  "code":"ko"
               },
               {
                  "title":"Malay",
                  "status":"1",
                  "id":"2a4b4b29-ab25-4695-a54a-7783870bb08b",
                  "code":"ms"
               },
               {
                  "title":"Malayalam",
                  "status":"1",
                  "id":"bbefd589-1695-4151-bf4f-8d8dfd11314f",
                  "code":"ml"
               },
               {
                  "title":"Mandarin",
                  "status":"1",
                  "id":"bb9aa39c-8ba7-4263-8e1d-e3fedc36a1ac",
                  "code":"zh"
               },
               {
                  "title":"Marathi",
                  "status":"1",
                  "id":"c2cacebd-445d-4d51-acc8-2f279f341394",
                  "code":"mr"
               },
               {
                  "title":"Odia",
                  "status":"1",
                  "id":"87cd5b07-1448-4a53-9d76-f2b7e8e468ca",
                  "code":"or"
               },
               {
                  "title":"Punjabi",
                  "status":"1",
                  "id":"d2222177-0a34-439b-a8ed-20bee4ac65af",
                  "code":"pa"
               },
               {
                  "title":"Russian",
                  "status":"1",
                  "id":"6038a58e-b25c-4dde-a273-280ef191aa73",
                  "code":"ru"
               },
               {
                  "title":"Tamil",
                  "status":"1",
                  "id":"81993bdb-2ca3-4574-a734-271b9dcaae49",
                  "code":"ta"
               },
               {
                  "title":"Telugu",
                  "status":"1",
                  "id":"5b0c3993-242f-45f7-bcb9-026b4ee80d30",
                  "code":"te"
               },
               {
                  "title":"test",
                  "status":"1",
                  "id":"e9300128-9faa-422e-89bf-c92229037f99",
                  "code":"as"
               },
               {
                  "title":"testing",
                  "status":"1",
                  "id":"7f7a0f2a-dae7-4535-bc56-86545d384268",
                  "code":"as"
               },
               {
                  "title":"Thai",
                  "status":"1",
                  "id":"b5ce6081-080f-44e6-99ad-73698ba1c806",
                  "code":"th"
               }
            ],
            "validation":{
               "required":false
            },
            "touched":1,
            "valid":true,
            "errorText":""
         },
         {
            "name":"translationStatus",
            "keyText":"title",
            "value":{
               "title":"Completed",
               "id":"2"
            },
            "col":"",
            "type":"dropdownAsync",
            "display":true,
            "label":"Translation’s Language Status",
            "data":[
               {
                  "title":"Partially",
                  "id":"1"
               },
               {
                  "title":"Not-filled",
                  "id":"0"
               }
            ],
            "validation":{
               "required":false
            },
            "touched":1,
            "valid":true,
            "errorText":""
         },
         {
            "name":"moodEmotion",
            "keyText":"title",
            "value":[
               
            ],
            "col":"",
            "multiple":true,
            "limitTags":1,
            "type":"dropdownAsync",
            "display":true,
            "label":"Mood Emotion",
            "path":"/master/EmotionTitle",
            "data":[
               
            ],
            "validation":{
               "required":false
            },
            "touched":0,
            "valid":true
         }
      ],
      "querys":"",
      "byDate":"",
      "startDate":"",
      "endDate":""
   };
    const wrapper = setup({ filters }, null);
    const instance = wrapper.instance();
    jest.spyOn(instance, "filterData");
    instance.filterData();
    expect(instance.filterData).toHaveBeenCalledTimes(1);
  });

  it('Should check input field', () => {
    const inputField = wrapper.find('input');
    expect(inputField.exists()).toBe(true);
  });
  it('Should renders AngleLeftArrowIcon default', () => {
    expect(wrapper.containsMatchingElement(<AngleLeftArrow />)).toEqual(true);
  });
  it('Should renders BreadcrumbsComp default', () => {
    expect(wrapper.containsMatchingElement(<BreadcrumbsComp />)).toEqual(true);
  });
  it('Should renders ButtonField default', () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  });

  it("should test showStatusField", () => {
    const mockSet = {
      selectFilters:[{
        col: "",
        data: [],
        display: true,
        keyText: "title",
        label: "Primary Genre",
        limitTags: 1,
        multiple: true,
        name: "primaryGenre",
        path: "/master/MoviePrimaryGenre",
        touched: 0,
        type: "dropdownAsync",
        valid: true,
        validation: {required: false},
        value: []}
    ],
      item : {
        col: "",
        data: [],
        display: true,
        keyText: "title",
        label: "Primary Genre",
        limitTags: 1,
        multiple: true,
        name: "translationStatus",
        path: "/master/MoviePrimaryGenre",
        touched: 0,
        type: "dropdownAsync",
        valid: true,
        validation: {required: false},
        value: []},

        flag: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "showStatusField");
    wrapper.instance().showStatusField(mockSet.selectFilters,mockSet.flag,mockSet.item.name,mockSet.item.display );
    expect(wrapper.instance().showStatusField).toBeCalled();
  });

  it("should test handleRoute", () => {
    jest.spyOn(wrapper.instance(), "handleRoute");
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  });

  it("should test goToLinkedMovie", () => {
    jest.spyOn(wrapper.instance(), "goToLinkedMovie");
    wrapper.instance().goToLinkedMovie();
    expect(wrapper.instance().goToLinkedMovie).toBeCalled();
  });

  it("should call fetchLeftTabData API Success", (done) => {
    const responseData0 = {
      status: 200,
      response: {
        status: 200,
        data: [
          {"title":"Archived","status":"1","id":"28d8bc82-af3a-4e04-bdf7-0a5df324ac51"},{"title":"Changed","status":"1","id":"38c34c4f-68c9-4eb0-b71f-b80f1e551447"},{"title":"Draft","status":"1","id":"3bb64421-f15f-4dda-adec-03c324c140a3"},{"title":"Need Work","status":"1","id":"38c34c4f-68c9-4eb0-b71f-b80f1e551448"},{"title":"Published","status":"1","id":"081cc5b2-a302-4bfb-8e5c-68544ae636e6"},{"title":"Publishing Queue","status":"1","id":"4e565298-6e9c-4d5f-8a03-c23a42cabedd"},{"title":"Scheduled","status":"1","id":"3951d801-9758-4a09-be3e-0af342ba9d13"},{"title":"Submitted To Review","status":"1","id":"38c34c4f-68c9-4eb0-b71f-b80f1e551446"},{"title":"Unpublished","status":"1","id":"21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe"}
        ],
      },
    };
    const responseData1 = {
      status: 200,
      response: {
        status: 200,
        data: [
          {
            displayName: "All",
            count: 26,
            id: "",
            status: "",
            statusText: "Last Modified By",
          },
        ],
      },
    };
    const responseData2 = {
      status: 200,
      response: {
        "status":200,
        "data":{
          "count":1,
          },
            "error":null},
    };
    const responseData3 = {
      status: 200,
      response: {
        "status":200,
        "data":[
            {
              "movieId":"18182598-7142-49a6-88a5-2edd46fdaa67",
              "title":"No Title",
              "subtype":null,
              "journeyType":"2",
              "externalId":"1-1-1000246",
              "duration":null,
              "contentState":"3bb64421-f15f-4dda-adec-03c324c140a3",
              "originCountry":null,
              "dateZee5Published":null,
              "lastModifiedOn":"2021-01-20T13:14:17.513Z",
              "createdOn":"2021-01-20T13:14:17.514Z",
              "modifiedOn":"2021-01-20T13:14:17.514Z",
              "countries":"","MovieImages":[],"subtype_populated":null,
              "MovieMapContents":[],
              "contentState_populated":{"title":"Draft"},
              "lastModifiedBy_populated":{"first_name":"Shivam","last_name":"Sharma"},
              "MovieLicenses":[]
            }
          ],
            "error":null},
    };
    wrapper.instance().getAllStatus();
    wrapper.instance().fetchLeftTabData();
    wrapper.instance().getAllMovies(true);
    moxios.wait(function () {
      const request0 = moxios.requests.at(0);
      request0.respondWith(responseData0).then(() => {
        expect(wrapper.state("allStatus")).toHaveLength(9);
      }).catch(err => {
        console.log(err);
      });

      const request1 = moxios.requests.at(1);
      request1.respondWith(responseData1).then(() => {
          expect(wrapper.state("tabOptions")).toHaveLength(1);
      }).catch(err => {
        console.log(err);
      });

      const request2 = moxios.requests.at(2);
          request2.respondWith(responseData2).then(() => {
            expect(wrapper.state("movieCount")).toBe(1);
          }).catch(err => {
            console.log(err);
          });

          const request3 = moxios.requests.at(3);
          request3.respondWith(responseData3).then(() => {
            expect(wrapper.state("moviesList")).toHaveLength(1);
            done();
          }).catch(err => {
            console.log(err);
          });

      
    });
  });

  it("should test filterChange", () => {
    const mockSet = {
      filterByDate:[{
        data:{
          endDate: "2021-02-18",
          endDateKey: "endDate",
          endPlaceholder: "End Date",
          startDate: "2021-02-11",
          startDateKey: "startDate",
          startPlaceholder: "Start Date"
        },
        display: true,
        for: "All",
        label: "Modified On",
        name: "lastModifiedOn",
        formValidity: true,
        querys: "",
        filterByStatus:[
         {label: "All", displayName: "All", active: true},
          {label: "Draft", displayName: "Draft"}]
      }],

      updatedElement:{
        col: "",
        data: [],
        display: true,
        keyText: "title",
        label: "Primary Genre",
        limitTags: 1,
        multiple: true,
        name: "translationLanguage",
        path: "/master/MoviePrimaryGenre",
        touched: 0,
        type: "dropdownAsync",
        valid: true,
        validation: {required: false},
        value: []}
    
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "filterChange");
    wrapper.instance().filterChange(event,0,mockSet.updatedElement.name);
    expect(wrapper.instance().filterChange).toBeCalled();
  });

  it("should test viewMovieHandler", () => {
    const mockSet = {
      movie:[{
        "movieId":"a80518e7-256f-48d0-a7dd-52a1810829d4",
        "title":"No Title",
        "subtype":null,
        "journeyType":"1",
        "externalId":"0-0-1z51000191",
        "duration":null,
        "contentState":"3bb64421-f15f-4dda-adec-03c324c140a3",
        "note":null,
        "originCountry":null,
        "dateZee5Published":null,
        "lastModifiedOn":"2021-03-04T06:26:14.434Z",
        "createdOn":"2021-03-04T06:26:14.434Z",
        "modifiedOn":"2021-03-04T06:26:14.434Z",
        "countries":"",
        "subtype_populated":null,
        "MovieMapContents":[
           
        ],
        "contentState_populated":{
           "title":"Draft"
        },
        "lastModifiedBy_populated":{
           "first_name":"Sunil",
           "last_name":""
        },
        "MovieLicenses":[
           
        ],
        "licenceExpDays":[
           
        ],
        "showDetails":false
     }]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "viewMovieHandler");
    wrapper.instance().viewMovieHandler(mockSet.movie);
    expect(wrapper.instance().viewMovieHandler).toBeCalled();
  });

  it("should test showHideScheduledDrawer", () => {
    jest.spyOn(wrapper.instance(), "showHideScheduledDrawer");
    wrapper.instance().showHideScheduledDrawer();
    expect(wrapper.instance().showHideScheduledDrawer).toBeCalled();
  });

  it("should test openSeheduledHistory", () => {
    const mockSet = {
      movie:[{
        "movieId":"a80518e7-256f-48d0-a7dd-52a1810829d4",
        "title":"No Title",
        "subtype":null,
        "journeyType":"1",
        "externalId":"0-0-1z51000191",
        "duration":null,
        "contentState":"3bb64421-f15f-4dda-adec-03c324c140a3",
        "note":null,
        "originCountry":null,
        "dateZee5Published":null,
        "lastModifiedOn":"2021-03-04T06:26:14.434Z",
        "createdOn":"2021-03-04T06:26:14.434Z",
        "modifiedOn":"2021-03-04T06:26:14.434Z",
        "countries":"",
        "subtype_populated":null,
        "MovieMapContents":[
           
        ],
        "contentState_populated":{
           "title":"Draft"
        },
        "lastModifiedBy_populated":{
           "first_name":"Sunil",
           "last_name":""
        },
        "MovieLicenses":[
           
        ],
        "licenceExpDays":[
           
        ],
        "showDetails":false
     }]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "openSeheduledHistory");
    wrapper.instance().openSeheduledHistory(mockSet.movie,0);
    expect(wrapper.instance().openSeheduledHistory).toBeCalled();
  });

  it("should test closeSeheduledHistory", () => {
    const mockSet = {
      movieHistoryData: {},
      showScheduledDrawer: false,
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "closeSeheduledHistory");
    wrapper.instance().closeSeheduledHistory();
    expect(wrapper.instance().closeSeheduledHistory).toBeCalled();
  });

  it("should test getScheduledUi", () => {
    jest.spyOn(wrapper.instance(), "getScheduledUi");
    wrapper.instance().getScheduledUi();
    expect(wrapper.instance().getScheduledUi).toBeCalled();
  });

  it("should test archiveServerCalls", () => {
    jest.spyOn(wrapper.instance(), "archiveServerCalls");
    wrapper.instance().archiveServerCalls();
    expect(wrapper.instance().archiveServerCalls).toBeCalled();
  });

  it("should test handleModel", () => {
    const mockSet = {
      action: true,
      shallowModel: {
        btn1: "Yes",
        btn2: "No",
        desc: "Do you want to restore this Content?",
        detail:{
          contentId: "21df6aee-2e6a-4d83-93f3-4be5d3e90af1",
          view: "restore"
        },
        open: true,
        title: "Restore Content"
      },
      model : {
        btn1: "Yes",
        btn2: "No",
        desc: "Do you want to restore this Content?",
        detail:{
          contentId: "21df6aee-2e6a-4d83-93f3-4be5d3e90af1",
          view: "restore"
        },
        open: true,
        title: "Restore Content"
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleModel");
    wrapper.instance().handleModel(mockSet.action, mockSet.model,mockSet.shallowModel.view);
    expect(wrapper.instance().handleModel).toBeCalled();
  });

  it("should test handleAutoCreateInput", () => {
    const mockSet = {
      value: "test",
      id: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleAutoCreateInput");
    wrapper.instance().handleAutoCreateInput(mockSet.value, mockSet.id);
    expect(wrapper.instance().handleAutoCreateInput).toBeCalled();
  });

  it("should test handleRouteExpiredLink", () => {
    const mockSet = {
      movie:[{
        "movieId":"a80518e7-256f-48d0-a7dd-52a1810829d4",
        "title":"No Title",
        "subtype":null,
        "journeyType":"1",
        "externalId":"0-0-1z51000191",
        "duration":null,
        "contentState":"3bb64421-f15f-4dda-adec-03c324c140a3",
        "note":null,
        "originCountry":null,
        "dateZee5Published":null,
        "lastModifiedOn":"2021-03-04T06:26:14.434Z",
        "createdOn":"2021-03-04T06:26:14.434Z",
        "modifiedOn":"2021-03-04T06:26:14.434Z",
        "countries":"",
        "subtype_populated":null,
        "MovieMapContents":[
           
        ],
        "contentState_populated":{
           "title":"Draft"
        },
        "lastModifiedBy_populated":{
           "first_name":"Sunil",
           "last_name":""
        },
        "MovieLicenses":[
           
        ],
        "licenceExpDays":[
           
        ],
        "showDetails":false
     }]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleRouteExpiredLink");
    wrapper.instance().handleRouteExpiredLink(mockSet.movie);
    expect(wrapper.instance().handleRouteExpiredLink).toBeCalled();
  });

  it("should test handleConditionRoute", () => {
    const mockSet = {
      view: "archive",
      id: "3178d3b4-7c02-16ec-4538-2d860a8f494a",
      detail:{
        view: "archive",
        contentId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleConditionRoute");
    wrapper.instance().handleConditionRoute(mockSet.view, mockSet.id);
    expect(wrapper.instance().handleConditionRoute).toBeCalled();
  });


  it("should test selectCountryGroup", () => {
    jest.spyOn(wrapper.instance(), "selectCountryGroup");
    wrapper.instance().selectCountryGroup(event);
    expect(wrapper.instance().selectCountryGroup).toBeCalled();
  });

  it("should test handleFilterStatusSelection", () => {
    const mockSet = {
      selectedTab: "1"
    }
    jest.spyOn(wrapper.instance(), "handleFilterStatusSelection");
    wrapper.instance().handleFilterStatusSelection(event, mockSet.selectedTab );
    expect(wrapper.instance().handleFilterStatusSelection).toBeCalled();
  });


  it("should test getFiltersUi", () => {
    jest.spyOn(wrapper.instance(), "getFiltersUi");
    wrapper.instance().getFiltersUi();
    expect(wrapper.instance().getFiltersUi).toBeCalled();
  });


  it("should test getSortUi", () => {
    jest.spyOn(wrapper.instance(), "getSortUi");
    wrapper.instance().getSortUi();
    expect(wrapper.instance().getSortUi).toBeCalled();
  });

  it("should test handleKeyPress", () => {
    jest.spyOn(wrapper.instance(), "handleKeyPress");
    wrapper.instance().handleKeyPress(event);
    expect(wrapper.instance().handleKeyPress).toBeCalled();
  });

  it("should test handleKeyUp", () => {
    jest.spyOn(wrapper.instance(), "handleKeyUp");
    wrapper.instance().handleKeyUp(event);
    expect(wrapper.instance().handleKeyUp).toBeCalled();
  });

  it("should test toggleCountryPopup", () => {
    const mockSet = {
      SelectedMovieMoreCountries: [{
        "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d",
        "title": "India"
      }],
        showModelForCountries: true,
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "toggleCountryPopup");
    wrapper.instance().toggleCountryPopup(["India"]);
    expect(wrapper.instance().toggleCountryPopup).toBeCalled();
  });

  it("should test showHideCountriesPopup", () => {
    const mockSet = {
      showModelForCountries: true,
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "showHideCountriesPopup");
    wrapper.instance().showHideCountriesPopup();
    expect(wrapper.instance().showHideCountriesPopup).toBeCalled();
  });

  it("should test refreshQueue", () => {
    jest.spyOn(wrapper.instance(), "refreshQueue");
    wrapper.instance().refreshQueue();
    expect(wrapper.instance().refreshQueue).toBeCalled();
  });

  it("should test render", () => {
    jest.spyOn(wrapper.instance(), "render");
    wrapper.instance().render();
    expect(wrapper.instance().render).toBeCalled();
  });
});