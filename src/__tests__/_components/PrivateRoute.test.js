import { PrivateRouteWithHeaderAndTabs, PrivateRoute } from '../../_components/PrivateRoute';
import { expect, it, jest } from '@jest/globals';
import { isAuthenticated, getLocalData } from '../../_helpers/util';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

describe('validation', () => {
    it('PrivateRouteWithHeaderAndTabs method', () => {
        expect(PrivateRouteWithHeaderAndTabs({component: '', isAuthenticated})).toBeTruthy();
    })

    it('PrivateRoute method', () => {
        expect(PrivateRoute({component: '', isAuthenticated})).toBeTruthy();
    })
})


