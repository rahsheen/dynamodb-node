import express from "express";
import checkIfAuthenticated from "../middlewares/firebase-auth-middleware";
import docClient from "../dynamodb-service";
import { v4 as uuidv4 } from "uuid";
import { AWSError } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const router = express.Router();

type DocClientCb = (err: AWSError, data: DocumentClient.PutItemOutput) => void;

async function createBox(params: any, userId: string) {
  const boxId = uuidv4();

  const boxParams = {
    TableName: "BoxHandMaster",
    Item: {
      PK: boxId,
      SK: boxId,
      ...params
    }
  };

  const userBoxParams = {
    TableName: "BoxHandMaster",
    Item: {
      PK: userId,
      SK: boxId,
      master: true
    }
  };

  await docClient.put(boxParams).promise();
  await docClient.put(userBoxParams).promise();
  return {
    status: 200,
    data: { ...boxParams.Item, ...userBoxParams.Item }
  };
}

function updateBox(
  { boxid, displayName, handAmount, frequency },
  cb: DocClientCb
) {
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
  updateBox(req.body, function(err, data) {
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
  createBox(req.body, req.authId)
    .then(({status, data}) => res.status(status).send({ data }))
    .catch(e =>
      e.statusCode
        ? res.status(e.statusCode).send(e.message)
        : res.status(500).send(JSON.stringify(e))
    );
});

export default router;
