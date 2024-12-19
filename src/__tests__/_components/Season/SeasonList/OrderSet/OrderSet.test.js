import React from 'react';
import { shallow } from 'enzyme';

import OrderSet from '../../../../../_components/Season/SeasonList/OrderSet/OrderSet';

const OrderSetList = [
  {
    orderSetId: "99dwqqdhw9cwidh9dqiw",
    setName: "Default",
    default: "yes",
  },
  {
    orderSetId: "721ghv2ed72d1d0ddhd",
    setName: "Middle East",
  },
];

const intialProps = {
  OrderSets: OrderSetList,
  isViewMode:false,
  option:  {
    "label": "Set Ordering",
    "name": "rearrangeContent",
    "contentIdKey": "id",
    "noItemsText": "No seasons have been found",
    "showMarkDone": true
  }
};
const intialState = {
  showLockPopup: false,
  markAsDoneStatus: 1,
  expanded: 0,
  imageItem: null,
  viewEditModalState: false,
  viewEditModalMode: "",
  model: {
    showModel: false,
    type: "",
    title: "",
    des: "",
  },
  setItem: null,
  contentData: {},
  updatedImageItem: null,
  copyImageItem: null,
};
const setup = (props = intialProps, state = intialState) => {
    const wrapper = shallow(<OrderSet {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<OrderSet />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })
    it('Should renders OrderSet default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})
