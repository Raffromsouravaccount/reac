import React from "react";
import { shallow } from "enzyme";
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import * as TvShowComponent from "../../../../_components/TvShow/TvShowList/TvShowList";
import TvShowList from "../../../../_components/TvShow/TvShowList/TvShowList";
import { constantText } from "../../../../_helpers/constants.text";
import { tvShowConstants } from "../../../../_components/TvShow/Constants/tvshow.constants";
import { DEFAULT_JSON } from "../../../../_components/Common/FormHelper/FormValidSetter";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import BreadcrumbsComp from "../../../../_components/Common/BreadCrumbs/BreadCrumbs";
import ButtonField from "../../../../_components/Common/ButtonField/ButtonField";
import { findByTestAttr } from "../../../../Utils";

import {
  sideSelectFilters,
  filterByDate,
  StatusTypes,
  sortingFilters,
} from "../../../../_components/TvShow/Schema/SideFilter.json";

const setup = (state = {}, props = {}) => {
  const wrapper = shallow(<TvShowList {...props} />);
  wrapper.update();
  if (state) wrapper.setState(state);
  return wrapper;
};

const initialState = {
  showsFilterQuery: {},
  showsCount: 0,
  appliedFilters: [],
  LanguageArr: [],
  isRequestIntiate: null,
  changingTab: false,
  maxPage: null,
  tvshowList: [],
  searchMode: false,
  contentStateName: "All",
  searchBtnText: constantText.tvShowsConstant.tvShow,
  searchPlaceholderText: constantText.tvShowsConstant.searchPlaceholderTvShow,
  isQueue: false,
  quickFellingValue: "",
  showScheduledDrawer: false,
  openSearchDropdown: false,
  openQuickDropdown: false,
  selectedTab: 0,
  showFilterDrawer: false,
  showsFilterQuery: {
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
        value: "desc",
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
  },
  openSortDrawer: false,
  queryData: {
    limit: constantText.search_limit,
    searchString: "test",
    page: 1,
    lastEvaluatedKey: "",
    contentState: "",
  },
  isUnpublished: false,
  isArchived: false,
  tabOptions: [],
  dropdownOptions: [],
  allStatus: [],
  movieHistoryData: null,
  sort: {
    sortingFilters: JSON.parse(JSON.stringify(sortingFilters)),
    showReleaseDate: tvShowConstants.tvShowsReleaseDateVal,
    showUnpublished: tvShowConstants.tvShowsUnpublishedVal,
    showCreated: tvShowConstants.tvShowsCreatedVal,
    showSubmitedToWork: tvShowConstants.tvShowsSubmitedToWorkVal,
  },
  filters: {
    formValidity: true,
    filterByStatus: JSON.parse(JSON.stringify(StatusTypes)),
    filterByDate: JSON.parse(JSON.stringify(filterByDate)),
    selectFilters: DEFAULT_JSON(sideSelectFilters) || [],
    querys: "",
    byDate: "",
    startDate: "",
    endDate: "",
  },
  links: [
    {
      color: "inherit",
      text: constantText.dashBoard_text,
      route: "/dashboard",
    },
  ],
  typography: [
    {
      color: "textPrimary",
      text: constantText.tv_show_text.title,
      label: "primary",
    },
  ],
  language: "EN",
  published_history_arr: [],
  scheduled_history_arr: [],
  unpublishedHistory_arr: [],
  remainingCountry_arr: [],
  currentShow: null,
  selectedContentType: tvShowConstants.tvshowType,
  SelectedMovieMoreCountries: [],
  showModelForCountries: false,
  showModelForArchive: false,
  showModelForRestore: false,
  showModelForClone: false,
  filterDatakey: false,
  sortDatakey: true,
  model: {
    detail: "",
    open: false,
    desc: "",
    btn1: constantText.yes_text,
    btn2: constantText.no_text,
  },
};

