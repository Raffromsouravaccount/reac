import React from "react";

import ButtonField from '../ButtonField/ButtonField';
import { history } from '../../../_helpers/history';
import { constantText } from '../../../_helpers/constants.text';

//Icons
import Icon404 from 'images/404-icon.svg';

//Css
import './Page404.css';

function Page404() {
  return (
    <div className="page-404 c-n flex align-items-center">
      <div className="offset-md-3 col-md-6">
        <div className="con-wrap">
          <div className="icon"><Icon404 /></div>
          <div className="text">{constantText.internal_server_error}</div>
          <ButtonField
            className="back-btn" variant="contained" color="primary"
            buttonText={constantText.back_to_dashboard_text}
            onClick={()=> history.push('/dashboard')}
          />
          <div className="bottom-img">
            <img src="images/system-draw-icon.svg" alt="img" />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Page404;
