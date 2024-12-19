
import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import { showSuccessErrorMsg } from '../_actions/alertMessages.action'

import {
  createQuery
} from "../_components/Common/CommonFunction/CommonFuntion";

function create_licence_service(requestBody,showId,seasonId,episodeId) {
  let url = `${Config.episode.license}/${showId}/${seasonId}/${episodeId}`
 return axiosInstance.put(url, requestBody)
   .then(response => {
     return response.data;
   })
   .catch(error => {
     showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null);
     return false;
   });
}
function generate_xml_service(data) {
  return axiosInstance.post(Config?.episodegenerateXML, data)
    .then(response => {
      return response;
    });
}
function clone_episode_service(url, data) {
  return axiosInstance.post(url, data)
    .then(response => {
      return response;
    });
}
 function prefix_exist_service(data) {
  return axiosInstance.post(Config?.episodePrefixCheck, data, {loader: false})
    .then(response => {
      return response?.data?.message;
    }).catch(error => {
      return error?.response?.data?.message;
    });
}
function list_licence_service({ tvShowId,seasonId,episodeId, expired }) {
  let url = `${Config.episode.license}/${tvShowId}/${seasonId}/${episodeId}`
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



function edit_licence_service(id,showId,SeasonID,episodeId, licenceInfo) {
  let url = `${Config.episode.license}/${showId}/${SeasonID}/${episodeId}/${id}`
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

export const tvEpisodeService = {

  create_licence_service,
  edit_licence_service,
  generate_xml_service,
  clone_episode_service,
  fetch_template_service,
  prefix_exist_service,
  list_licence_service,
}