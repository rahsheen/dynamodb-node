var express = require("express");
var router = express.Router();
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var docClient = new AWS.DynamoDB.DocumentClient();

/* GET box listing. */
// router.get("/", function(req, res, next) {
//   res.send({ stuff: "respond with a resource" });
// });

router.get("/:uid", function(req, res, next) {
  var params = {
    TableName: "BoxHandMaster",
    KeyConditionExpression: "#PK = :pk",
    ExpressionAttributeNames: {
      "#PK": "PK"
    },
    ExpressionAttributeValues: {
      ":pk": req.params.uid
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.send({ data });
    }
  });
});

router.post("/new", function(req, res, next) {
  var params = {
    TableName: "BoxHandMaster",
    KeyConditionExpression: "#PK = :pk",
    ExpressionAttributeNames: {
      "#PK": "PK"
    },
    ExpressionAttributeValues: {
      ":pk": req.params.uid
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.send({ data });
    }
  });
});

module.exports = router;
