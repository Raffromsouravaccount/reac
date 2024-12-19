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
      text: constantText.video_list_text,
      route: "/video",
    },
    {
      color: "inherit",
      text: constantText.update_video_text,
      route: `/video${url}/${id}`,
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