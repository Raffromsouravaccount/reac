
import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import { showSuccessErrorMsg } from '../_actions/alertMessages.action'

import {
  createQuery
} from "../_components/Common/CommonFunction/CommonFuntion";

function create_licence_service(requestBody,showId,seasonId) {
  let url = `${Config.season.seasonLicense}/${showId}/${seasonId}`
 return axiosInstance.put(url, requestBody)
   .then(response => {
     return response.data;
   })
   .catch(error => {
     showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null);
     return false;
   });
}

function list_licence_service({ contentId,seasonId, expired }) {
  let url = `${Config.season.seasonLicense}/${contentId}/${seasonId}`
  if (expired) {
    url += `?expired=${expired}`
  }
  return axiosInstance.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return false;
    })
}



function edit_licence_service(id,showId,SeasonID, licenceInfo) {
  let url = `${Config.season.seasonLicense}/${showId}/${SeasonID}/${id}`
  return axiosInstance.put(url, licenceInfo).then((response) => {
    return response.data;
  })
    .catch(error => {
      showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null);
      return false;
    });
}

function fetch_template_service(type) {
  let url = `${Config.masterUrl}/${type}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data
    })
}

export const tvSeasonService = {

  create_licence_service,
  edit_licence_service,
  fetch_template_service,
  list_licence_service,
}