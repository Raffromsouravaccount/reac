import React, { Fragment } from "react";
import PropTypes from "prop-types";

//Common Components
import Button from "../ButtonField/ButtonField";
import LeftTab from "../LeftTab/CommonLeftTab";

//Helper files
import { constantText } from "../../../_helpers/constants.text";

//Icons
import MarkDone from "images/tick.svg";

const QuickLink = ({ translationDone, assignedLang, keyText, relatedContentDone, collectionAssignmentDone,
  showHideOtherLangModel, showReviewButton, disableReviewButton, submitToReviewAction, showTranslation,
  showRelatedContent, showCollectionAssignment, status, canPublish, showTabs = false, tabOptions, selectedTab, tabHandlerChange, getStatusTabData, tableTitle = null }) => {
  return (
    <Fragment>
      <div className="box-sec m-b-30">
        <div className="ccm-head flex align-items-center justify-content-between">
          <h4>{constantText.quick_links_text}</h4>
        </div>
        <div className="checklist-box">
          <ul>
            {showTranslation &&
              <li className={translationDone ? "checklist-done" : ""}>
                <span className="tick-icon">
                  <MarkDone />
                </span>
                <h6>{constantText.translation_text}</h6>
                <p>{`${translationDone ? constantText.details_full_done_text : constantText.section_not_mark_as_done_text} `}
                  <a className="auto-viewStaus" onClick={showHideOtherLangModel}>{constantText.view_status_of_other_lang_text}</a>
                </p>
                {(assignedLang?.length > 0) &&
                  <div className="lang-st-table">
                    <table>
                      <thead>
                        <tr>
                          <th>{constantText.assigned_lang_text}</th>
                          <th>{constantText.status}</th>
                          <th>{constantText.mark_as_done_text}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedLang?.map((data, index) => (
                          <tr key={index}>
                            <td>{data?.[keyText]}</td>
                            <td>
                              {
                                (data.translationStatus == null) ? constantText.castProfile.notCompleted : null
                              }
                              {
                                (data.translationStatus !== null && data.translationStatus == 0) ?
                                constantText.castProfile.notCompleted : null
                              }
                              {
                                (data.translationStatus !== null && data.translationStatus == 1) ?
                                constantText.castProfile.parCompleted : null
                              }
                              {
                                (data.translationStatus !== null && data.translationStatus == 2) ?
                                constantText.castProfile.completed : null
                              }
                            </td>
                            <td>{data.isDone ? constantText.yes_text : constantText.no_text}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              </li>
            }
            {showRelatedContent &&
              <li className={relatedContentDone ? "checklist-done" : ""}>
                <span className="tick-icon">
                  <MarkDone />
                </span>
                <h6>{constantText.related_content_text}</h6>
                <p>{relatedContentDone ? constantText.details_full_done_text : constantText.section_not_mark_as_done_text}</p>
              </li>
            }
            {/* {showCollectionAssignment &&
              <li className={collectionAssignmentDone ? "checklist-done" : ""}>
                <span className="tick-icon">
                  <MarkDone />
                </span>
                <h6>{constantText.collection_assignment_text}</h6>
                <p>{collectionAssignmentDone ? constantText.details_full_done_text : constantText.section_not_mark_as_done_text}</p>
              </li>
            } */}
          </ul>
          {
            showTabs &&
            <div className="cr-tvshows-tab">
              { tableTitle && <h6>{tableTitle}</h6>}
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable"
                options={tabOptions} selectedTab={selectedTab}
                showIcon={false} defaultPermission={true} handleChange={tabHandlerChange} />
                <div className="lang-st-table table-100 p-all-10">
                  {getStatusTabData}
                </div>
            </div>
          }
        </div>
      </div>
      {(showReviewButton && (status === constantText.collectionConstants.draft || status === constantText.collectionConstants.needWork || status === constantText.collectionConstants.changed)) &&
        <div className="row">
          <div className="col-md-6">
            <Button className="zee-btn-field zee-full" variant="contained" color="primary"
              disabled={disableReviewButton}
              buttonText={constantText.submit_to_review_text}
              onClick={submitToReviewAction}
            />
          </div>
        </div>
      }
    </Fragment>
  );
}

QuickLink.defaultProps = {
  showReviewButton: true,
  disableReviewwButton: false,
  showTranslation: false,
  showRelatedContent: false,
  showCollectionAssignment: false,
  assignedLang: []
}

QuickLink.propTypes = {
  showReviewButton: PropTypes.bool,
  disableReviewwButton: PropTypes.bool,
  showTranslation: PropTypes.bool,
  showRelatedContent: PropTypes.bool,
  showCollectionAssignment: PropTypes.bool,
  assignedLang: PropTypes.array,
  keyText: PropTypes.string.isRequired,
  translationDone: PropTypes.bool,
  relatedContentDone: PropTypes.bool,
  collectionAssignmentDone: PropTypes.bool,
  showHideOtherLangModel: PropTypes.func.isRequired,
  submitToReviewAction: PropTypes.func
};

export default QuickLink;
