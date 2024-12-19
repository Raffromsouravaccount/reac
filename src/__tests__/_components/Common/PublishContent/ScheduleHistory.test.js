import React from 'react';
import { shallow, mount } from 'enzyme';

import ScheduleHistory from '../../../../_components/Common/PublishContent/ScheduleHistory';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    deleteScheduleAction: jest.fn(),
    updateScheduleAction: jest.fn(),
    publishScheduledContent: jest.fn(),
    scheduleHistory: [{
        country: [{ id: "4fb82f84-3140-4d95-9519-1fa7ba884869", title: "Italy" },
        { id: "c387e93c-0394-499e-be33-84a3ce1b445b", title: "Vietnam" }],
        groupName: "a4447294-6548-47cf-80ce-0c9dae57c094",
        scheduledTime: "2021-01-27T04:45:00.000Z"
    }]
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<ScheduleHistory {...baseProps} />)
    return wrapper;
}

describe('ScheduleHistory', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders ScheduleHistory default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check publishScheduledContent onClick method', () => {
        const publishScheduledContent = jest.fn()
        const baseProps = {
            publishScheduledContent
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('.publish-btn').simulate('click');
        expect(baseProps.publishScheduledContent).toHaveBeenCalled();
    })
    
    it('should check updateScheduleAction onClick method', () => {
        const updateScheduleAction = jest.fn()
        const baseProps = {
            updateScheduleAction
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('.schedule-edit-btn').first().simulate('click');
        expect(baseProps.updateScheduleAction).toHaveBeenCalled();
    })
    
    it('should check deleteScheduleAction onClick method', () => {
        const deleteScheduleAction = jest.fn()
        const baseProps = {
            deleteScheduleAction
        }
        wrapper.setProps({ ...baseProps });
        wrapper.find('.delete-bg-btn').simulate('click');
        expect(baseProps.deleteScheduleAction).toHaveBeenCalled();
    })
})