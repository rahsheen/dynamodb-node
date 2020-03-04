import express from "express";
import checkIfAuthenticated from "../middlewares/firebase-auth-middleware";
import docClient from "../dynamodb-service";

const router = express.Router();

function updateUser(uid: string, userParams: object) {
  const params = {
    TableName: "BoxHandMaster",
    Item: {
      PK: uid,
      SK: uid,
      ...userParams
    }
  };

  return docClient.put(params).promise();
}

router.get("/", checkIfAuthenticated, function(req, res, next) {
  const params = {
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
      res.send({ data: data.Items });
    }
  });
});

router.post("/", checkIfAuthenticated, function(req, res, next) {
  updateUser(req.authId, req.body)
    .then(() => res.status(200))
    .catch(err => {
      if (err.statusCode) {
        res.status(err.statusCode).send(err.message);
      } else {
        res.status(500).send(err);
      }
    });
});

export default router;
