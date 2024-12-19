import {constantText} from '../../../_helpers/constants.text';

export const breadCrumbs= {
  links: [{
    color: 'inherit',
    text: constantText.role_header_text,
    route: '/roles'
  }],
  typography: path=> [{
    color: 'textPrimary',
    text: (path=='/role/create')? constantText.create_role_button_text: constantText.manage_role_text
  }]
};
