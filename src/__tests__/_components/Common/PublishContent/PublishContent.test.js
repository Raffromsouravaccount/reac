import React from 'react';
import { shallow, mount } from 'enzyme';

import PublishContent from '../../../../_components/Common/PublishContent/PublishContent';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const data = [{id: "4fb82f84-3140-4d95-9519-1fa7ba884869",title: "Italy"}];
const country = [{id: "4fb82f84-3140-4d95-9519-1fa7ba884869",title: "Italy"}]
const mockFn = jest.fn();
const remCountryArr = [{id: "4fb82f84-3140-4d95-9519-1fa7ba884869",title: "China"}]
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<PublishContent {...props} className={null} countryData={data} selectedCountry={country}
    limitTags={null} moreText={null} multiple={null} keyText={null} remainingCountryData={remCountryArr} handleMultiSelect={mockFn} 
    canPublish={false} publishAction={mockFn}/>)
    return wrapper;
}

describe('PublishContent', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders PublishContent default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});