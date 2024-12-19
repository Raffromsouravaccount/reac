import React from 'react';
import { shallow } from 'enzyme';

import CreateEditVideo from '../../../../_components/CreateMovie/CreateEditVideo/CreateEditVideo';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';
import { findByTestAttr } from '../../../../Utils';

import { expect, it, jest } from '@jest/globals';

const setup = (props = {}) => {
  const wrapper = shallow(<CreateEditVideo {...props} />);
  return wrapper;
}

describe('CreateEditVideo', () => {
  let wrapper;
  const state = {
    status: 'Draft'
  }
  const baseProps = {
    currentTabData: {
      isDone: false,
      isLocked: false,
      label: "Cast & Crew",
      lockedBy: "",
      permissionKey: "movies",
      properties: true,
      quickFiling: false,
      singleLanding: false,
      movieId: 123
    },
    unLockedSession: jest.fn(),
    getVideo: jest.fn(),
    selectedTab: jest.fn(),
    jsonData: jsonData.Video
  }
  beforeEach(() => {
    wrapper = setup({ ...baseProps });
    wrapper.setProps({ jsonData: baseProps.jsonData  })
    wrapper.setState({ ...state });
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check setSelectDataArr', () => {
    const res = [{
      id: "dcdd1bca-4edd-4e6d-accd-2a5b015403cc",
      status: "1",
      title: "Connected"
    }, {
      id: "7d2fa466-8e90-45f3-a484-f7532e80f627",
      status: "1",
      title: "High"
    }]
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setSelectDataArr');
    instance.setSelectDataArr(res, 0);
    expect(instance.setSelectDataArr).toBeCalled();
  })

  it('should check autoSave method', () => {
    const mockJSON = [{
      col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Audio Track", name: "dashSuffixesId",
      type: "text", validation: { maxLength: 250, isChar: true, required: false }, value: [], touched: 1, valid: true
    }, {
      col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Sub Title", name: "mediathekFileUid",
      touched: 1, type: "text", valid: true, validation: { maxLength: 250, isChar: true, required: false }, value: [{ id: '123' }]
    }, {
      col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Dash Root Folder", name: "dashSuffixesId", type: "text",
      validation: { maxLength: 250, isAlphaNumericWithSpecialChars: true, required: true }, value: "test"
    }]
    wrapper.setState({ JSONSchema: mockJSON, contentId: 'abc' });
    jest.spyOn(wrapper.instance(), 'autoSave');
    wrapper.instance().autoSave(1);
    expect(wrapper.instance().autoSave).toBeCalled();
  })

  it("checkIfMarkAsDone method ", () => {
    const event = { target: { value: 'test', name: 'input' } }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkIfMarkAsDone');
    instance.checkIfMarkAsDone(event, 0);
    expect(instance.checkIfMarkAsDone).toBeCalled();
  });

  it('should test componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it('should test getMovieDetails', () => {
    const mockSet = {
      movieId: "a317ef15-ead5-4f0c-92f5-27364e6f6807",
      externalId: "1-1-1000001",
      note: null,
      title: "No Title",
      shortDescription: null,
      adMarker: null,
      adaptation: null,
      ageRating: null,
      alternatetitle: null,
      audioLanguages: null,
      awards: null,
      category: null,
      certification: null,
      contentGrade: null,
      contentLanguage: null,
      contentOwner: null,
      contentState: { title: "Draft", id: "3bb64421-f15f-4dda-adec-03c324c140a3" },
      contentVersion: null,
      contractId: null,
      controlFields: {
        createdBy: "Sandeep Kumar",
        createdOn: "2021-02-16T06:29:54.044Z",
        modifiedBy: "Sandeep Kumar",
        modifiedOn: "2021-02-16T06:54:52.581Z"
      },
      creativeTitle: null,
      dateZee5Published: null,
      descriptionForSocialShare: null,
      digitalKeywords: null,
      digitalLongDescriptionTV: null,
      digitalLongDescriptionWeb: null,
      digitalshortDescriptionmobile: null,
      dubbedLanguageTitle: null,
      duration: null,
      emotions: null,
      endCreditsStartTime: null,
      era: null,
      events: null,
      introEndTime: null,
      introStartTime: null,
      isMultiAudio: null,
      journeyType: "1",
      lastModifiedBy: "e792e5ea-258e-4305-99ff-6b9dd8371405",
      lastModifiedOn: "2021-02-16T06:54:52.581Z",
      last_modified_by: "e792e5ea-258e-4305-99ff-6b9dd8371405",
      officialSite: null,
      originCountry: null,
      originalLanguage: null,
      pageDescription: null,
      pageTitle: null,
      popularityScore: null,
      primaryGenre: null,
      primaryLanguage: null,
      productionCompany: null,
      rating: null,
      rcsCategory: null,
      recapEndTime: null,
      recapStartTime: null,
      secondaryGenre: null,
      settingGenre: null,
      shortDescription: null,
      skipAvailable: null,
      skipSong: null,
      specialCategory: null,
      status: "1",
      subtitleLanguages: null,
      subtype: null,
      tags: null,
      targetAge: null,
      targetAudiences: null,
      telecastDate: null,
      thematicGenre: null,
      theme: null,
      title: "No Title",
      titleForSocialShare: null,
      trivia: null,
      upcomingPage: null
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "getMovieDetails");
    instance.getMovieDetails(mockSet);
    expect(instance.getMovieDetails).toBeCalled();
  });

  it('should check importDetails', () => {
    wrapper.setState({ mediathekFileUidState: 'xyz123' });
    const res = { id: null }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'importDetails');
    instance.importDetails(res);
    expect(instance.importDetails).toBeCalled();
  });

  it('should check importDetails method with JSONSchema', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'importDetails');
    instance.importDetails(9);
    expect(instance.importDetails).toBeCalled();
  });

  it('should test fillMovieVideoDetails', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillMovieVideoDetails');
    instance.fillMovieVideoDetails();
    expect(instance.fillMovieVideoDetails).toHaveBeenCalledTimes(1);
  });

  it("should test unlockVideo", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "unlockVideo");
    instance.unlockVideo();
    expect(instance.unlockVideo).toHaveBeenCalledTimes(1);
  });

  it('should test toggleModel', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'toggleModel');
    instance.toggleModel();
    expect(instance.toggleModel).toHaveBeenCalledTimes(1);
  });

  it('should test showHideStatePopup', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideStatePopup');
    instance.showHideStatePopup();
    expect(instance.showHideStatePopup).toHaveBeenCalledTimes(1);
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });

  it("should test getVideo", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getVideo");
    instance.getVideo();
    expect(instance.getVideo).toHaveBeenCalledTimes(1);
  });

  it('should test checkIfMarkAsDone', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkIfMarkAsDone');
    instance.checkIfMarkAsDone();
    expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it('should test markAsDone', () => {

    const instance = wrapper.instance();
    jest.spyOn(instance, 'markAsDone');
    instance.markAsDone();
    expect(instance.markAsDone).toHaveBeenCalledTimes(1);
  });

  it('should check markAsDone onclick method', () => {
    wrapper.setState({ readyToDone: true });
    const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'markAsDoneB-Btn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should test submItVideo method', () => {
    const formData = {
      audioLanguages: [{}],
      subtitleLanguages: [{}],
      drmKeyId: '',
      totalSizeInBytes: 1,
      id: ''
    }
    wrapper.setState({ formData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'submItVideo');
    instance.submItVideo();
    expect(instance.submItVideo).toBeCalled();
  });

  it('should check InputChanger onChange method for Submit to Review status', () => {
    const mockJSON = [{
      name: "audioLanguage", value: "", col: "col-md-6 col-lg-6", type: "file", label: "Audio Track",
      errorText: "", validation: { maxLength: 250, isChar: true, required: false }
    }]
    const status = 'Submit to Review';
    wrapper.setState({ status, JSONSchema: mockJSON });
    jest.spyOn(wrapper.instance(), 'InputChanger');
    const event = { target: { value: 'test', files: [{ name: 'file' }] } };
    wrapper.instance().InputChanger(event, 0);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })

  it('should check InputChanger onChange method for drmKeyId', () => {
    const status = 'Unpublished';
    wrapper.setState({ status });
    jest.spyOn(wrapper.instance(), 'InputChanger');
    const event = { target: { value: 'test' } };
    wrapper.instance().InputChanger(event, 6);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })

  it('should check InputChanger onChange method for checkbox', () => {
    const status = 'Published';
    wrapper.setState({ status });
    jest.spyOn(wrapper.instance(), 'InputChanger');
    const event = { target: { value: 'test' } };
    wrapper.instance().InputChanger(event, 8);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })
  it('should check InputChanger onChange method for published', () => {
    const status = 'DraSubmit to Reviewft';
    wrapper.setState({ status });
    jest.spyOn(wrapper.instance(), 'InputChanger');
    const event = { target: { value: 'test' } };
    wrapper.instance().InputChanger(event, 8);
    expect(wrapper.instance().InputChanger).toBeCalled();
  })

})