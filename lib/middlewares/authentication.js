const jwt = require("jsonwebtoken");
const { buildResponse } = require("../utils/response_util");
const roleUtil = require("../utils/role_util");

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send(buildResponse(false, err, null));
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send(buildResponse(false, "Unauthorized", null));
  }
};

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send(buildResponse(false, err, null));
      }
      if (user.role === roleUtil.ADMIN) {
        req.user = user;
        next();
      } else {
        return res.status(403).send(buildResponse(false, "Unauthorized", null));
      }
    });
  } else {
    return res.status(401).send(buildResponse(false, "Unauthorized", null));
  }
};

module.exports = {authentication, isAdmin};