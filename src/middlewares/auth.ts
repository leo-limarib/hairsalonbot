import jwt from "jsonwebtoken";
import express from "express";

let checkToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token: any = req.headers["access-token"];
  if (token) {
    jwt.verify(token, "hairsalonsecret", (err: any, decoded: any) => {
      if (err) return res.status(400).json({ message: "Invalid token." });
      else {
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Auth token not supplied." });
  }
};

export default checkToken;
