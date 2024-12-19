import React from "react";
import { shallow } from "enzyme";

import LockedPopup from "../../../_components/Episode/LockedPopup";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<LockedPopup {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("LockedPopup", () => {
    let wrapper;
    beforeEach(() => {
        const props = {
            match: {
                params: {
                    id: '123'
                }
            },
            state: 'quick-filing'
        }
        wrapper = setup({ ...props });
    });

    it("Should render LockedPopup default", () => {
        expect(wrapper.exists()).toBe(true);
    });
});