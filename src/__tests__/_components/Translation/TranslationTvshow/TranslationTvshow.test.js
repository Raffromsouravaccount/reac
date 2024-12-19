import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import TranslationTvshow from './../../../../_components/Translation/TranslationTvshow/TranslationTvshow';
import TranslationInfo from './../../../../_components/Translation/Layout/TranslationInfo';
import { constantText } from '../../../../_helpers/constants.text';
import { CommonModel } from './../../../../_components/Common/Model/CommonModel';
import Config from "../../../../Config/config";
import { translationService } from '../../../../_services/translation.service';
import TvshowCastNCrewJson from "../../../../_components/Translation/Schema/Tvshow/CastNCrew.json";
import TvshowGlobalContentPropertiesJson from "../../../../_components/Translation/Schema/Tvshow/GlobalContentProperties.json";


const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationTvshow {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
const initialState = {
    params:{
        tvshowId: "8d0d64ca-e032-4bd5-b255-b7330be5b452"
    },
    showNavToAssignedLang: false,
    language: {
        code: 'hi'
    },
}

describe('<TranslationTvshow />', () => {
    let wrapper;
    const userData = {
        userID: "d2fa1282-5f91-4231-a2b4-f308caf5afc6"
    };
    beforeEach(() => {
        moxios.install(axios);
        wrapper = setup({}, {...initialState});
    });
    afterEach(() => {
        moxios.uninstall(axios);
        jest.clearAllMocks();
    });
    it('Should renders Translation Tvshow default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should get userID from localStorage', () => {
        Storage.prototype.getItem = jest.fn(() => userData.userID);
        const result = localStorage.getItem();
        expect(result).toEqual(userData.userID);
    });
    it('Sholud test componentDidMount', () => {
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('Sholud test componentWillReceiveProps', () => {
        const nextProps = {language: {code: 'gr'}, showNavToAssignedLang: true};
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'componentWillReceiveProps');
        instance.componentWillReceiveProps(nextProps);
        expect(instance.componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(String(wrapper.state('language')?.code)).toBe(String(nextProps?.language?.code));
    });
    it('should test fetchContentData with defaultData', async () => {
        const response = {"status":200,"message":"Tv Show translation data has been successfully fetched.","data":[{"tvShowId":"8d0d64ca-e032-4bd5-b255-b7330be5b452","externalId":"1-4-1000010","note":null,"title":"No Title","shortDescription":null,"digitalLongDescriptionWeb":null,"digitalshortDescriptionmobile":null,"digitalLongDescriptionTV":null,"subtype":null,"primaryGenre":null,"secondaryGenre":null,"thematicGenre":null,"settingGenre":null,"category":null,"rcsCategory":null,"specialCategory":null,"creativeTitle":null,"alternatetitle":null,"pageTitle":null,"pageDescription":null,"titleForSocialShare":null,"descriptionForSocialShare":null,"dateZee5Published":null,"telecastDate":null,"isMultiAudio":null,"audioLanguages":null,"contentLanguage":null,"primaryLanguage":null,"dubbedLanguageTitle":null,"originalLanguage":null,"subtitleLanguages":null,"contentVersion":null,"theme":null,"contractId":null,"rating":null,"contentOwner":null,"originCountry":null,"upcomingPage":null,"ageRating":null,"certification":null,"emotions":null,"contentGrade":null,"era":null,"targetAge":null,"targetAudiences":null,"tags":null,"digitalKeywords":null,"adaptation":null,"events":null,"productionCompany":null,"popularityScore":null,"trivia":null,"broadcastState":null,"contentProduction":null,"epgProgramId":null,"channel":null,"showAirTime":null,"showAirTimeDays":null,"awards":null,"contentState":"3bb64421-f15f-4dda-adec-03c324c140a3","journeyType":"1","createdBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","status":"1","lastModifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","lastModifiedOn":"2021-02-02T11:53:16.986Z","_created_on":"2021-02-02T10:10:24.513Z","_modified_on":"2021-02-02T11:53:16.986Z","subtype_id":null,"content_category_id":null,"rcs_category_id":null,"primary_language_id":null,"original_language_id":null,"content_version_id":null,"content_rating_id":null,"content_owner_id":null,"origin_country_id":null,"content_grade_id":null,"era_id":null,"target_age_group_id":null,"production_company_id":null,"broadcast_state_id":null,"content_production_id":null,"channel_id":null,"content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","_created_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","last_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","alternativeTitle":null,"socialShareDescription":null,"tvDescription":null,"webDescription":null,"appDescription":null,"socialShareTitle":null,"upcomingPageText":null}],"error":null}
        const wrapper = setup({}, {...initialState});
        const tvshowId = initialState.params.tvshowId;
        const sections = constantText.translations.tvshow_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getShowDetails = mock;
        const result = await translationService.getShowDetails(tvshowId, lang, sections[wrapper.state('selectedSecTab')].url);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(result).toBe(response);
    });
    it('should test fetchContentData with defaultData for globalFields', async () => {
        const response = {"status":200,"message":"Tv Show translation data has been successfully fetched.","data":[{"tvShowId":"8d0d64ca-e032-4bd5-b255-b7330be5b452","externalId":"1-4-1000010","note":null,"title":"No Title","shortDescription":null,"digitalLongDescriptionWeb":null,"digitalshortDescriptionmobile":null,"digitalLongDescriptionTV":null,"subtype":null,"primaryGenre":null,"secondaryGenre":null,"thematicGenre":null,"settingGenre":null,"category":null,"rcsCategory":null,"specialCategory":null,"creativeTitle":null,"alternatetitle":null,"pageTitle":null,"pageDescription":null,"titleForSocialShare":null,"descriptionForSocialShare":null,"dateZee5Published":null,"telecastDate":null,"isMultiAudio":null,"audioLanguages":null,"contentLanguage":null,"primaryLanguage":null,"dubbedLanguageTitle":null,"originalLanguage":null,"subtitleLanguages":null,"contentVersion":null,"theme":null,"contractId":null,"rating":null,"contentOwner":null,"originCountry":null,"upcomingPage":null,"ageRating":null,"certification":null,"emotions":null,"contentGrade":null,"era":null,"targetAge":null,"targetAudiences":null,"tags":null,"digitalKeywords":null,"adaptation":null,"events":null,"productionCompany":null,"popularityScore":null,"trivia":null,"broadcastState":null,"contentProduction":null,"epgProgramId":null,"channel":null,"showAirTime":null,"showAirTimeDays":null,"awards":null,"contentState":"3bb64421-f15f-4dda-adec-03c324c140a3","journeyType":"1","createdBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","status":"1","lastModifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","lastModifiedOn":"2021-02-02T11:53:16.986Z","_created_on":"2021-02-02T10:10:24.513Z","_modified_on":"2021-02-02T11:53:16.986Z","subtype_id":null,"content_category_id":null,"rcs_category_id":null,"primary_language_id":null,"original_language_id":null,"content_version_id":null,"content_rating_id":null,"content_owner_id":null,"origin_country_id":null,"content_grade_id":null,"era_id":null,"target_age_group_id":null,"production_company_id":null,"broadcast_state_id":null,"content_production_id":null,"channel_id":null,"content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","_created_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","last_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","alternativeTitle":null,"socialShareDescription":null,"tvDescription":null,"webDescription":null,"appDescription":null,"socialShareTitle":null,"upcomingPageText":null}],"error":null}
        const defaultDataResponse = [{"id":"8aaf2f3f-f932-43e1-b055-7455ef03567b","tvShowId":"6b1ccbd3-2419-4071-8034-7d754f74aa85","type":"property","title":"Kumkum Bhagya 2","shortDescription":"Bhagya","webDescription":"Bhagya serial","appDescription":"Bhagya serial","tvDescription":"Bhagya serial","creativeTitle":"Kumkum Bhagya","alternativeTitle":"Bhagya serial","pageTitle":"Bhagya serial","pageDescription":"Bhagya serial","socialShareTitle":"Kumkum Bhagya","socialShareDescription":"Bhagya serial","upcomingPageText":"Kumkum Bhagya","actorCharacter":null,"trivia":null,"dateZee5Published":null,"telecastDate":null,"subtitleLanguages":null,"broadcastState":null,"sponsors":"Kumkum Bhagya","titleTag":null,"metaDescription":null,"metaSynopsis":null,"redirectionType":null,"redirectionLink":null,"noIndexNoFollow":null,"h1Heading":null,"h2Heading":null,"h3Heading":null,"h4Heading":null,"h5Heading":null,"h6Heading":null,"robotsMetaIndex":null,"robotsMetaNoIndex":null,"robotsMetaImageIndex":null,"robotsMetaImageNoIndex":null,"canonicalUrl":null,"breadcrumbTitle":null,"internalLinkBuilding":null,"videoObjectSchema":null,"websiteSchema":null,"breadcrumListSchema":null,"imageObjectSchema":null,"organizationSchema":null,"imageGallerySchema":null,"linkToStories":null,"translationStatus":"0","status":"1","_created_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","_modified_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","redirection_type":null,"RedirectionType":null,"tvShowLangCode":[{"tvShowGlobalId":"8aaf2f3f-f932-43e1-b055-7455ef03567b","langCode":"en","Country":{"title":"Djibouti","id":"c181637a-8eb3-4ee8-9ad5-5d432b785bcf"}}]}];
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1, defaultData: defaultDataResponse});
        const tvshowId = initialState.params.tvshowId;
        const globalSections = constantText.translations.tvshow_global_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getShowDetails = mock;
        const result = await translationService.getShowDetails(tvshowId, lang);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(globalSections[wrapper.state('selectedGlobalSecTab')].url).toBe('globalFields');
        expect(result).toBe(response);
    });
    it('should test fetchContentData with defaultData for castAndCrew', async () => {
        const response = {"status":200,"message":"Tv Show translation data has been successfully fetched.","data":{"actor":[{"id":"fbfac2d7-53de-44ff-9d06-d6ea798a9678","castName":"Akshay Kumar","character":null}],"42c1e2b7-0578-4e5f-b805-c2601fddee28":[{"id":"76b29a7b-b865-4033-85cf-04b29bb3d667","castName":"Priyeshwar"}],"72dab561-6c03-4634-ab6f-f5268f716211":[{"id":"859790c5-2cb0-4b19-ab03-72c348648b0f","castName":"aviis"}]},"error":null};
        const mappedDataObj = {
            "actors":[
                [{ "id": "fbfac2d7-53de-44ff-9d06-d6ea798a9678", "isEditing": false, "keyText": "castName","label": "Actor","maxTextLength": 250,"name": "actor","numeric": false,"required": false,"text": false,"type": "text","value": "Akshay Kumar"},
                {"isEditing": true,"label": "Character","maxTextLength": 250,"name": "character","numeric": false,"required": false,"text": false,"type": "text","value": ""}]
            ]
        };
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(TvshowCastNCrewJson))});
        const tvshowId = initialState.params.tvshowId;
        const sections = constantText.translations.tvshow_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getShowDetails = mock;
        const result = await translationService.getShowDetails(tvshowId, lang, sections[wrapper.state('selectedSecTab')].url);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        const mockActor = jest.fn().mockReturnValue(mappedDataObj);
        translationService.mapCastAndCrewValues = mockActor;
        const resultActor = translationService.mapCastAndCrewValues(response, wrapper.state('fields'));
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(sections[wrapper.state('selectedSecTab')].url).toBe('castAndCrew');
        expect(result).toBe(response);
        expect(resultActor).toBe(mappedDataObj);
    });
    it('should test fetchContentData when translation not started yet for castNcrew', () => {
        const response = {"actors": [{"actor": 'Akshay'}]};
        const res = null;
        const wrapper = setup({}, {...initialState, defaultData: response, selectedSecTab: 1,});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(false);
        const mock = jest.fn().mockReturnValue(res);
        translationService.getShowDetails = mock;
        expect(instance.fetchContentData).toHaveBeenCalledWith(false);
    });
    it('should test fetchContentData when translation not started yet for globalFields', () => {
        const response = [{"id":"764216ce-851e-407d-a37f-4843689e4dd1","tvShowId":"aa47205c-a29d-4b66-b547-6a4d84cfa8d4","type":"property","title":"Kumkum Bhagya for Austria","shortDescription":"Bhagya","webDescription":"Bhagya serial","appDescription":"Bhagya serial","tvDescription":"Bhagya serial","creativeTitle":"Kumkum Bhagya","alternativeTitle":"Bhagya serial","pageTitle":"Bhagya serial","pageDescription":"Bhagya serial","socialShareTitle":"Kumkum Bhagya","socialShareDescription":"Bhagya serial","upcomingPageText":"Kumkum Bhagya","actorCharacter":null,"trivia":null,"dateZee5Published":null,"telecastDate":null,"subtitleLanguages":null,"broadcastState":null,"sponsors":"Kumkum Bhagya", "translationStatus":"0","status":"1","tvShowLangCode":[{"tvShowGlobalId":"764216ce-851e-407d-a37f-4843689e4dd1","langCode":"en","Country":{"title":"Comoros","id":"6ffa921c-b5c2-42c1-92b0-07fb1bdaa092"}}]}];
        const res = null;
        const wrapper = setup({}, {...initialState, defaultData: response, selectedGlobalSecTab: 1, params:{tvshowId: 'aa47205c-a29d-4b66-b547-6a4d84cfa8d4'}});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(false);
        const mock = jest.fn().mockReturnValue(res);
        translationService.getShowDetails = mock;
        const section = wrapper.state('sections')[wrapper.state('selectedSecTab')];
        const globalSection = wrapper.state('globalSections')[wrapper.state('selectedGlobalSecTab')];
        expect(instance.fetchContentData).toHaveBeenCalledWith(false);
        expect(section.url == 'properties' && globalSection.url == 'globalFields').toBe(true);
    });
    it('should test updateValues', () => {
        const resData = [{'title': "cc"}];
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(resData);
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
    });
    it('should test updateValues for castNcrew', () => {
        const response = {"actor":[{"id":"fbfac2d7-53de-44ff-9d06-d6ea798a9678","castName":"Akshay Kumar","character":null}],"42c1e2b7-0578-4e5f-b805-c2601fddee28":[{"id":"76b29a7b-b865-4033-85cf-04b29bb3d667","castName":"Priyeshwar"}],"72dab561-6c03-4634-ab6f-f5268f716211":[{"id":"859790c5-2cb0-4b19-ab03-72c348648b0f","castName":"aviis"}]};
        const mappedDataObj = {
            "actors":[
                [{ "id": "fbfac2d7-53de-44ff-9d06-d6ea798a9678", "isEditing": false, "keyText": "castName","label": "Actor","maxTextLength": 250,"name": "actor","numeric": false,"required": false,"text": false,"type": "text","value": "Akshay Kumar"},
                {"isEditing": true,"label": "Character","maxTextLength": 250,"name": "character","numeric": false,"required": false,"text": false,"type": "text","value": ""}]
            ]
        };
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(TvshowCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(response);
        const mockActor = jest.fn().mockReturnValue(mappedDataObj);
        translationService.mapCastAndCrewValues = mockActor;
        const resultActor = translationService.mapCastAndCrewValues(response, wrapper.state('fields'));
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
        expect(resultActor).toBe(mappedDataObj);
        expect(resultActor?.actors.length).toEqual(1);
    });
    it('should test updateValues for globalFields', () => {
        const defaultDataResponse = [
            {"id":"8aaf2f3f-f932-43e1-b055-7455ef03567b","tvShowId":"6b1ccbd3-2419-4071-8034-7d754f74aa85","type":"property","title":"Kumkum Bhagya 2","shortDescription":"Bhagya","webDescription":"Bhagya serial","appDescription":"Bhagya serial","tvDescription":"Bhagya serial","creativeTitle":"Kumkum Bhagya","alternativeTitle":"Bhagya serial","pageTitle":"Bhagya serial","pageDescription":"Bhagya serial","socialShareTitle":"Kumkum Bhagya","socialShareDescription":"Bhagya serial","upcomingPageText":"Kumkum Bhagya","actorCharacter":null,"trivia":null,"dateZee5Published":null,"telecastDate":null,"subtitleLanguages":null,"broadcastState":null,"sponsors":"Kumkum Bhagya","translationStatus":"0","status":"1","_created_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","_modified_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","redirection_type":null,"RedirectionType":null,"tvShowLangCode":[{"tvShowGlobalId":"8aaf2f3f-f932-43e1-b055-7455ef03567b","langCode":"en","Country":{"title":"Djibouti","id":"c181637a-8eb3-4ee8-9ad5-5d432b785bcf"}}]},
            {"tvShowId":"6b1ccbd3-2419-4071-8034-7d754f74aa85","type":"property","title":"Kumkum Bhagya 2","shortDescription":"Bhagya","webDescription":"Bhagya serial","appDescription":"Bhagya serial","tvDescription":"Bhagya serial","creativeTitle":"Kumkum Bhagya","alternativeTitle":"Bhagya serial","pageTitle":"Bhagya serial","pageDescription":"Bhagya serial","socialShareTitle":"Kumkum Bhagya","socialShareDescription":"Bhagya serial","upcomingPageText":"Kumkum Bhagya","actorCharacter":null,"trivia":null,"dateZee5Published":null,"telecastDate":null,"subtitleLanguages":null,"broadcastState":null,"sponsors":"Kumkum Bhagya","translationStatus":"0","status":"1","_created_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","_modified_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","redirection_type":null,"RedirectionType":null,"tvShowLangCode":[{"tvShowGlobalId":"8aaf2f3f-f932-43e1-b055-7455ef03567b","langCode":"en","Country":{"title":"Djibouti","id":"c181637a-8eb3-4ee8-9ad5-5d432b785bcf"}}]}];
        const response = [{"id":"d995d2de-89c7-4b0d-ae3c-830ab6d42c5b","tvShowId":"6b1ccbd3-2419-4071-8034-7d754f74aa85","title":" Kumkum Bhagya 2 Hindi Global title","shortDescription":null,"webDescription":null,"appDescription":null,"tvDescription":null,"upcomingPageText":null,"_created_on":"2021-02-02T13:00:41.463Z","RedirectionType":null,"tvShowLangCode":[{"tvShowGlobalId":"8aaf2f3f-f932-43e1-b055-7455ef03567b","Country":{"title":"Djibouti","id":"c181637a-8eb3-4ee8-9ad5-5d432b785bcf"}}]}];
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1, fields: JSON.parse(JSON.stringify(TvshowGlobalContentPropertiesJson)), defaultData: defaultDataResponse});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(response);
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
        expect(defaultDataResponse.length).not.toEqual(response.length);
    });
    it('should test updatePropertiesValue', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updatePropertiesValue');
        instance.updatePropertiesValue();
        expect(instance.updatePropertiesValue).toHaveBeenCalledTimes(1);
    });
    it('should test getPropertiesData', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getPropertiesData');
        instance.getPropertiesData();
        expect(instance.getPropertiesData).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        const fields = wrapper.state('fields');
        jest.spyOn(instance, 'validateMarkAsDone');
        instance.validateMarkAsDone(fields);
        expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDone for actors', () => {
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(TvshowCastNCrewJson))});
        const instance = wrapper.instance();
        const fields = wrapper.state('fields');
        jest.spyOn(instance, 'validateMarkAsDone');
        instance.validateMarkAsDone(fields);
        expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDoneShowAction', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'validateMarkAsDoneShowAction');
        instance.validateMarkAsDoneShowAction();
        expect(instance.validateMarkAsDoneShowAction).toHaveBeenCalledTimes(1);
    });
    it('should test validateError', () => {
        const text = true;
        const numeric = true;
        const maxTextLength = 250;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'validateError');
        instance.validateError(text, numeric, maxTextLength, value);
        expect(instance.validateError).toHaveBeenCalledTimes(1);
    });
    it('should test handleValueChange', () => {
        const stepName = 'title_summary';
        const index = null;
        const rootIndex = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, index, rootIndex, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should test handleValueChange for Actors', () => {
        const stepName = 'actors';
        const index = 1;
        const rootIndex = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(TvshowCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, index, rootIndex, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should render TranslationInfo', () => {
        const permissionAddEdit = true;
        const permissionViewOnly = false;
        const wrapper = setup({permissionAddEdit, permissionViewOnly}, {...initialState});
        expect(permissionAddEdit).toBeTruthy();
        expect(permissionViewOnly).toBeFalsy();
        expect(wrapper.containsMatchingElement(<TranslationInfo />)).toBe(true);
    });
    it('should test toggleModel', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'toggleModel');
        instance.toggleModel();
        expect(instance.toggleModel).toHaveBeenCalledTimes(1);
    });
    it('should test lockUnlockTranslation', () => {
        const wrapper = setup({}, {params: initialState.params });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'lockUnlockTranslation');
        instance.lockUnlockTranslation();
        expect(instance.lockUnlockTranslation).toHaveBeenCalledTimes(1);
    });
    it('should test lockSections', () => {
        const wrapper = setup({}, {params: initialState.params });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'lockSections');
        const params = wrapper.state('params');
        instance.lockSections(params?.tvshowId);
        expect(instance.lockSections).toHaveBeenCalledWith(params?.tvshowId);
        expect(instance.lockSections).toHaveBeenCalledTimes(1);
    });
    it('should test autoSave', async (done) => {
        const response = {
            response: {
                status: 200,
                data: {"id":"f7a4df11-0882-45cd-8e84-a5816f2c941e","tv_show_id":"c25c21e6-a5a9-4720-8da6-0886e576d5a0","title":"ff","trivia":null,"sponsors":null,"redirection_type":null,"_created_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","_modified_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","_created_on":"2021-02-15T05:45:22.698Z","_modified_on":"2021-02-16T08:26:46.341Z","shortDescription":null,"webDescription":null,"appDescription":null,"tvDescription":null,"creativeTitle":null,"alternativeTitle":null,"pageTitle":null,"pageDescription":null,"socialShareTitle":null,"socialShareDescription":null,"upcomingPageText":null,"actorCharacter":[{"actor":"Akshay Kumar","character":""},{"actor":"New Actor","character":""}],"dateZee5Published":null,"telecastDate":null,"subtitleLanguages":null,"broadcastState":null,"titleTag":null,"metaDescription":null,"metaSynopsis":null,"redirectionLink":null,"noIndexNoFollow":null,"h1Heading":null,"h2Heading":null,"h3Heading":null,"h4Heading":null,"h5Heading":null,"h6Heading":null,"robotsMetaIndex":null,"robotsMetaNoIndex":null,"robotsMetaImageIndex":null,"robotsMetaImageNoIndex":null,"canonicalUrl":null,"breadcrumbTitle":null,"internalLinkBuilding":null,"videoObjectSchema":null,"websiteSchema":null,"breadcrumListSchema":null,"imageObjectSchema":null,"organizationSchema":null,"imageGallerySchema":null,"linkToStories":null,"translationStatus":"1","status":"1"}
            }
        };
        const updatedFields = {
            isEditing: false,
            keyText: "castName",
            label: "Actor",
            maxTextLength: 250,
            name: "actor",
            numeric: false,
            required: false,
            text: false,
            type: "text",
            value: ""
        };
        const wrapper = setup({updateMarkAsDoneAction: jest.fn()}, {...initialState, updatedFields});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSave');
        instance.autoSave();
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then(res => {
                done();
            });
        })
    });
    it('should test autoSave for globalFields', () => {
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1, fields: JSON.parse(JSON.stringify(TvshowGlobalContentPropertiesJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSave');
        instance.autoSave();
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
    });
    it('should test checkIfMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'checkIfMarkAsDone');
        instance.checkIfMarkAsDone();
        expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test handleMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleMarkAsDone');
        instance.handleMarkAsDone();
        expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test markAsDoneNLockedAction', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'markAsDoneNLockedAction');
        instance.markAsDoneNLockedAction();
        expect(instance.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
    });
    it('should test autoSaveError', () => {
        const error = {
            data: {
                message: 'This section is locked by another user.'
            }
        }
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError(error);
        expect(instance.autoSaveError).toHaveBeenCalledTimes(1);
        expect(error?.data?.message).toEqual(constantText.locked_by_another_text);
    });
    it('should test getTvshowStatus', async (done) => {
        const response = {
            response: {
                status: 201,
                data: [{"id":"e5eb8019-49ac-499b-ba48-9a065e0b929b","tvShowId":"6b1ccbd3-2419-4071-8034-7d754f74aa85","sectionName":"hi_properties","isLocked":true,"lockedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","lockedOn":"2021-02-03T08:52:44.416Z","isDone":true,"doneBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","doneOn":"2021-02-03T07:34:39.359Z","createdBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","status":"1","_created_on":"2021-02-03T05:34:29.209Z","_modified_on":"2021-02-03T08:52:44.418Z","lockedByUser":{"id":"b34168f3-c0bd-48b4-a018-bb8949819d1d","firstName":"Tanuj","lastName":"Kumar"}}]
            }
        };
        const wrapper = setup({}, { ...initialState });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getTvshowStatus');
        instance.getTvshowStatus();
        expect(instance.getTvshowStatus).toBeCalled();
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                done();
            });
        });
    });
    it('should test handleSecTab', () => {
        const selectedSecTab = 0;
        const wrapper = setup({}, {...initialState, selectedSecTab: 1});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSecTab');
        instance.handleSecTab('e', selectedSecTab);
        expect(instance.handleSecTab).toHaveBeenCalledTimes(1);
        expect(wrapper.state('selectedSecTab')).not.toEqual(1);
    });
    it('should test handleGlobalSecTab', () => {
        const selectedGlobalSecTab = 0;
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleGlobalSecTab');
        instance.handleGlobalSecTab('e', selectedGlobalSecTab);
        expect(instance.handleGlobalSecTab).toHaveBeenCalledTimes(1);
        expect(wrapper.state('selectedGlobalSecTab')).not.toEqual(1);
    });
    it('should test commonTabHandler', () => {
        const selectedGlobalSecTab = 0;
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1});
        const instance = wrapper.instance();
        const section = wrapper.state('sections')[wrapper.state('selectedSecTab')];
        jest.spyOn(instance, 'commonTabHandler');
        instance.commonTabHandler(selectedGlobalSecTab, 0);
        expect(instance.commonTabHandler).toHaveBeenCalledTimes(1);
        expect(section.url).toEqual('properties');
    });
    it('should test commonTabHandler for castAndCrew', () => {
        const selectedGlobalSecTab = 0;
        const wrapper = setup({}, {...initialState, selectedSecTab: 1});
        const instance = wrapper.instance();
        const section = wrapper.state('sections')[wrapper.state('selectedSecTab')];
        jest.spyOn(instance, 'commonTabHandler');
        instance.commonTabHandler(selectedGlobalSecTab, 1);
        expect(instance.commonTabHandler).toHaveBeenCalledTimes(1);
        expect(section.url).toEqual('castAndCrew');
    });
    it('should test setSelectDataArr', () => {
        const key = 'title_summary';
        const index = 1;
        const data = [{'title': 'hii'}];
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'setSelectDataArr');
        instance.setSelectDataArr(key, index, data);
        expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
    });
    it('should test getCountryGroup method', () => {
        const resp = [{"id":"764216ce-851e-407d-a37f-4843689e4dd1","tvShowId":"aa47205c-a29d-4b66-b547-6a4d84cfa8d4","type":"property","title":"Kumkum Bhagya for Austria","shortDescription":"","webDescription":"Kum","appDescription":"Kumkum","tvDescription":"Kumkum Bhagya","creativeTitle":"Kumkum Bhagya","alternativeTitle":"Kum","pageTitle":"Kumkum Bhagya is an Indian","pageDescription":"Kumkum Bhagya","socialShareTitle":"Kumkum Bhagya","socialShareDescription":"Kumkum","upcomingPageText":"Kumkum Bhagya","actorCharacter":null,"trivia":null,"dateZee5Published":null,"telecastDate":null,"subtitleLanguages":null,"broadcastState":null,"sponsors":"Kumkum Bhagya","titleTag":null,"metaDescription":null,"metaSynopsis":null,"redirectionType":null,"redirectionLink":null,"noIndexNoFollow":null,"h1Heading":null,"h2Heading":null,"h3Heading":null,"h4Heading":null,"h5Heading":null,"h6Heading":null,"robotsMetaIndex":null,"robotsMetaNoIndex":null,"robotsMetaImageIndex":null,"robotsMetaImageNoIndex":null,"canonicalUrl":null,"breadcrumbTitle":null,"internalLinkBuilding":null,"videoObjectSchema":null,"websiteSchema":null,"breadcrumListSchema":null,"imageObjectSchema":null,"organizationSchema":null,"imageGallerySchema":null,"linkToStories":null,"translationStatus":"0","status":"1","_created_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","_modified_by":"e792e5ea-258e-4305-99ff-6b9dd8371405","redirection_type":null,"RedirectionType":null,"tvShowLangCode":[{"tvShowGlobalId":"764216ce-851e-407d-a37f-4843689e4dd1","langCode":"en","Country":{"title":"Comoros","id":"6ffa921c-b5c2-42c1-92b0-07fb1bdaa092"}}]}];
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getCountryGroup');
        instance.getCountryGroup(resp);
        expect(instance.getCountryGroup).toBeCalled();
    });
    it('should test renderCountryGroupList method', () => {
        const rootIndex = 1;
        const country = ["India", "Austria"];
        const coutntryStringView = "India, Austria";
        const countryGroupList = [{"countryGroup0":[{"title":"Comoros","id":"6ffa921c-b5c2-42c1-92b0-07fb1bdaa092"}]},{"countryGroup1":[{"title":"Comoros","id":"6ffa921c-b5c2-42c1-92b0-07fb1bdaa092"}]},{"countryGroup2":[null]}];
        const wrapper = setup({}, {...initialState, countryGroupList});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'renderCountryGroupList');
        instance.renderCountryGroupList(rootIndex);
        const mock = jest.fn().mockReturnValue(coutntryStringView);
        translationService.arrayToStringView = mock;
        const result = translationService.arrayToStringView(country);
        expect(instance.renderCountryGroupList).toBeCalled();
        expect(result).toBe(coutntryStringView);
    });
    it('Sholud render Common Model', () => {
        const wrapper = setup({}, {...initialState});
        expect(wrapper.containsMatchingElement(<CommonModel />)).toBe(true);
    });
});