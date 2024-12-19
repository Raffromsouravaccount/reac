import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import moxios from 'moxios'

import CheckListComp from '../../../../_components/CreateMovie/CheckList/CheckList';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CheckListComp {...props} />)
  return wrapper;
}

describe('CheckListComp', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let renderSpy, componentDidMountSpy;

  const state = {
    status: 'Archived',
    checkListDone: true,
    translationDone: true,
    scheduleArr: [{name: 'scheduleArr', value: 'scheduleArr'}]
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setState({ ...state })
    renderSpy = jest.spyOn(CheckListComp.prototype, 'render');
    componentDidMountSpy = jest.spyOn(CheckListComp.prototype, 'componentDidMount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders CheckListComp default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check showProfileModelAlert method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showProfileModelAlert');
    instance.showProfileModelAlert();
    expect(instance.showProfileModelAlert).toBeCalled();
  })

  it('should check showConfirmModal method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showConfirmModal');
    instance.showConfirmModal();
    expect(instance.showConfirmModal).toBeCalled();
  })

  it('should check serverCallsAction method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'serverCallsAction');
    instance.serverCallsAction();
    expect(instance.serverCallsAction).toBeCalled();
  })

  it('should check selectLanguage method', () => {
    const langObj = {
      code: "id",
      id: "1007afb0-65ea-4978-bd51-21b0f3b05c20",
      title: "Bahasa (Indonesia)"
    }
    const keyText = 'title';
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectLanguage');
    instance.selectLanguage(langObj, keyText);
    expect(instance.selectLanguage).toBeCalled();
  })

  it('should check render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toBeCalled();
  })

  it('should check getTranslationStatus', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getTranslationStatus');
    instance.getTranslationStatus();
    expect(instance.getTranslationStatus).toBeCalled();
  })

  it('should test  getPublishedUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getPublishedUI');
    instance.getPublishedUI();
    expect(instance.getPublishedUI).toHaveBeenCalledTimes(1);
  });

  it('should test componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it('should test getMovieDetails', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getMovieDetails');
    instance.getMovieDetails();
    expect(instance.getMovieDetails).toHaveBeenCalledTimes(1);
  });

  it('should test getMovieHistory', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getMovieHistory');
    instance.getMovieHistory();
    expect(instance.getMovieHistory).toHaveBeenCalledTimes(1);
  });

  it('should test getAllCountrys', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAllCountrys');
    instance.getAllCountrys();
    expect(instance.getAllCountrys).toHaveBeenCalledTimes(1);
  });

  it('should test getAllStatus', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAllStatus');
    instance.getAllStatus();
    expect(instance.getAllStatus).toHaveBeenCalledTimes(1);
  });

  it('should test getAllStatesStatus', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAllStatesStatus');
    instance.getAllStatesStatus();
    expect(instance.getAllStatesStatus).toHaveBeenCalledTimes(1);
  });

  it('should test getLanguageList with translationMarkDone', () => {
    const mockSet = { translationMarkDone: false, translationDone: false };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getLanguageList");
    instance.getLanguageList(mockSet);
    expect(instance.getLanguageList).toBeCalled();
  });

  it('should test addRemoveSchedule', () => {
    const mockSet = {
      countryData: [],
      scheduledPublicationTime: "",
      selectedCountry: []
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "addRemoveSchedule");
    instance.addRemoveSchedule(mockSet);
    expect(instance.addRemoveSchedule).toBeCalled();
  });

  it('should test getPublishHistoryComp', () => {
    const publishHistory = [{test: 'value'}];
    wrapper.setState({ publishHistory });
    const instance = wrapper.instance();
    jest.spyOn(instance, "getPublishHistoryComp");
    instance.getPublishHistoryComp();
    expect(instance.getPublishHistoryComp).toBeCalled();
  });

  it('should test showHideOtherLangModel', () => {
    const mockSet = { selectedLangArr: [], showOtherLangModel: false, contentId: "a317ef15-ead5-4f0c-92f5-27364e6f6807" }
    const instance = wrapper.instance();
    jest.spyOn(instance, "showHideOtherLangModel");
    instance.showHideOtherLangModel(mockSet);
    expect(instance.showHideOtherLangModel).toBeCalled();
  });

  it('should test showHidePublishedModel', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHidePublishedModel');
    instance.showHidePublishedModel();
    expect(instance.showHidePublishedModel).toHaveBeenCalledTimes(1);
  });

  it('should test showHideDeleteScheduleModel', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideDeleteScheduleModel');
    instance.showHideDeleteScheduleModel();
    expect(instance.showHideDeleteScheduleModel).toHaveBeenCalledTimes(1);
  });

  it('should test handleModel', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleModel');
    instance.handleModel();
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  });

  it('should test showProfileModelAlert', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showProfileModelAlert');
    instance.showProfileModelAlert();
    expect(instance.showProfileModelAlert).toHaveBeenCalledTimes(1);
  });

  it('should test publishContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'publishContent');
    instance.publishContent();
    expect(instance.publishContent).toHaveBeenCalledTimes(1);
  });

  it('should test UnPublishContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'UnPublishContent');
    instance.UnPublishContent();
    expect(instance.UnPublishContent).toHaveBeenCalledTimes(1);
  });

  it('should test scheduleContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'scheduleContent');
    instance.scheduleContent();
    expect(instance.scheduleContent).toHaveBeenCalledTimes(1);
  });

  it('should test publishScheduledContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'publishScheduledContent');
    instance.publishScheduledContent();
    expect(instance.publishScheduledContent).toHaveBeenCalledTimes(1);
  });

  it('should test needWorkAction', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'needWorkAction');
    instance.needWorkAction();
    expect(instance.needWorkAction).toHaveBeenCalledTimes(1);
  });

  it('should test serverCallsAction', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'serverCallsAction');
    instance.serverCallsAction();
    expect(instance.serverCallsAction).toHaveBeenCalledTimes(1);
  });

  it('should test updateServerCallsAction', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'updateServerCallsAction');
    instance.updateServerCallsAction();
    expect(instance.updateServerCallsAction).toHaveBeenCalledTimes(1);
  });

  it('should test deleteServerCallsAction', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'deleteServerCallsAction');
    instance.deleteServerCallsAction();
    expect(instance.deleteServerCallsAction).toHaveBeenCalledTimes(1);
  });

  it('should test showConfirmModal', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showConfirmModal');
    instance.showConfirmModal();
    expect(instance.showConfirmModal).toHaveBeenCalledTimes(1);
  });

  it('should test getPublishComp', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getPublishComp');
    instance.getPublishComp();
    expect(instance.getPublishComp).toHaveBeenCalledTimes(1);
  });

  it('should test getUnPublishHistoryComp', () => {
    const mockSet = { unPublishedHistory: [] };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getUnPublishHistoryComp");
    instance.getUnPublishHistoryComp(mockSet);
    expect(instance.getUnPublishHistoryComp).toBeCalled();
  });

  it('should test getAddScheduleComp', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAddScheduleComp');
    instance.getAddScheduleComp();
    expect(instance.getAddScheduleComp).toHaveBeenCalledTimes(1);
  });

  it('should test getScheduleComp', () => {
    const mockSet = { scheduleArr: [], checkListDone: true, translationDone: false, updateSch: false };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getScheduleComp");
    instance.getScheduleComp(mockSet);
    expect(instance.getScheduleComp).toBeCalled();
  });

  it('should test getScheduleHistoryComp', () => {
    const mockSet = { scheduleHistory: [], checkListDone: true, translationDone: false };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getScheduleHistoryComp");
    instance.getScheduleHistoryComp(mockSet);
    expect(instance.getScheduleHistoryComp).toBeCalled();
  });

  it('should test getUnPublishedUI', () => {
    const mockSet = {
      unPublishedCountryData: [],
      unPublishedSelCountryData: [],
      reasonData: ["License expired", "On Hold", "Missing metadata", "Missing video file", "Missing images", "Missing subtitle", "Legal issue"],
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getUnPublishedUI");
    instance.getUnPublishedUI(mockSet);
    expect(instance.getUnPublishedUI).toBeCalled();
  });

  it('should test checkSubmitReviewPermission', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkSubmitReviewPermission');
    instance.checkSubmitReviewPermission();
    expect(instance.checkSubmitReviewPermission).toBeCalled();
  });

  it('should test checkTranslationStatus', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkTranslationStatus');
    instance.checkTranslationStatus();
    expect(instance.checkTranslationStatus).toHaveBeenCalledTimes(1);
  });

  it('should test getTranslationStatus', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getTranslationStatus');
    instance.getTranslationStatus();
    expect(instance.getTranslationStatus).toHaveBeenCalledTimes(1);
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(3);
  });

  it('should test handleMultiSelect', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMultiSelect');
    instance.handleMultiSelect();
    expect(instance.handleMultiSelect).toHaveBeenCalledTimes(1);
  });

  it('should test closeModel', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'closeModel');
    instance.closeModel();
    expect(instance.closeModel).toHaveBeenCalledTimes(1);
  });

  it("should check the getUnPublishedUI with reasonData ", () => {
    const mockSet = ["License expired",
      "On Hold",
      "Missing metadata",
      "Missing video file",
      "Missing images",
      "Missing subtitle",
      "Legal issue"];
    const instance = wrapper.instance();
    jest.spyOn(instance, "getUnPublishedUI");
    instance.getUnPublishedUI(mockSet);
    expect(instance.getUnPublishedUI).toBeCalled();
  });

  it("should check the checkTranslationStatus with response ", () => {
    const mockSet = {
      assigned: [{
        translationStatus: '1', isDone: false
      }
      ],
      unassigned: [{
        id: "14b29f2c-d179-400f-b524-d3a80248c8cc", code: "ar", title: "Arabic"
      }]
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "checkTranslationStatus");
    instance.checkTranslationStatus(mockSet);
    expect(instance.checkTranslationStatus).toBeCalled();
  });

  it("should check the checkTranslationStatus with response ", () => {
    const mockSet = {
      assigned: [{
        translationStatus: '1', isDone: false
      }
      ],
      unassigned: [{
      }]
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "checkTranslationStatus");
    instance.checkTranslationStatus(mockSet);
    expect(instance.checkTranslationStatus).toBeCalled();
  });

  it("should check the getTranslationStatus with translationObj ", () => {
    const mockSet = {
      translationMarkDone: false,
      translationPublish: false
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getTranslationStatus");
    instance.getTranslationStatus(mockSet);
    expect(instance.getTranslationStatus).toBeCalled();
  });

  it("should check the UnPublishContent with allStatus", () => {
    const mockSet = [{ title: "Archived", status: "1", id: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51" }];
    const instance = wrapper.instance();
    jest.spyOn(instance, "UnPublishContent");
    instance.UnPublishContent(mockSet);
    expect(instance.UnPublishContent).toBeCalled();
  });

  it("should check the getAllStatesStatus with checklistArr", () => {
    const mockSet = [{
      done: false,
      doneKey: "contentPropertiesModule",
      label: "Content Properties",
      properties: true,
      quickFiling: true,
      singleLanding: true
    }];
    const instance = wrapper.instance();
    jest.spyOn(instance, "getAllStatesStatus");
    instance.getAllStatesStatus(mockSet);
    expect(instance.getAllStatesStatus).toBeCalled();
  });


  it("should check the showProfileModelAlert with model obj", () => {
    const mockSet = {
      btn1: "Yes",
      btn2: "No",
      desc: "",
      detail: "",
      disableBackdropClick: false,
      open: false,
      showBtn1: true,
      showBtn2: true
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "showProfileModelAlert");
    instance.showProfileModelAlert(mockSet);
    expect(instance.showProfileModelAlert).toBeCalled();
  });

  it("should check onClick method UnPublishContent", () => {
    const wrapper = setup();
    const spy = jest.spyOn(wrapper.instance(), "UnPublishContent");
    wrapper.find("#showHideUnPublishedModel").simulate("change");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should check onClick method showHideUnPublishedModel", () => {
    const wrapper = setup();
    const spy = jest.spyOn(wrapper.instance(), "showHideUnPublishedModel");
    wrapper.find("#showHideUnPublishedModel").simulate("change");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should check onClick method showHidePublishedModel", () => {
    const wrapper = setup();
    const spy = jest.spyOn(wrapper.instance(), "showHidePublishedModel");
    wrapper.find("#publishContentModel").simulate("change");
    expect(spy).not.toHaveBeenCalled();
  });

  it("should check onClick method publishContent", () => {
    const wrapper = setup();
    const spy = jest.spyOn(wrapper.instance(), "publishContent");
    wrapper.find("#publishContentModel").simulate("change");
    expect(spy).not.toHaveBeenCalled();
  });
  
  it('should test updateSchedule', () => {
    const event = {target: {name: 'updatedSchedule', value: 'test'}};
    const scheduleObj ={
      scheduledTime: '10/10/10',
      country: [{id: 'xyz12', title: 'IND'}],
      groupName: 'All'
    }
    jest.spyOn(wrapper.instance(), 'updateSchedule');
    wrapper.instance().updateSchedule(event, 0, scheduleObj);
    expect(wrapper.instance().updateSchedule).toBeCalled();
  })
  
  it('should test selectCountryGroup', () => {
    const selectedCountry = [{group: "All-Country", id: "eca10d71-c84a-46b5-a19a-7dd02c375fd7", title: "Poland"}]
    const event = {target: {name: 'selectCountryGroup', value: 'published'}}
    jest.spyOn(wrapper.instance(), 'selectCountryGroup');
    wrapper.instance().selectCountryGroup(event,'All-Country', '' , selectedCountry, "published" );
    expect(wrapper.instance().selectCountryGroup).toBeCalled();
  })

});