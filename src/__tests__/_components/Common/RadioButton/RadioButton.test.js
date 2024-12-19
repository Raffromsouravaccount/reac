import React from 'react';
import { shallow, mount } from 'enzyme';

import RadioButton from '../../../../_components/Common/RadioButton/RadioButton';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const data = [{label: "Newest to Oldest",value: "desc"},
{label: "Oldest to Newest",value: "asc"}]
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<RadioButton {...props} data={data}/>)
    return wrapper;
}

describe('RadioButton', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders RadioButton default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});