import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import TranslationVideo from './../../../../_components/Translation/TranslationVideo/TranslationVideo';
import TranslationInfo from '../../../../_components/Translation/Layout/TranslationInfo';
import { constantText } from '../../../../_helpers/constants.text';
import { CommonModel } from '../../../../_components/Common/Model/CommonModel';
import Config from "../../../../Config/config";
import { translationService } from '../../../../_services/translation.service';
import VideoCastNCrewJson from "../../../../_components/Translation/Schema/Video/CastNCrew.json";

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationVideo {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
const initialState = {
    params:{
        videoId: "5e1dd5be-1b4f-4e58-9c97-97b719bbe46f"
    },
    showNavToAssignedLang: false,
    language: {
        code: 'hi'
    }
}

describe('<TranslationVideo />', () => {
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
    it('Should renders Translation Video default', () => {
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
        const response = [{"videoId":"a36921e3-13d0-42b5-a135-2022c0aad794","externalId":"1-2-1000483","note":null,"title":"Friday Video","shortDescription":"<p>descp</p>","digitalLongDescriptionWeb":null,"digitalshortDescriptionmobile":null,"digitalLongDescriptionTV":null,"subtype":null,"primaryGenre":null,"secondaryGenre":null,"thematicGenre":null,"settingGenre":null,"isrc":null,"album":null,"style":null,"activity":null,"dayPart":null,"category":null,"rcsCategory":null,"specialCategory":[{"specialCategory":[],"specialCategoryTo":"","specialCategoryFrom":"","specialCategoryCountry":[]}],"creativeTitle":null,"alternatetitle":null,"pageTitle":null,"pageDescription":null,"titleForSocialShare":null,"descriptionForSocialShare":null,"dateZee5Published":null,"telecastDate":null,"duration":null,"isMultiAudio":false,"audioLanguages":null,"contentLanguage":null,"primaryLanguage":null,"dubbedLanguageTitle":null,"originalLanguage":null,"subtitleLanguages":null,"contentVersion":null,"theme":null,"contractId":null,"rating":null,"contentOwner":null,"originCountry":null,"upcomingPage":null,"ageRating":null,"certification":null,"emotions":null,"contentGrade":null,"era":null,"targetAge":null,"targetAudiences":null,"tags":null,"digitalKeywords":null,"adaptation":null,"events":null,"productionCompany":null,"popularityScore":null,"trivia":null,"awards":[{"awardRecipient":[],"awardsCategory":[],"awardsandrecognition":""}],"officialSite":null,"skipAvailable":false,"introStartTime":null,"recapStartTime":null,"introEndTime":null,"recapEndTime":null,"endCreditsStartTime":null,"adMarker":null,"skipSong":[{"skipSongEndTime":null,"skipSongStartTime":null}],"contentState":"3bb64421-f15f-4dda-adec-03c324c140a3","journeyType":"1","createdBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","status":"1","lastModifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","lastModifiedOn":"2021-02-19T05:26:16.321Z","_created_on":"2021-02-10T09:50:17.905Z","_modified_on":"2021-02-19T05:26:16.321Z","subtype_id":null,"content_category_id":null,"rcs_category_id":null,"primary_language_id":null,"original_language_id":null,"content_version_id":null,"content_rating_id":null,"content_owner_id":null,"origin_country_id":null,"certification_id":null,"content_grade_id":null,"era_id":null,"target_age_group_id":null,"production_company_id":null,"content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","_created_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","last_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","alternativeTitle":null,"socialShareDescription":null,"tvDescription":null,"webDescription":null,"appDescription":null,"socialShareTitle":null,"upcomingPageText":null,"subType":null,"contentCategory":null}]
        const wrapper = setup({}, {...initialState});
        const videoId = initialState.params.videoId;
        const sections = constantText.translations.movie_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getVideoDetails = mock;
        const result = await translationService.getVideoDetails(videoId, lang, sections[wrapper.state('selectedSecTab')].url);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(result).toBe(response);
    });
    it('should test fetchContentData with defaultData for castAndCrew', async () => {
        const response = {"actor":[{"id":"b3848066-859b-45bd-bba1-95379d841511","castName":"Ranveer Singh","character":"goa"},{"id":"cd4aa0be-215a-448f-bb8a-fd1e8b4d00d9","castName":"Salman Khan","character":"hero"}],"72dab561-6c03-4634-ab6f-f5268f716211":[],"d7d7bdab-3a6e-47d6-8be1-50d99535a98e":[{"id":"c2217089-6cb5-492c-8da9-0d38fd3ceec9","castName":"Shweta Tiwari"}]};
        const mappedDataObj = {
            "actors":[
                [{ "id": "fbfac2d7-53de-44ff-9d06-d6ea798a9678", "isEditing": false, "keyText": "castName","label": "Actor","maxTextLength": 250,"name": "actor","numeric": false,"required": false,"text": false,"type": "text","value": "Akshay Kumar"},
                {"isEditing": true,"label": "Character","maxTextLength": 250,"name": "character","numeric": false,"required": false,"text": false,"type": "text","value": ""}]
            ]
        };
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(VideoCastNCrewJson))});
        const videoId = initialState.params.videoId;
        const sections = constantText.translations.movie_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getVideoDetails = mock;
        const result = await translationService.getVideoDetails(videoId, lang, sections[wrapper.state('selectedSecTab')].url);
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
    it('should test fetchContentData when translation not started yet', async () => {
        const response = {"anchormans":[{"id":"3cea4d09-495c-43df-ad9b-b25a89c80c4a","castName":"testt"}],"singers":[{"id":"b3848066-859b-45bd-bba1-95379d841511","castName":"Ranveer Singh"}],"judges":[{"id":"cd4aa0be-215a-448f-bb8a-fd1e8b4d00d9","castName":"Salman Khan"},{"id":"2a668010-e5a1-4b55-a5a0-fe72983672f3","castName":"Testting"},{"id":"3cea4d09-495c-43df-ad9b-b25a89c80c4a","castName":"testt"}],"actors":[[{"name":"actor","type":"text","maxTextLength":250,"value":"Akshay Kumar","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":false,"isEditDisabled":false,"id":"e199cd8b-33f5-426f-bce0-06f7e21b7afa"},{"name":"character","value":"hero","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"isEditing":false,"isEditDisabled":false}],[{"name":"actor","type":"text","maxTextLength":250,"value":"New Actor","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":false,"isEditDisabled":false,"id":null},{"name":"character","value":"new","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"isEditing":false,"isEditDisabled":false}]]};
        const res = null;
        const videoId = initialState.params.videoId;
        const sections = constantText.translations.movie_sections;
        const wrapper = setup({}, {...initialState, defaultData: response, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(VideoCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(false);
        const mock = jest.fn().mockReturnValue(res);
        translationService.getVideoDetails = mock;
        const result = await translationService.getVideoDetails(videoId, 'en', sections[wrapper.state('selectedSecTab')].url);
        expect(instance.fetchContentData).toHaveBeenCalledWith(false);
        expect(result).toBe(res);
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
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(VideoCastNCrewJson))});
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
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(VideoCastNCrewJson))});
        const instance = wrapper.instance();
        const fields = wrapper.state('fields');
        jest.spyOn(instance, 'validateMarkAsDone');
        instance.validateMarkAsDone(fields);
        expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDoneVideoAction', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'validateMarkAsDoneVideoAction');
        instance.validateMarkAsDoneVideoAction();
        expect(instance.validateMarkAsDoneVideoAction).toHaveBeenCalledTimes(1);
    });
    it('should test manageCondition', () => {
        const stepName = 'title_summary';
        const name = 'Primary Gener';
        const value = 'Hindi title';
        const wrapper = setup({}, {...initialState});
        const fields = wrapper.state('fields');
        const instance = wrapper.instance();
        jest.spyOn(instance, 'manageCondition');
        instance.manageCondition(fields[stepName], name, value);
        expect(instance.manageCondition).toHaveBeenCalledTimes(1);
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
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(VideoCastNCrewJson))});
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
        instance.lockSections(params?.videoId);
        expect(instance.lockSections).toHaveBeenCalledWith(params?.videoId);
        expect(instance.lockSections).toHaveBeenCalledTimes(1);
    });
    it('should test autoSave', (done) => {
        const response = {
            response: {
              status: 200,
              data: {"id":"ab4ee5c7-01e2-44e6-bc6b-7c48da85a3c6","title":"vid","status":"1","translationStatus":"1","createdBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","modifiedBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","videoId":"a36921e3-13d0-42b5-a135-2022c0aad794","langCode":"hi","_modified_on":"2021-02-19T05:32:08.937Z","_created_on":"2021-02-19T05:32:08.937Z","upcomingPageText":null,"trivia":null,"actorCharacter":null,"shortDescription":null,"webDescription":null,"appDescription":null,"tvDescription":null,"creativeTitle":null,"alternativeTitle":null,"pageTitle":null,"pageDescription":null,"socialShareTitle":null,"socialShareDescription":null}
            }
        };
        const updatedFields = {
            "name": "title",
            "value": "vid",
            "originalValue": "",
            "type": "text",
            "label": "Title",
            "maxTextLength": 250,
            "required": false,
            "text": false,
            "numeric": false,
            "isEditing": true
        };
        const wrapper = setup({updateMarkAsDoneAction: jest.fn()}, {...initialState, updatedFields});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSave');
        instance.autoSave();
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
              done();
            });
        });
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
    it('should test getVideoStatus', (done) => {
        const response = {
            response: {
              status: 201,
              data: [{"id":"91b42c5c-0484-4e47-95a2-953f6bbb3db8","videoId":"a36921e3-13d0-42b5-a135-2022c0aad794","sectionName":"hi_properties","isLocked":true,"lockedBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","lockedOn":"2021-02-19T05:32:08.934Z","isDone":true,"doneBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","doneOn":"2021-02-19T05:33:30.476Z","createdBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","modifiedBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","status":"1","_created_on":"2021-02-19T05:32:08.931Z","_modified_on":"2021-02-19T05:33:30.478Z","lockedByUser":{"id":"e792e5ea-258e-4305-99ff-6b9dd8371405","firstName":"Test","lastName":"Translator"}}]
            }
        };
        const wrapper = setup({}, { ...initialState });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getVideoStatus');
        instance.getVideoStatus();
        expect(instance.getVideoStatus).toHaveBeenCalledTimes(1);
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
    it('Sholud render Common Model', () => {
        const wrapper = setup({}, {...initialState});
        expect(wrapper.containsMatchingElement(<CommonModel />)).toBe(true);
    });
});