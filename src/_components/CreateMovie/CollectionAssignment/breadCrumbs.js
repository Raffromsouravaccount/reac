import { constantText } from '../../../_helpers/constants.text';

const breadCrumbs = {
  links: (url, action, id)=> [
    {
      color: "inherit",
      text: constantText.dashBoard_text,
      route: "/dashboard",
    },
    {
      color: "inherit",
      text: constantText.movie_list_text,
      route: "/movie",
    },
    {
      color: "inherit",
      text: constantText.update_movie_text,
      route: `${url}/movie${action}/${id}`,
    },
  ],
  typography: [
    {
      color: "textPrimary",
      text: constantText.collection_assignment_text,
      label: "primary",
    },
  ]
};

export  {
  breadCrumbs
}