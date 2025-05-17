import cors from "cors";
import express from "express";

const middleware_functions_in_order = [
  {
    route: "/",
    fn: () => cors(),
  },
  {
    route: "/",
    fn: () => express.json(),
  },
];

export const register_middleware = (app) => {
  middleware_functions_in_order.forEach(({ route, fn }) => {
    app.use(route, fn());
  });
};
