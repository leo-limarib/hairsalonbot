import path from "path";
import fs from "fs";
import { Client } from "whatsapp-web.js";
import express from "express";

class WhatsappController {
  public client: any;
  public SESSION_FILE_PATH = path.join(__dirname, "..", "session.json");
  public eventEmitter: any = null;
  public path = "/bot";
  public router = express.Router();

  contructor() {
    console.log("WPP CONSTRUCTOR");
    let sessionCfg = this.loadSessionFile();
    this.client = new Client({ session: sessionCfg });
    this.authenticate();
    this.initializeMessageReceiver();
  }

  private loadSessionFile() {
    if (fs.existsSync(this.SESSION_FILE_PATH)) {
      return require(this.SESSION_FILE_PATH);
    }
  }

  private authenticate() {
    this.client.on("qr", (qr: any) => {
      console.log("Qr code received:", qr);
    });
    this.client.on("authenticated", (session: any) => {
      console.log("Whatsapp authenticated!");
      fs.writeFile(this.SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) console.log(err);
      });
    });
    this.client.on("ready", () => {
      console.log("Whatsapp bot is ready!");
      this.initializeMessageReceiver();
    });
  }

  private initializeMessageReceiver() {
    this.client.on("message", (message: any) => {
      console.log("MENSAGEM RECEBIDA:", message.body);
    });
  }
}

export default WhatsappController;
