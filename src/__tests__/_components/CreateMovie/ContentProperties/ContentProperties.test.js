import React from "react";
import Enzyme, { shallow } from "enzyme";

import ContentProperties from "../../../../_components/CreateMovie/ContentProperties/ContentProperties";
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';
import Adapter from "enzyme-adapter-react-16";
import { expect, jest } from "@jest/globals";

import {findByTestAttr} from '../../../../Utils';
 
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ContentProperties {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("ContentProperties", () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let renderSpy, componentDidMountSpy;
  const props = {
    currentTabData: {
      isDone: false,
      isLocked: false,
      label: "Content Properties",
      lockedBy: "",
      permissionKey: "movies",
      permissionName: "canUpdate",
      permissionSubKey: "contentPropertiesModule",
      properties: true,
      quickFiling: true,
      singleLanding: true,
    },
    setStage: jest.fn(),
    getExternalId: jest.fn(),
    setTitle: jest.fn(),
    state: "quick-filing",
    unLockedSession: jest.fn(),
    movieId:'xyz',
    jsonData: jsonData.ContentProperties
  };

  const dataObj = {
    duration: "13:34:46",
    introStartTime: "12:33:45",
    skipAvailable: true,
    contentState: {
      id: "3bb64421-f15f-4dda-adec-03c324c140a3",
      title: "Draft",
    },
  };

  const stateArr = [
    {
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      keyText: "title",
      label: "Special Category",
      multiple: true,
      name: "specialCategory",
      path: "/master/SpecialCategory",
      type: "dropdownAsync",
      validation: { required: false },
      value: [],
    },
    {
      col: "col-md-6 col-lg-6",
      data: [],
      errorText: "",
      groupBy: "group",
      keyText: "title",
      label: "Country/Group for Special Category",
      multiple: true,
      name: "specialCategoryCountry",
      path: "user/country-group",
      type: "dropdownAsync",
      validation: { required: false },
      value: [],
    }];

  const updatedObj = {
    specialCategory: [],
    specialCategoryCountry: [],
    specialCategoryFrom: "",
    specialCategoryTo: "",
  };
  const baseState = {
    player: [
      {
        col: "col-md-6 col-lg-6",
        errorText: "",
        isChanged: false,
        label: "Skip Available",
        labelPlacement: "end",
        name: "skipAvailable",
        type: "checkbox",
        validation: { required: false },
        value: true,
      },
      {
        col: "col-md-6 col-lg-6",
        errorText: "",
        isChanged: false,
        label: "Intro Start Time",
        name: "introStartTime",
        type: "time",
        validation: { required: false },
        value: "13:20:23",
      }],
      title_summary: [
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Skip Available",
          labelPlacement: "end",
          name: "skipAvailable",
          type: "checkbox",
          validation: { required: false },
          value: [{test: 'test'}],
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Intro Start Time",
          name: "introStartTime",
          type: "time",
          validation: { required: false },
          value: "13:20:23",
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: null,
          isChanged: false,
          label: "Intro End Time",
          name: "introEndTime",
          type: "time",
          validation: { required: false },
          value: null,
        },
      ],
  };

  const element = {
    col: "col-md-6 col-lg-6",
    errorText: "",
    isChanged: false,
    label: "Special Category - To Timeline",
    multiple: true,
    name: "specialCategoryTo",
    placeholder: "DD/MM/YYYY HH:MM",
    type: "datetime-local",
    validation: { required: false, minDate: "sameOrAfter" },
    value: "",
    withTime: true,
  };

  beforeEach(() => {
    wrapper = setup({ ...props });
    wrapper.setState({ ...baseState });
    renderSpy = jest.spyOn(ContentProperties.prototype, "render");
    componentDidMountSpy = jest.spyOn(
      ContentProperties.prototype,
      "componentDidMount"
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should renders default", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should check getControlFieldData method", () => {
    jest.spyOn(wrapper.instance(), "getControlFieldData");
    wrapper.instance().getControlFieldData();
    expect(wrapper.instance().getControlFieldData).toBeCalled();
  });

  it("should check fetchContentData method", () => {
    jest.spyOn(wrapper.instance(), "fetchContentData");
    wrapper.instance().fetchContentData();
    expect(wrapper.instance().fetchContentData).toBeCalled();
  });

  it("should test updateValues method with params", () => {
    jest.spyOn(wrapper.instance(), "updateValues");
    wrapper.instance().updateValues(dataObj);
    expect(wrapper.instance().updateValues).toBeCalled();
  });

  it("should check updateArrValue method with params", () => {
    jest.spyOn(wrapper.instance(), "updateArrValue");
    wrapper.instance().updateArrValue(stateArr, updatedObj);
    expect(wrapper.instance().updateArrValue).toBeCalled();
  });

  it("should check checkValidation", () => {
    const value = "2021-02-06T02:37";
    const checkRequired = false;
    jest.spyOn(wrapper.instance(), "checkValidation");
    wrapper.instance().checkValidation(value, element, checkRequired);
    expect(wrapper.instance().checkValidation).toBeCalled();
  });

  it("should check checkValidation value as object", () => {
    const value = [
      {
        id: "01e686be-71ca-4355-b8e6-a85d6b4b6118",
        status: "1",
        title: "Fresh arrival",
      },
    ];
    const checkRequired = false;
    jest.spyOn(wrapper.instance(), "checkValidation");
    wrapper.instance().checkValidation(value, element, checkRequired);
    expect(wrapper.instance().checkValidation).toBeCalled();
  });

  it("should check filterSecondaryGenreData with rootIndex", () => {
    const options = [{ id: "123", test: "test" }];
    const instance = wrapper.instance();
    jest.spyOn(instance, "filterSecondaryGenreData");
    instance.filterSecondaryGenreData("title_summary", null, options);
    expect(instance.filterSecondaryGenreData).toBeCalled();
  });

  it("should check filterDubbedAndPrimaryLang method", () => {
    const options = [{ id: "123", test: "test" }];
    const instance = wrapper.instance();
    jest.spyOn(instance, "filterDubbedAndPrimaryLang");
    instance.filterDubbedAndPrimaryLang(
      "title_summary",
      null,
      options,
      "dubbedLanguageTitle"
    );
    expect(instance.filterDubbedAndPrimaryLang).toBeCalled();
  });

  it("should check setSelectDataArr method", () => {
    const data = [
      { title: "Celebration", status: "1", id: "d4818f6b-4866-46af-bb9b-674eb079ee61" },
      { title: "Chill", status: "1", id: "b2e61c3e-1cf7-4a41-a873-69d370d652ef" },
      { title: "Drive", status: "1", id: "536266d1-83d2-4106-a66c-9e03f56d821e" }
    ];
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectDataArr");
    instance.setSelectDataArr("title_summary", null, 1, data);
    expect(instance.setSelectDataArr).toBeCalled();
  });

  it("should check setSelectDataArr method", () => {
    const data = [
      { title: "Celebration", status: "1", id: "d4818f6b-4866-46af-bb9b-674eb079ee61" },
      { title: "Chill", status: "1", id: "b2e61c3e-1cf7-4a41-a873-69d370d652ef" },
      { title: "Drive", status: "1", id: "536266d1-83d2-4106-a66c-9e03f56d821e" }
    ];
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectDataArr");
    instance.setSelectDataArr("title_summary", null, 1, data);
    expect(instance.setSelectDataArr).toBeCalled();
  });

  it("should check manageCondition", () => {
    const value = [{ title: "Fresh arrival", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118" }];
    const instance = wrapper.instance();
    jest.spyOn(instance, "manageCondition");
    instance.manageCondition("title_summary", "specialCategory", value);
    expect(instance.manageCondition).toBeCalled();
  });

  it("should check manageConditionForTime", () => {
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "manageConditionForTime");
    instance.manageConditionForTime(
      null, 'title_summary', 'ZEE5'
    );
    expect(instance.manageConditionForTime).toBeCalled();
  });

  it("should check manageConditionForTime with rootIndex", () => {
    const baseState = {
      player: [
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Skip Available",
          labelPlacement: "end",
          name: "skipAvailable",
          type: "checkbox",
          validation: { required: false },
          value: true,
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Intro Start Time",
          name: "introStartTime",
          type: "time",
          validation: { required: false },
          value: "13:20:23",
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: null,
          isChanged: false,
          label: "Intro End Time",
          name: "introEndTime",
          type: "time",
          validation: { required: false },
          value: null,
        },
      ],
    };
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "manageConditionForTime");
    instance.manageConditionForTime(
      0,
      "player",
      "Intro Start Time",
      "13:11:55"
    );
    expect(instance.manageConditionForTime).toBeCalled();
  });

  it("should check manageConditionForDuration", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "manageConditionForDuration");
    instance.manageConditionForDuration("Recap Start Time", "13:15:16");
    expect(instance.manageConditionForDuration).toBeCalled();
  });

  it("should check manageConditionForSkipSong", () => {
    const baseState = {
      skip_song: [[
        {
          col: "col-md-6 col-lg-6",
          errorText: null,
          isChanged: false,
          label: "Skip Song Start Time",
          name: "skipSongStartTime",
          type: "time",
          validation: { required: false },
          value: "14:19:19",
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "Skip Song End Time can not be less than Intro Start Time",
          isChanged: true,
          label: "Skip Song End Time",
          name: "skipSongEndTime",
          type: "time",
          validation: { required: false },
          value: null,
        },
      ]],
      startTime: "13:20:20",
    };
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "manageConditionForSkipSong");
    instance.manageConditionForSkipSong(0, "skipSongEndTime", "13:15:16");
    expect(instance.manageConditionForSkipSong).toBeCalled();
  });

  it("should check manageConditionForSkipAvailabel", () => {
    const baseState = {
      isSkipAvailable: false,
      player: [
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Skip Available",
          labelPlacement: "end",
          name: "skipAvailable",
          type: "checkbox",
          validation: { required: false },
          value: true,
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Intro Start Time",
          name: "introStartTime",
          type: "time",
          validation: { required: false },
          value: "13:20:23",
        },
      ],
      skip_song: [[
        {
          col: "col-md-6 col-lg-6",
          errorText: null,
          isChanged: false,
          label: "Skip Song Start Time",
          name: "skipSongStartTime",
          type: "time",
          validation: { required: false },
          value: "14:19:19",
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "Skip Song End Time can not be less than Intro Start Time",
          isChanged: true,
          label: "Skip Song End Time",
          name: "skipSongEndTime",
          type: "time",
          validation: { required: false },
          value: null,
        },
      ]],
    };
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "manageConditionForSkipAvailabel");
    instance.manageConditionForSkipAvailabel();
    expect(instance.manageConditionForSkipAvailabel).toBeCalled();
  });

  it("should check addRemoveSkipSong", () => {
    const baseState = {
      skip_song: [[
        {
          col: "col-md-6 col-lg-6",
          errorText: null,
          isChanged: false,
          label: "Skip Song Start Time",
          name: "skipSongStartTime",
          type: "time",
          validation: { required: false },
          value: "14:19:19",
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "Skip Song End Time can not be less than Intro Start Time",
          isChanged: true,
          label: "Skip Song End Time",
          name: "skipSongEndTime",
          type: "time",
          validation: { required: false },
          value: null,
        },
      ]],
      skipFieldArr: [
        {
          col: "col-md-6 col-lg-6",
          errorText: null,
          isChanged: false,
          label: "Skip Song Start Time",
          name: "skipSongStartTime",
          type: "time",
          validation: { required: false },
          value: "14:19:19",
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "Skip Song End Time can not be less than Intro Start Time",
          isChanged: true,
          label: "Skip Song End Time",
          name: "skipSongEndTime",
          type: "time",
          validation: { required: false },
          value: null,
        },
      ],
    };
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "addRemoveSkipSong");
    instance.addRemoveSkipSong(0);
    expect(instance.addRemoveSkipSong).toBeCalled();
  });

  it('should test addRemoveSpecialCategory', () => {
    const baseState = {
      specialCategory: [
        {
          col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "title",
          label: "Special Category", multiple: true, name: "specialCategory", path: "/master/SpecialCategory",
          type: "dropdownAsync", validation: { required: false }, value: [{ title: "Fresh arrival", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118" }]
        },
        {
          col: "col-md-6 col-lg-6", data: [], errorText: "", groupBy: "group", isChanged: false, keyText: "title",
          label: "Country/Group for Special Category", multiple: true, name: "specialCategoryCountry", path: "user/country-group", type: "dropdownAsync",
          validation: { required: false }, value: []
        }
      ],
      specialCategoryArr: [
        {
          col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "title",
          label: "Special Category", multiple: true, name: "specialCategory", path: "/master/SpecialCategory",
          type: "dropdownAsync", validation: { required: false }, value: [{ title: "Fresh arrival", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118" }]
        },
        {
          col: "col-md-6 col-lg-6", data: [], errorText: "", groupBy: "group", isChanged: false, keyText: "title",
          label: "Country/Group for Special Category", multiple: true, name: "specialCategoryCountry", path: "user/country-group", type: "dropdownAsync",
          validation: { required: false }, value: []
        }
      ]
    }
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "addRemoveSpecialCategory");
    instance.addRemoveSpecialCategory(0);
    expect(instance.addRemoveSpecialCategory).toBeCalled();
  })

  it('should cheeck addRemoveAwards', () => {
    const baseState = {
      awardFieldArr: [
        {
          "name": "awardRecipient",
          "type": "SearchableWithCreate",
          "col": "col-md-6 col-lg-6",
          "value": [],
          "multiple": true,
          "path": "/cast-names",
          "label": "Recipient Name",
          "keyText": "castName",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false,
            "isChar": true
          }
        },
        {
          "name": "awardsCategory",
          "col": "col-md-6 col-lg-6",
          "value": [],
          "type": "dropdownAsync",
          "multiple": true,
          "label": "Award Category",
          "keyText": "title",
          "path": "/master/AwardCategory",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        },
        {
          "name": "awardsandrecognition",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "type": "text",
          "label": "Award/Honour",
          "errorText": "",
          "validation": {
            "required": false,
            "maxLength": 250,
            "ischaracterValidateWithComma": true
          }
        }],
      awards: [
        {
          "name": "awardRecipient",
          "type": "SearchableWithCreate",
          "col": "col-md-6 col-lg-6",
          "value": [],
          "multiple": true,
          "path": "/cast-names",
          "label": "Recipient Name",
          "keyText": "castName",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false,
            "isChar": true
          }
        },
        {
          "name": "awardsCategory",
          "col": "col-md-6 col-lg-6",
          "value": [],
          "type": "dropdownAsync",
          "multiple": true,
          "label": "Award Category",
          "keyText": "title",
          "path": "/master/AwardCategory",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        },
        {
          "name": "awardsandrecognition",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "type": "text",
          "label": "Award/Honour",
          "errorText": "",
          "validation": {
            "required": false,
            "maxLength": 250,
            "ischaracterValidateWithComma": true
          }
        }]
    }
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "addRemoveAwards");
    instance.addRemoveAwards(0);
    expect(instance.addRemoveAwards).toBeCalled();
  })

  it('should check addRemoveGroupWise', () => {
    const baseState = {
      groupWiseArr: [
        {
          "name": "groupCountry",
          "type": "dropdownAsync",
          "col": "col-md-6 col-lg-6",
          "value": [],
          "multiple": true,
          "label": "Group / Country",
          "keyText": "title",
          "path": "/master/Country",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        },
        {
          "name": "dateRelease",
          "value": "",
          "col": "col-md-6 col-lg-6",
          "type": "date",
          "label": "ZEE5 Release Date",
          "errorText": "",
          "validation": {
            "required": false,
            "minDate": "sameOrAfter"
          }
        },
        {
          "name": "subtitleLanguage",
          "type": "dropdownAsync",
          "col": "col-md-6 col-lg-6",
          "value": [],
          "multiple": true,
          "label": "Subtitle Language",
          "keyText": "title",
          "path": "/master/Language",
          "data": [],
          "errorText": "",
          "validation": {
            "required": false
          }
        }
      ],
      groupWiseTitle: [
        [
          {
            "name": "groupCountry",
            "type": "dropdownAsync",
            "col": "col-md-6 col-lg-6",
            "value": [],
            "multiple": true,
            "label": "Group / Country",
            "keyText": "title",
            "path": "/master/Country",
            "data": [],
            "errorText": "",
            "validation": {
              "required": false
            }
          },
          {
            "name": "dateRelease",
            "value": "",
            "col": "col-md-6 col-lg-6",
            "type": "date",
            "label": "ZEE5 Release Date",
            "errorText": "",
            "validation": {
              "required": false,
              "minDate": "sameOrAfter"
            }
          },
          {
            "name": "subtitleLanguage",
            "type": "dropdownAsync",
            "col": "col-md-6 col-lg-6",
            "value": [],
            "multiple": true,
            "label": "Subtitle Language",
            "keyText": "title",
            "path": "/master/Language",
            "data": [],
            "errorText": "",
            "validation": {
              "required": false
            }
          }
        ]]
    }
    wrapper.setState({ ...baseState });
    const instance = wrapper.instance();
    jest.spyOn(instance, "addRemoveGroupWise");
    instance.addRemoveGroupWise(0);
    expect(instance.addRemoveGroupWise).toBeCalled();
  })

  it('should check formatValue', () => {
    const value = {
      id: "9a6412f2-6862-47ef-8a07-9dde2a9a2731", status: "1", title: "Animation"
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, "formatValue");
    instance.formatValue(value, false);
    expect(instance.formatValue).toBeCalled();
  })

  it('should check formatValue', () => {
    const value = [{
      id: "9a6412f2-6862-47ef-8a07-9dde2a9a2731", status: "1", title: "Animation"
    }]
    const instance = wrapper.instance();
    jest.spyOn(instance, "formatValue");
    instance.formatValue(value, true);
    expect(instance.formatValue).toBeCalled();
  })

  it('should check formatData', () => {
    const data = [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "castName", label: "Recipient Name", multiple: true,
      name: "awardRecipient", path: "/cast-names", type: "SearchableWithCreate", validation: { required: false, isChar: true }, value: []
    }, {
      col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "title", label: "Award Category", multiple: true,
      name: "awardsCategory", path: "/master/AwardCategory", type: "dropdownAsync", validation: { required: false }, value: []
    }]
    const instance = wrapper.instance();
    jest.spyOn(instance, "formatData");
    instance.formatData(data, true);
    expect(instance.formatData).toBeCalled();
  })

  it('should check handleTab', () => {
    const tabData = [
      { label: "Title Summary", done: false },
      { label: "Classification", done: false },
      { label: "Player Attributes", done: false },
      { label: "Control Fields", done: false }
    ]
    wrapper.setState({ tabData })
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleTab");
    instance.handleTab(null, 3);
    expect(instance.handleTab).toBeCalled();
  })
  
  it('should check getSinglePageUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getSinglePageUI");
    instance.getSinglePageUI();
    expect(instance.getSinglePageUI).toBeCalled();
  })

  it('should check getQuickFilingUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getQuickFilingUI");
    instance.getQuickFilingUI();
    expect(instance.getQuickFilingUI).toBeCalled();
  })

  it('should check getMovieUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getMovieUI");
    instance.getMovieUI();
    expect(instance.getMovieUI).toBeCalled();
  })

  it('should check getControlFieldUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getControlFieldUI");
    instance.getControlFieldUI();
    expect(instance.getControlFieldUI).toBeCalled();
  })

  it('should check getPlayerAttributeUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getPlayerAttributeUI");
    instance.getPlayerAttributeUI();
    expect(instance.getPlayerAttributeUI).toBeCalled();
  })

  it('should check getClassificationUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getClassificationUI");
    instance.getClassificationUI();
    expect(instance.getClassificationUI).toBeCalled();
  })

  it('should check getTitleSummaryUI', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "getTitleSummaryUI");
    instance.getTitleSummaryUI();
    expect(instance.getTitleSummaryUI).toBeCalled();
  })

  it('should check showHideLockPopup', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "showHideLockPopup");
    instance.showHideLockPopup();
    expect(instance.showHideLockPopup).toBeCalled();
  })

  it('should check markAsDone', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "markAsDone");
    instance.markAsDone();
    expect(instance.markAsDone).toBeCalled();
  })

  it('should check handleSearchableInput', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleSearchableInput");
    instance.handleSearchableInput(null, 0, 0, 'player');
    expect(instance.handleSearchableInput).toBeCalled();
  })

  it('should check selectCountryGroup', () => {
    const baseState = {
      specialCategory: [[
        {
          col: "col-md-6 col-lg-6",
          data: [],
          errorText: "",
          isChanged: false,
          keyText: "title",
          label: "Special Category",
          multiple: true,
          name: "specialCategory",
          path: "/master/SpecialCategory",
          type: "dropdownAsync",
          validation: { required: false },
          value: [{ title: "Fresh arrival", id: "01e686be-71ca-4355-b8e6-a85d6b4b6118" }]
        },
        {
          col: "col-md-6 col-lg-6",
          data: [{ id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66", title: "Singapore", code: "SG", status: "1", group: "Others" },
          { id: "468fd8ff-afa3-4245-8dc8-25ba230dfabd", title: "Sri Lanka", code: "LK", status: "1", group: "Others" },
          { id: "1f9ec5c0-56f5-4776-a61a-d8ecaad6d0f7", title: "Thailand", code: "TH", status: "1" }],
          errorText: "",
          groupBy: "group",
          isChanged: true,
          keyText: "title",
          label: "Country/Group for Special Category",
          multiple: true,
          name: "specialCategoryCountry",
          path: "user/country-group",
          type: "dropdownAsync",
          validation: { required: false },
          value: [{ id: "1f9ec5c0-56f5-4776-a61a-d8ecaad6d0f7", title: "Thailand", code: "TH" }]
        },
        {
          col: "col-md-6 col-lg-6",
          errorText: "",
          isChanged: false,
          label: "Special Category - From Timeline",
          multiple: true,
          name: "specialCategoryFrom",
          placeholder: "DD/MM/YYYY HH:MM",
          type: "datetime-local",
          validation: { required: false, minDate: "sameOrAfter" },
          value: "2021-02-04T01:31",
          withTime: true
        },
      ]],
    };
    wrapper.setState({ ...baseState });
    const event = { target: { name: 'mock' } }
    const instance = wrapper.instance();
    jest.spyOn(instance, "selectCountryGroup");
    instance.selectCountryGroup(event, 'Others', 'specialCategory', 0, 1);
    expect(instance.selectCountryGroup).toBeCalled();
  })

  it('should check autoSave', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "autoSave");
    instance.autoSave();
    expect(instance.autoSave).toBeCalled();
  })

  it('should check formatAllData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "formatAllData");
    instance.formatAllData();
    expect(instance.formatAllData).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should check addTag', () => {
    const data = [{id: ''}];
    jest.spyOn(wrapper.instance(), 'addTag');
    wrapper.instance().addTag(data);
    expect(wrapper.instance().addTag).toBeCalled();
  })

  it('should check handleStateChange', () => {
    const event = { target: { value: 'test' } };
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, 0, 1, 'player');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check handleStateChange else condition', () => {
    const event = { target: { value: 'test' } };
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, null, null, 'player');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check handleStateChange for published', () => {
    const stage= { title: 'Published' }
    wrapper.setState({stage})
    const event = { target: { value: 'test' } };
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, null, 0, 'player');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check handleStateChange for Unpublished', () => {
    const stage= { title: 'Unpublished' }
    wrapper.setState({stage})
    const event = { target: { value: 'test' } };
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, null, 0, 'player');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check handleStateChange for Submitted To Review', () => {
    const stage= { title: 'Submitted To Review' }
    wrapper.setState({stage})
    const event = { target: { value: 'test' } };
    jest.spyOn(wrapper.instance(), 'handleStateChange');
    wrapper.instance().handleStateChange(event, null, 0, 'player');
    expect(wrapper.instance().handleStateChange).toBeCalled();
  })

  it('should check showHideLockPopup onclick method', () => {
    const props = {
      currentTabData: {
        isLocked: true
      }
    }
    wrapper.setProps({ ...props });
    const spy = jest.spyOn(wrapper.instance(), 'showHideLockPopup');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = wrapper.find('.loc-icon');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check markAsDone onclick method', () => {
    wrapper.setState({ canMarkAsDone: true });
    const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'markAsDoneBtn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
  
  it('should check componentWillUnmount ', () => {
    jest.spyOn(wrapper.instance(), 'componentWillUnmount');
    wrapper.instance().componentWillUnmount();
    expect(wrapper.instance().componentWillUnmount).toBeCalled();
  })
});
