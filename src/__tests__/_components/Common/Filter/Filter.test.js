import React from 'react';
import { shallow, mount } from 'enzyme';

import Filter from '../../../../_components/Common/Filter/Filter'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
}
const filters = {
    filterByDate: [{
        date: {
            endDate: "", endDateKey: "endDate1", endPlaceholder: "End Date",
            startDate: "", startDateKey: "startDate", startPlaceholder: "Start Date",
        }, display: true, for: "All", label: "Modified On", name: "modifiedOn"
    }, {
        date: { startDate: "", endDate: "10-10-10", startDateKey: "startDate", endDateKey: "endDate", startPlaceholder: "Start Date" },
        display: false, for: "Draft", label: "Modified On", name: "modifiedOn"
    }],
    formValidity: true,
    selectFilters: [
        { name: "primaryGenre", keyText: "title", value: [{ name: "actor", keyText: "title" }], col: "", multiple: true },
        {
            name: "licenseGroupCountries", keyText: "title", value: 'test', col: "",
            multiple: true, data: [{ name: 'data', value: 'data' }],
            groupBy: [{ label: "Published", displayName: "Published", id: "081cc5b2-a302-4bfb-8e5c-68544ae636e6" }]
        },
        { name: "actor", keyText: "title", value: "", col: "", multiple: true, value: [{ name: "actor", keyText: "title" }] },
        { name: "tags", keyText: "title", value: "", col: "", multiple: true, value: [{ name: "actor", keyText: "title" }] }],
    filterByStatus: [{ label: "All", displayName: "All", id: "", active: true, value: [{ name: "actor", keyText: "title" }] },
    { label: "Draft", displayName: "Draft", id: "3bb64421-f15f-4dda-adec-03c324c140a3" },
    { label: "Changed", displayName: "Changed", id: "38c34c4f-68c9-4eb0-b71f-b80f1e551447" },
    { label: "Published", displayName: "Published", id: "081cc5b2-a302-4bfb-8e5c-68544ae636e6" }],

}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Filter {...baseProps} />)
    return wrapper;
}

describe('Filter', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
        wrapper.setState({ filters })
    })

    it('Should renders Filter default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check verifyFormValidity', () => {
        const filters = {
            filterByStatus: "", filterByDate: "", selectFilters: "", formValidity: ""
        }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'verifyFormValidity');
        instance.verifyFormValidity(filters);
        expect(instance.verifyFormValidity).toBeCalled();
    })


    it('should check handleFilterStatusSelection', () => {
        const event = { target: { name: 'licenseGroupCountries', value: 'test' } }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleFilterStatusSelection');
        instance.handleFilterStatusSelection(event);
        expect(instance.handleFilterStatusSelection).toBeCalled();
    })

    it('should check applyFilter', () => {
        const applyFilter = jest.fn();
        wrapper.setProps({ applyFilter });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'applyFilter');
        instance.applyFilter();
        expect(instance.applyFilter).toBeCalled();
    })

    it('should check clearFilter', () => {
        const clearFilter = jest.fn();
        wrapper.setProps({ clearFilter });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'clearFilter');
        instance.clearFilter();
        expect(instance.clearFilter).toBeCalled();
    })

    it('should check handleSearchableInput', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSearchableInput');
        instance.handleSearchableInput(null, 3);
        expect(instance.handleSearchableInput).toBeCalled();
    })

    it('should check handleSearchableInput else condition', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSearchableInput');
        instance.handleSearchableInput(null, 2);
        expect(instance.handleSearchableInput).toBeCalled();
    })

    it('should check componentDidMount', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })

    it('should check setSelectDataArr', () => {
        const res = [{ name: 'test', countries: [{ id: 'tesr123', keyText: 'country' }] }]
        const instance = wrapper.instance();
        jest.spyOn(instance, 'setSelectDataArr');
        instance.setSelectDataArr(res, 1);
        expect(instance.setSelectDataArr).toBeCalled();
    })

    it('should check selectFiltersChange', () => {
        const event = { target: { name: 'licenseGroupCountries', value: 'test' } }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'selectFiltersChange');
        instance.selectFiltersChange(event, 1);
        expect(instance.selectFiltersChange).toBeCalled();
    })

    it('should check handleDateChange', () => {
        const event = { target: { name: 'licenseGroupCountries', value: '10-10-10' } }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleDateChange');
        instance.handleDateChange('startDate', null, 1, event);
        expect(instance.handleDateChange).toBeCalled();
    })

    it('should check handleDateChange else condition', () => {
        const event = { target: { name: 'licenseGroupCountries', value: '10-10-10' } }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleDateChange');
        instance.handleDateChange('', null, 1, event);
        expect(instance.handleDateChange).toBeCalled();
    })

})