
import Config from "../Config/config";
import axiosInstance from "../_helpers/axiosInstance";

import {
  createQuery
} from "../_components/Common/CommonFunction/CommonFuntion";


const get_all_movies = (params) => {
  const query = createQuery(params);
  const url = `${Config.movie}${query ? query : ''}`
  return axiosInstance.get(url, { loader: false })
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

const get_all_linked_movies = (params) => {
  const url = `${Config.mapContentList}/${params}`
  return axiosInstance.get(url)
    .then(response => {
      return response.data.data;
    })
    .catch(error => {
      return false;
    });
}

export const movieMgmtService = {
  get_all_movies,
  get_all_linked_movies
}