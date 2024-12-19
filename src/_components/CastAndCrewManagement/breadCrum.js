import {
  constantText
} from '../../_helpers/constants.text';
import TranslationIcon from "images/Quick-Links/Qi-Translations.svg";
import HistoryIcon from "images/Quick-Links/Qi-Published-History.svg";

export const breadCrumbs = {
  links: [{
      color: "inherit",
      text: constantText.dashBoard_text,
      route: "/dashboard",
    },
    {
      color: "inherit",
      text: constantText.cast_profile_list,
      route: "/cast",
    },
  ],
  typography: type => [{
    color: "textPrimary",
    text: constantText.profile_details_text,
    label: "primary",
  }]
}

export const quickLinks = [{
    text: constantText.translation_text,
    permissionKey: "cast",
    permissionSubKey: "translation",
    permissionName: "canView",
    icon: TranslationIcon,
    path: '/translation',
    enable: true,
    visible: true
  },
  {
    text: constantText.publishedHistoryText,
    permissionKey: "cast",
    permissionSubKey: "publishHistory",
    permissionName: "canUpdate",
    icon: HistoryIcon,
    path: '/published-history-castcrew',
    enable: true,
    visible: true
  }
];