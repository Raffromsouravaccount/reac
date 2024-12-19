import TranslationIcon from "images/Quick-Links/Qi-Translations.svg";
import HistoryIcon from "images/Quick-Links/Qi-Published-History.svg";
import RelatedContentIcon from "images/Quick-Links/Qi-Related-Content.svg";
import CollectionAssignmentIcon from "images/Quick-Links/Qi-Collection-Assignment.svg";
import EpisodesIcon from "images/Quick-Links/Qi-Episodes.svg";
import TemplateIcon from "images/Quick-Links/Qi-Template.svg";

import {
  constantText
} from "../../../_helpers/constants.text";

export const breadCrumbs = {
  links: (url, seasonUrl, tvShowId, seasonId) => [{
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
  },
  {
    color: 'inherit',
    text: constantText.tv_show_season_text.seasons,
    route: `/tvshow${url}/${tvShowId}/season`
  },
  {
    color: 'inherit',
    text: constantText.tv_show_season_text.update,
    route: `/tvshow${url}/${tvShowId}${seasonUrl}/${seasonId}`
  }
],
  typography: [{
    color: 'textPrimary',
    text: constantText.before_tv_text.before_tv
  }]
};

