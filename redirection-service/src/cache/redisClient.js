import { createClient } from "redis";
import 'dotenv/config';

const REDIS_URL = process.env.REDIS_URL;

export class RedisCacheClient {
    #client = null;
    constructor(){
    }

    async setup(){
        const config = {
            url: REDIS_URL || "redis://localhost:6379"
        };
        
        this.#client = createClient(config);
         
        this.#client.on("error", (err) => {
                console.log("Redis Client Error", err);
                rej(err);
            })
            .on("ready", ()=>{
                console.log('Redis Cache Connected');
            }).
            on('connect', ()=>{
                console.log('initiating connection')
            })
        await this.#client.connect();
        console.log(this.#client);
    }

    async set(key, value){
        await this.#client.set(key, value);
    }

    async get(key){
        return await this.#client.get(key);
    }
}