describe("Render TvShowList Component", () => {
  let wrapper;
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup(initialState);
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("render component without error", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test ComponentDidMount", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it("should check back heading text", () => {
    const titleText = findByTestAttr(wrapper, "tvshow-heading-text");
    expect(titleText.text()).toMatch(constantText.tv_show_text?.title);
  });

  it("should call contentState, fetchLeftTabData, fetchAllShows API Success", async (done) => {
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
      "status": 200,
      "response": {
          "status": 200,
          "data": [
              {
                  "title": "Arabic",
                  "status": "1",
                  "id": "14b29f2c-d179-400f-b524-d3a80248c8cc",
                  "code": "ar"
              },
              {
                  "title": "Assamese",
                  "status": "1",
                  "id": "7f7a0f2a-dae7-4535-bc56-86545d384268",
                  "code": "as"
              },
              {
                  "title": "Bahasa (Indonesia)",
                  "status": "1",
                  "id": "7c59f385-57a4-4a04-ac7b-269ea2460abc",
                  "code": "id"
              },
              {
                  "title": "Bengali",
                  "status": "1",
                  "id": "49728102-8b14-4453-91a2-18abe2a837e9",
                  "code": "bn"
              },
              {
                  "title": "Bhojpuri",
                  "status": "1",
                  "id": "49006dbd-71ff-41a1-abe3-8277702ed0f2",
                  "code": "hr"
              },
              {
                  "title": "English",
                  "status": "1",
                  "id": "d5beccd7-e469-4449-baba-a3a57fb67a91",
                  "code": "en"
              },
              {
                  "title": "French",
                  "status": "1",
                  "id": "eb4c9b92-0a9f-44fd-b4dd-f9e8f5628726",
                  "code": "fr"
              },
              {
                  "title": "German",
                  "status": "1",
                  "id": "86e0e39c-6e0e-4f30-9400-f771ba0e503c",
                  "code": "de"
              },
              {
                  "title": "Gujarati",
                  "status": "1",
                  "id": "7e820be2-7915-40fa-9216-48c05fc81f23",
                  "code": "gu"
              },
              {
                  "title": "Hindi",
                  "status": "1",
                  "id": "1007afb0-65ea-4978-bd51-21b0f3b05c20",
                  "code": "hi"
              },
              {
                  "title": "Kannada",
                  "status": "1",
                  "id": "7b78c7af-f865-4ab2-aeba-7823e126307f",
                  "code": "km"
              },
              {
                  "title": "Korean",
                  "status": "1",
                  "id": "d6ed63e9-435a-43d0-86cb-8178e2ca7e6f",
                  "code": "ko"
              },
              {
                  "title": "Malay",
                  "status": "1",
                  "id": "2a4b4b29-ab25-4695-a54a-7783870bb08b",
                  "code": "ms"
              },
              {
                  "title": "Malayalam",
                  "status": "1",
                  "id": "bbefd589-1695-4151-bf4f-8d8dfd11314f",
                  "code": "ml"
              },
              {
                  "title": "Mandarin",
                  "status": "1",
                  "id": "bb9aa39c-8ba7-4263-8e1d-e3fedc36a1ac",
                  "code": "zh"
              },
              {
                  "title": "Marathi",
                  "status": "1",
                  "id": "c2cacebd-445d-4d51-acc8-2f279f341394",
                  "code": "mr"
              },
              {
                  "title": "Odia",
                  "status": "1",
                  "id": "87cd5b07-1448-4a53-9d76-f2b7e8e468ca",
                  "code": "or"
              },
              {
                  "title": "Punjabi",
                  "status": "1",
                  "id": "d2222177-0a34-439b-a8ed-20bee4ac65af",
                  "code": "pa"
              },
              {
                  "title": "Russian",
                  "status": "1",
                  "id": "6038a58e-b25c-4dde-a273-280ef191aa73",
                  "code": "ru"
              },
              {
                  "title": "Tamil",
                  "status": "1",
                  "id": "81993bdb-2ca3-4574-a734-271b9dcaae49",
                  "code": "ta"
              },
              {
                  "title": "Telugu",
                  "status": "1",
                  "id": "5b0c3993-242f-45f7-bcb9-026b4ee80d30",
                  "code": "te"
              },
              {
                  "title": "Thai",
                  "status": "1",
                  "id": "b5ce6081-080f-44e6-99ad-73698ba1c806",
                  "code": "th"
              }
          ]
      }
    }
    const responseData2 = {
      status: 200,
      response: {
        status: 200,
        data: [
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
      ],
      },
    };
    const responseData3 = {
      status: 200,
      response: {
        status: 200,
        data: {count : 20},
        error: null,
      }
    };
    const responseData4 = {
      status: 200,
      response: {
        status: 200,
        data:[
          {
            TvShowImages: [],
            audioLanguages: "Hindi,Punjabi",
            contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
            contentState_populated: {title: "Draft"},
            countries: "",
            dateZee5Published: null,
            externalId: "1-4-1000009",
            journeyType: "1",
            lastModifiedBy_populated: {first_name: "jaipal", last_name: "Singh"},
            lastModifiedOn: "2021-02-16T07:59:44.512Z",
            note: null,
            originCountry: null,
            season: ["bc43ad95-b9be-4fd5-8b29-a17a9e963131"],
            subtype: null,
            subtype_populated: null,
            title: "mirzapur",
            tvShowId: "9c2babc7-3c3d-4f10-85cf-ab6815478710",
            tvShowLicenses: []
          },
            {
              "tvShowId": "ff329b56-d99c-4bd9-acd8-e90f07c24eaa",
              "title": "The Show",
              "subtype": "5b44c8f7-1166-465f-a56c-ae03a08bb501",
              "journeyType": "1",
              "note": null,
              "externalId": "1-4-1000010",
              "contentState": "081cc5b2-a302-4bfb-8e5c-68544ae636e6",
              "originCountry": null,
              "dateZee5Published": "2021-02-04T00:00:00.000Z",
              "lastModifiedOn": "2021-02-03T11:48:01.139Z",
              "audioLanguages": "Hindi,Punjabi",
              "countries": "Rwanda,Tanzania, United Republic of,Zimbabwe",
              "season": [],
              "TvShowImages": [
                {
                  "imageDetails": {
                    "url": "992742-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
                    "size": "8.69 MB",
                    "valid": false,
                    "resolution": "1170✕658"
                  }
                }
              ],
              "subtype_populated": {
                "title": "Original"
              },
              "contentState_populated": {
                "title": "Published"
              },
              "lastModifiedBy_populated": {
                "first_name": "Tarun",
                "last_name": "Kumar"
              },
              "tvShowLicenses": [
                {
                  "validFrom": "2021-02-04T00:00:00.000Z",
                  "validUntil": "2021-02-18T00:00:00.000Z"
                }
              ]
            }
          ],
        error: null,
      }
    };

    wrapper.instance().getAllStatus();
    wrapper.instance().getAllLanguage();
    wrapper.instance().fetchLeftTabData();
    wrapper.instance().getAllShows(true);
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
            expect(wrapper.state("LanguageArr")).toHaveLength(22);
          })
          .catch((err) => {
            console.log(err);
          });
      const request2 = moxios.requests.at(2);
      request2
        .respondWith(responseData2)
        .then((res) => {
          expect(wrapper.state("tabOptions")).toHaveLength(10);
        })
        .catch((err) => {
          console.log(err);
        });
      const request3 = moxios.requests.at(3);
      request3
        .respondWith(responseData3)
        .then((res) => {
          expect(wrapper.state("showsCount")).toBe(20);
        })
        .catch((err) => {
          console.log(err);
        });
      const request4 = moxios.requests.at(4);
      request4
        .respondWith(responseData4)
        .then((res) => {
          expect(wrapper.state("showsCount")).toBe(20);
          expect(wrapper.state("tvshowList")).toHaveLength(2);
          expect(wrapper.state("maxPage")).toBe(2);
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });


  it("should test nested child view", async(done) => {
    const tvshowList = [
      {
        TvShowImages: [],
        audioLanguages: "Hindi,Punjabi",
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        dateZee5Published: null,
        externalId: "1-4-1000009",
        journeyType: "1",
        lastModifiedBy_populated: {first_name: "jaipal", last_name: "Singh"},
        lastModifiedOn: "2021-02-16T07:59:44.512Z",
        note: null,
        originCountry: null,
        season: ["bc43ad95-b9be-4fd5-8b29-a17a9e963131"],
        subtype: null,
        subtype_populated: null,
        title: "mirzapur",
        tvShowId: "9c2babc7-3c3d-4f10-85cf-ab6815478710",
        tvShowLicenses: []
      },
        {
          "tvShowId": "ff329b56-d99c-4bd9-acd8-e90f07c24eaa",
          "title": "The Show",
          "subtype": "5b44c8f7-1166-465f-a56c-ae03a08bb501",
          "journeyType": "1",
          "note": null,
          "externalId": "1-4-1000010",
          "contentState": "081cc5b2-a302-4bfb-8e5c-68544ae636e6",
          "originCountry": null,
          "dateZee5Published": "2021-02-04T00:00:00.000Z",
          "lastModifiedOn": "2021-02-03T11:48:01.139Z",
          "audioLanguages": "Hindi,Punjabi",
          "countries": "Rwanda,Tanzania, United Republic of,Zimbabwe",
          "season": [],
          "TvShowImages": [
            {
              "imageDetails": {
                "url": "992742-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
                "size": "8.69 MB",
                "valid": false,
                "resolution": "1170✕658"
              }
            }
          ],
          "subtype_populated": {
            "title": "Original"
          },
          "contentState_populated": {
            "title": "Published"
          },
          "lastModifiedBy_populated": {
            "first_name": "Tarun",
            "last_name": "Kumar"
          },
          "tvShowLicenses": [
            {
              "validFrom": "2021-02-04T00:00:00.000Z",
              "validUntil": "2021-02-18T00:00:00.000Z"
            }
          ]
        }
      ];
    const responseData0 = {
      status: 200,
      response: {
        status: 200,
        data: [
          {
            "tvShowId": "06aa1fc4-bf30-41dc-9461-db4afb804beb",
            "id": "b418ddfe-6313-4ba2-9c74-aa3a8382e142",
            "title": "No Title",
            "externalId": "1-5-1000186",
            "note": null,
            "lastModifiedOn": "2021-03-02T07:26:11.633Z",
            "journeyType": "3",
            "audioLanguages": null,
            "countries": "",
            "seasonLicenses": [{
              "validFrom": "2021-03-02T00:00:00.000Z",
              "validUntil": "2021-03-06T00:00:00.000Z"
            }],
            "SeasonImages": [
                {
                    "imageDetails": {
                        "url": "arjun-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
                        "size": "6.43 KB",
                        "valid": false,
                        "resolution": "1170✕658"
                    }
                }
            ],
            "contentState_populated": {
                "title": "Draft"
            },
            "lastModifiedBy_populated": {
                "first_name": "Pawan",
                "last_name": "Kumar"
            }
        }
        ],
      },
    };
    wrapper = setup({tvshowList});
    wrapper.instance().viewFirstChild(0,"06aa1fc4-bf30-41dc-9461-db4afb804beb");
    moxios.wait(function () {
      const request0 = moxios.requests.at(0);
      request0
        .respondWith(responseData0)
        .then(() => {
          expect(wrapper.state("tvshowList")[0]['childAssets']).toHaveLength(1);
          //Testing Child
          const spy = jest.spyOn(wrapper.instance(), 'viewFirstChild');
          wrapper.instance().forceUpdate();
          wrapper.update();
          const button = findByTestAttr(wrapper, 'tvshow-child-arrow');
          button.simulate('click');
          expect(spy).toHaveBeenCalled();
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
          value: {"castName":"Alia Bhatt","id":"293700d9-2360-4674-9ebf-34ceed6fa531"},
          createPrefix: "Use",
          path: "",
          display: true,
          label: "Actor",
          validation: {
            required: false
          }
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
          value: {"title":"Archive","status":"1","id":"5b44c8f7-1166-465f-a56c-ae03a08bb503"},
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
    ];
    const instance = wrapper.instance();
    jest.spyOn(instance, "setSelectDataArr");
    instance.setSelectDataArr(res, 0);
    expect(instance.setSelectDataArr).toHaveBeenCalled();
  });

  it("should check filter button showHide onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "showHideFilterDrawer");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-showfilterdrawer");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check applyFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "filterData");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-applyFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check clearFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "clearFilter");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-clearFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });
  it("should check applySortFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "applySortFilter");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-applySortFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });
  it("should check clearSortFilter onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "clearSortFilter");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-clearSortFilter");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check handleRoute onclick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "handleRoute");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-handleRoute");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  it("should check onChange method of search", () => {
    const spy = jest.spyOn(wrapper.instance(), "searchHandleChange");
    const event = { target: { name: "searchString", value: "test" } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-handleChange");
    button.simulate("change", event);
    expect(spy).toHaveBeenCalled();
  });
  it("should check handleRouteExpiredLink for seasons", () => {
    const selectedContentType = tvShowConstants.seasonType;
    wrapper = setup({selectedContentType});
    const show = { journeyType: 2, seasonId : "6fee4f0d-20ad-452b-9bc0-2b26e0809713", tvShowId: "78dd562a-db9f-4532-ba47-127cb47c5ba8"};
    const nestedShow = { journeyType: 1, id : "6fee4f0d-20ad-452b-9bc0-2b26e0809713", tvShowId: "78dd562a-db9f-4532-ba47-127cb47c5ba8"};
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleRouteExpiredLink");
    instance.handleRouteExpiredLink(show, false);
    instance.handleRouteExpiredLink(nestedShow, true);
    expect(instance.handleRouteExpiredLink).toHaveBeenCalledTimes(2);
  });
  it("should check handleSortFilter for seasons", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleSortFilter");
    instance.handleSortFilter(null, 0, {target:{ value: "asc"}});
    expect(instance.handleSortFilter).toHaveBeenCalled();
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
    wrapper = setup({tabOptions});
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleFilterStatusSelection");
    instance.handleFilterStatusSelection(null, 1);
    expect(instance.handleFilterStatusSelection).toHaveBeenCalledTimes(1);
  });
  it("should check handleModel method", () => {
    const model = {"detail":{"contentId":"a4033dd1-01f5-41e3-ab61-d3e7c69f5d7c","view":"archive"},"open":true,"desc":"Do you want to archive this content?","btn1":"Yes","btn2":"No","title":"Archive Content"};
    const language = "EN";
    const allStatus = [{"title":"Archived","status":"1","id":"28d8bc82-af3a-4e04-bdf7-0a5df324ac51"},{"title":"Changed","status":"1","id":"38c34c4f-68c9-4eb0-b71f-b80f1e551447"},{"title":"Draft","status":"1","id":"3bb64421-f15f-4dda-adec-03c324c140a3"},{"title":"Need Work","status":"1","id":"38c34c4f-68c9-4eb0-b71f-b80f1e551448"},{"title":"Published","status":"1","id":"081cc5b2-a302-4bfb-8e5c-68544ae636e6"},{"title":"Publishing Queue","status":"1","id":"4e565298-6e9c-4d5f-8a03-c23a42cabedd"},{"title":"Scheduled","status":"1","id":"3951d801-9758-4a09-be3e-0af342ba9d13"},{"title":"Submitted To Review","status":"1","id":"38c34c4f-68c9-4eb0-b71f-b80f1e551446"},{"title":"Unpublished","status":"1","id":"21f691eb-d73c-4ba2-a20f-59ac1dfd0ffe"}];
    wrapper = setup({model, language, allStatus});
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleModel");
    instance.handleModel(true, model);
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  });
  it("should check handleRouteExpiredLink for tvshow", () => {
    let selectedContentType = tvShowConstants.tvshowType;
    wrapper = setup({selectedContentType});
    const show = { journeyType: 2, seasonId : "6fee4f0d-20ad-452b-9bc0-2b26e0809713", tvShowId: "78dd562a-db9f-4532-ba47-127cb47c5ba8"};
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleRouteExpiredLink");
    instance.handleRouteExpiredLink(show, false);
    expect(instance.handleRouteExpiredLink).toHaveBeenCalledTimes(1);
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
  it("should check handleConditionRoute method", () => {
    const id  = "7ce2edb2-705b-455e-8622-8a1b201ad114";
    const view = "archive";
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleConditionRoute");
    instance.handleConditionRoute(view, id);
    expect(instance.handleConditionRoute).toHaveBeenCalledTimes(1);
  });
  it("should check openSeheduledHistory onclick method", () => {
    const rows = [
      {
        "tvShowId": "ff329b56-d99c-4bd9-acd8-e90f07c24eaa",
        "title": "The Show",
        "subtype": "5b44c8f7-1166-465f-a56c-ae03a08bb501",
        "journeyType": "1",
        "note": null,
        "externalId": "1-4-1000010",
        "contentState": "081cc5b2-a302-4bfb-8e5c-68544ae636e6",
        "originCountry": null,
        "dateZee5Published": "2021-02-04T00:00:00.000Z",
        "lastModifiedOn": "2021-02-03T11:48:01.139Z",
        "audioLanguages": "Hindi,Punjabi",
        "countries": "Rwanda,Tanzania, United Republic of,Zimbabwe",
        "season": [],
        "TvShowImages": [
          {
            "imageDetails": {
              "url": "992742-07c3cc5f-0b49-4032-af0c-159565b559db.jpg",
              "size": "8.69 MB",
              "valid": false,
              "resolution": "1170✕658"
            }
          }
        ],
        "subtype_populated": {
          "title": "Original"
        },
        "contentState_populated": {
          "title": "Published"
        },
        "lastModifiedBy_populated": {
          "first_name": "Tarun",
          "last_name": "Kumar"
        },
        "tvShowLicenses": [
          {
            "validFrom": "2021-02-04T00:00:00.000Z",
            "validUntil": "2021-02-18T00:00:00.000Z"
          }
        ]
      }
    ];
    wrapper.setState({tvshowList : rows});
    const spy = jest.spyOn(wrapper.instance(), "openSeheduledHistory");
    wrapper.instance().forceUpdate();
    const button = findByTestAttr(wrapper, "tvshows-openSeheduledHistory");
    button.simulate("click");
    expect(spy).toHaveBeenCalled();
  });
  

  it("should check onChange method of filter date", () => {
    const spy = jest.spyOn(wrapper.instance(), "handleDateChange");
    const event = { target: { name: "startDate", value: "2021-02-09" } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "tvshows-handleDateChange");
    button.simulate("change", event);
    expect(spy).toHaveBeenCalled();
  });

  it("should check onChange method of leftTab", () => {
    const tab = {
      displayName: "Draft",
      count: "278",
      id: "3bb64421-f15f-4dda-adec-03c324c140a3",
      status: "1",
      statusText: "Last Modified By",
    };
    const instance = wrapper.instance();
    jest.spyOn(instance, "changeTab");
    instance.changeTab(tab, 1);
    expect(instance.changeTab).toHaveBeenCalled();
  });

  it("should check filterValidityCheck method", () => {
    const { filters } = wrapper.state();
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
    jest.spyOn(TvShowComponent, "filterValidityCheck");
    TvShowComponent.filterValidityCheck([...selectFilters]);
    expect(TvShowComponent.filterValidityCheck).toHaveBeenCalled();
  });

  it("should test handleSearchRoute", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleSearchRoute");
    instance.handleSearchRoute("Seasons");
    instance.handleSearchRoute("TV Show");
    instance.handleSearchRoute("Episodes");
    expect(instance.handleSearchRoute).toHaveBeenCalledTimes(3);
  });

  it("should test handleModel", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleModel");
    instance.handleModel();
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
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

  it("should test nextCall", () => {
    const maxPage = 2;
    wrapper = setup({isRequestIntiate: true, maxPage});
    const instance = wrapper.instance();
    jest.spyOn(instance, "nextCall");
    instance.nextCall(1);
    expect(instance.nextCall).toHaveBeenCalledTimes(1);
  });

  it("Should renders AngleLeftArrowIcon default", () => {
    expect(wrapper.containsMatchingElement(<AngleLeftArrow />)).toEqual(true);
  });

  it("Should renders BreadcrumbsComp default", () => {
    expect(wrapper.containsMatchingElement(<BreadcrumbsComp />)).toEqual(true);
  });

  it("Should renders ButtonField default", () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  });
});
