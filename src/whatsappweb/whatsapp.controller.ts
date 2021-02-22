import express from "express";
import path from "path";
import fs from "fs";
import { Client } from "whatsapp-web.js";

class WhatsappController {
  private SESSION_FILE = path.join(__dirname, "..", "..", "session.json");
  private client: any;
  private sessionCfg: any;
  public path = "/wpp";
  public router = express.Router();

  constructor() {
    if (fs.existsSync(this.SESSION_FILE)) {
      this.sessionCfg = require(this.SESSION_FILE);
    }
    this.client = new Client({ session: this.sessionCfg });
    this.authenticate();
  }

  private authenticate() {
    this.client.on("qr", (qr: any) => {
      console.log("QR RECEIVED:", qr);
    });
    this.client.on("authenticated", (session: any) => {
      console.log("WPP AUTHENTICATED");
      this.sessionCfg = session;
      fs.writeFile(
        this.SESSION_FILE,
        JSON.stringify(this.sessionCfg),
        (err) => {
          if (err) console.log(err);
        }
      );
    });
    this.client.on("ready", () => {
      console.log("WPP READY");
      this.init();
    });
    this.client.initialize();
  }

  private init() {
    this.client.on("message", (message: any) => {
      console.log("MENSAGEM RECEBIDA", message.body);
    });
  }
}

export default WhatsappController;
