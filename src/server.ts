import App from "./app";
import AuthController from "./authentication/auth.controller";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

const app = new App([new AuthController()], 34523);

app.listen();
