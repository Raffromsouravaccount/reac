import axios from "axios";
import Config from "../Config/config";
import { store } from './store';
import {showSuccessErrorMsg} from "../_actions/alertMessages.action";

import { INCREASE_REQUEST, DECREASE_REQUEST } from '../_constants/common.constants';

const baseURL = Config.BackendApiURL;

const axiosInstance = axios.create({
  baseURL: baseURL
});

axiosInstance.interceptors.request.use(
  config => {
    if( store && (config.loader === undefined || config.loader)) {
      store.dispatch({ type: INCREASE_REQUEST})
    }
    return config;
  },
  error=> Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => {
    return new Promise((resolve, reject) => {
      if(store && (response.config.loader === undefined || response.config.loader)) {
        store.dispatch({ type: DECREASE_REQUEST })
      }
      resolve(response);
    })},
  (error) => {
    if(error?.response?.status == 401) {
      showSuccessErrorMsg(error.response.data.message, null, "Alert", true, null, "/");
    }
    return new Promise((resolve, reject)=> {
      if(store && (error.response.config.loader === undefined || error.response.config.loader)) {
        store.dispatch({ type: DECREASE_REQUEST })
      }
      reject(error);
    });
  }
);

export default axiosInstance;
