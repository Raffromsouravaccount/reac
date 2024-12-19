import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

//Common Components
import ButtonField from '../../../Common/ButtonField/ButtonField';
import FormRender from "../../../Common/FormHelper/FormRender";

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
    let { player, skip_song, handleChange, onBlur, selectedTab, setSelectDataArr, addRemoveSkipSong,
      handleTab, disabled, isSkipAvailable, error } = this.props;
    return (
      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12">
            <div className="row input-space-35">
              <FormRender
                form={player} serverCall={true} id='formRenderComp'
                onChange={(event, index) => handleChange(event, null, index, 'player')}
                handleBlur={onBlur}
                isDisable={disabled}
                isSkipAvailable={isSkipAvailable}
                setSelectDataArr={(value, index) => setSelectDataArr('player', null, index, value)}
              />
            </div>
          </div>
        </div>
        <div className="whitebox m-b-30">
          <div className="ccm-head flex align-items-center justify-content-between m-b-30">
            <h4>{constantText.skip_song_text}</h4>
          </div>
          <div className="col-12">
            <div className="global-wrap">
              {skip_song?.map((skip_songArr, skip_song_index) => (
                <div className="global-row" key={skip_song_index}>
                  <div className="add-plush-row top-title">
                    <div className="top-text">{`${constantText.skip_song_text_set} ${skip_song_index >= 0 ? ` - ${skip_song_index + 1}` : ''}`}</div>
                    <div className="add-another-f-btn create-btn">
                      <div className={`${skip_song_index > 0 ? `remove-btn auto-delete-${skip_song_index}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                        id="addRemoveMultipleFieldsBtn" disabled={disabled || !isSkipAvailable}
                        onClick={() => addRemoveSkipSong(skip_song_index)}>
                        <span className="plush-icon-btn"></span>
                      </div>
                    </div>
                  </div>
                  <div className="row input-space-35">
                    <FormRender
                      form={skip_songArr} serverCall={true}
                      groupIndex={skip_song_index} id="skipFormRender"
                      onChange={(event, index) => handleChange(event, skip_song_index, index, 'skip_song')}
                      handleBlur={onBlur}
                      isDisable={disabled}
                      isSkipAvailable={isSkipAvailable}
                      setSelectDataArr={(value, index) => setSelectDataArr('skip_song', skip_song_index, index, value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="whitebox">
          <div className="prev-next-wrap flex align-items-center">
            <div className="prev-step-btn" onClick={event => handleTab(event, selectedTab - 1)}>
              <AccordianNormal /> {constantText.previous_text}
            </div>
            <div className="next-step-btn" onClick={event => handleTab(event, selectedTab + 1)}>
              {constantText.next_text} <AccordianNormal />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default PlayerAttributes;
