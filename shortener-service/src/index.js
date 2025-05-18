import express from 'express';
import 'dotenv/config';
import { register_middleware } from './middleware.js';
import { register_routes } from './routes/routes.js';
import { DatabaseWrapper } from './database/Database.js';
import { get_machine_id } from './uniqueMachineNumber/getUniqueMachineNumber.js';

const PORT = Number.parseInt(process.env.PORT || '5000', 10);

const app = express();
let currentLocalNumber = 0;

const getNextLocalNumber = () => ++currentLocalNumber;

(async function(){
    const db = new DatabaseWrapper();
    await db.setup();
    const machine_number = await get_machine_id();
    register_middleware(app);
    register_routes(app, {database: db, machine_number: machine_number, getNextLocalNumber: getNextLocalNumber});
    
    app.listen(PORT, ()=>console.log(`Shortner server listening on port ${PORT}`));
})();