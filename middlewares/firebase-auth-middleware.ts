import admin from "../firebase-service";

function getAuthToken(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
}

function checkIfAuthenticated(req, res, next) {
  getAuthToken(req, res, function () {
    admin
      .auth()
      .verifyIdToken(req.authToken)
      .then(function (userInfo) {
        req.authId = userInfo.uid;
        return next();
      })
      .catch(function (e) {
        return res
          .status(401)
          .send({ error: "You are not authorized to make this request" });
      });
  });
}

export default checkIfAuthenticated;
