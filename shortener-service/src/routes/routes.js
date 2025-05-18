import { add_url } from "./addUrl.js"

export const register_routes = (app, {database, machine_number, getNextLocalNumber}) => {
    app.post('/api/urls/shorten', add_url({database, machine_number, getNextLocalNumber}));
}