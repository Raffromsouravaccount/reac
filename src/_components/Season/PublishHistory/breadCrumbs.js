import { constantText } from '../../../_helpers/constants.text';

const breadCrumbs = {
    links: (tvShowUrl,seasonUrl, id , seasonId) => [
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
            route: `/tvshow${tvShowUrl}/${id}`,
        },
        {
            color: "inherit",
            text: constantText.tv_show_season_text.seasons,
            route: `/tvshow${tvShowUrl}/${id}/season`,
        },
        {
            color: "inherit",
            text: constantText.tv_show_season_text.update,
            route: `/tvshow${tvShowUrl}/${id}/season${seasonUrl}/${seasonId}`,
        }
       
        
    ],
    typography: [{
        color: "textPrimary",
        text: constantText.published_history_text,
        label: "primary",
    }, ]
};

export {
    breadCrumbs
}