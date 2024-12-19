import { constantText } from '../../../_helpers/constants.text';

const breadCrumbs = {
  links: (tvShowUrl, seasonUrl, episodeUrl, tvShowId, seasonId, episodeId) => [{
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
    route: `/tvshow${tvShowUrl}/${tvShowId}`
  },
  {
    color: 'inherit',
    text: constantText.tv_show_season_text.seasons,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season`
  },
  {
    color: 'inherit',
    text: constantText.tv_show_season_text.update,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}`
  },
  {
    color: 'inherit',
    text: constantText.tv_show_episode_text.episodes,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode`
  },
  {
    color: 'inherit',
    text: constantText.tv_show_episode_text.update,
    route: `/tvshow${tvShowUrl}/${tvShowId}/season${seasonUrl}/${seasonId}/episode${episodeUrl}/${episodeId}`
  }],
  typography: [
    {
      color: "textPrimary",
      text: constantText.collection_assignment_text,
      label: "primary",
    },
  ]
};

export {
  breadCrumbs
}