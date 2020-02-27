import express from "express";
import checkIfAuthenticated from "../middlewares/firebase-auth-middleware";
import docClient from "../dynamodb-service";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

function createBox(body: any) {
  const { name, amount, frequency } = body;
  const pk = uuidv4();

  var params = {
    TableName: "BoxHandMaster",
    Item: {
      hashKey: pk,
      displayName: name,
      handAmount: amount,
      frequency: frequency
    }
  };

  docClient.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });
}

function updateBox({ boxid, displayName, handAmount, frequency }, cb) {
  var params = {
    TableName: "BoxHandMaster",
    Key: {
      PK: boxid,
      SK: boxid
    },
    UpdateExpression: "set displayName = :d, handAmount = :e, frequency = :p",
    ExpressionAttributeValues: {
      d: displayName,
      e: handAmount,
      p: frequency
    }
  };

  docClient.update(params, cb);
}

router.get("/:boxid", checkIfAuthenticated, function(req, res, next) {
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

router.post("/:boxid", checkIfAuthenticated, function(req, res, next) {
  updateBox(req.params, function(err, data) {
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

router.post("/new", function(req, res, next) {
  createBox(req.body);
});

export default router;
