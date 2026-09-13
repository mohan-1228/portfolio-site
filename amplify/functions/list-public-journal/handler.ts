import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async () => {
  // TABLE_NAME is injected as an environment variable — we wire that up in the next step
  const tableName = process.env.JOURNAL_TABLE_NAME;

  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
      // This is the actual enforcement: no matter what anyone asks for,
      // DynamoDB itself will only ever return rows matching this filter.
      FilterExpression: 'isPublic = :isPublicVal',
      ExpressionAttributeValues: { ':isPublicVal': true },
    })
  );

  return result.Items || [];
};