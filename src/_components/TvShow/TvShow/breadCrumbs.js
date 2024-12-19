import {
  constantText
} from '../../../_helpers/constants.text';
import TranslationIcon from "images/Quick-Links/Qi-Translations.svg";
import HistoryIcon from "images/Quick-Links/Qi-Published-History.svg";
import RelatedContentIcon from "images/Quick-Links/Qi-Related-Content.svg";
import CollectionAssignmentIcon from "images/Quick-Links/Qi-Collection-Assignment.svg";
import SeasonsIcon from "images/Quick-Links/Qi-Seasons.svg";
import TemplateIcon from "images/Quick-Links/Qi-Template.svg";

export const breadCrumbs = {
  links: [{
      color: 'inherit',
      text: constantText.dashBoard_text,
      route: '/dashboard'
    },
    {
      color: 'inherit',
      text: constantText.tv_show_text.title,
      route: '/tvshow'
    }
  ],
  typography: (type, state) => {
    let text = constantText.tvShowsConstant.tvShow
    if (state && state === 'quick-filing') {
      text = constantText.quick_filing_text;
    } else if (state && state === 'single-landing') {
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
    text: constantText.tv_show_season_text.seasons,
    icon: SeasonsIcon,
    path: '/season',
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
    text: constantText.tv_show_season_text.seasons,
    icon: SeasonsIcon,
    path: '/season',
    visible: true
  },
  {
    text: constantText.published_history_text,
    icon: HistoryIcon,
    path: '/published-history',
    visible: true
  }
]