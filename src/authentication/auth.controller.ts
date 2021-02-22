import express from "express";
import jwt from "jsonwebtoken";
import userModel from "./user.model";
import userInterface from "./user.interface";
import bcrypt from "bcrypt";
import refreshTokenMiddleware from "../middlewares/refresh";
import HttpException from "../exceptions/HttpException";

class AuthController {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.signup);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(
      `${this.path}/refreshToken`,
      refreshTokenMiddleware,
      this.refreshToken
    );
  }

  private createTokens = (email: string) => {
    let secret: string = process.env.SECRET || "dev-secret";
    let refSecret: string = process.env.REFRESH_SECRET || "dev-refresh-secret";
    let token = jwt.sign({ email: email }, secret, {
      expiresIn: "24h",
    });
    let refreshToken = jwt.sign({ email: email }, refSecret, {
      expiresIn: "48h",
    });
    return { token, refreshToken };
  };

  private signup = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.body.email && request.body.password && request.body.name) {
      let userExists = await this.user.findOne({ email: request.body.email });
      if (userExists) {
        return next(
          new HttpException(409, "Já existe um usuário cadastrado nesse email.")
        );
      } else {
        let userData: userInterface = request.body;
        const hashedPass = await bcrypt.hash(userData.password, 10);
        await this.user.create({
          ...userData,
          password: hashedPass,
        });
        let tokens = this.createTokens(userData.email);
        response.json({
          message: "Signup successful!",
          token: tokens.token,
          refreshToken: tokens.refreshToken,
        });
      }
    } else {
      return next(
        new HttpException(500, "Por favor, preenche todos os campos.")
      );
    }
  };

  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    //TODO:REFACTOR - Create a proper validation middleware.
    if (request.body.email && request.body.password) {
      let user = await this.user.findOne({ email: request.body.email });
      if (user) {
        let passMatch = bcrypt.compareSync(
          request.body.password,
          user.password
        );
        if (passMatch) {
          let tokens = this.createTokens(user.email);
          response.json({
            message: "Login successful!",
            token: tokens.token,
            refreshToken: tokens.refreshToken,
          });
        } else {
          return next(new HttpException(401, "Email e/ou senha incorretos."));
        }
      } else {
        return next(new HttpException(401, "Email e/ou senha incorretos."));
      }
    } else {
      return next(
        new HttpException(500, "Por favor, preencha todos os campos.")
      );
    }
  };

  private refreshToken = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    let token = this.createTokens(response.locals.decoded.email);
    return response.json({ ...token, message: "Token renovado com sucesso!" });
  };
}

export default AuthController;
