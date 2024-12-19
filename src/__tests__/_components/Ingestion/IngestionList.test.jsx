import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import moxios from "moxios";
import axios from "../../../_helpers/axiosInstance";
import IngestionList from '../../../_components/Ingestion/IngestionList';

//Helpers
import { findByTestAttr } from '../../../Utils';
import { constantText } from "../../../_helpers/constants.text";
//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
import LightIcon from "images/light-icon.svg";
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const setup = (state = null, props = {}) => {
  const wrapper = shallow(<IngestionList {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}
describe('<IngestionList />', () => {
  let wrapper;
  const event = { target: { name: 'xyz', value: '123'}, preventDefault: jest.fn() }
  beforeEach(() => {
    moxios.install(axios);
    wrapper = setup(null, { history: {push : jest.fn()}});
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });
  it('Should renders IngestionList default', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("should test ComponentDidMount", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });
  it("should check back heading text", () => {
    const titleText = findByTestAttr(wrapper, "ingestion-heading-text");
    expect(titleText.text()).toMatch(constantText?.ingestion_text);
  });

  it('Should check input field', () => {
    const inputField = wrapper.find('input');
    expect(inputField.exists()).toBe(true);
  });

  it('Should renders AngleLeftArrowIcon default', () => {
    expect(wrapper.containsMatchingElement(<AngleLeftArrow />)).toEqual(true);
  });

  it("should test handleRoute", () => {
    jest.spyOn(wrapper.instance(), "handleRoute");
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  });

  it("should test handleSearch", () => {
    jest.spyOn(wrapper.instance(), "handleSearch");
    wrapper.instance().handleSearch(event);
    expect(wrapper.instance().handleSearch).toBeCalled();
  });

  it("should test formatListData", () => {
    let mockData = [{
      attempts: 0,
      contentId: "6748bfb7-8f30-c458-f9ae-f4df51be6d57",
      createdBy: "3951d801-9758-4a09-be3e-0af342ba9d13",
      createdOn: "2021-02-25T09:04:30.853Z",
      created_by: {first_name: "Sahil", last_name: "Arora"},
      end: "2021-02-26T09:01:58.275Z",
      externalId: "0-0-1z51000069",
      getState: null,
      id: "f4a9fb4d-647a-4c28-9bf1-42f509279f4a",
      imageCopy: "1",
      jobName: "",
      metaState: "Failled",
      modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
      modifiedOn: "2021-02-26T14:08:30.664Z",
      modified_by: {first_name: "Jaipal", last_name: "Singh"},
      publish: "1",
      publishState: null,
      start: "2021-02-26T09:01:58.275Z",
      status: "1",
      validation: "1",
      warnings: {metaResponse: {errorCode: 401, errorMessage: "Unauthorized"}}
      }];
    jest.spyOn(wrapper.instance(), "formatListData");
    wrapper.instance().formatListData(mockData);
    expect(wrapper.instance().formatListData).toBeCalled();
  });

  it("should test refreshHandler", () => {
    let mockData = {
      attempts: 0,
      contentId: "6748bfb7-8f30-c458-f9ae-f4df51be6d57",
      createdBy: "3951d801-9758-4a09-be3e-0af342ba9d13",
      createdOn: "2021-02-25T09:04:30.853Z",
      created_by: {first_name: "Sahil", last_name: "Arora"},
      end: "2021-02-26T09:01:58.275Z",
      externalId: "0-0-1z51000069",
      getState: null,
      id: "f4a9fb4d-647a-4c28-9bf1-42f509279f4a",
      imageCopy: "1",
      jobName: "",
      metaState: "Failled",
      modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
      modifiedOn: "2021-02-26T14:08:30.664Z",
      modified_by: {first_name: "Jaipal", last_name: "Singh"},
      publish: "1",
      publishState: null,
      start: "2021-02-26T09:01:58.275Z",
      status: "1",
      validation: "1",
      warnings: {metaResponse: {errorCode: 401, errorMessage: "Unauthorized"}}
      };
    let filteredRows = [mockData];
      const responseData = {
        status: 200,
        response: {
          "status":200,
          "data":[{
            attempts: 0,
            contentId: "6748bfb7-8f30-c458-f9ae-f4df51be6d57",
            createdBy: "3951d801-9758-4a09-be3e-0af342ba9d13",
            createdOn: "2021-02-25T09:04:30.853Z",
            created_by: {first_name: "Sahil", last_name: "Arora"},
            end: "2021-02-26T09:01:58.275Z",
            externalId: "0-0-1z51000069",
            getState: null,
            id: "f4a9fb4d-647a-4c28-9bf1-42f509279f4a",
            imageCopy: "1",
            jobName: "",
            metaState: "Failled",
            modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
            modifiedOn: "2021-02-26T14:08:30.664Z",
            modified_by: {first_name: "Jaipal", last_name: "Singh"},
            publish: "1",
            publishState: null,
            start: "2021-02-26T09:01:58.275Z",
            status: "1",
            validation: "1",
            warnings: {metaResponse: {errorCode: 401, errorMessage: "Unauthorized"}}
            }],
          "error":null},
      };
      wrapper = setup({filteredRows});
      wrapper.instance().refreshHandler(mockData);
      moxios.wait(function () {
            const request = moxios.requests.at(0);
            request.respondWith(responseData).then(() => {
              expect(wrapper.state("filteredRows")).toHaveLength(1);
              done();
            }).catch(err => {
              console.log(err);
            });
      });
  });


  it('Should renders LightIcon default', () => {
    expect(wrapper.containsMatchingElement(<LightIcon />)).toEqual(true);
  });

  it("should call fetchIngestionList API Success", (done) => {

    const responseData = {
      status: 200,
      response: {
        "status":200,
        "data":[{
          attempts: 0,
          contentId: "6748bfb7-8f30-c458-f9ae-f4df51be6d57",
          createdBy: "3951d801-9758-4a09-be3e-0af342ba9d13",
          createdOn: "2021-02-25T09:04:30.853Z",
          created_by: {first_name: "Sahil", last_name: "Arora"},
          end: "2021-02-26T09:01:58.275Z",
          externalId: "0-0-1z51000069",
          getState: null,
          id: "f4a9fb4d-647a-4c28-9bf1-42f509279f4a",
          imageCopy: "1",
          jobName: "",
          metaState: "Failled",
          modifiedBy: "8ca59a9c-5a0a-462d-ab32-55ff5f177ab1",
          modifiedOn: "2021-02-26T14:08:30.664Z",
          modified_by: {first_name: "Jaipal", last_name: "Singh"},
          publish: "1",
          publishState: null,
          start: "2021-02-26T09:01:58.275Z",
          status: "1",
          validation: "1",
          warnings: {metaResponse: {errorCode: 401, errorMessage: "Unauthorized"}}
          }],
        "error":null},
    };
    wrapper.instance().fetchIngestionList();
    moxios.wait(function () {
          const request = moxios.requests.at(0);
          request.respondWith(responseData).then(() => {
            expect(wrapper.state("listData")).toHaveLength(1);
            done();
          }).catch(err => {
            console.log(err);
          });

      
    });
  });

});