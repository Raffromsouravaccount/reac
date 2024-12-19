import {
  constantText
} from "../../../_helpers/constants.text";

export const breadCrumbs = {
  links: (tvShowUrl, seasonUrl, tvShowId, seasonId) => [{
    color: 'inherit',
    text: constantText.placeholderConstant.dashboard,
    route: '/dashboard'
  },
  {
    color: 'inherit',
    text: constantText.placeholderConstant.shows,
    route: '/tvshow'
  },
  {
    color: 'inherit',
    text: constantText.placeholderConstant.tvShow,
    route: `/tvshow${tvShowUrl}/${tvShowId}`
  },
  {
    color: 'inherit',
    text: constantText.placeholderConstant.seasons,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season`
  },
  {
    color: 'inherit',
    text: constantText.placeholderConstant.season,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}`
  },
  {
    color: 'inherit',
    text: constantText.placeholderConstant.episode,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`
  }
],
  typography: [{
    color: 'textPrimary',
    text: constantText.placeholderConstant.placeholder
  }]
};

