import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import MapContent from '../../../_components/TranscodingManagement/MapContent/MapContent';
import { findByTestAttr } from '../../../Utils';

import axios from "../../../_helpers/axiosInstance";

/**
 * Factory function to create a ShallowWrapper for the Transcoding Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const initialState = {
    transcodingList: [{ externalId: 'zee5123', name: "test" }],
    isRequestIntiate: false,
    searchText: '',
    queryData: {
        limit: 10, searchString: "", page: 0
    },
    count: 0,
    maxPage: null,
    selectedTab: 0,
    list: [{externaId: 'xyz123'}]
}

const setup = () => {
    const wrapper = shallow(<MapContent />);
    return wrapper;
}

describe("Render MapContent Component", () => {
    let wrapper;
    let instance;
    const filters = {
        filterByDate: [
            {
                date: {
                    endDate: "2021-02-26", endDateKey: "endDate", endPlaceholder: "End Date", startDate: "2021-02-16",
                    startDateKey: "startDate", startPlaceholder: "Start Date"
                },
                display: true, for: "All", label: "Modified On", name: "lastModifiedOn"
            },
            {
                date: { startDate: "", endDate: "", startDateKey: "startDate", endDateKey: "endDate", startPlaceholder: "Start Date" },
                display: false, for: "Draft", label: "Modified On", name: "lastModifiedOn"
            },
            {
                date: { startDate: "", endDate: "", startDateKey: "startDate", endDateKey: "endDate", startPlaceholder: "Start Date" },
                display: false, for: "Changed", label: "Changed On", name: "lastModifiedOn"
            }
        ],
        formValidity: false, querys: "",
        selectFilters: [
            { col: "", label: "External Id", name: "externalId", touched: 0, type: "text", valid: true, validation: { required: false }, value: "" },
            { name: "licenseGroupCountries", keyText: "title", value: [], col: "", multiple: true },
            { name: "translationLanguage", keyText: "title", value: [], col: "", multiple: true },
            { name: "translationStatus", keyText: "title", value: null, col: "", type: "dropdownAsync" }
        ]
    }
    beforeEach(() => {
        moxios.install(axios);
        wrapper = setup();
        wrapper.setState({ ...initialState });
        instance = wrapper.instance();
    });

    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should renders MapContent default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test handleRoute method', () => {
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toBeCalled();
    })

    it('should test searchContent method', () => {
        const event = { target: { value: 'search' } };
        jest.spyOn(instance, 'searchContent');
        instance.searchContent(event);
        expect(instance.searchContent).toBeCalled();
    })

    it('should test componentDidMount method', () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })

    it('should test getAllMovies method', () => {
        jest.spyOn(instance, 'getAllMovies');
        instance.getAllMovies();
        expect(instance.getAllMovies).toBeCalled();
    })

    it('should test fetchMovies method', () => {
        wrapper.setState({ Loader: true });
        jest.spyOn(instance, 'fetchMovies');
        instance.fetchMovies();
        expect(instance.fetchMovies).toBeCalled();
    })

    it('should test setQueryData method', () => {
        jest.spyOn(instance, 'setQueryData');
        instance.setQueryData();
        expect(instance.setQueryData).toBeCalled();
    })

    it('should test nextCall', () => {
        wrapper.setState({ isRequestIntiate: true, maxPage: 10 });
        jest.spyOn(instance, 'nextCall');
        instance.nextCall(5);
        expect(instance.nextCall).toHaveBeenCalledTimes(1);
    });

    it('should test searchHandleChange', () => {
        const event = { target: { name: "test", value: "test" } }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'searchHandleChange');
        instance.searchHandleChange(event);
        expect(instance.searchHandleChange).toHaveBeenCalledTimes(1);
    });

    it('should test handleKeyPress', () => {
        jest.spyOn(instance, 'handleKeyPress');
        instance.handleKeyPress();
        expect(instance.handleKeyPress).toBeCalled();
      });

      it('should test handleKeyUp', () => {
        jest.spyOn(instance, 'handleKeyUp');
        instance.handleKeyUp();
        expect(instance.handleKeyUp).toBeCalled();
      });
      
      it('should test tabSwitched', () => {
        jest.spyOn(instance, 'tabSwitched');
        instance.tabSwitched(null, 1);
        expect(instance.tabSwitched).toBeCalled();
      });

      it('should test tabSwitched if condition', () => {
        jest.spyOn(instance, 'tabSwitched');
        instance.tabSwitched(null, 0);
        expect(instance.tabSwitched).toBeCalled();
      });
      
      it('should test addContent', () => {
        jest.spyOn(instance, 'addContent');
        instance.addContent(null, null, true);
        expect(instance.addContent).toBeCalled();
      });
      
      it('should test updatemapcontent', () => {
        jest.spyOn(instance, 'updatemapcontent');
        instance.updatemapcontent(1);
        expect(instance.updatemapcontent).toBeCalled();
      });
      
      it('should test closeContentModal', () => {
        jest.spyOn(instance, 'closeContentModal');
        instance.closeContentModal();
        expect(instance.closeContentModal).toBeCalled();
      });
      
      it('should test showHideFilterDrawer', () => {
        jest.spyOn(instance, 'showHideFilterDrawer');
        instance.showHideFilterDrawer();
        expect(instance.showHideFilterDrawer).toBeCalled();
      });

      it('should check btn1Action', () => {
        const myFakeCallback = () => {};
        wrapper.find('.ts-map-popup').first().prop('btn1Action')(myFakeCallback);
      })

      it('should check handleClose method', () => {
        const myFakeCallback = () => {};
        wrapper.find('.ts-map-popup').first().prop('handleClose')(myFakeCallback);
      })

      it('should check handleRoute onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleRouteBtn');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check addContent onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'addContent');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = wrapper.find('.btn-create-user');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check handleDateChange method', () => {
        const event = {target: {value: '12/12/12', name: 'startDate'}};
        wrapper.setState({ filters });
        jest.spyOn(instance, 'handleDateChange');
        instance.handleDateChange('startDate', null, 0, event);
        expect(instance.handleDateChange).toBeCalled();
    })

    it('should check handleDateChange method else condition', () => {
        const event = {target: {value: '12/12/12', name: 'startDate'}};
        wrapper.setState({ filters });
        jest.spyOn(instance, 'handleDateChange');
        instance.handleDateChange('', null, 0, event);
        expect(instance.handleDateChange).toBeCalled();
    })

    it("should check setSelectDataArr", () => {
        const res = [
          {
            id: "8dc545d9-470e-4fb8-b32f-bdee3368c952",
            status: "1",
            title: "Club",
          },
          {
            id: "55fe8f96-0fb4-432b-af2a-dda09e301ca2",
            status: "1",
            title: "Premium",
          },
        ];
        jest.spyOn(wrapper.instance(), "setSelectDataArr");
        wrapper.instance().setSelectDataArr(res, 1);
        expect(wrapper.instance().setSelectDataArr).toBeCalled();
      });

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
        const event = { target: { name: 'mock', checked: true } }
        const instance = wrapper.instance();
        jest.spyOn(instance, "selectCountryGroup");
        instance.selectCountryGroup(event, 'Others', 'specialCategory', 0, 1);
        expect(instance.selectCountryGroup).toBeCalled();
      })

      it('should check selectCountryGroup else', () => {
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
            }
          ]],
        };
        wrapper.setState({ ...baseState });
        const event = { target: { name: 'mock', checked: false } }
        const instance = wrapper.instance();
        jest.spyOn(instance, "selectCountryGroup");
        instance.selectCountryGroup(event, 'Others', 'specialCategory', 0, 1);
        expect(instance.selectCountryGroup).toBeCalled();
      })

      it("should check filterChange method", () => {
        const event = { target: { name: 'translationLanguage', value: [{title: "Arabic", status: "1", id: "14b29f2c-d179-400f-b524-d3a80248c8cc", code: "ar"}] } };
        const event2 = { target: { name:'translationLanguage', value: [] } };
        const instance = wrapper.instance();
        jest.spyOn(instance, "filterChange");
        instance.filterChange(event, 2);
        instance.filterChange(event2, 2);
        expect(instance.filterChange).toHaveBeenCalledTimes(2);
      });
      
      it('should check getAppliedFilter method', () => {
        const filterByDate = [
            {
                date: {
                    endDate: "2021-02-26", endDateKey: "endDate", endPlaceholder: "End Date", startDate: "2021-02-16",
                    startDateKey: "startDate", startPlaceholder: "Start Date"
                },
                display: true, for: "All", label: "Modified On", name: "lastModifiedOn"
            },
            {
                date: { startDate: "", endDate: "", startDateKey: "startDate", endDateKey: "endDate", startPlaceholder: "Start Date" },
                display: false, for: "Draft", label: "Modified On", name: "lastModifiedOn"
            },
            {
                date: { startDate: "", endDate: "", startDateKey: "startDate", endDateKey: "endDate", startPlaceholder: "Start Date" },
                display: false, for: "Changed", label: "Changed On", name: "lastModifiedOn"
            }
        ]
        const JSON = [
            { col: "", label: "External Id", name: "externalId", touched: 0, type: "text", valid: true, validation: { required: false }, value: "text" },
            {
                col: "", createPrefix: "Use", data: [], display: true, errorText: "", keyText: "title", label: "Tags", multiple: false, name: "tags",
                touched: 0, type: "SearchableWithCreate", valid: true, validation: { required: false }, value: null
            },
            {
                col: "", data: [], display: false, keyText: "title", label: "Translation’s Language Status", name: "translationStatus",
                touched: 0, type: "dropdownAsync", valid: true, validation: { required: false }, value: [{ title: 'test' }]
            }
        ]
        jest.spyOn(instance, 'getAppliedFilter');
        instance.getAppliedFilter(JSON, filterByDate);
        expect(instance.getAppliedFilter).toBeCalled();
    })

    it('should check showStatusField method', () => {
        const selectFilters = [
            { col: "", label: "External Id", name: "externalId", touched: 0, type: "text", valid: true, validation: { required: false }, value: "" },
            { name: "licenseGroupCountries", keyText: "title", value: [], col: "", multiple: true },
            { name: "translationLanguage", keyText: "title", value: [], col: "", multiple: true },
            { name: "translationStatus", keyText: "title", value: null, col: "", type: "dropdownAsync" }
        ]
        jest.spyOn(instance, 'showStatusField');
        instance.showStatusField(selectFilters, true);
        expect(instance.showStatusField).toBeCalled();
    })

    it('should check showStatusField method else', () => {
        const selectFilters = [
            { col: "", label: "External Id", name: "externalId", touched: 0, type: "text", valid: true, validation: { required: false }, value: "" },
            { name: "licenseGroupCountries", keyText: "title", value: [], col: "", multiple: true },
        ]
        jest.spyOn(instance, 'showStatusField');
        instance.showStatusField(selectFilters, true);
        expect(instance.showStatusField).toBeCalled();
    })

    it('should check clearFilter', () => {
        jest.spyOn(instance, 'clearFilter');
        instance.clearFilter();
        expect(instance.clearFilter).toBeCalled();
    })
    
    it('should check filterData', () => {
        jest.spyOn(instance, 'filterData');
        instance.filterData();
        expect(instance.filterData).toBeCalled();
    })
    
    it('should check getModalUi', () => {
        jest.spyOn(instance, 'getModalUi');
        instance.getModalUi();
        expect(instance.getModalUi).toBeCalled();
    })
    
    it('should check handleFilterStatusSelection', () => {
        jest.spyOn(instance, 'handleFilterStatusSelection');
        instance.handleFilterStatusSelection();
        expect(instance.handleFilterStatusSelection).toBeCalled();
    })
    
    it('should check handleAutoCreateInput', () => {
        jest.spyOn(instance, 'handleAutoCreateInput');
        instance.handleAutoCreateInput();
        expect(instance.handleAutoCreateInput).toBeCalled();
    })

    it('should check mapTranscodingContent', () => {
      jest.spyOn(instance, 'mapTranscodingContent');
      instance.mapTranscodingContent();
      expect(instance.mapTranscodingContent).toBeCalled();
    })
    
    it('should check mapTranscodingContentEpisode', () => {
      jest.spyOn(instance, 'mapTranscodingContentEpisode');
      instance.mapTranscodingContentEpisode();
      expect(instance.mapTranscodingContentEpisode).toBeCalled();
    })
    
    it('should check closeContentTranscodingModal', () => {
      jest.spyOn(instance, 'closeContentTranscodingModal');
      instance.closeContentTranscodingModal();
      expect(instance.closeContentTranscodingModal).toBeCalled();
    })
    
    it('should check closeContentModalEpisode', () => {
      jest.spyOn(instance, 'closeContentModalEpisode');
      instance.closeContentModalEpisode();
      expect(instance.closeContentModalEpisode).toBeCalled();
    })

})