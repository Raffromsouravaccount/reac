import React, { Component } from "react";
import { connect } from "react-redux";
//Helper Files
import { masterActions } from "../../../_actions/master.action";
import AudioIcon from "images/audio-icon.svg";

class ListLanguage extends Component {
  
  filterLanguages = () => {
    const { languageIds, audioLanguages } = this.props; 
    if (audioLanguages?.length && languageIds?.length) {
      let filteredArray = [];
      languageIds.forEach(el => {
        let index = audioLanguages?.findIndex(lang => lang?.id === el);
        if(index !== -1){
          filteredArray.push(audioLanguages[index]?.title);
        }
      });
      return filteredArray;
    } else {
      return [];
    }
  };
  render() {
    const ShowAudioLanguage = this.filterLanguages();
    const { togglePopup } = this.props;
    return (
      <span className="loc audio-sec">
        <AudioIcon />{" "}
        {ShowAudioLanguage?.length > 0
          ? ShowAudioLanguage?.length > 2
            ? ShowAudioLanguage[0] + ", " + ShowAudioLanguage[1]
            : ShowAudioLanguage.join(", ")
          : "NA"}
        {ShowAudioLanguage?.length > 2 ? (
          <a id="togglePopup" data-test = {`togglePopup`} onClick={() => togglePopup(ShowAudioLanguage, false)}>
            {` +${ShowAudioLanguage.length - 2}`}
          </a>
        ) : null}
      </span>
    );
  }
}
export default ListLanguage;
