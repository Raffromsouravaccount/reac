import React from 'react';
import { constantText } from '../../../_helpers/constants.text';
import { getStageColour } from '../CommonFunction/CommonFuntion';

const BadgeBox = ({ className, icon, status = "", color = "", dot = false }) => {
    if (status) {
        let cls = `s-badge${dot ? ' dot-badge' : ''}`;
        className ? (cls = cls + ` ${className}`) : '';
        const badge = status?.toLowerCase()?.split(" ")?.join("_");
        return (
            <div className={cls + (` ${color || getStageColour(status)}`)}>
                {icon ? icon : ''} {constantText.status_txt[badge] || status}
            </div>
        )
    }
    return null;
};
export default BadgeBox;