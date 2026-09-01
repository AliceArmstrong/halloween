import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;
const POLL_ID = "main";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}

function parseOption(body) {
  const option = typeof body?.option === "string" ? body.option.trim() : "";
  if (!option || option.length > 64) {
    return null;
  }
  return option;
}

async function getAllVotes() {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "pollId = :pollId",
      ExpressionAttributeValues: {
        ":pollId": POLL_ID
      }
    })
  );

  const votes = (result.Items || []).map((item) => ({
    option: item.option,
    count: item.count || 0
  }));

  votes.sort((a, b) => a.option.localeCompare(b.option));
  return votes;
}

export async function getVotes() {
  try {
    const votes = await getAllVotes();
    return response(200, { votes });
  } catch (error) {
    console.error("getVotes failed", error);
    return response(500, { message: "Failed to fetch votes" });
  }
}

export async function castVote(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : null;
    const option = parseOption(payload);

    if (!option) {
      return response(400, { message: "Invalid option" });
    }

    await db.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          pollId: POLL_ID,
          option
        },
        UpdateExpression: "ADD #count :inc",
        ExpressionAttributeNames: {
          "#count": "count"
        },
        ExpressionAttributeValues: {
          ":inc": 1
        }
      })
    );

    const votes = await getAllVotes();
    return response(200, { votes });
  } catch (error) {
    console.error("castVote failed", error);
    return response(500, { message: "Failed to submit vote" });
  }
}
