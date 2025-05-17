import { get_url } from "./getUrl.js"

export const register_routes = (app, {database}) => {
    app.get('/api/urls/:shortUrl', get_url({database}));
}