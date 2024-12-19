import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// import './Model.css';
import { constantText } from "../../../_helpers/constants.text";
import { connect } from "react-redux";
import CheckBox from "../../Common/CheckBox/CheckBox";
import Config from "../../../Config/config";

//svg
import TickIcon from "images/tick.svg";

class OtherLangDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageList: [],
    };
  }

  componentDidMount() {
    const languageList = JSON.parse(JSON.stringify(this.props.languageList));
    const filterList = languageList.length && languageList.filter((item) => item.code != Config.defaultLanguageCode) || [];
    const assignLang = [...this.props.languages];
    const myArrayFiltered  = filterList.map((el) => {
      const temp = assignLang.find((f) => f.code === el.code);
      if(temp) {
        el['display'] = false; 
      } else {
        el['display'] = true; 
      }
      return el;
    });
    this.setState({ languageList: myArrayFiltered });
  }

  onLanguageSelectionFromDialog = (i) => {
    const languageList = this.state.languageList;
    const currentState = languageList[i]["selectedFromDialog"] || false;
    languageList[i]["selectedFromDialog"] = currentState ? !currentState : true;
    languageList[i]["label"] = languageList[i]["title"];
    this.setState({ languageList });
  };

  render() {
    let { state, className, btn1Action, btn2Action, handleClose } = this.props;
    const { languageList } = this.state;
    return (
      <Dialog open={state} onClose={handleClose} className={className}>
        {
          <DialogTitle>
            {constantText.translations.other_lang_text}
          </DialogTitle>
        }

        <DialogContent>
          <div className="row">
            {languageList &&
              languageList.map((language, index) => (
                language.display && <div key={index} className="col-6 col-md-4 col-lg-3 lang-name">
                  <CheckBox
                    key={index}
                    className={`zee-checkbox-field auto-${language?.title ? language?.title.split(" ").join(""):""}-${index}`}
                    label={language?.title}
                    // name={key}
                    handleCheckBox={(e) =>
                      this.onLanguageSelectionFromDialog(index)
                    }
                    // disabled={isDisable}
                    // labelPlacement={form?.labelPlacement}
                    checked={languageList[index].selectedFromDialog || false}
                    required={false}
                  />
                  <div className="trans-status">
                    <span className="inner">
                      { language && (String(language?.translationStatus) && language?.translationStatus == "2") && 
                        <span className="completed">
                          &#x25CF;&nbsp; {constantText.translations.completed_text}
                          <span className="mark-green flex align-items-center justify-content-center">
                            <TickIcon />
                          </span>
                        </span>
                      }
                      { language && (String(language?.translationStatus) && language?.translationStatus == "1") && <span className="partiallyDone">&#x25CF;&nbsp; {constantText.translations.partially_done_text}</span>}
                      { language && (!language?.translationStatus || language?.translationStatus == "0") && <span className="noTranslation">&#x25CF;&nbsp; {constantText.translations.no_translation_text}</span>}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          {
            <Button className="auto-button-Yes" onClick={() => btn1Action(languageList)}>
              {constantText.translations.other_lang_popup_btn_1_text}
            </Button>
          }
          {
            <Button className="auto-button-No" onClick={btn2Action}>
              {constantText.translations.other_lang_popup_btn_2_text}
            </Button>
          }
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(null, {})(OtherLangDialog);
