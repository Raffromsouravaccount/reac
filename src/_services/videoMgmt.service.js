import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";

import { showSuccessErrorMsg } from "./../_actions/alertMessages.action";

import { createQuery } from "../_components/Common/CommonFunction/CommonFuntion";

function fetch_template_service(type) {
  let url = `${Config.masterUrl}/${type}`;
  return axiosInstance.get(url).then((response) => {
    return response.data.data;
  });
}

const get_all_videos = (params) => {
  const query = createQuery(params);
  const url = `${Config.video.videoList}${query ? query : ''}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch((error) => {
      return false;
    });
}
function list_license_service({ contentId, expired }) {
  let url = `${Config.videoLicense}/${contentId}`;
  if (expired) {
    url += `?expired=${expired}`;
  }
  return axiosInstance
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return false;
    });
}
function create_licence_service(requestBody, videoID) {
  let url = `${Config.videoLicense}/${videoID}`;
  return axiosInstance
    .put(url, requestBody)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showSuccessErrorMsg(
        error.response.data.message,
        null,
        "Alert",
        true,
        null
      );
      return false;
    });
}
const post_map_content = (body, callback) => {
  return axiosInstance.post(Config.video.mapContent, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}


const delete_map_content = (requestBody, videoId, callback) => {
  const url = `${Config.video.mapContent}/${videoId}`
  return axiosInstance.delete(url, {
    data: requestBody
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if(callback){
        callback(error.response);
      }
      return false;
    });
}

const get_map_content = ({ videoId }) => {
  const url = `${Config.video.mapContent}/${videoId}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}
const rearrange_map_content = (requestBody, videoId, callback) => {
  const url = `${Config.video.mapContentRearrange}/${videoId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data;
    })
    .catch(error => {     
      if(callback){
        callback(error.response);
      }
      return false;
    });
}

const get_all_linked_videos = (videoId) => { 
  const url = `${Config.videoMapContentList}/${videoId}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

function edit_licence_service(id, videoID, licenceInfo) {
  let url = `${Config.videoLicense}/${videoID}/${id}`;
  return axiosInstance
    .put(url, licenceInfo)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      showSuccessErrorMsg(
        error.response.data.message,
        null,
        "Alert",
        true,
        null
      );
      return false;
    });

}
/* Collection Assignment APIs */
const getCollectionAssignment = ({ contentId }) => {
  return axiosInstance.get(`${Config.video.collectionAssignment}/${contentId}`)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const postCollectionAssignment = (contentId, body, callback) => {
  return axiosInstance.post(`${Config.video.collectionAssignment}/${contentId}`, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const deleteCollectionAssignment = (collectionId, contentId, callback) => {
  const url = `${Config.video.collectionAssignment}/${contentId}?collectionId=${collectionId}`;
  return axiosInstance.delete(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const rearrangeCollectionAssignment = (requestBody, contentId, callback) => {
  const url = `${Config.video.collectionAssignment}/${contentId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

/* Related Contents APIs */
const get_related_content = ({ videoId, type }) => {
  let url = `${Config.video.relatedContent}/${videoId}/${type}`
  if(type == 'rearrangeContent') {
    url = `${Config.video.rearrangeContent}/${videoId}`
  }
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const update_related_content_rearrange_content = (body, callback) => {
  let url = Config.video.rearrangeContent;
  return axiosInstance.put(url, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
     callback = callback ? callback(error.response) : "";
      return false;
    });
}

const post_related_content = (body, callback) => {
  return axiosInstance.post(Config.video.relatedContent, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
     callback = callback ? callback(error.response) : "";
      return false;
    });
}

const delete_related_content = (requestBody, videoId, callback) => {
  const url = `${Config.video.relatedContent}/${videoId}`
  return axiosInstance.delete(url, {
    data: requestBody
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
     callback = callback ? callback(error.response) : "";
      return false;
    });
}


const rearrange_related_content = (requestBody, videoId, callback) => {
  const url = `${Config.video.relatedContentRearrange}/${videoId}`
  return axiosInstance.patch(url, requestBody)
    .then(response => {
      return response.data;
    })
    .catch(error => {
     callback = callback ? callback(error.response) : "";
      return false;
    });
}

/* ----------------------------------------------- */
export {
  fetch_template_service,
  list_license_service,
  create_licence_service,
  edit_licence_service,
  post_map_content,
  delete_map_content,
  get_map_content,
  rearrange_map_content,
  getCollectionAssignment,
  postCollectionAssignment,
  deleteCollectionAssignment,
  rearrangeCollectionAssignment,
  post_related_content,
  delete_related_content,
  get_related_content,
  rearrange_related_content,
  update_related_content_rearrange_content
};

export const videoMgmtService = {
  get_all_videos,
  get_all_linked_videos
}