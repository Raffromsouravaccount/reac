import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const tvShowBreadcrumbUrls = (location) => {
    let tvShowUrl = "/edit"
    if (location?.pathname?.includes("/tvshow/view")) { tvShowUrl = "/view" }
    if (location?.pathname?.includes("/tvshow/quick/edit")) { tvShowUrl = "/quick/edit" }
    if (location?.pathname?.includes("/tvshow/single/edit")) { tvShowUrl = "/single/edit" }
    return { tvShowUrl }
}
export const seasonBreadcrumbUrls = (location) => {
    let { tvShowUrl } = tvShowBreadcrumbUrls(location),
        seasonUrl = ""
    if (location?.pathname?.includes("/season/view")) { seasonUrl = "/view" }
    if (location?.pathname?.includes("/season/quick/edit")) { seasonUrl = "/quick/edit" }
    if (location?.pathname?.includes("/season/single/edit")) { seasonUrl = "/single/edit" }
    return { tvShowUrl, seasonUrl }
}
export const episodeBreadcrumbUrls = (location) => {
    let { tvShowUrl, seasonUrl } = seasonBreadcrumbUrls(location),
        episodeUrl = ""
    if (location?.pathname?.includes("/episode/view")) { episodeUrl = "/view" }
    if (location?.pathname?.includes("/episode/quick")) { episodeUrl = "/quick" }
    if (location?.pathname?.includes("/episode/single")) { episodeUrl = "/single" }
    return { tvShowUrl, seasonUrl, episodeUrl }
}