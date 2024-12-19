import React from 'react';

//Helper files
import { permissionObj } from "../../../_helpers/permission";

import LightTransIcon from "images/light-transparent-icon.svg";

const QuickLinks = ({ className, header_text, options, showTips, clicked, customText = null }) => {
  return (
    <div className={`whitebox ${className}`}>
      <div className="quick-link-widget">
        <h4>{header_text}</h4>
        <ul>
          {options?.map((data, index) => {
            let { permissionKey, permissionSubKey, permissionName } = data;
            let ifHavePermission = permissionKey ? permissionSubKey ?
              permissionObj?.[permissionKey]?.[permissionSubKey]?.[permissionName]() :
              permissionObj?.[permissionKey]?.[permissionName]() : true;
            if (data?.visible) {
              return (
                <li key={index}
                  className={ifHavePermission ? `auto-quickLinks-${data?.text ? data?.text.split(" ").join("") : ""}` : `disable-f-btn auto-quickLinks-${data?.text ? data?.text.split(" ").join("") : ""}`}
                  onClick={() => {ifHavePermission && clicked(data)}}>
                  <span className="link-icon flex align-items-center justify-content-center">
                    {<data.icon />}
                  </span>
                  {data.text}
                </li>
              )
            }
          })
          }
          {!!showTips &&
            <li className="tip-data">
              <span className="link-icon flex align-items-center justify-content-center"><LightTransIcon /></span>
              Tips
              <p className="tip-text">
                {
                  customText ?
                  customText
                  : "You can convert this page to Main Movie Page on Editing."
                }
                </p>
            </li>
          }
        </ul>
      </div>
    </div>
  );
}

export default QuickLinks;
