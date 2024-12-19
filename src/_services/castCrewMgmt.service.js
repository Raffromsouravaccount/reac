import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import axios from "axios";
import { setLocalData } from "../_helpers/util";

export const castCrewMgmtService = {
  create_faq_service,
  fetch_all_faq_service,
  view_profile_service,
  image_markasdone_service,
  get_castList_service
};

function create_faq_service(validateObj) {
  return axiosInstance
    .post(Config.createfaqUrl, validateObj)
    .then((response) => {
      return response.data;
    });
}

function fetch_all_faq_service(id) {
  let url = `${Config.createfaqUrl}/${id}`;
  return axiosInstance.get(url).then((response) => {
    return response.data.data;
  });
}

function view_profile_service(id) {
  let url = `${Config.createProfileUrl}/${id}`;
  return axiosInstance.get(url).then((response) => {
    return response.data;
  });
}

async function image_markasdone_service(contentId) {
  let url = `${Config.imageMarkAsDone}/${contentId}`;
  const response = await axiosInstance.patch(url);
  return { response };
}

async function get_castList_service(queryParams) {
  // queryParams must contain combination only these properties {searchString, castTag, castType}
  let queryString = "";
  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      if (queryString === "") {
        queryString = queryString + "?";
      } else {
        queryString = queryString + "&";
      }
      queryString = `${queryString}${queryParams[key]}`;
    });
  }
  let url = `${Config.castList}${queryString}`;
  const response = await axiosInstance.get(url);
  return response.data.data;
}

