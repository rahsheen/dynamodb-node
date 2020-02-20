// Load the AWS SDK for Node.js
import AWS from "aws-sdk";

// Set the config
const config = {
  apiVersion: "2012-08-10",
  region: "us-east-1"
};

if (process.env.NODE_ENV !== "production") {
  Object.assign(config, {
    accessKeyId: "abcde",
    secretAccessKey: "abcde",
    endpoint: "http://localhost:8000"
  });
}

AWS.config.update(config);

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

if (process.env.NODE_ENV !== "production") {
  var params = {
    TableName: "BoxHandMaster",
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" }, // Partition key
      { AttributeName: "SK", KeyType: "RANGE" } // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "BoxHandSecondary",
        KeySchema: [
          { AttributeName: "SK", KeyType: "HASH" }, // Sort key
          { AttributeName: "PK", KeyType: "RANGE" } // Partition key
        ],
        Projection: {
          // NonKeyAttributes: ["string"],
          ProjectionType: "KEYS_ONLY"
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      }
    ]
  };

  dynamodb.describeTable({ TableName: "BoxHandMaster" }, function (err, data) {
    if (err) {
      console.log("Error. Gonna create table.", err);
      dynamodb.createTable(params, function (err, data) {
        if (err) {
          console.error(
            "Unable to create table. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log("Created table. Table description.");
        }
      });
    } else {
      console.log("Data", data);
    }
  });
}

export default docClient;
