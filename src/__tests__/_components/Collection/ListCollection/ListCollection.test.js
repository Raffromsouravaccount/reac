import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ListCollection from '../../../../_components/Collection/ListCollection/ListCollection';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<ListCollection {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('ListCollection', () => {
    Enzyme.configure({ adapter: new Adapter() });
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
    
    const state = {
        collectionList: [{
            CollectionAsset: { assetId: 'zyz' }, CollectionImages: [], contentState: { title: "Draft" }, externalId: "1-3-1000651",
            id: "ed6b42ef-1ce5-49ce-9d7e-4efa86c797ec", lastModifiedByUser: { first_name: "Sandeep", last_name: "Kumar" },
            lastModifiedOn: "2021-02-15T04:15:29.521Z", note: null, title: "No Title"
        },
        {
            CollectionAsset: null, CollectionImages: [], contentState: { title: "Draft" }, externalId: "1-3-1000650",
            id: "18cb31b3-ef06-406c-bd49-d4e0ee42bd2d", lastModifiedByUser: { first_name: "Sandeep", last_name: "Kumar" },
            lastModifiedOn: "2021-02-14T19:04:27.955Z", note: null, title: "No Title"
        }],
        model: {
            detail: {
                view: 'archive'
            }
        }
    }
    beforeEach(() => {
        wrapper = setup();
        instance = wrapper.instance();
        wrapper.setState({ ...state });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should renders ListCollection default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test handleModel method', () => {
        const model = {
            detail: {
                view: 'archive'
            }
        }
        jest.spyOn(instance, 'handleModel');
        instance.handleModel(true, model);
        expect(instance.handleModel).toBeCalled();
    })

    it('should test fetchAssignedAssets method', () => {
        jest.spyOn(instance, 'fetchAssignedAssets');
        instance.fetchAssignedAssets();
        expect(instance.fetchAssignedAssets).toBeCalled();
    })

    it('should test viewFifthChild method', () => {
        jest.spyOn(instance, 'viewFifthChild');
        instance.viewFifthChild();
        expect(instance.viewFifthChild).toBeCalled();
    })

    it('should test viewFourthChild method', () => {
        jest.spyOn(instance, 'viewFourthChild');
        instance.viewFourthChild();
        expect(instance.viewFourthChild).toBeCalled();
    })

    it('should test viewThirdChild method', () => {
        jest.spyOn(instance, 'viewThirdChild');
        instance.viewThirdChild();
        expect(instance.viewThirdChild).toBeCalled();
    })

    it('should test viewSecondChild method', () => {
        jest.spyOn(instance, 'viewSecondChild');
        instance.viewSecondChild();
        expect(instance.viewSecondChild).toBeCalled();
    })

    it('should test viewFirstChild method', () => {
        jest.spyOn(instance, 'viewFirstChild');
        instance.viewFirstChild();
        expect(instance.viewFirstChild).toBeCalled();
    })

    it('should test handleKeyUp method', () => {
        const queryData = { contentState: "", lastEvaluatedKey: "", limit: 10, page: 1, searchString: "team" }
        wrapper.setState({ queryData });
        jest.spyOn(instance, 'handleKeyUp');
        instance.handleKeyUp();
        expect(instance.handleKeyUp).toBeCalled();
    })

    it('should test handleKeyPress method', () => {
        jest.spyOn(instance, 'handleKeyPress');
        instance.handleKeyPress();
        expect(instance.handleKeyPress).toBeCalled();
    })

    it('should test handleSortFilter method', () => {
        const event = {
            target: {
                name: 'event', value: 'event'
            }
        }
        jest.spyOn(instance, 'handleSortFilter');
        instance.handleSortFilter(null, 1, event);
        expect(instance.handleSortFilter).toBeCalled();
    })

    it('should check viewFirstChild onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'viewFirstChild');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'viewFirstChild');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    })

    it('should check componentDidMount method', () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })

    it('should check getAllStatus method', () => {
        jest.spyOn(instance, 'getAllStatus');
        instance.getAllStatus();
        expect(instance.getAllStatus).toBeCalled();
    })

    it('should check fetchLeftTabData method', () => {
        jest.spyOn(instance, 'fetchLeftTabData');
        instance.fetchLeftTabData();
        expect(instance.fetchLeftTabData).toBeCalled();
    })

    it('should check fetchCollection method', () => {
        wrapper.setState({ isRequestIntiate: true })
        jest.spyOn(instance, 'fetchCollection');
        instance.fetchCollection();
        expect(instance.fetchCollection).toBeCalled();
    })

    it('should check fetchCollection method', () => {
        jest.spyOn(instance, 'fetchCollection');
        instance.fetchCollection();
        expect(instance.fetchCollection).toBeCalled();
    })

    it('should check getAllCollection method', () => {
        jest.spyOn(instance, 'getAllCollection');
        instance.getAllCollection();
        expect(instance.getAllCollection).toBeCalled();
    })

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

    it('should check setCollectionListData method', () => {
        const collectionList = {
            data: [{
                CollectionAsset: { assetId: 'zyz' }, CollectionImages: [], contentState: { title: "Draft" }, externalId: "1-3-1000651",
                id: "ed6b42ef-1ce5-49ce-9d7e-4efa86c797ec", lastModifiedByUser: { first_name: "Sandeep", last_name: "Kumar" },
                lastModifiedOn: "2021-02-15T04:15:29.521Z", note: null, title: "No Title", licence: {
                    contentData: {
                        licence: [{
                            title: 'test',
                            template: [{ template: 'test', toDate: 'zyz', Country: [{ title: 'ind' }] }]
                        }]
                    }
                }
            }]
        }
        jest.spyOn(instance, 'setCollectionListData');
        instance.setCollectionListData(collectionList);
        expect(instance.setCollectionListData).toBeCalled();
    })

    it('should check handleOpenCloseBulkDropDown method', () => {
        jest.spyOn(instance, 'handleOpenCloseBulkDropDown');
        instance.handleOpenCloseBulkDropDown();
        expect(instance.handleOpenCloseBulkDropDown).toBeCalled();
    })

    it('should check handleCloseBulkDropdown method', () => {
        jest.spyOn(instance, 'handleCloseBulkDropdown');
        instance.handleCloseBulkDropdown();
        expect(instance.handleCloseBulkDropdown).toBeCalled();
    })

    it('should check showHideStatePopup method', () => {
        jest.spyOn(instance, 'showHideStatePopup');
        instance.showHideStatePopup();
        expect(instance.showHideStatePopup).toBeCalled();
    })

    it('should check archiveServerCalls method', () => {
        jest.spyOn(instance, 'archiveServerCalls');
        instance.archiveServerCalls();
        expect(instance.archiveServerCalls).toBeCalled();
    })

    it('should check setQueryData method', () => {
        jest.spyOn(instance, 'setQueryData');
        instance.setQueryData();
        expect(instance.setQueryData).toBeCalled();
    })

    it('should check showHideFilterDrawer method', () => {
        wrapper.setState({ showFilterDrawer: false, searchString: 'xyz' })
        jest.spyOn(instance, 'showHideFilterDrawer');
        instance.showHideFilterDrawer();
        expect(instance.showHideFilterDrawer).toBeCalled();
    })

    it('should check goToLinkedCollection method', () => {
        const collection = {
            contentId: 'zyz'
        }
        jest.spyOn(instance, 'goToLinkedCollection');
        instance.goToLinkedCollection(collection);
        expect(instance.goToLinkedCollection).toBeCalled();
    })

    it('should check showHideSortDrawer method', () => {
        wrapper.setState({ openSortDrawer: false })
        jest.spyOn(instance, 'showHideSortDrawer');
        instance.showHideSortDrawer();
        expect(instance.showHideSortDrawer).toBeCalled();
    })

    it('should check handleRoute method', () => {
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toBeCalled();
    })

    it('should check handleConditionRoute method', () => {
        jest.spyOn(instance, 'handleConditionRoute');
        instance.handleConditionRoute('create');
        expect(instance.handleConditionRoute).toBeCalled();
    })

    it('should check handleConditionRoute method for edit mode', () => {
        jest.spyOn(instance, 'handleConditionRoute');
        instance.handleConditionRoute('edit', 'xyz12 ');
        expect(instance.handleConditionRoute).toBeCalled();
    })

    it('should check handleConditionRoute method for archive', () => {
        jest.spyOn(instance, 'handleConditionRoute');
        instance.handleConditionRoute('archive');
        expect(instance.handleConditionRoute).toBeCalled();
    })


    it('should check changeTab method', () => {
        jest.spyOn(instance, 'changeTab');
        instance.changeTab();
        expect(instance.changeTab).toBeCalled();
    })

    it('should check nextCall method', () => {
        wrapper.setState({ isRequestIntiate: true, maxPage: 5 })
        jest.spyOn(instance, 'nextCall');
        instance.nextCall(2);
        expect(instance.nextCall).toBeCalled();
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

    it('should check filterData method', () => {
        jest.spyOn(instance, 'filterData');
        instance.filterData();
        expect(instance.filterData).toBeCalled();
    })

    it('should check checkvalidation method', () => {
        jest.spyOn(instance, 'checkvalidation');
        instance.checkvalidation();
        expect(instance.checkvalidation).toBeCalled();
    })

    it('should check searchHandleChange method', () => {
        const event = {target: {name: 'test', value: 'mock'}}
        jest.spyOn(instance, 'searchHandleChange');
        instance.searchHandleChange(event);
        expect(instance.searchHandleChange).toBeCalled();
    })

    it('should check clearFilterData method', () => {
        jest.spyOn(instance, 'clearFilterData');
        instance.clearFilterData();
        expect(instance.clearFilterData).toBeCalled();
    })

    it('should check clearFilter method', () => {
        jest.spyOn(instance, 'clearFilter');
        instance.clearFilter();
        expect(instance.clearFilter).toBeCalled();
    })

    it('should check setSelectDataArr method', () => {
        const res = [
            {title: "EUROPE_BALTICS", status: "1", id: "71104be8-f13f-40e1-baca-29cac57224ca", countries: [
                {title: "Estonia", status: "1", id: "d6a27804-b041-4507-b71e-41b60442019b", code: "EE"},
                {title: "Latvia", status: "1", id: "3f6a3e1a-6964-4e13-8e2d-4a134be4d6cd", code: "LV"},
                {title: "Lithuania", status: "1", id: "53a4e17f-9d3d-4dba-b304-9532c271594b", code: "LT"}
            ]},
            {title: "EUROPE_BENELUX", status: "1", id: "f7d0cd82-09ab-406a-ae0e-ee5275e28463", countries: [
                {title: "Belgium", status: "1", id: "e6ea95ae-467c-497a-97a7-9e0e470d4109", code: "BE"},
                {title: "Luxembourg", status: "1", id: "68859447-4489-4aa7-bbb6-e65106923fca", code: "LU"},
                {title: "Netherlands", status: "1", id: "3fd24176-f031-446e-881f-c1ab27860984", code: "NL"}
            ]}
        ]
        wrapper.setState({ filters })
        jest.spyOn(instance, 'setSelectDataArr');
        instance.setSelectDataArr(res, 1);
        expect(instance.setSelectDataArr).toBeCalled();
    })
    it('should check selectCountryGroup method', () => {
        jest.spyOn(instance, 'selectCountryGroup');
        instance.selectCountryGroup();
        expect(instance.selectCountryGroup).toBeCalled();
    })

    it('should check handleSearchableInput method', () => {
        wrapper.setState({ filters });
        jest.spyOn(instance, 'handleSearchableInput');
        instance.handleSearchableInput();
        expect(instance.handleSearchableInput).toBeCalled();
    })

    it('should check getFiltersUi method', () => {
        jest.spyOn(instance, 'getFiltersUi');
        instance.getFiltersUi();
        expect(instance.getFiltersUi).toBeCalled();
    })

    it('should check getSortUi method', () => {
        jest.spyOn(instance, 'getSortUi');
        instance.getSortUi();
        expect(instance.getSortUi).toBeCalled();
    })

    it('should check handleRoute onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleRoute');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
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
    
    it('should check viewCollectionHandler method', () => {
        jest.spyOn(instance, 'viewCollectionHandler');
        instance.viewCollectionHandler();
        expect(instance.viewCollectionHandler).toBeCalled();
    })

    it('should check filterChange method', () => {
        wrapper.setState({ filters });
        const event = {target: {name:'translationLanguage', value: 'mock'}}
        jest.spyOn(instance, 'filterChange');
        instance.filterChange(event, 1);
        expect(instance.filterChange).toBeCalled();
    })
});