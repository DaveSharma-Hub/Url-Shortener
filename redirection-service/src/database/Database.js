import { getAWSConfig } from "./utils.js";
import "dotenv/config";
import {
  DynamoDBClient,
  ListTablesCommand,
  GetItemCommand,
  PutItemCommand,
  CreateTableCommand
} from "@aws-sdk/client-dynamodb";

const DYNAMODB_DATABASE = process.env.DYNAMODB_DATABASE || "urldatabase";

export class DatabaseWrapper {
  #client = new DynamoDBClient(getAWSConfig());
  constructor() {
    if (process.env.ENV === "DEVELOPMENT") {
      this.#client.send(new ListTablesCommand()).then((table) => {
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
      });
    }
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
    return response?.Item?.originalUrl?.S;
  }

  async delete(key) {
    
  }
}
