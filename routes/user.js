var express = require("express");
var router = express.Router();
var checkIfAuthenticated = require("../middlewares/firebase-auth-middleware");
var docClient = require("../dynamodb-service");

function updateUser(uid, userParams, cb) {
  var params = {
    TableName: "BoxHandMaster",
    Key: {
      PK: uid,
      SK: uid
    },
    UpdateExpression: "set DisplayName = :d, Email = :e, Photo = :p",
    ExpressionAttributeValues: {
      d: userParams.displayName,
      e: userParams.email,
      p: userParams.photoUrl
    }
  };

  docClient.query(params, cb);
}

function updateBox(boxParams, cb) {
  var params = {
    TableName: "BoxHandMaster",
    Key: {
      PK: boxParams.uid,
      SK: boxParams.uid
    },
    UpdateExpression: "set DisplayName = :d, Email = :e, Photo = :p",
    ExpressionAttributeValues: {
      d: boxParams.displayName,
      e: boxParams.email,
      p: boxParams.photoUrl
    }
  };

  docClient.query(params, cb);
}

router.get("/", checkIfAuthenticated, function(req, res, next) {
  var params = {
    TableName: "BoxHandMaster",
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": req.authId
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

router.post("/", checkIfAuthenticated, function(req, res, next) {
  updateUser(req.authId, req.params, function(err, data) {
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

router.post("/box/new", function(req, res, next) {
  docClient.query(params, function(err, data) {
    if (err) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.send({ data });
    }
  });
});

module.exports = router;
