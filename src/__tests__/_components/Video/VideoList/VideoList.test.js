import React from "react";
import { shallow, mount } from "enzyme";
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import VideoList from "../../../../_components/Video/VideoList/VideoList";
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<VideoList {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe("Render VideoList Component", () => {
  let wrapper;
  const event = { target: { name: 'xyz', value: '123'}, preventDefault: jest.fn() }
  beforeEach(() => {
    wrapper = setup();
    moxios.install(axios);
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });
  it('Should renders VideoList default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('Should check input field', () => {
    const inputField = wrapper.find('input');
    expect(inputField.exists()).toBe(true);
  });
 
  it('should test fetchLeftTabData',()=>{
    const mockSet = {
      obj:{
        count: "10",
        description: "description",
        id: "3bb64421-f15f-4dda-adec-03c324c140a3",
        status: "1",
        title: "Draft"
      },
      tabOptions:
      [{
        count: "10",
        description: "description",
        id: "3bb64421-f15f-4dda-adec-03c324c140a3",
        status: "1",
        title: "Draft"
      }]
    }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchLeftTabData');
    instance.fetchLeftTabData();
    expect(instance.fetchLeftTabData).toHaveBeenCalledTimes(1);
  });

  it("should test componentDidMount", () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  });

  it("should test getAllStatus", () => {
    jest.spyOn(wrapper.instance(), "getAllStatus");
    wrapper.instance().getAllStatus();
    expect(wrapper.instance().getAllStatus).toBeCalled();
  });

  it("should test setQueryData", () => {
    const mockSet = {
      isFilterUpdate : true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "setQueryData");
    wrapper.instance().setQueryData();
    expect(wrapper.instance().setQueryData).toBeCalled();
  });

  it("should test setVideoListData", () => {
    jest.spyOn(wrapper.instance(), "setVideoListData");
    wrapper.instance().setVideoListData();
    expect(wrapper.instance().setVideoListData).toBeCalled();
  });

  it("should test getAllVideos", () => {
    jest.spyOn(wrapper.instance(), "getAllVideos");
    wrapper.instance().getAllVideos();
    expect(wrapper.instance().getAllVideos).toBeCalled();
  });

  it("should test setListResponse", () => {
    const mockSet = {
      response : [{
        VideoLicenses: [],
        VideoMapContent: null,
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        createdOn: "2021-02-25T13:36:17.054Z",
        dateZee5Published: null,
        duration: null,
        externalId: "0-0-Z51000523",
        journeyType: "1",
        lastModifiedBy_populated: {first_name: "Shrishti", last_name: "Sahu"},
        lastModifiedOn: "2021-02-25T13:36:17.054Z",
        licenceExpDays: [],
        modifiedOn: "2021-02-25T13:36:17.054Z",
        note: null,
        originCountry: null,
        showDetails: false,
        subtype: null,
        subtype_populated: null,
        title: "COPY-No Title",
        videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      }
    ],
    isRequestIntiate: true,
    changingTab: false,
    videoCount : 0,
    videosList: []
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "setListResponse");
    wrapper.instance().setListResponse(mockSet.response);
    expect(wrapper.instance().setListResponse).toBeCalled();
  });

  it("should test fetchListTotal", () => {
    jest.spyOn(wrapper.instance(), "fetchListTotal");
    wrapper.instance().fetchListTotal();
    expect(wrapper.instance().fetchListTotal).toBeCalled();
  });

  it("should test nextCall", () => {
    const mockSet = {
      maxPage: "10",
      isRequestIntiate: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "nextCall");
    wrapper.instance().nextCall();
    expect(wrapper.instance().nextCall).toBeCalled();
  });

  it('should check showHideStatePopup', () => {
    const mockSet = {
      currentVideo:{
                VideoLicenses:[
                  {validFrom: "2021-02-25T00:00:00.000Z", validUntil: "2021-02-28T00:00:00.000Z"}
                ],
                VideoMapContent: null,
                contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                contentState_populated: {title: "Draft"},
                countries: "India",
                createdOn: "2021-02-25T13:36:17.054Z",
                dateZee5Published: null,
                duration: null,
                externalId: "0-0-Z51000523",
                journeyType: "1",
                lastModifiedBy_populated: {first_name: "Shivam", last_name: "Sharma"},
                lastModifiedOn: "2021-02-25T14:16:46.464Z",
                licenceExpDays: [3],
                modifiedOn: "2021-02-25T14:16:46.465Z",
                note: null,
                originCountry: null,
                showDetails: false,
                subtype: null,
                subtype_populated: null,
                title: "COPY-No Title",
                videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      },
      showModelForArchive: true


    };
    wrapper.setState({...mockSet})
    jest.spyOn(wrapper.instance(), 'showHideStatePopup');
    wrapper.instance().showHideStatePopup(mockSet.currentVideo);
    expect(wrapper.instance().showHideStatePopup).toBeCalled();
  });

  it('should check showHideClonePopup', () => {
    const mockSet = {
      currentVideo:{
                VideoLicenses:[
                  {validFrom: "2021-02-25T00:00:00.000Z", validUntil: "2021-02-28T00:00:00.000Z"}
                ],
                VideoMapContent: null,
                contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                contentState_populated: {title: "Draft"},
                countries: "India",
                createdOn: "2021-02-25T13:36:17.054Z",
                dateZee5Published: null,
                duration: null,
                externalId: "0-0-Z51000523",
                journeyType: "1",
                lastModifiedBy_populated: {first_name: "Shivam", last_name: "Sharma"},
                lastModifiedOn: "2021-02-25T14:16:46.464Z",
                licenceExpDays: [3],
                modifiedOn: "2021-02-25T14:16:46.465Z",
                note: null,
                originCountry: null,
                showDetails: false,
                subtype: null,
                subtype_populated: null,
                title: "COPY-No Title",
                videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      },
      showModelForClone: true,
      journeyType:1


    };
    wrapper.setState({...mockSet})
    jest.spyOn(wrapper.instance(), 'showHideClonePopup');
    wrapper.instance().showHideClonePopup(mockSet.currentVideo);
    expect(wrapper.instance().showHideClonePopup).toBeCalled();
  });

  it('should check showHideRestorePopup', () => {
    const mockSet = {
      currentVideo:{
                VideoLicenses:[
                  {validFrom: "2021-02-25T00:00:00.000Z", validUntil: "2021-02-28T00:00:00.000Z"}
                ],
                VideoMapContent: null,
                contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                contentState_populated: {title: "Draft"},
                countries: "India",
                createdOn: "2021-02-25T13:36:17.054Z",
                dateZee5Published: null,
                duration: null,
                externalId: "0-0-Z51000523",
                journeyType: "1",
                lastModifiedBy_populated: {first_name: "Shivam", last_name: "Sharma"},
                lastModifiedOn: "2021-02-25T14:16:46.464Z",
                licenceExpDays: [3],
                modifiedOn: "2021-02-25T14:16:46.465Z",
                note: null,
                originCountry: null,
                showDetails: false,
                subtype: null,
                subtype_populated: null,
                title: "COPY-No Title",
                videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      },
      showModelForArchive: true


    };
    wrapper.setState({...mockSet})
    jest.spyOn(wrapper.instance(), 'showHideRestorePopup');
    wrapper.instance().showHideRestorePopup(mockSet.currentVideo,mockSet.journeyType);
    expect(wrapper.instance().showHideRestorePopup).toBeCalled();
  });

  it("should test movetoArchive", () => {
    jest.spyOn(wrapper.instance(), "movetoArchive");
    wrapper.instance().movetoArchive();
    expect(wrapper.instance().movetoArchive).toBeCalled();
  });

  it("should test cloneContent", () => {
    jest.spyOn(wrapper.instance(), "cloneContent");
    wrapper.instance().cloneContent();
    expect(wrapper.instance().cloneContent).toBeCalled();
  });

  it("should test restoreinDraft", () => {
    jest.spyOn(wrapper.instance(), "restoreinDraft");
    wrapper.instance().restoreinDraft();
    expect(wrapper.instance().restoreinDraft).toBeCalled();
  });

  it("should test showHideSortDrawer", () => {
    const mockSet = {
      openSortDrawer: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "showHideSortDrawer");
    wrapper.instance().showHideSortDrawer();
    expect(wrapper.instance().showHideSortDrawer).toBeCalled();
  });

  it("should test showHideFilterDrawer", () => {
    const mockSet = {
      showFilterDrawer: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "showHideFilterDrawer");
    wrapper.instance().showHideFilterDrawer();
    expect(wrapper.instance().showHideFilterDrawer).toBeCalled();
  });

  it("should test filterData", () => {
    const mockSet = {
            byDate: "",
            endDate: "",
            filterByDate:[{
              data:{
                endDate: "2021-02-18",
                endDateKey: "endDate",
                endPlaceholder: "End Date",
                startDate: "2021-02-11",
                startDateKey: "startDate",
                startPlaceholder: "Start Date"
              },
              display: true,
              for: "All",
              label: "Modified On",
              name: "lastModifiedOn",
              formValidity: true,
              querys: "",
              filterByStatus:[
               {label: "All", displayName: "All", active: true},
                {label: "Draft", displayName: "Draft"}]
            }],
            startDate: "",
            selectFilters:[{
                col: "",
                data: [],
                display: true,
                keyText: "title",
                label: "Primary Genre",
                limitTags: 1,
                multiple: true,
                name: "primaryGenre",
                path: "/master/VideoPrimaryGenre",
                touched: 0,
                type: "dropdownAsync",
                valid: true,
                validation: {required: false},
                value: []}
            ],
        queryData:{
          contentState: "",
          lastEvaluatedKey: "",
          limit: 10,
          page: 2,
          searchString: ""
        }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "filterData");
    wrapper.instance().filterData();
    expect(wrapper.instance().filterData).toBeCalled();
  });

  it("should test getAppliedFilter", () => {
    const mockSet = {
     JSON: [{
              col: "",
              data: [],
              display: true,
              keyText: "title",
              label: "Primary Genre",
              limitTags: 1,
              multiple: true,
              name: "primaryGenre",
              path: "/master/VideoPrimaryGenre",
              touched: 0,
              type: "dropdownAsync",
              valid: true,
              validation: {required: false},
              value: []
          }],

      filterByDate :[{
                display: true,
                for: "All",
                label: "Modified On",
                name: "lastModifiedOn",
                date: {
                  endDate: "2021-02-28",
                  endDateKey: "endDate",
                  endPlaceholder: "End Date",
                  startDate: "2021-02-12",
                  startDateKey: "startDate",
                  startPlaceholder: "Start Date"
                  }
                }],

         checkDate:{
              display: true,
              for: "All",
              label: "Modified On",
              name: "lastModifiedOn",
              date:{
                endDate: "2021-02-28",
                endDateKey: "endDate",
                endPlaceholder: "End Date",
                startDate: "2021-02-12",
                startDateKey: "startDate",
                startPlaceholder: "Start Date"
              },

              item: {
                   col: "",
                  data: [],
                  display: true,
                  keyText: "title",
                  label: "Mood Emotion",
                  limitTags: 1,
                  multiple: true,
                  name: "moodEmotion",
                  path: "/master/EmotionTitle",
                  touched: 0,
                  type: "dropdownAsync",
                  valid: true,
                  validation: {required: false},
                  value: []   
              }
         }            
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "getAppliedFilter");
    wrapper.instance().getAppliedFilter(mockSet.JSON?.type,mockSet.filterByDate,mockSet.checkDate.date.startPlaceholder);
    expect(wrapper.instance().getAppliedFilter).toBeCalled();
  });

  it("should test getAppliedFilter with type text", () => {
    const mockSet = {
     JSON: [{
              col: "",
              data: [],
              display: true,
              keyText: "title",
              label: "Primary Genre",
              limitTags: 1,
              multiple: true,
              name: "primaryGenre",
              path: "/master/VideoPrimaryGenre",
              touched: 0,
              type: "text",
              valid: true,
              validation: {required: false},
              value: ""
          }],

          item: {
                col: "",
              data: [],
              display: true,
              keyText: "title",
              label: "Primary Genre",
              limitTags: 1,
              multiple: true,
              name: "moodEmotion",
              path: "/master/EmotionTitle",
              touched: 0,
              type: "text",
              valid: true,
              validation: {required: false},
              value: ""  
          },
          filterByDate :[{
            display: true,
            for: "All",
            label: "Modified On",
            name: "lastModifiedOn",
            date: {
              endDate: "2021-02-28",
              endDateKey: "endDate",
              endPlaceholder: "End Date",
              startDate: "2021-02-12",
              startDateKey: "startDate",
              startPlaceholder: "Start Date"
              }
            }]
         } 
            
    
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "getAppliedFilter");
    wrapper.instance().getAppliedFilter(mockSet.JSON?.type, mockSet.filterByDate,mockSet.item.label);
    expect(wrapper.instance().getAppliedFilter).toBeCalled();
  });

  it("should test changeTab", () => {
    const mockSet = {
      tab: {
        count: "10",
        displayName: "Draft",
        id: "3bb64421-f15f-4dda-adec-03c324c140a3",
        status: "1",
        statusText: "Last Modified By"
      },
      queryData:{
        contentState: "",
        lastEvaluatedKey: "",
        limit: 10,
        page: 2,
        searchString: ""
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "changeTab");
    wrapper.instance().changeTab(mockSet.tab, 0);
    expect(wrapper.instance().changeTab).toBeCalled();
  });

  it("should test checkvalidation", () => {
    const mockSet = {
      sortingFilters: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "checkvalidation");
    wrapper.instance().checkvalidation();
    expect(wrapper.instance().checkvalidation).toBeCalled();
  });

  it("should test handleOpenCloseQuickDropDown", () => {
    const mockSet = {
      openQuickDropdown: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleOpenCloseQuickDropDown");
    wrapper.instance().handleOpenCloseQuickDropDown();
    expect(wrapper.instance().handleOpenCloseQuickDropDown).toBeCalled();
  });

  it("should test handleCloseQuickDropdown", () => {
    const mockSet = {
      openQuickDropdown: false
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleCloseQuickDropdown");
    wrapper.instance().handleCloseQuickDropdown();
    expect(wrapper.instance().handleCloseQuickDropdown).toBeCalled();
  });

  it("should test handleDropDownItem", () => {
    const mockSet = {
      option: {
        disabled: false,
        displayName: "Create Quick Filing",
        permissionKey: "videos",
        permissionName: "canCreate",
        permissionSubKey: "quickFiling",
        title: "quick"
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleDropDownItem");
    wrapper.instance().handleDropDownItem(mockSet.option);
    expect(wrapper.instance().handleDropDownItem).toBeCalled();
  });
  
  it("should test handleOpenCloseBulkDropDown", () => {
    const mockSet = {
      openBulkDropdown: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleOpenCloseBulkDropDown");
    wrapper.instance().handleOpenCloseBulkDropDown();
    expect(wrapper.instance().handleOpenCloseBulkDropDown).toBeCalled();
  });

  it("should test handleCloseBulkDropdown", () => {
    const mockSet = {
      openBulkDropdown: false
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleCloseBulkDropdown");
    wrapper.instance().handleCloseBulkDropdown();
    expect(wrapper.instance().handleCloseBulkDropdown).toBeCalled();
  });

  it("should test selectQuickFilling", () => {
    const route = "video/quick/create";
    wrapper.setState({...route});
    jest.spyOn(wrapper.instance(), "selectQuickFilling");
    wrapper.instance().selectQuickFilling(route);
    expect(wrapper.instance().selectQuickFilling).toBeCalled();
  });

  it("should test selectBulkFilling", () => {
    const mockSet = {
      openBulkDropdown: true,
      quickFellingValue: "Option 1" 
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "selectBulkFilling");
    wrapper.instance().selectBulkFilling(mockSet.quickFellingValue);
    expect(wrapper.instance().selectBulkFilling).toBeCalled();
  });

  it("should test searchHandleChange", () => {
    const mockSet = {
      queryData:{
        contentState: "",
        lastEvaluatedKey: "",
        limit: 10,
        page: 2,
        searchString: ""
      },
      page: 1
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "searchHandleChange");
    wrapper.instance().searchHandleChange(event);
    expect(wrapper.instance().searchHandleChange).toBeCalled();
  });

  it("should test handleSortFilter", () => {
    const mockSet = {
      item:{
        data:[{value: "asc", label: "Ascending to Descending"}],
        display: true,
        for: "",
        label: "Main Release Date",
        name: "mainSortType",
        sortKey: "mainSortKey",
        sortValue: "dateZee5Published",
        value: "desc"
      },
      page: 1
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleSortFilter");
    wrapper.instance().handleSortFilter(mockSet.item,0,event);
    expect(wrapper.instance().handleSortFilter).toBeCalled();
  });

  it("should test clearFilterData", () => {
    const mockSet = {
      filterByStatus:[
            {
            active: true,
            displayName: "All",
            label: "All",
          },
          {
            active: false,
            displayName: "Draft",
            label: "Draft"
          }
    ],
    filterByDate: [
      {
        date:{
          endDate: "",
          endDateKey: "endDate",
          endPlaceholder: "End Date",
          startDate: "",
          startDateKey: "startDate",
          startPlaceholder: "Start Date"
        },
        display: true,
        for: "All",
        label: "Modified On",
        name: "lastModifiedOn"
      }
    ],
    queryData:{
      contentState: "",
      lastEvaluatedKey: "",
      limit: 10,
      page: 2,
      searchString: ""
    }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "clearFilterData");
    wrapper.instance().clearFilterData();
    expect(wrapper.instance().clearFilterData).toBeCalled();
  });

  it("should test clearFilter", () => {
    jest.spyOn(wrapper.instance(), "clearFilter");
    wrapper.instance().clearFilter(event);
    expect(wrapper.instance().clearFilter).toBeCalled();
  });

  it("should test clearSortFilter", () => {
    const mockSet = {
      sortingFilters:[{
        data:[{value: "asc", label: "Ascending to Descending"}],
        display: true,
        for: "",
        label: "Main Release Date",
        name: "mainSortType",
        sortKey: "mainSortKey",
        sortValue: "dateZee5Published",
        value: ""
      }]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "clearSortFilter");
    wrapper.instance().clearSortFilter();
    expect(wrapper.instance().clearSortFilter).toBeCalled();
  });

  it("should test applySortFilter", () => {
    const mockSet = {
      queryData:{
        contentState: "",
        lastEvaluatedKey: "",
        limit: 10,
        page: 2,
        searchString: ""
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "applySortFilter");
    wrapper.instance().applySortFilter();
    expect(wrapper.instance().applySortFilter).toBeCalled();
  });

  it("should test showStatusField", () => {
    const mockSet = {
      selectFilters:[{
        col: "",
        data: [],
        display: true,
        keyText: "title",
        label: "Primary Genre",
        limitTags: 1,
        multiple: true,
        name: "primaryGenre",
        path: "/master/VideoPrimaryGenre",
        touched: 0,
        type: "dropdownAsync",
        valid: true,
        validation: {required: false},
        value: []}
    ],
      item : {
        col: "",
        data: [],
        display: true,
        keyText: "title",
        label: "Primary Genre",
        limitTags: 1,
        multiple: true,
        name: "translationStatus",
        path: "/master/VideoPrimaryGenre",
        touched: 0,
        type: "dropdownAsync",
        valid: true,
        validation: {required: false},
        value: []},

        flag: true
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "showStatusField");
    wrapper.instance().showStatusField(mockSet.selectFilters,mockSet.flag,mockSet.item.name,mockSet.item.display );
    expect(wrapper.instance().showStatusField).toBeCalled();
  });

  it("should test handleRoute", () => {
    jest.spyOn(wrapper.instance(), "handleRoute");
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  });

  it("should test goToLinkedVideo", () => {
    jest.spyOn(wrapper.instance(), "goToLinkedVideo");
    wrapper.instance().goToLinkedVideo();
    expect(wrapper.instance().goToLinkedVideo).toBeCalled();
  });

  it("should test filterChange", () => {
    const mockSet = {
      filterByDate:[{
        data:{
          endDate: "2021-02-18",
          endDateKey: "endDate",
          endPlaceholder: "End Date",
          startDate: "2021-02-11",
          startDateKey: "startDate",
          startPlaceholder: "Start Date"
        },
        display: true,
        for: "All",
        label: "Modified On",
        name: "lastModifiedOn",
        formValidity: true,
        querys: "",
        filterByStatus:[
         {label: "All", displayName: "All", active: true},
          {label: "Draft", displayName: "Draft"}]
      }],

      updatedElement:{
        col: "",
        data: [],
        display: true,
        keyText: "title",
        label: "Primary Genre",
        limitTags: 1,
        multiple: true,
        name: "translationLanguage",
        path: "/master/VideoPrimaryGenre",
        touched: 0,
        type: "dropdownAsync",
        valid: true,
        validation: {required: false},
        value: []}
    
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "filterChange");
    wrapper.instance().filterChange(event,0,mockSet.updatedElement.name);
    expect(wrapper.instance().filterChange).toBeCalled();
  });

  it("should test viewVideoHandler", () => {
    const mockSet = {
      video:[{
        VideoLicenses: [],
        VideoMapContent: null,
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        createdOn: "2021-02-25T13:36:17.054Z",
        dateZee5Published: null,
        duration: null,
        externalId: "0-0-Z51000523",
        journeyType: "1",
        lastModifiedBy_populated: {first_name: "Shrishti", last_name: "Sahu"},
        lastModifiedOn: "2021-02-25T13:36:17.054Z",
        licenceExpDays: [],
        modifiedOn: "2021-02-25T13:36:17.054Z",
        note: null,
        originCountry: null,
        showDetails: false,
        subtype: null,
        subtype_populated: null,
        title: "COPY-No Title",
        videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      }
    ]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "viewVideoHandler");
    wrapper.instance().viewVideoHandler(mockSet.video);
    expect(wrapper.instance().viewVideoHandler).toBeCalled();
  });

  it("should test showHideScheduledDrawer", () => {
    jest.spyOn(wrapper.instance(), "showHideScheduledDrawer");
    wrapper.instance().showHideScheduledDrawer();
    expect(wrapper.instance().showHideScheduledDrawer).toBeCalled();
  });

  it("should test openSeheduledHistory", () => {
    const mockSet = {
      video:[{
        VideoLicenses: [],
        VideoMapContent: null,
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        createdOn: "2021-02-25T13:36:17.054Z",
        dateZee5Published: null,
        duration: null,
        externalId: "0-0-Z51000523",
        journeyType: "1",
        lastModifiedBy_populated: {first_name: "Shrishti", last_name: "Sahu"},
        lastModifiedOn: "2021-02-25T13:36:17.054Z",
        licenceExpDays: [],
        modifiedOn: "2021-02-25T13:36:17.054Z",
        note: null,
        originCountry: null,
        showDetails: false,
        subtype: null,
        subtype_populated: null,
        title: "COPY-No Title",
        videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      }
    ]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "openSeheduledHistory");
    wrapper.instance().openSeheduledHistory(mockSet.video,0);
    expect(wrapper.instance().openSeheduledHistory).toBeCalled();
  });

  it("should test closeSeheduledHistory", () => {
    const mockSet = {
      videoHistoryData: {},
      showScheduledDrawer: false,
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "closeSeheduledHistory");
    wrapper.instance().closeSeheduledHistory();
    expect(wrapper.instance().closeSeheduledHistory).toBeCalled();
  });

  it("should test getScheduledUi", () => {
    jest.spyOn(wrapper.instance(), "getScheduledUi");
    wrapper.instance().getScheduledUi();
    expect(wrapper.instance().getScheduledUi).toBeCalled();
  });

  it("should test archiveServerCalls", () => {
    jest.spyOn(wrapper.instance(), "archiveServerCalls");
    wrapper.instance().archiveServerCalls();
    expect(wrapper.instance().archiveServerCalls).toBeCalled();
  });

  it("should test handleModel", () => {
    const mockSet = {
      action: true,
      shallowModel: {
        btn1: "Yes",
        btn2: "No",
        desc: "Do you want to restore this Content?",
        detail:{
          contentId: "21df6aee-2e6a-4d83-93f3-4be5d3e90af1",
          view: "restore"
        },
        open: true,
        title: "Restore Content"
      },
      model : {
        btn1: "Yes",
        btn2: "No",
        desc: "Do you want to restore this Content?",
        detail:{
          contentId: "21df6aee-2e6a-4d83-93f3-4be5d3e90af1",
          view: "restore"
        },
        open: true,
        title: "Restore Content"
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleModel");
    wrapper.instance().handleModel(mockSet.action, mockSet.model,mockSet.shallowModel.view);
    expect(wrapper.instance().handleModel).toBeCalled();
  });

  it("should test handleConditionRoute", () => {
    const mockSet = {
      view: "archive",
      id: "3178d3b4-7c02-16ec-4538-2d860a8f494a",
      detail:{
        view: "archive",
        contentId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
      }
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleConditionRoute");
    wrapper.instance().handleConditionRoute(mockSet.view, mockSet.id);
    expect(wrapper.instance().handleConditionRoute).toBeCalled();
  });

  it("should test handleAutoCreateInput", () => {
    const mockSet = {
      value: "test",
      id: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleAutoCreateInput");
    wrapper.instance().handleAutoCreateInput(mockSet.value, mockSet.id);
    expect(wrapper.instance().handleAutoCreateInput).toBeCalled();
  });

  it("should test selectCountryGroup", () => {
    jest.spyOn(wrapper.instance(), "selectCountryGroup");
    wrapper.instance().selectCountryGroup(event);
    expect(wrapper.instance().selectCountryGroup).toBeCalled();
  });

  it("should test handleFilterStatusSelection", () => {
    const mockSet = {
      selectedTab: "1"
    }
    jest.spyOn(wrapper.instance(), "handleFilterStatusSelection");
    wrapper.instance().handleFilterStatusSelection(event,mockSet.selectedTab );
    expect(wrapper.instance().handleFilterStatusSelection).toBeCalled();
  });

  it("should test getFiltersUi", () => {
    jest.spyOn(wrapper.instance(), "getFiltersUi");
    wrapper.instance().getFiltersUi();
    expect(wrapper.instance().getFiltersUi).toBeCalled();
  });


  it("should test getSortUi", () => {
    jest.spyOn(wrapper.instance(), "getSortUi");
    wrapper.instance().getSortUi();
    expect(wrapper.instance().getSortUi).toBeCalled();
  });

  it("should test handleKeyPress", () => {
    jest.spyOn(wrapper.instance(), "handleKeyPress");
    wrapper.instance().handleKeyPress(event);
    expect(wrapper.instance().handleKeyPress).toBeCalled();
  });

  it("should test handleKeyUp", () => {
    jest.spyOn(wrapper.instance(), "handleKeyUp");
    wrapper.instance().handleKeyUp(event);
    expect(wrapper.instance().handleKeyUp).toBeCalled();
  });

  it("should test toggleCountryPopup", () => {
    const mockSet = {
      SelectedVideoMoreCountries: [{
        "id": "2feeac02-7d14-45f0-b94a-2ae30235f79d",
        "title": "India"
      }],
        showModelForCountries: true,
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "toggleCountryPopup");
    wrapper.instance().toggleCountryPopup();
    expect(wrapper.instance().toggleCountryPopup).toBeCalled();
  });

  it("should test showHideCountriesPopup", () => {
    const mockSet = {
      showModelForCountries: true,
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "showHideCountriesPopup");
    wrapper.instance().showHideCountriesPopup();
    expect(wrapper.instance().showHideCountriesPopup).toBeCalled();
  });

  it("should test handleRouteExpiredLink", () => {
    const mockSet = {
        video:[{
          VideoLicenses: [],
          VideoMapContent: null,
          contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
          contentState_populated: {title: "Draft"},
          countries: "",
          createdOn: "2021-02-25T13:36:17.054Z",
          dateZee5Published: null,
          duration: null,
          externalId: "0-0-Z51000523",
          journeyType: "1",
          lastModifiedBy_populated: {first_name: "Shrishti", last_name: "Sahu"},
          lastModifiedOn: "2021-02-25T13:36:17.054Z",
          licenceExpDays: [],
          modifiedOn: "2021-02-25T13:36:17.054Z",
          note: null,
          originCountry: null,
          showDetails: false,
          subtype: null,
          subtype_populated: null,
          title: "COPY-No Title",
          videoId: "3178d3b4-7c02-16ec-4538-2d860a8f494a"
        }
      ]
    }
    wrapper.setState({...mockSet});
    jest.spyOn(wrapper.instance(), "handleRouteExpiredLink");
    wrapper.instance().handleRouteExpiredLink(mockSet.video);
    expect(wrapper.instance().handleRouteExpiredLink).toBeCalled();
  });

  it("should test refreshQueue", () => {
    jest.spyOn(wrapper.instance(), "refreshQueue");
    wrapper.instance().refreshQueue();
    expect(wrapper.instance().refreshQueue).toBeCalled();
  });

  it("should test render", () => {
    jest.spyOn(wrapper.instance(), "render");
    wrapper.instance().render();
    expect(wrapper.instance().render).toBeCalled();
  });


});