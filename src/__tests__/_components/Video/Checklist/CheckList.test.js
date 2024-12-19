import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import CheckListComp from '../../../../_components/Video/CheckList/CheckList';
import axios from "../../../../_helpers/axiosInstance";
import Config from "../../../../Config/config";
import { findByTestAttr } from '../../../../Utils';
import { constantText } from '../../../../_helpers/constants.text';
import BadgeBox from '../../../../_components/Common/BadgeBox/BadgeBox';
import CheckList from '../../../../_components/Common/PublishContent/CheckList';
import QuickLinks from '../../../../_components/Common/PublishContent/QuickLink';
import UnpublishedHistory from '../../../../_components/Common/PublishContent/UnPublishedHistory';

import jsonData from '../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json';


/**
 * Factory function to create a ShallowWrapper for the checklistcomp Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}) => {
  const wrapper = shallow(<CheckListComp {...props} />)
  return wrapper;
}

const baseURL = Config.BackendApiURL;

describe('<CheckListComp />', () => {
  let wrapper;
  const props = {
    jsonData : jsonData.CheckList
  }
  beforeEach(() => {
    wrapper = setup({...props});
    moxios.uninstall(axios);
  });
  const event = { target: { name: 'xyz', value: '123'}}
  afterEach(() => {
    moxios.uninstall(axios);
  });

  it('Should Render CheckList', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Should call ComponentDidMount", (done) => {
    wrapper.instance().componentDidMount();
    moxios.stubRequest('https://dev-zee5api.kelltontech.net/api/v1.0/master/ContentState', {
      status: 200,
      responseText: ''
    })
    axios.get('https://dev-zee5api.kelltontech.net/api/v1.0/master/ContentState')
      .then(res => {
        console.log(res)
        expect(res.status).toBe(200)
      })
      .finally(done)
  })

  it("Should Render Checklist Wrapper", () => {
    const checklistWrapper = findByTestAttr(wrapper, 'checklistWrapper');
    expect(checklistWrapper.exists()).toBe(true)
  })

  it("Should Render Checklist Text", () => {
    const checklistWrapper = findByTestAttr(wrapper, 'checklistText');
    expect(checklistWrapper.text()).toMatch(constantText.checkList_text)
  })

  it("Should Render BadgeBox Component", () => {
    wrapper.setState({ status: 'Draft' });
    const component = wrapper.find(BadgeBox);
    expect(component.length).toBe(1);
  })

  it("Should Render Child Checklist Component", () => {
    const props = {
      checkListArr:constantText.movie_checkList_arr,
      markAsDoneText:constantText.details_full_done_text,
      partialltDoneText:constantText.details_partially_done_text
    }
    const component = shallow(<CheckList {...props} />)
    expect(component.exists()).toBe(true);
  })

  it("Should Render QuickLinks Component", () => {
    const componentInstance = wrapper.instance();
    const props = {
      assignedLang: [],
      keyText: 'title',
      canPublish: false,
      showTranslation: true,
      showRelatedContent: true,
      showCollectionAssignment: true,
      showHideOtherLangModel: jest.fn(),
      translationDone: false,
      relatedContentDone: false,
      collectionAssignmentDone: false,
      status: 'Draft',
      disableReviewButton: false,
      showReviewButton: true,
      submitToReviewAction: jest.fn()
    }
    const component = shallow(<QuickLinks {...props} />);
    expect(component.exists()).toBe(true);
    jest.spyOn(componentInstance, 'submitToReview');
    componentInstance.submitToReview();
    expect(componentInstance.submitToReview).toHaveBeenCalled();
    jest.spyOn(componentInstance, 'showHideOtherLangModel');
    componentInstance.showHideOtherLangModel(false);
    expect(componentInstance.showHideOtherLangModel).toHaveBeenCalled();
  })

  it('Should Render UnPublish History Component', () => {
    const componentInstance = wrapper.instance();
    jest.spyOn(componentInstance, 'getUnPublishHistoryComp');
    componentInstance.getUnPublishHistoryComp();
    expect(componentInstance.getUnPublishHistoryComp).toHaveBeenCalled();
    let data = {
      country: [{title: 'test', id: 133}, {title: 'test1', id: 122}]
    }
    wrapper.setState({unPublishedHistory: data})
    wrapper.update();
    const component = wrapper.find(UnpublishedHistory);
    expect(component.length).toBe(0);
  })

  it('should test getVideoDetails', () => {
    jest.spyOn(wrapper.instance(), 'getVideoDetails');
    wrapper.instance().getVideoDetails();
    expect(wrapper.instance().getVideoDetails).toBeCalled();
  })

  it('should test getAllStatus', () => {
    jest.spyOn(wrapper.instance(), 'getAllStatus');
    wrapper.instance().getAllStatus();
    expect(wrapper.instance().getAllStatus).toBeCalled();
  })

  it('should test getAllStatesStatus', () => {
    jest.spyOn(wrapper.instance(), 'getAllStatus');
    wrapper.instance().getAllStatus();
    expect(wrapper.instance().getAllStatus).toBeCalled();
  })

  it('should test getAllCountrys', () => {
    jest.spyOn(wrapper.instance(), 'getAllCountrys');
    wrapper.instance().getAllCountrys();
    expect(wrapper.instance().getAllCountrys).toBeCalled();
  })

  it('should test checkTranslationStatus', () => {
    jest.spyOn(wrapper.instance(), 'checkTranslationStatus');
    wrapper.instance().checkTranslationStatus();
    expect(wrapper.instance().checkTranslationStatus).toBeCalled();
  })

  it('should test getTranslationStatus', () => {
    const mockSet = {
      translationObj : {
        translationMarkDone: false,
        translationPublish: true
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), 'getTranslationStatus');
    wrapper.instance().getTranslationStatus();
    expect(wrapper.instance().getTranslationStatus).toBeCalled();
  })

  it('should test getLanguageList', () => {
    jest.spyOn(wrapper.instance(), 'getLanguageList');
    wrapper.instance().getLanguageList();
    expect(wrapper.instance().getLanguageList).toBeCalled();
  })

  it('should test getVideoHistory', () => {
    jest.spyOn(wrapper.instance(), 'getVideoHistory');
    wrapper.instance().getVideoHistory();
    expect(wrapper.instance().getVideoHistory).toBeCalled();
  })

  it('should check handleMultiSelect', () => {
    jest.spyOn(wrapper.instance(), 'handleMultiSelect');
    wrapper.instance().handleMultiSelect(event, 123);
    expect(wrapper.instance().handleMultiSelect).toBeCalled();
});

  it('should test addRemoveSchedule', () => {
    jest.spyOn(wrapper.instance(), 'addRemoveSchedule');
    wrapper.instance().addRemoveSchedule(event , 0);
    expect(wrapper.instance().addRemoveSchedule).toBeCalled();
  })

  it('should test showHideOtherLangModel', () => {
    jest.spyOn(wrapper.instance(), 'showHideOtherLangModel');
    wrapper.instance().showHideOtherLangModel();
    expect(wrapper.instance().showHideOtherLangModel).toBeCalled();
  })

  it('should test showHideDeleteScheduleModel', () => {
    jest.spyOn(wrapper.instance(), 'showHideDeleteScheduleModel');
    wrapper.instance().showHideDeleteScheduleModel();
    expect(wrapper.instance().showHideDeleteScheduleModel).toBeCalled();
  })

  it('should test showHideUnPublishedModel', () => {
    jest.spyOn(wrapper.instance(), 'showHideUnPublishedModel');
    wrapper.instance().showHideUnPublishedModel();
    expect(wrapper.instance().showHideUnPublishedModel).toBeCalled();
  })

  it('should test submitToReview', () => {
    jest.spyOn(wrapper.instance(), 'submitToReview');
    wrapper.instance().submitToReview();
    expect(wrapper.instance().submitToReview).toBeCalled();
  })

  it('should test showProfileModelAlert', () => {
    jest.spyOn(wrapper.instance(), 'showProfileModelAlert');
    wrapper.instance().showProfileModelAlert();
    expect(wrapper.instance().showProfileModelAlert).toBeCalled();
  })

  it('should test handleModel', () => {
    jest.spyOn(wrapper.instance(), 'handleModel');
    wrapper.instance().handleModel();
    expect(wrapper.instance().handleModel).toBeCalled();
  })

  it('should test closeModel', () => {
    jest.spyOn(wrapper.instance(), 'closeModel');
    wrapper.instance().closeModel();
    expect(wrapper.instance().closeModel).toBeCalled();
  })
  
  it('should test publishContent', () => {
    jest.spyOn(wrapper.instance(), 'publishContent');
    wrapper.instance().publishContent();
    expect(wrapper.instance().publishContent).toBeCalled();
  })

  it('should test UnPublishContent', () => {
    jest.spyOn(wrapper.instance(), 'UnPublishContent');
    wrapper.instance().UnPublishContent();
    expect(wrapper.instance().UnPublishContent).toBeCalled();
  })

  it('should test scheduleContent', () => {
    jest.spyOn(wrapper.instance(), 'scheduleContent');
    wrapper.instance().scheduleContent();
    expect(wrapper.instance().scheduleContent).toBeCalled();
  })

  it('should test publishScheduledContent', () => {
    jest.spyOn(wrapper.instance(), 'publishScheduledContent');
    wrapper.instance().publishScheduledContent();
    expect(wrapper.instance().publishScheduledContent).toBeCalled();
  })

})