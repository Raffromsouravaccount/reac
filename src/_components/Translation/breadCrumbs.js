import { constantText } from './../../_helpers/constants.text';

const breadCrumbs = {
  links: (page, mode, mode1, mode2, params)=> {
    if(page === constantText.translations.pages.movie_text) {
      return [
        {
          color: "inherit",
          text: constantText.movie_list_text,
          route: `/movie`,
        },
        {
          color: "inherit",
          text: constantText.update_movie_text,
          route: `/movie/${mode}/${params?.[`${page}Id`]}`,
        },
      ]
    } else if(page === constantText.translations.pages.collection_text) {
      return [
        {
          color: "inherit",
          text: constantText.collection_text,
          route: `/collections`,
        },
        {
          color: "inherit",
          text: constantText.update_collection_text,
          route: `/collection/${mode}/${params?.[`${page}Id`]}`,
        },
      ]
    } else if(page === constantText.translations.pages.cast_text) {
      return [
        {
          color: "inherit",
          text: constantText.cast_profile_list,
          route: `/cast`,
        },
        {
          color: "inherit",
          text: constantText.update_profile,
          route: `/cast/${mode}/${params?.[`${page}Id`]}`,
        },
      ]
    } else if(page === constantText.translations.pages.video_text) {
      return [
        {
          color: "inherit",
          text: constantText.videoConstants.videos,
          route: `/video`,
        },
        {
          color: "inherit",
          text: constantText.videoConstants.updateVideo,
          route: `/video/${mode}/${params?.[`${page}Id`]}`,
        },
      ]
    } else if(page === constantText.translations.pages.tvshow_text) {
      return [
        {
          color: "inherit",
          text: constantText.tv_show_text.title,
          route: `/tvshow`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_text.update,
          route: `/tvshow/${mode}/${params?.[`${page}Id`]}`,
        },
      ]
    } else if(page === constantText.translations.pages.season_text) {
      return [
        {
          color: "inherit",
          text: constantText.tv_show_text.title,
          route: `/tvshow`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_text.update,
          route: `/tvshow/${mode}/${params?.tvshowId}`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_season_text.seasons,
          route: `/tvshow/${mode}/${params?.tvshowId}/season`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_season_text.update,
          route: mode1 ? `/tvshow/${mode}/${params?.tvshowId}/season/${mode1}/${params?.[`${page}Id`]}` : `/tvshow/${mode}/${params?.tvshowId}/season/${params?.[`${page}Id`]}`,
        },
      ]
    } else if(page === constantText.translations.pages.episode_text) {
      return [
        {
          color: "inherit",
          text: constantText.tv_show_text.title,
          route: `/tvshow`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_text.update,
          route: `/tvshow/${mode}/${params?.tvshowId}`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_season_text.seasons,
          route: `/tvshow/${mode}/${params?.tvshowId}/season`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_season_text.update,
          route: mode1 ? `/tvshow/${mode}/${params?.tvshowId}/season/${mode1}/${params?.seasonId}` : `/tvshow/${mode}/${params?.tvshowId}/season/${params?.seasonId}`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_episode_text.episodes,
          route: mode1 ? `/tvshow/${mode}/${params?.tvshowId}/season/${mode1}/${params?.seasonId}/episode` : `/tvshow/${mode}/${params?.tvshowId}/season/${params?.seasonId}/episode`,
        },
        {
          color: "inherit",
          text: constantText.tv_show_episode_text.update,
          route: mode1 ? mode2 ? 
          `/tvshow/${mode}/${params?.tvshowId}/season/${mode1}/${params?.seasonId}/episode/${mode2}/${params?.[`${page}Id`]}`
          : `/tvshow/${mode}/${params?.tvshowId}/season/${mode1}/${params?.seasonId}/episode/${params?.[`${page}Id`]}`
          : mode2 ?
            `/tvshow/${mode}/${params?.tvshowId}/season/${params?.seasonId}/episode/${mode2}/${params?.[`${page}Id`]}`
            : `/tvshow/${mode}/${params?.tvshowId}/season/${params?.seasonId}/episode/${params?.[`${page}Id`]}`,
        },
      ]
    }
  }
};

export  {
  breadCrumbs
}