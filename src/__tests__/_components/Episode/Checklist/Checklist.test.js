import React from 'react';
import {shallow,ShallowWrapper} from 'enzyme';
import moxios from 'moxios';

import {findByTestAttr} from '../../../../Utils';
import CheckListComp from '../../../../_components/Episode/Checklist/Checklist';
import { constantText } from '../../../../_helpers/constants.text';
import BadgeBox from '../../../../_components/Common/BadgeBox/BadgeBox';
import CheckList from '../../../../_components/Common/PublishContent/CheckList';
import QuickLinks from "../../../../_components/Common/PublishContent/QuickLink";
import PublishedHistory from "../../../../_components/Common/PublishContent/PublishedHistory";
import UnpublishedHistory from '../../../../_components/Common/PublishContent/UnPublishedHistory';
import PublishContent from '../../../../_components/Common/PublishContent/PublishContent';
import axios from "../../../../_helpers/axiosInstance";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const wrapper = shallow(<CheckListComp {...props}/>)
  return wrapper;
}


describe("CheckList Component", () => {
  let wrapper;
  beforeEach(()=>{
    moxios.install(axios)
    wrapper = setup();
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("Should Render CheckList Component",  () => {
    expect(wrapper.exists()).toBe(true);
  })

  it("Should call getEpisodeDetails API", (done) => {
    const response = {
      response: {
        status: 200,
        data: {
          contentState: {
            value: {
              title: "Draft", id: "21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe"
            }
          },
        }
      }
    }
    wrapper.instance().getEpisodeDetails();
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().status).toBe('Draft');
        done()
      });
    });
  })

  it("Should call getSeasonHistory API", (done) => {
    const response = {
      response: {
        status: 200,
        data: {
          publish: {country: []},
          schedule: [{country: [{id: "4fb82f84-3140-4d95-9519-1fa7ba884869", title: "Italy"}]}],
          unpublish: {country: [{id: "c387e93c-0394-499e-be33-84a3ce1b445b", title: "Vietnam"}]}
        }
      }
    }
    wrapper.instance().getSeasonHistory();
    moxios.wait(function () {
      const request2 = moxios.requests.mostRecent();
      request2.respondWith(response).then((res) => {
        expect(wrapper.state().scheduleHistory).toHaveLength(1);
        done()
      });
    })
  })

  it("Should call getAllCountrys API", (done) => {
    const response = {
      response: {
        status: 201,
        data: [
          {id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India"}
        ]
      }
    }
    wrapper.instance().getAllCountrys();
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().allCountries).toHaveLength(1);
        done()
      });
    })
  })

  it("Should call getAllStatus API", (done) => {
    const response = {
      response: {
        status: 201,
        data: [
           {title: "Archived", status: "1", id: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51"},
           {title: "Changed", status: "1", id: "38c34c4f-68c9-4eb0-b71f-b80f1e551447"},
           {title: "Draft", status: "1", id: "3bb64421-f15f-4dda-adec-03c324c140a3"},
           {title: "Need Work", status: "1", id: "38c34c4f-68c9-4eb0-b71f-b80f1e551448"},
           {title: "Published", status: "1", id: "081cc5b2-a302-4bfb-8e5c-68544ae636e6"},
           {title: "Publishing Queue", status: "1", id: "4e565298-6e9c-4d5f-8a03-c23a42cabedd"},
           {title: "Scheduled", status: "1", id: "3951d801-9758-4a09-be3e-0af342ba9d13"},
           {title: "Submitted To Review", status: "1", id: "38c34c4f-68c9-4eb0-b71f-b80f1e551446"},
           {title: "Unpublished", status: "1", id: "21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe"}
        ]
      }
    }
    wrapper.instance().getAllStatus();
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
        request.respondWith(response).then((res) => {
        expect(wrapper.state().allStatus).toHaveLength(9);
        done()
      });
    })
  })

  it("Should call getAllStatesStatus API", (done) => {
    const response = {
      response: {
        status: 201,
        data: [
          {id: "6c0aba29-72fc-493e-af61-b33d9ae63f83", isDone: true, sectionName: "related_content"},
          {id: "6c0aba29-72fc-493e-af61-b33d9ae63f23", isDone: true, sectionName: "collection_assignment"}
        ]
      }
    }
    const tvShowId = 'c49ee5bc-4289-49cb-a998-0b58732daf88';
    wrapper.instance().getAllStatesStatus(tvShowId);
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
        request.respondWith(response).then((res) => {
        expect(wrapper.state().collectionAssignmentDone).toBe(true);
        done()
      });
    })
  })

  it("Should call getLanguageList API", (done) => {
    const response = {
      response: {
        status: 201,
        data: {
          assigned: [
             {id: "49006dbd-71ff-41a1-abe3-8277702ed0f2", code: "hr", title: "Bhojpuri"},
             {id: "eb4c9b92-0a9f-44fd-b4dd-f9e8f5628726", code: "fr", title: "French"},
             {id: "86e0e39c-6e0e-4f30-9400-f771ba0e503c", code: "de", title: "German"}
          ],
          unassigned: [
            {id: "14b29f2c-d179-400f-b524-d3a80248c8cc", code: "ar", title: "Arabic"},
            {id: "7f7a0f2a-dae7-4535-bc56-86545d384268", code: "as", title: "Assamese"},
            {id: "1007afb0-65ea-4978-bd51-21b0f3b05c20", code: "id", title: "Bahasa (Indonesia)"},
            {id: "49728102-8b14-4453-91a2-18abe2a837e9", code: "bn", title: "Bengali"}
          ]
        }
      }
    }
    wrapper.instance().getLanguageList();
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
        request.respondWith(response).then((res) => {
        expect(wrapper.state().assignedLang).toHaveLength(3);
        expect(wrapper.state().otherLang).toHaveLength(4);
        done()
      });
    })
  })

  it("Should Render Checklist and Checklist Heading", async() => {
    const checkListHeading = findByTestAttr(wrapper, 'checklistText');
    const checkListWrapper = findByTestAttr(wrapper, 'checklistWrapper');
    expect(checkListWrapper.exists()).toBe(true);
    expect(checkListHeading.text()).toMatch(constantText.checkList_text);
  })

  it("Should Render BadgeBox", async() => {
    wrapper.setState({status: 'Test'});
    const component = wrapper.find(BadgeBox);
    expect(component.length).toBe(1);
  })

  it("Should Not Render BadgeBox", async() => {
    wrapper.setState({status: null});
    const component = wrapper.find(BadgeBox);
    expect(component.length).toBe(0);
  })

  it("Should Render Child CheckList Component with props", () => {
    const props = {
      checkListArr: constantText.tvShowsConstants.tvShows_checkList_arr,
      markAsDoneText: constantText.details_full_done_text,
      partialltDoneText: constantText.details_partially_done_text
    }
    const checkListComponent = shallow(<CheckList {...props}/>);
    expect(checkListComponent.length).toBe(1);
  })

  it("Should Render QuickLinks Child Component with Props", () => {
    const mockFunction = jest.fn();
    const props = {
      assignedLang: constantText.tvShowsConstants.tvShows_checkList_arr,
      keyText: 'Title',
      canPublish: true,
      showTranslation: true,
      showRelatedContent: true,
      showCollectionAssignment: true,
      showHideOtherLangModel: mockFunction,
      translationDone: false,
      relatedContentDone: false,
      collectionAssignmentDone: false,
      collectionAssignmentDone: false,
      status: 'Test',
      showTabs: true,
      tabOptions: constantText.tvShowsConstants.tvShow_Season_Episodes_Tab,
      selectedTab: 0,
      tabHandlerChange: mockFunction,
      getStatusTabData: mockFunction,
      disableReviewButton: false,
      showReviewButton: true,
      submitToReviewAction: mockFunction
    }
    const quicklinksComponent = shallow(<QuickLinks {...props}/>);
    expect(quicklinksComponent.length).toBe(1);
  })

  it("Should Render Publish History", () => {
    wrapper.instance().getPublishHistoryComp();
    const publishHistoryData = [
      {id: 1, title: 'test1'},
      {id: 2, title: 'test2'},
    ]
    wrapper.setState({publishHistory: publishHistoryData});
    const publishHistoryWrapper = findByTestAttr(wrapper, 'publishCanpublishHistory');
    expect(publishHistoryWrapper.exists()).toBe(true);
    const checkListHeading = findByTestAttr(wrapper, 'publishScheduleHeading');
    expect(checkListHeading.text()).toMatch(constantText.published_or_scheduled_content_text);
    const props = {
      className: 'm-b-30',
      publishContent: jest.fn(),
      status: 'test',
      canPublish: false,
      publishHistory: [
          { id: 1, title: 'history 1' },
          { id: 2, title: 'history 2' },
        ]
    }
    const publishedHistoryComponent = shallow(<PublishedHistory {...props}/>);
    expect(publishedHistoryComponent.length).toBe(1);
  })

  it('Should Render Unpublish History', () => {
    const props = {
      className: 'm-b-30',
      unPublishedHistory: {
        country: [
          { id: 1, title: 'Country 1' },
          { id: 2, title: 'Country 2' }
        ]
      }
    }
    const unPublishedHistoryComponent = shallow(<UnpublishedHistory {...props}/>);
    expect(unPublishedHistoryComponent.length).toBe(1);
  })

  it("Should Render Publish Component", () => {
    wrapper.instance().getPublishComp();
    const props = {
      countryData: [{id: 1, title: 'Country1'},{id: 2, title: 'Country2'}],
      selectedCountry: [{id: 1, title: 'Country1'},{id: 2, title: 'Country2'}],
      handleMultiSelect:jest.fn(), multiple: true, keyText:"title",canPublish:false, publishAction:jest.fn(),
      remainingCountryData:[{id: 1, title: 'Country1'},{id: 2, title: 'Country2'}]
    }
    const publishContentComponent = shallow(<PublishContent {...props} />);
    expect(publishContentComponent.length).toBe(1);
  })

  it("Should call Publish Content Function", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'publishContent');
    instance.publishContent();
    expect(instance.publishContent).toHaveBeenCalledTimes(1);
  })

  it("Should call checkTranslationStatus Content Function", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkTranslationStatus');
    instance.checkTranslationStatus();
    expect(instance.checkTranslationStatus).toHaveBeenCalledTimes(1);
  })



  it("Should call UnPublishContent Content Function", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'UnPublishContent');
    instance.UnPublishContent();
    expect(instance.UnPublishContent).toHaveBeenCalledTimes(1);
  })

  it("Should call scheduleContent Content Function", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'scheduleContent');
    instance.scheduleContent();
    expect(instance.scheduleContent).toHaveBeenCalledTimes(1);
  })





})