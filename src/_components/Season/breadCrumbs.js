import { constantText } from "../../_helpers/constants.text";

export const breadCrumbs = {
  links: (url, tvShowId) => [{
    color: 'inherit',
    text: constantText.dashBoard_text,
    route: '/dashboard'
  },
  {
    color: 'inherit',
    text: constantText.tv_show_text.title,
    route: '/tvshow'
  },
  {
    color: 'inherit',
    text: constantText.tv_show_text.update,
    route: `/tvshow${url}/${tvShowId}`
  }],
  typography: [{
    color: 'textPrimary',
    text: constantText.tv_show_season_text.seasons
  }]
};