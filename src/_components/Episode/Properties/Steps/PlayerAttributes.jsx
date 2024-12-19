import React, { Component } from 'react';

//Common Components
import ViewSeason from "../../../Common/ViewDetail/ViewSeason";

//Helper files
import { constantText } from '../../../../_helpers/constants.text';

//images
import AccordianNormal from "images/arrow-icon.svg";

//css
import '../../../../../public/css/Common/GlobalField.css';

class PlayerAttributes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { player, skipSong, handleChange, selectedTab, setSelectDataArr, handleTab, disabled,
      addRemoveMultipleFields, handleEditable, handleSave, viewOnly } = this.props;
    return (
      <div className="movie-f-wrap">
        {player &&
          <div className="whitebox m-b-30">
            <div className="col-12">
              <div className="row input-space-35">
                <ViewSeason allData={player} id="viewSeason"
                  onChange={(event, index) => handleChange(event, null, index, 'player')}
                  updateData={index => handleSave(null, index, 'player')}
                  setSelectDataArr={(value, index) => setSelectDataArr('player', null, index, value)}
                  callBack={index => handleEditable(null, index, 'player')}
                  viewOnly={viewOnly} isDisable={!!disabled}
                />
              </div>
            </div>
          </div>
        }
        {(skipSong && skipSong.length > 0) &&
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>{constantText.skip_song_text}</h4>
            </div>
            <div className="col-12">
              <div className="global-wrap">
              {skipSong?.map((skipSongArr, skipSongIndex) => (
                <div className="global-row" key={skipSongIndex}>
                  <div className="add-plush-row top-title">
                      <div className="top-text">{`${constantText.skip_song_text_set} ${skipSongIndex >= 0 ?
                        ` - ${skipSongIndex + 1}` : ''}`}</div>
                      <div className="add-another-f-btn create-btn">
                        <div className={`${skipSongIndex > 0 ? `remove-btn auto-delete-${skipSongIndex}` :
                          'auto-button-add'} add-btn-field flex align-items-center`}
                          id="addRemoveMultipleFieldsBtn" onClick={disabled ? () => { } :
                            () => addRemoveMultipleFields("skipSong", skipSongIndex > 0 ? skipSongIndex : null)}>
                          {!viewOnly && <span className="plush-icon-btn"></span>}
                        </div>
                      </div>
                    </div>
                  <div className="row input-space-35">
                    <ViewSeason allData={skipSongArr} id="skipFormRender"
                      onChange={(event, index) => handleChange(event, skipSongIndex, index, 'skipSong')}
                      updateData={index => handleSave(skipSongIndex, index, 'skipSong')}
                      selectGroup={(event, group, index) => selectGroup(event, group, skipSongIndex, index, 'skipSong')}
                      setSelectDataArr={(value, index) => setSelectDataArr('skipSong', skipSongIndex, index, value)}
                      callBack={index => handleEditable(skipSongIndex, index, 'skipSong')}
                      viewOnly={viewOnly} isDisable={!!disabled}
                    />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        }

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            <div className="prev-step-btn" onClick={event => handleTab(event, selectedTab - 1)}>
              <AccordianNormal /> {constantText.previous_text}
            </div>
            <div className="next-step-btn" onClick={event => handleTab(event, selectedTab + 1)}>
              {constantText.next_text}<AccordianNormal />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlayerAttributes;
