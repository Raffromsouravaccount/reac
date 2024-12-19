import React from "react";
import Enzyme, { shallow } from "enzyme";

import ViewContentProperties from "../../../../_components/Video/ContentProperties/ViewContentProperties";
import jsonData from "../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json";
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<ViewContentProperties {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
  };

  describe("ViewContentProperties",()=>{
    let wrapper;

    const props = {
      jsonData : jsonData.ContentProperties,
      videoId: '123'
    }

    beforeEach(() => {
      wrapper = setup({...props},null);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('Should renders ViewContentProperties default', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("should check componentDidMount method", () => {
      jest.spyOn(wrapper.instance(), "componentDidMount");
      wrapper.instance().componentDidMount();
      expect(wrapper.instance().componentDidMount).toBeCalled();
    });

    it("should check fetchContentData method", () => {
      jest.spyOn(wrapper.instance(), "fetchContentData");
      wrapper.instance().fetchContentData();
      expect(wrapper.instance().fetchContentData).toBeCalled();
    });

    it("should check getControlFieldData method", () => {
      jest.spyOn(wrapper.instance(), "getControlFieldData");
      wrapper.instance().getControlFieldData();
      expect(wrapper.instance().getControlFieldData).toBeCalled();
    });

    it("should check populateProperties method", () => {
      jest.spyOn(wrapper.instance(), "populateProperties");
      wrapper.instance().populateProperties();
      expect(wrapper.instance().populateProperties).toBeCalled();
    });

    it("should check updateArrValue method", () => {
      jest.spyOn(wrapper.instance(), "updateArrValue");
      wrapper.instance().updateArrValue();
      expect(wrapper.instance().updateArrValue).toBeCalled();
    });

    it("should check handleTab method", () => {
      jest.spyOn(wrapper.instance(), "handleTab");
      wrapper.instance().handleTab();
      expect(wrapper.instance().handleTab).toBeCalled();
    });

    it("should check render method", () => {
      jest.spyOn(wrapper.instance(), "render");
      wrapper.instance().render();
      expect(wrapper.instance().render).toBeCalled();
    });


      
  })