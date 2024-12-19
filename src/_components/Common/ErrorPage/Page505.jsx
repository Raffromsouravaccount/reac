import React from "react";
import ButtonField from '../ButtonField/ButtonField';
import Icon505 from 'images/505-icon.svg';
import './Page404.css';

function Page505() {
  return (
    <div className="page-404 c-n flex align-items-center">
      <div className="offset-md-3 col-md-6">
        <div className="con-wrap">
          <div className="icon"><Icon505 /></div>
          <div className="text">
            INTERNAL SERVER ERROR
          </div>
          <ButtonField
            className="back-btn"
            variant="contained"
            color="primary"
            buttonText='Back to Dashboard'
          />
          <div className="bottom-img">
            <img src="images/system-draw-icon.svg" alt="img" />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Page505;
