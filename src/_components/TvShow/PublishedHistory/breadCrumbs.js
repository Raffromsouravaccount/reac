import { constantText } from '../../../_helpers/constants.text';

const breadCrumbs = {
  links: (url, id)=> [
    {
      color: "inherit",
      text: constantText.dashBoard_text,
      route: "/dashboard",
    },
    {
      color: "inherit",
      text: constantText.tv_show_text.title,
      route: "/tvshow",
    },
    {
      color: "inherit",
      text: constantText.tv_show_text.update,
      route: `/tvshow${url}/${id}`,
    },
  ],
  typography: [
    {
      color: "textPrimary",
      text: constantText.published_history_text,
      label: "primary",
    },
  ]
};

export  {
  breadCrumbs
}