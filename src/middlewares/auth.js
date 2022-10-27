const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const Authentication = async function (req, res, next) {
  try {

    let tokenWithBearer = req.headers["authorization"];
    if (!tokenWithBearer) {
      return res.status(400).send({ status: false, msg: "token not found" })
    }
    let tokenArray = tokenWithBearer.split(" ");

    let token = tokenArray[1];
    jwt.verify(token, 'project5', (error, response) => {
      if (error) {
        const msg =
          error.message === "jwt expired"
            ? "Token is expired"
            : "Token is invalid";
        return res.status(401).send({ status: false, msg });
      }
      req.userId  = response.userId;
      next();
    });

    
}
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

module.exports = { Authentication }