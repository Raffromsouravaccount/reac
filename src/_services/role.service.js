import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";

export const roleService = {
  create_role_service,
  update_role_service
};

function create_role_service(roleData) {
  return axiosInstance.post(`${Config.rolesUrl}`, roleData)
    .then(response => {
      return response.data;
    });
}

function update_role_service(id, updatedObj) {
  return axiosInstance.put(`${Config.rolesUrl}/${id}`, updatedObj)
    .then(response => {
      return response.data;
    });
}