import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";
import { showSuccessErrorMsg } from '../_actions/alertMessages.action';
import {
  createQuery
} from "../_components/Common/CommonFunction/CommonFuntion";

const get_all_collections = (params) => {
  let query = '';
  query = createQuery(params)
  const url = `${Config.collection}${query}`
  return axiosInstance.get(url, { loader: false })
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const collection_get_license_service = ({ collectionId }) => {
  let url = `${Config.collectionLicence}/${collectionId}`;
  return axiosInstance.get(url)
    .then(response => {
      return response.data
    })
    .catch(error => {
      return false;
    })
}

const collection_create_licence_service = (collectionId, params) => {
  let url = `${Config.collectionLicence}/${collectionId}`
  return axiosInstance.post(url, params)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return false;
    })
}
const get_all_linked_collection = (params) => {
  const { contentId } = params;
  const url = `movie/collectionAssign/${contentId}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const collection_edit_licence_service = (id, licenceInfo) => {
  let url = `${Config.collectionLicence}/${id}`
  return axiosInstance.put(url, licenceInfo)
    .then((response) => {
      return response.data;
    })
    .catch(error => {
      showSuccessErrorMsg(error.response.data.message, null, 'error', true, null);
      return false;
    });
}

/* Assign Assets APIs */
const get_assign_assets = ({ collectionId, type }) => {
  let url = `${Config.assignAssets}/${collectionId}/${type}`;
  if (type == 'rearrangeAsset') {
    url = `${Config.assignAssetsRearrangeContent}/${collectionId}`;
  }
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const post_assign_assets = (body, callback) => {
  return axiosInstance.post(Config.assignAssets, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const delete_assign_assets = (requestBody, contentId, callback) => {
  return axiosInstance.delete(`${Config.assignAssets}/${contentId}`, { data: requestBody })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const update_related_content_rearrange_content = (body, callback) => {
  return axiosInstance.put(Config.assignAssetsRearrangeContent, body)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      callback ? callback(error.response) : "";
      return false;
    });
}

const rearrange_assign_assets = (requestBody, contentId, callback) => {
  const url = `${Config.assignAssetsRearrange}/${contentId}`
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


export const collectionService = {
  get_all_collections,
  collection_get_license_service,
  collection_create_licence_service,
  get_all_linked_collection,
  collection_edit_licence_service,
  post_assign_assets,
  get_assign_assets,
  delete_assign_assets,
  update_related_content_rearrange_content,
  rearrange_assign_assets
};

