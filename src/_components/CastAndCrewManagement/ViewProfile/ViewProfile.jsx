import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';

//Common Components
import ButtonField from '../../Common/ButtonField/ButtonField';
import BadgeBox from "./../../Common/BadgeBox/BadgeBox";

//Helper files
import Config from "../../../Config/config";
import { apiCalls } from "../../../_services/common.service";
import { history } from '../../../_helpers/history';
import { permissionObj } from '../../../_helpers/permission';

//Css
import './ViewProfile.css';
import { constantText } from '../../../_helpers/constants.text';

class ViewProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      castProfileId: "", profileData: {}, imageData: {}, stage: ""
    }
  }

  componentDidMount = () => {
    let { castProfileId } = this.props;
    if (castProfileId) {
      this.setState(prevState => ({ castProfileId }), () => this.getProfileData());
    }
  }

  getProfileData = async () => {
    let { castProfileId } = this.state;
    const response = await apiCalls(`${Config.createProfileUrl}/${castProfileId}`, "GET");
    if (response) {
      let { contentState, castProfileImage } = response;
      this.props.getExternalId(response?.externalId)
      this.setState(prevState => ({
        profileData: response,
        imageData: castProfileImage || null,
        stage: contentState?.title || "",
        externalId:response?.externalId
      }));
    }
  }

  handleRoute = route => {
    history.push(route);
  }

  render() {
    const { profileData, imageData, castProfileId, stage,externalId } = this.state
    let { canUpdate } = permissionObj?.cast?.profile;
    return (
      <div className="view-profile-page">
        <div className="whitebox">
          <div className="ccm-head flex align-items-center justify-content-between">
            <h4>{constantText.profile_details_text}</h4>
            <div className="status-head flex align-items-center">
              <BadgeBox status={stage} />
              <div className="edit-btn">
                {
                  (stage !== constantText.castProfile.archived) ?
                  <ButtonField
                    disabled={!canUpdate()}
                    buttonText={"Edit Profile"} className="zee-btn-field zee-full MuiButton-containedPrimary"
                    onClick={() => canUpdate()? this.handleRoute(`/cast/edit/${castProfileId}`): ""}
                  />
                  : null
                }
              </div>
            </div>
          </div>
          <div className="view-profile-desc flex">
            <div className="view-figure">
              <figure><img src={imageData?.url ? `${Config.imageBaseUrl}${externalId}/${constantText.castProfileImage}/${imageData?.url}` : "images/no-image-icon.svg"} /></figure>
            </div>
            <div className="profile-desc">
              <div className="profile-desc-list flex">
                <div className="label">Profile Name</div>
                <div className="text-val"><strong>{profileData.castName || "NA"}</strong></div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Also Known as</div>
                <div className="text-val"><strong>{profileData.castKnownAs || "NA"}</strong></div>
              </div>

              <div className="profile-desc-list flex">
                <div className="label">Tag / Badge</div>
                <div className="text-val">
                  <strong> {profileData?.castTag?.map(item => (item?.title)).join(', ') || "NA"}</strong>
                </div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Cast Type</div>
                <div className="text-val">
                  <strong> {profileData?.castType?.map(item => (item?.title)).join(', ') || "NA"}</strong>
                </div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Birthday</div>
                <div className="text-val">
                  <strong>{profileData?.castBirthday ? moment(profileData?.castBirthday).format("DD-MMM-YYYY") : "NA"}</strong>
                </div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Birthplace</div>
                <div className="text-val"><strong>{profileData.castBirthPlace || "NA"}</strong></div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Career</div>
                <div className="text-val"><strong>{profileData.castCareer || "NA"}</strong></div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Awards & Notification</div>
                <div className="text-val"><strong>{profileData.castAwards || "NA"}</strong></div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Trivia</div>
                <div className="text-val"><strong>{profileData.castTrivia || "NA"}</strong></div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Background</div>
                <div className="text-val"><strong>{profileData.castBackground || "NA"}</strong></div>
              </div>
              <div className="profile-desc-list flex">
                <div className="label">Profile Bio</div>
                <div className="text-val">
                  <div dangerouslySetInnerHTML={{ __html: profileData.castProfileBio || "NA" }} />
                </div>
              </div>

            </div>
          </div>
        </div>
        {(profileData?.castRelationship?.length > 0) &&
          <div className="whitebox">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>Relations</h4>
            </div>
            <div className="relation-block">
              <div className="scrollBar scroll-X">
                <div className="p-b-10">
                  <div className="relation-list">
                    <span>Related To</span>
                    {profileData.castRelationship.map((item, index) =>
                      <strong key={index}>{item?.castName || "NA"}</strong>
                    )}
                  </div>
                  <div className="relation-list">
                    <span className="padd-bott0">Relation</span>
                    {profileData.castRelationship.map((item, index) =>
                      <strong key={index}>{item?.relationTitle || "NA"}</strong>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div >
    )
  }
}

export { ViewProfile }
export default connect(null, {})(ViewProfile)
