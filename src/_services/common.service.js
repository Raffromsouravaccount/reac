import axios from "../_helpers/axiosInstance";
import axiosRequest from "axios";
import { v4 as uuidv4 } from 'uuid';
import Config from "../Config/config";
import {showSuccessErrorMsg} from '../_actions/alertMessages.action';

import LeftTabStatus from '../_components/Common/Schema/LeftTabStatus.json';
import LeftTabDrpdown from '../_components/Common/Schema/LeftTabDropDown.json';


export const apiCalls = async (url, method, data, failureRoute, loader, returnError, callBack,baseUrl=null) => {
  try {
    axios.defaults.baseURL= baseUrl? baseUrl: Config.BackendApiURL;
    let response = await axios({ method, url, data, loader });
    let {status}= response?.data || {};
    if (response && (status == 200 || status == 201 || status == 206)) {
      return response.data?.data;
    }
    else {
      showSuccessErrorMsg(response.data.message, null, 'error', true, null, failureRoute);
    }
  }
  catch (error) {
    if(callBack) {


      return callBack(error?.response);
    }
    if(failureRoute) {
      failureRoute= (error?.response?.data?.status== 401)? "/": failureRoute;
      let alertText= (error?.response?.data?.status== 401)? "Alert": "Error";
      showSuccessErrorMsg(error?.response?.data?.message, null, alertText, true, null, failureRoute);
    }
    if (returnError) {
      return error?.response?.data;
    }
  }
}

export const commonService = {
  getLeftSideBarListing,
  get_signed_url_and_upload_to_s3,
  getReasonTypeMasterData
}

async function get_signed_url_and_upload_to_s3(file,params) {
  try {
    const time = new Date().getTime();
    let { type, name } = file;
    let preSignedFileName,fileName;
    let uuid=uuidv4();
     preSignedFileName=params.imageDimension ?`${params?.externalId}/${params?.imageType}/${params?.imageDimension}/${params.imagetitle}-${uuid}${params.imageExtension}`:`${params?.externalId}/${params?.imageType}/${params.imagetitle}-${uuid}${params.imageExtension}`;
    const response = await apiCalls(Config.preSignedUrl, 'POST', {key:preSignedFileName},null, true, false, false);

    if (response.url) {
      const signedRequest = response.url;
      var options = { headers: { "Content-Type": type } };
      fileName=`${params.imagetitle}-${uuid}${params.imageExtension}`;
      const s3Response = await axiosRequest.put(signedRequest, file,options);
      return { ...s3Response, fileName };
    }
    return response;
  } catch (error) {
    return error;
  }
}

async function getLeftSideBarListing(leftTab) {
  const permissionKey = {
  "movie": "movies",
  "video": "videos",
  "tvShow": "movies"
  };
  let menuItems = JSON.parse(JSON.stringify(LeftTabStatus))
    .filter((item => item.validFor ? !!item.validFor[leftTab] : false));
  menuItems.forEach(item => delete item.validFor);

  let dropdowns = JSON.parse(JSON.stringify(LeftTabDrpdown))
    .filter((item => item.validFor ? !!item.validFor[leftTab] : false));
  dropdowns.forEach(item => {
    item.permissionKey = permissionKey[leftTab];
    delete item.validFor
  });

  return { menuItems, dropdowns };
}

async function getReasonTypeMasterData() {
  const url = `${Config.masterReasonType}`;
  const response = await apiCalls(url, "GET", {}, null, false);
  let reason = [];
  if(response?.length) {
    reason = response.map(item => item?.title);
  }
  return reason;
}