import React from 'react';
import { shallow, mount } from 'enzyme';

import ScheduleContent from '../../../../_components/Common/PublishContent/SceduleContent';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const countryData = [{ id: "c387e93c-0394-499e-be33-84a3ce1b445b", title: "Vietnam" }];
const scheduleMockData = [countryData]
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<ScheduleContent {...props} scheduleData={scheduleMockData} removeSchedule={jest.fn()}
        handleScheduleData={jest.fn()} scheduleContentAction={jest.fn()} />)
    return wrapper;
}

describe('ScheduleContent', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders ScheduleContent default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check onClick removeSchedule', () => {
        const removeSchedule = jest.fn()
        const baseProps = {
            removeSchedule
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('.remove-schedule-btn').simulate('click');
        expect(baseProps.removeSchedule).toHaveBeenCalled();
    })

    it('should check onChange handleScheduleData', () => {
        const event = {target: {value: 'xyz'}}
        const handleScheduleData = jest.fn()
        const baseProps = {
            handleScheduleData
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('DatePicker').simulate('change', event);
        expect(baseProps.handleScheduleData).toHaveBeenCalled();
    })

    it('should check onChange handleScheduleData in selectwithsearch component', () => {
        const event = {target: {value: 'xyz'}}
        const handleScheduleData = jest.fn()
        const baseProps = {
            handleScheduleData
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('SelectWithSearch').simulate('change', event);
        expect(baseProps.handleScheduleData).toHaveBeenCalled();
    })

    it('should check onChange scheduleContentAction when update false', () => {
        const scheduleContentAction = jest.fn()
        const baseProps = {
            scheduleContentAction,
            update: false
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('.zee-btn-field').simulate('click');
        expect(baseProps.scheduleContentAction).toHaveBeenCalled();
    })


})