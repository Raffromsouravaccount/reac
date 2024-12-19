import React from "react";
import CommingSoonImg from 'images/comming-soon.svg';
import './ComingSoon.css';

function ComingSoon() {
  return (
    <div className="coming-soon c-n flex align-items-center">
      <div className="flex-100">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="con-wrap">
              <div className="title">Coming Soon</div>
              <div className="text">
                We are working with your product to <br />
                    Provide seamless and best experience
                    </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="img-wrap">
              <CommingSoonImg />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
