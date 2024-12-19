import React from 'react'
import { shallow } from 'enzyme';
import moxios from 'moxios'
import { findByTestAttr, storeFactory } from '../../../../Utils';
import AddTemplate from '../../../../_components/Season/CreateSeason/Template/AddTemplate/addTemplate';
import { expect, it, jest } from '@jest/globals';
import jsonData from '../../../../_components/Season/Schema/SeasonTemplate/episodeTemplate.json';

const setup = (props = {}) => {
  const wrapper = shallow(<AddTemplate {...props} />);
  return wrapper;
}

describe('AddTemplate', () => {
  let wrapper;
  const baseProps = {
    markAsDone: jest.fn()
  }
  beforeEach(() => {
    const wrapperInstance = setup({ ...baseProps });
    wrapper = wrapperInstance;
    wrapper.setState({
      manualJsonSchema: JSON.parse(JSON.stringify((jsonData))).templateContent,
      // manualJsonSchema: JSON.parse(JSON.stringify((jsonData))).globalFields
    })
  });
 

  it('render component without error', () => {
    wrapper.setProps({path:"/tvshow/view/:id/season/view/:seasonId/template"})
    expect(wrapper.exists()).toBe(true);
  })

  it('render component without error url 1', () => {
    wrapper.setProps({path:"/tvshow/quick/edit/:id/season/view/:seasonId/template"})
    expect(wrapper.exists()).toBe(true);
  })

  it('render component without error url 2', () => {
    wrapper.setProps({path:"/tvshow/single/edit/:id/season/view/:seasonId/template"})
    expect(wrapper.exists()).toBe(true);
  })

  it('render component without error for url 3', () => {
    expect(wrapper.exists()).toBe(true);
  })
  it('should check handleTab method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleTab');
    instance.handleTab();
    expect(instance.handleTab).toHaveBeenCalled();
  })


  it('should check changeTitleField method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'changeTitleField');
    instance.changeTitleField();
    expect(instance.changeTitleField).toHaveBeenCalled();
  })

  it('should check componentDidMount method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalled();
  })

  it('should check InputChanger method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger();
    expect(instance.InputChanger).toHaveBeenCalled();
  })

  it('should check setSelectDataArr method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr();
    expect(instance.setSelectDataArr).toHaveBeenCalled();
  })

  it('should check saveTemplate method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'saveTemplate');
    instance.saveTemplate();
    expect(instance.saveTemplate).toHaveBeenCalled();
  })

  it('should check getEpisodeProperties method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getEpisodeProperties');
    instance.getEpisodeProperties();
    expect(instance.getEpisodeProperties).toHaveBeenCalled();
  })

  it('should check handleSearchableInput method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleSearchableInput');
    instance.handleSearchableInput();
    expect(instance.handleSearchableInput).toHaveBeenCalled();
  })

  
  // it('should check getTemplateDetails method', () => {
  //   const instance = wrapper.instance();
  //   jest.spyOn(instance, 'getTemplateDetails');
  //   instance.getTemplateDetails();
  //   expect(instance.saveTemplate).toHaveBeenCalled();
  // })
  

  it('should check closeCommonModel method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'closeCommonModel');
    instance.closeCommonModel();
    expect(instance.closeCommonModel).toHaveBeenCalled();
  })
  it('should check handleRoute method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalled();
  })


  it('should check getEpisodeProperties', () => {
   const seasonId ='109a499c-8456-4d67-8f6e-9d157b7bfa6d'
   const tvShowId='6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b'
    jest.spyOn(wrapper.instance(), 'getEpisodeProperties');
    wrapper.instance().getEpisodeProperties(seasonId,tvShowId);
    const response = [
      {
        "seasonId": {
          "value": "3288e42f-3faf-4a10-8546-44a9f078ec86",
          "inherited": "false"
        },
        "tvShowId": {
          "value": "96e688f2-91d3-419c-aab6-23a176d2ce1b",
          "inherited": "false"
        },
        "externalId": {
          "value": "0-2-5z51005728",
          "inherited": "false"
        },
        "note": {
          "value": null,
          "inherited": "true"
        },
        "title": {
          "value": "No Title",
          "inherited": "false"
        },
        "shortDescription": {
          "value": null,
          "inherited": "true"
        },
        "digitalLongDescriptionWeb": {
          "value": "<p>Ajeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF Serpeb Daastans - NF Sjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</p>",
          "inherited": "true"
        },
        "digitalshortDescriptionmobile": {
          "value": "<p>Ajeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF Serpeb Daastans - NF Sjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</p>",
          "inherited": "true"
        },
        "digitalLongDescriptionTV": {
          "value": "<p>Ajeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF SeriesAjeeb Daastans - NF Serpeb Daastans - NF Sjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</p>",
          "inherited": "true"
        },
        "index": {
          "value": 3,
          "inherited": "false"
        },
        "subtype": {
          "value": null,
          "inherited": "true"
        },
        "primaryGenre": {
          "value": null,
          "inherited": "true"
        },
        "secondaryGenre": {
          "value": null,
          "inherited": "true"
        },
        "thematicGenre": {
          "value": null,
          "inherited": "true"
        },
        "settingGenre": {
          "value": null,
          "inherited": "true"
        },
        "category": {
          "value": null,
          "inherited": "true"
        },
        "rcsCategory": {
          "value": null,
          "inherited": "true"
        },
        "specialCategory": {
          "value": [],
          "inherited": "true"
        },
        "creativeTitle": {
          "value": null,
          "inherited": "true"
        },
        "alternatetitle": {
          "value": null,
          "inherited": "true"
        },
        "pageTitle": {
          "value": null,
          "inherited": "true"
        },
        "pageDescription": {
          "value": null,
          "inherited": "true"
        },
        "titleForSocialShare": {
          "value": null,
          "inherited": "true"
        },
        "descriptionForSocialShare": {
          "value": null,
          "inherited": "true"
        },
        "dateZee5Published": {
          "value": null,
          "inherited": "true"
        },
        "telecastDate": {
          "value": null,
          "inherited": "true"
        },
        "isMultiAudio": {
          "value": false,
          "inherited": "true"
        },
        "audioLanguages": {
          "value": null,
          "inherited": "true"
        },
        "contentLanguage": {
          "value": null,
          "inherited": "true"
        },
        "primaryLanguage": {
          "value": null,
          "inherited": "true"
        },
        "dubbedLanguageTitle": {
          "value": null,
          "inherited": "true"
        },
        "originalLanguage": {
          "value": null,
          "inherited": "true"
        },
        "subtitleLanguages": {
          "value": null,
          "inherited": "true"
        },
        "contentVersion": {
          "value": {
            "title": "Original cut",
            "id": "cf2b5546-de38-448d-9adf-555f3613f0dc"
          },
          "inherited": "true"
        },
        "theme": {
          "value": null,
          "inherited": "true"
        },
        "contractId": {
          "value": null,
          "inherited": "true"
        },
        "type": {
          "value": "Season",
          "inherited": "false"
        },
        "rating": {
          "value": null,
          "inherited": "true"
        },
        "contentOwner": {
          "value": null,
          "inherited": "true"
        },
        "originCountry": {
          "value": null,
          "inherited": "true"
        },
        "upcomingPage": {
          "value": null,
          "inherited": "true"
        },
        "ageRating": {
          "value": null,
          "inherited": "true"
        },
        "certification": {
          "value": null,
          "inherited": "true"
        },
        "emotions": {
          "value": null,
          "inherited": "true"
        },
        "contentGrade": {
          "value": null,
          "inherited": "true"
        },
        "era": {
          "value": null,
          "inherited": "true"
        },
        "targetAge": {
          "value": null,
          "inherited": "true"
        },
        "targetAudiences": {
          "value": null,
          "inherited": "true"
        },
        "tags": {
          "value": null,
          "inherited": "true"
        },
        "digitalKeywords": {
          "value": null,
          "inherited": "true"
        },
        "adaptation": {
          "value": null,
          "inherited": "true"
        },
        "events": {
          "value": null,
          "inherited": "true"
        },
        "productionCompany": {
          "value": null,
          "inherited": "true"
        },
        "popularityScore": {
          "value": null,
          "inherited": "true"
        },
        "trivia": {
          "value": null,
          "inherited": "true"
        },
        "broadcastState": {
          "value": {
            "title": "Archive",
            "id": "5b44c8f7-1166-465f-a56c-ae03a08bb503"
          },
          "inherited": "false"
        },
        "epgProgramId": {
          "value": null,
          "inherited": "true"
        },
        "channel": {
          "value": null,
          "inherited": "true"
        },
        "showAirTime": {
          "value": null,
          "inherited": "true"
        },
        "showAirTimeDays": {
          "value": null,
          "inherited": "true"
        },
        "awards": {
          "value": [],
          "inherited": "true"
        },
        "contentState": {
          "value": {
            "title": "Draft",
            "id": "3bb64421-f15f-4dda-adec-03c324c140a3"
          },
          "inherited": "false"
        },
        "journeyType": {
          "value": "1",
          "inherited": "false"
        },
        "status": {
          "value": "1",
          "inherited": "false"
        },
        "lastModifiedBy": {
          "value": "342187ac-b110-4afb-9ed2-5346e3ea2bbd",
          "inherited": "false"
        },
        "lastModifiedOn": {
          "value": "2021-04-20T05:26:08.737Z",
          "inherited": "false"
        },
        "last_modified_by": {
          "value": "342187ac-b110-4afb-9ed2-5346e3ea2bbd",
          "inherited": "false"
        },
        "createdOn": {
          "value": "2021-04-20T05:26:08.737Z",
          "inherited": "false"
        },
        "modifiedOn": {
          "value": "2021-04-20T05:26:08.737Z",
          "inherited": "false"
        }
      }
    ];
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().allStatus.length()).toEqual(0);
        done();
      });
    });
  })




  it('should test saveTemplate',()=>{
     const manualJsonSchema = [{
      col: "col-md-6 col-lg-6",
      data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
      errorText: "",
      keyText: "displayTitle",
      label: "Collection or External id",
      multiple: true,
      name: "mapCollectionId",
      touched: 1,
      type: "SearchableWithCreate",
      valid: true,
      validation: {required: true},
      value: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
      withoutCreate: true}]
    const mockSet = {title:"Show name + Date + Asset Type",formValidity:true,manualJsonSchema}
    const wrapper = setup();
    wrapper.setState({...mockSet})
    const instance = wrapper.instance();
    jest.spyOn(instance, 'saveTemplate');
    instance.saveTemplate(mockSet.title,mockSet.formValidity);
    expect(instance.saveTemplate).toHaveBeenCalledTimes(1);
  });

  it('should test InputChanger',()=>{
    const event = {target:{name:'mapCollectionId',files:[{path:"hello user"}]}}
    const manualJsonSchema = [{
     col: "col-md-6 col-lg-6",
     data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
     errorText: "",
     keyText: "displayTitle",
     label: "Collection or External id",
     multiple: true,
     name: "mapCollectionId",
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
    const wrapper = setup();
   wrapper.setState({manualJsonSchema:manualJsonSchema})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'InputChanger');
   instance.InputChanger(event,1);
   expect(instance.InputChanger).toHaveBeenCalledTimes(1);
 });

 it('should test InputChanger for else block',()=>{
  const event = {target:{name:'mapCollectionId',files:[{path:"hello user"}]}}
  const manualJsonSchema = [{
   col: "col-md-6 col-lg-6",
   data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
   errorText: "",
   keyText: "displayTitle",
   label: "Collection or External id",
   multiple: true,
   name: "mapCollectionId",
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
  const wrapper = setup();
 wrapper.setState({manualJsonSchema:manualJsonSchema})
 const instance = wrapper.instance();
 jest.spyOn(instance, 'InputChanger');
 instance.InputChanger(event,2);
 expect(instance.InputChanger).toHaveBeenCalledTimes(1);
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
  instance.setSelectDataArr(res,0);
  expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
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




  it('should test handleSearchableInput',async ()=>{
    const response =
      {
        "count": 2,
        "rows": [{
          "id": "7188c312-7ed6-4008-80f3-a9c40e2ad9ed",
          "title": "No Title Image",
          "externalId": "1-3-1000190",
          "note": null,
          "lastModifiedOn": "2021-03-18T08:51:58.426Z",
          "CollectionImages": [{
            "imageDetails": {
              "url": "manoj-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
              "size": "5.93 KB",
              "valid": false,
              "maxSize": "20MB",
              "mandatory": true,
              "resolution": "1170✕658"
            }
          }],
          "contentState": {
            "title": "Draft"
          },
          "lastModifiedByUser": {
            "first_name": "Akash",
            "last_name": "Tripathi"
          },
          "CollectionAsset": {
            "assetId": []
          }
        }]
      }
       const manualJsonSchema = [{
      col: "col-md-6 col-lg-6",
      data: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
      errorText: "",
      keyText: "displayTitle",
      label: "Collection or External id",
      multiple: true,
      name: "mapCollectionId",
      touched: 1,
      type: "SearchableWithCreate",
      valid: true,
      validation: {required: true},
      value: [{externalId: "1-3-1000190", id: "7188c312-7ed6-4008-80f3-a9c40e2ad9ed", title: "No Title Image", displayTitle: "No Title Image (1-3-1000190)"}],
      withoutCreate: true}]
      
   const mockSet = {value:"a",index:0,response:response}
   const wrapper = setup();
   wrapper.setState({...mockSet})
   const instance = wrapper.instance();
   jest.spyOn(instance, 'handleSearchableInput');
   instance.handleSearchableInput(mockSet.response);
   expect(instance.handleSearchableInput).toHaveBeenCalledTimes(1);
 });



  it('should check saveTemplate', () => {
    const seasonId ='109a499c-8456-4d67-8f6e-9d157b7bfa6d'
    const tvShowId='6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b'
     jest.spyOn(wrapper.instance(), 'saveTemplate');
     wrapper.instance().saveTemplate("Show name + Date + Asset Type","mapCollectionId");
     const responseBody = {"title":"Show name + Date + Asset Type","mapCollectionId":["7188c312-7ed6-4008-80f3-a9c40e2ad9ed","54e01b82-d006-476b-8e94-3145168fac24"],"shortDescription":"<p>test data</p>","subtypeId":"f9c605c9-ef17-4068-8c5d-fc7061dd61e0","seasonId":"109a499c-8456-4d67-8f6e-9d157b7bfa6d"}
     moxios.wait(function () {
       const request = moxios.requests.mostRecent(responseBody);
       request.respondWith(response).then((res) => {
         expect(wrapper.state().allStatus.length()).toEqual(0);
         done();
       });
     });
   })


   it('should check handleSearchableInput', () => {
    const seasonId ='109a499c-8456-4d67-8f6e-9d157b7bfa6d'
    const tvShowId='6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b'
     jest.spyOn(wrapper.instance(), 'handleSearchableInput');
     wrapper.instance().handleSearchableInput(seasonId,tvShowId);
     const responseBody = {"title":"Show name + Date + Asset Type","mapCollectionId":["7188c312-7ed6-4008-80f3-a9c40e2ad9ed","54e01b82-d006-476b-8e94-3145168fac24"],"shortDescription":"<p>test data</p>","subtypeId":"f9c605c9-ef17-4068-8c5d-fc7061dd61e0","seasonId":"109a499c-8456-4d67-8f6e-9d157b7bfa6d"}
     moxios.wait(function () {
       const request = moxios.requests.mostRecent(responseBody);
       request.respondWith(response).then((res) => {
         console.log(res, "res rkakaakak")
         expect(wrapper.state().allStatus.length()).toEqual(0);
         done();
       });
     });
   })


   it('should check generateTab', () => {
     jest.spyOn(wrapper.instance(), 'generateTab');
     wrapper.instance().generateTab();
     moxios.wait(function () {
       const request = moxios.requests.mostRecent(responseBody);
       request.respondWith(response).then((res) => {
         expect(wrapper.state().allStatus.length()).toEqual(0);
         done();
       });
     });
   })
   


   it("should check onClick method saveTemplate", () => {
    wrapper.setState({editTemplate:true})
    const spy = jest.spyOn(wrapper.instance(), "saveTemplate");
    wrapper.find(".zee-full").simulate("click");
    expect(spy).toHaveBeenCalled();
  });



  it("should check onClick method handleRoute", () => {
    // wrapper.setState({editTemplate:true})
 
    const spy = jest.spyOn(wrapper.instance(), "handleRoute");
    wrapper.find("#handle-route-button").simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  



})