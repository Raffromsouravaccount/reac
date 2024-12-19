
import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import { showSuccessErrorMsg } from '../_actions/alertMessages.action'

import {
  createQuery
} from "../_components/Common/CommonFunction/CommonFuntion";


const get_all_tvShows = (params) => {
  const query = createQuery(params);
  const url = `${Config.tvShow.shows}${query ? query : ''}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const get_all_linked_tvshows = (id) => {
  const url = `${Config.tvShow?.mapContent}/${id}`;
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}
function create_licence_service(requestBody,tvshowId) {
  let url = `${Config.TvShowLicense}/${tvshowId}`
 return axiosInstance.put(url, requestBody)
   .then(response => {
     return response.data;
   })
   .catch(error => {
     showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null);
     return false;
   });
}

function list_licence_service({ contentId, expired }) {
  let url = `${Config.TvShowLicense}/${contentId}`
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



function edit_licence_service(id,movieID, licenceInfo) {
  let url = `${Config.TvShowLicense}/${movieID}/${id}`
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

const licence_mark_done = ({ requestBody, contentId, language }) => {
  let queryString = ''
  const url = `${Config.createProfileUrl}/isDone/${contentId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null);
      return false;
    });
}

const populate_data_to_state = (castAndCrewJson, contentData, userID) => {
  let shallowCastAndCrewJson = JSON.parse(JSON.stringify(castAndCrewJson));

  let disableFields = (userID !== contentData.lockedByEmail && contentData.isLocked) ? true : false;

  //populating others
  shallowCastAndCrewJson.others?.map(item => {
    item['disabled'] = disableFields
    if (contentData.hasOwnProperty(item.name)) {
      item.value = contentData[item.name]
    }
    return item
  })

  const populateArrayData = (type, subType, items, disableFields) => {
    return items.map(item => {
      let shallowItem = [];
      const jsonItems = subType ? shallowCastAndCrewJson[type][subType][0] : shallowCastAndCrewJson[type][0];
      for (let i = 0; i < jsonItems.length; i++) {
        let shallowItemObj = { ...jsonItems[i] };
        shallowItemObj.value = item[shallowItemObj.name] || null;
        shallowItemObj['disabled'] = disableFields;
        shallowItem.push(shallowItemObj);
      }
      return shallowItem;
    })
  }

  // populating actors
  if (contentData.hasOwnProperty('actors')) {
    shallowCastAndCrewJson['actors'] = populateArrayData('actors', null, contentData.actors, disableFields);
  } else {
    shallowCastAndCrewJson['actors'][0][0]['disabled'] = disableFields;
    shallowCastAndCrewJson['actors'][0][1]['disabled'] = disableFields;
  }

  // populating global
  if (contentData.hasOwnProperty('globalProperties')) {
    shallowCastAndCrewJson['globalProperties'] = populateArrayData('globalProperties', 'group', contentData.globalProperties.group || [], disableFields);
  } else {
    shallowCastAndCrewJson['globalProperties']['group'][0][0]['disabled'] = disableFields;
    shallowCastAndCrewJson['globalProperties']['group'][0][1]['disabled'] = disableFields;
  }

  // update state
  return shallowCastAndCrewJson;
}

export const tvShowsService = {
  get_all_tvShows,
  get_all_linked_tvshows,
  create_licence_service,
  edit_licence_service,
  fetch_template_service,
  licence_mark_done,
  list_licence_service,
  populate_data_to_state
}