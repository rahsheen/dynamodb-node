import express from "express";
import checkIfAuthenticated from "../middlewares/firebase-auth-middleware";
import docClient from "../dynamodb-service";

const router = express.Router();

function updateUser(uid, userParams, cb) {
  var params = {
    TableName: "BoxHandMaster",
    Key: {
      PK: uid,
      SK: uid
    },
    UpdateExpression: "set displayName = :d", //, Email = :e, Photo = :p",
    ExpressionAttributeValues: {
      ":d": userParams.displayName
      // ":e": userParams.email,
      // ":p": userParams.photoURL
    },
    ReturnValues: "UPDATED_NEW"
  };

  docClient.update(params, cb);
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
  updateUser(req.authId, req.body, function(err, data) {
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

export default router;
