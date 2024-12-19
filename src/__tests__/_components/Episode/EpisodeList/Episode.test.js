import React from "react";
import { shallow } from "enzyme";
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import { constantText } from "../../../../_helpers/constants.text";
import EpisodeList from "../../../../_components/Episode/EpisodeList/Episode";
import * as EpisodeComponent from "../../../../_components/Episode/EpisodeList/Episode";
import { episodeConstants } from "../../../../_components/Episode/Constants/episode.constant";
import headerTabs from "../../../../_components/Episode/Schema/EpisodeList/HeaderTabs.json";
import { findByTestAttr, storeFactory} from "../../../../Utils";
import {
  sideSelectFilters,
  filterByDate,
  StatusTypes,
  sortingFilters,
  setOrderFilters,
} from "../../../../_components/Episode/Schema/EpisodeList/SideFilter.json";
const OrderSetJson = [
   {
     "name": "setName",
     "type": "text",
     "value": "Test",
     "col": "col-md-12 col-lg-12",
     "label": "Set Name",
     "errorText": "",
     "validation": {
       "required": true
     }
   },
   {
     "name": "country",
     "type": "dropdownAsync",
     "value": [{
       "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
       "group":"Others",
       "title":"India"}],
     "col": "col-md-12 col-lg-12",
     "multiple": true,
     "groupBy": "group",
     "path": "user/country-group",
     "keyText": "title",
     "label": "Country / Group",
     "data": [{
       "id":"2feeac02-7d14-45f0-b94a-2ae30235f79d",
       "group":"Others",
       "title":"India"}],
     "errorText": "",
     "validation": {
       "required": true
     }
   }
 ]
 const list = [                {
   episodeId: "2f2490eb-1933-4fb4-b59a-cd229bda083f",
   indexNumber: 6,
   isXmlGenerated: false,
   isChecked: false,
   seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
   title: null,
   subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
   journeyType: "1",
   note: null,
   externalId: "0-1-6z51003283",
   contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
   originCountry: null,
   dateZee5Published: null,
   lastModifiedOn: "2021-04-05T10:11:23.694Z",
   audioLanguages: null,
   countries: "",
   Season: {
      title: "No Title",
      TvShow: {
         title: "test tv",
         tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
      },
   },
   EpisodeImages: [],
   subtype_populated: {
      title: "Episode",
   },
   contentState_populated: {
      title: "Draft",
   },
   lastModifiedBy_populated: {
      first_name: "Vinod",
      last_name: "Karnatak",
   },
   episodeLicenses: [
      {
         validFrom: "2021-04-20T00:00:00.000Z",
         validUntil: "2021-04-23T00:00:00.000Z",
      },
      {
         validFrom: "2021-04-15T00:00:00.000Z",
         validUntil: "2021-04-16T00:00:00.000Z",
      },
   ],
   }];
