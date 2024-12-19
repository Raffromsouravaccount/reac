import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import CollectionCard from '../../../../_components/Collection/ListCollection/CollectionCard/CollectionCard';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CollectionCard {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('CollectionCard', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders CollectionCard default', () => {
    expect(wrapper.exists()).toBe(true);
  });

});