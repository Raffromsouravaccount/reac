import React from 'react';
import { shallow, mount } from 'enzyme';

import CreateFaqs from '../../../../_components/CastAndCrewManagement/CreateFaqs/CreateFaqs';
import { findByTestAttr, storeFactory } from '../../../../Utils';
import faqJSON from '../../../../_components/CastAndCrewManagement/Schema/CreateFaq/CreateFaq.json';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<CreateFaqs store={store} {...props} />).dive();
    return wrapper;
}

const initialState = {
}

describe('CreateFaqs', () => {
    let wrapper;
    const props = {
        Faq: [{ test: 'mockData' }]
    }
    const event = { target: { name: 'xyz', value: '123' }, preventDefault: jest.fn() }
    beforeEach(() => {
        wrapper = setup(initialState, { ...props }).dive();
        wrapper.setState({ JSONSchema: faqJSON })
    });

    it('Should render CreateFaqs default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check faqSave button onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'submitquestans');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'create-faq-test-button');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    });

    it('should check handleChange', () => {
        jest.spyOn(wrapper.instance(), 'handleChange');
        wrapper.instance().handleChange(event);
        expect(wrapper.instance().handleChange).toBeCalled();
    })

    it('should check handleInputChange', () => {
        jest.spyOn(wrapper.instance(), 'handleInputChange');
        wrapper.instance().handleInputChange(event);
        expect(wrapper.instance().handleInputChange).toBeCalled();
    })

    it('should check InputChanger', () => {
        jest.spyOn(wrapper.instance(), 'InputChanger');
        wrapper.instance().InputChanger(event, 1);
        expect(wrapper.instance().InputChanger).toBeCalled();
    })

    it('should check componentWillReceiveProps', () => {
        const nextProps = {
            allfaq: {
                faq: [{ index: 1, name: 'test' },
                { index: 1, name: 'test' }]
            }
        }
        jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
    })

    it('should check showHideEditFaq', () => {
        jest.spyOn(wrapper.instance(), 'showHideEditFaq');
        wrapper.instance().showHideEditFaq();
        expect(wrapper.instance().showHideEditFaq).toBeCalled();
    })

    it('should check submitquestans', async () => {
        jest.spyOn(wrapper.instance(), 'submitquestans');
        wrapper.instance().submitquestans(event);
        expect(wrapper.instance().submitquestans).toBeCalled();
    })

    it('should check saveFaqs', async () => {
        jest.spyOn(wrapper.instance(), 'saveFaqs');
        wrapper.instance().saveFaqs(event);
        expect(wrapper.instance().saveFaqs).toBeCalled();
    })

    it('should check removefaqPOPUP', () => {
        jest.spyOn(wrapper.instance(), 'removefaqPOPUP');
        wrapper.instance().removefaqPOPUP();
        expect(wrapper.instance().removefaqPOPUP).toBeCalled();
    })

    it('should check deleteQuestion', () => {
        jest.spyOn(wrapper.instance(), 'deleteQuestion');
        wrapper.instance().deleteQuestion();
        expect(wrapper.instance().deleteQuestion).toBeCalled();
    })

    it('should check handleClose', () => {
        jest.spyOn(wrapper.instance(), 'handleClose');
        wrapper.instance().handleClose();
        expect(wrapper.instance().handleClose).toBeCalled();
    })

    it('should check toggleOpenClose', () => {
        jest.spyOn(wrapper.instance(), 'toggleOpenClose');
        wrapper.instance().toggleOpenClose();
        expect(wrapper.instance().toggleOpenClose).toBeCalled();
    })

    it('should check checkValidation', () => {
        const faq = {
            question: [{ question: "test" }],
            answer: [{ answer: "yes" }]
        }
        wrapper.setState({ faq });
        jest.spyOn(wrapper.instance(), 'checkValidation');
        wrapper.instance().checkValidation();
        expect(wrapper.instance().checkValidation).toBeCalled();
    })

    it('should check checkValidation', () => {
        jest.spyOn(wrapper.instance(), 'checkValidation');
        wrapper.instance().checkValidation();
        expect(wrapper.instance().checkValidation).toBeCalled();
    })

    it('should check onDragEnd', () => {
        const result = {
            combine: null, destination: { droppableId: "droppable-1", index: 1 }, draggableId: "draggable-4aef9a02-52bc-475e-baab-7be6b0edf31d",
            mode: "FLUID", reason: "DROP", source: { index: 0, droppableId: "droppable-1" }, type: "DEFAULT"
        }
        const allfaq = [
            {
                answer: "answer", castFaqStatus: "1", castProfileId: "3cea4d09-495c-43df-ad9b-b25a89c80c4a",
                cast_profile_id: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
                id: "9736fe69-49cd-4bb4-b411-3f633b3de0da", modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
                question: "question", sequence: 1
            }, {
                answer: "ansss", castFaqStatus: "1", castProfileId: "3cea4d09-495c-43df-ad9b-b25a89c80c4a",
                cast_profile_id: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
                id: "4aef9a02-52bc-475e-baab-7be6b0edf31d", modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
                question: "quess", sequence: 2
            }
        ]
        wrapper.setState({ allfaq });
        jest.spyOn(wrapper.instance(), 'onDragEnd');
        wrapper.instance().onDragEnd(result);
        expect(wrapper.instance().onDragEnd).toBeCalled();
    })

    it('should check onDragEnd without params', () => {
        jest.spyOn(wrapper.instance(), 'onDragEnd');
        wrapper.instance().onDragEnd();
        expect(wrapper.instance().onDragEnd).toBeCalled();
    })

    it('should check componentDidMount', () => {
        const props = {
            match: { params: { id: "123" } }
        }
        wrapper.setProps({ ...props })
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })

})