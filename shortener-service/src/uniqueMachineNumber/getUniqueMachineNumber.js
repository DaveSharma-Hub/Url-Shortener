import "dotenv/config";
import {
  DynamoDBClient,
  ListTablesCommand,
  PutItemCommand,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb";
import { getAWSConfig } from "../database/utils.js";
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const MACHINE_DYNAMO_TABLE = process.env.MACHINE_DYNAMO_TABLE || "machineunqiuetable";
const MACHINE_TABLE_SHARED_ID = "sharedmachinetable_id";

const setup_machine_client = async() => {
    const client = new DynamoDBClient(getAWSConfig());
    if (process.env.ENV === "DEVELOPMENT") {
        const table = await client.send(new ListTablesCommand());
        const contains = table?.TableNames?.includes(MACHINE_DYNAMO_TABLE);
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
                    {
                        // AttributeDefinition
                        AttributeName: "machineId", // required
                        AttributeType: "S", // required
                    },
                ],
                TableName: MACHINE_DYNAMO_TABLE, // required
                KeySchema: [
                // KeySchema // required
                    {
                        // KeySchemaElement
                        AttributeName: "id", // required
                        KeyType: "HASH", // required
                    },
                    {
                        // KeySchemaElement
                        AttributeName: "machineId", // required
                        KeyType: "RANGE", // required
                    },
                ],
                BillingMode: "PROVISIONED",
                ProvisionedThroughput: {
                    ReadCapacityUnits: 20, // required
                    WriteCapacityUnits: 20, // required
                },
            };
            await client.send(new CreateTableCommand(input));
        }
    }
    return client;
}

export const get_machine_id = async() => {
    const client = await setup_machine_client();
    const docClient = DynamoDBDocumentClient.from(client);

    const queryInput = {
        TableName: MACHINE_DYNAMO_TABLE,
        KeyConditionExpression: 'id = :sharedId',
        ExpressionAttributeValues: {
            ':sharedId': MACHINE_TABLE_SHARED_ID
        },
        ScanIndexForward: false,
        Limit: 1
    };
    const response = await docClient.send(new QueryCommand(queryInput));
    console.log(response);
    const id_string = response?.Items?.[0]?.machineId;
    const id = id_string ? Number.parseInt(id_string, 10) : 0;
    const thisMachineId = id + 1;

    const input = {
      Item: {
        id: {
          S: MACHINE_TABLE_SHARED_ID,
        },
        machineId: {
          S: thisMachineId.toString(),
        },
        timestamp: {
          S: Date.now().toString(),
        },
      },
      TableName: MACHINE_DYNAMO_TABLE,
    };
    const command = new PutItemCommand(input);
    await client.send(command);
    return thisMachineId;
}
