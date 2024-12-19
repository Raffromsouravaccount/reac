import React from 'react'

//Images
import MarkDone from "images/tick.svg";
import { constantText } from '../../../_helpers/constants.text';


const MarkAsDone = ({ handleMarkAsDone, state, isLocked }) => {
    const isLockClass = isLocked ? 'disabled' : '';
    return  (
        <div className={state === 2 ? `mark-done mark-fill-active auto-mark-done ${isLockClass}` : state === 3 ? `mark-done mark-active auto-mark-done ${isLockClass}` : `${isLockClass} mark-done auto-mark-done `}
            id="markAsDoneBtn" onClick={() => state === 2 ? handleMarkAsDone(3) : ''}>
            <span> <MarkDone /> </span> {constantText.mark_as_done_text}
        </div>
    );
};

export default MarkAsDone;