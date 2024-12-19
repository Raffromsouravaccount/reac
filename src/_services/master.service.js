import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";

export const masterService={
  fetch_master_service,
}

function fetch_master_service(type) {
    let url= `${Config.masterUrl}/${type}`
    return axiosInstance.get(url, {loader:false})
        .then(response => {
            return response.data.data;
        });
}
