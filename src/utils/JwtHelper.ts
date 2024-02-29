//const { sign, verify } = require("jsonwebtoken");

import {sign , verify} from "jsonwebtoken"


const SECRET_KEY = "helloafiqqq"

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    SECRET_KEY
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, SECRET_KEY);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };