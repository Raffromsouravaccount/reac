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
      route: constantText.dashboard_route
    },
    {
      color: 'inherit',
      text: constantText.video_list_text,
      route: '/video'
    }
  ],
  typography: (type, state) => {
    let text = constantText.video_text;
    if (state && state === 'quick-filing') {
      text = constantText.quick_filing_text;
    }
    return [{
      color: 'textPrimary',
      text
    }]
  }
};

export const quickLinks = [{
    text: constantText.related_content_text,
    permissionKey: "videos",
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
    permissionKey: "videos",
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
    permissionKey: "videos",
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
    permissionKey: "videos",
    permissionSubKey: "publishHistory",
    permissionName: "canView",
    icon: HistoryIcon,
    path: '/published-history-video',
    key: "publishHistory",
    enable: true,
    visible: true
  }
]

export const quickLinksForQuickFiling = [{
    text: constantText.related_content_text,
    permissionKey: "videos",
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
    permissionKey: "videos",
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
    permissionKey: "videos",
    permissionSubKey: "publishHistory",
    permissionName: "canView",
    icon: HistoryIcon,
    path: '/published-history-video',
    key: "publishHistory",
    enable: true,
    visible: true
  }
]