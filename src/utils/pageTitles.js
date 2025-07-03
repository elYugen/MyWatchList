export function getPageTitle(pathname) {
    switch (pathname) {
        case "/settings":
            return "Paramètres";
        case "/anime":
            return "WatchList - Animé";
        case "/anime/tosee":
            return "Mes animés à voir";
        case "/anime/watched":
            return "Mes animés finis";
        case "/anime/inprogress":
            return "Mes animés en cours";
        case "/movie":
            return "WatchList - Films";
        case "/movie/tosee":
            return "Mes films à voir";
        case "/movie/watched":
            return "Mes films finis";
        case "/movie/inprogress":
            return "Mes films en cours";
        case "/serie":
            return "WatchList - Séries"
        case "/serie/tosee":
            return "Mes séries à voir";
        case "/serie/watched":
            return "Mes séries finis";
        case "/serie/inprogress":
            return "Mes séries en cours";

    default:
        return "WatchList";
    }
}
