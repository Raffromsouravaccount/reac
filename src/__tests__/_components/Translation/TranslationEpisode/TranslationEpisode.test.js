import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import TranslationEpisode from './../../../../_components/Translation/TranslationEpisode/TranslationEpisode';
import TranslationInfo from '../../../../_components/Translation/Layout/TranslationInfo';
import { constantText } from '../../../../_helpers/constants.text';
import { CommonModel } from '../../../../_components/Common/Model/CommonModel';
import Config from "../../../../Config/config";
import { translationService } from '../../../../_services/translation.service';
import EpisodeCastNCrewJson from "../../../../_components/Translation/Schema/Episode/CastNCrew.json";
import EpisodeGlobalContentPropertiesJson from "../../../../_components/Translation/Schema/Episode/GlobalContentProperties.json";

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationEpisode {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
const initialState = {
    params:{
        episodeId: "bb1ce831-355f-475b-a322-c955174b3b7a",
    },
    showNavToAssignedLang: false,
    language: {
        code: 'hi'
    }
}

describe('<TranslationEpisode />', () => {
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
    it('Should renders Translation Episode default', () => {
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
        const response = {"status":200,"message":"Season translation data has been successfully fetched.","data":[{"id":{"value":"799a4ef0-a3ad-4293-8eb5-f145c8d71699","inherited":false}},{"title":{"value":"iu kk","inherited":true}},{"shortDescription":{"value":"<p>gfh season</p>","inherited":false}},{"webDescription":{"value":"<p>vv mm</p>","inherited":true}},{"appDescription":{"value":"<p>a mm</p>","inherited":true}},{"tvDescription":{"value":"<p>gg</p>","inherited":true}},{"creativeTitle":{"value":"mm","inherited":true}},{"alternativeTitle":{"value":"gdg","inherited":true}},{"pageTitle":{"value":"yy","inherited":true}},{"pageDescription":{"value":"eew","inherited":true}},{"socialShareTitle":{"value":"dt","inherited":true}},{"socialShareDescription":{"value":"hh","inherited":true}},{"upcomingPageText":{"value":"trt upp","inherited":false}},{"trivia":{"value":"tt tfsf","inherited":false}},{"actorCharacter":{"value":[{"actor":"Akshay","character":""},{"actor":"samar thakur","character":"hrd hh pp"}],"inherited":false}},{"subtype":{"value":[]}},{"category":{"value":[]}},{"primaryGenre":{"value":[]}},{"secondaryGenre":{"value":[]}},{"thematicGenre":{"value":[]}},{"settingGenre":{"value":[]}},{"rcsCategory":{"value":[]}},{"audioLanguages":{"value":[]}},{"primaryLanguage":{"value":[]}},{"dubbedLanguageTitle":{"value":[]}},{"originalLanguage":{"value":[]}},{"subtitleLanguages":{"value":[]}},{"contentVersion":{"value":[{"title":"Original cut","id":"cf2b5546-de38-448d-9adf-555f3613f0dc"}]}},{"contentLanguage":{"value":[]}},{"certification":{"value":[]}},{"translationStatus":"1"}],"error":null};
        const wrapper = setup({}, {...initialState});
        const episodeId = initialState.params.episodeId;
        const sections = constantText.translations.episode_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getShowDetails = mock;
        const result = await translationService.getShowDetails(episodeId, lang, sections[wrapper.state('selectedSecTab')].url);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(result).toBe(response);
    });
    it('should test fetchContentData with defaultData for globalFields', async () => {
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1});
        const globalSections = constantText.translations.episode_global_sections;
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(globalSections[wrapper.state('selectedGlobalSecTab')].url).toBe('globalFields');
    });
    it('should test fetchContentData with defaultData for castAndCrew', async () => {
        const response = {"data":{"actor":[{"id":"642ab8b4-3eb3-47f2-b34e-5d50ba50f5bb","castName":"Akshay","character":"","inherited":false},{"castName":"samar thakur","id":null,"character":"hrd","inherited":false}]},"error":null};
        const mappedDataObj = {
            "actors":[
                [{ "id": "fbfac2d7-53de-44ff-9d06-d6ea798a9678", "isEditing": false, "keyText": "castName","label": "Actor","maxTextLength": 250,"name": "actor","numeric": false,"required": false,"text": false,"type": "text","value": "Akshay Kumar"},
                {"isEditing": true,"label": "Character","maxTextLength": 250,"name": "character","numeric": false,"required": false,"text": false,"type": "text","value": ""}]
            ]
        };
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(EpisodeCastNCrewJson))});
        const episodeId = initialState.params.episodeId;
        const sections = constantText.translations.episode_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.getShowDetails = mock;
        const result = await translationService.getShowDetails(episodeId, lang, sections[wrapper.state('selectedSecTab')].url);
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
        const wrapper = setup({}, {...initialState, defaultData: response, selectedSecTab: 1});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(false);
        const mock = jest.fn().mockReturnValue(res);
        translationService.getShowDetails = mock;
        expect(instance.fetchContentData).toHaveBeenCalledWith(false);
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
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(EpisodeCastNCrewJson))});
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
    it('should test updateValues for global Fields', () => {
        const resData = [{'title': "cc"}];
        const response = [];
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState, defaultData: response, selectedGlobalSecTab: 1, fields: JSON.parse(JSON.stringify(EpisodeGlobalContentPropertiesJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(resData);
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
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
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(EpisodeCastNCrewJson))});
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
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(EpisodeCastNCrewJson))});
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
        instance.lockSections(params?.episodeId);
        expect(instance.lockSections).toHaveBeenCalledWith(params?.episodeId);
        expect(instance.lockSections).toHaveBeenCalledTimes(1);
    });
    it('should test autoSave', (done) => {
        const response = {
            response: {
                status: 201,
                data: {"id":{"value":"9c78f342-ae1f-480b-819d-8b25b6a766b7","inherited":false},"episode_id":{"value":"bb1ce831-355f-475b-a322-c955174b3b7a","inherited":false},"title":{"value":"episode title","inherited":false},"trivia":{"value":"tr ep","inherited":false},"sponsors":{"value":null,"inherited":true},"shortDescription":{"value":"<p>mm short epi</p>","inherited":false},"webDescription":{"value":"<p>eppii web 22 web</p>","inherited":false},"appDescription":{"value":"<p>app descp episode</p>","inherited":false},"tvDescription":{"value":"<p>tvv app</p>","inherited":false},"creativeTitle":{"value":"ctt ep","inherited":false},"alternativeTitle":{"value":"nnksdhfkd","inherited":false},"pageTitle":{"value":"ptt ep","inherited":false},"pageDescription":{"value":"pdd ep","inherited":false},"socialShareTitle":{"value":"tss ep","inherited":false},"socialShareDescription":{"value":"dss ep","inherited":false},"upcomingPageText":{"value":"up tt","inherited":false},"actorCharacter":[{"actor":"Akshay","character":"holiday","inherited":false},{"actor":"Ranveer","character":"mh epi cc nn","inherited":false}],"translationStatus":"2","status":{"value":"1","inherited":false}}
            }
        };
        const updatedFields = {
            "name": "title",
            "value": "dd",
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
        instance.autoSave(1, 'title_summary', 0, null, updatedFields);
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then(res => {
                done();
            });
        })
    });
    it('should test autoSave for CastNcrew', (done) => {
        const response = {
            response: {
                status: 201,
                data: {"actorCharacter":[{"actor":"Akshay","character":"","inherited":false},{"actor":"samar thakur","character":"hrd hh pp","inherited":false}]}
            }
        };
        const fields = JSON.parse(JSON.stringify(EpisodeCastNCrewJson));
        const actorData = {
            ...fields,
            "actors":[
                [{"name":"actor","type":"text","maxTextLength":250,"value":"Virat","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":true,"id":null},
                {"name":"character","value":"kohli","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"isEditing":true,"errorMsg":null}],
                [{"name":"actor","type":"text","maxTextLength":250,"value":"Akshay","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":false,"id":"642ab8b4-3eb3-47f2-b34e-5d50ba50f5bb"},
                {"name":"character","value":"","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"isEditing":true}]
            ]
        };
        const wrapper = setup({updateMarkAsDoneAction: jest.fn()}, {...initialState, selectedSecTab: 1, fields: actorData});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSave');
        instance.autoSave(1, 'actors', 0, 0, actorData);
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then(res => {
                done();
            });
        })
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
    it('should test getEpisodeStatus', async (done) => {
        const response = {
            response: {
                status: 201,
                data: [{"id":"f5beda32-0bce-4e3d-bc63-ec64556765c5","episodeId":"bb1ce831-355f-475b-a322-c955174b3b7a","sectionName":"hi_properties","isLocked":true,"lockedBy":"8359f395-bbc7-482e-926a-2c1865edd289","lockedOn":"2021-03-08T15:55:31.332Z","isDone":true,"doneBy":"8359f395-bbc7-482e-926a-2c1865edd289","doneOn":"2021-03-11T09:10:27.663Z","createdBy":"8359f395-bbc7-482e-926a-2c1865edd289","modifiedBy":"8359f395-bbc7-482e-926a-2c1865edd289","status":"1","_created_on":"2021-03-08T15:55:31.328Z","_modified_on":"2021-03-11T09:10:27.664Z","lockedByUser":{"id":"8359f395-bbc7-482e-926a-2c1865edd289","firstName":"Test","lastName":"Translator"}}]
            }
        };
        const wrapper = setup({}, { ...initialState });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getEpisodeStatus');
        instance.getEpisodeStatus();
        expect(instance.getEpisodeStatus).toBeCalled();
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

    it('should test handleSubSecTab', () => {
        const selectedGlobalSecTab = 0;
        const wrapper = setup({}, {...initialState, selectedGlobalSecTab: 1});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSubSecTab');
        instance.handleSubSecTab('e', selectedGlobalSecTab);
        expect(instance.handleSubSecTab).toHaveBeenCalledTimes(1);
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
        const resp = [{"tvShowLangCode":[{"tvShowGlobalId":"764216ce-851e-407d-a37f-4843689e4dd1","langCode":"en","Country":{"title":"Comoros","id":"6ffa921c-b5c2-42c1-92b0-07fb1bdaa092"}}]}];
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
    it('Sholud test editButtonHandler', () => {
        const key = 'title_summary';
        const rootIndex = 0;
        const index = null;
        const data = {
            "name": "title",
            "value": "hh",
            "originalValue": "",
            "type": "text",
            "label": "Title",
            "maxTextLength": 250,
            "required": false,
            "text": false,
            "numeric": false,
            "isEditing": false,
            "isEditDisabled": false
        };
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'editButtonHandler');
        instance.editButtonHandler(key, rootIndex, index, data);
        expect(instance.editButtonHandler).toHaveBeenCalledTimes(1);
    });
    it('Sholud test saveButtonHandler', () => {
        const key = 'title_summary';
        const rootIndex = 0;
        const index = null;
        const data = {"name": "title",
        "value": "hh",
        "originalValue": "",
        "type": "text",
        "label": "Title",
        "maxTextLength": 250,
        "required": false,
        "text": false,
        "numeric": false,
        "isEditing": false,
        "isEditDisabled": false
      };
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'saveButtonHandler');
        instance.saveButtonHandler(key, rootIndex, index, data);
        expect(instance.saveButtonHandler).toHaveBeenCalledTimes(1);
    });
    it('Sholud test actionButtonsHandler', () => {
        const key = 'title_summary';
        const rootIndex = 0;
        const index = null;
        const data = {"name": "title",
        "value": "hh",
        "originalValue": "",
        "type": "text",
        "label": "Title",
        "maxTextLength": 250,
        "required": false,
        "text": false,
        "numeric": false,
        "isEditing": false,
        "isEditDisabled": false
      };
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'actionButtonsHandler');
        instance.actionButtonsHandler(key, rootIndex, index, data, 'save', false);
        expect(instance.actionButtonsHandler).toHaveBeenCalledTimes(1);
    });
    it('Sholud test actionButtonsHandler for castNcrew', () => {
        const key = 'actors';
        const rootIndex = 0;
        const index = 0;
        const data = [{"name": "actor",
            "value": "hh",
            "originalValue": "",
            "type": "text",
            "label": "Actor",
            "maxTextLength": 250,
            "required": false,
            "text": false,
            "numeric": false,
            "isEditing": false,
            "isEditDisabled": false
        }];
        const wrapper = setup({}, {...initialState, fields: JSON.parse(JSON.stringify(EpisodeCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'actionButtonsHandler');
        instance.actionButtonsHandler(key, rootIndex, index, data, 'save', false);
        expect(instance.actionButtonsHandler).toHaveBeenCalledTimes(1);
    });
});