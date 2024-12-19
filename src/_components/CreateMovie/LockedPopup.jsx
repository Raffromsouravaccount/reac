import React from 'react';

//Common Components
import { CommonModel } from "../Common/Model/CommonModel";

//Helper files
import { constantText } from '../../_helpers/constants.text';

//Icons
import LockIcon from "images/lock-icon.svg";

const LockedPopup = ({ className, state, lockedBy, doneAction, cancelAction }) => (
  <CommonModel
    className={className}
    state={state}
    showTitle={true}
    title={constantText.unlock_title_text}
    showIcon={true}
    icon={<LockIcon />}
    showDes={true}
    des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
    showBtn1={true}
    btn1Text={constantText.yes_text}
    btn1Action={doneAction}
    showBtn2={true}
    btn2Text={constantText.no_text}
    btn2Action={cancelAction}
    handleClose={cancelAction}
  />
);

export default LockedPopup;
