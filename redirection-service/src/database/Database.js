import { getAWSConfig } from "./utils.js";
import "dotenv/config";
import {
  DynamoDBClient,
  ListTablesCommand,
  GetItemCommand,
  PutItemCommand,
  CreateTableCommand
} from "@aws-sdk/client-dynamodb";
import { RedisCacheClient } from "../cache/redisClient.js";

const DYNAMODB_DATABASE = process.env.DYNAMODB_DATABASE || "urldatabase";

export class DatabaseWrapper {
  #client = null;
  #redisCache = null;

  constructor() {
    this.#client = new DynamoDBClient(getAWSConfig());
    this.#redisCache = new RedisCacheClient();
  }

  async setup(){
    if (process.env.ENV === "DEVELOPMENT") {
      const table = await this.#client.send(new ListTablesCommand())
        const contains = table?.TableNames?.includes(DYNAMODB_DATABASE);
        if (!contains) {
          const input = {
            // CreateTableInput
            AttributeDefinitions: [
              // AttributeDefinitions // required
              {
                // AttributeDefinition
                AttributeName: "id", // required
                AttributeType: "S", // required
              },
            ],
            TableName: DYNAMODB_DATABASE, // required
            KeySchema: [
              // KeySchema // required
              {
                // KeySchemaElement
                AttributeName: "id", // required
                KeyType: "HASH", // required
              },
            ],
            BillingMode: "PROVISIONED",
            ProvisionedThroughput: {
              ReadCapacityUnits: 20, // required
              WriteCapacityUnits: 20, // required
            },
          };
          this.#client.send(new CreateTableCommand(input));
        }
    }
    await this.#redisCache.setup();
  }

  async add(key, value) {
    const input = {
      Item: {
        id: {
          S: key,
        },
        originalUrl: {
          S: value,
        },
        timestamp: {
          S: Date.now().toString(),
        },
      },
      TableName: DYNAMODB_DATABASE,
    };
    const command = new PutItemCommand(input);
    await this.#client.send(command);
  }

  async get(key) {
    const cachedValue = await this.#redisCache.get(key);
    if(cachedValue){
      console.log('From Cached');
      return cachedValue;
    }
    const input = {
      Key: {
        id: {
          S: key,
        },
      },
      TableName: DYNAMODB_DATABASE,
    };
    const command = new GetItemCommand(input);
    const response = await this.#client.send(command);
    const value = response?.Item?.originalUrl?.S;
     if(value){
      await this.#redisCache.set(key, value);
    }
    return value;
  }

  async delete(key) {

  }
}
