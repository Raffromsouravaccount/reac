import React from 'react';
import { shallow, mount } from 'enzyme';

import CheckList from '../../../../_components/Common/PublishContent/CheckList';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const data = [{
    done: false,
    doneKey: "contentPropertiesModule",
    icon: "",
    label: "Content Properties",
    properties: true,
    quickFiling: true,
    singleLanding: true
},
{
    done: false,
    doneKey: "castNCrewModule",
    icon: "",
    label: "Cast & Crew",
    properties: true,
    quickFiling: false,
    singleLanding: false
}
]
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<CheckList {...props} className={null} checkListArr={data}/>)
    return wrapper;
}

describe('CheckList', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders CheckList default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});