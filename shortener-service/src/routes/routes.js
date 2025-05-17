import { add_url } from "./addUrl.js"

export const register_routes = (app, {database}) => {
    app.post('/api/urls/shorten', add_url({database}));
}