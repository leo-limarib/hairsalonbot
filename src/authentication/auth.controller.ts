import express from "express";
import jwt from "jsonwebtoken";
import userModel from "./user.model";
import userInterface from "./user.interface";
import bcrypt from "bcrypt";

class AuthController {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.signup);
  }

  private signup = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    //REFACTOR: Create a validation middleware for new users.
    if (request.body.email && request.body.password && request.body.name) {
      let userExists = await this.user.findOne({ email: request.body.email });
      if (userExists) {
        return response
          .status(409)
          .json({ message: "Já existe um usuário cadastrado nesse email." });
      } else {
        let userData: userInterface = request.body;
        const hashedPass = await bcrypt.hash(userData.password, 10);
        await this.user.create({
          ...userData,
          password: hashedPass,
        });
        let token = jwt.sign({ email: userData.email }, "hairsalonsecret", {
          expiresIn: "24h",
        });
        let refreshToken = jwt.sign(
          { email: request.body.email },
          "hairsalonrefreshsecret",
          {
            expiresIn: "48h",
          }
        );
        response.json({
          message: "Authentication successful!",
          token: token,
          refreshToken: refreshToken,
        });
      }
    } else {
      return response
        .status(500)
        .json({ message: "Por favor, informe todos os campos." });
    }
  };
}

export default AuthController;
