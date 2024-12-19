import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import IngestionTable from '../../../_components/Ingestion/IngestionTable';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
  HCell : ["External Id","Job Name","Validation","Image Copy","Publish Content","Meta State","Get State","Publish State","Start","End","Created On"],
  loadingRecords: false,
  refreshHandler: jest.fn(),
  rowData: [{"externalId":"0-0-1z51000069","jobName":"NA","validation":"Finished","imageCopy":"Finished","publish":"Finished","metaState":"Failled","getState":"NA","publishState":"NA","start":"26 Feb 2021 2:31 PM","end":"26 Feb 2021 2:31 PM","createdOn":"25/02/2021","id":"f4a9fb4d-647a-4c28-9bf1-42f509279f4a"},{"externalId":"0-0-1z51000070","jobName":"NA","validation":"Failed","imageCopy":"Failed","publish":"Failed","metaState":"Failled","getState":"NA","publishState":"NA","start":"26 Feb 2021 2:32 PM","end":"26 Feb 2021 2:32 PM","createdOn":"25/02/2021","id":"1d8578fd-c4fd-4b2b-b9ba-6499ef2427e2"},{"externalId":"0-0-1z51000061","jobName":"NA","validation":"Finished","imageCopy":"Finished","publish":"Finished","metaState":"Failled","getState":"NA","publishState":"NA","start":"26 Feb 2021 2:33 PM","end":"26 Feb 2021 2:33 PM","createdOn":"24/02/2021","id":"e8779b99-944b-4a8c-9849-967b2241e466"},{"externalId":"0-0-1z51000015","jobName":"NA","validation":"Finished","imageCopy":"Finished","publish":"Finished","metaState":"Failled","getState":"NA","publishState":"NA","start":"26 Feb 2021 2:33 PM","end":"26 Feb 2021 2:33 PM","createdOn":"23/02/2021","id":"523c2f81-8f26-4f5b-8669-16ae538499c4"},{"externalId":"0-0-1z51000023","jobName":"appname1a_1024725176","validation":"Finished","imageCopy":"Finished","publish":"Finished","metaState":"Processing","getState":"Finished","publishState":"Publication process initiated.","start":"23 Feb 2021 5:19 PM","end":"26 Feb 2021 5:10 PM","createdOn":"23/02/2021","id":"a84eb232-efde-4b44-916b-017973e9964c"}],
  rowKeys: ["externalId","jobName","validation","imageCopy","publish","metaState","getState","publishState","start","end","createdOn"]
};

const setup = (props = {}) => {
    const wrapper = shallow(<IngestionTable {...baseProps} />);
    return wrapper;
}

describe('<IngestionTable />', () => {
  let wrapper;
  beforeEach(() => {
      wrapper = setup({...baseProps});
  })

  it('Should renders IngestionTable default', () => {
      expect(wrapper.exists()).toBe(true);
  });

});