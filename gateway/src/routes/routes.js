import { shortener_service_route } from "./shortener_service_route.js"
import { redirection_service_route } from "./redirection_service_route.js"

const routeMap = {
    'GET': {
        '*': redirection_service_route
    },
    'POST': {
        "*": shortener_service_route
    }
}


export const register_routes = (app) => {
    app.use(async(req, res, next)=>{
        const {method} = req;
        if(method in routeMap){
            const availablePathMap = routeMap[method];
            const fn = availablePathMap['*'];
            await fn(req, res);
        }
        next();
    });
}