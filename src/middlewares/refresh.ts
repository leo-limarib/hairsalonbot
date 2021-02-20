import jwt from "jsonwebtoken";
import express from "express";

let refreshToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token: any = req.body.refreshToken;
  let secret: string = process.env.REFRESH_SECRET || "dev-refresh-secret";
  if (token) {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err)
        return res.status(400).json({ message: "Invalid refresh token." });
      else {
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Refresh token not supplied." });
  }
};

export default refreshToken;
