import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//Helper files
import { constantText } from "../../../_helpers/constants.text";
import { getLocalData } from "../../../_helpers/util";
import { permissionObj } from '../../../_helpers/permission';

//Actions
import { castCrewMgmtActions } from "../../../_actions/castCrewMgmt.action";

//Services
import { get_cast_crew } from "./../../../_services/movie.service";

//Common
import ViewDetails from "../../Common/ViewDetail/ViewDetails";
import { removeAllDynamicAddfields } from "./../../Common/CommonFunction/CommonFuntion";
import ButtonField from "../../Common/ButtonField/ButtonField";

// CSS
import "../../../../public/css/Common/CastNCrew.css";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

class ViewCastAndCrew extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    const {actors, others}= jsonData;
    this.state = {
      movieId: null,
      language: "",
      stage: {title: "Draft"},
      actors: JSON.parse(JSON.stringify(actors)),
      others: JSON.parse(JSON.stringify(others)),
      castList: [],
    };
  }

  populateDataToState = (castCrewData, userID) => {
    const othersAttributes = [...this.state.others.attributes];
    let actorsAttributes = [...this.state.actors.attributes];
    //populating others
    othersAttributes.map((item) => {
      if (castCrewData.hasOwnProperty(item.name)) {
        item.value = castCrewData[item.name];
      }
      return item;
    });

    // populating actors
    if (castCrewData.hasOwnProperty(this.state.actors.name)) {
      actorsAttributes = castCrewData[this.state.actors.name].map((item) => {
        const actor = {
          actor: { ...actorsAttributes[0]["actor"] },
          character: { ...actorsAttributes[0]["character"] },
        };
        actor.actor.value = item.actor || null;
        actor.character.value = item.character;
        return actor;
      });
    }
    // update state
    this.setState((prevState) => {
      return {
        actors: {
          ...prevState.actors,
          attributes: [...actorsAttributes],
        },
        others: {
          ...prevState.others,
          attributes: [...othersAttributes],
        },
      };
    });
  };

  componentDidMount() {
    let { movieId, language, stage } = this.props;
    const requestParams = {
      movieId,
      language,
    };
    this.setState(
      (prevState) => ({ movieId, language, stage }),
      async () => {
        await this.props.getCastList();
        const castAndCrew = await get_cast_crew(requestParams);

        if (castAndCrew) {
          const { userID } = getLocalData("userData");
          this.populateDataToState(castAndCrew, userID);
        }
      }
    );
  }

  // It does some cleaning when component unmounts to free some RAM
  componentWillUnmount() {
    removeAllDynamicAddfields(this.state);
  }

  render() {
    let { movieId, actors, others } = this.state;
    let { handleRoute, stage } = this.props;

    if (!movieId) {
      return null;
    }
    let { canUpdate }= permissionObj?.movies?.castNCrewModule;

    return (
      <div className="create-movie">
        <div className="whitebox">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4>{constantText.cast_crew_text}</h4>
            <div className="status-head flex align-items-center">
              {stage?.title && <BadgeBox className="create-movie-stage" status={stage?.title} />}
              <div className="edit-btn">
                <ButtonField
                  disabled={!canUpdate()}
                  className="zee-btn-field zee-full MuiButton-containedPrimary"
                  buttonText={constantText.edit_movie_text}
                  onClick={() => canUpdate()? handleRoute(`/movie/edit/${movieId}`): ""}
                />
              </div>
            </div>
          </div>
          <div className="movieForm-tab">
            <div className="movie-f-wrap col-12">
              {actors?.attributes?.map((data, index) => (
                <Fragment key={index}>
                  <ViewDetails allData={[data.actor]} />
                  <ViewDetails allData={[data.character]} />
                </Fragment>
              ))}
              <ViewDetails allData={others.attributes} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ViewCastAndCrew.propTypes = {
  movieId: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => {
  let castData = state.castCrewMgmt_reducer;
  return {
    castData,
  };
};
const actionCreators = {
  getCastList: castCrewMgmtActions.get_castList_action,
};

export default connect(mapStateToProps, actionCreators)(ViewCastAndCrew);
