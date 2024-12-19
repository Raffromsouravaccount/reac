import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

//Common Components
import Button from "../../Common/ButtonField/ButtonField";
import CheckBox from "../../Common/CheckBox/CheckBox";

import { constantText } from "../../../_helpers/constants.text";

//Icons
import TickIcon from "images/tick.svg";

const OtherLangModel = ({ className, state, languageList, keyText, selectedLang, selectLanguage, required,
  disabled, labelPlacement, showBtn1, btn1Text, btn1Action, showBtn2, btn2Text, btn2Action, handleClose }) => (

    <Dialog open={state} onClose={handleClose} className={className}>
      <DialogTitle>
        {constantText.translations.other_lang_text}
      </DialogTitle>

      <DialogContent>
        <div className="row">
          {languageList?.map((language, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3 lang-name">
              <CheckBox
                className="zee-checkbox-field"
                label={language[keyText]}
                labelPlacement={labelPlacement || "end"}
                handleCheckBox={() => selectLanguage(language, keyText)}
                checked={selectedLang?.includes(language[keyText])}
                required={required || false}
                disabled={disabled || false}
              />
              <div className="trans-status">
                <span className="inner">
                  <span className={(language?.translationStatus == 2) ? "completed" : ((language?.translationStatus == 1) ? 'partiallyDone' : "noTranslation")}>
                    &#x25CF;&nbsp;
                    {
                      (language?.translationStatus == null) ? constantText.castProfile.notCompleted : null
                    }
                    {
                      (language?.translationStatus !== null && language?.translationStatus == 0) ?
                      constantText.castProfile.notCompleted : null
                    }
                    {
                      (language?.translationStatus !== null && language?.translationStatus == 1) ?
                      constantText.castProfile.parCompleted : null
                    }
                    {
                      (language?.translationStatus !== null && language?.translationStatus == 2) ?
                      constantText.castProfile.completed : null
                    }
                    {(language?.translationStatus == 2) &&
                      <span className="mark-green flex align-items-center justify-content-center">
                        <TickIcon />
                      </span>
                    }
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      {(showBtn1 || showBtn2) &&
        <DialogActions>
          {showBtn1 &&
            <Button id="btn1ActionBtn" onClick={() => btn1Action(languageList)} buttonText={btn1Text} />
          }
          {showBtn2 &&
            <Button id="btn2ActionBtn" onClick={() => btn2Action(languageList)} buttonText={btn2Text} />
          }
        </DialogActions>
      }
    </Dialog>
  );

export default OtherLangModel;
