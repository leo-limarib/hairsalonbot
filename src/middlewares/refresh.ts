import jwt from "jsonwebtoken";
import express from "express";
import HttpException from "../exceptions/HttpException";

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
        return next(new HttpException(400, "Token de renovação inválido."));
      else {
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    return next(new HttpException(401, "Token de renovação não informado."));
  }
};

export default refreshToken;
