import React from "react";
import { shallow } from "enzyme";

import LockedPopup from "../../../_components/Video/LockedPopup";

import { CommonModel } from '../../../_components/Common/Model/CommonModel';
import { findByTestAttr } from "../../../Utils";
import { expect, it, jest } from "@jest/globals";

import axios from "../../../_helpers/axiosInstance";

const setup = (props = {}, state = {}) => {
  const wrapper = shallow(<LockedPopup {...props} />);
  return wrapper;
};

const baseProps = {
  field: { type: "text", name: "first name", multiline: true },
  handleChange: jest.fn(),
  handleMultiSelect: jest.fn(),
  onBlur: jest.fn(),
  onKeyPress: jest.fn(),
  keyText: "India",
  moreText: true,
  limitTags: 2,
  name: "",
  groupIndex: 1,
  disableCloseOnSelect: jest.fn(),
  disabled: false,
};

describe("LockedPopUp", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  it("render component without error", () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  it('Should renders CommonModel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

});