const initialState = {
  JSONSchema: OrderSetJson,
  selectJourney: "3",
  allStatus: [],
  showsCount: 0,
  maxPage: null,
  isRequestIntiate: true,
  selectCreateType: null,
  showsFilterQuery: {},
  indexSortType: "ASC",
  sortDatakey: false,
  blankDate: true,
  showFilterDrawer: false,
  openSetIndexDrawer: false,
  openSortDrawer: false,
  filterDatakey: false,
  MoreCountriesBlock: null,
  showModelForMore: false,
  showAskedPopup: false,
  showDelPopup: false,
  showAskedStep: 0,
  showSetPopup: false,
  setMode: "create",
  selectedTab: 0,
  episodeList: [],
  LanguageArr: [],
  tabOptions: [],
  contentStateName: "All",
  defaultOrderingId: null,
  queryData: {
    limit: constantText.search_limit,
    searchString: "",
    page: 1,
    lastEvaluatedKey: "",
    contentState: "",
  },
  setOrderFilters: JSON.parse(JSON.stringify(setOrderFilters)),
  sort: {
    sortingFilters: JSON.parse(JSON.stringify(sortingFilters)),
    showReleaseDate: episodeConstants.episodeReleaseDateVal,
    showUnpublished: episodeConstants.episodeUnpublishedVal,
    showCreated: episodeConstants.episodeCreatedVal,
    showSubmitedToWork: episodeConstants.episodeSubmitedToWorkVal,
  },
  filters: {
    formValidity: true,
    filterByStatus: JSON.parse(JSON.stringify(StatusTypes)),
    filterByDate: JSON.parse(JSON.stringify(filterByDate)),
    selectFilters: JSON.parse(JSON.stringify(sideSelectFilters)) || [],
    querys: "",
    byDate: "",
    startDate: "",
    endDate: "",
  },
  model: {
    detail: "",
    open: false,
    desc: "",
    btn1: constantText.yes_text,
    btn2: constantText.no_text,
  },
  OrderSetList: [],
  options: JSON.parse(JSON.stringify(headerTabs)),
};
const initialProps = {
  match: {
    path: "/tvshow/view/:id/season/view/:seasonId/episode",
    url:
      "/tvshow/view/b6a627c3-758d-4fe6-9a61-e02c936374c5/season/view/91c3e265-6af2-458a-9f20-829ef9797918/episode",
    isExact: true,
    params: {
      seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
    },
  },
};
const setup = (state = initialState, props = initialProps) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<EpisodeList store={store} {...props} />).dive();
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("<EpisodeList />", () => {
  let wrapper;
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup(initialState, initialProps);
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("Should renders EpisodeList default", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test ComponentDidMount", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it("should check back heading text", () => {
    const titleText = findByTestAttr(wrapper, "episode-heading-text");
    expect(titleText.text()).toMatch(
      constantText?.tv_show_episode_text?.episodes
    );
  });

  it("should call getAllStatus fetchDefaultList getAllLanguage API Success", async (done) => {
    const responseData0 = {
      status: 200,
      response: {
        status: 200,
        data: [
          {
            title: "Archived",
            status: "1",
            id: "28d8bc82-af3a-4e04-bdf7-0a5df324ac51",
          },
          {
            title: "Changed",
            status: "1",
            id: "38c34c4f-68c9-4eb0-b71f-b80f1e551447",
          },
          {
            title: "Draft",
            status: "1",
            id: "3bb64421-f15f-4dda-adec-03c324c140a3",
          },
          {
            title: "Need Work",
            status: "1",
            id: "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
          },
          {
            title: "Published",
            status: "1",
            id: "081cc5b2-a302-4bfb-8e5c-68544ae636e6",
          },
          {
            title: "Publishing Queue",
            status: "1",
            id: "4e565298-6e9c-4d5f-8a03-c23a42cabedd",
          },
          {
            title: "Scheduled",
            status: "1",
            id: "3951d801-9758-4a09-be3e-0af342ba9d13",
          },
          {
            title: "Submitted To Review",
            status: "1",
            id: "38c34c4f-68c9-4eb0-b71f-b80f1e551446",
          },
          {
            title: "Unpublished",
            status: "1",
            id: "21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe",
          },
        ],
      },
    };
    const responseData1 = {
      status: 200,
      response: {
        status: 200,
        data: [
          {
            episodeOrderingId: "a7d7341e-4a71-4564-a0ac-46cf1dd05d14",
            seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
            setName: "Default",
            countryId: null,
            indexSortType: "DESC",
            status: "1",
            createdBy: "21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe",
            modifiedBy: "ce7859b7-b9d5-4603-bde2-2fe416d790ec",
            _created_on: "2021-04-05T07:05:45.108Z",
            _modified_on: "2021-04-05T09:53:57.779Z",
            episodeList: {
              rows: [
                {
                  episodeId: "2f2490eb-1933-4fb4-b59a-cd229bda083f",
                  indexNumber: 6,
                  seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
                  title: null,
                  subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
                  journeyType: "1",
                  note: null,
                  externalId: "0-1-6z51003283",
                  contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                  originCountry: null,
                  dateZee5Published: null,
                  lastModifiedOn: "2021-04-05T10:11:23.694Z",
                  audioLanguages: null,
                  countries: "",
                  Season: {
                    title: "No Title",
                    TvShow: {
                      title: "test tv",
                      tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
                    },
                  },
                  EpisodeImages: [],
                  subtype_populated: {
                    title: "Episode",
                  },
                  contentState_populated: {
                    title: "Draft",
                  },
                  lastModifiedBy_populated: {
                    first_name: "Vinod",
                    last_name: "Karnatak",
                  },
                  episodeLicenses: [
                    {
                      validFrom: "2021-04-20T00:00:00.000Z",
                      validUntil: "2021-04-23T00:00:00.000Z",
                    },
                    {
                      validFrom: "2021-04-15T00:00:00.000Z",
                      validUntil: "2021-04-16T00:00:00.000Z",
                    },
                  ],
                },
                {
                  episodeId: "8a8d61cb-8d5c-4f53-900c-4e37e54c3587",
                  indexNumber: 5,
                  seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
                  title: "No Title",
                  subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
                  journeyType: "1",
                  note: null,
                  externalId: "0-1-6z51003275",
                  contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                  originCountry: null,
                  dateZee5Published: "2021-04-07T00:00:00.000Z",
                  lastModifiedOn: "2021-04-05T09:59:48.919Z",
                  audioLanguages: null,
                  countries: "",
                  Season: {
                    title: "No Title",
                    TvShow: {
                      title: "test tv",
                      tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
                    },
                  },
                  EpisodeImages: [],
                  subtype_populated: {
                    title: "Episode",
                  },
                  contentState_populated: {
                    title: "Draft",
                  },
                  lastModifiedBy_populated: {
                    first_name: "Vinod",
                    last_name: "Karnatak",
                  },
                  episodeLicenses: [],
                },
                {
                  episodeId: "cb3b3497-900f-4ee4-b262-f75bd41b0007",
                  indexNumber: 4,
                  seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
                  title: null,
                  subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
                  journeyType: "1",
                  note: null,
                  externalId: "0-1-6z51003274",
                  contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                  originCountry: null,
                  dateZee5Published: null,
                  lastModifiedOn: "2021-04-05T09:27:26.680Z",
                  audioLanguages: null,
                  countries: "",
                  Season: {
                    title: "No Title",
                    TvShow: {
                      title: "test tv",
                      tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
                    },
                  },
                  EpisodeImages: [],
                  subtype_populated: {
                    title: "Episode",
                  },
                  contentState_populated: {
                    title: "Draft",
                  },
                  lastModifiedBy_populated: {
                    first_name: "Vinod",
                    last_name: "Karnatak",
                  },
                  episodeLicenses: [],
                },
                {
                  episodeId: "19c99a05-06f1-4e83-b36d-ca372c9d224c",
                  indexNumber: 3,
                  seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
                  title: "No Title",
                  subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
                  journeyType: "1",
                  note: null,
                  externalId: "0-1-6z51003273",
                  contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                  originCountry: null,
                  dateZee5Published: null,
                  lastModifiedOn: "2021-04-05T09:08:32.886Z",
                  audioLanguages: null,
                  countries: "",
                  Season: {
                    title: "No Title",
                    TvShow: {
                      title: "test tv",
                      tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
                    },
                  },
                  EpisodeImages: [],
                  subtype_populated: {
                    title: "Episode",
                  },
                  contentState_populated: {
                    title: "Draft",
                  },
                  lastModifiedBy_populated: {
                    first_name: "Vinod",
                    last_name: "Karnatak",
                  },
                  episodeLicenses: [],
                },
                {
                  episodeId: "38c0513b-ee5f-4f6b-9f06-90b1674bd7be",
                  indexNumber: 2,
                  seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
                  title: null,
                  subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
                  journeyType: "1",
                  note: null,
                  externalId: "0-1-6z51003265",
                  contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                  originCountry: null,
                  dateZee5Published: null,
                  lastModifiedOn: "2021-04-05T07:28:17.953Z",
                  audioLanguages: null,
                  countries: "",
                  Season: {
                    title: "No Title",
                    TvShow: {
                      title: "test tv",
                      tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
                    },
                  },
                  EpisodeImages: [],
                  subtype_populated: {
                    title: "Episode",
                  },
                  contentState_populated: {
                    title: "Draft",
                  },
                  lastModifiedBy_populated: {
                    first_name: "Vinod",
                    last_name: "Karnatak",
                  },
                  episodeLicenses: [],
                },
                {
                  episodeId: "9a0a7a7d-8355-4af3-9c02-d68360426e88",
                  indexNumber: 1,
                  seasonId: "91c3e265-6af2-458a-9f20-829ef9797918",
                  title: null,
                  subtype: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
                  journeyType: "1",
                  note: null,
                  externalId: "0-1-6z51003264",
                  contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                  originCountry: null,
                  dateZee5Published: null,
                  lastModifiedOn: "2021-04-05T07:05:51.640Z",
                  audioLanguages: null,
                  countries: "",
                  Season: {
                    title: "No Title",
                    TvShow: {
                      title: "test tv",
                      tvShowId: "b6a627c3-758d-4fe6-9a61-e02c936374c5",
                    },
                  },
                  EpisodeImages: [],
                  subtype_populated: {
                    title: "Episode",
                  },
                  contentState_populated: {
                    title: "Draft",
                  },
                  lastModifiedBy_populated: {
                    first_name: "Rakesh",
                    last_name: "chandra",
                  },
                  episodeLicenses: [],
                },
              ],
              count: 6,
            },
          },
        ],
      },
    };
    const responseData2 = {
      status: 200,
      response: {
        status: 200,
        data: [
          {
            title: "Arabic",
            status: "1",
            id: "14b29f2c-d179-400f-b524-d3a80248c8cc",
            code: "ar",
          },
          {
            title: "Assamese",
            status: "1",
            id: "816b6e9a-ee6a-4fe6-9724-496d675414a3",
            code: "as",
          },
        ],
      },
    };
    const showFilterQuery = {
      filters: [
        {
          name: "primaryGenre",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Primary Genre",
          path: "/master/TvShowPrimaryGenre",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "secondaryGenre",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Secondary Genre",
          path: "/master/TvShowPrimaryGenre",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "thematicGenre",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Thematic Genre",
          path: "/master/TvShowThematicGenre",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "settingGenre",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Setting Genre",
          path: "/master/TvShowSettingGenre",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "actor",
          type: "SearchableWithCreate",
          keyText: "castName",
          data: [],
          errorText: "",
          col: "",
          multiple: true,
          value: [],
          createPrefix: "Use",
          path: "",
          display: true,
          label: "Actor",
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "subType",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/EpisodeSubType",
          display: true,
          label: "Episode Sub Type",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "contentCategory",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Content Category",
          path: "/master/ContentCategory",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "rcsCategory",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "RCS Category",
          path: "/master/RcsCategory",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "theme",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Theme",
          path: "/master/Theme",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "targetAudience",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Target Audience",
          path: "/master/TargetAudience",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "licenseGroupCountries",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          groupBy: "group",
          label: "License Group/Countries",
          path: "/master/CountryGroup",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "ageRating",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Age Rating",
          path: "/master/AgeRating",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "businessType",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Business Type",
          path: "/master/BusinessType",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "externalId",
          value: "",
          col: "",
          type: "text",
          label: "External Id",
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "contentRating",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/ContentRating",
          display: true,
          label: "Content Rating",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "contentOwner",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/ContentOwner",
          display: true,
          label: "Content Owner",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "audioLanguage",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/Language",
          display: true,
          label: "Audio Language",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "originalLanguage",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Original Language",
          path: "/master/Language",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "tags",
          type: "SearchableWithCreate",
          col: "",
          keyText: "title",
          value: [],
          createPrefix: "Use",
          multiple: true,
          label: "Tags",
          data: [],
          display: true,
          errorText: "",
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "translationLanguage",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Translation Language",
          path: "/master/Language",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "translationStatus",
          keyText: "title",
          value: null,
          col: "",
          type: "dropdownAsync",
          display: false,
          label: "Translation’s Language Status",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "moodEmotion",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Mood Emotion",
          path: "/master/EmotionTitle",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "broadcastState",
          keyText: "title",
          value: null,
          col: "",
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "TvShow Broadcasted",
          path: "/master/TvShowBroadcast",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
      ],
      filterByDate: [
        {
          name: "lastModifiedOn",
          label: "Modified On",
          for: "All",
          display: true,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastCreatedOn",
          label: "Created On",
          for: "Draft",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Changed On",
          for: "Changed",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Published On",
          for: "Published",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Unpublished On",
          for: "Unpublished",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Reviewed On",
          for: "Need Work",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Scheduled On",
          for: "Scheduled",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Submitted On",
          for: "Submitted to Review",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Archived On",
          for: "Archived",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
      ],
      sort: [
        {
          name: "mainSortType",
          label: "Main Release Date",
          for: "",
          sortKey: "mainSortKey",
          sortValue: "dateZee5Published",
          display: true,
          value: "",
          data: [
            {
              value: "asc",
              label: "Ascending to Descending",
            },
            {
              value: "desc",
              label: "Descending to Ascending",
            },
          ],
        },
        {
          name: "subSortType",
          for: "Draft",
          label: "By Created",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Changed",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Changed",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Published",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Published",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Unpublished",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Unpublished",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Reviewed",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Need Work",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Scheduled",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Scheduled",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Submitted",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Submitted to Review",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Archived",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "Archived",
          display: false,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
        {
          name: "subSortType",
          label: "By Modified",
          sortKey: "subSortKey",
          sortValue: "lastModifiedOn",
          for: "All",
          display: true,
          value: "",
          data: [
            {
              value: "desc",
              label: "Newest to Oldest",
            },
            {
              value: "asc",
              label: "Oldest to Newest",
            },
          ],
        },
      ],
      paramQuery: {
        limit: 10,
        page: 1,
      },
    };
    wrapper.instance().getAllStatus();
    wrapper.instance().fetchDefaultList(showFilterQuery);
    wrapper.instance().getAllLanguage();
    moxios.wait(function () {
      const request0 = moxios.requests.at(0);
      request0
        .respondWith(responseData0)
        .then(() => {
          expect(wrapper.state("allStatus")).toHaveLength(9);
        })
        .catch((err) => {
          console.log(err);
        });

      const request1 = moxios.requests.at(1);
      request1
        .respondWith(responseData1)
        .then(() => {
          expect(wrapper.state("episodeList")).toHaveLength(6);
        })
        .catch((err) => {
          console.log(err);
        });
      const request2 = moxios.requests.at(2);
      request2
        .respondWith(responseData2)
        .then(() => {
          expect(wrapper.state("LanguageArr")).toHaveLength(2);
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  it("should test updateSet", async(done) => {

   const responseData0 = {
     status: 200,
     response: {
       status: 200,
       data: [{
         "_created_on":"2021-04-19T11:39:29.970Z",
         "_modified_on":"2021-04-19T11:39:37.638Z",
         "seasonOrderingId":"b4dd2adc-95b0-4f52-a569-d6669f150c63",
         "tvShowId":"6a6b5bf7-4ffb-9ea5-a399-bbf2268cf43b",
         "setName":"tess",
         "countryId":[
            "2feeac02-7d14-45f0-b94a-2ae30235f79d"
         ],
         "seasonId":null,
         "status":"1",
         "createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec",
         "modifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec"
      }],
     },
   };
   wrapper.instance().updateSet();
   moxios.wait(function () {
     const request0 = moxios.requests.at(0);
     request0
       .respondWith(responseData0)
       .then(() => {
         expect(wrapper.state("showSetPopup")).toBe(false);
         done();
       })
       .catch((err) => {
         console.log(err);
       });
   });
 });

 it("should test handleKeyUp", () => {

   const instance = wrapper.instance();
   jest.spyOn(instance, "handleKeyUp");
   instance.handleKeyUp();
   expect(instance.handleKeyUp).toHaveBeenCalledTimes(1);
 });

 it("should test handleKeyPress", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "handleKeyPress");
   instance.handleKeyPress();
   expect(instance.handleKeyPress).toHaveBeenCalledTimes(1);
 });

 
 it("should test handleConditionRoute", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "handleConditionRoute");
   instance.handleConditionRoute("archive","2522f523-e2e9-4461-8d1b-e043dbb40b05");
   expect(instance.handleConditionRoute).toHaveBeenCalledTimes(1);
 });

 it("should test handleSetIndexFilter", async(done) => {
   const responseData0 = {
     status: 200,
     response: {
       status: 200,
       data: null,
     },
   };
   wrapper.instance().handleSetIndexFilter({}, 0,{ target:{ value:"ASC" }});
   moxios.wait(function () {
     const request0 = moxios.requests.at(0);
     request0
       .respondWith(responseData0)
       .then(() => {
         expect(wrapper.state("maxPage")).toBe(null);
         done();
       })
       .catch((err) => {                                                                                                                                                                                                                                       
         console.log(err);
       });
   });
 });

  it("should test filterData", () => {
    const filters = {
      formValidity: true,
      filterByStatus: [
        {
          label: "All",
          displayName: "All",
          active: true,
        },
        {
          label: "Draft",
          displayName: "Draft",
        },
        {
          label: "Changed",
          displayName: "Changed",
        },
        {
          label: "Published",
          displayName: "Published",
        },
        {
          label: "Unpublished",
          displayName: "Unpublished",
        },
        {
          label: "Need Work",
          displayName: "Need Work",
        },
        {
          label: "Scheduled",
          displayName: "Scheduled",
        },
        {
          label: "Submitted to Review",
          displayName: "Submitted to Review",
        },
        {
          label: "Archived",
          displayName: "Archived",
        },
      ],
      filterByDate: [
        {
          name: "lastModifiedOn",
          label: "Modified On",
          for: "All",
          display: true,
          date: {
            startDate: "2021-02-02",
            endDate: "2021-02-12",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastCreatedOn",
          label: "Created On",
          for: "Draft",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Changed On",
          for: "Changed",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Published On",
          for: "Published",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Unpublished On",
          for: "Unpublished",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Reviewed On",
          for: "Need Work",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Scheduled On",
          for: "Scheduled",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Submitted On",
          for: "Submitted to Review",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
        {
          name: "lastModifiedOn",
          label: "Archived On",
          for: "Archived",
          display: false,
          date: {
            startDate: "",
            endDate: "",
            startDateKey: "startDate",
            endDateKey: "endDate",
            startPlaceholder: "Start Date",
            endPlaceholder: "End Date",
          },
        },
      ],
      selectFilters: [
        {
          name: "primaryGenre",
          keyText: "title",
          value: [
            {
              title: "Action",
              status: "1",
              id: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
            },
          ],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Primary Genre",
          path: "/master/TvShowGenre",
          data: [
            {
              title: "Animation",
              status: "1",
              id: "5b44c8f7-1166-465f-a56c-ae03a08bb501",
            },
            {
              title: "Comedy",
              status: "1",
              id: "01e686be-71ca-4355-b8e6-a85d6b4b6112",
            },
            {
              title: "Cookery",
              status: "1",
              id: "90473cb1-39d4-44cf-90e7-b32b048eea03",
            },
          ],
          validation: {
            required: false,
          },
          touched: 1,
          valid: true,
          errorText: "",
        },
        {
          name: "secondaryGenre",
          keyText: "title",
          value: [
            {
              title: "Action",
              status: "1",
              id: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
            },
            {
              title: "Animation",
              status: "1",
              id: "5b44c8f7-1166-465f-a56c-ae03a08bb501",
            },
          ],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Secondary Genre",
          path: "/master/TvShowGenre",
          data: [
            {
              title: "Comedy",
              status: "1",
              id: "01e686be-71ca-4355-b8e6-a85d6b4b6112",
            },
            {
              title: "Cookery",
              status: "1",
              id: "90473cb1-39d4-44cf-90e7-b32b048eea03",
            },
          ],
          validation: {
            required: false,
          },
          touched: 1,
          valid: true,
          errorText: "",
        },
        {
          name: "thematicGenre",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Thematic Genre",
          path: "/master/TvShowThematicGenre",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "settingGenre",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Setting Genre",
          path: "/master/TvShowSettingGenre",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "actor",
          type: "SearchableWithCreate",
          keyText: "castName",
          data: [
            {
              castName: "Akshay Kumar",
              id: "e199cd8b-33f5-426f-bce0-06f7e21b7afa",
            },
          ],
          value: {
            castName: "Akshay Kumar",
            id: "e199cd8b-33f5-426f-bce0-06f7e21b7afa",
          },
          errorText: "",
          col: "",
          createPrefix: "Use",
          path: "",
          display: true,
          label: "Actor",
          validation: {
            required: false,
          },
          touched: 1,
          valid: true,
        },
        {
          name: "actortestmultiple",
          type: "SearchableWithCreate",
          keyText: "castName",
          data: [
            {
              castName: "Akshay Kumar",
              id: "e199cd8b-33f5-426f-bce0-06f7e21b7afa",
            },
          ],
          value: {
            castName: "Akshay Kumar",
            id: "e199cd8b-33f5-426f-bce0-06f7e21b7afa",
          },
          errorText: "",
          col: "",
          createPrefix: "Use",
          path: "",
          multiple: true,
          display: true,
          label: "Actor",
          validation: {
            required: false,
          },
          touched: 1,
          valid: true,
        },
        {
          name: "actortext",
          keyText: "castName",
          type: "SearchableWithCreate",
          data: [],
          errorText: "",
          col: "",
          value: {
            castName: "Alia Bhatt",
            id: "293700d9-2360-4674-9ebf-34ceed6fa531",
          },
          createPrefix: "Use",
          path: "",
          display: true,
          label: "Actor",
          validation: {
            required: false,
          },
        },
        {
          name: "subType",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/TvShowSubType",
          display: true,
          label: "TvShow Sub Type",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "subType",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/EpisodeSubType",
          display: false,
          label: "Episode Sub Type",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "contentCategory",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Content Category",
          path: "/master/ContentCategory",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "rcsCategory",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "RCS Category",
          path: "/master/RcsCategory",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "theme",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Theme",
          path: "/master/Theme",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "targetAudience",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Target Audience",
          path: "/master/TargetAudience",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "licenseGroupCountries",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          groupBy: "group",
          label: "License Group/Countries",
          path: "/master/CountryGroup",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "ageRating",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Age Rating",
          path: "/master/AgeRating",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "businessType",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Business Type",
          path: "/master/BusinessType",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "externalId",
          value: "",
          col: "",
          type: "text",
          label: "External Id",
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "contentRating",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/ContentRating",
          display: true,
          label: "Content Rating",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "contentOwner",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          path: "/master/ContentOwner",
          display: true,
          label: "Content Owner",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "audioLanguage",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "conditionalDropdown",
          path: "/master/Language",
          display: true,
          label: "Audio Language",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "originalLanguage",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Original Language",
          path: "/master/Language",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "tags",
          type: "SearchableWithCreate",
          col: "",
          keyText: "title",
          value: null,
          createPrefix: "Use",
          multiple: false,
          label: "Tags",
          data: [],
          display: true,
          errorText: "",
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "translationLanguage",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Translation Language",
          path: "/master/Language",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "translationStatus",
          keyText: "title",
          value: null,
          col: "",
          type: "dropdownAsync",
          display: false,
          label: "Translation’s Language Status",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "moodEmotion",
          keyText: "title",
          value: [],
          col: "",
          multiple: true,
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "Mood Emotion",
          path: "/master/EmotionTitle",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
        {
          name: "broadcastState",
          keyText: "title",
          value: {
            title: "Archive",
            status: "1",
            id: "5b44c8f7-1166-465f-a56c-ae03a08bb503",
          },
          col: "",
          limitTags: 1,
          type: "dropdownAsync",
          display: true,
          label: "TvShow Broadcasted",
          path: "/master/TvShowBroadcast",
          data: [],
          validation: {
            required: false,
          },
          touched: 0,
          valid: true,
        },
      ],
      querys: "",
      byDate: "",
      startDate: "",
      endDate: "",
    };
    const wrapper = setup({ filters }, null);
    const instance = wrapper.instance();
    jest.spyOn(instance, "filterData");
    instance.filterData();
    expect(instance.filterData).toHaveBeenCalledTimes(1);
  });

  it("should test setSelectDataArr", () => {
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
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectDataArr");
    instance.setSelectDataArr(res, 10);
    expect(instance.setSelectDataArr).toHaveBeenCalled();
  });

  it("should check applyFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "filterData");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "episode-applyFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });
  it("should test tabSwitched", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "tabSwitched");
    instance.tabSwitched({}, 0);
    instance.tabSwitched({}, 1);
    expect(instance.tabSwitched).toHaveBeenCalledTimes(2);
  });
  it("should test goNextStep", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "goNextStep");
    instance.goNextStep();
    wrapper = setup({ selectCreateType: "placeholder" }, initialProps);
    wrapper.update();
    instance.goNextStep();
    expect(instance.goNextStep).toHaveBeenCalledTimes(2);
  });
  it("should test goToEpisode", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "goToEpisode");
    instance.goToEpisode();
    wrapper = setup({ selectJourney: "2" }, initialProps);
    wrapper.update();
    instance.goToEpisode();
    expect(instance.goToEpisode).toHaveBeenCalledTimes(2);
  });
  it("should test nextCall", () => {
    const maxPage = 2;
    wrapper = setup({ isRequestIntiate: true, maxPage }, initialProps);
    const instance = wrapper.instance();
    jest.spyOn(instance, "nextCall");
    instance.nextCall(1);
    expect(instance.nextCall).toHaveBeenCalledTimes(1);
  });
  it("should check filterValidityCheck method", () => {
    const selectFilters = [
      {
        name: "primaryGenre",
        keyText: "title",
        value: [
          {
            title: "Action",
            status: "1",
            id: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
          },
        ],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Primary Genre",
        path: "/master/TvShowGenre",
        data: [
          {
            title: "Animation",
            status: "1",
            id: "5b44c8f7-1166-465f-a56c-ae03a08bb501",
          },
          {
            title: "Comedy",
            status: "1",
            id: "01e686be-71ca-4355-b8e6-a85d6b4b6112",
          },
          {
            title: "Cookery",
            status: "1",
            id: "90473cb1-39d4-44cf-90e7-b32b048eea03",
          },
        ],
        validation: {
          required: false,
        },
        touched: 1,
        valid: true,
        errorText: "",
      },
      {
        name: "secondaryGenre",
        keyText: "title",
        value: [
          {
            title: "Action",
            status: "1",
            id: "3ac2b4c9-9708-4864-b9ae-1a191cdd9ef0",
          },
          {
            title: "Animation",
            status: "1",
            id: "5b44c8f7-1166-465f-a56c-ae03a08bb501",
          },
        ],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Secondary Genre",
        path: "/master/TvShowGenre",
        data: [
          {
            title: "Comedy",
            status: "1",
            id: "01e686be-71ca-4355-b8e6-a85d6b4b6112",
          },
          {
            title: "Cookery",
            status: "1",
            id: "90473cb1-39d4-44cf-90e7-b32b048eea03",
          },
        ],
        validation: {
          required: false,
        },
        touched: 1,
        valid: true,
        errorText: "",
      },
      {
        name: "thematicGenre",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Thematic Genre",
        path: "/master/TvShowThematicGenre",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "settingGenre",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Setting Genre",
        path: "/master/TvShowSettingGenre",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "actor",
        type: "SearchableWithCreate",
        keyText: "castName",
        data: [],
        errorText: "",
        col: "",
        value: null,
        createPrefix: "Use",
        path: "",
        display: true,
        label: "Actor",
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "subType",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        path: "/master/TvShowSubType",
        display: true,
        label: "TvShow Sub Type",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "subType",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        path: "/master/EpisodeSubType",
        display: false,
        label: "Episode Sub Type",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "contentCategory",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Content Category",
        path: "/master/ContentCategory",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "rcsCategory",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "RCS Category",
        path: "/master/RcsCategory",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "theme",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Theme",
        path: "/master/Theme",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "targetAudience",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Target Audience",
        path: "/master/TargetAudience",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "licenseGroupCountries",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        groupBy: "group",
        label: "License Group/Countries",
        path: "/master/CountryGroup",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "ageRating",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Age Rating",
        path: "/master/AgeRating",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "businessType",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Business Type",
        path: "/master/BusinessType",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "externalId",
        value: "",
        col: "",
        type: "text",
        label: "External Id",
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "contentRating",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        path: "/master/ContentRating",
        display: true,
        label: "Content Rating",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "contentOwner",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        path: "/master/ContentOwner",
        display: true,
        label: "Content Owner",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "audioLanguage",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "conditionalDropdown",
        path: "/master/Language",
        display: true,
        label: "Audio Language",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "originalLanguage",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Original Language",
        path: "/master/Language",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "tags",
        type: "SearchableWithCreate",
        col: "",
        keyText: "title",
        value: null,
        createPrefix: "Use",
        multiple: false,
        label: "Tags",
        data: [],
        display: true,
        errorText: "",
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "translationLanguage",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Translation Language",
        path: "/master/Language",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "translationStatus",
        keyText: "title",
        value: null,
        col: "",
        type: "dropdownAsync",
        display: false,
        label: "Translation’s Language Status",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "moodEmotion",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "Mood Emotion",
        path: "/master/EmotionTitle",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
      {
        name: "broadcastState",
        keyText: "title",
        value: [],
        col: "",
        multiple: true,
        limitTags: 1,
        type: "dropdownAsync",
        display: true,
        label: "TvShow Broadcasted",
        path: "/master/TvShowBroadcast",
        data: [],
        validation: {
          required: false,
        },
        touched: 0,
        valid: true,
      },
    ];
    jest.spyOn(EpisodeComponent, "filterValidityCheck");
    EpisodeComponent.filterValidityCheck([...selectFilters]);
    expect(EpisodeComponent.filterValidityCheck).toHaveBeenCalled();
  });
  it("should check showStatusField method", () => {
   const selectFilters = [
     {
       name: "translationLanguage",
       keyText: "title",
       value: [],
       col: "",
       multiple: true,
       limitTags: 1,
       type: "dropdownAsync",
       display: true,
       label: "Translation Language",
       path: "/master/Language",
       data: [],
       validation: {
         required: false,
       },
       touched: 0,
       valid: true,
     },
     {
       name: "translationStatus",
       keyText: "title",
       value: null,
       col: "",
       type: "dropdownAsync",
       display: false,
       label: "Translation’s Language Status",
       data: [],
       validation: {
         required: false,
       },
       touched: 0,
       valid: true,
     }
   ];
   const instance = wrapper.instance();
   jest.spyOn(instance, "showStatusField");
   instance.showStatusField(selectFilters, true);
   expect(instance.showStatusField).toHaveBeenCalledTimes(1);
   });
  it("should check clearFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "clearFilter");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "episode-clearFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should test InputChanger", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "InputChanger");
   instance.InputChanger({target:{value:'testing'}},0);
   expect(instance.InputChanger).toHaveBeenCalledTimes(1);
 });

  it("should check applySortFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "applySortFilter");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "episode-applySortFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check clearSortFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "clearSortFilter");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "episode-clearSortFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should test searchDefaultChange", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "searchDefaultChange");
    instance.searchDefaultChange({
      target: { name: "searchString", value: "test" },
    });
    expect(instance.searchDefaultChange).toHaveBeenCalledTimes(1);
  });

  it("should test createNewSet", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "createNewSet");
   instance.createNewSet();
   expect(instance.createNewSet).toHaveBeenCalledTimes(1);
 });

 it("should test setSelectDataArrForSet", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "setSelectDataArrForSet");
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
   instance.setSelectDataArrForSet(res,1);
   expect(instance.setSelectDataArrForSet).toHaveBeenCalledTimes(1);
 });
 
 it("should test selectGroup", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "selectGroup");
   instance.selectGroup({target:{checked: true}},"Others");
   expect(instance.selectGroup).toHaveBeenCalledTimes(1);
 });

 it("should test selectCountryGroup", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "selectCountryGroup");
   instance.selectCountryGroup({target:{checked: true}},"Others");
   expect(instance.selectCountryGroup).toHaveBeenCalledTimes(1);
 });

 it("should check handleFilterStatusSelection method", () => {
   const tabOptions = [
     {
         "displayName": "All",
         "count": 26,
         "id": "",
         "status": "",
         "statusText": "Last Modified By"
     },
     {
         "displayName": "Draft",
         "count": 25,
         "id": "3bb64421-f15f-4dda-adec-03c324c140a3",
         "status": "1",
         "statusText": "Last Modified By"
     },
     {
         "displayName": "Changed",
         "count": 0,
         "id": "38c34c4f-68c9-4eb0-b71f-b80f1e551447",
         "status": "1",
         "statusText": "Last Modified By"
     },
     {
         "displayName": "Published",
         "count": 1,
         "id": "081cc5b2-a302-4bfb-8e5c-68544ae636e6",
         "status": "1",
         "statusText": "Published By"
     },
     {
         "displayName": "Unpublished",
         "count": 0,
         "id": "21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe",
         "status": "1",
         "statusText": "Unpublished By"
     },
     {
         "displayName": "Need Work",
         "count": 0,
         "id": "38c34c4f-68c9-4eb0-b71f-b80f1e551448",
         "status": "1",
         "statusText": "Reviewed by"
     },
     {
         "displayName": "Scheduled",
         "count": 0,
         "id": "3951d801-9758-4a09-be3e-0af342ba9d13",
         "status": "1",
         "statusText": "Scheduled by"
     },
     {
         "displayName": "Submitted To Review",
         "count": 0,
         "id": "38c34c4f-68c9-4eb0-b71f-b80f1e551446",
         "status": "1",
         "statusText": "Submitted by"
     },
     {
         "displayName": "Archived",
         "count": 0,
         "id": "28d8bc82-af3a-4e04-bdf7-0a5df324ac51",
         "status": "1",
         "statusText": "Archived By"
     },
     {
         "displayName": "Publishing Queue",
         "count": 0,
         "id": "4e565298-6e9c-4d5f-8a03-c23a42cabedd",
         "status": "1",
         "statusText": "Published by"
     }
   ];
   wrapper = setup({tabOptions}, initialProps);
   const instance = wrapper.instance();
   jest.spyOn(instance, "handleFilterStatusSelection");
   instance.handleFilterStatusSelection(null, 1);
   expect(instance.handleFilterStatusSelection).toHaveBeenCalledTimes(1);
 });

 it("should test handleRadioButton", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "handleRadioButton");
   instance.handleRadioButton({target:{value: "2", name: "selectJourney"}});
   expect(instance.handleRadioButton).toHaveBeenCalledTimes(1);
 });



 it("should check filterChange method", () => {
   const event = { target: { value: [{title: "Arabic", status: "1", id: "14b29f2c-d179-400f-b524-d3a80248c8cc", code: "ar"}] } };
   const event2 = { target: { value: [] } };
   const instance = wrapper.instance();
   jest.spyOn(instance, "filterChange");
   instance.filterChange(event, 20);
   instance.filterChange(event2, 20);
   expect(instance.filterChange).toHaveBeenCalledTimes(2);
 });

 it("should check onChange method of filter date", () => {
   const spy = jest.spyOn(wrapper.instance(), "handleDateChange");
   const event = { target: { name: "startDate", value: "2021-02-09" } };
   wrapper.instance().forceUpdate();
   wrapper.update();
   const button = findByTestAttr(wrapper, "episode-handleDateChange");
   button.simulate("change", event);
   expect(spy).toHaveBeenCalled();
 });


 it("should test handleModel", () => {
   const instance = wrapper.instance();
   jest.spyOn(instance, "handleModel");
   const model= {"detail":"","open":false,"desc":"","btn1":"Yes","btn2":"No"};
   const model2= {"detail":{ view: "archive", contentId: "2522f523-e2e9-4461-8d1b-e043dbb40b0"},"open":true,"desc":"","btn1":"Yes","btn2":"No"};
   instance.handleModel(true,model);
   instance.handleModel(false,model2);
   expect(instance.handleModel).toHaveBeenCalledTimes(2);
 });

 it("should test handleSelectToggle", () => {
   wrapper = setup({episodeList : list});
   wrapper.update();
   const instance = wrapper.instance();
   jest.spyOn(instance, "handleSelectToggle");
   const event= {target: { checked : true}};
   instance.handleSelectToggle(event,0);
   expect(instance.handleSelectToggle).toHaveBeenCalledTimes(1);
 });

 it("should test handleSelectAllToggle", () => {
      wrapper = setup({episodeList : list});
      wrapper.update();
      const instance = wrapper.instance();
   jest.spyOn(instance, "handleSelectAllToggle");
   const event= {target: { checked : true}};
   instance.handleSelectAllToggle(event);
   expect(instance.handleSelectAllToggle).toHaveBeenCalledTimes(1);
 });


 it("should test handleSortFilter", () => {
   wrapper = setup({episodeList : list});
   wrapper.update();
   const instance = wrapper.instance();
jest.spyOn(instance, "handleSortFilter");
const event= {target: { value : "asc"}};
instance.handleSortFilter({}, 0 ,event);
expect(instance.handleSortFilter).toHaveBeenCalledTimes(1);
});

it("should test showHideSetIndexDrawer", () => {
wrapper = setup({openSetIndexDrawer : false});
wrapper.update();
const instance = wrapper.instance();
jest.spyOn(instance, "showHideSetIndexDrawer");
instance.showHideSetIndexDrawer();
expect(instance.showHideSetIndexDrawer).toHaveBeenCalledTimes(1);
});

});
