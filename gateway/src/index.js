import express from 'express';
import 'dotenv/config';
import { register_middleware } from './middleware.js';
import { register_routes } from './routes/routes.js';

const PORT = Number.parseInt(process.env.PORT || '3000', 10);

const app = express();

register_middleware(app);
register_routes(app);

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));