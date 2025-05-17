import express from 'express';
import 'dotenv/config';
import { register_middleware } from './middleware.js';
import { register_routes } from './routes/routes.js';
import { DatabaseWrapper } from './database/Database.js';

const PORT = Number.parseInt(process.env.PORT || '4000', 10);

const app = express();
const db = new DatabaseWrapper();

register_middleware(app);
register_routes(app, {database: db});


app.listen(PORT, ()=>console.log(`Redirection server listening on port ${PORT}`));