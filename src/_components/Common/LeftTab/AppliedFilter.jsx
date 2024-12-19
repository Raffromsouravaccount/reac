import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { constantText } from '../../../_helpers/constants.text';


const AppliedFilter = ({ className, options, listCount }) => (
    <div className="mov-ap-filter-wrap flex whitebox">
        <div className="l-sec flex align-items-center">
            {constantText.applied_filters_text}
        </div>
        <Tabs
            className={className}
            orientation={'horizontal'}
            variant={'scrollable'}
            value={0}
        >{options?.map((option, index) => {
            return (
                <Tab
                    key={index}
                    className="applied-filter-button"
                    disabled={true}
                    label={`${option?.label} - ${option?.value}`}
                />
            )
        })}
        </Tabs>
        <div className="r-sec flex align-items-center">
            <div className="total w-100">
                {constantText.result_text}<br /><strong>{listCount}</strong>
            </div>
        </div>
    </div>


);
export default AppliedFilter;