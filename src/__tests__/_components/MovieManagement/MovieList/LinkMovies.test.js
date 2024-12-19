import React from 'react';
import { shallow } from 'enzyme';

import LinkMovies from '../../../../_components/MovieManagement/LinkMovies/LinkMovies';
import { storeFactory, findByTestAttr } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<LinkMovies store={store} {...props} />).dive();
    return wrapper;
}

const initialState = {};

const baseProps = {
    match: {
        params: { id: '123' }
    },
    getAllLinkedMovies: jest.fn()
}

const moviesList = {
    data: [
        {
            MovieImages: [], MovieLicenses: [{ countriesId: null, validFrom: null, validUntil: "10-05-2021" }],
            contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
            contentState_populated: { title: "Draft" },
            createdBy_populated: { first_name: "Rakesh", last_name: "chandra" },
            createdOn: "2021-03-03T12:17:11.600Z", dateZee5Published: null,
            duration: "00:03:20", externalId: "0-0-Z51000146", journeyType: "1",
            licenceExpDays: [], modifiedOn: "2021-03-22T11:09:01.754Z",
            modifiedBy_populated: { first_name: "Sandeep", last_name: "Kumar" },
            movieId: "ea8519ff-a673-423e-8352-f21156ba427b", originCountry: null,
            showDetails: false, subtype: null, subtype_populated: null, title: "No Title"
        }
    ]
}
describe('LinkMovies', () => {
    let wrapper;
    let instance;
    beforeEach(() => {
        wrapper = setup(initialState);
        instance = wrapper.dive().instance();
        wrapper.setProps({ ...baseProps });
        wrapper.dive().setState({ moviesList: moviesList })
    });

    it('Should renders LinkMovies default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test componentDidMount method', () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })

    it('should test componentWillReceiveProps method', () => {
        const nextProps = { mockValue: 'test' }
        jest.spyOn(instance, 'componentWillReceiveProps');
        instance.componentWillReceiveProps(nextProps);
        expect(instance.componentWillReceiveProps).toBeCalled();
    })

    it('should test getMovies method', () => {
        jest.spyOn(instance, 'getMovies');
        instance.getMovies();
        expect(instance.getMovies).toBeCalled();
    })

    it('should test handleRouteExpiredLink method', () => {
        const movie = { movieId: 'test123', journeyType: 'test' };
        jest.spyOn(instance, 'handleRouteExpiredLink');
        instance.handleRouteExpiredLink(movie);
        expect(instance.handleRouteExpiredLink).toBeCalled();
    })

    it('should test showHideClonePopup method', () => {
        jest.spyOn(instance, 'showHideClonePopup');
        instance.showHideClonePopup();
        expect(instance.showHideClonePopup).toBeCalled();
    })

    it('should test showHideCountriesPopup method', () => {
        jest.spyOn(instance, 'showHideCountriesPopup');
        instance.showHideCountriesPopup();
        expect(instance.showHideCountriesPopup).toBeCalled();
    })

    it('should test cloneContent method', () => {
        jest.spyOn(instance, 'cloneContent');
        instance.cloneContent();
        expect(instance.cloneContent).toBeCalled();
    })

    it('should test toggleCountryPopup method', () => {
        jest.spyOn(instance, 'toggleCountryPopup');
        instance.toggleCountryPopup();
        expect(instance.toggleCountryPopup).toBeCalled();
    })

    it('should test viewMovieHandler method', () => {
        const movie = { movieId: 'test123', journeyType: 'test' };
        jest.spyOn(instance, 'viewMovieHandler');
        instance.viewMovieHandler(movie);
        expect(instance.viewMovieHandler).toBeCalled();
    })

    it('should test handleRoute method', () => {
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toBeCalled();
    })

    it('should test setMovieListData method', () => {
        const moviesList = {
            data: [
                {
                    MovieImages: [], MovieLicenses: [{ countriesId: null, validFrom: null, validUntil: "10-05-2021" }],
                    contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
                    contentState_populated: { title: "Draft" },
                    createdBy_populated: { first_name: "Rakesh", last_name: "chandra" },
                    createdOn: "2021-03-03T12:17:11.600Z", dateZee5Published: null,
                    duration: "00:03:20", externalId: "0-0-Z51000146", journeyType: "1",
                    licenceExpDays: [], modifiedOn: "2021-03-22T11:09:01.754Z",
                    modifiedBy_populated: { first_name: "Sandeep", last_name: "Kumar" },
                    movieId: "ea8519ff-a673-423e-8352-f21156ba427b", originCountry: null,
                    showDetails: false, subtype: null, subtype_populated: null, title: "No Title"
                }
            ]
        }
        jest.spyOn(instance, 'setMovieListData');
        instance.setMovieListData(moviesList);
        expect(instance.setMovieListData).toBeCalled();
    })

    it('should check handleClose', () => {
        const myFakeCallback = () => { };
        wrapper.dive().find('#common-model-clone').first().prop('handleClose')(myFakeCallback);
    });

    it('should check handleClose', () => {
        const myFakeCallback = () => { };
        wrapper.dive().find('#license-model').first().prop('handleClose')(myFakeCallback);
    });

    it('should check btn2Action', () => {
        const myFakeCallback = () => { };
        wrapper.dive().find('#common-model-clone').first().prop('btn2Action')(myFakeCallback);
    });

    it('should check btn2Action', () => {
        const myFakeCallback = () => { };
        wrapper.dive().find('#license-model').first().prop('btn2Action')(myFakeCallback);
    });
    
});