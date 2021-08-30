const jwt = require("express-jwt");
const { secret } = require("../config");

function getTokenFromHeader(req) {
  if (!req.headers.authorization) {
    return null;
  }

  const [basic, token] = req.headers.authorization.split(" ");

  if (basic !== "Ecommerce") {
    return null;
  }

  return token;
}

const auth = {
  required: jwt({
    secret,
    userProperty: "payload",
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret,
    userProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
