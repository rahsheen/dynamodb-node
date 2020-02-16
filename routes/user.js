var express = require("express");
var router = express.Router();
var checkIfAuthenticated = require("../middlewares/firebase-auth-middleware");
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send({ stuff: "respond with a resource" });
});

router.get("/:uid", checkIfAuthenticated, function(req, res, next) {
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
      if (err.statusCode) {
        res.status(err.statusCode).send(err.message);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.send({ data });
    }
  });
});

router.post("/:uid/box/new", function(req, res, next) {
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
