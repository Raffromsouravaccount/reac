import React from 'react';
import { constantText } from "../../../_helpers/constants.text";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
const errorMsg = (list) => {
  return (
    <div className="file-table scrollBar scroll-X">
      <table>
        <tbody>
          {list && list?.length > 0 && list.map((item, index) => {
            return <tr key={index}>
              <td valign="top">
                {item?.row && <span><strong>Line :</strong> {item?.row} <br /></span>}
                <strong>{constantText.external_id_text} :</strong> {item?.externalId ? item?.externalId : 'NA'}
              </td>
              {item?.errors && <td valign="top">
                {Object.keys(item?.errors).map((key, index) => {
                  return <p key={index}> <strong>{key}</strong>: {item?.errors[key]}</p>
                })}
              </td>}
              {item?.message && !item?.errors && <td valign="top">
                <p > <strong>Error</strong>: {item?.message}</p>
              </td>}

            </tr>
          })}
          {!list?.length > 0 && <tr>
            <td colSpan={3}>
              <p >{constantText.bulksOpsConstant.noError }</p>
            </td>
          </tr>}
        </tbody>
      </table>
    </div>
  )
}

const ImportHistoryErrorList = (params) => {
  const list = params?.validation?.errors;
  const isValidationError=params?.validation?.status;
  const publishErrors=params?.publishErrors;
  let selectedTab=params?.selectedTab;
  
  const errorSectionsList=[];
  for(let key in list){
    if(Array.isArray(list[key])){
      let sectionObject={};
      sectionObject.label=key;
      sectionObject.list=list[key];
      errorSectionsList.push(sectionObject)
    }
  }
  return (
    <div className="whitebox">
      <div className="ccm-head flex align-items-center justify-content-between m-b-0">
        <div className="back-user-btn flex align-items-center">
          <span onClick={() => { params.backToHistory() }}><AngleLeftArrow /></span>
          <strong><span>{constantText.bulksOpsConstant.errorsSummary}</span></strong>
        </div>
        <BadgeBox className="s-badge red"
          status={'Invalid'}
        />


      </div>
      {isValidationError===0 && <div className="bulks-error-tab cr-mov-tab  p-b-30">
      <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={errorSectionsList}
          selectedTab={selectedTab} showIcon={false} handleChange={params.handleTab} />
      </div>}


      <div className=" m-b-20 p-all-15">
        {isValidationError===0 ? errorMsg(errorSectionsList[selectedTab]?.list) :errorMsg(publishErrors)}
      </div>
    </div>
  )
}
export default ImportHistoryErrorList;