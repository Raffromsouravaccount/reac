import React from "react";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";
import { dateDiffDayCount } from "../../../_helpers/util";

const licenseKey = {
  movies: "MovieLicenses",
  videos: "VideoLicenses",
  tvShows: "tvShowLicenses",
  season: "seasonLicenses",
  episode: "episodeLicenses"
};

const LicenseBadge = ({
  data,
  handleRouteExpiredLink = () => {}
}) => {
  let contentType = "",
    validUntil = "validUntil";
  if (data.MovieLicenses) {
    contentType = "movies";
  } else if (data.VideoLicenses) {
    contentType = "videos";
  } else if (data.tvShowLicenses) {
    contentType = "tvShows";
  } else if (data.seasonLicenses) {
    contentType = "season";
    validUntil = "valid_until";
  } else if (data.episodeLicenses) {
    contentType = "episode";
    validUntil = "valid_until";
  } else {
    return null
  }
  const canViewLicense = permissionObj[contentType]?.licenceModule?.canView();
  let licenceExpDays = [];
  if (data?.[licenseKey[contentType]]?.length > 0) {
    data?.[licenseKey[contentType]]?.forEach(licenceItem => {
      if (licenceItem?.[validUntil]) {
        let days = dateDiffDayCount(licenceItem?.[validUntil]);
        let signDays = Math.sign(days);
        let expDays = dateDiffDayCount(licenceItem?.[validUntil]) <= 5;
        if (signDays >= 0 && expDays) {
          licenceExpDays.push(days);
        }
      }
    });
  }
  return (
    licenceExpDays?.length > 0 && (
      <div
        className={
          canViewLicense
            ? "license-badge"
            : "license-badge tooltip-sec nopermission"
        }
      onClick={() =>
        canViewLicense
          ? handleRouteExpiredLink(data)
          : () => { }
      }
      >
        {Math.min.apply(null, licenceExpDays) === 0
          ? constantText.license_expires_today
          : `${constantText.license_expires_in}  ${Math.min.apply(
            null,
            licenceExpDays
          )}  ${constantText.day_s_text}`}
        {!canViewLicense ? (
          <div className="tooltip-box">
            {constantText?.tool_tip_noPermission}
          </div>
        ) : null}
      </div>
    )
  )
}
export default LicenseBadge;