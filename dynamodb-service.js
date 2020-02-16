// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

// Set the config
var config = {
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
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

if (process.env.NODE_ENV !== "production") {
  var params = {
    TableName: "BoxHandMaster",
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" }, //Partition key
      { AttributeName: "SK", KeyType: "RANGE" } //Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  dynamodb.createTable(params, function(err, data) {
    if (err) {
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log(
        "Created table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
    }
  });
}

module.exports = docClient;
