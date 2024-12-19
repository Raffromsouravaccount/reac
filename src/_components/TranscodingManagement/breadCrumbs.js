import { constantText } from '../../_helpers/constants.text';

export const breadCrumbs = {
  links: [{
    color: 'inherit',
    text: constantText.dashBoard_text,
    route: '/dashboard'
  }],
  mapcontentLinks: [{
      color: 'inherit',
      text: constantText.dashBoard_text,
      route: '/dashboard'
    },
    {
      color: 'inherit',
      text: constantText.transcoding_text,
      route: '/transcoding'
    },
  ],
  typography: () => [{
    color: 'textPrimary',
    text: constantText.uid_mapping_text
  }],
  historyTypography: () => [{
    color: 'textPrimary',
    text: constantText.transcoding_text
  }]
}