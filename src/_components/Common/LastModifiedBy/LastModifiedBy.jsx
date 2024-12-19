import React from 'react';
import moment from "moment";
import { constantText } from "../../../_helpers/constants.text";
export const LastModifiedBy = ({ data, statusText }) => {
    let name, id, lastModifiedOnDate, lastModifiedOnTime, modifiedByUsername;
    if (data?.modified_by?.firstName) { id = `${data?.modified_by?.id}`; name = `${data?.modified_by?.firstName} ${data?.modified_by?.lastName}` }
    if (data?.lastmodifiedby_populated?.first_name) { id = `${data?.lastmodifiedby_populated?.id}`; name = `${data?.lastmodifiedby_populated?.first_name} ${data?.lastmodifiedby_populated?.last_name}` }
    if (data?.modifiedBy_populated?.firstName) { id = `${data?.modifiedBy_populated?.id}`; name = `${data?.modifiedBy_populated?.firstName} ${data?.modifiedBy_populated?.lastName}` }
    if (data?.lastModifiedBy_populated?.first_name) { id = `${data?.lastModifiedBy_populated?.id}`; name = `${data?.lastModifiedBy_populated?.first_name} ${data?.lastModifiedBy_populated?.last_name}` }
    if (data?.lastModifiedByPopulated?.first_name) { id = `${data?.lastModifiedByPopulated?.id}`; name = `${data?.lastModifiedByPopulated?.first_name} ${data?.lastModifiedByPopulated?.last_name}` }
    if (data?.lastModifiedByUser?.first_name ){ id = `${data?.lastModifiedByUser?.id}`; name = `${data?.lastModifiedByUser?.first_name} ${data?.lastModifiedByUser?.last_name}` }
    if(data?.lastmodifiedon) {
        lastModifiedOnDate = data?.lastmodifiedon ? moment(data.lastmodifiedon).format(constantText.date_format_without_time) : "N/A"
        lastModifiedOnTime = data?.lastmodifiedon ? moment(data.lastmodifiedon).format(constantText.time_format_lt) : "N/A"
    } else {
        lastModifiedOnDate = data?.lastModifiedOn ? moment(data.lastModifiedOn).format(constantText.date_format_without_time) : "N/A"
        lastModifiedOnTime = data?.lastModifiedOn ? moment(data.lastModifiedOn).format(constantText.time_format_lt) : "N/A"
    }
    if (data?.modifiedByUsername && id == constantText.migrationUserId) { modifiedByUsername = ` (${data?.modifiedByUsername})` }
    return (
        <div className="status-text flex">
            <span className="label">{statusText || 'Last Modified By'}</span>
            <span className="text list-capitalize">
                <span className="mov-name"> {name || 'N/A'} {`${modifiedByUsername || ''}`}</span>
                <span className="mov-date">{lastModifiedOnDate}</span>
                <span className="mov-time">{lastModifiedOnTime}</span>
            </span>
        </div>
    )
};
