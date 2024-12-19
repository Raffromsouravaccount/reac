import React from "react";
import swal from "@sweetalert/with-react";

import { history } from "../_helpers/history";
import { constantText } from "../_helpers/constants.text";
import Config from "../Config/config";

export const showSuccessErrorMsg = async (title, text, icon, error, successRoute, failureRoute, callBack=null) => {
  let value = await swal(
    <div>
    <div className="swal-header"><h2>{icon}</h2></div>
     {(title && title.length >0) && <div className="swal-mid-content"><p>{title}</p> </div>}
    <div className="icon-block">{icon}</div>
   </div>);
  if (value) {
    if(callBack) {
      callBack();
    }
     if(text==='imageEdit') {
      successRoute('create')
     }
     else if(text==='importFile'){
      successRoute('importFile')
     }
     else if(text==='exportFile'){
      successRoute('exportFile')
     }
     else if(text?.type===constantText.bulksOpsConstant?.successRoutePathKey){
       let url=`${Config?.bulkUpdate?.jobIdHistory}/${text?.jobId}`
      successRoute(url)
     }
     else {
      if (error && failureRoute) {
        failureRoute= (title == constantText.permission_msg)? "/": (title == constantText.no_permission)?
          "/permission": failureRoute;
        history.push(failureRoute);
      }
      else if (successRoute) {
        history.push(successRoute);
      }
    }
  }
};
