import React from "react";
import Icon401 from 'images/401-icon.svg';
import './NoPermission.css';

const NoPermission= ()=> {
  return (
    <div className="no-permission c-n flex align-items-center">
      <div className="offset-md-3 col-md-6">
        <div className="con-wrap">
          <div className="icon"><Icon401 /></div>
          <div className="text">
          You don’t have permission of this page. <br />Please contact system admin
          </div>          
          <div className="bottom-img">
            <img src="images/system-draw-icon.svg" alt="img" />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default NoPermission;
