import React from 'react';
import Divider from "@material-ui/core/Divider";
import { constantText } from "../../../_helpers/constants.text";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import LeftTab from '../../Common/LeftTab/CommonLeftTab';

import '../../../../public/css/Common/BulkOps.css';


const errorMsg = (list) => {
  return (
    <div className="file-table scrollBar scroll-X">
      <table className="table-full-width">
        <tbody>
          {list && list?.length > 0 && list.map((item, index) => {
            return <tr key={index}>
              <td valign="top">
                <Divider className="devider-margin" />
                {item?.folder && <span><strong>{constantText.bulksOpsConstant.folder} :</strong> {item?.folder} <br /></span>}
                <Divider className="devider-margin" />
                {
                  item?.errors?.length > 0 &&
                  <table className="table-full-width">
                    {
                      item?.errors.map((errorItem, errorIndex) => {
                      return (<tr key={errorIndex}>
                          <td>
                            <strong>{constantText.bulksOpsConstant.file}:</strong> <br/>
                            {errorItem.file}
                          </td>
                          <td>
                            <strong>{constantText.bulksOpsConstant.error}:</strong> <br/>
                            {errorItem.error}
                          </td>
                        </tr>)
                      })
                    }
                  </table>
                }
              </td>
              <td valign="top">
                <Divider className="devider-margin" />
                  <strong>{constantText.bulksOpsConstant.folderError}: </strong> {item?.folderError || 'NA'}
                <Divider className="devider-margin" />
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

const ImageErrors = (params) => {
  const list = params?.validation?.errors.image;
  const isValidationError=params?.validation?.status;
  const publishErrors=params?.publishErrors;
  let selectedTab=params?.selectedTab;

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
      <div className=" m-b-20 p-all-15">
        {isValidationError===0 ? errorMsg(list) : errorMsg(list)}
      </div>
    </div>
  )
}
export default ImageErrors;