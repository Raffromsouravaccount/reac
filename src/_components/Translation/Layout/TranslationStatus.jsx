import React from "react";

//svg
import TickIcon from "images/tick.svg";
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";

const TranslationStatus = ({ languageList, onClick, handleLanguageIcon }) => {
  const filterList = languageList.length && languageList.filter((item) => item.code != Config.defaultLanguageCode) || [];
  return (
    <div className="row">
      {filterList && filterList.map((language, index) => 
    
          { return language && <div key={index} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <div className={`listBox lang-list auto-${language?.title ? language?.title.split(" ").join(""):""}-${index}`} onClick={() => onClick(language)}>
            { language && (language?.isDone) &&
              <span className="mark-done-circle flex align-items-center">
                <span className="mark-green flex align-items-center justify-content-center">
                  <TickIcon />
                </span>
                Mark as Done
              </span>
            }
              <div className="icon">
                <img src={language && language?.image ? language?.image : handleLanguageIcon(language)} />
              </div>
              <div className="lang-name">{language?.title}</div>
              { language && (String(language?.translationStatus) && language?.translationStatus == "2") && <div className="lang-status completed">&#x25CF;&nbsp; {constantText.translations.completed_text}</div> }
              { language && (String(language?.translationStatus) && language?.translationStatus == "1") && <span className="lang-status partiallyDone">&#x25CF;&nbsp; {constantText.translations.partially_done_text}</span>}
              { language && (!language?.translationStatus || language?.translationStatus == "0") && <span className="lang-status noTranslation">&#x25CF;&nbsp; {constantText.translations.no_translation_text}</span>}
            </div>
          </div> }
        )}
    </div>
  );
};

export default TranslationStatus;
