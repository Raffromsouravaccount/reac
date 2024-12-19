import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";

export const userService = {
  fetch_users_service,
  create_users_service,
  fetchUserByIdKey_service,
  fetch_roles_service,
  fetch_countries_service,
  fetch_language_service,
  fetch_master_service,
  create_master_service,
  update_master_service,
  patch_master_service,
  delete_master_service,
  update_users_service,
  user_details_service
};

function fetch_users_service(query) {
  let url = query ? `${Config.usersUrl}?${query}` : Config.usersUrl;
  return axiosInstance.get(url,{loader:false})
    .then(response => {
      return response.data.data;
    });
}

function create_users_service(userInfo) {
  return axiosInstance.post(Config.usersUrl, userInfo)
    .then(response => {
      return response.data;
    });
}

function fetchUserByIdKey_service(key) {
  return axiosInstance.get(`${Config.usersUrl}/${key}`)
    .then(response => {
      return response.data.data;
    });

}

function user_details_service(userId) {
  return axiosInstance.get(`${Config.usersUrl}/${userId}`)
    .then(response => {
      return response.data.data;
    });

}

function update_users_service(id, updatedObj) {
  return axiosInstance.put(`${Config.usersUrl}/${id}`, updatedObj)
    .then(response => {
      return response.data;
    });
}

function fetch_roles_service(query) {
  let url = query ? `${Config.rolesUrl}?${query}` : `${Config.rolesUrl}`;
  return axiosInstance.get(url,{loader:false})
    .then(response => {
      return response.data.data;
    });
}

function fetch_countries_service(filterData) {
  return axiosInstance.get(`${Config.masterUrl}/Country?status=all`)
    .then(response => {
      return response.data.data;
    });
}

function fetch_language_service(query) {
  let url = query ? `${Config.masterUrl}/Language?${query}`: `${Config.masterUrl}/Language`;
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    });
}

function fetch_master_service(type) {
  return axiosInstance.get(`${Config.masterUrl}/${type}?status=all&translation=yes`,{loader: false})
    .then(response => {
      return response;
    });
}

function create_master_service(data) {
  return axiosInstance.post(Config.masterUrl, data)
    .then(response => {
      return response;
    });
}

function update_master_service(uuid, data) {
  return axiosInstance.put(`${Config.masterUrl}/${uuid}`, data)
    .then(response => {
      return response.data;
    });
}

function patch_master_service(uuid, type, data) {
  return axiosInstance.patch(`${Config.masterUrl}/${uuid}?type=${type}`, data)
    .then(response => {
      return response.data;
    });
}

function delete_master_service(uuid, type) {
  return axiosInstance.delete(`${Config.masterUrl}/${uuid}?type=${type}`)
    .then(response => {
      return response.data;
    });
}