import { constantText } from '../../../_helpers/constants.text';

const breadCrumbs = {
  links: (url,id)=> [
    {
      color: "inherit",
      text: constantText.dashBoard_text,
      route: "/dashboard",
    },
    {
      color: "inherit",
      text: constantText.movie_text,
      route: "/movie",
    },
    {
      color: "inherit",
      text: constantText.movie_view_text,
      route: `/movie${url}/${id}`,
    },
  ],
  typography: [
    {
      color: "textPrimary",
      text: constantText.published_history_breadcrum_text,
      label: "primary",
    },
  ]
};

export  {
  breadCrumbs
}