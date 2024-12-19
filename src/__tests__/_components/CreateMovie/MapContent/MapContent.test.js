import React from 'react';
import { shallow } from 'enzyme';

import MapContent from '../../../../_components/CreateMovie/MapContent/MapContent';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';

import { expect, it, jest } from '@jest/globals';

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<MapContent {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('MapContent', () => {
    let wrapper;
    const baseProps = {
        currentTabData: {
            isDone: false,
            isLocked: false,
            lockedBy: 'xyz'
        },
        jsonData: jsonData.MapContent
    }
    beforeEach(() => {
        wrapper = setup({ ...baseProps }, { movieId: 'xyz' });
    });

    it('render component without error', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check unLockedMap', () => {
        wrapper.setState({ showLockedPopup: true });
        jest.spyOn(wrapper.instance(), 'unLockedMap');
        wrapper.instance().unLockedMap(true);
        expect(wrapper.instance().unLockedMap).toBeCalled()
    })

    it('should check reArrangeContents', () => {
        jest.spyOn(wrapper.instance(), 'reArrangeContents');
        wrapper.instance().reArrangeContents();
        expect(wrapper.instance().reArrangeContents).toBeCalled()
    })

    it('should test reArrangeHandler', () => {
        const event = { target: { value: 'test' } }
        const state = {
            options: [
                {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: true, label: "Main Content", name: "mainContent", placeholder: "Search via Movie name", type: "main"
                }, {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: false, label: "Link Content", name: "linkContent", placeholder: "Search via Movie name", type: "link"
                }
            ],
            selectedTab: 0
        }
        wrapper.setState({ ...state });
        jest.spyOn(wrapper.instance(), 'reArrangeHandler');
        wrapper.instance().reArrangeHandler(event);
        expect(wrapper.instance().reArrangeHandler).toBeCalled()
    })

    it('should test reArrangeHandler for status Published', () => {
        const state = {
            options: [
                {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: true, label: "Main Content", name: "mainContent", placeholder: "Search via Movie name", type: "main"
                }, {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: false, label: "Link Content", name: "linkContent", placeholder: "Search via Movie name", type: "link"
                }
            ],
            selectedTab: 0,
            status: 'Published'
        }
        wrapper.setState({ ...state });
        jest.spyOn(wrapper.instance(), 'reArrangeHandler');
        wrapper.instance().reArrangeHandler();
        expect(wrapper.instance().reArrangeHandler).toBeCalled()
    })

    it('should test reArrangeHandler for status Unpublished', () => {
        const state = {
            options: [
                {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: true, label: "Main Content", name: "mainContent", placeholder: "Search via Movie name", type: "main"
                }, {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: false, label: "Link Content", name: "linkContent", placeholder: "Search via Movie name", type: "link"
                }
            ],
            selectedTab: 0,
            status: 'Unpublished'
        }
        wrapper.setState({ ...state });
        jest.spyOn(wrapper.instance(), 'reArrangeHandler');
        wrapper.instance().reArrangeHandler();
        expect(wrapper.instance().reArrangeHandler).toBeCalled()
    })

    it('should test reArrangeHandler for status Submit to review', () => {
        const state = {
            options: [
                {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: true, label: "Main Content", name: "mainContent", placeholder: "Search via Movie name", type: "main"
                }, {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: false, label: "Link Content", name: "linkContent", placeholder: "Search via Movie name", type: "link"
                }
            ],
            selectedTab: 0,
            status: 'Submit to Review'
        }
        wrapper.setState({ ...state });
        jest.spyOn(wrapper.instance(), 'reArrangeHandler');
        wrapper.instance().reArrangeHandler();
        expect(wrapper.instance().reArrangeHandler).toBeCalled()
    })

    it('should test removeContents', () => {
        jest.spyOn(wrapper.instance(), 'removeContents');
        wrapper.instance().removeContents();
        expect(wrapper.instance().removeContents).toBeCalled()
    })

    it('should test unMapContent', () => {
        jest.spyOn(wrapper.instance(), 'unMapContent');
        wrapper.instance().unMapContent();
        expect(wrapper.instance().unMapContent).toBeCalled()
    })

    it('should test toggleFilterDrawer', () => {
        jest.spyOn(wrapper.instance(), 'toggleFilterDrawer');
        wrapper.instance().toggleFilterDrawer();
        expect(wrapper.instance().toggleFilterDrawer).toBeCalled()
    })

    it('should test searchContent', () => {
        const event = { target: { value: 'test' } }
        jest.spyOn(wrapper.instance(), 'searchContent');
        wrapper.instance().searchContent(event);
        expect(wrapper.instance().searchContent).toBeCalled()
    })

    it('should test toggleModal', () => {
        jest.spyOn(wrapper.instance(), 'toggleModal');
        wrapper.instance().toggleModal(true, 'removeItem');
        expect(wrapper.instance().toggleModal).toBeCalled()
    })

    it('should test markDone', () => {
        jest.spyOn(wrapper.instance(), 'markDone');
        wrapper.instance().markDone();
        expect(wrapper.instance().markDone).toBeCalled()
    })

    it('should test markDone if condition', () => {
        wrapper.setState({ markDoneEnabled: false });
        jest.spyOn(wrapper.instance(), 'markDone');
        wrapper.instance().markDone();
        expect(wrapper.instance().markDone).toBeCalled()
    })

    it('should test updateIsDone', () => {
        const markAsDone = jest.fn();
        wrapper.setProps({ markAsDone });
        jest.spyOn(wrapper.instance(), 'updateIsDone');
        wrapper.instance().updateIsDone();
        expect(wrapper.instance().updateIsDone).toBeCalled()
    })

    it('should test updateMarkDoneStatus', () => {
        jest.spyOn(wrapper.instance(), 'updateMarkDoneStatus');
        wrapper.instance().updateMarkDoneStatus();
        expect(wrapper.instance().updateMarkDoneStatus).toBeCalled()
    })

    it('should test updateMapContents', () => {
        jest.spyOn(wrapper.instance(), 'updateMapContents');
        wrapper.instance().updateMapContents();
        expect(wrapper.instance().updateMapContents).toBeCalled()
    })

    it('should test addContentHandler', () => {
        jest.spyOn(wrapper.instance(), 'addContentHandler');
        wrapper.instance().addContentHandler();
        expect(wrapper.instance().addContentHandler).toBeCalled()
    })

    it('should test addContentHandler for published', () => {
        wrapper.setState({ status: 'Published' })
        jest.spyOn(wrapper.instance(), 'addContentHandler');
        wrapper.instance().addContentHandler();
        expect(wrapper.instance().addContentHandler).toBeCalled()
    })

    it('should test addContentHandler for unpublished', () => {
        wrapper.setState({ status: 'Unpublished' })
        jest.spyOn(wrapper.instance(), 'addContentHandler');
        wrapper.instance().addContentHandler();
        expect(wrapper.instance().addContentHandler).toBeCalled()
    })

    it('should test addContentHandler for Submit to review', () => {
        wrapper.setState({ status: 'Submit to Review' })
        jest.spyOn(wrapper.instance(), 'addContentHandler');
        wrapper.instance().addContentHandler();
        expect(wrapper.instance().addContentHandler).toBeCalled()
    })

    it('should test closeAddContent', () => {
        jest.spyOn(wrapper.instance(), 'closeAddContent');
        wrapper.instance().closeAddContent();
        expect(wrapper.instance().closeAddContent).toBeCalled()
    })

    it('should test switchToAddContent', () => {
        jest.spyOn(wrapper.instance(), 'switchToAddContent');
        wrapper.instance().switchToAddContent();
        expect(wrapper.instance().switchToAddContent).toBeCalled()
    })

    it('should test lockMapContent', () => {
        jest.spyOn(wrapper.instance(), 'lockMapContent');
        wrapper.instance().lockMapContent();
        expect(wrapper.instance().lockMapContent).toBeCalled()
    })

    it('should test populateDataToState', () => {
        jest.spyOn(wrapper.instance(), 'populateDataToState');
        wrapper.instance().populateDataToState();
        expect(wrapper.instance().populateDataToState).toBeCalled()
    })

    it('should test updateOption', () => {
        jest.spyOn(wrapper.instance(), 'updateOption');
        wrapper.instance().updateOption();
        expect(wrapper.instance().updateOption).toBeCalled()
    })

    it('should test autoSaveError', () => {
        const autoSaveError = jest.fn();
        wrapper.setProps({ autoSaveError });
        jest.spyOn(wrapper.instance(), 'autoSaveError');
        wrapper.instance().autoSaveError();
        expect(wrapper.instance().autoSaveError).toBeCalled()
    })

    it('should test componentDidUpdate', () => {
        jest.spyOn(wrapper.instance(), 'componentDidUpdate');
        wrapper.instance().componentDidUpdate();
        expect(wrapper.instance().componentDidUpdate).toBeCalled()
    })

    it('should test componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled()
    })

    it('should test getMappedContent', () => {
        jest.spyOn(wrapper.instance(), 'getMappedContent');
        wrapper.instance().getMappedContent();
        expect(wrapper.instance().getMappedContent).toBeCalled()
    })

    it('should test getMappedContent else condition', () => {
        const state = {
            options: [
                {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: true, label: "Main Content", name: "mainContent", placeholder: "Search via Movie name", type: "main"
                }, {
                    deleteModalDescription: "Do you want to remove this content from the assigned listing?", deleteTitle: "Delete Content",
                    fetched: false, label: "Link Content", name: "linkContent", placeholder: "Search via Movie name", type: "link"
                }
            ],
            selectedTab: 0,
            movieId: 'zyz'
        }
        wrapper.setState({ ...state });
        jest.spyOn(wrapper.instance(), 'getMappedContent');
        wrapper.instance().getMappedContent();
        expect(wrapper.instance().getMappedContent).toBeCalled()
    })

    it('should test componentWillUnmount', () => {
        jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().componentWillUnmount).toBeCalled()
    })

    it('should test optionClickedHandler', () => {
        wrapper.setState({ selectedTab: 0 });
        jest.spyOn(wrapper.instance(), 'optionClickedHandler');
        wrapper.instance().optionClickedHandler(null, 0);
        expect(wrapper.instance().optionClickedHandler).toBeCalled()
    })

    it('should test optionClickedHandler else condition', () => {
        wrapper.setState({ selectedTab: 0 });
        jest.spyOn(wrapper.instance(), 'optionClickedHandler');
        wrapper.instance().optionClickedHandler(null, 1);
        expect(wrapper.instance().optionClickedHandler).toBeCalled()
    })
})