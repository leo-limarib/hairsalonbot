import express from "express";
import http from "http";
import * as bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: express.Application;
  public port: number;
  public server: any;

  constructor(controllers: any, port: number) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorMiddleware();
  }

  private connectToDatabase() {
    mongoose.connect(`mongodb://localhost:27017/HairSalonBot`);
    console.log(`Connected to mongodb://localhost:27017/HairSalonBot`);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorMiddleware = () => {
    this.app.use(errorMiddleware);
  };

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export default App;
