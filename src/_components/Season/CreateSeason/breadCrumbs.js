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
    },
    {
      color: 'inherit',
      text: constantText.tv_show_season_text.seasons,
      route: `/tvshow${url}/${tvShowId}/season`
    }
  ],
  typography: (type, state) => {
    let text = constantText.tv_show_season_text.season
    if (state && state === 'quickFiling') {
      text = constantText.quick_filing_text;
    } else if (state && state === 'singleLanding') {
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
    text: constantText.tvShowsConstant.episodes,
    icon: EpisodesIcon,
    path: '/episode',
    visible: true
  },
  {
    text: constantText.tv_show_season_text.templates,
    icon: TemplateIcon,
    path: '/template',
    visible: true
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
  text: constantText.tvShowsConstant.episodes,
  icon: EpisodesIcon,
  path: '/episode',
  visible: true
},
{
  text: constantText.tv_show_season_text.templates,
  icon: TemplateIcon,
  path: '/template',
  visible: true
},
{
  text: constantText.published_history_text,
  icon: HistoryIcon,
  path: '/published-history',
  visible: true
}
]