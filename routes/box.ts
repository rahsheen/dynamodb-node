import express from "express";
import checkIfAuthenticated from "../middlewares/firebase-auth-middleware";
import docClient from "../dynamodb-service";

const router = express.Router();

function updateBox(boxParams, cb) {
  var params = {
    TableName: "BoxHandMaster",
    Key: {
      PK: boxParams.boxid,
      SK: boxParams.boxid
    },
    UpdateExpression: "set DisplayName = :d, HandAmount = :e, Frequency = :p",
    ExpressionAttributeValues: {
      d: boxParams.displayName,
      e: boxParams.handAmount,
      p: boxParams.frequency
    }
  };

  docClient.query(params, cb);
}

router.get("/:boxid", checkIfAuthenticated, function (req, res, next) {
  var params = {
    TableName: "BoxHandMaster",
    IndexName: "BoxIndex",
    KeyConditionExpression: "Box = :boxid",
    ExpressionAttributeValues: {
      ":boxid": { S: req.boxid }
    },
    ProjectionExpression: "SK, PK",
    ScanIndexForward: false
  };

  docClient.query(params, function (err, data) {
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

router.post("/:boxid", checkIfAuthenticated, function (req, res, next) {
  updateBox(req.params, function (err, data) {
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

router.post("/new", function (req, res, next) {
  docClient.query(req.params, function (err, data) {
    if (err) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.send({ data });
    }
  });
});

export default router;
