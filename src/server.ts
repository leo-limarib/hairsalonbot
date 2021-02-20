import App from "./app";
import AuthController from "./authentication/auth.controller";
require("dotenv").config();

const app = new App([new AuthController()], 34523);

app.listen();
