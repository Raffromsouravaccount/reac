import TranslationIcon from "images/Quick-Links/Qi-Translations.svg";
import HistoryIcon from "images/Quick-Links/Qi-Published-History.svg";
import RelatedContentIcon from "images/Quick-Links/Qi-Related-Content.svg";
import CollectionAssignmentIcon from "images/Quick-Links/Qi-Collection-Assignment.svg";

import {
  constantText
} from "../../../_helpers/constants.text";

export const breadCrumbs = {
  links: (tvShowUrl, seasonUrl, tvShowId, seasonId) => [{
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
  }],
  typography: (type, state) => {
    let text = constantText.tv_show_episode_text.episode
    if (state && state === '2') {
      text = constantText.quick_filing_text;
    } else if (state && state === '3') {
      text = constantText.single_landing_page_text;
    }
    return [{
      color: 'textPrimary',
      text
    }]
  }
};

export const quickLinks = [{
  text: constantText.related_content_text,
  icon: RelatedContentIcon,
  path: '/related-content',
  visible: true
},
{
  text: constantText.translation_text,
  icon: TranslationIcon,
  path: '/translation',
  visible: true
},
{
  text: constantText.collection_assignment_text,
  icon: CollectionAssignmentIcon,
  path: '/collection-assignment',
  visible: false
},
{
  text: constantText.published_history_text,
  icon: HistoryIcon,
  path: '/published-history',
  visible: true
}
]

export const quickLinksForQuickFiling = [{
  text: constantText.related_content_text,
  icon: RelatedContentIcon,
  path: '/related-content',
  visible: true
},
{
  text: constantText.collection_assignment_text,
  icon: CollectionAssignmentIcon,
  path: '/collection-assignment',
  visible: false
},
{
  text: constantText.published_history_text,
  icon: HistoryIcon,
  path: '/published-history',
  visible: true
}
]