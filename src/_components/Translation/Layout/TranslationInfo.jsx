import React from "react";
import { constantText } from "../../../_helpers/constants.text";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import MarksAsDone from "../../Common/MarkAsDone/MarkAsDone";

//Images

const TranslationInfo = ({ sections, selectedSecTab, handleSecTab, status, markAsDone, handleMarkAsDone, permissionAddEdit, isLocked, permissionViewOnly, showNavToAssignedLang }) => {
    let sectionText = '', profileClass;
    if(sections[selectedSecTab].url === 'profile') {
        sectionText = constantText.translations.section_text;
        profileClass = 'profileClass';
    } else {
        sectionText = constantText.translations.select_sec_text;
        profileClass = ''
    }
    return (
        <div className="ccm-head lang-head flex align-items-center justify-content-between m-b-0">
            <div className="flex align-items-center">
                <div className={`text ${profileClass}`}>
                    { sectionText }
                </div>
                <LeftTab
                    className="tabs"
                    orientation="horizontal"
                    variant="scrollable"
                    options={sections}
                    selectedTab={selectedSecTab}
                    showIcon={false}
                    handleChange={handleSecTab}
                />
            </div>
            <div className="status-head flex align-items-center">
                { status == "2" && <div className="lang-status completed">&#x25CF;&nbsp; {constantText.translations.completed_text}</div> }
                { status == "1" && <span className="lang-status partiallyDone">&#x25CF;&nbsp; {constantText.translations.partially_done_text}</span>}
                { status == "0" && <span className="lang-status noTranslation">&#x25CF;&nbsp; {constantText.translations.no_translation_text}</span>}
                { permissionAddEdit && <div className="autosave">{constantText.all_fields_auto_save_text}</div> }
                {/* <div className="mark-done" onClick={handleMarkAsDone}>
                    <span> <MarkDone /> </span> {constantText.mark_as_done_text}
                </div> */}
                { <MarksAsDone 
                    handleMarkAsDone={() => handleMarkAsDone(selectedSecTab)}
                    state={markAsDone || 1}
                    isLocked = {isLocked || showNavToAssignedLang}
                /> }
            </div>
        </div>
    );
};

export default TranslationInfo;
