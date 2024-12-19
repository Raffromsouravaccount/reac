import {
  constantText
} from '../../_helpers/constants.text';
import TranslationIcon from "images/Quick-Links/Qi-Translations.svg";
import HistoryIcon from "images/Quick-Links/Qi-Published-History.svg";
import RelatedContentIcon from "images/Quick-Links/Qi-Related-Content.svg";
import CollectionAssignmentIcon from "images/Quick-Links/Qi-Collection-Assignment.svg";


export const breadCrumbs = {
  links: [{
      color: 'inherit',
      text: constantText.dashBoard_text,
      route: '/dashboard'
    },
    {
      color: 'inherit',
      text: constantText.movie_list_text,
      route: '/movie'
    }
  ],
  typography: (type, state) => {
    let text = constantText.movie_text;
    if (state && state === 'quick-filing') {
      text = constantText.quick_filing_text;
    } else if (state && state === 'single-landing-page') {
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
    permissionKey: "movies",
    permissionSubKey: "relatedContent",
    permissionName: "canUpdate",
    icon: RelatedContentIcon,
    path: '/related-content',
    key: 'relatedContent',
    enable: true,
    visible: true
  },
  {
    text: constantText.translation_text,
    permissionKey: "movies",
    permissionSubKey: "translation",
    permissionName: "canView",
    icon: TranslationIcon,
    path: '/translation',
    key: 'contentTranslations',
    enable: true,
    visible: true
  },
  {
    text: constantText.collection_assignment_text,
    permissionKey: "movies",
    permissionSubKey: "collectionAssignment",
    permissionName: "canUpdate",
    icon: CollectionAssignmentIcon,
    path: '/collection-assignment',
    key: 'collectionAssignment',
    enable: true,
    visible: false
  },
  {
    text: constantText.published_history_text,
    permissionKey: "movies",
    permissionSubKey: "publishHistory",
    permissionName: "canView",
    icon: HistoryIcon,
    path: '/published-history-movie',
    key: "",
    enable: true,
    visible: true
  }
]

export const quickLinksForQuickFiling = [{
    text: constantText.related_content_text,
    permissionKey: "movies",
    permissionSubKey: "relatedContent",
    permissionName: "canUpdate",
    icon: RelatedContentIcon,
    path: '/related-content',
    key: 'relatedContent',
    enable: true,
    visible: true
  },
  {
    text: constantText.collection_assignment_text,
    permissionKey: "movies",
    permissionSubKey: "collectionAssignment",
    permissionName: "canUpdate",
    icon: CollectionAssignmentIcon,
    path: '/collection-assignment',
    key: 'collectionAssignment',
    enable: true,
    visible: false
  },
  {
    text: constantText.published_history_text,
    permissionKey: "movies",
    permissionSubKey: "publishHistory",
    permissionName: "canView",
    icon: HistoryIcon,
    path: '/published-history-movie',
    key: "",
    enable: true,
    visible: true
  }
]