import React from "react";
import ButtonField from '../ButtonField/ButtonField';
import './NoInternet.css';

function NoInternet() {
  return (
    <div className="no-internet c-n flex align-items-center">
      <div className="ze-pos flex-100">
        <div className="row align-items-center">
          <div className="col-md-6 ">
            <div className="con-wrap">
              <div className="title">Whoops!</div>
              <div className="text">
                No Internet connection found.<br />
                    Check your connection or try again.
                  </div>
              <ButtonField
                className="try-again"
                variant="contained"
                color="primary"
                buttonText='Try Again'
              />
            </div>
          </div>
          <div className="col-md-6">&nbsp;</div>
        </div>
      </div>
      <img className="bootom-img" src="images/role-management.svg" alt="img" />
    </div>
  );
}

export default NoInternet;
