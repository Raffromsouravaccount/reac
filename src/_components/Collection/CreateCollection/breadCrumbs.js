import {
  constantText
} from '../../../_helpers/constants.text';
import TranslationIcon from "images/translation.svg";
import HistoryIcon from "images/History.svg";
export const breadCrumbs = {
  links: [{
    color: 'inherit',
    text: constantText.dashBoard_text,
    route: '/dashboard'
  },
  {
    color: 'inherit',
    text: constantText.collection_list,
    route: '/collections'
  }
],
  typography: type=> [{
    color: 'textPrimary',
    text: (type== 'create')? constantText.create_collections_text: (type == 'view') ? constantText.view_collection_text : constantText.update_collections_text
  }]
};

export const quickLinks = [
  {
    text: constantText.translation_text,
    permissionKey: "collections",
    permissionSubKey: "translation",
    permissionName: "canUpdate",
    icon: TranslationIcon,
    path: '/translation',
    visible: true,
    enable:true
  },
  {
    text: constantText.publishedHistoryText,
    permissionKey: "collections",
    permissionSubKey: "publishHistory",
    permissionName: "canUpdate",
    icon: HistoryIcon,
    path: '/published-history-collection',
    visible: true,
    enable:true
  }
]