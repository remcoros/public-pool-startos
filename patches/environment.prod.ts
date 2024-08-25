let path = window.location.origin + window.location.pathname;
path = path.endsWith('/') ? path.slice(0, -1) : path;

export const environment = {
    production: true,
    API_URL: path,
    //STRATUM_URL: path.replace(/^http(s?):\/\//i, "") + ":3333"
    STRATUM_URL: "<StartOS Server IP>:3333"
};