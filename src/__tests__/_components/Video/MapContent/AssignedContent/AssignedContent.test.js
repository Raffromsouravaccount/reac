import React from 'react';
import { shallow } from 'enzyme';

import AssignedContent from '../../../../../_components/Video/MapContent/AssignedContent/AssignedContent';
import { expect, it, jest } from '@jest/globals';

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<AssignedContent {...props} />);
    return wrapper;
}

const initialState = {
    videoMgmt_reducer: {}
}

describe('AssignedContent', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    it('render component without error', () => {
        expect(wrapper.exists()).toBe(true);
    })
})