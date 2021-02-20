import jwt from "jsonwebtoken";
import express from "express";
import HttpException from "../exceptions/HttpException";

let checkToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token: any = req.headers["access-token"];
  let secret: string = process.env.SECRET || "dev-secret";
  if (token) {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) return next(new HttpException(401, "Token não informado."));
      else {
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    return next(new HttpException(401, "Token de autorização não informado."));
  }
};

export default checkToken;
