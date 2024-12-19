import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import { showSuccessErrorMsg } from './../_actions/alertMessages.action'
import { setLocalData } from '../_helpers/util';

/* Cast & Crew APIs */
const update_cast_crew = (body, contentId) => {
  const url = `${Config.castAndCrew}/${contentId}`
  return axiosInstance.put(url, body, { loader: false })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error.response;
    });
}

const post_cast_crew = (body) => {
  return axiosInstance.post(Config.castAndCrew, body, { loader: false })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return false;
    });
}

const get_cast_crew = ({ movieId, language }) => {
  const url = `${Config.castAndCrew}/${movieId}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

/* Map Contents APIs */
const get_map_content = ({ movieId, type }) => {
  const url = `${Config.mapContent}/${movieId}/${type}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const post_map_content = (body, callback) => {
  return axiosInstance.post(Config.mapContent, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const delete_map_content = (requestBody, movieId, callback) => {
  const url = `${Config.mapContent}/${movieId}`
  return axiosInstance.delete(url, {
    data: requestBody
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const rearrange_map_content = (requestBody, movieId, callback) => {
  const url = `${Config.mapContentRearrange}/${movieId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

/* Related Contents APIs */
const get_related_content = ({ movieId, type }) => {
  let url = `${Config.relatedContent}/${movieId}/${type}`
  if(type == 'rearrangeContent') {
    url = `${Config.rearrangeContent}/${movieId}`
  }
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const update_related_content = (body, movieId, loader) => {
  const url = `${Config.relatedContent}/${movieId}`
  return axiosInstance.put(url, body, { loader })
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const update_related_content_rearrange_content = (body, callback) => {
  let url = Config.rearrangeContent;
  return axiosInstance.put(url, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const post_related_content = (body, callback) => {
  return axiosInstance.post(Config.relatedContent, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const delete_related_content = (requestBody, movieId, callback) => {
  const url = `${Config.relatedContent}/${movieId}`
  return axiosInstance.delete(url, {
    data: requestBody
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const rearrange_related_content = (requestBody, movieId, callback) => {
  const url = `${Config.relatedContentRearrange}/${movieId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}
/* ----------------------------------------------- */

/* Collection Assignment APIs */
const get_collection_assignment = ({ contentId }) => {
  return axiosInstance.get(`${Config.collectionAssignment}/${contentId}`)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const post_collection_assignment = (contentId, body, callback) => {
  return axiosInstance.post(`${Config.collectionAssignment}/${contentId}`, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const delete_collection_assignment = (collectionId, contentId, callback) => {
  const url = `${Config.collectionAssignment}/${contentId}?collectionId=${collectionId}`;
  return axiosInstance.delete(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const rearrange_collection_assignment = (requestBody, contentId, callback) => {
  const url = `${Config.collectionAssignment}/${contentId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}
/* ----------------------------------------------- */

function create_licence_service(requestBody,movieID) {
   let url = `${Config.licenceModule}/${movieID}`
  return axiosInstance.put(url, requestBody)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      showSuccessErrorMsg(error.response.data.message, null, 'Alert', true, null);
      return false;
    });
}

function list_license_service({ contentId, expired }) {
  let url = `${Config.licenceModule}/${contentId}`
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
  let url = `${Config.licenceModule}/${movieID}/${id}`
  return axiosInstance.put(url, licenceInfo).then((response) => {
    return response.data;
  })
    .catch(error => {
      showSuccessErrorMsg(error.response.data.message, null, 'Alert', true, null);
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

export {
  post_cast_crew,
  update_cast_crew,
  get_cast_crew,
  post_map_content,
  get_map_content,
  delete_map_content,
  rearrange_map_content,
  update_related_content,
  update_related_content_rearrange_content,
  post_related_content,
  get_related_content,
  delete_related_content,
  rearrange_related_content,
  post_collection_assignment,
  get_collection_assignment,
  delete_collection_assignment,
  rearrange_collection_assignment,
  create_licence_service,
  list_license_service,
  edit_licence_service,
  fetch_template_service,
  licence_mark_done
};